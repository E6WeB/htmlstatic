# Umami

> Simple, privacy-focused open-source alternative to Google Analytics.

1. **Official Website**: <a href="https://umami.is/" target="_blank" rel="noopener noreferrer">umami.is</a>
2. **Category**: [Inactive](../../README.md#inactive)
3. **Type**: Open Source Analytics Platform
4. **Pricing / License**: Freemium

- **Tags**: `analytics`, `privacy`, `cookieless`, `gdpr`, `self-hosted`, `open-source`, `umami-analytics`, `self-hosted-analytics`, `open-source-ga-alternative`, `cookieless-metrics`
---

## Overview

> [!WARNING]
> **Website Status: Down / Inaccessible** — The official website (<a href="https://umami.is/" target="_blank" rel="noopener noreferrer">umami.is</a>) is currently down or not accessible. The open-source codebase, releases, and documentation remain available on GitHub at <a href="https://github.com/umami-software/umami" target="_blank" rel="noopener noreferrer">github.com/umami-software/umami</a>.

Umami is a privacy-focused open-source analytics platform designed as an accessible alternative to Google Analytics. It collects only essential non-personal metrics, does not track visitors across websites, and operates without cookies.

It features a beautiful, clean single-page dashboard where you can view real-time visitors, referrers, custom events, and page views.

---

## Key Highlights & Features

1. **Cookie-Free Analytics**: Zero personal tracking or invasive fingerprinting.
2. **Custom Event Tracking**: Track button clicks, form submissions, and downloads.
3. **Fast & Lightweight**: Extremely small tracking script (< 2 KB).
4. **Hosted or Self-Hosted**: Use Umami Cloud or deploy the open-source version on your own infrastructure.

---

## How It Works with Static Websites

Include the Umami tracking script in your HTML `<head>`:

```html
<script defer src="https://cloud.umami.is/script.js"
        data-website-id="YOUR-WEBSITE-UUID"></script>
```

Track custom events on buttons or links:

```html
<button data-umami-event="Signup Button Click">Sign Up</button>
```

---

## When to Use It

1. Developers seeking an intuitive, privacy-respecting Google Analytics replacement.
2. Static websites needing custom event and conversion tracking without heavy scripts.
3. Teams who want the option to self-host their analytics data.
