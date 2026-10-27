# Fontsource

> Self-host open-source web fonts locally with zero external network requests.

- **Official Website**: <a href="https://fontsource.org/" target="_blank" rel="noopener noreferrer">fontsource.org</a>
- **Category**: [Typography & Web Fonts](../../README.md#typography--web-fonts)
- **Type**: Self-Hosted Web Fonts

---

## Overview

Fontsource makes it easy to self-host open-source web fonts by packaging thousands of fonts (including Google Fonts) into version-controlled packages or downloadable CSS/WOFF2 bundles.

By bundling fonts directly into your static site's repository, you eliminate external render-blocking network requests, achieve faster First Contentful Paint times, and guarantee 100% privacy compliance.

---

## Key Highlights & Features

- **Zero External Requests**: All font files are served from your own static domain or CDN.
- **Faster Page Loads**: Eliminates DNS lookups and TLS handshakes to third-party CDNs.
- **Version Controlled**: Font files remain locked to your specified version without unexpected changes.
- **Subset Support**: Automatically includes optimized WOFF2 files with latin and unicode subsets.

---

## How It Works with Static Websites

Download the WOFF2 files and reference them directly in your static `index.css`:

```css
/* Define local @font-face */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-latin-400-normal.woff2') format('woff2');
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## When to Use It

- High-performance static websites aiming for maximum Google PageSpeed and Lighthouse scores.
- Offline-capable static sites and Progressive Web Apps (PWAs).
- Projects requiring strict privacy standards with zero external third-party requests.
