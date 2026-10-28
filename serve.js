/**
 * Local Static Preview Server (Zero Dependencies)
 * Serves the static website on http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8080;
const SERVE_DIR = __dirname;
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
  '.toml': 'application/toml; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);
  const query = Object.fromEntries(reqUrl.searchParams.entries());

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

  // Normalize path
  let filePath = path.join(SERVE_DIR, pathname);

  // If directory, check for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else {
    const stripped = pathname.replace(/\/+$/, '');
    if (stripped && fs.existsSync(path.join(SERVE_DIR, stripped + '.html'))) {
      filePath = path.join(SERVE_DIR, stripped + '.html');
    }
  }

  // Check if file exists
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 Not Found</title><link rel="stylesheet" href="/asset/css/style.css"></head>
      <body style="display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;">
        <div>
          <h1>404</h1>
          <p>Page not found</p>
          <a href="/" class="btn btn-primary" style="margin-top:1rem;display:inline-block;">Return Home</a>
        </div>
      </body>
      </html>
    `);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
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
