# Formspree

> Reliable form submissions and email notifications for static sites.

- **Official Website**: <a href="https://formspree.io/" target="_blank" rel="noopener noreferrer">formspree.io</a>
- **Category**: [Contact Forms](../../README.md#contact-forms)
- **Type**: Form Endpoint Service

---

## Overview

Formspree is one of the most widely used form processing services for static and Jamstack websites. It replaces server-side form handling with a clean HTTP endpoint.

Submissions are scanned for spam via reCAPTCHA and custom rules, forwarded to your email, and can be integrated into Slack, Google Sheets, Mailchimp, or custom webhooks.

---

## Key Highlights & Features

- **Zero-Code Backend**: Connect any HTML or JavaScript AJAX form in minutes.
- **Integrations**: Connect submissions to Slack, Discord, Google Sheets, and Trello.
- **AJAX & Redirect Support**: Submit via `fetch()` for custom UI feedback or standard redirects.
- **File Uploads**: Collect attachments and file uploads directly through forms.

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

- Static blogs, documentation sites, and client websites needing robust forms.
- Forms requiring third-party integrations (Slack, Google Sheets, Zapier).
- Advanced forms requiring file attachment handling.
