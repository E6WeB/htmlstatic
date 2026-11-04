# Tally

> Intuitive form and survey builder with unlimited free forms and embeds.

1. **Official Website**: <a href="https://tally.so/" target="_blank" rel="noopener noreferrer">tally.so</a>
2. **Category**: [Surveys & Feedback](../../README.md#surveys--feedback)
3. **Type**: Form & Survey Builder
4. **Pricing / License**: Freemium

- **Tags**: `tally-so`, `notion-style-form-builder`, `unlimited-free-forms`, `conditional-logic-surveys`, `typeform-free-alternative`, `feedback-widget`, `embeddable-surveys`, `product-roadmap`, `changelog-widget`, `typeform-alternative`
---

## Overview

Tally is a modern form builder that works like a Notion document: you just type on the page to build beautiful forms, customer surveys, application flows, and waitlists.

Tally offers an exceptionally generous free tier (unlimited forms and responses) and provides responsive embed widgets (inline or popup modal) that integrate into static websites with one script tag.

---

## Key Highlights & Features

1. **Unlimited Forms & Submissions**: Free tier includes unlimited forms and responses.
2. **Notion-Like Experience**: Build forms by simply typing and using slash commands (`/`).
3. **Seamless Embeds**: Embed as inline frames, popup modals, slide-ins, or full pages.
4. **Webhooks & Integrations**: Send submissions to Google Sheets, Notion, Airtable, or webhooks.

---

## How It Works with Static Websites

Embed a Tally survey or waitlist into your static HTML:

```html
<!-- Tally inline embed -->
<iframe data-tally-src="https://tally.so/embed/YOUR_FORM_ID?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        width="100%"
        height="280"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        title="Customer Feedback Survey">
</iframe>
<script>var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}</script>
```

---

## When to Use It

1. Customer feedback surveys, NPS scores, and event registration on static websites.
2. Lead capture and waitlists for upcoming static product launches.
3. Complex multi-step surveys requiring conditional logic without building custom forms.
