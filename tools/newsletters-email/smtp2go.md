# SMTP2GO

> Reliable transactional email delivery service and API with real-time analytics, SPF/DKIM authentication, and global infrastructure.

1. **Official Website**: <a href="https://www.smtp2go.com/" target="_blank" rel="noopener noreferrer">smtp2go.com</a>
2. **Category**: [Newsletters & Email](../../README.md#newsletters--email)
3. **Type**: Transactional Email Service & REST API
4. **Pricing / License**: Freemium (1,000 free emails/month)

- **Tags**: `smtp2go`, `transactional-email-api`, `smtp-relay`, `email-deliverability`, `serverless-email`, `dkim-spf-automation`, `email-notifications`, `transactional-email`, `email-api`, `newsletter-embed`
---

## Overview

SMTP2GO is a dedicated transactional email service built for high deliverability, real-time tracking, and simple integration. It provides both a traditional SMTP relay and a modern HTTP REST API, making it easy to send order confirmations, password resets, contact form alerts, and system notifications without hosting a mail server.

For static website developers, SMTP2GO can be called directly from edge workers, serverless functions (Cloudflare Workers, Netlify Functions, Vercel Edge), or form-handling webhooks with straightforward JSON payloads.

---

## Key Highlights & Features

1. **High Deliverability & Authentication**: Built-in automated setup for SPF, DKIM, and DMARC protocols with automatic blacklist monitoring and spam-trap alerts.
2. **REST API & SMTP Relay**: Send messages via simple JSON POST requests or configure standard SMTP credentials.
3. **Generous Free Tier**: Send up to 1,000 emails per month completely free (with 5 days of searchable delivery reporting).
4. **Real-Time Analytics**: Visual tracking for email opens, click rates, bounces, spam complaints, and unsubscribe events.
5. **Fast Global Infrastructure**: Multi-datacenter routing ensures rapid message delivery across international networks.
6. **Subaccount & Multi-Domain Support**: Manage different client websites or projects under isolated sender domains.

---

## How It Works with Static Websites

You can send emails directly from a lightweight serverless function or static form handler:

```javascript
// Example: Sending email via SMTP2GO REST API in a serverless function
const response = await fetch("https://api.smtp2go.com/v3/email/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    api_key: "YOUR_API_KEY",
    to: ["recipient@example.com"],
    sender: "notifications@yourdomain.com",
    subject: "New Contact Form Submission",
    text_body: "You received a new message from your static website.",
    html_body: "<h1>New Message</h1><p>You received a new message from your static website.</p>"
  })
});

const data = await response.json();
console.log(data);
```

---

## When to Use It

1. Sending automated transactional notifications from static contact forms and checkout webhooks.
2. Replacing unreliable local `sendmail` or shared hosting mailers with a dedicated, authenticated relay.
3. Monitoring delivery and bounce telemetry for static site client forms.
4. Projects needing a permanent free tier for up to 1,000 transactional emails each month.
