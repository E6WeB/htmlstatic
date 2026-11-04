# GoatCounter

> Lightweight, privacy-friendly web analytics without cookie banners.

1. **Official Website**: <a href="https://www.goatcounter.com/" target="_blank" rel="noopener noreferrer">goatcounter.com</a>
2. **Category**: [Analytics & Privacy](../../README.md#analytics--privacy)
3. **Type**: Privacy-First Web Analytics
4. **Pricing / License**: Open Source / Freemium

- **Tags**: `goatcounter`, `open-source-analytics`, `cookieless-tracking`, `gdpr-analytics`, `lightweight-analytics`, `no-banner-analytics`, `cookieless-analytics`, `gdpr-compliant`, `google-analytics-alternative`, `privacy-first`
---

## Overview

GoatCounter is an open-source web analytics platform that provides meaningful visitor insights without tracking personal user data or using persistent cookies. Because it does not track personal identifiers, it is fully GDPR compliant out of the box and requires no cookie consent banners.

It is available as a hosted service (with a generous free plan for personal use) and can also be self-hosted as a single Go binary.

---

## Key Highlights & Features

1. **No Cookie Banners Required**: Fully complies with GDPR, CCPA, and privacy laws.
2. **Lightweight Script**: Tiny script (~3.5 KB) that won't slow down page loads.
3. **Open Source**: Transparent codebase that can be self-hosted anywhere.
4. **Essential Metrics**: Pageviews, referrer sources, screen sizes, countries, and browsers.

---

## How It Works with Static Websites

Add the tracking snippet just before the closing `</body>` tag of your HTML pages:

```html
<script data-goatcounter="https://YOURCODE.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

---

## When to Use It

1. Static blogs, documentation, portfolios, and small business sites.
2. Websites that want clean traffic metrics without annoying cookie banners.
3. Developers who value open source and user privacy.
