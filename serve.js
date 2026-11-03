/**
 * Local Static Preview Server (Zero Dependencies)
 * Serves the static website on http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8080;
const SERVE_DIR = path.resolve(__dirname);
const forum = require('./community/forum.js');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.toml': 'application/toml; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const COMPRESSIBLE_EXTS = new Set(['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt']);
const IMMUTABLE_CACHE_EXTS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.ico', '.svg']);
const BLOCKED_FILES = new Set([
  '/serve.js',
  '/generate-pages.js',
  '/package.json',
  '/package-lock.json',
  '/app.yaml',
  '/community/forum.js'
]);

function isBlockedPath(pathname) {
  const lower = pathname.toLowerCase();
  if (BLOCKED_FILES.has(lower)) return true;
  // Block hidden files/folders (.git, .github, .env, etc.) and node_modules / sql
  const segments = lower.split('/').filter(Boolean);
  if (segments.some(seg => seg.startsWith('.') || seg === 'node_modules' || seg === 'sql')) {
    return true;
  }
  const ext = path.extname(lower);
  if (['.sql', '.py', '.md', '.env', '.toml', '.yaml'].includes(ext)) {
    return true;
  }
  return false;
}

function serveFile(req, res, filePath, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const cacheControl = IMMUTABLE_CACHE_EXTS.has(ext)
    ? 'public, max-age=86400'
    : (ext === '.css' || ext === '.js')
      ? 'public, max-age=300, must-revalidate'
      : 'no-cache';

  const headers = {
    'Content-Type': contentType,
    'Cache-Control': cacheControl,
    'Access-Control-Allow-Origin': '*'
  };

  if (req.method === 'HEAD') {
    res.writeHead(statusCode, headers);
    res.end();
    return;
  }

  const acceptEncoding = req.headers['accept-encoding'] || '';
  const rawStream = fs.createReadStream(filePath);
  rawStream.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    res.end('Internal Server Error');
  });

  if (COMPRESSIBLE_EXTS.has(ext)) {
    headers['Vary'] = 'Accept-Encoding';
    if (/\bbr\b/.test(acceptEncoding)) {
      headers['Content-Encoding'] = 'br';
      res.writeHead(statusCode, headers);
      rawStream.pipe(zlib.createBrotliCompress({
        params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 }
      })).pipe(res);
      return;
    }
    if (/\bgzip\b/.test(acceptEncoding)) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(statusCode, headers);
      rawStream.pipe(zlib.createGzip({ level: 6 })).pipe(res);
      return;
    }
  }

  res.writeHead(statusCode, headers);
  rawStream.pipe(res);
}

function serve404(req, res) {
  const custom404 = path.join(SERVE_DIR, '404.html');
  if (fs.existsSync(custom404)) {
    return serveFile(req, res, custom404, 404);
  }
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1><a href="/">Return Home</a></body></html>');
}

const server = http.createServer((req, res) => {
  let reqUrl;
  try {
    reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(reqUrl.pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  const query = Object.fromEntries(reqUrl.searchParams.entries());

  // Handle Tool View Counter API (/api/view or /api/tool-view)
  if (pathname === '/api/view' || pathname === '/api/tool-view') {
    const key = query.key || '';
    const hitRequested = query.hit !== '0' && query.hit !== 'false';
    return forum.recordToolView(req, key, hitRequested)
      .then(result => {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        });
        res.end(JSON.stringify(result));
      })
      .catch(err => {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message }));
      });
  }

  // Handle Tool Views or Top Tools direct APIs (/api/top-tools, /api/tool-views)
  if (pathname === '/api/top-tools' || pathname === '/api/tool-views') {
    const action = pathname === '/api/top-tools' ? 'top-tools' : 'tool-views';
    return forum.handleApi(req, res, pathname, { ...query, action });
  }

  // Handle Community Forum API (/community/api or /community/api.php)
  if (pathname === '/community/api' || pathname === '/community/api.php') {
    return forum.handleApi(req, res, pathname, query);
  }

  // Handle Community Forum OAuth (/community/oauth or /community/oauth.php)
  if (pathname === '/community/oauth' || pathname === '/community/oauth.php') {
    return forum.handleOAuth(req, res, pathname, query);
  }

  // Redirect directory without trailing slash
  if (pathname === '/community') {
    res.writeHead(301, { Location: '/community/' + (reqUrl.search || '') });
    res.end();
    return;
  }

  // Handle Community Forum Topic Page (/community/topic or /community/topic/:id)
  if (pathname === '/community/topic' || pathname.startsWith('/community/topic/')) {
    const topicHtmlPath = path.join(SERVE_DIR, 'community', 'topic.html');
    if (fs.existsSync(topicHtmlPath)) {
      return serveFile(req, res, topicHtmlPath, 200);
    }
  }

  // Block sensitive files & directories
  if (isBlockedPath(pathname)) {
    return serve404(req, res);
  }

  // Normalize and prevent path traversal outside SERVE_DIR
  let filePath = path.resolve(SERVE_DIR, '.' + pathname);
  if (!filePath.startsWith(SERVE_DIR)) {
    return serve404(req, res);
  }

  // If directory, check for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else {
    const stripped = pathname.replace(/\/+$/, '');
    if (stripped) {
      const candidate = path.resolve(SERVE_DIR, '.' + stripped + '.html');
      if (candidate.startsWith(SERVE_DIR) && fs.existsSync(candidate)) {
        filePath = candidate;
      }
    }
  }

  // Check if file exists and is not a directory
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return serve404(req, res);
  }

  serveFile(req, res, filePath, 200);
});

function startServer(port) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Static server running at http://localhost:${port}`);
    console.log(`📁 Serving directory: ${SERVE_DIR}`);
  });
}

startServer(DEFAULT_PORT);
