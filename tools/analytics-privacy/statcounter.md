# Statcounter

> Real-time web analytics, visitor journey tracking, and configurable page counters.

- **Official Website**: <a href="https://statcounter.com/" target="_blank" rel="noopener noreferrer">statcounter.com</a>
- **Category**: [Analytics & Privacy](../../README.md#analytics--privacy)
- **Type**: Web Analytics Platform
- **Pricing / License**: Freemium

---

## Overview

Statcounter is a classic, battle-tested web analytics platform that delivers real-time visitor tracking, detailed page performance, and visitor journey insights. Designed to be accessible and intuitive, Statcounter gives website creators direct visibility into their traffic without the cumbersome setup or confusing data models of traditional enterprise suites like Google Analytics 4.

Statcounter is particularly popular for static websites, Jamstack architectures, and independent portfolios because it requires only a small snippet added to your HTML pages and can operate either in completely invisible tracking mode or with a classic hit counter badge.

---

## Key Highlights & Features

- **Real-Time Visitor Paths**: Follow individual visitor journeys step-by-step from their entry page and referral source through to exit pages.
- **Invisible or Visible Modes**: Run silent background analytics or embed a configurable visitor badge directly into your site layout.
- **Traffic Feeds & Live Map**: View current active sessions, geolocation, operating systems, screen resolutions, and browsers live.
- **Popular Pages & Referrers**: Identify your top landing pages, search keywords, external referrers, and outbound link clicks.
- **Session Replay & Heatmaps**: Premium plans offer visual session recordings and click heatmaps to diagnose user experience issues.
- **Lightweight Integration**: Simple script addition that works seamlessly across static HTML, SSGs (Astro, 11ty, Hugo), and single-page applications.

---

## How It Works with Static Websites

Place the tracking snippet inside your HTML layout (typically before the closing `</body>` or in the footer):

```html
<!-- Statcounter Tracking Code -->
<script type="text/javascript">
var sc_project = YOUR_PROJECT_ID; 
var sc_invisible = 1; // 1 for invisible background analytics, 0 for visible counter
var sc_security = "YOUR_SECURITY_CODE"; 
</script>
<script type="text/javascript" src="https://www.statcounter.com/counter/counter.js" async></script>
<noscript>
  <div class="statcounter">
    <a title="Web Analytics" href="https://statcounter.com/" target="_blank">
      <img class="statcounter" src="https://c.statcounter.com/YOUR_PROJECT_ID/0/YOUR_SECURITY_CODE/0/" alt="Web Analytics" referrerPolicy="no-referrer-when-downgrade">
    </a>
  </div>
</noscript>
```

---

## When to Use It

- Static websites, portfolios, and blogs that need instant, hassle-free traffic metrics without server-side processing.
- Developers looking for clear visitor journey logs and referrer analysis without navigating complex Google Analytics dashboards.
- Sites that want the flexibility of displaying a public hit counter or keeping analytics completely private.
