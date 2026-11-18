import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(path.join(process.cwd(), 'package.json'));
const { getSiteContext } = require('./src/lib/site-context.js');
const { getSearchIndexJson } = require('./src/lib/feeds.js');

export function GET() {
  return new Response(getSearchIndexJson(getSiteContext()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
