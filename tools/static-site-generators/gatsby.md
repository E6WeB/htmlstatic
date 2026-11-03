# Gatsby

> React-based static site framework with a unified GraphQL data layer and rich plugin ecosystem.

- **Official Website**: <a href="https://www.gatsbyjs.com/" target="_blank" rel="noopener noreferrer">gatsbyjs.com</a>
- **Category**: [Static Site Generators](../../README.md#static-site-generators)
- **Type**: React Static Site Generator
- **Pricing / License**: Open Source (MIT)

---

## Overview

Gatsby is an open-source, React-based framework designed for building fast, content-rich static websites and applications. It combines static HTML pre-rendering with a unified GraphQL data layer that pulls content from Markdown files, headless CMS platforms, REST APIs, and databases at build time.

Once built, Gatsby outputs pre-rendered HTML, CSS, and optimized assets that load almost instantaneously from any static hosting provider or CDN.

---

## Key Highlights & Features

- **Unified GraphQL Data Layer**: Query Markdown, JSON, headless CMSs, and external APIs through a single GraphQL schema at build time.
- **Automatic Image Optimization**: Built-in `gatsby-plugin-image` generates responsive WebP/AVIF images and lazy-loaded placeholders automatically.
- **2,500+ Plugins & Starters**: Extensive ecosystem for SEO, sitemaps, RSS feeds, analytics, and headless CMS integrations.
- **Pre-Rendered Static Output**: Compiles React components into fast, SEO-friendly static HTML files with automatic code splitting and route prefetching.

---

## How It Works with Static Websites

Create and build a Gatsby static site:

```bash
# Create a new Gatsby project
npm init gatsby

# Start the local development server
npm run develop

# Build production static HTML into public/
npm run build
```

Example page component (`src/pages/index.js`):

```jsx
import * as React from "react"

export default function IndexPage() {
  return (
    <main>
      <h1>Welcome to My Static Gatsby Site</h1>
      <p>Pre-rendered at build time and served from a CDN.</p>
    </main>
  )
}

export const Head = () => <title>Home Page</title>
```

---

## When to Use It

- React developers building content-heavy marketing sites, blogs, or documentation portals.
- Websites aggregating content from multiple sources (Markdown, Contentful, WordPress, or Sanity) via GraphQL.
- Projects that benefit from automated responsive image processing and rich plugin integrations.

