# Basin

> Hosted form backend built for static websites, developers, and agencies.

- **Official Website**: <a href="https://usebasin.com/" target="_blank" rel="noopener noreferrer">usebasin.com</a>
- **Category**: [Contact Forms](../README.md#contact-forms)
- **Type**: Developer Form Backend

---

## Overview

Basin (usebasin.com) provides dependable form endpoint infrastructure designed specifically for static sites, digital agencies, and Jamstack developers.

It features white-label email notifications, advanced spam filtering (including hCaptcha and Google reCAPTCHA), file storage, custom redirect pages, and webhook triggers.

---

## Key Highlights & Features

- **Anti-Spam Controls**: Integrated honeypot fields, reCAPTCHA, and hCaptcha support.
- **Custom Redirects**: Seamlessly forward visitors to a dedicated thank-you page.
- **File Attachments**: Securely handle uploaded documents, images, and archives.
- **Webhooks & API**: Export data or pipe submissions directly into your CRM.

---

## How It Works with Static Websites

Example form integration pointing to Basin:

```html
<form action="https://usebasin.com/f/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" placeholder="Name" required>
  <input type="email" name="email" placeholder="Email" required>
  <textarea name="comments" placeholder="Comments"></textarea>
  <button type="submit">Submit</button>
</form>
```

---

## When to Use It

- Agency projects delivering static websites to clients with reliable form handling.
- Forms that require file attachment support and custom thank-you redirects.
- Sites requiring custom anti-spam rules and webhook automation.
