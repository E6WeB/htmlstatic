# Emailit

> Modern email API for sending transactional messages from apps and static sites.

- **Official Website**: <a href="https://emailit.com/" target="_blank" rel="noopener noreferrer">emailit.com</a>
- **Category**: [Newsletters & Email](../../README.md#newsletters--email)
- **Type**: Transactional Email API

---

## Overview

Emailit provides reliable email API infrastructure designed for sending transactional messages, alerts, and notifications. With high deliverability standards and simple RESTful endpoints, it makes handling outbound email from web projects straightforward.

It can be integrated into static web applications through serverless functions, form handlers, or client-authenticated endpoints.

---

## Key Highlights & Features

- **High Deliverability**: Optimized routing to ensure messages reach inboxes.
- **Developer-Friendly API**: Clean REST API for sending transactional messages.
- **Real-Time Analytics**: Track deliveries, opens, bounces, and click rates.
- **Template Support**: Create and manage responsive email templates.

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

- Sending order confirmations, receipts, and user notifications.
- Static sites paired with edge functions (Cloudflare Workers, Netlify Functions).
- Developers seeking a dependable transactional email service.
