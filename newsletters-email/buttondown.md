# Buttondown

> Privacy-friendly newsletter publishing and subscriber management for developers.

- **Official Website**: <a href="https://buttondown.com/" target="_blank" rel="noopener noreferrer">buttondown.com</a>
- **Category**: [Newsletters & Email](../README.md#newsletters--email)
- **Type**: Newsletter Publishing Platform

---

## Overview

Buttondown is an elegant, privacy-first newsletter tool designed for creators and developers who write in Markdown. It makes collecting subscribers from static blogs and websites simple, offering clean HTML embed forms that require zero JavaScript.

With Buttondown, you can write newsletters in Markdown, track analytics without intrusive trackers, and automate emails via RSS.

---

## Key Highlights & Features

- **No-JS Embed Forms**: Pure HTML subscribe forms that work without external scripts.
- **Markdown-Native**: Write and send newsletters entirely in Markdown.
- **Privacy First**: Built-in features to strip tracking pixels and protect reader privacy.
- **RSS-to-Email**: Automatically send newsletters whenever your static blog publishes.

---

## How It Works with Static Websites

Add a lightweight subscription form to your static website:

```html
<form action="https://buttondown.email/api/emails/embed-subscribe/YOUR_USERNAME"
      method="post"
      target="popupwindow"
      onsubmit="window.open('https://buttondown.email/YOUR_USERNAME', 'popupwindow')"
      class="embeddable-buttondown-form">
  <label for="bd-email">Enter your email</label>
  <input type="email" name="email" id="bd-email" placeholder="you@example.com" required>
  <input type="submit" value="Subscribe">
</form>
```

---

## When to Use It

- Developer blogs, engineering newsletters, and personal sites.
- Static sites prioritizing fast load times with pure HTML form embeds.
- Writers who prefer drafting in Markdown without bulky WYSIWYG editors.
