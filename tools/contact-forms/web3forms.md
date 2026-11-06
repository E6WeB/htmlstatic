# Web3Forms

> Contact form backend for static websites, HTML, React, Next.js, and Jamstack.

1. **Official Website**: <a href="https://web3forms.com/" target="_blank" rel="noopener noreferrer">web3forms.com</a>
2. **Category**: [Contact Forms](../../README.md#contact-forms)
3. **Type**: Form Backend & Endpoint API
4. **Pricing / License**: Freemium

- **Tags**: `web3forms`, `contact-form-backend`, `static-forms`, `jamstack-forms`, `serverless-forms`, `html-forms`, `anti-spam`, `form-api`, `email-notifications`
---

## Overview

Web3Forms (web3forms.com) is a developer-friendly contact form backend designed specifically for static websites, Jamstack applications, and single-page apps. It eliminates the need for server-side code, PHP scripts, or database setup.

To get started, developers simply request an Access Key directly via email—no account registration or login required. You drop the key into any standard HTML `<form>` or send JSON via JavaScript `fetch()`, and submissions are instantly forwarded to your inbox.

Web3Forms includes built-in anti-spam protection (honeypot fields, Cloudflare Turnstile, hCaptcha, and reCAPTCHA), support for file attachments, custom redirect thank-you pages, auto-responders, and webhook integrations.

---

## Key Highlights & Features

1. **No Account Required**: Generate an Access Key in seconds without password creation or credit card entry.
2. **Built-in Spam Protection**: Honeypot detection, Cloudflare Turnstile, hCaptcha, and Google reCAPTCHA support out of the box.
3. **Unlimited Forms**: Create and embed forms across multiple client websites and domains on the free plan.
4. **AJAX & Fetch Support**: Send submissions asynchronously via JSON or standard HTML form POST.
5. **File Uploads**: Collect user files and document attachments directly through your static forms.
6. **Webhooks & Auto-Responders**: Route submissions to Discord, Slack, Zapier, or send automated confirmation emails to users.

---

## How It Works with Static Websites

### Standard HTML Form Integration:

```html
<form action="https://api.web3forms.com/submit" method="POST">
  <!-- Replace with your Access Key -->
  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">

  <!-- Optional: Custom subject line -->
  <input type="hidden" name="subject" value="New Submission from StaticStack">

  <!-- Optional: Anti-spam honeypot (bots will fill this, real users won't) -->
  <input type="checkbox" name="botcheck" class="hidden" style="display: none;">

  <!-- Form inputs -->
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <textarea name="message" placeholder="Your Message" required></textarea>

  <button type="submit">Submit Form</button>
</form>
```

### AJAX / JavaScript Fetch Example:

```javascript
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: json
  });

  const result = await response.json();
  if (result.success) {
    alert('Thank you! Your message has been sent.');
  }
});
```

---

## When to Use It

1. Static blogs, landing pages, and portfolio websites needing zero-maintenance contact forms.
2. Client projects where rapid form deployment without database configuration is essential.
3. Jamstack applications (Hugo, Astro, Eleventy, Next.js, Gatsby, HTML5) requiring clean JSON API form endpoints.
4. Forms needing bot protection without annoying complex captcha setups.

