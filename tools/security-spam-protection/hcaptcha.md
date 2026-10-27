# hCaptcha

> Privacy-oriented bot detection and human verification platform.

- **Official Website**: <a href="https://www.hcaptcha.com/" target="_blank" rel="noopener noreferrer">hcaptcha.com</a>
- **Category**: [Security & Spam Protection](../../README.md#security--spam-protection)
- **Type**: Privacy-Centric Bot Protection

---

## Overview

hCaptcha is a widely trusted anti-bot and human verification service focused on user privacy. It protects websites from automated scrapers, credential stuffers, and spam bots while strictly adhering to privacy laws such as GDPR and CCPA.

hCaptcha offers a free tier for publishers and works with both standard HTML form posts and asynchronous JavaScript submissions.

---

## Key Highlights & Features

- **GDPR & CCPA Compliant**: Does not sell personal user information.
- **Reliable Threat Protection**: Blocks advanced bots and automated attacks.
- **Passive & Challenge Modes**: Choose between subtle risk scoring or interactive checks.
- **Broad Compatibility**: Native integrations with static form backends like Basin and Formspree.

---

## How It Works with Static Websites

Embed hCaptcha into your static form:

```html
<!-- Load hCaptcha script -->
<script src="https://js.hcaptcha.com/1/api.js" async defer></script>

<!-- Add widget into form -->
<form action="https://your-form-backend.com/f/..." method="POST">
  <input type="text" name="name" required>
  <div class="h-captcha" data-sitekey="YOUR_SITE_KEY"></div>
  <button type="submit">Send</button>
</form>
```

---

## When to Use It

- Protecting static forms and sensitive endpoints from bot attacks.
- Websites requiring privacy-friendly verification compliant with international laws.
- Sites using form backends that natively verify hCaptcha tokens.
