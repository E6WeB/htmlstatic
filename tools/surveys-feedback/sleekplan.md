# Sleekplan

> All-in-one user feedback board, public roadmap, and changelog widget.

1. **Official Website**: <a href="https://sleekplan.com/" target="_blank" rel="noopener noreferrer">sleekplan.com</a>
2. **Category**: [Surveys & Feedback](../../README.md#surveys--feedback)
3. **Type**: Feedback Board & Roadmap Widget
4. **Pricing / License**: Freemium

- **Tags**: `sleekplan`, `in-app-feedback-board`, `public-product-roadmap`, `changelog-popup-widget`, `feature-voting`, `feedback-widget`, `embeddable-surveys`, `product-roadmap`, `changelog-widget`, `typeform-alternative`
---

## Overview

Sleekplan combines customer feedback collection, user voting boards, public product roadmaps, satisfaction surveys, and changelog announcements into a single embeddable widget.

It is particularly valuable for static SaaS websites, open-source projects, and digital products that want to interact with their user base and share progress without hosting a dynamic web app.

---

## Key Highlights & Features

1. **Feedback & Upvoting**: Let visitors submit feature requests and upvote ideas.
2. **Public Roadmap**: Showcase what features are planned, in-progress, and launched.
3. **Changelog Announcements**: Publish product updates and release notes to visitors.
4. **Compact Floating Widget**: One clean script tag that expands into an interactive portal.

---

## How It Works with Static Websites

Embed the Sleekplan widget onto any static HTML page:

```html
<script type="text/javascript">
  window.$sleek=[];window.SLEEK_PRODUCT_ID="YOUR_PRODUCT_ID";
  (function(){
    d=document;s=d.createElement("script");
    s.src="https://client.sleekplan.com/sdk/e.js";
    s.async=1;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
</script>

<!-- Optional trigger button -->
<button onclick="$sleek.open()">Give Feedback</button>
```

---

## When to Use It

1. Static product websites wanting to collect feature suggestions and bug reports.
2. Showcasing a live public roadmap and changelog to visitors.
3. Measuring customer satisfaction (CSAT) directly on static pages.
