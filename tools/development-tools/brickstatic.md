# Brickstatic

> Export and publish WordPress Bricks Builder sites as static HTML for GitHub or any static host.

1. **Official Website**: <a href="https://builtforbricks.com/brickstatic/" target="_blank" rel="noopener noreferrer">builtforbricks.com/brickstatic</a>
2. **Category**: [Development Tools](../../README.md#development-tools)
3. **Type**: Static Site Generator & Exporter Plugin
4. **Pricing / License**: Paid

- **Tags**: `brickstatic`, `wordpress-to-static-html`, `bricks-builder-export`, `headless-wordpress`, `github-pages-wordpress`, `ai-coding-agent`, `vibe-coding`, `code-editor`, `web-performance`, `core-web-vitals`
---

## Overview

Brickstatic (developed by Built for Bricks) is a WordPress plugin that converts dynamic websites built with Bricks Builder into static HTML, CSS, JavaScript, and optimized media assets. 

It bridges the gap between intuitive visual page builders and modern Jamstack architecture. You can design your site visually in WordPress, and then export it as static files to a downloadable ZIP archive or commit it directly to a GitHub repository for automated deployment on static hosts like GitHub Pages, Cloudflare Pages, Netlify, or Vercel.

---

## Key Highlights & Features

1. **Static HTML Export**: Generates production-ready static HTML, CSS, JS, and image assets from Bricks Builder pages.
2. **Direct GitHub Integration**: Push static builds directly to a GitHub repository to trigger instant CI/CD deployments.
3. **ZIP Download Option**: Export your entire static site as a ZIP package ready for any static web host or S3 bucket.
4. **Form Handling Options**: Routes form submissions either to static form backends (e.g., Formspree, Basin) or back to a headless WordPress installation.
5. **Enhanced Security & Speed**: Eliminates live WordPress databases, PHP execution, and plugin vulnerabilities from your public-facing production site.

---

## How It Works with Static Websites

### 1. Build Visually in Bricks
Design and style your pages, templates, and layouts using WordPress and Bricks Builder on a local environment (e.g. LocalWP) or private staging server.

### 2. Export Static Files
Use Brickstatic inside the WordPress admin panel to generate the static site:
1. **GitHub Deployment**: Configure your repository and branch (e.g. `main` or `gh-pages`). Brickstatic commits the static HTML on export.
2. **ZIP Export**: Download the static bundle and upload it to any static web host, CDN, or server.

### 3. Static Form Routing
Configure your contact forms to post directly to third-party form services (such as [Formspree](../contact-forms/formspree.md), [Basin](../contact-forms/basin.md), or [Splitform](../contact-forms/splitform.md)) so forms work seamlessly without PHP running on production.

---

## When to Use It

1. Designers and agencies who prefer the visual workflow of Bricks Builder but want the security, zero maintenance, and speed of static HTML hosting.
2. Hosting client websites on free or low-cost static platforms (Cloudflare Pages, GitHub Pages) without ongoing WordPress hosting expenses.
3. Hardening public web presence by keeping WordPress behind a local or private staging server.
