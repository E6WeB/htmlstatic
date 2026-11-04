# Fontsource

> Self-host open-source web fonts locally with zero external network requests.

1. **Official Website**: <a href="https://fontsource.org/" target="_blank" rel="noopener noreferrer">fontsource.org</a>
2. **Category**: [Typography & Web Fonts](../../README.md#typography--web-fonts)
3. **Type**: Self-Hosted Web Fonts
4. **Pricing / License**: Open Source

- **Tags**: `fontsource`, `npm-self-hosted-fonts`, `local-woff2-fonts`, `zero-external-dns-fonts`, `offline-google-fonts`, `self-hosted-fonts`, `gdpr-fonts`, `google-fonts-alternative`, `variable-fonts`, `web-typography`
---

## Overview

Fontsource makes it easy to self-host open-source web fonts by packaging thousands of fonts (including Google Fonts) into version-controlled packages or downloadable CSS/WOFF2 bundles.

By bundling fonts directly into your static site's repository, you eliminate external render-blocking network requests, achieve faster First Contentful Paint times, and guarantee 100% privacy compliance.

---

## Key Highlights & Features

1. **Zero External Requests**: All font files are served from your own static domain or CDN.
2. **Faster Page Loads**: Eliminates DNS lookups and TLS handshakes to third-party CDNs.
3. **Version Controlled**: Font files remain locked to your specified version without unexpected changes.
4. **Subset Support**: Automatically includes optimized WOFF2 files with latin and unicode subsets.

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

1. High-performance static websites aiming for maximum Google PageSpeed and Lighthouse scores.
2. Offline-capable static sites and Progressive Web Apps (PWAs).
3. Projects requiring strict privacy standards with zero external third-party requests.
