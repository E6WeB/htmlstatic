# Stripe Payment Links

> Accept payments through hosted checkout pages without writing server code.

- **Official Website**: <a href="https://stripe.com/payments/payment-links" target="_blank" rel="noopener noreferrer">stripe.com/payments/payment-links</a>
- **Category**: [Payments & E-commerce](../README.md#payments--e-commerce)
- **Type**: Hosted Payment Checkouts

---

## Overview

Stripe Payment Links lets you create a full payment page in just a few clicks directly from the Stripe Dashboard. You get a shareable URL that can be attached to any button, text link, or QR code on your static website.

Stripe handles tax collection, fraud prevention (Radar), mobile wallets (Apple Pay, Google Pay), and 3D Secure authentication without requiring backend code.

---

## Key Highlights & Features

- **Zero Code Setup**: Generate checkout URLs directly inside Stripe Dashboard.
- **Digital Wallets**: Automatic support for Apple Pay, Google Pay, and credit cards.
- **Subscriptions & One-Time Payments**: Sell monthly memberships or single purchases.
- **Automated Tax & Invoicing**: Built-in tax calculation with Stripe Tax.

---

## How It Works with Static Websites

Add a Stripe Payment Link to your static site HTML:

```html
<a href="https://buy.stripe.com/YOUR_PAYMENT_LINK_ID"
   target="_blank"
   rel="noopener noreferrer"
   class="stripe-buy-button">
  Buy Product - $29
</a>
```

---

## When to Use It

- Selling single products, consulting sessions, or digital goods from a static site.
- Setting up subscription or membership billing without building a customer portal.
- Developers wanting the reliability and security of Stripe with zero backend.

---

[← Back to Payments & E-commerce](../README.md#payments--e-commerce) | [← Back to Static Website Toolkit](../README.md)
