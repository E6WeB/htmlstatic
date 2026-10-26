# Google reCAPTCHA

> Industry-standard bot detection and abuse prevention service.

- **Official Website**: <a href="https://cloud.google.com/security/products/recaptcha" target="_blank" rel="noopener noreferrer">cloud.google.com/security/products/recaptcha</a>
- **Category**: [Security & Spam Protection](../README.md#security--spam-protection)
- **Type**: Bot Mitigation & Verification

---

## Overview

Google reCAPTCHA protects websites against fraud and abuse using advanced risk analysis engines. It assesses interactions across pages to distinguish human visitors from automated programs.

Available as reCAPTCHA v2 (checkbox / image challenge) and reCAPTCHA v3 (invisible score-based validation), it is natively supported by virtually all third-party form processing backends.

---

## Key Highlights & Features

- **Advanced Machine Learning**: Defends against complex bots and spam scripts.
- **Invisible Scoring (v3)**: Returns a score based on user interactions without interrupting user flow.
- **Universal Support**: Integrates out-of-the-box with Formspree, Basin, and email APIs.
- **Free Tier**: Generous monthly free allowance for standard web properties.

---

## How It Works with Static Websites

Example reCAPTCHA v2 checkbox widget in an HTML form:

```html
<!-- Load reCAPTCHA script -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" required>
  <div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
  <button type="submit">Submit</button>
</form>
```

---

## When to Use It

- Forms experiencing heavy automated spam or credential stuffing.
- Sites integrated with hosted form services with built-in reCAPTCHA secret verification.

---

[← Back to Security & Spam Protection](../README.md#security--spam-protection) | [← Back to Static Website Toolkit](../README.md)
