import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(path.join(process.cwd(), 'package.json'));
const { getSiteContext } = require('./src/lib/site-context.js');
const { getFeedXml } = require('./src/lib/feeds.js');

export function GET() {
  return new Response(getFeedXml(getSiteContext()), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
