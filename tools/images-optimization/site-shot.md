# Site-Shot

> Free online website screenshot generator and REST API for full-page web captures and thumbnails.

1. **Official Website**: <a href="https://www.site-shot.com/" target="_blank" rel="noopener noreferrer">site-shot.com</a>
2. **Category**: [Images & Optimization](../../README.md#images--optimization)
3. **Type**: Website Screenshot Tool & REST API
4. **Pricing / License**: Freemium

- **Tags**: `site-shot`, `website-screenshot-api`, `url-to-image-png`, `automated-og-images`, `webpage-thumbnail-generator`, `webp-converter`, `svg-vectorizer`, `image-compression`, `core-web-vitals`, `fast-page-load`
---

## Overview

**Site-Shot** is a free online webpage capture tool and developer REST API designed to generate pixel-perfect screenshots of any public URL. It allows static site creators, developers, and designers to capture full-length scrolling web pages, mobile or desktop viewports, and custom resolution images without requiring local headless browser setups (such as Puppeteer or Playwright).

The online web interface is completely free with zero signup required. For developers building static websites, documentation portals, portfolio showcases, or link-preview cards, Site-Shot provides a simple REST API with 100 free captures per month, supporting WebP, PNG, JPEG, and PDF formats with automatic ad blocking and cookie banner suppression.

---

## Key Highlights & Features

1. **No-Signup Web Tool**: Capture instant high-resolution screenshots directly from the browser with no account needed.
2. **Full-Page Scrolling Capture**: Automatically scrolls and stitches entire web pages up to 20,000 pixels tall.
3. **REST Screenshot API**: Generate dynamic screenshots via simple HTTP GET requests with custom query parameters.
4. **Modern Format Support**: Export to WebP (lossy and lossless), PNG, JPEG, or PDF documents.
5. **Device & Viewport Emulation**: Simulate desktop, tablet, and mobile screen resolutions with custom device pixel ratios.
6. **Ad & Cookie Banner Removal**: Automatically dismisses consent popups and blocks ads for clean website visuals.
7. **Proxy & Geolocation Support**: Render localized content via country-specific rotating proxies.

---

## How It Works with Static Websites

### 1. Direct API URL Embed

Embed dynamic website preview images directly in your static HTML via standard `<img>` tags:

```html
<!-- Responsive live screenshot thumbnail generated via Site-Shot API -->
<img 
  src="https://api.site-shot.com/?url=https://example.com&width=1280&height=800&format=webp&userkey=YOUR_API_KEY" 
  alt="Website Preview" 
  loading="lazy" 
  width="640" 
  height="400">
```

### 2. Static Build Script Integration (Node.js)

Capture screenshots during your static site generator (SSG) build step:

```javascript
const fs = require('fs');
const https = require('https');

const targetUrl = encodeURIComponent('https://github.com');
const apiKey = 'YOUR_API_KEY';
const apiUrl = `https://api.site-shot.com/?url=${targetUrl}&width=1440&height=900&format=png&full_page=true&userkey=${apiKey}`;

const file = fs.createWriteStream('./assets/preview.png');
https.get(apiUrl, (response) => {
  response.pipe(file);
});
```

---

## When to Use It

1. **Portfolio & Showcase Sites**: Automatically display live preview thumbnails of client websites or personal projects.
2. **Documentation & Link Previews**: Generate visual website cards or OG social share images without hosting a headless Chrome instance.
3. **Design Archival & QA**: Capture full-length scrolling screenshots to document design iterations and responsive layouts.
