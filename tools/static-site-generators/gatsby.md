# Gatsby

> React-based static site framework with a unified GraphQL data layer and rich plugin ecosystem.

1. **Official Website**: <a href="https://www.gatsbyjs.com/" target="_blank" rel="noopener noreferrer">gatsbyjs.com</a>
2. **Category**: [Static Site Generators](../../README.md#static-site-generators)
3. **Type**: React Static Site Generator
4. **Pricing / License**: Open Source

- **Tags**: `gatsby-js`, `react-graphql-ssg`, `static-image-optimization`, `headless-cms-react`, `ssg`, `jamstack`, `markdown-to-html`, `zero-js`, `fast-static-sites`, `blog-generator`
---

## Overview

Gatsby is an open-source, React-based framework designed for building fast, content-rich static websites and applications. It combines static HTML pre-rendering with a unified GraphQL data layer that pulls content from Markdown files, headless CMS platforms, REST APIs, and databases at build time.

Once built, Gatsby outputs pre-rendered HTML, CSS, and optimized assets that load almost instantaneously from any static hosting provider or CDN.

---

## Key Highlights & Features

1. **Unified GraphQL Data Layer**: Query Markdown, JSON, headless CMSs, and external APIs through a single GraphQL schema at build time.
2. **Automatic Image Optimization**: Built-in `gatsby-plugin-image` generates responsive WebP/AVIF images and lazy-loaded placeholders automatically.
3. **2,500+ Plugins & Starters**: Extensive ecosystem for SEO, sitemaps, RSS feeds, analytics, and headless CMS integrations.
4. **Pre-Rendered Static Output**: Compiles React components into fast, SEO-friendly static HTML files with automatic code splitting and route prefetching.

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

1. React developers building content-heavy marketing sites, blogs, or documentation portals.
2. Websites aggregating content from multiple sources (Markdown, Contentful, WordPress, or Sanity) via GraphQL.
3. Projects that benefit from automated responsive image processing and rich plugin integrations.
