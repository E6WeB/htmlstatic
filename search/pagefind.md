# Pagefind

> Static search indexing designed specifically for static websites.

- **Official Website**: <a href="https://pagefind.app/" target="_blank" rel="noopener noreferrer">pagefind.app</a>
- **Category**: [Search](../README.md#search)
- **Type**: Client-Side Static Search Library

---

## Overview

Pagefind is a fully static search library developed by Cloudflare that indexes your built static HTML files after your build step. It produces pre-built search index shards that are downloaded on-demand by the browser using WebAssembly.

Because it runs completely in the browser and loads only tiny index chunks as the user types, Pagefind requires zero hosted infrastructure, zero server APIs, and scales effortlessly.

---

## Key Highlights & Features

- **Zero Backend**: Runs entirely on your static host; no hosted search service required.
- **Negligible Bandwidth**: Chunks search indexes so users download only what they query.
- **Pre-Built UI**: Includes an accessible, responsive search UI component out of the box.
- **Framework Agnostic**: Works with Astro, Hugo, Eleventy, Jekyll, VitePress, and plain HTML.

---

## How It Works with Static Websites

1. Run Pagefind after building your site:

```bash
npx pagefind --site dist
```

2. Include Pagefind UI in your static HTML:

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

- Documentation sites, technical blogs, and large static knowledge bases.
- Websites that want fast, robust full-text search with zero ongoing server costs.
- Static sites deployed on GitHub Pages, Cloudflare Pages, Netlify, or Vercel.

---

[← Back to Search](../README.md#search) | [← Back to Static Website Toolkit](../README.md)
