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

  // Calculate 24h hits, 14-day trend, hourly sparkline, heatmap & Country stats from IP logs
  const now = Date.now();
  const past24h = now - 24 * 60 * 60 * 1000;
  let hits24h = 0;
  const uniqueIps24h = new Set();
  const countryCounts = {};
  const recentEvents = [];
  const active24hMap = {};

  // 14-day daily buckets (oldest -> newest)
  const dayBuckets = {};
  const dayOrder = [];
  for (let d = 13; d >= 0; d--) {
    const dt = new Date(now - d * 86400000);
    const key = dt.toISOString().slice(0, 10);
    const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dayBuckets[key] = 0;
    dayOrder.push({ key, label });
  }

  // 24-hour buckets (oldest -> newest)
  const hourly24h = new Array(24).fill(0);

  // 7 days (0=Sun..6=Sat) x 6 4-hour slots
  const heatmap = Array.from({ length: 7 }, () => new Array(6).fill(0));

  for (const [toolKey, ipDict] of Object.entries(ipTimestamps)) {
    const toolInfo = itemMap.get(toolKey) || { name: toolKey.replace(/^htmlstatic-/, ''), url: '#' };
    for (const [ip, ts] of Object.entries(ipDict || {})) {
      const timeNum = Number(ts) || 0;
      if (timeNum > past24h) {
        hits24h++;
        uniqueIps24h.add(ip);
        if (!active24hMap[toolKey]) {
          active24hMap[toolKey] = { name: toolInfo.name, url: toolInfo.url || '#', count: 0 };
        }
        active24hMap[toolKey].count++;
        const hourIdx = Math.min(23, Math.max(0, 23 - Math.floor((now - timeNum) / 3600000)));
        hourly24h[hourIdx]++;
      }
      if (timeNum > 0) {
        const dt = new Date(timeNum);
        const dayKey = dt.toISOString().slice(0, 10);
        if (dayBuckets[dayKey] !== undefined) {
          dayBuckets[dayKey]++;
        }
        const dow = dt.getDay();
        const slot = Math.floor(dt.getHours() / 4);
        if (heatmap[dow] && heatmap[dow][slot] !== undefined) {
          heatmap[dow][slot]++;
        }
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

  const dailySeries = dayOrder.map(d => ({ label: d.label, count: dayBuckets[d.key] || 0 }));
  const topActive24h = Object.values(active24hMap).sort((a, b) => b.count - a.count).slice(0, 5);

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
    totalCategories: catalog.length,
    totalCommunityItems: forumTopics.length + 1,
    hits24h,
    uniqueVisitors24h: uniqueIps24h.size,
    dailySeries,
    hourly24h,
    topActive24h,
    heatmap,
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
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
  <meta name="googlebot" content="noindex, nofollow">
  <title>Admin Login • StaticStack Stats</title>
  <link rel="icon" type="image/svg+xml" href="/asset/img/favicon.svg">
  <link rel="stylesheet" href="/asset/css/style.css">
  <style>
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      color: #0f172a;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 1.5rem;
      margin: 0;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.1);
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
      color: #64748b;
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
      color: #64748b;
    }
    .login-link {
      color: #64748b;
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .login-link:hover {
      color: #2563eb;
      text-decoration: underline;
    }
    .link-divider {
      color: #cbd5e1;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .form-input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      color: #0f172a;
      font-size: 0.95rem;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .form-input:focus {
      outline: none;
      border-color: #2563eb;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
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
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
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

function renderDonutPieSvg(slices, centerLabel, centerValue) {
  const size = 148;
  const cx = 74;
  const cy = 74;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const total = slices.reduce((sum, s) => sum + (Number(s.value) || 0), 0);

  let segmentsHtml = '';
  if (total <= 0) {
    segmentsHtml = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="20"/>`;
  } else {
    let offset = 0;
    segmentsHtml = slices.filter(s => s.value > 0).map(s => {
      const len = (s.value / total) * circ;
      const dash = `${len.toFixed(2)} ${(circ - len).toFixed(2)}`;
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="20" stroke-dasharray="${dash}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"><title>${escapeHtml(s.label)}: ${s.value.toLocaleString()} (${Math.round((s.value / total) * 100)}%)</title></circle>`;
      offset += len;
      return seg;
    }).join('');
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="flex-shrink:0;" role="img" aria-label="${escapeHtml(centerLabel)}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f0f0f1" stroke-width="20"/>
    ${segmentsHtml}
    <text x="${cx}" y="${cy - 3}" text-anchor="middle" fill="#1d2327" font-size="18" font-weight="800">${escapeHtml(String(centerValue))}</text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="#646970" font-size="10.5" font-weight="600">${escapeHtml(centerLabel)}</text>
  </svg>`;
}

function renderLegendHtml(slices) {
  const total = slices.reduce((sum, s) => sum + (Number(s.value) || 0), 0) || 1;
  return slices.map(s => {
    const pct = Math.round(((Number(s.value) || 0) / total) * 100);
    return `<div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem; font-size:0.8rem; padding:0.25rem 0;">
      <span style="display:flex; align-items:center; gap:0.45rem; min-width:0; color:#1d2327;">
        <span style="width:10px; height:10px; border-radius:2px; background:${s.color}; flex-shrink:0;"></span>
        <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(s.label)}</span>
      </span>
      <span style="font-weight:700; font-variant-numeric:tabular-nums; color:#3c434a; white-space:nowrap;">${(Number(s.value) || 0).toLocaleString()} <span style="color:#646970; font-weight:500;">(${pct}%)</span></span>
    </div>`;
  }).join('');
}

function renderAreaLineChartSvg(series) {
  const pts = series && series.length ? series : [{ label: 'Today', count: 0 }];
  const W = 680;
  const H = 190;
  const padL = 34;
  const padR = 14;
  const padT = 16;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = Math.max(4, ...pts.map(p => p.count || 0));

  const coords = pts.map((p, i) => {
    const x = pts.length === 1 ? padL + innerW / 2 : padL + (i / (pts.length - 1)) * innerW;
    const y = padT + innerH - ((p.count || 0) / maxVal) * innerH;
    return { x, y, label: p.label, count: p.count || 0 };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padT + innerH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => {
    const y = padT + innerH - f * innerH;
    const val = Math.round(f * maxVal);
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="#e2e8f0" stroke-dasharray="3 3" stroke-width="1"/>
      <text x="${padL - 6}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" fill="#94a3b8" font-size="10">${val}</text>`;
  }).join('');

  const xLabels = coords.filter((_, i) => i === 0 || i === coords.length - 1 || i % 3 === 0).map(c =>
    `<text x="${c.x.toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="#94a3b8" font-size="10">${escapeHtml(c.label)}</text>`
  ).join('');

  const dots = coords.map(c =>
    `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="3.5" fill="#ffffff" stroke="#2563eb" stroke-width="2"><title>${escapeHtml(c.label)}: ${c.count} hits</title></circle>`
  ).join('');

  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%; height:auto; display:block;" role="img" aria-label="14-Day Views Trend">
    <defs>
      <linearGradient id="area-blue-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2563eb" stop-opacity="0.24"/>
        <stop offset="100%" stop-color="#2563eb" stop-opacity="0.01"/>
      </linearGradient>
    </defs>
    ${gridLines}
    <path d="${areaPath}" fill="url(#area-blue-grad)"/>
    <path d="${linePath}" fill="none" stroke="#2563eb" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
    ${xLabels}
  </svg>`;
}

function renderHeatmapHtml(heatmap) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const slots = ['12a', '4a', '8a', '12p', '4p', '8p'];
  const grid = Array.isArray(heatmap) && heatmap.length === 7 ? heatmap : Array.from({ length: 7 }, () => new Array(6).fill(0));
  let maxCell = 1;
  grid.forEach(row => row.forEach(v => { if (v > maxCell) maxCell = v; }));

  const rowsHtml = slots.map((slotLabel, sIdx) => {
    const cells = days.map((dLabel, dIdx) => {
      const val = (grid[dIdx] && grid[dIdx][sIdx]) || 0;
      const ratio = val / maxCell;
      let bg = '#eef2ff';
      if (val > 0) {
        if (ratio >= 0.75) bg = '#1d4ed8';
        else if (ratio >= 0.45) bg = '#2563eb';
        else if (ratio >= 0.2) bg = '#60a5fa';
        else bg = '#bfdbfe';
      }
      return `<div title="${dLabel} ${slotLabel}: ${val} hits" style="background:${bg}; height:22px; border-radius:3px;"></div>`;
    }).join('');
    return `<div style="display:grid; grid-template-columns: 32px repeat(7, 1fr); gap:4px; align-items:center; margin-bottom:4px;">
      <span style="font-size:0.7rem; color:#64748b; text-align:right; padding-right:4px;">${slotLabel}</span>
      ${cells}
    </div>`;
  }).join('');

  const headerRow = `<div style="display:grid; grid-template-columns: 32px repeat(7, 1fr); gap:4px; margin-top:6px;">
    <span></span>${days.map(d => `<span style="font-size:0.7rem; color:#64748b; text-align:center;">${d}</span>`).join('')}
  </div>`;

  return `${rowsHtml}${headerRow}`;
}

function renderDashboardHtml(data, user) {
  // 1. Traffic Split Pie (Tools vs Community)
  const splitSlices = [
    { label: 'Catalog Tools', value: data.toolViewsTotal || 0, color: '#2271b1' },
    { label: 'Community & Topics', value: data.communityViewsTotal || 0, color: '#00a32a' }
  ];

  // 2. Category Share Pie (Top 5 categories + Other)
  const catMap = {};
  (data.tools || []).forEach(t => {
    const cat = t.categoryTitle || 'Uncategorized';
    catMap[cat] = (catMap[cat] || 0) + (Number(t.views) || 0);
  });
  const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const catPalette = ['#2271b1', '#3858e9', '#00a32a', '#dba617', '#d63638', '#8c8f94'];
  const catSlices = sortedCats.slice(0, 5).map(([label, value], i) => ({
    label,
    value,
    color: catPalette[i]
  }));
  const otherCatViews = sortedCats.slice(5).reduce((sum, [, v]) => sum + v, 0);
  if (otherCatViews > 0) {
    catSlices.push({ label: 'Other Categories', value: otherCatViews, color: catPalette[5] });
  }

  // 3. Top 8 Tools Horizontal Bar Infographic
  const topTools = (data.tools || []).slice(0, 8);
  const maxToolViews = Math.max(1, ...topTools.map(t => Number(t.views) || 0));
  const topToolsBarsHtml = topTools.map((t, idx) => {
    const pct = Math.max(3, Math.round(((Number(t.views) || 0) / maxToolViews) * 100));
    return `<div style="margin-bottom:0.55rem;">
      <div style="display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:0.2rem; gap:0.5rem;">
        <a href="${t.url}" target="_blank" style="color:#1d2327; font-weight:600; text-decoration:none; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${idx + 1}. ${escapeHtml(t.name)}</a>
        <span style="font-weight:700; font-variant-numeric:tabular-nums; color:#2271b1; flex-shrink:0;">${(Number(t.views) || 0).toLocaleString()}</span>
      </div>
      <div style="background:#f0f0f1; height:8px; border-radius:4px; overflow:hidden;">
        <div style="background:linear-gradient(90deg, #2271b1 0%, #72aee6 100%); height:100%; width:${pct}%; border-radius:4px;"></div>
      </div>
    </div>`;
  }).join('') || `<div style="color:#646970; font-size:0.85rem;">No tool views recorded yet.</div>`;

  // 4. Country Share Pie (Top 4 + Other)
  const countryPalette = ['#2271b1', '#00a32a', '#dba617', '#d63638', '#8c8f94'];
  const countrySlices = (data.countries || []).slice(0, 4).map((c, i) => ({
    label: c.name,
    value: c.count,
    color: countryPalette[i]
  }));
  const otherCountries = (data.countries || []).slice(4).reduce((sum, c) => sum + c.count, 0);
  if (otherCountries > 0) {
    countrySlices.push({ label: 'Other', value: otherCountries, color: countryPalette[4] });
  }
  const totalCountryHits = (data.countries || []).reduce((sum, c) => sum + c.count, 0);

  // 5. Hourly 24h Sparkline & Active Pages for the Blue Live Card
  const hourlyArr = Array.isArray(data.hourly24h) && data.hourly24h.length === 24 ? data.hourly24h : new Array(24).fill(0);
  const maxHour = Math.max(1, ...hourlyArr);
  const hourlySparkHtml = hourlyArr.map((cnt, idx) => {
    const hPct = Math.max(12, Math.round((cnt / maxHour) * 100));
    return `<div title="${23 - idx}h ago: ${cnt} hits" style="flex:1; height:${hPct}%; background:rgba(255,255,255,${cnt > 0 ? '0.88' : '0.28'}); border-radius:2px 2px 0 0;"></div>`;
  }).join('');

  const topActive24hHtml = (data.topActive24h || []).map(item => `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.14); font-size:0.8rem;">
      <a href="${item.url}" target="_blank" style="color:#ffffff; text-decoration:none; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(item.name)}</a>
      <span style="font-weight:700; font-variant-numeric:tabular-nums; color:#e0f2fe;">${item.count}</span>
    </div>
  `).join('') || `<div style="font-size:0.8rem; color:rgba(255,255,255,0.75); padding:0.5rem 0;">No hits recorded in the last 24h.</div>`;

  const allItemRows = (data.allItems || []).map((t, idx) => {
    let catBadgeStyle = 'background:#f1f5f9; color:#334155; border:1px solid #e2e8f0;';
    if (t.type === 'community') {
      catBadgeStyle = 'background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe;';
    } else if (t.type === 'topic') {
      catBadgeStyle = 'background:#ecfdf5; color:#059669; border:1px solid #a7f3d0;';
    }
    return `
      <tr class="stats-item-row" data-type="${t.type}" data-search="${escapeHtml((t.name + ' ' + t.categoryTitle + ' ' + t.key).toLowerCase())}">
        <td style="font-weight:700; color:var(--text-muted); width:40px;">#${idx + 1}</td>
        <td>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <img src="${t.iconUrl}" width="24" height="24" style="border-radius:5px; background:#f8fafc; border:1px solid #e2e8f0; flex-shrink:0; object-fit:contain;" alt="">
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
        <div style="background:#e2e8f0; height:6px; border-radius:3px; overflow:hidden;">
          <div style="background:#2563eb; height:100%; width:${c.pct}%;"></div>
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
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
  <meta name="googlebot" content="noindex, nofollow">
  <title>Analytics & Traffic • StaticStack</title>
  <link rel="icon" type="image/svg+xml" href="/asset/img/favicon.svg">
  <link rel="stylesheet" href="/asset/css/style.css">
  <style>
    :root {
      --bg-body: #edf2f9;
      --bg-surface: #ffffff;
      --border-color: #e2e8f0;
      --border-soft: #eef2f7;
      --text-main: #1e293b;
      --text-muted: #64748b;
      --wp-blue: #2563eb;
      --wp-blue-hover: #1d4ed8;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg-body);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      margin: 0;
      padding: 0;
    }
    /* Clean Top Bar */
    .wp-adminbar {
      background: #ffffff;
      color: var(--text-main);
      height: 54px;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      position: sticky;
      top: 0;
      z-index: 200;
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
    }
    .wp-adminbar-left, .wp-adminbar-right {
      display: flex;
      align-items: center;
      gap: 0.9rem;
    }
    .wp-adminbar-link {
      color: var(--text-main);
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
    }
    .wp-adminbar-link:hover { color: var(--wp-blue); }
    .wp-shell {
      display: flex;
      min-height: calc(100vh - 54px);
      width: 100%;
    }
    /* Falcon/Cruip-Style Light Left-Nav-Rail */
    .wp-sidenav {
      width: 224px;
      flex-shrink: 0;
      background: #ffffff;
      border-right: 1px solid var(--border-color);
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: sticky;
      top: 54px;
      height: calc(100vh - 54px);
      overflow-y: auto;
      padding: 1rem 0.75rem;
    }
    .wp-nav-group-label {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
      padding: 0.65rem 0.75rem 0.35rem;
    }
    .wp-nav-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.58rem 0.75rem;
      border-radius: 8px;
      color: #475569;
      text-decoration: none;
      font-size: 0.86rem;
      font-weight: 600;
      margin-bottom: 2px;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .wp-nav-item:hover {
      background: #f1f5f9;
      color: var(--wp-blue);
    }
    .wp-nav-item.active {
      background: #eff6ff;
      color: var(--wp-blue);
    }
    .wp-nav-item svg { width: 17px; height: 17px; flex-shrink: 0; }
    /* Full-Width Airy Dashboard Canvas */
    .stats-container {
      flex: 1;
      min-width: 0;
      width: 100%;
      padding: 1.5rem 1.75rem 3.5rem;
    }
    .wp-page-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }
    .wp-page-title {
      font-size: 1.35rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-main);
    }
    .hero-analytics-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .hero-kpi-strip {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
      padding-bottom: 1.15rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--border-soft);
    }
    .hero-kpi-label {
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }
    .hero-kpi-val {
      font-size: 1.65rem;
      font-weight: 800;
      color: var(--text-main);
      font-variant-numeric: tabular-nums;
      line-height: 1.15;
    }
    .hero-kpi-pill {
      display: inline-block;
      margin-top: 0.25rem;
      font-size: 0.72rem;
      font-weight: 700;
      color: #059669;
    }
    .blue-live-card {
      background: linear-gradient(155deg, #1d4ed8 0%, #2563eb 55%, #0284c7 100%);
      color: #ffffff;
      border-radius: 10px;
      padding: 1.25rem 1.35rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.22);
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }
    .panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    }
    .panel-header {
      padding: 0.95rem 1.25rem;
      border-bottom: 1px solid var(--border-soft);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
    }
    .panel-body {
      padding: 1.15rem 1.25rem;
    }
    .panel-title {
      font-size: 0.95rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-main);
    }
    .pie-layout {
      display: flex;
      align-items: center;
      gap: 1.15rem;
      flex-wrap: wrap;
    }
    .pie-legend {
      flex: 1;
      min-width: 150px;
    }
    @media (max-width: 1200px) {
      .hero-analytics-grid { grid-template-columns: 1fr; }
      .hero-kpi-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .charts-grid { grid-template-columns: 1fr; }
      .dashboard-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 820px) {
      .wp-shell { flex-direction: column; }
      .wp-sidenav {
        width: 100%;
        height: auto;
        position: static;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 0.5rem;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
      }
      .wp-nav-group-label, .wp-nav-footer { display: none; }
      .wp-nav-item { padding: 0.4rem 0.65rem; font-size: 0.8rem; }
      .stats-container { padding: 1rem; }
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
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-color);
      background: #f8fafc;
    }
    .stats-table td {
      padding: 0.85rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.9rem;
    }
    .stats-table tr:hover td {
      background: #f8fafc;
    }
    .btn-sm-action {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #0f172a;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-sm-action:hover {
      background: #2563eb;
      border-color: #2563eb;
      color: #fff;
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
      color: #dc2626;
      border-color: #fca5a5;
      background: #fef2f2;
    }
    .badge-ip-rule {
      font-size: 0.75rem;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #059669;
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
      background: #f8fafc;
    }
    .stats-search-input {
      background: #ffffff;
      border: 1px solid #cbd5e1;
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
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }
    .stats-tabs {
      display: flex;
      gap: 0.35rem;
      background: #e2e8f0;
      padding: 3px;
      border-radius: 8px;
    }
    .stats-tab {
      background: transparent;
      border: none;
      color: #475569;
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .stats-tab:hover {
      color: #0f172a;
    }
    .stats-tab.active {
      background: #2563eb;
      color: #fff;
    }
  </style>
</head>
<body>
  <!-- Clean Falcon/Cruip-Inspired Admin Top Bar -->
  <header class="wp-adminbar">
    <div class="wp-adminbar-left">
      <a href="/" target="_blank" class="wp-adminbar-link">
        <span style="width:28px; height:28px; background:linear-gradient(135deg,#2563eb,#06b6d4); border-radius:7px; display:inline-flex; align-items:center; justify-content:center; color:#fff;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        </span>
        <span>StaticStack Analytics</span>
      </a>
      <a href="/" target="_blank" class="wp-adminbar-link" style="color:#64748b; font-weight:500; font-size:0.82rem;">Visit Site &nearr;</a>
      <span class="badge-ip-rule">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        1 View / Day / IP
      </span>
    </div>

    <div class="wp-adminbar-right">
      <span style="font-size:0.84rem; color:#475569;">Howdy, <strong style="color:#0f172a;">${escapeHtml(user)}</strong></span>
      <a href="/stats/logout" class="logout-btn" style="padding:0.3rem 0.75rem; font-size:0.8rem;">Log Out</a>
    </div>
  </header>

  <div class="wp-shell">
    <!-- Light Left-Nav-Rail Sidepanel -->
    <aside class="wp-sidenav" aria-label="Stats Navigation">
      <div>
        <div class="wp-nav-group-label">Analytics</div>
        <a href="#sec-overview" class="wp-nav-item active" onclick="setWpNavActive(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
          <span>Overview</span>
        </a>
        <a href="#sec-charts" class="wp-nav-item" onclick="setWpNavActive(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
          <span>Charts &amp; Pies</span>
        </a>
        <a href="#sec-items" class="wp-nav-item" onclick="setWpNavActive(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          <span>Tracked Items</span>
        </a>
        <a href="#sec-geo" class="wp-nav-item" onclick="setWpNavActive(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          <span>Visitor Countries</span>
        </a>
        <a href="#sec-activity" class="wp-nav-item" onclick="setWpNavActive(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          <span>Activity Log</span>
        </a>
      </div>

      <div class="wp-nav-footer" style="border-top:1px solid var(--border-soft); padding-top:0.5rem;">
        <div class="wp-nav-group-label">Quick Links</div>
        <a href="/blog" target="_blank" class="wp-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          <span>Blog &amp; Guides</span>
        </a>
        <a href="/feed.xml" target="_blank" class="wp-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
          <span>RSS Feed</span>
        </a>
      </div>
    </aside>

    <!-- Full-Width Dashboard Content -->
    <main class="stats-container">
      <div class="wp-page-title-row" id="sec-overview">
        <h1 class="wp-page-title">Analytics</h1>
        <span style="font-size:0.82rem; color:var(--text-muted); background:#ffffff; border:1px solid var(--border-color); padding:0.35rem 0.75rem; border-radius:8px;">${data.totalTools} Tools &bull; ${data.totalCategories || 29} Categories &bull; Last 14 Days</span>
      </div>

      <!-- Hero 2-Column Row (Falcon / Cruip Style): Inline KPIs + Area Chart | Bold Blue 24h Card -->
      <div class="hero-analytics-grid">
        <div class="panel">
          <div class="panel-body">
            <div class="hero-kpi-strip">
              <div>
                <div class="hero-kpi-label">Total Verified Views</div>
                <div class="hero-kpi-val" id="kpi-total-views">${data.totalViews.toLocaleString()}</div>
                <span class="hero-kpi-pill">All tracked pages</span>
              </div>
              <div>
                <div class="hero-kpi-label">Catalog Tool Views</div>
                <div class="hero-kpi-val">${data.toolViewsTotal.toLocaleString()}</div>
                <span class="hero-kpi-pill" style="color:#2563eb;">${data.totalTools} tools</span>
              </div>
              <div>
                <div class="hero-kpi-label">Community Views</div>
                <div class="hero-kpi-val">${data.communityViewsTotal.toLocaleString()}</div>
                <span class="hero-kpi-pill" style="color:#0284c7;">${data.totalCommunityItems} topics</span>
              </div>
              <div>
                <div class="hero-kpi-label">24h Unique Hits</div>
                <div class="hero-kpi-val">${data.hits24h.toLocaleString()}</div>
                <span class="hero-kpi-pill">${data.uniqueVisitors24h} unique IPs</span>
              </div>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
              <span style="font-size:0.82rem; font-weight:700; color:var(--text-main);">Verified Hits (Last 14 Days)</span>
              <span style="font-size:0.75rem; color:var(--text-muted);">Daily IP-deduplicated activity</span>
            </div>
            ${renderAreaLineChartSvg(data.dailySeries)}
          </div>
        </div>

        <!-- Bold Blue Live / 24h Activity Card -->
        <div class="blue-live-card">
          <div>
            <div style="font-size:0.85rem; font-weight:600; color:rgba(255,255,255,0.88);">Hits in Last 24 Hours</div>
            <div style="font-size:2.75rem; font-weight:800; line-height:1.1; margin:0.35rem 0 0.75rem; font-variant-numeric:tabular-nums;">${data.hits24h.toLocaleString()}</div>
            <div style="font-size:0.76rem; color:rgba(255,255,255,0.82); margin-bottom:0.5rem;">Hourly hits (last 24h)</div>
            <div style="display:flex; align-items:flex-end; gap:3px; height:58px; margin-bottom:1rem;">
              ${hourlySparkHtml}
            </div>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.74rem; font-weight:700; color:rgba(255,255,255,0.8); padding-bottom:0.35rem; border-bottom:1px solid rgba(255,255,255,0.2);">
              <span>Most Active Pages (24h)</span>
              <span>Hits</span>
            </div>
            ${topActive24hHtml}
          </div>
        </div>
      </div>

      <!-- Infographics, Pies & Heatmap Row -->
      <div class="charts-grid" id="sec-charts">
        <!-- Pie 1: Traffic Split -->
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">Traffic Split</h2>
            <span style="font-size:0.75rem; color:var(--text-muted);">Tools vs Community</span>
          </div>
          <div class="panel-body">
            <div class="pie-layout">
              ${renderDonutPieSvg(splitSlices, 'Total Views', data.totalViews.toLocaleString())}
              <div class="pie-legend">
                ${renderLegendHtml(splitSlices)}
              </div>
            </div>
          </div>
        </div>

        <!-- Pie 2: Top Categories Share -->
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">Top Categories Share</h2>
            <span style="font-size:0.75rem; color:var(--text-muted);">By Tool Views</span>
          </div>
          <div class="panel-body">
            <div class="pie-layout">
              ${renderDonutPieSvg(catSlices, 'Tool Views', data.toolViewsTotal.toLocaleString())}
              <div class="pie-legend">
                ${renderLegendHtml(catSlices)}
              </div>
            </div>
          </div>
        </div>

        <!-- Users at a Time Heatmap -->
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">Users at a Time</h2>
            <span style="font-size:0.75rem; color:var(--text-muted);">Activity Heatmap</span>
          </div>
          <div class="panel-body">
            ${renderHeatmapHtml(data.heatmap)}
          </div>
        </div>
      </div>

      <!-- Top Tools Leaderboard Infographic -->
      <div class="panel" style="margin-bottom:1.25rem;">
        <div class="panel-header">
          <h2 class="panel-title">Top 8 Most-Viewed Tools</h2>
          <span style="font-size:0.75rem; color:var(--text-muted);">Relative View Volume</span>
        </div>
        <div class="panel-body" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.75rem 1.5rem;">
          ${topToolsBarsHtml}
        </div>
      </div>

      <!-- Main Grid: Tools/Community Controller + Country Leaderboard & Pie -->
      <div class="dashboard-grid">
        <!-- All Tracked Items -->
        <div class="panel" id="sec-items">
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

        <!-- Country Breakdown + Pie -->
        <div class="panel" id="sec-geo">
          <div class="panel-header">
            <h2 class="panel-title">Visitor Countries</h2>
            <span style="font-size:0.8rem; color:var(--text-muted);">Local GeoIP</span>
          </div>
          <div class="panel-body" style="border-bottom:1px solid var(--border-soft);">
            <div class="pie-layout">
              ${renderDonutPieSvg(countrySlices, 'Geo Hits', totalCountryHits.toLocaleString())}
              <div class="pie-legend">
                ${renderLegendHtml(countrySlices)}
              </div>
            </div>
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
      <div class="panel" id="sec-activity">
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
  </div>

  <script>
    function setWpNavActive(el) {
      document.querySelectorAll('.wp-nav-item').forEach(function(item) {
        item.classList.remove('active');
      });
      if (el) el.classList.add('active');
    }
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

const BOT_UA_REGEX = /\b(bot|crawl|spider|slurp|mediapartners|adsbot|googlebot|bingbot|yandex|baiduspider|duckduckbot|sogou|exabot|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|discordbot|applebot|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|gptbot|oai-searchbot|chatgpt-user|claudebot|anthropic-ai|ccbot|perplexitybot|youbot|scrapy|python-requests|python-urllib|curl|wget|httpie|headlesschrome|phantomjs|selenium|puppeteer|playwright|lighthouse)\b/i;

function isBotRequest(req) {
  const ua = (req && req.headers && req.headers['user-agent']) || '';
  if (!ua.trim()) return true;
  return BOT_UA_REGEX.test(ua);
}

async function handleStats(req, res, pathname, query) {
  // Enforce non-indexable & no-cache headers on every /stats response
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');

  // Block crawlers, search bots, scrapers, and automated clients
  if (isBotRequest(req)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Access denied.');
    return true;
  }

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

