# Emailit

> Modern email API for sending transactional messages from apps and static sites.

1. **Official Website**: <a href="https://emailit.com/" target="_blank" rel="noopener noreferrer">emailit.com</a>
2. **Category**: [Newsletters & Email](../../README.md#newsletters--email)
3. **Type**: Transactional Email API
4. **Pricing / License**: Freemium

- **Tags**: `emailit`, `developer-email-api`, `rest-smtp-sending`, `serverless-transactional-email`, `pay-as-you-go-email`, `newsletter-embed`, `transactional-email`, `email-api`, `subscriber-growth`, `mailchimp-alternative`
---

## Overview

Emailit provides reliable email API infrastructure designed for sending transactional messages, alerts, and notifications. With high deliverability standards and simple RESTful endpoints, it makes handling outbound email from web projects straightforward.

It can be integrated into static web applications through serverless functions, form handlers, or client-authenticated endpoints.

---

## Key Highlights & Features

1. **High Deliverability**: Optimized routing to ensure messages reach inboxes.
2. **Developer-Friendly API**: Clean REST API for sending transactional messages.
3. **Real-Time Analytics**: Track deliveries, opens, bounces, and click rates.
4. **Template Support**: Create and manage responsive email templates.

---

## How It Works with Static Websites

Example call sending a transactional message via a serverless function:

```javascript
const response = await fetch("https://api.emailit.com/v1/emails", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    to: "customer@example.com",
    from: "hello@yourdomain.com",
    subject: "Order Confirmation",
    html: "<p>Thank you for your order!</p>"
  })
});
```

---

## When to Use It

1. Sending order confirmations, receipts, and user notifications.
2. Static sites paired with edge functions (Cloudflare Workers, Netlify Functions).
3. Developers seeking a dependable transactional email service.
