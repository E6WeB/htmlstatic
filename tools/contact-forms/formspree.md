# Formspree

> Reliable form submissions and email notifications for static sites.

1. **Official Website**: <a href="https://formspree.io/" target="_blank" rel="noopener noreferrer">formspree.io</a>
2. **Category**: [Contact Forms](../../README.md#contact-forms)
3. **Type**: Form Endpoint Service
4. **Pricing / License**: Freemium

- **Tags**: `formspree`, `html-form-backend`, `contact-form-api`, `serverless-email-forms`, `ajax-submissions`, `static-site-forms`, `serverless-forms`, `static-html-form`, `form-backend`, `email-notifications`
---

## Overview

Formspree is one of the most widely used form processing services for static and Jamstack websites. It replaces server-side form handling with a clean HTTP endpoint.

Submissions are scanned for spam via reCAPTCHA and custom rules, forwarded to your email, and can be integrated into Slack, Google Sheets, Mailchimp, or custom webhooks.

---

## Key Highlights & Features

1. **Zero-Code Backend**: Connect any HTML or JavaScript AJAX form in minutes.
2. **Integrations**: Connect submissions to Slack, Discord, Google Sheets, and Trello.
3. **AJAX & Redirect Support**: Submit via `fetch()` for custom UI feedback or standard redirects.
4. **File Uploads**: Collect attachments and file uploads directly through forms.

---

## How It Works with Static Websites

Standard HTML form submission:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="email" name="email" placeholder="Your email" required>
  <textarea name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send</button>
</form>
```

Or submit using JavaScript `fetch`:

```javascript
const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify({ email: "user@example.com", message: "Hello!" })
});
```

---

## When to Use It

1. Static blogs, documentation sites, and client websites needing robust forms.
2. Forms requiring third-party integrations (Slack, Google Sheets, Zapier).
3. Advanced forms requiring file attachment handling.
