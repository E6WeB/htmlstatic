# Cloudflare Turnstile

> Privacy-friendly, frustration-free CAPTCHA alternative.

- **Official Website**: <a href="https://developers.cloudflare.com/turnstile/" target="_blank" rel="noopener noreferrer">developers.cloudflare.com/turnstile</a>
- **Category**: [Security & Spam Protection](../README.md#security--spam-protection)
- **Type**: Invisible CAPTCHA Alternative

---

## Overview

Cloudflare Turnstile is a smart, privacy-first alternative to traditional CAPTCHAs. It verifies that visitors are human without forcing them through tedious image puzzles or tracking their browsing history across the web.

Turnstile is free to use, works on any website, and can be integrated into static HTML contact forms or newsletter boxes in minutes.

---

## Key Highlights & Features

- **No Puzzles for Users**: Validates real users invisibly or with a simple checkbox.
- **Privacy Respecting**: Does not harvest user data or track visitors across the web.
- **100% Free**: Available to all site owners without billing requirements.
- **Simple Drop-In**: Works effortlessly with static forms and AJAX submissions.

---

## How It Works with Static Websites

Add Turnstile to your static HTML form:

```html
<!-- Include Turnstile script in head -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<!-- Add Turnstile widget inside form -->
<form action="https://your-form-backend.com/f/..." method="POST">
  <input type="email" name="email" required>
  <div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>
  <button type="submit">Submit</button>
</form>
```

---

## When to Use It

- Protecting contact forms, comments, and signup forms from spam bots.
- Websites that want to ditch frustrating image selection puzzles.
- Privacy-conscious projects seeking an ethical anti-abuse solution.
