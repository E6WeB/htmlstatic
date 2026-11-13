// ==========================================================================
// StaticStack Tool Website Health & Dead-Link Checker
// Checks all 130 tool URLs with concurrency, timeout, and redirect handling.
// Exports results to asset/json/link-health.json
// ==========================================================================

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { loadCatalog } = require('../src/data/parse-readme');

const ROOT_DIR = path.resolve(__dirname, '..');
const ASSET_DIR = path.join(ROOT_DIR, 'asset', 'json');
const HEALTH_FILE = path.join(ASSET_DIR, 'link-health.json');
const CONCURRENCY = 10;
const TIMEOUT_MS = 8000;
const TODAY = new Date().toISOString().split('T')[0];

function checkUrl(rawUrl) {
  return new Promise((resolve) => {
    let resolved = false;

    function finish(resObj) {
      if (!resolved) {
        resolved = true;
        resolve(resObj);
      }
    }

    try {
      const parsed = new URL(rawUrl);
      const isHttps = parsed.protocol === 'https:';
      const lib = isHttps ? https : http;

      const options = {
        method: 'HEAD',
        hostname: parsed.hostname,
        port: parsed.port || (isHttps ? 443 : 80),
        path: (parsed.pathname || '/') + (parsed.search || ''),
        maxHeaderSize: 65536,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 StaticStack-HealthCheck/1.0',
          'Accept': '*/*'
        },
        timeout: TIMEOUT_MS
      };

      const req = lib.request(options, (res) => {
        // If server responds with 403 or 405 (some CDNs like Cloudflare block HEAD requests), try GET
        if (res.statusCode === 403 || res.statusCode === 405) {
          req.destroy();
          return tryGet(rawUrl, finish);
        }

        // Handle redirects (up to 300-399)
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          req.destroy();
          return finish({ status: 'online', code: res.statusCode });
        }

        // 429 (rate limit) or 403 (anti-bot) from a server means the server is online
        const isOk = (res.statusCode >= 200 && res.statusCode < 400) || res.statusCode === 429 || res.statusCode === 403;
        req.destroy();
        finish({
          status: isOk ? 'online' : 'offline',
          code: res.statusCode
        });
      });

      req.on('timeout', () => {
        req.destroy();
        finish({ status: 'offline', code: 0, error: 'Timeout' });
      });

      req.on('error', (err) => {
        // Fallback to GET on certain SSL/protocol errors
        tryGet(rawUrl, finish);
      });

      req.end();
    } catch (e) {
      finish({ status: 'offline', code: 0, error: 'Invalid URL' });
    }
  });
}

function tryGet(rawUrl, finish) {
  try {
    const parsed = new URL(rawUrl);
    const isHttps = parsed.protocol === 'https:';
    const lib = isHttps ? https : http;

    const options = {
      method: 'GET',
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: (parsed.pathname || '/') + (parsed.search || ''),
      maxHeaderSize: 65536,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 StaticStack-HealthCheck/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: TIMEOUT_MS
    };

    const req = lib.request(options, (res) => {
      const isOk = (res.statusCode >= 200 && res.statusCode < 400) || res.statusCode === 429 || res.statusCode === 403;
      req.destroy();
      finish({
        status: isOk ? 'online' : 'offline',
        code: res.statusCode
      });
    });

    req.on('timeout', () => {
      req.destroy();
      finish({ status: 'offline', code: 0, error: 'Timeout' });
    });

    req.on('error', (err) => {
      finish({ status: 'offline', code: 0, error: err.message || 'Connection Failed' });
    });

    req.end();
  } catch (e) {
    finish({ status: 'offline', code: 0, error: 'Invalid URL' });
  }
}

async function checkAllTools() {
  const { allTools } = loadCatalog(ROOT_DIR);
  console.log(`Starting Link Health Check for ${allTools.length} tools...`);

  // Load existing cache if present to preserve past records if any
  let healthMap = {};
  if (fs.existsSync(HEALTH_FILE)) {
    try {
      healthMap = JSON.parse(fs.readFileSync(HEALTH_FILE, 'utf8'));
    } catch {}
  }

  let index = 0;
  let onlineCount = 0;
  let offlineCount = 0;

  async function worker() {
    while (index < allTools.length) {
      const tool = allTools[index++];
      const prev = healthMap[tool.slug];
      const result = await checkUrl(tool.websiteUrl);
      const prevFailures = prev && typeof prev.consecutive_failures === 'number'
        ? prev.consecutive_failures
        : (prev && prev.status === 'offline' ? 1 : 0);

      healthMap[tool.slug] = {
        url: tool.websiteUrl,
        status: result.status,
        code: result.code,
        error: result.error || null,
        consecutive_failures: result.status === 'online' ? 0 : prevFailures + 1,
        checked_at: TODAY
      };

      if (result.status === 'online') {
        onlineCount++;
        process.stdout.write(`\r[${index}/${allTools.length}] checked... (Online: ${onlineCount}, Offline: ${offlineCount})`);
      } else {
        offlineCount++;
        console.log(`\n⚠️  [${tool.name}] (${tool.websiteUrl}) -> ${result.error || result.code}`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  if (!fs.existsSync(ASSET_DIR)) {
    fs.mkdirSync(ASSET_DIR, { recursive: true });
  }

  fs.writeFileSync(HEALTH_FILE, JSON.stringify(healthMap, null, 2), 'utf8');
  console.log(`\n\nHealth Check Complete!`);
  console.log(`- Verified Online: ${onlineCount}`);
  console.log(`- Flagged Offline / Warning: ${offlineCount}`);
  console.log(`- Saved results to: ${HEALTH_FILE}\n`);
}

if (require.main === module) {
  checkAllTools().catch(err => {
    console.error('Fatal error during health check:', err);
    process.exit(1);
  });
}

module.exports = {
  checkAllTools,
  checkUrl
};
