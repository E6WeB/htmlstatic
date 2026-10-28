// community/forum.js - Pure Node.js & PostgreSQL forum backend for StaticStack
const crypto = require('crypto');
const { Pool } = require('pg');

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

function getAppBaseUrl(req) {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL.replace(/\/+$/, '');
  const host = req.headers.host || 'www.staticstack.app';
  const proto = req.headers['x-forwarded-proto'] || (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
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
      const catsResult = await pool.query('SELECT id, slug, name, description FROM forum_categories ORDER BY name');
      sendJson(res, {
        user: user ? {
          login: user.login,
          name: user.name,
          avatar: user.avatar,
          admin: Boolean(user.admin)
        } : null,
        categories: catsResult.rows
      });
      return true;
    }

    if (action === 'categories') {
      const result = await pool.query('SELECT id, slug, name, description FROM forum_categories ORDER BY name');
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
        SELECT t.id, t.title, t.body, t.created_at, t.updated_at,
               c.slug AS category_slug, c.name AS category_name,
               u.login, u.display_name, u.avatar_url,
               (SELECT COUNT(*)::int FROM forum_replies r WHERE r.topic_id = t.id AND r.is_hidden = FALSE) AS reply_count,
               (SELECT COALESCE(SUM(v.value), 0)::int FROM forum_votes v WHERE v.topic_id = t.id) AS score,
               (SELECT v.value FROM forum_votes v WHERE v.topic_id = t.id AND v.user_id = $${voterIdx} LIMIT 1) AS my_vote
        FROM forum_topics t
        JOIN forum_categories c ON c.id = t.category_id
        JOIN forum_users u ON u.id = t.user_id
        WHERE ${where.join(' AND ')}
        ORDER BY t.updated_at DESC
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
        SELECT t.id, t.title, t.body, t.created_at, t.updated_at, t.is_hidden,
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

      const insertRes = await pool.query(
        'INSERT INTO forum_topics (category_id, user_id, title, body) VALUES ($1, $2, $3, $4) RETURNING id',
        [catId, user.uid, title, body]
      );
      sendJson(res, { ok: true, id: parseInt(insertRes.rows[0].id, 10) }, 201);
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

      const topicRes = await pool.query('SELECT id FROM forum_topics WHERE id = $1 AND is_hidden = FALSE', [topicId]);
      if (!topicRes.rows.length) return sendError(res, 'Topic not found.', 404);

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

  if (action === 'login') {
    const state = crypto.randomBytes(24).toString('hex');
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&scope=read:user&state=${state}&allow_signup=true`;

    res.writeHead(302, {
      Location: redirectUrl,
      'Set-Cookie': `staticstack_oauth_state=${state}; Path=/; Max-Age=600; Secure; HttpOnly; SameSite=Lax`
    });
    res.end();
    return true;
  }

  if (action === 'logout') {
    res.writeHead(302, {
      Location: `${baseUrl}/community/`,
      'Set-Cookie': `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax`
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
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('GitHub sign-in was cancelled or could not be verified. Please return to the forum and try again.');
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
      res.writeHead(302, {
        Location: `${baseUrl}/community/?signed_in=1`,
        'Set-Cookie': [
          `${SESSION_COOKIE_NAME}=${signedSession}; Path=/; Max-Age=${14 * 24 * 60 * 60}; Secure; HttpOnly; SameSite=Lax`,
          'staticstack_oauth_state=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax'
        ]
      });
      res.end();
      return true;
    } catch (err) {
      console.error('OAuth callback error:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Sign in failed: ${err.message}`);
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
