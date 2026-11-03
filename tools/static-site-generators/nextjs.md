# Next.js

> Full-featured React framework supporting pure static site exports (`output: 'export'`) alongside modern routing and TypeScript tooling.

- **Official Website**: <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">nextjs.org</a>
- **Category**: [Static Site Generators](../../README.md#static-site-generators)
- **Type**: React Web Framework & Static Exporter
- **Pricing / License**: Open Source (MIT)

---

## Overview

Next.js is the most widely adopted React framework for production web development. While it supports hybrid server rendering, Next.js also includes a dedicated **Static Exports** mode (`output: 'export'`) that pre-renders your entire React application into standalone static HTML, CSS, and JavaScript files inside an `out/` directory.

A statically exported Next.js site requires zero Node.js servers at runtime and can be deployed to any static host such as GitHub Pages, Cloudflare Pages, Netlify, or Amazon S3.

---

## Key Highlights & Features

- **Pure Static Export (`output: 'export'`)**: Generates self-contained `.html` files for every route at build time with zero server runtime required.
- **File-System App Router**: Define pages, nested layouts, and dynamic routes (`generateStaticParams`) naturally using folders and React Server Components.
- **Built-in TypeScript & CSS Support**: Out-of-the-box support for TypeScript, Tailwind CSS, CSS Modules, and Sass without manual bundler configuration.
- **Automatic Code Splitting & Prefetching**: Only loads the JavaScript needed for the current page and prefetches linked routes in the background.

---

## How It Works with Static Websites

Enable static HTML export in `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Optional: output /about/index.html instead of /about.html
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

Build the static site:

```bash
# Create a new Next.js project
npx create-next-app@latest my-static-app

# Run the production build (outputs static files to out/)
npm run build
```

---

## When to Use It

- React teams who want to build interactive static websites, dashboards, documentation, or marketing sites using React and TypeScript.
- Projects that start as pure static HTML exports (`out/`) and want the flexibility to adopt edge or server features in the future.
- Developers looking for the largest ecosystem of React UI component libraries and templates.

