# Sentry

> Frontend JavaScript error monitoring and performance tracing for web applications.

- **Official Website**: <a href="https://sentry.io/" target="_blank" rel="noopener noreferrer">sentry.io</a>
- **Category**: [Monitoring & Error Tracking](../../README.md#monitoring--error-tracking)
- **Type**: Error Monitoring & Performance Tracking

---

## Overview

Sentry provides application monitoring and real-time crash reporting for web applications. Because static websites run code on client devices with varying browsers, extensions, and screen sizes, Sentry captures uncaught JavaScript errors in real time.

It reports stack traces, browser versions, operating systems, and breadcrumbs leading up to the error, allowing developers to debug client issues without server logs.

---

## Key Highlights & Features

- **Automatic Error Capture**: Catches uncaught runtime exceptions and promise rejections.
- **Full Stack Traces**: Pinpoints exact lines of JavaScript where crashes occurred.
- **User Breadcrumbs**: Logs console statements, clicks, and network requests leading to the error.
- **Generous Developer Tier**: Free plan with thousands of monthly error events.

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

- Static sites with interactive vanilla JavaScript or third-party API integrations.
- Tracking frontend errors that only occur on specific devices or legacy browsers.
- Monitoring site reliability and performance metrics in production.
