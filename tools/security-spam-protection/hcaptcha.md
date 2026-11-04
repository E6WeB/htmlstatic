# hCaptcha

> Privacy-oriented bot detection and human verification platform.

1. **Official Website**: <a href="https://www.hcaptcha.com/" target="_blank" rel="noopener noreferrer">hcaptcha.com</a>
2. **Category**: [Security & Spam Protection](../../README.md#security--spam-protection)
3. **Type**: Privacy-Centric Bot Protection
4. **Pricing / License**: Freemium

- **Tags**: `hcaptcha`, `privacy-focused-captcha`, `gdpr-bot-mitigation`, `recaptcha-drop-in-replacement`, `bot-protection`, `captcha-alternative`, `form-spam-filter`, `privacy-captcha`, `zero-friction-security`, `freemium`
---

## Overview

hCaptcha is a widely trusted anti-bot and human verification service focused on user privacy. It protects websites from automated scrapers, credential stuffers, and spam bots while strictly adhering to privacy laws such as GDPR and CCPA.

hCaptcha offers a free tier for publishers and works with both standard HTML form posts and asynchronous JavaScript submissions.

---

## Key Highlights & Features

1. **GDPR & CCPA Compliant**: Does not sell personal user information.
2. **Reliable Threat Protection**: Blocks advanced bots and automated attacks.
3. **Passive & Challenge Modes**: Choose between subtle risk scoring or interactive checks.
4. **Broad Compatibility**: Native integrations with static form backends like Basin and Formspree.

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

1. Protecting static forms and sensitive endpoints from bot attacks.
2. Websites requiring privacy-friendly verification compliant with international laws.
3. Sites using form backends that natively verify hCaptcha tokens.
