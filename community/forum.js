// community/forum.js - Pure Node.js & PostgreSQL forum backend for StaticStack
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Top Viewed Tools in-memory cache and background updater
const VIEWS_CACHE_FILE = path.join(__dirname, '..', 'asset', 'json', 'tool-views-cache.json');
let topToolsCache = global.__staticstack_top_tools_cache || null;
let allToolViewsCache = global.__staticstack_all_tool_views || null;
let topToolsLastFetch = global.__staticstack_top_tools_last_fetch || 0;
let isRefreshingTopTools = false;
const TOP_TOOLS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

if (!allToolViewsCache) {
  try {
    if (fs.existsSync(VIEWS_CACHE_FILE)) {
      allToolViewsCache = JSON.parse(fs.readFileSync(VIEWS_CACHE_FILE, 'utf8'));
      global.__staticstack_all_tool_views = allToolViewsCache;
    }
  } catch {}
}
if (!allToolViewsCache) allToolViewsCache = {};

const CATEGORY_ICONS = {
  'ai-content-creation': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  'ai-models': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`,
  'analytics-privacy': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  'authentication-users': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  'booking-scheduling': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  'browser-extensions': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>`,
  'comments-community': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  'contact-forms': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  'content-management': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  'css-components': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  'database-storage': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
  'development-tools': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  'hosting-deployment': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
  'images-optimization': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  'interactive-scripts': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  'live-chat': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
  'maps-geolocation': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`,
  'media-players': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`,
  'monitoring-errors': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  'newsletters-email': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
  'payments-ecommerce': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
  'search': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  'security-spam-protection': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  'static-site-generators': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  'surveys-feedback': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`,
  'typography-fonts': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
  'tutorials': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
};

const DEFAULT_TOP_TOOLS = [
  {
    name: 'imgmov',
    desc: 'AI generator for commercial product videos, images, and visual assets.',
    url: '/tools/ai-content-creation/imgmov',
    categorySlug: 'ai-content-creation',
    iconSvg: CATEGORY_ICONS['ai-content-creation'],
    views: 12
  },
  {
    name: 'PhotoSwipe',
    desc: 'Lightweight JavaScript image gallery and lightbox with smooth zoom.',
    url: '/tools/interactive-scripts/photoswipe',
    categorySlug: 'interactive-scripts',
    iconSvg: CATEGORY_ICONS['interactive-scripts'],
    views: 3
  },
  {
    name: 'Umami',
    desc: 'Simple, privacy-focused open-source analytics alternative.',
    url: '/tools/analytics-privacy/umami',
    categorySlug: 'analytics-privacy',
    iconSvg: CATEGORY_ICONS['analytics-privacy'],
    views: 2
  },
  {
    name: 'Codeberg Pages',
    desc: 'Community-driven, privacy-respecting, and free static website hosting.',
    url: '/tools/hosting-deployment/codeberg-pages',
    categorySlug: 'hosting-deployment',
    iconSvg: CATEGORY_ICONS['hosting-deployment'],
    views: 2
  }
];

async function refreshTopToolsCache() {
  if (isRefreshingTopTools) return;
  isRefreshingTopTools = true;
  try {
    const searchJsonPath = path.join(__dirname, '..', 'asset', 'json', 'search-data.json');
    if (!fs.existsSync(searchJsonPath)) return;
    const raw = fs.readFileSync(searchJsonPath, 'utf8');
    const items = JSON.parse(raw).filter(x => x && x.url && x.url.startsWith('/tools/'));
    if (!items.length) return;

    const pLimit = 15;
    const results = [];
    const viewsMap = {};
    for (let i = 0; i < items.length; i += pLimit) {
      const chunk = items.slice(i, i + pLimit);
      const chunkRes = await Promise.all(chunk.map(async t => {
        const parts = t.url.split('/').filter(Boolean);
        const catSlug = parts[1] || '';
        const key = 'htmlstatic-' + t.url.replace('/tools/', '').replace(/\//g, '-');
        let views = 0;
        try {
          const res = await fetch('https://countapi.mileshilliard.com/api/v1/get/' + encodeURIComponent(key), {
            signal: AbortSignal.timeout(3000)
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.value !== undefined) views = Number(data.value) || 0;
          }
        } catch {}
        viewsMap[key] = views;
        return {
          name: t.title,
          desc: t.description,
          url: t.url,
          categorySlug: catSlug,
          iconSvg: CATEGORY_ICONS[catSlug] || CATEGORY_ICONS['development-tools'],
          views: views
        };
      }));
      results.push(...chunkRes);
    }

    allToolViewsCache = viewsMap;
    global.__staticstack_all_tool_views = viewsMap;
    try {
      fs.writeFileSync(VIEWS_CACHE_FILE, JSON.stringify(viewsMap, null, 2));
    } catch {}

    results.sort((a, b) => b.views - a.views);
    const top4 = results.slice(0, 4);
    if (top4.length > 0) {
      topToolsCache = top4;
      global.__staticstack_top_tools_cache = top4;
      topToolsLastFetch = Date.now();
      global.__staticstack_top_tools_last_fetch = topToolsLastFetch;
    }
  } catch (err) {
    console.error('[TopTools] Error refreshing view cache:', err.message);
  } finally {
    isRefreshingTopTools = false;
  }
}

async function getTopTools() {
  if (!topToolsCache) {
    topToolsCache = DEFAULT_TOP_TOOLS;
    refreshTopToolsCache().catch(() => {});
  } else if (Date.now() - topToolsLastFetch > TOP_TOOLS_CACHE_TTL) {
    refreshTopToolsCache().catch(() => {});
  }
  return topToolsCache;
}

// Background warm-up
setTimeout(() => {
  refreshTopToolsCache().catch(() => {});
}, 1500);

// Initialize PostgreSQL pool with SSL
const pool = new Pool({
  host: process.env.DB_HOST || 'psql.fr-roub1.bengt.wasmernet.com',
  port: parseInt(process.env.DB_PORT, 10) || 20184,
  database: process.env.DB_NAME || 'staticstack_forum',
  user: process.env.DB_USERNAME || 'user_37640154',
  password: process.env.DB_PASSWORD || 'pw_tPEkBaA5KVeRRS9JlwCEJ6busfl2hcKX',
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000
});

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Ov23liDIeZsYUApYQwiD';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '8d91e6a78d709127370caedb9c2fe4af89a02b0f';
const SESSION_SECRET = process.env.SESSION_SECRET || 'e2ebd658d6c89eba64ecea98029d623aa3aa25d7e09e1c1b267496eaa6a3fceb';
const ADMIN_GITHUB_LOGIN = (process.env.ADMIN_GITHUB_LOGIN || 'E6WeB').toLowerCase().trim();
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE || 'staticstack_forum_session';
const cookieFlags = (process.env.APP_BASE_URL || '').startsWith('https')
  ? 'SameSite=Lax; Secure'
  : 'SameSite=Lax';

function getAppBaseUrl(req) {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL.replace(/\/+$/, '');
  const host = req.headers.host || 'www.staticstack.app';
  const proto = req.headers['x-forwarded-proto'] || (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
  return `${proto}://${host}`;
}

const escapeHtml = (str) =>
  String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

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

function signSession(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('hex');
  return `${body}.${sig}`;
}

function verifySession(raw) {
  if (!raw || !raw.includes('.')) return null;
  const [body, sig] = raw.split('.', 2);
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expectedSig, 'utf8'))) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!data || !data.uid || !data.exp || data.exp < Date.now()) return null;
    const login = (data.login || '').toLowerCase().trim();
    data.admin = ADMIN_GITHUB_LOGIN !== '' && login === ADMIN_GITHUB_LOGIN;
    return data;
  } catch {
    return null;
  }
}

function getCurrentUser(req) {
  const cookies = parseCookies(req);
  return verifySession(cookies[SESSION_COOKIE_NAME]);
}

function sendJson(res, data, status = 200) {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(payload);
}

function sendError(res, message, status = 400) {
  sendJson(res, { error: message }, status);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1000000) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Main API Handler
async function handleApi(req, res, pathname, query) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    res.end();
    return true;
  }

  const action = query.action || 'bootstrap';
  const user = getCurrentUser(req);

  try {
    if (action === 'bootstrap') {
      const [catsResult, topicsCountRes, repliesCountRes, usersCountRes, newestUserRes, latestTopicRes, topTools] = await Promise.all([
        pool.query("SELECT id, slug, name, description FROM forum_categories ORDER BY (slug = 'announcements') DESC, name ASC"),
        pool.query("SELECT COUNT(*)::int AS count FROM forum_topics WHERE is_hidden = FALSE"),
        pool.query("SELECT COUNT(*)::int AS count FROM forum_replies WHERE is_hidden = FALSE"),
        pool.query("SELECT COUNT(*)::int AS count FROM forum_users"),
        pool.query("SELECT login, display_name FROM forum_users ORDER BY id DESC LIMIT 1"),
        pool.query("SELECT id, title FROM forum_topics WHERE is_hidden = FALSE ORDER BY updated_at DESC LIMIT 1"),
        getTopTools()
      ]);

      const newestUser = newestUserRes.rows[0];
      const latestTopic = latestTopicRes.rows[0];

      sendJson(res, {
        user: user ? {
          uid: user.uid,
          login: user.login,
          name: user.name,
          avatar: user.avatar,
          admin: Boolean(user.admin)
        } : null,
        categories: catsResult.rows,
        top_tools: topTools,
        stats: {
          channels: catsResult.rows.length,
          topics: topicsCountRes.rows[0]?.count || 0,
          replies: repliesCountRes.rows[0]?.count || 0,
          members: usersCountRes.rows[0]?.count || 0,
          newest_member_name: newestUser ? (newestUser.display_name || newestUser.login) : '',
          newest_member_login: newestUser ? newestUser.login : '',
          latest_topic_id: latestTopic ? latestTopic.id : null,
          latest_topic_title: latestTopic ? latestTopic.title : ''
        }
      });
      return true;
    }

    if (action === 'top_tools' || action === 'top-tools') {
      const topTools = await getTopTools();
      sendJson(res, { top_tools: topTools });
      return true;
    }

    if (action === 'tool-views' || action === 'tool_views') {
      if (!Object.keys(allToolViewsCache).length) {
        refreshTopToolsCache().catch(() => {});
      }
      sendJson(res, { views: allToolViewsCache });
      return true;
    }

    if (action === 'categories') {
      const result = await pool.query("SELECT id, slug, name, description FROM forum_categories ORDER BY (slug = 'announcements') DESC, name ASC");
      sendJson(res, { categories: result.rows });
      return true;
    }

    if (action === 'topics') {
      const where = ['t.is_hidden = FALSE'];
      const params = [];
      let idx = 1;

      if (query.category) {
        where.push(`c.slug = $${idx++}`);
        params.push(String(query.category).slice(0, 80));
      }

      if (query.q) {
        const needle = `%${String(query.q).slice(0, 100)}%`;
        where.push(`(t.title ILIKE $${idx} OR t.body ILIKE $${idx} OR u.login ILIKE $${idx})`);
        params.push(needle);
        idx++;
      }

      params.push(user ? user.uid : 0);
      const voterIdx = idx;

      const sql = `
        SELECT t.id, t.title, t.body, t.created_at, t.updated_at, t.is_pinned, t.is_locked,
               c.slug AS category_slug, c.name AS category_name,
               u.login, u.display_name, u.avatar_url, u.id AS author_id,
               (SELECT COUNT(*)::int FROM forum_replies r WHERE r.topic_id = t.id AND r.is_hidden = FALSE) AS reply_count,
               (SELECT COALESCE(SUM(v.value), 0)::int FROM forum_votes v WHERE v.topic_id = t.id) AS score,
               (SELECT v.value FROM forum_votes v WHERE v.topic_id = t.id AND v.user_id = $${voterIdx} LIMIT 1) AS my_vote,
               (SELECT COALESCE(ru.display_name, ru.login) FROM forum_replies r JOIN forum_users ru ON ru.id = r.user_id WHERE r.topic_id = t.id AND r.is_hidden = FALSE ORDER BY r.created_at DESC LIMIT 1) AS last_reply_user,
               (SELECT r.created_at FROM forum_replies r WHERE r.topic_id = t.id AND r.is_hidden = FALSE ORDER BY r.created_at DESC LIMIT 1) AS last_reply_at
        FROM forum_topics t
        JOIN forum_categories c ON c.id = t.category_id
        JOIN forum_users u ON u.id = t.user_id
        WHERE ${where.join(' AND ')}
        ORDER BY t.is_pinned DESC, t.updated_at DESC
        LIMIT 100
      `;

      const result = await pool.query(sql, params);
      sendJson(res, { topics: result.rows });
      return true;
    }

    if (action === 'topic') {
      const id = parseInt(query.id, 10);
      if (!id) return sendError(res, 'A valid topic ID is required.');

      const voterId = user ? user.uid : 0;
      const isAdmin = Boolean(user && user.admin);

      const topicSql = `
        SELECT t.id, t.title, t.body, t.created_at, t.updated_at, t.is_pinned, t.is_locked, t.is_hidden,
               c.slug AS category_slug, c.name AS category_name,
               u.login, u.display_name, u.avatar_url, u.id AS author_id,
               (SELECT COALESCE(SUM(v.value), 0)::int FROM forum_votes v WHERE v.topic_id = t.id) AS score,
               (SELECT v.value FROM forum_votes v WHERE v.topic_id = t.id AND v.user_id = $2 LIMIT 1) AS my_vote
        FROM forum_topics t
        JOIN forum_categories c ON c.id = t.category_id
        JOIN forum_users u ON u.id = t.user_id
        WHERE t.id = $1
      `;
      const topicRes = await pool.query(topicSql, [id, voterId]);
      const topic = topicRes.rows[0];

      if (!topic || (topic.is_hidden && !isAdmin)) {
        return sendError(res, 'Topic not found.', 404);
      }

      const repliesSql = `
        SELECT r.id, r.body, r.created_at, r.is_hidden,
               u.login, u.display_name, u.avatar_url, u.id AS author_id,
               (SELECT COALESCE(SUM(v.value), 0)::int FROM forum_votes v WHERE v.reply_id = r.id) AS score,
               (SELECT v.value FROM forum_votes v WHERE v.reply_id = r.id AND v.user_id = $2 LIMIT 1) AS my_vote
        FROM forum_replies r
        JOIN forum_users u ON u.id = r.user_id
        WHERE r.topic_id = $1 AND (r.is_hidden = FALSE OR $3 = TRUE)
        ORDER BY r.created_at ASC
      `;
      const repliesRes = await pool.query(repliesSql, [id, voterId, isAdmin]);

      sendJson(res, { topic, replies: repliesRes.rows });
      return true;
    }

    if (action === 'create_topic') {
      if (!user) return sendError(res, 'Sign in with GitHub to do that.', 401);
      const data = await readBody(req);
      const title = String(data.title || '').trim();
      const body = String(data.body || '').trim();
      const slug = String(data.category || '').trim();

      if (title.length < 5 || title.length > 180) return sendError(res, 'Title must be between 5 and 180 characters.');
      if (body.length < 10 || body.length > 20000) return sendError(res, 'Post must be between 10 and 20,000 characters.');

      const catRes = await pool.query('SELECT id FROM forum_categories WHERE slug = $1', [slug]);
      if (!catRes.rows.length) return sendError(res, 'Choose a valid category.');
      const catId = catRes.rows[0].id;

      if (slug === 'announcements' && !user.admin) {
        return sendError(res, 'Only administrators can post in Announcements.', 403);
      }

      const isPinned = Boolean(slug === 'announcements' || (user.admin && data.pinned));

      const insertRes = await pool.query(
        'INSERT INTO forum_topics (category_id, user_id, title, body, is_pinned) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [catId, user.uid, title, body, isPinned]
      );
      sendJson(res, { ok: true, id: parseInt(insertRes.rows[0].id, 10) }, 201);
      return true;
    }

    if (action === 'edit_topic') {
      if (!user) return sendError(res, 'Sign in with GitHub to edit this discussion.', 401);
      const data = await readBody(req);
      const topicId = parseInt(data.id, 10);
      const title = String(data.title || '').trim();
      const body = String(data.body || '').trim();
      const slug = String(data.category || '').trim();

      if (!topicId) return sendError(res, 'A valid discussion ID is required.');
      if (title.length < 5 || title.length > 180) return sendError(res, 'Title must be between 5 and 180 characters.');
      if (body.length < 10 || body.length > 20000) return sendError(res, 'Post must be between 10 and 20,000 characters.');

      const existsRes = await pool.query(
        'SELECT id, user_id, category_id, is_locked FROM forum_topics WHERE id = $1 AND is_hidden = FALSE',
        [topicId]
      );
      if (!existsRes.rows.length) return sendError(res, 'Discussion not found.', 404);

      const topicRow = existsRes.rows[0];
      const isOwner = Number(topicRow.user_id) === Number(user.uid);
      const isAdmin = Boolean(user.admin);

      if (!isOwner && !isAdmin) {
        return sendError(res, 'You can only edit your own discussions.', 403);
      }

      if (topicRow.is_locked && !isAdmin) {
        return sendError(res, 'This discussion is locked and cannot be edited.', 403);
      }

      let catId = topicRow.category_id;
      let newCatSlug = '';
      let newCatName = '';
      if (slug) {
        const catRes = await pool.query('SELECT id, slug, name FROM forum_categories WHERE slug = $1', [slug]);
        if (!catRes.rows.length) return sendError(res, 'Choose a valid category.');
        if (slug === 'announcements' && !isAdmin) {
          return sendError(res, 'Only administrators can place discussions in Announcements.', 403);
        }
        catId = catRes.rows[0].id;
        newCatSlug = catRes.rows[0].slug;
        newCatName = catRes.rows[0].name;
      }

      const updateRes = await pool.query(
        `UPDATE forum_topics 
         SET title = $1, body = $2, category_id = $3, updated_at = NOW() 
         WHERE id = $4 
         RETURNING id, title, body, updated_at, category_id`,
        [title, body, catId, topicId]
      );

      sendJson(res, {
        ok: true,
        id: topicId,
        title,
        body,
        category_slug: newCatSlug,
        category_name: newCatName,
        updated_at: updateRes.rows[0].updated_at
      });
      return true;
    }

    if (action === 'reply') {
      if (!user) return sendError(res, 'Sign in with GitHub to do that.', 401);
      const data = await readBody(req);
      const topicId = parseInt(data.topic_id, 10);
      const body = String(data.body || '').trim();

      if (!topicId || body.length < 2 || body.length > 10000) {
        return sendError(res, 'Reply must be between 2 and 10,000 characters.');
      }

      const topicRes = await pool.query('SELECT id, is_locked FROM forum_topics WHERE id = $1 AND is_hidden = FALSE', [topicId]);
      if (!topicRes.rows.length) return sendError(res, 'Topic not found.', 404);
      if (topicRes.rows[0].is_locked && !user.admin) {
        return sendError(res, 'This discussion has been locked by an administrator. Replies are disabled.', 403);
      }

      const replyRes = await pool.query(
        'INSERT INTO forum_replies (topic_id, user_id, body) VALUES ($1, $2, $3) RETURNING id',
        [topicId, user.uid, body]
      );
      await pool.query('UPDATE forum_topics SET updated_at = NOW() WHERE id = $1', [topicId]);
      sendJson(res, { ok: true, id: parseInt(replyRes.rows[0].id, 10) }, 201);
      return true;
    }

    if (action === 'vote') {
      if (!user) return sendError(res, 'Sign in with GitHub to vote.', 401);
      const data = await readBody(req);
      const kind = data.kind === 'reply' ? 'reply' : 'topic';
      const targetId = parseInt(data.id, 10);
      const value = parseInt(data.value, 10);

      if (!targetId || ![1, -1].includes(value)) return sendError(res, 'Invalid vote.');

      const table = kind === 'reply' ? 'forum_replies' : 'forum_topics';
      const field = kind === 'reply' ? 'reply_id' : 'topic_id';

      const existsRes = await pool.query(`SELECT id FROM ${table} WHERE id = $1 AND is_hidden = FALSE`, [targetId]);
      if (!existsRes.rows.length) return sendError(res, 'Content not found.', 404);

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const voteRes = await client.query(
          `SELECT id, value FROM forum_votes WHERE user_id = $1 AND ${field} = $2 FOR UPDATE`,
          [user.uid, targetId]
        );
        let newVote = value;

        if (voteRes.rows.length) {
          const old = voteRes.rows[0];
          if (old.value === value) {
            await client.query('DELETE FROM forum_votes WHERE id = $1', [old.id]);
            newVote = 0;
          } else {
            await client.query('UPDATE forum_votes SET value = $1, created_at = NOW() WHERE id = $2', [value, old.id]);
          }
        } else {
          await client.query(
            `INSERT INTO forum_votes (user_id, ${field}, value) VALUES ($1, $2, $3)`,
            [user.uid, targetId, value]
          );
        }

        await client.query('COMMIT');
        sendJson(res, { ok: true, my_vote: newVote });
        return true;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    if (action === 'report') {
      if (!user) return sendError(res, 'Sign in with GitHub to report content.', 401);
      const data = await readBody(req);
      const kind = data.kind === 'reply' ? 'reply' : 'topic';
      const targetId = parseInt(data.id, 10);
      const reason = String(data.reason || '').trim();

      if (!targetId || reason.length < 5 || reason.length > 500) {
        return sendError(res, 'Please provide a reason between 5 and 500 characters.');
      }

      const table = kind === 'reply' ? 'forum_replies' : 'forum_topics';
      const field = kind === 'reply' ? 'reply_id' : 'topic_id';

      const existsRes = await pool.query(`SELECT id FROM ${table} WHERE id = $1`, [targetId]);
      if (!existsRes.rows.length) return sendError(res, 'Content not found.', 404);

      const repRes = await pool.query(
        `INSERT INTO forum_reports (reporter_id, ${field}, reason) VALUES ($1, $2, $3) RETURNING id`,
        [user.uid, targetId, reason]
      );
      sendJson(res, { ok: true, id: parseInt(repRes.rows[0].id, 10) }, 201);
      return true;
    }

    if (action === 'admin_reports') {
      if (!user || !user.admin) return sendError(res, 'Administrator access required.', 403);
      const sql = `
        SELECT rp.id, rp.reason, rp.status, rp.created_at, reporter.login AS reporter_login,
               t.id AS topic_id, t.title AS topic_title,
               r.id AS reply_id, r.body AS reply_body
        FROM forum_reports rp
        JOIN forum_users reporter ON reporter.id = rp.reporter_id
        LEFT JOIN forum_topics t ON t.id = rp.topic_id
        LEFT JOIN forum_replies r ON r.id = rp.reply_id
        WHERE rp.status = 'pending'
        ORDER BY rp.created_at ASC
        LIMIT 200
      `;
      const result = await pool.query(sql);
      sendJson(res, { reports: result.rows });
      return true;
    }

    if (action === 'moderate') {
      if (!user || !user.admin) return sendError(res, 'Administrator access required.', 403);
      const data = await readBody(req);
      const kind = data.kind === 'reply' ? 'reply' : 'topic';
      const targetId = parseInt(data.id, 10);
      const hidden = Boolean(data.hidden);

      if (!targetId) return sendError(res, 'Invalid content ID.');
      const table = kind === 'reply' ? 'forum_replies' : 'forum_topics';

      await pool.query(`UPDATE ${table} SET is_hidden = $1, updated_at = NOW() WHERE id = $2`, [hidden, targetId]);
      sendJson(res, { ok: true });
      return true;
    }

    if (action === 'review_report') {
      if (!user || !user.admin) return sendError(res, 'Administrator access required.', 403);
      const data = await readBody(req);
      const targetId = parseInt(data.id, 10);
      const status = data.status === 'dismissed' ? 'dismissed' : 'resolved';

      if (!targetId) return sendError(res, 'Invalid report ID.');
      await pool.query('UPDATE forum_reports SET status = $1, reviewed_by = $2, reviewed_at = NOW() WHERE id = $3', [
        status,
        user.uid,
        targetId
      ]);
      sendJson(res, { ok: true });
      return true;
    }

    if (action === 'delete_topic') {
      if (!user) return sendError(res, 'Sign in with GitHub to delete your discussion.', 401);
      const data = await readBody(req);
      const topicId = parseInt(data.id, 10);

      if (!topicId) return sendError(res, 'Invalid discussion ID.');
      const existsRes = await pool.query('SELECT id, user_id FROM forum_topics WHERE id = $1', [topicId]);
      if (!existsRes.rows.length) return sendError(res, 'Discussion not found.', 404);

      const topicRow = existsRes.rows[0];
      const isOwner = Number(topicRow.user_id) === Number(user.uid);
      const isAdmin = Boolean(user.admin);

      if (!isOwner && !isAdmin) {
        return sendError(res, 'You can only delete your own discussions.', 403);
      }

      await pool.query('DELETE FROM forum_topics WHERE id = $1', [topicId]);
      sendJson(res, { ok: true, id: topicId });
      return true;
    }

    if (action === 'delete_reply') {
      if (!user) return sendError(res, 'Sign in with GitHub to delete your reply.', 401);
      const data = await readBody(req);
      const replyId = parseInt(data.id, 10);

      if (!replyId) return sendError(res, 'Invalid reply ID.');
      const existsRes = await pool.query('SELECT id, user_id FROM forum_replies WHERE id = $1', [replyId]);
      if (!existsRes.rows.length) return sendError(res, 'Reply not found.', 404);

      const replyRow = existsRes.rows[0];
      const isOwner = Number(replyRow.user_id) === Number(user.uid);
      const isAdmin = Boolean(user.admin);

      if (!isOwner && !isAdmin) {
        return sendError(res, 'You can only delete your own replies.', 403);
      }

      await pool.query('DELETE FROM forum_replies WHERE id = $1', [replyId]);
      sendJson(res, { ok: true, id: replyId });
      return true;
    }

    if (action === 'pin_topic') {
      if (!user || !user.admin) return sendError(res, 'Administrator access required.', 403);
      const data = await readBody(req);
      const topicId = parseInt(data.id, 10);

      if (!topicId) return sendError(res, 'Invalid discussion ID.');
      const existsRes = await pool.query('SELECT id, is_pinned FROM forum_topics WHERE id = $1', [topicId]);
      if (!existsRes.rows.length) return sendError(res, 'Discussion not found.', 404);

      const newPinned = data.pinned !== undefined ? Boolean(data.pinned) : !existsRes.rows[0].is_pinned;
      const updateRes = await pool.query(
        'UPDATE forum_topics SET is_pinned = $1, updated_at = NOW() WHERE id = $2 RETURNING id, is_pinned',
        [newPinned, topicId]
      );
      sendJson(res, { ok: true, id: topicId, is_pinned: updateRes.rows[0].is_pinned });
      return true;
    }

    if (action === 'lock_topic') {
      if (!user || !user.admin) return sendError(res, 'Administrator access required.', 403);
      const data = await readBody(req);
      const topicId = parseInt(data.id, 10);

      if (!topicId) return sendError(res, 'Invalid discussion ID.');
      const existsRes = await pool.query('SELECT id, is_locked FROM forum_topics WHERE id = $1', [topicId]);
      if (!existsRes.rows.length) return sendError(res, 'Discussion not found.', 404);

      const newLocked = data.locked !== undefined ? Boolean(data.locked) : !existsRes.rows[0].is_locked;
      const updateRes = await pool.query(
        'UPDATE forum_topics SET is_locked = $1, updated_at = NOW() WHERE id = $2 RETURNING id, is_locked',
        [newLocked, topicId]
      );
      sendJson(res, { ok: true, id: topicId, is_locked: updateRes.rows[0].is_locked });
      return true;
    }

    sendError(res, 'Unknown action.', 404);
    return true;
  } catch (err) {
    console.error('Forum API error:', err);
    sendError(res, err.message || 'Internal server error.', 500);
    return true;
  }
}

// GitHub OAuth Handler
async function handleOAuth(req, res, pathname, query) {
  const action = query.action || 'login';
  const baseUrl = getAppBaseUrl(req);
  const oauthPath = pathname && pathname.endsWith('.php') ? '/community/oauth.php' : '/community/oauth';
  const callbackUrl = `${baseUrl}${oauthPath}?action=callback`;
  if (action === 'dev_login') {
    const login = query.user || 'E6WeB';
    const isDefaultAdmin = ADMIN_GITHUB_LOGIN !== '' && login.toLowerCase() === ADMIN_GITHUB_LOGIN;
    const devUid = query.uid ? parseInt(query.uid, 10) : (isDefaultAdmin ? 1 : 999);
    const devSession = signSession({
      uid: devUid,
      login: login,
      name: login,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000
    });
    res.writeHead(302, {
      Location: `${baseUrl}/community/topic?id=${query.id || 2}`,
      'Set-Cookie': `${SESSION_COOKIE_NAME}=${devSession}; Path=/; Max-Age=2592000; SameSite=Lax`
    });
    res.end();
    return true;
  }

  if (action === 'login') {
    const state = crypto.randomBytes(24).toString('hex');
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&scope=read:user&state=${state}&allow_signup=true`;

    res.writeHead(302, {
      Location: redirectUrl,
      'Set-Cookie': `staticstack_oauth_state=${state}; Path=/; Max-Age=600; ${cookieFlags}`
    });
    res.end();
    return true;
  }

  if (action === 'logout') {
    const returnTo = query.redirect && query.redirect.startsWith('/') ? query.redirect : '/community/';
    res.writeHead(302, {
      Location: `${baseUrl}${returnTo}`,
      'Set-Cookie': `${SESSION_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; ${cookieFlags}`
    });
    res.end();
    return true;
  }

  if (action === 'callback') {
    const cookies = parseCookies(req);
    const expectedState = cookies.staticstack_oauth_state || '';
    const receivedState = query.state || '';
    const code = query.code || '';

    if (!expectedState || !receivedState || expectedState !== receivedState || !code) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In Cancelled</title>
  <style>
    body { background: #0d1117; color: #e6edf3; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 24px; box-sizing: border-box; }
    h2 { font-size: 1.2rem; margin: 0 0 8px; color: #f0f6fc; }
    p { font-size: 0.95rem; color: #8b949e; margin: 0 0 20px; }
    button { background: #21262d; border: 1px solid #30363d; color: #c9d1d9; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
    button:hover { background: #30363d; }
  </style>
</head>
<body>
  <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#2563eb 0%,#06b6d4 100%);display:flex;align-items:center;justify-content:center;color:#ffffff;margin-bottom:18px;box-shadow:0 8px 24px -4px rgba(37,99,235,0.45);">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
  </div>
  <h2>StaticStack Community</h2>
  <p style="color:#8b949e;margin:0 0 20px;">GitHub sign-in was cancelled. Please return to the community and try again.</p>
  <button onclick="window.close()">Close Window</button>
  <script>
    if (!window.opener) {
      setTimeout(function() { window.location.href = '${baseUrl}/community/'; }, 2500);
    }
  </script>
</body>
</html>`);
      return true;
    }

    try {
      // Exchange code for GitHub access token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'StaticStack-Community/1.0'
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: callbackUrl,
          state: receivedState
        })
      });

      const tokenData = await tokenRes.json();
      const token = tokenData.access_token;
      if (!token) throw new Error('GitHub did not return an access token.');

      // Fetch user profile from GitHub
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'User-Agent': 'StaticStack-Community/1.0',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      const profile = await userRes.json();
      if (!profile || !profile.id || !profile.login) throw new Error('Could not read GitHub profile.');

      const isAdmin = ADMIN_GITHUB_LOGIN !== '' && profile.login.toLowerCase() === ADMIN_GITHUB_LOGIN;
      const displayName = profile.name || profile.login;
      const avatarUrl = profile.avatar_url || '';

      const upsertSql = `
        INSERT INTO forum_users (github_id, login, display_name, avatar_url, is_admin)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (github_id) DO UPDATE
        SET login = EXCLUDED.login,
            display_name = EXCLUDED.display_name,
            avatar_url = EXCLUDED.avatar_url,
            is_admin = EXCLUDED.is_admin,
            updated_at = NOW()
        RETURNING id
      `;
      const dbUserRes = await pool.query(upsertSql, [profile.id, profile.login, displayName, avatarUrl, isAdmin]);
      const userId = parseInt(dbUserRes.rows[0].id, 10);

      const session = {
        uid: userId,
        gid: String(profile.id),
        login: profile.login,
        name: displayName,
        avatar: avatarUrl,
        admin: isAdmin,
        exp: Date.now() + 14 * 24 * 60 * 60 * 1000
      };

      const signedSession = signSession(session);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': [
          `${SESSION_COOKIE_NAME}=${signedSession}; Path=/; Max-Age=${14 * 24 * 60 * 60}; ${cookieFlags}`,
          `staticstack_oauth_state=; Path=/; Max-Age=0; ${cookieFlags}`
        ]
      });
      res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Signed In — StaticStack Community</title>
  <style>
    body {
      background: #0d1117;
      color: #e6edf3;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      text-align: center;
      padding: 24px;
      box-sizing: border-box;
    }
    .spinner {
      width: 44px;
      height: 44px;
      border: 3px solid rgba(255, 255, 255, 0.15);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { font-size: 1.25rem; margin: 0 0 8px; font-weight: 600; color: #f0f6fc; }
    p { font-size: 0.95rem; color: #8b949e; margin: 0; }
  </style>
</head>
<body>
  <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#2563eb 0%,#06b6d4 100%);display:flex;align-items:center;justify-content:center;color:#ffffff;margin-bottom:18px;box-shadow:0 8px 24px -4px rgba(37,99,235,0.45);">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
      <polyline points="2 17 12 22 22 17"></polyline>
      <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
  </div>
  <div class="spinner"></div>
  <h2>StaticStack Community</h2>
  <p>Signed in successfully! Connecting…</p>
  <script>
    (function() {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: 'staticstack-oauth-success',
            user: ${JSON.stringify({
              id: userId,
              login: profile.login,
              name: displayName,
              avatar: avatarUrl,
              admin: isAdmin
            })}
          }, '*');
          setTimeout(function() {
            window.close();
          }, 350);
          return;
        }
      } catch (e) {}
      window.location.href = '${baseUrl}/community/?signed_in=1';
    })();
  </script>
</body>
</html>`);
      return true;
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In Failed</title>
  <style>
    body { background: #0d1117; color: #f85149; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 24px; box-sizing: border-box; }
    h2 { font-size: 1.2rem; margin: 0 0 8px; color: #f85149; }
    p { font-size: 0.95rem; color: #8b949e; margin: 0 0 20px; }
    button { background: #21262d; border: 1px solid #30363d; color: #c9d1d9; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
    button:hover { background: #30363d; }
  </style>
</head>
<body>
  <h2>Sign In Failed</h2>
  <p>${escapeHtml(err.message)}</p>
  <button onclick="window.close()">Close Window</button>
</body>
</html>`);
      return true;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
  return true;
}

module.exports = {
  pool,
  handleApi,
  handleOAuth
};
