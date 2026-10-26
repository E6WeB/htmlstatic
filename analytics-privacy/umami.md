# Umami

> Simple, privacy-focused open-source alternative to Google Analytics.

- **Official Website**: <a href="https://umami.is/" target="_blank" rel="noopener noreferrer">umami.is</a>
- **Category**: [Analytics & Privacy](../README.md#analytics--privacy)
- **Type**: Open Source Analytics Platform

---

## Overview

Umami is a privacy-focused open-source analytics platform designed as an accessible alternative to Google Analytics. It collects only essential non-personal metrics, does not track visitors across websites, and operates without cookies.

It features a beautiful, clean single-page dashboard where you can view real-time visitors, referrers, custom events, and page views.

---

## Key Highlights & Features

- **Cookie-Free Analytics**: Zero personal tracking or invasive fingerprinting.
- **Custom Event Tracking**: Track button clicks, form submissions, and downloads.
- **Fast & Lightweight**: Extremely small tracking script (< 2 KB).
- **Hosted or Self-Hosted**: Use Umami Cloud or deploy the open-source version on your own infrastructure.

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

- Developers seeking an intuitive, privacy-respecting Google Analytics replacement.
- Static websites needing custom event and conversion tracking without heavy scripts.
- Teams who want the option to self-host their analytics data.
