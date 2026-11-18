import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(path.join(process.cwd(), 'package.json'));
const { getSiteContext } = require('./src/lib/site-context.js');
const { getLlmsData } = require('./src/lib/feeds.js');

export function GET() {
  const { llmsFullTxt } = getLlmsData(getSiteContext());
  return new Response(llmsFullTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
