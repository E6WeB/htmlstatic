import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(path.join(process.cwd(), 'package.json'));
const { getRobotsTxt } = require('./src/lib/feeds.js');

export function GET() {
  return new Response(getRobotsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
