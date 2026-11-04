# Sentry

> Frontend JavaScript error monitoring and performance tracing for web applications.

1. **Official Website**: <a href="https://sentry.io/" target="_blank" rel="noopener noreferrer">sentry.io</a>
2. **Category**: [Monitoring & Error Tracking](../../README.md#monitoring--error-tracking)
3. **Type**: Error Monitoring & Performance Tracking
4. **Pricing / License**: Open Source / Freemium

- **Tags**: `sentry-io`, `javascript-error-tracking`, `source-map-stack-traces`, `crash-reporting`, `release-health-monitoring`, `error-tracking`, `session-replay`, `frontend-observability`, `bug-reporting`, `rum-monitoring`
---

## Overview

Sentry provides application monitoring and real-time crash reporting for web applications. Because static websites run code on client devices with varying browsers, extensions, and screen sizes, Sentry captures uncaught JavaScript errors in real time.

It reports stack traces, browser versions, operating systems, and breadcrumbs leading up to the error, allowing developers to debug client issues without server logs.

---

## Key Highlights & Features

1. **Automatic Error Capture**: Catches uncaught runtime exceptions and promise rejections.
2. **Full Stack Traces**: Pinpoints exact lines of JavaScript where crashes occurred.
3. **User Breadcrumbs**: Logs console statements, clicks, and network requests leading to the error.
4. **Generous Developer Tier**: Free plan with thousands of monthly error events.

---

## How It Works with Static Websites

Initialize Sentry via CDN in the `<head>` of your static HTML:

```html
<!-- Sentry Browser SDK -->
<script
  src="https://js.sentry-cdn.com/YOUR_PUBLIC_KEY.min.js"
  crossorigin="anonymous">
</script>

<script>
  Sentry.onLoad(function() {
    Sentry.init({
      tracesSampleRate: 1.0,
      environment: 'production'
    });
  });
</script>
```

---

## When to Use It

1. Static sites with interactive vanilla JavaScript or third-party API integrations.
2. Tracking frontend errors that only occur on specific devices or legacy browsers.
3. Monitoring site reliability and performance metrics in production.
