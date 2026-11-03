# StaticSEO

> Open-source SEO tool and plugin for static websites that bakes meta tags, Open Graph cards, JSON-LD structured data, and XML sitemaps directly into static HTML at publish time.

- **Official Website**: <a href="https://staticseo.co/" target="_blank" rel="noopener noreferrer">staticseo.co</a>
- **Category**: [Development Tools](../../README.md#development-tools)
- **Type**: Static Website SEO & Metadata Automation Tool
- **Pricing / License**: Open Source (MIT) / Free
- **Tags**: `seo`, `open-graph`, `json-ld`, `sitemap`, `meta-tags`, `static-html`

---

## Overview

StaticSEO is a free, open-source SEO tool designed specifically for static websites (including sites managed with Instatic). Instead of relying on client-side JavaScript or third-party tracking scripts at runtime, StaticSEO injects all essential SEO metadata directly into your static HTML files at publish time.

Because every meta tag, canonical URL, social card, and JSON-LD schema block is baked into the raw HTML before deployment, search engine crawlers and social media link previews read your metadata immediately with zero runtime overhead.

---

## Key Highlights & Features

- **Core Meta Tags & Indexing Controls**: Automatically manages page titles, meta descriptions, canonical URLs, and per-page `noindex` / sitemap exclusion switches.
- **Social Link Previews (Open Graph & X/Twitter)**: Generates complete Open Graph (`og:*`) and Twitter/X card metadata with built-in previews so shared links look crisp on Slack, LinkedIn, WhatsApp, Discord, and X.
- **Automated JSON-LD Structured Data**: Produces clean JSON-LD schema markup for Organizations, WebSites, WebPages, Breadcrumbs, Articles, Services, and FAQs.
- **XML Sitemap Generation**: Automatically builds and updates `sitemap.xml` containing only indexable, published pages for Google Search Console and Bing Webmaster Tools.
- **Single Source of Truth**: Pulls global organization details (business name, address, phone number, hours) from centralized data tables so updates propagate across all pages on publish.
- **Page Audits & Content Rules**: Checks titles, `<h1>` tags, image `alt` attributes, and thin content before publishing, and applies template rules to new entries automatically.
- **Staging Safe Mode**: Includes a global switch to keep staging or preview deployments out of search indexes until launch.
- **Zero Client-Side Bloat**: Adds zero browser JavaScript, cookies, or tracking pixels—100% pure static HTML output.

---

## How It Works with Static Websites

1. **Configure Global & Content-Type Rules**: Set your site-wide defaults, organization schema details, and title/description templates.
2. **Audit & Preview Social Cards**: Review page-level SEO checks, heading structure, and Open Graph card previews while editing content.
3. **Publish Clean Static HTML**: On publish, StaticSEO writes `<meta>` tags, `<link rel="canonical">`, `<script type="application/ld+json">` blocks, and `sitemap.xml` directly into your static output files.

---

## When to Use It

- **Static & Jamstack Websites**: When you want comprehensive SEO management (meta tags, JSON-LD, sitemaps, and social cards) baked directly into static HTML without WordPress plugins or client-side JS.
- **Client & Agency Projects**: Give editors a clear SEO checklist, social previewer, and staging safe-mode without risking broken markup.
- **Performance-First Sites**: Maintain perfect Core Web Vitals with zero runtime scripts added to visitor browsers.

