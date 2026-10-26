# Splitform

> Contact forms and form handling designed for static websites.

- **Official Website**: <a href="https://splitforms.com/" target="_blank" rel="noopener noreferrer">splitforms.com</a>
- **Category**: [Contact Forms](../README.md#contact-forms)
- **Type**: Hosted Form Backend

---

## Overview

Splitform allows developers to collect form submissions from static HTML websites without building server-side processing scripts, maintaining email servers, or managing databases.

Point your standard HTML `<form>` tag to your unique Splitform endpoint, and submissions are automatically captured, filtered for spam, and delivered to your inbox or webhooks.

---

## Key Highlights & Features

- **No Backend Required**: Works with standard HTML form inputs and attributes.
- **Spam Protection**: Automated bot mitigation to keep inboxes clean.
- **Email Notifications**: Receive instant alerts when a visitor submits an inquiry.
- **Export Submissions**: Download inquiry logs as CSV files for bookkeeping.

---

## How It Works with Static Websites

Connect your HTML form by setting the `action` attribute to your Splitform endpoint:

```html
<form action="https://splitforms.com/f/YOUR_FORM_ID" method="POST">
  <label for="name">Your Name</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Your Email</label>
  <input type="email" id="email" name="email" required>

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>

  <button type="submit">Send Message</button>
</form>
```

---

## When to Use It

- Contact pages, lead capture forms, and survey pages on static sites.
- Portfolios and business landing pages that need clean email alerts.
- Developers who want a quick, backend-free form processing solution.

---

[← Back to Contact Forms](../README.md#contact-forms) | [← Back to Static Website Toolkit](../README.md)
