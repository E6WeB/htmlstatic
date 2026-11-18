import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(path.join(process.cwd(), 'package.json'));
const { getSiteContext } = require('./src/lib/site-context.js');

export function GET() {
  const ctx = getSiteContext();
  return new Response(ctx.getMinifiedBaseCss() + '\n', {
    headers: { 'Content-Type': 'text/css; charset=utf-8' }
  });
}
