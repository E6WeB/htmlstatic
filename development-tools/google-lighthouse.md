# Google Lighthouse

> Audit website performance, accessibility, SEO, and web development best practices.

- **Official Website**: <a href="https://developer.chrome.com/docs/lighthouse/" target="_blank" rel="noopener noreferrer">developer.chrome.com/docs/lighthouse</a>
- **Category**: [Development Tools](../README.md#development-tools)
- **Type**: Website Quality & Audit Tool

---

## Overview

Google Lighthouse is an open-source, automated tool for improving the quality of web pages. It audits websites across five core categories: Performance, Accessibility, Best Practices, SEO, and Progressive Web App (PWA) readiness.

It provides actionable advice, diagnostics, and metrics (including First Contentful Paint, Largest Contentful Paint, and Cumulative Layout Shift) to make your static sites as fast and accessible as possible.

---

## Key Highlights & Features

- **Five Comprehensive Audits**: Performance, Accessibility, Best Practices, SEO, and PWA.
- **Core Web Vitals Scoring**: Measure LCP, FID/INP, and CLS against Google standards.
- **Actionable Recommendations**: Specific advice on unoptimized images, render-blocking scripts, and color contrast.
- **Integrated in DevTools**: Built directly into the Chrome DevTools "Lighthouse" tab.

---

## How It Works with Static Websites

Run Lighthouse in Google Chrome:
1. Open Chrome DevTools (`F12` or `Ctrl+Shift+I` / `Cmd+Option+I`).
2. Select the **Lighthouse** tab.
3. Click **Analyze page load**.

Or run Lighthouse via the command line:

```bash
npx lighthouse https://example.com --view --output html
```

---

## When to Use It

- Benchmarking and optimizing static website load speed and Core Web Vitals.
- Ensuring WCAG accessibility standards and color contrast compliance.
- Verifying meta tags, headings, and SEO essentials before launching a static site.

---

[← Back to Development Tools](../README.md#development-tools) | [← Back to Static Website Toolkit](../README.md)
