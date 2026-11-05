// ==========================================================================
// StaticStack Local Stats & Analytics Dashboard
// Serves /stats, /stats/login, /stats/logout, /stats/api/adjust
// ==========================================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let geoip = null;
try {
  geoip = require('geoip-lite');
} catch {}

const ROOT_DIR = path.resolve(__dirname, '..');
const VIEWS_CACHE_FILE = path.join(ROOT_DIR, 'asset', 'json', 'tool-views-cache.json');
const IP_VIEWS_FILE = path.join(ROOT_DIR, 'asset', 'json', 'tool-view-ips.json');
const TOOLS_DATA_FILE = path.join(ROOT_DIR, 'asset', 'json', 'tools-data.json');

const STATS_USER = (process.env.STATS_USER || 'e6webcom@gmail.com').toLowerCase().trim();
const STATS_PASSWORD = process.env.STATS_PASSWORD || 'm8!Wc5#Q';
const STATS_SESSION_SECRET = process.env.SESSION_SECRET || 'staticstack_stats_secret_key_892348923';
const COOKIE_NAME = 'staticstack_stats_auth';

const COUNTRY_NAMES = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  DE: 'Germany',
  FR: 'France',
  AU: 'Australia',
  NL: 'Netherlands',
  IN: 'India',
  BR: 'Brazil',
  JP: 'Japan',
  ES: 'Spain',
  IT: 'Italy',
  SE: 'Sweden',
  PL: 'Poland',
  CH: 'Switzerland',
  AT: 'Austria',
  IE: 'Ireland',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  BE: 'Belgium',
  NZ: 'New Zealand',
  SG: 'Singapore',
  KR: 'South Korea',
  MX: 'Mexico',
  ZA: 'South Africa',
  UA: 'Ukraine',
  RO: 'Romania',
  PT: 'Portugal',
  GR: 'Greece',
  CZ: 'Czechia'
};

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const code = countryCode.toUpperCase();
  if (code === 'XX' || code === 'T1' || code === 'ZZ') return '🌐';
  try {
    const codePoints = code.split('').map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌐';
  }
}

function resolveIpLocation(ip, req) {
  // Check Cloudflare headers first if present
  if (req && req.headers && req.headers['cf-ipcountry']) {
    const code = req.headers['cf-ipcountry'].toUpperCase();
    if (code.length === 2 && code !== 'XX') {
      return {
        country: code,
        countryName: COUNTRY_NAMES[code] || code,
        city: req.headers['cf-ipcity'] || '',
        region: req.headers['cf-region'] || '',
        flag: getFlagEmoji(code)
      };
    }
  }

  // Fallback to local geoip-lite offline database
  if (geoip && ip && ip !== '127.0.0.1' && ip !== '::1') {
    try {
      const geo = geoip.lookup(ip);
      if (geo && geo.country) {
        return {
          country: geo.country,
          countryName: COUNTRY_NAMES[geo.country] || geo.country,
          city: geo.city || '',
          region: geo.region || '',
          flag: getFlagEmoji(geo.country)
        };
      }
    } catch {}
  }

  return {
    country: 'Local',
    countryName: 'Local / Private Network',
    city: 'Local',
    region: '',
    flag: '💻'
  };
}

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    });
  }
  return list;
}

function signSession(user) {
  const payload = {
    user: user,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', STATS_SESSION_SECRET).update(body).digest('hex');
  return `${body}.${sig}`;
}

function verifySession(raw) {
  if (!raw || !raw.includes('.')) return null;
  const [body, sig] = raw.split('.', 2);
  const expectedSig = crypto.createHmac('sha256', STATS_SESSION_SECRET).update(body).digest('hex');
  if (sig !== expectedSig) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!data || !data.user || !data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

function isAuthenticated(req) {
  const cookies = parseCookies(req);
  return verifySession(cookies[COOKIE_NAME]);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50000) {
        req.destroy();
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
          resolve(JSON.parse(body || '{}'));
        } else {
          // Form urlencoded
          const params = new URLSearchParams(body);
          resolve(Object.fromEntries(params.entries()));
        }
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function getToolsCatalog() {
  try {
    if (fs.existsSync(TOOLS_DATA_FILE)) {
      return JSON.parse(fs.readFileSync(TOOLS_DATA_FILE, 'utf8'));
    }
  } catch {}
  return [];
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}

function getStatsSummary(req) {
  let viewsCache = {};
  let ipTimestamps = {};
  try {
    if (fs.existsSync(VIEWS_CACHE_FILE)) {
      viewsCache = JSON.parse(fs.readFileSync(VIEWS_CACHE_FILE, 'utf8'));
    }
  } catch {}
  try {
    if (fs.existsSync(IP_VIEWS_FILE)) {
      ipTimestamps = JSON.parse(fs.readFileSync(IP_VIEWS_FILE, 'utf8'));
    }
  } catch {}

  const catalog = getToolsCatalog();
  const itemMap = new Map();

  // 1. Catalog Tools (137)
  catalog.forEach(cat => {
    (cat.tools || []).forEach(t => {
      const key = `htmlstatic-${cat.slug}-${t.slug}`;
      itemMap.set(key, {
        name: t.name,
        slug: t.slug,
        categorySlug: cat.slug,
        categoryTitle: cat.title,
        url: `/tools/${cat.slug}/${t.slug}`,
        iconUrl: `/tools/${cat.slug}/${t.slug}-icon.webp`,
        key: key,
        type: 'tool'
      });
    });
  });

  // 2. Community Forum Hub
  const communityKey = 'htmlstatic-community-hub';
  itemMap.set(communityKey, {
    name: 'Community Forum Hub',
    slug: 'community',
    categorySlug: 'community-forum',
    categoryTitle: 'Community Forum',
    url: '/community/',
    iconUrl: '/asset/img/favicon.svg',
    key: communityKey,
    type: 'community'
  });

  // 3. Community Discussion Topics
  let forumTopics = [
    { id: 3, title: 'Welcome to the StaticStack Announcements Channel!' },
    { id: 4, title: 'If you see a tool that is not in the right category.' },
    { id: 5, title: 'StaticStack Is Growing!' },
    { id: 6, title: 'StaticStack Website Discussion' },
    { id: 7, title: 'StaticStack Introduces Category Hubs: Explore Tools, Resources, and FAQs' }
  ];
  try {
    const forum = require(path.join(ROOT_DIR, 'community', 'forum.js'));
    if (forum.getForumTopicsSync) {
      forumTopics = forum.getForumTopicsSync();
    }
  } catch (e) {}

  forumTopics.forEach(top => {
    const topicKey = `htmlstatic-community-topic-${top.id}`;
    itemMap.set(topicKey, {
      name: `Topic #${top.id}: ${top.title}`,
      slug: `topic-${top.id}`,
      categorySlug: 'community-topics',
      categoryTitle: 'Discussion Topic',
      url: `/community/topic?id=${top.id}`,
      iconUrl: '/asset/img/favicon.svg',
      key: topicKey,
      type: 'topic'
    });
  });

  // 4. Any other topics in viewsCache not yet in itemMap
  for (const k of Object.keys(viewsCache)) {
    if (k.startsWith('htmlstatic-community-topic-') && !itemMap.has(k)) {
      const tid = k.replace('htmlstatic-community-topic-', '');
      itemMap.set(k, {
        name: `Topic #${tid}`,
        slug: `topic-${tid}`,
        categorySlug: 'community-topics',
        categoryTitle: 'Discussion Topic',
        url: `/community/topic?id=${tid}`,
        iconUrl: '/asset/img/favicon.svg',
        key: k,
        type: 'topic'
      });
    }
  }

  // 5. Compute view totals
  let totalViews = 0;
  let toolViewsTotal = 0;
  let communityViewsTotal = 0;
  const allItems = [];

  for (const [key, item] of itemMap.entries()) {
    const v = Number(viewsCache[key]) || 0;
    totalViews += v;
    if (item.type === 'tool') {
      toolViewsTotal += v;
    } else {
      communityViewsTotal += v;
    }
    allItems.push({
      ...item,
      views: v
    });
  }

  // Also include any other stray keys in viewsCache in totalViews
  for (const [key, v] of Object.entries(viewsCache)) {
    if (!itemMap.has(key)) {
      totalViews += Number(v) || 0;
    }
  }

  // Sort descending by views
  allItems.sort((a, b) => {
    if (b.views !== a.views) return b.views - a.views;
    return a.name.localeCompare(b.name);
  });

  // Calculate 24h hits & Country stats from IP logs
  const now = Date.now();
  const past24h = now - 24 * 60 * 60 * 1000;
  let hits24h = 0;
  const uniqueIps24h = new Set();
  const countryCounts = {};
  const recentEvents = [];

  for (const [toolKey, ipDict] of Object.entries(ipTimestamps)) {
    const toolInfo = itemMap.get(toolKey) || { name: toolKey.replace(/^htmlstatic-/, ''), url: '#' };
    for (const [ip, ts] of Object.entries(ipDict || {})) {
      const timeNum = Number(ts) || 0;
      if (timeNum > past24h) {
        hits24h++;
        uniqueIps24h.add(ip);
      }
      const loc = resolveIpLocation(ip, req);
      const cCode = loc.country || 'Other';
      countryCounts[cCode] = (countryCounts[cCode] || 0) + 1;

      recentEvents.push({
        time: timeNum,
        toolName: toolInfo.name,
        toolUrl: toolInfo.url || '#',
        toolKey: toolKey,
        ip: ip,
        loc: loc
      });
    }
  }

  recentEvents.sort((a, b) => b.time - a.time);

  // Format Country list
  const totalIpLogs = Object.values(countryCounts).reduce((a, b) => a + b, 0) || 1;
  const countries = Object.entries(countryCounts)
    .map(([code, count]) => ({
      code,
      name: COUNTRY_NAMES[code] || (code === 'Local' ? 'Local / Internal' : code),
      flag: getFlagEmoji(code),
      count,
      pct: Math.round((count / totalIpLogs) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalViews,
    toolViewsTotal,
    communityViewsTotal,
    totalTools: catalog.reduce((acc, c) => acc + (c.tools || []).length, 0),
    totalCommunityItems: forumTopics.length + 1,
    hits24h,
    uniqueVisitors24h: uniqueIps24h.size,
    countries,
    allItems,
    tools: allItems.filter(i => i.type === 'tool'),
    communityItems: allItems.filter(i => i.type !== 'tool'),
    recentEvents: recentEvents.slice(0, 30)
  };
}

function timeAgo(ms) {
  const diffSec = Math.floor((Date.now() - ms) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

function renderLoginHtml(errorMsg = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Login • StaticStack Stats</title>
  <link rel="icon" type="image/svg+xml" href="/asset/img/favicon.svg">
  <link rel="stylesheet" href="/asset/css/style.css">
  <style>
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-body, #0a0f1d);
      color: var(--text-main, #e2e8f0);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 1.5rem;
      margin: 0;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      background: var(--bg-surface, #111827);
      border: 1px solid var(--border-color, #1f2937);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
    }
    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.65rem;
      margin-bottom: 1.25rem;
      text-decoration: none;
      color: inherit;
    }
    .brand-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #0284c7, #2563eb);
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .login-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.4rem;
      letter-spacing: -0.02em;
      text-align: center;
    }
    .login-subtitle {
      font-size: 0.88rem;
      color: var(--text-muted, #94a3b8);
      margin: 0 0 1.75rem;
      line-height: 1.45;
      text-align: center;
    }
    .login-extra-links {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-muted, #94a3b8);
    }
    .login-link {
      color: var(--text-muted, #94a3b8);
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .login-link:hover {
      color: #0284c7;
      text-decoration: underline;
    }
    .link-divider {
      color: var(--border-color, #334155);
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
      color: var(--text-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .form-input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 1rem;
      background: var(--bg-body, #0a0f1d);
      border: 1px solid var(--border-color, #334155);
      border-radius: 8px;
      color: inherit;
      font-size: 0.95rem;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .form-input:focus {
      outline: none;
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2);
    }
    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: #fff;
      font-weight: 600;
      font-size: 0.95rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: opacity 0.15s ease, transform 0.15s ease;
    }
    .btn-submit:hover {
      opacity: 0.94;
      transform: translateY(-1px);
    }
    .btn-submit:active {
      transform: translateY(0);
    }
    .alert-error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.86rem;
      margin-bottom: 1.25rem;
    }
  </style>
</head>
<body>
  <div class="login-card">
    <a href="/" class="brand-logo" title="Back to StaticStack Homepage">
      <span class="brand-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
      </span>
      <span style="font-weight:700; font-size:1.25rem; letter-spacing:-0.02em;">StaticStack</span>
    </a>

    <h1 class="login-title">Admin Dashboard</h1>
    <p class="login-subtitle">Sign in to view real-time traffic, country analytics, and manage verified tool metrics.</p>

    ${errorMsg ? `<div class="alert-error">${errorMsg}</div>` : ''}

    <form method="POST" action="/stats/login">
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input type="text" name="username" class="form-input" placeholder="Email Address" required autofocus autocomplete="username">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" name="password" class="form-input" placeholder="••••••••" required autocomplete="current-password">
      </div>
      <button type="submit" class="btn-submit">Sign In to Dashboard</button>

      <div class="login-extra-links">
        <a href="https://www.facebook.com/groups/staticshark" target="_blank" rel="noopener noreferrer" class="login-link">Lost password?</a>
        <span class="link-divider">&middot;</span>
        <a href="/" class="login-link">&larr; Back to Homepage</a>
      </div>
    </form>
  </div>
</body>
</html>`;
}

function renderDashboardHtml(data, user) {
  const allItemRows = (data.allItems || []).map((t, idx) => {
    let catBadgeStyle = 'background:rgba(255,255,255,0.06); color:var(--text-main);';
    if (t.type === 'community') {
      catBadgeStyle = 'background:rgba(37,99,235,0.2); color:#60a5fa; border:1px solid rgba(37,99,235,0.4);';
    } else if (t.type === 'topic') {
      catBadgeStyle = 'background:rgba(16,185,129,0.2); color:#34d399; border:1px solid rgba(16,185,129,0.4);';
    }
    return `
      <tr class="stats-item-row" data-type="${t.type}" data-search="${escapeHtml((t.name + ' ' + t.categoryTitle + ' ' + t.key).toLowerCase())}">
        <td style="font-weight:700; color:var(--text-muted); width:40px;">#${idx + 1}</td>
        <td>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <img src="${t.iconUrl}" width="24" height="24" style="border-radius:5px; background:#111; flex-shrink:0; object-fit:contain;" alt="">
            <a href="${t.url}" target="_blank" style="color:var(--text-main); font-weight:600; text-decoration:none;">${escapeHtml(t.name)}</a>
          </div>
        </td>
        <td><span class="badge" style="font-size:0.75rem; padding:0.2rem 0.5rem; border-radius:4px; ${catBadgeStyle}">${escapeHtml(t.categoryTitle)}</span></td>
        <td style="font-weight:700; font-variant-numeric:tabular-nums; font-size:1.05rem;" id="views-val-${t.key}">${t.views.toLocaleString()}</td>
        <td style="text-align:right;">
          <button onclick="promptAdjust('${t.key}', '${escapeJs(t.name)}', ${t.views})" class="btn-sm-action">Adjust</button>
        </td>
      </tr>
    `;
  }).join('');

  const countryRows = data.countries.slice(0, 10).map(c => `
    <tr>
      <td style="width:32px; font-size:1.3rem;">${c.flag}</td>
      <td style="font-weight:600;">${c.name}</td>
      <td style="font-variant-numeric:tabular-nums; font-weight:700; text-align:right;">${c.count}</td>
      <td style="width:120px; padding-left:1rem;">
        <div style="background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden;">
          <div style="background:#0284c7; height:100%; width:${c.pct}%;"></div>
        </div>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:1.5rem;">No country data recorded yet.</td></tr>`;

  const recentRows = data.recentEvents.slice(0, 15).map(ev => `
    <tr>
      <td style="color:var(--text-muted); font-size:0.82rem; white-space:nowrap;">${timeAgo(ev.time)}</td>
      <td style="font-weight:600;"><a href="${ev.toolUrl}" target="_blank" style="color:inherit; text-decoration:none;">${ev.toolName}</a></td>
      <td style="font-family:monospace; font-size:0.85rem; color:var(--text-muted);">${ev.ip}</td>
      <td style="white-space:nowrap;">${ev.loc.flag} ${ev.loc.countryName}${ev.loc.city && ev.loc.city !== 'Local' ? ` <span style="color:var(--text-muted); font-size:0.8rem;">(${ev.loc.city})</span>` : ''}</td>
    </tr>
  `).join('') || `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:1.5rem;">No recent hit events yet.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Analytics & Traffic • StaticStack</title>
  <link rel="icon" type="image/svg+xml" href="/asset/img/favicon.svg">
  <link rel="stylesheet" href="/asset/css/style.css">
  <style>
    :root {
      --bg-body: #0a0f1d;
      --bg-surface: #111827;
      --border-color: #1f2937;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }
    body {
      background: var(--bg-body);
      color: var(--text-main);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
    }
    .stats-header {
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .stats-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .kpi-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
    }
    .kpi-label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.35rem;
    }
    .kpi-value {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      font-variant-numeric: tabular-nums;
    }
    .kpi-sub {
      font-size: 0.8rem;
      color: #10b981;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 960px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }
    .panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
    }
    .panel-header {
      padding: 1.15rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .panel-title {
      font-size: 1.05rem;
      font-weight: 700;
      margin: 0;
    }
    .stats-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .stats-table th {
      padding: 0.75rem 1.5rem;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-color);
      background: rgba(0,0,0,0.15);
    }
    .stats-table td {
      padding: 0.85rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 0.9rem;
    }
    .stats-table tr:hover td {
      background: rgba(255,255,255,0.02);
    }
    .btn-sm-action {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      color: #fff;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .btn-sm-action:hover {
      background: #0284c7;
      border-color: #0284c7;
    }
    .logout-btn {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      transition: color 0.15s ease, border-color 0.15s ease;
    }
    .logout-btn:hover {
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.4);
    }
    .badge-ip-rule {
      font-size: 0.75rem;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }
    .stats-filter-bar {
      padding: 0.85rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      background: rgba(0,0,0,0.1);
    }
    .stats-search-input {
      background: var(--bg-body);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      font-size: 0.85rem;
      min-width: 260px;
      flex-grow: 1;
      max-width: 360px;
    }
    .stats-search-input:focus {
      outline: none;
      border-color: #0284c7;
    }
    .stats-tabs {
      display: flex;
      gap: 0.35rem;
      background: rgba(0,0,0,0.2);
      padding: 3px;
      border-radius: 8px;
    }
    .stats-tab {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .stats-tab:hover {
      color: #fff;
    }
    .stats-tab.active {
      background: #0284c7;
      color: #fff;
    }
  </style>
</head>
<body>
  <header class="stats-header">
    <div style="display:flex; align-items:center; gap:0.75rem;">
      <a href="/" target="_blank" style="display:flex; align-items:center; gap:0.6rem; text-decoration:none; color:inherit;">
        <span style="width:32px; height:32px; background:linear-gradient(135deg,#0284c7,#2563eb); border-radius:8px; display:inline-flex; align-items:center; justify-content:center; color:#fff;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </span>
        <span style="font-weight:700; font-size:1.1rem;">StaticStack</span>
      </a>
      <span style="color:var(--text-muted);">/</span>
      <span style="font-weight:600; font-size:0.95rem; color:#0284c7;">Stats &amp; Traffic</span>
      <span class="badge-ip-rule">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        1 View / Day / IP
      </span>
    </div>

    <div style="display:flex; align-items:center; gap:1rem;">
      <span style="font-size:0.85rem; color:var(--text-muted);">${user}</span>
      <a href="/stats/logout" class="logout-btn">Log Out</a>
    </div>
  </header>

  <main class="stats-container">
    <!-- Top KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Total Verified Views</div>
        <div class="kpi-value" id="kpi-total-views">${data.totalViews.toLocaleString()}</div>
        <div class="kpi-sub">Tools + Community Hub + Topics</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Catalog Tool Views</div>
        <div class="kpi-value">${data.toolViewsTotal.toLocaleString()}</div>
        <div class="kpi-sub">${data.totalTools} tools across 27 categories</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Community Views</div>
        <div class="kpi-value">${data.communityViewsTotal.toLocaleString()}</div>
        <div class="kpi-sub">${data.totalCommunityItems} forum &amp; discussion topics</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">24h Unique Hits</div>
        <div class="kpi-value">${data.hits24h.toLocaleString()}</div>
        <div class="kpi-sub">${data.uniqueVisitors24h} unique IPs today</div>
      </div>
    </div>

    <!-- Main Grid: Tools/Community Controller + Country Leaderboard -->
    <div class="dashboard-grid">
      <!-- All Tracked Items -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Tracked Catalog &amp; Community Views</h2>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">Adjust any tool or community topic view count instantly.</div>
          </div>
          <span style="font-size:0.8rem; color:var(--text-muted);">${data.allItems.length} tracked items</span>
        </div>
        <div class="stats-filter-bar">
          <div class="stats-tabs">
            <button type="button" class="stats-tab active" data-filter="all" onclick="filterStatsType('all', this)">All (${data.allItems.length})</button>
            <button type="button" class="stats-tab" data-filter="tool" onclick="filterStatsType('tool', this)">Tools (${data.tools.length})</button>
            <button type="button" class="stats-tab" data-filter="community" onclick="filterStatsType('community', this)">Community &amp; Topics (${data.communityItems.length})</button>
          </div>
          <input type="text" id="stats-search-input" class="stats-search-input" placeholder="Search tool, topic, or category..." oninput="filterStatsItems()">
        </div>
        <div style="overflow-x:auto; max-height:680px; overflow-y:auto;">
          <table class="stats-table">
            <thead style="position:sticky; top:0; z-index:10;">
              <tr>
                <th>Rank</th>
                <th>Item / Title</th>
                <th>Category</th>
                <th>Views</th>
                <th style="text-align:right;">Action</th>
              </tr>
            </thead>
            <tbody id="stats-items-tbody">
              ${allItemRows}
              <tr id="stats-no-match-row" style="display:none;">
                <td colspan="5" style="text-align:center; color:var(--text-muted); padding:2rem;">No matching tools or topics found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Country Breakdown -->
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Visitor Countries</h2>
          <span style="font-size:0.8rem; color:var(--text-muted);">Local GeoIP</span>
        </div>
        <div style="overflow-x:auto;">
          <table class="stats-table">
            <thead>
              <tr>
                <th colspan="2">Country</th>
                <th style="text-align:right;">Hits</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              ${countryRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Recent Activity Stream -->
    <div class="panel">
      <div class="panel-header">
        <h2 class="panel-title">Recent Visitor Activity</h2>
        <span style="font-size:0.8rem; color:var(--text-muted);">Strict IP rate-limited logs</span>
      </div>
      <div style="overflow-x:auto;">
        <table class="stats-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Tool Viewed</th>
              <th>Visitor IP</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            ${recentRows}
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <script>
    let currentTypeFilter = 'all';

    function filterStatsType(type, btn) {
      currentTypeFilter = type;
      document.querySelectorAll('.stats-tab').forEach(el => el.classList.remove('active'));
      if (btn) btn.classList.add('active');
      filterStatsItems();
    }

    function filterStatsItems() {
      const q = (document.getElementById('stats-search-input')?.value || '').toLowerCase().trim();
      const rows = document.querySelectorAll('.stats-item-row');
      let visibleCount = 0;
      rows.forEach(r => {
        const itemType = r.getAttribute('data-type');
        const searchData = r.getAttribute('data-search') || '';
        const matchesType = (currentTypeFilter === 'all') ||
          (currentTypeFilter === 'tool' && itemType === 'tool') ||
          (currentTypeFilter === 'community' && itemType !== 'tool');
        const matchesSearch = !q || searchData.includes(q);
        if (matchesType && matchesSearch) {
          r.style.display = '';
          visibleCount++;
        } else {
          r.style.display = 'none';
        }
      });
      const noMatchEl = document.getElementById('stats-no-match-row');
      if (noMatchEl) {
        noMatchEl.style.display = visibleCount === 0 ? '' : 'none';
      }
    }

    function promptAdjust(key, name, currentViews) {
      const input = prompt('Adjust view count for ' + name + ':\\n\\nEnter new count (currently ' + currentViews + '):', currentViews);
      if (input === null) return;
      const val = parseInt(input.trim(), 10);
      if (isNaN(val) || val < 0) {
        alert('Please enter a valid positive number.');
        return;
      }
      fetch('/stats/api/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key, views: val })
      })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          const el = document.getElementById('views-val-' + key);
          if (el) el.textContent = val.toLocaleString();
          alert('Successfully updated ' + name + ' to ' + val.toLocaleString() + ' views! Static pages are rebuilding in the background.');
        } else {
          alert('Failed to update views: ' + (res.error || 'Unknown error'));
        }
      })
      .catch(err => alert('Network error: ' + err.message));
    }
  </script>
</body>
</html>`;
}

async function handleStats(req, res, pathname, query) {
  // 1. Logout
  if (pathname === '/stats/logout') {
    res.writeHead(302, {
      'Set-Cookie': `${COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
      'Location': '/stats'
    });
    res.end();
    return true;
  }

  // 2. Login POST
  if (pathname === '/stats/login' && req.method === 'POST') {
    const body = await readBody(req);
    const userIn = (body.username || '').toLowerCase().trim();
    const passIn = body.password || '';

    if (userIn === STATS_USER && passIn === STATS_PASSWORD) {
      const token = signSession(userIn);
      res.writeHead(302, {
        'Set-Cookie': `${COOKIE_NAME}=${token}; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; SameSite=Lax`,
        'Location': '/stats'
      });
      res.end();
      return true;
    } else {
      res.writeHead(401, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderLoginHtml('Invalid username or password. Please try again.'));
      return true;
    }
  }

  // Check authentication
  const auth = isAuthenticated(req);
  if (!auth) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderLoginHtml());
    return true;
  }

  // 3. API: Adjust Views
  if (pathname === '/stats/api/adjust' && req.method === 'POST') {
    const body = await readBody(req);
    const key = (body.key || '').trim();
    const views = parseInt(body.views, 10);

    if (!key || isNaN(views) || views < 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid key or views count' }));
      return true;
    }

    try {
      let viewsCache = {};
      if (fs.existsSync(VIEWS_CACHE_FILE)) {
        viewsCache = JSON.parse(fs.readFileSync(VIEWS_CACHE_FILE, 'utf8'));
      }
      viewsCache[key] = views;
      fs.writeFileSync(VIEWS_CACHE_FILE, JSON.stringify(viewsCache, null, 2), 'utf8');

      // Update in-memory forum cache & top tools immediately if running
      if (global.__staticstack_all_tool_views) {
        global.__staticstack_all_tool_views[key] = views;
      }
      try {
        const forum = require(path.join(ROOT_DIR, 'community', 'forum.js'));
        if (forum.updateToolView) {
          forum.updateToolView(key, views);
        }
      } catch (fe) {}

      // Recompile static pages (index.html, tool pages, etc.) so static files match live data
      try {
        const { fork } = require('child_process');
        const child = fork(path.join(ROOT_DIR, 'generate-pages.js'), [], {
          stdio: 'ignore'
        });
        child.unref();
      } catch (ge) {}

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, key, views }));
      return true;
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
      return true;
    }
  }

  // 4. API: Live Data JSON
  if (pathname === '/stats/api/data') {
    const summary = getStatsSummary(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(summary));
    return true;
  }

  // 5. Render Main Dashboard
  const summary = getStatsSummary(req);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(renderDashboardHtml(summary, auth.user));
  return true;
}

module.exports = {
  handleStats,
  getStatsSummary
};

