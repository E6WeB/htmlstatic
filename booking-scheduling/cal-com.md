# Cal.com

> Open-source, embeddable meeting scheduling infrastructure for booking calls and appointments.

- **Official Website**: <a href="https://cal.com/" target="_blank" rel="noopener noreferrer">cal.com</a>
- **Category**: [Booking & Scheduling](../README.md#booking--scheduling)
- **Type**: Open Source Scheduling Infrastructure

---

## Overview

Cal.com is an open-source scheduling platform designed as a modern, customizable alternative to Calendly. It connects to Google Calendar, Outlook, and Apple Calendar to eliminate scheduling friction.

For static website creators, Cal.com provides embeddable inline widgets and modal booking buttons that integrate with simple HTML attributes, allowing visitors to schedule meetings directly on your static site.

---

## Key Highlights & Features

- **Embeddable Widgets**: Embed inline calendars or floating booking buttons on static pages.
- **Calendar Sync**: Automatic conflict avoidance across Google, Outlook, and Apple calendars.
- **Payment Integration**: Charge for consultations or client calls via Stripe.
- **Privacy & Open Source**: Self-hostable or available via hosted cloud accounts.

---

## How It Works with Static Websites

Embed a Cal.com booking widget onto your static site:

```html
<!-- Cal inline embed code -->
<div style="width:100%;height:100%;overflow:scroll" id="my-cal-inline"></div>
<script type="text/javascript">
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", {origin:"https://app.cal.com"});
  Cal("inline", {
    elementOrSelector: "#my-cal-inline",
    calLink: "YOUR_USERNAME/30min"
  });
</script>
```

---

## When to Use It

- Consultant, freelancer, and agency portfolios that book discovery calls.
- Static business landing pages requiring automated appointment scheduling.
- Privacy-conscious projects looking for an open-source scheduling alternative.

---

[← Back to Booking & Scheduling](../README.md#booking--scheduling) | [← Back to Static Website Toolkit](../README.md)
