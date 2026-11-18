import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(path.join(process.cwd(), 'package.json'));
const { getSiteContext } = require('./src/lib/site-context.js');

export function getStaticPaths() {
  const ctx = getSiteContext();
  return ctx.allTools.map(tool => ({
    params: { slug: tool.slug },
    props: { tool }
  }));
}

export function GET({ props }) {
  const ctx = getSiteContext();
  return new Response(ctx.renderToolBadgeSvg(props.tool), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' }
  });
}
