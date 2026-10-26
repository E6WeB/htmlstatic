# Tally

> Intuitive form and survey builder with unlimited free forms and embeds.

- **Official Website**: <a href="https://tally.so/" target="_blank" rel="noopener noreferrer">tally.so</a>
- **Category**: [Surveys & Feedback](../README.md#surveys--feedback)
- **Type**: Form & Survey Builder

---

## Overview

Tally is a modern form builder that works like a Notion document: you just type on the page to build beautiful forms, customer surveys, application flows, and waitlists.

Tally offers an exceptionally generous free tier (unlimited forms and responses) and provides responsive embed widgets (inline or popup modal) that integrate into static websites with one script tag.

---

## Key Highlights & Features

- **Unlimited Forms & Submissions**: Free tier includes unlimited forms and responses.
- **Notion-Like Experience**: Build forms by simply typing and using slash commands (`/`).
- **Seamless Embeds**: Embed as inline frames, popup modals, slide-ins, or full pages.
- **Webhooks & Integrations**: Send submissions to Google Sheets, Notion, Airtable, or webhooks.

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

- Customer feedback surveys, NPS scores, and event registration on static websites.
- Lead capture and waitlists for upcoming static product launches.
- Complex multi-step surveys requiring conditional logic without building custom forms.
