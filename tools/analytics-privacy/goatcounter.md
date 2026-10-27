# GoatCounter

> Lightweight, privacy-friendly web analytics without cookie banners.

- **Official Website**: <a href="https://www.goatcounter.com/" target="_blank" rel="noopener noreferrer">goatcounter.com</a>
- **Category**: [Analytics & Privacy](../../README.md#analytics--privacy)
- **Type**: Privacy-First Web Analytics

---

## Overview

GoatCounter is an open-source web analytics platform that provides meaningful visitor insights without tracking personal user data or using persistent cookies. Because it does not track personal identifiers, it is fully GDPR compliant out of the box and requires no cookie consent banners.

It is available as a hosted service (with a generous free plan for personal use) and can also be self-hosted as a single Go binary.

---

## Key Highlights & Features

- **No Cookie Banners Required**: Fully complies with GDPR, CCPA, and privacy laws.
- **Lightweight Script**: Tiny script (~3.5 KB) that won't slow down page loads.
- **Open Source**: Transparent codebase that can be self-hosted anywhere.
- **Essential Metrics**: Pageviews, referrer sources, screen sizes, countries, and browsers.

---

## How It Works with Static Websites

Add the tracking snippet just before the closing `</body>` tag of your HTML pages:

```html
<script data-goatcounter="https://YOURCODE.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

---

## When to Use It

- Static blogs, documentation, portfolios, and small business sites.
- Websites that want clean traffic metrics without annoying cookie banners.
- Developers who value open source and user privacy.
