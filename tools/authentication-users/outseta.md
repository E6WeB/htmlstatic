# Outseta

> All-in-one membership, authentication, payments, and CRM for static websites.

- **Official Website**: <a href="https://outseta.com/" target="_blank" rel="noopener noreferrer">outseta.com</a>
- **Category**: [Authentication & User Management](../../README.md#authentication--user-management)
- **Type**: Membership & Gated Content Platform

---

## Overview

Outseta is an all-in-one membership platform designed specifically for static websites, Webflow, and Jamstack projects. It unifies user login, subscriber billing, gated content, CRM, email newsletters, and customer support into a single embed script.

By simply adding a script tag and a few HTML data attributes, you can turn any static HTML website into a fully functioning membership business.

---

## Key Highlights & Features

- **No-Code Content Gating**: Protect pages or specific HTML sections using CSS selectors.
- **Integrated Billing**: Collect one-time payments or monthly recurring subscriptions via Stripe.
- **Drop-In Auth Widgets**: Embed modal login and sign-up forms with zero custom code.
- **Built-in Email & CRM**: Track member activity and send automated onboarding emails.

---

## How It Works with Static Websites

Add the Outseta script to your static HTML `<head>`:

```html
<script
  src="https://cdn.outseta.com/outseta.min.js"
  data-options="YOUR_OUTSETA_SUBDOMAIN"
  defer>
</script>

<!-- Outseta popup login trigger link -->
<a href="#o-auth-login">Log In</a>

<!-- Outseta popup registration trigger link -->
<a href="#o-auth-register">Sign Up</a>

<!-- Gated content visible only to logged-in members -->
<div data-o-auth="required">
  <h2>Members Only Content</h2>
  <p>Exclusive resources for subscribers.</p>
</div>
```

---

## When to Use It

- Monetizing static websites with paid memberships or premium gated content.
- Creators who want authentication, Stripe payments, and email marketing in one embed.
- Agencies building client membership sites without WordPress membership plugins.
