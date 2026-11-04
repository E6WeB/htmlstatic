# Astro

> Web framework designed for content-driven websites that ships zero JavaScript by default.

1. **Official Website**: <a href="https://astro.build/" target="_blank" rel="noopener noreferrer">astro.build</a>
2. **Category**: [Static Site Generators](../../README.md#static-site-generators)
3. **Type**: Modern Static Web Framework
4. **Pricing / License**: Open Source

- **Tags**: `astro-build`, `islands-architecture`, `zero-js-by-default`, `mdx-content-collections`, `fastest-static-framework`, `ssg`, `jamstack`, `markdown-to-html`, `zero-js`, `fast-static-sites`
---

## Overview

Astro is a leading web framework built specifically for content-focused websites such as marketing pages, blogs, portfolios, and documentation. It pioneered the "Islands Architecture", rendering pages to pure static HTML and stripping away all JavaScript by default.

Astro allows you to write components using HTML-like syntax or integrate your favorite UI libraries (React, Vue, Svelte) only when interactive widgets are needed.

---

## Key Highlights & Features

1. **Zero JS by Default**: Delivers pure static HTML and CSS for top Lighthouse scores.
2. **Component Islands**: Hydrate interactive elements on-demand without slowing the whole page.
3. **Content Collections**: Type-safe Markdown and MDX management with schema validation.
4. **Universal Deployment**: Deploys statically to GitHub Pages, Cloudflare Pages, Netlify, or Vercel.

---

## How It Works with Static Websites

Initialize a new Astro project:

```bash
# Create a new Astro static site
npm create astro@latest

# Start development server
npm run dev

# Build production static HTML
npm run build
```

Example component (`src/pages/index.astro`):

```astro
---
const pageTitle = "My Static Site";
---
<html>
  <head><title>{pageTitle}</title></head>
  <body>
    <h1>{pageTitle}</h1>
    <p>This renders to pure static HTML with zero client JavaScript.</p>
  </body>
</html>
```

---

## When to Use It

1. Content-rich blogs, portfolios, marketing websites, and documentation portals.
2. Achieving flawless 100/100 Google Lighthouse and Core Web Vitals performance scores.
3. Projects that need clean Markdown publishing with optional interactive components.
