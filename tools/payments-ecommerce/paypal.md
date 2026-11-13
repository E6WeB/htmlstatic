# PayPal

> Create payment links, buy-now buttons, and checkout modals for static websites with no backend required.

1. **Official Website**: <a href="https://www.paypal.com/" target="_blank" rel="noopener noreferrer">paypal.com</a>
2. **Category**: [Payments & E-commerce](../../README.md#payments--e-commerce)
3. **Type**: Payment Links, Buttons & Online Checkout
4. **Pricing / License**: Freemium

- **Tags**: `paypal`, `paypal-checkout`, `paypal-buy-button`, `paypal-payment-links`, `venmo-checkout`, `static-ecommerce`, `digital-downloads`, `no-backend-store`, `sell-digital-products`
---

## Overview

PayPal lets static website owners accept online payments, donations, and recurring subscriptions using hosted Payment Links, no-code Buy Now buttons, or the embeddable PayPal JavaScript SDK. Visitors can pay with a PayPal balance, Venmo, Pay Later, or credit/debit cards without you needing a backend server.

From the PayPal Dashboard, you can generate a shareable link or copy-paste HTML/JS button code directly into any static page.

---

## Key Highlights & Features

1. **No-Code Payment Links & Buttons**: Generate Buy Now, Subscribe, or Donate buttons and shareable checkout links directly from your PayPal Business account.
2. **Multiple Payment Methods**: Supports PayPal Wallet, Venmo, Pay Later (BNPL), and guest credit/debit card checkout.
3. **Client-Side JavaScript SDK**: Render smart payment buttons directly on your static HTML page with modal checkout.
4. **Global Reach**: Accepted in 200+ markets with automatic currency conversion.

---

## How It Works with Static Websites

Add a PayPal Smart Payment Button or hosted Payment Link to your static HTML:

```html
<!-- Option 1: Hosted Payment Link -->
<a href="https://www.paypal.com/ncp/payment/YOUR_LINK_ID"
   target="_blank"
   rel="noopener noreferrer"
   class="paypal-buy-button">
  Buy Now with PayPal
</a>

<!-- Option 2: PayPal JS SDK Smart Buttons -->
<div id="paypal-button-container"></div>
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
<script>
  paypal.Buttons({
    createOrder: (data, actions) => actions.order.create({
      purchase_units: [{ amount: { value: '29.00' } }]
    }),
    onApprove: (data, actions) => actions.order.capture()
  }).render('#paypal-button-container');
</script>
```

---

## When to Use It

1. Adding a quick Buy Now, Donate, or Subscribe button to a static HTML page with zero server setup.
2. Offering trusted PayPal, Venmo, and Pay Later checkout alongside or instead of card-only forms.
3. Selling products, services, or accepting donations globally with no monthly subscription fee.

---

## Pricing & Transaction Fees

- **Monthly Fee**: $0/month (no setup or monthly fee for a standard PayPal Business account)
- **PayPal Checkout / Venmo (US)**: 3.49% + $0.49 per transaction
- **Standard Credit & Debit Cards (Guest Checkout)**: 2.99% + $0.49 per transaction
- **Advanced Card Fields**: 2.89% + $0.29 per transaction
- **Pay Later (BNPL)**: 4.99% + $0.49 per transaction
- **International Surcharge**: +1.50% for cross-border transactions

