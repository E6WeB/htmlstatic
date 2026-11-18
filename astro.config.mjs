import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import CleanCSS from 'clean-css';
import { minify as terserMinify } from 'terser';

const require = createRequire(import.meta.url);
const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

function copyWebpTree(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyWebpTree(srcPath, destPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.webp')) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function copyIfExists(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) return;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.cpSync(srcPath, destPath, { recursive: true });
}

function walkFiles(dir, extFilter) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full, extFilter));
    } else if (entry.isFile() && extFilter(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function optimizeHtmlContent(html, cleanCss) {
  // Preserve <pre>, <textarea>, and <code> blocks verbatim
  const preserved = [];
  let work = html.replace(/<(pre|textarea|code)\b[^>]*>[\s\S]*?<\/\1>/gi, (m) => {
    preserved.push(m);
    return `__STATICSTACK_PRESERVE_${preserved.length - 1}__`;
  });

  // Minify inline <style>...</style>
  work = work.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (m, attrs, css) => {
    const res = cleanCss.minify(css);
    return `<style${attrs}>${res.errors.length === 0 ? res.styles : css}</style>`;
  });

  // Minify inline <script>...</script> (skip external src= and application/ld+json)
  const scriptMatches = [...work.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  if (scriptMatches.length > 0) {
    let rebuilt = '';
    let lastIdx = 0;
    for (const m of scriptMatches) {
      rebuilt += work.slice(lastIdx, m.index);
      const attrs = m[1] || '';
      const code = m[2] || '';
      if (!/\bsrc=/i.test(attrs) && !/application\/ld\+json/i.test(attrs) && code.trim()) {
        try {
          const min = await terserMinify(code, { compress: true, mangle: true });
          rebuilt += `<script${attrs}>${min.code || code}</script>`;
        } catch {
          rebuilt += m[0];
        }
      } else {
        rebuilt += m[0];
      }
      lastIdx = m.index + m[0].length;
    }
    rebuilt += work.slice(lastIdx);
    work = rebuilt;
  }

  // Strip HTML comments (keep conditional comments) & collapse inter-tag whitespace
  work = work
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .trim();

  // Restore preserved blocks
  work = work.replace(/__STATICSTACK_PRESERVE_(\d+)__/g, (_, i) => preserved[Number(i)]);
  return work;
}

function staticstackAssets() {
  return {
    name: 'staticstack-assets',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);

        // 1. Copy static assets under /asset/
        copyIfExists(path.join(ROOT_DIR, 'asset', 'img'), path.join(distDir, 'asset', 'img'));
        copyIfExists(path.join(ROOT_DIR, 'asset', 'js'), path.join(distDir, 'asset', 'js'));
        copyIfExists(
          path.join(ROOT_DIR, 'asset', 'css', 'stackbot.css'),
          path.join(distDir, 'asset', 'css', 'stackbot.css')
        );
        copyIfExists(
          path.join(ROOT_DIR, 'asset', 'json', 'tool-views-cache.json'),
          path.join(distDir, 'asset', 'json', 'tool-views-cache.json')
        );
        copyIfExists(
          path.join(ROOT_DIR, 'asset', 'json', 'tool-likes-cache.json'),
          path.join(distDir, 'asset', 'json', 'tool-likes-cache.json')
        );

        // 2. Copy tool & blog .webp images and OG images
        copyWebpTree(path.join(ROOT_DIR, 'tools'), path.join(distDir, 'tools'));
        copyWebpTree(path.join(ROOT_DIR, 'blog'), path.join(distDir, 'blog'));
        copyIfExists(
          path.join(ROOT_DIR, 'archive', 'og-archive.webp'),
          path.join(distDir, 'archive', 'og-archive.webp')
        );
        copyIfExists(
          path.join(ROOT_DIR, 'submit', 'og-submit.webp'),
          path.join(distDir, 'submit', 'og-submit.webp')
        );

        // 3. Copy root static files
        for (const file of ['site.webmanifest', 'apple-touch-icon.png', 'CNAME', 'google9d4f6b825b711343.html']) {
          copyIfExists(path.join(ROOT_DIR, file), path.join(distDir, file));
        }

        // 4. Copy & sync community pages (index.html, topic.html, assets/)
        copyIfExists(path.join(ROOT_DIR, 'community', 'index.html'), path.join(distDir, 'community', 'index.html'));
        copyIfExists(path.join(ROOT_DIR, 'community', 'topic.html'), path.join(distDir, 'community', 'topic.html'));
        copyIfExists(path.join(ROOT_DIR, 'community', 'assets'), path.join(distDir, 'community', 'assets'));

        const { getSiteContext } = require('./src/lib/site-context.js');
        const ctx = getSiteContext();
        ctx.syncAllCommunityPages({
          allTools: ctx.allTools,
          categories: ctx.categories,
          rootDir: distDir
        });

        // 5. Optimize CSS, JS, and HTML in dist/
        const cleanCss = new CleanCSS({ level: 1 });
        let savedBytes = 0;

        for (const cssFile of walkFiles(distDir, (n) => n.endsWith('.css'))) {
          const orig = fs.readFileSync(cssFile, 'utf8');
          const res = cleanCss.minify(orig);
          if (res.errors.length === 0 && res.styles.length < orig.length) {
            savedBytes += orig.length - res.styles.length;
            fs.writeFileSync(cssFile, res.styles, 'utf8');
          }
        }

        for (const jsFile of walkFiles(distDir, (n) => n.endsWith('.js'))) {
          const orig = fs.readFileSync(jsFile, 'utf8');
          try {
            const res = await terserMinify(orig, { compress: true, mangle: true });
            if (res.code && res.code.length < orig.length) {
              savedBytes += orig.length - res.code.length;
              fs.writeFileSync(jsFile, res.code, 'utf8');
            }
          } catch {}
        }

        for (const htmlFile of walkFiles(distDir, (n) => n.endsWith('.html'))) {
          const base = path.basename(htmlFile);
          if (base.startsWith('google') && base.endsWith('.html')) continue;
          const orig = fs.readFileSync(htmlFile, 'utf8');
          const opt = await optimizeHtmlContent(orig, cleanCss);
          if (opt.length < orig.length) {
            savedBytes += orig.length - opt.length;
            fs.writeFileSync(htmlFile, opt, 'utf8');
          }
        }

        console.log(`⚡ Optimized dist/ HTML, CSS, and JS (saved ${(savedBytes / 1024).toFixed(1)} KB)`);
      }
    }
  };
}

export default defineConfig({
  output: 'static',
  outDir: './dist',
  site: 'https://www.staticstack.app',
  build: {
    format: 'file'
  },
  integrations: [staticstackAssets()]
});
