# Pagefind

> Static search indexing designed specifically for static websites.

1. **Official Website**: <a href="https://pagefind.app/" target="_blank" rel="noopener noreferrer">pagefind.app</a>
2. **Category**: [Search](../../README.md#search)
3. **Type**: Client-Side Static Search Library
4. **Pricing / License**: Open Source

- **Tags**: `pagefind`, `rust-wasm-static-search`, `zero-bandwidth-search-index`, `astro-hugo-11ty-search`, `offline-static-search`, `static-site-search`, `client-side-search`, `instant-search`, `wasm-search`, `zero-server-search`
---

## Overview

Pagefind is a fully static search library developed by Cloudflare that indexes your built static HTML files after your build step. It produces pre-built search index shards that are downloaded on-demand by the browser using WebAssembly.

Because it runs completely in the browser and loads only tiny index chunks as the user types, Pagefind requires zero hosted infrastructure, zero server APIs, and scales effortlessly.

---

## Key Highlights & Features

1. **Zero Backend**: Runs entirely on your static host; no hosted search service required.
2. **Negligible Bandwidth**: Chunks search indexes so users download only what they query.
3. **Pre-Built UI**: Includes an accessible, responsive search UI component out of the box.
4. **Framework Agnostic**: Works with Astro, Hugo, Eleventy, Jekyll, VitePress, and plain HTML.

---

## How It Works with Static Websites

1. Run Pagefind after building your site:

```bash
npx pagefind --site dist
```

1. Include Pagefind UI in your static HTML:

```html
<link href="/pagefind/pagefind-ui.css" rel="stylesheet">
<script src="/pagefind/pagefind-ui.js"></script>

<div id="search"></div>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({ element: "#search", showSubResults: true });
  });
</script>
```

---

## When to Use It

1. Documentation sites, technical blogs, and large static knowledge bases.
2. Websites that want fast, robust full-text search with zero ongoing server costs.
3. Static sites deployed on GitHub Pages, Cloudflare Pages, Netlify, or Vercel.
