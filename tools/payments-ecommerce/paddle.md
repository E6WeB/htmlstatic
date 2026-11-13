# Paddle

> Merchant of Record billing infrastructure with embeddable overlay checkouts, subscriptions, and global tax compliance.

1. **Official Website**: <a href="https://www.paddle.com/" target="_blank" rel="noopener noreferrer">paddle.com</a>
2. **Category**: [Payments & E-commerce](../../README.md#payments--e-commerce)
3. **Type**: Merchant of Record & SaaS Billing
4. **Pricing / License**: Freemium

- **Tags**: `paddle`, `merchant-of-record`, `paddle-js`, `saas-billing`, `global-vat-tax-compliance`, `overlay-checkout-embed`, `static-ecommerce`, `no-backend-store`
---

## Overview

Paddle is a complete Merchant of Record (MoR) platform designed for SaaS products, software licenses, and digital goods. Paddle acts as the reseller on every transaction—handling global sales tax, VAT, GST, fraud protection, chargebacks, and multi-currency checkouts in 200+ regions.

With **Paddle.js**, static websites and client-side apps can open an inline or overlay checkout modal directly on the page.

---

## Key Highlights & Features

1. **Full Merchant of Record**: Offloads global tax calculation, filing, remittance, and compliance across 200+ jurisdictions.
2. **Paddle.js Overlay Checkout**: Trigger localized modal checkouts directly from any HTML button.
3. **Subscription & Trial Engine**: Built-in recurring billing, upgrades/downgrades, proration, and dunning.
4. **Fraud & Chargeback Protection**: Absorbs chargeback liability and handles buyer billing support.

---

## How It Works with Static Websites

Load `paddle.js` and open an overlay checkout from a button click:

```html
<script src="https://cdn.paddle.com/paddle/v2/paddle.js"></script>
<script>
  Paddle.Initialize({ token: 'YOUR_CLIENT_SIDE_TOKEN' });

  function openCheckout() {
    Paddle.Checkout.open({
      items: [{ priceId: 'pri_YOUR_PRICE_ID', quantity: 1 }]
    });
  }
</script>

<button onclick="openCheckout()">Buy Now</button>
```

---

## When to Use It

1. SaaS apps, desktop tools, and digital products selling globally without wanting to register for VAT/GST worldwide.
2. Static product landing pages needing a localized multi-currency overlay checkout.
3. Subscription businesses wanting built-in proration, trials, and invoice management.

---

## Pricing & Transaction Fees

- **Monthly Fee**: $0/month (pay-as-you-go)
- **Standard Transaction Fee**: **5% + $0.50** per checkout transaction (includes global tax compliance, fraud/chargeback handling, and multi-currency support)
- **Low-Ticket & Enterprise**: Custom pricing available for products under $10 or high-volume accounts
- **Payouts**: Local ACH/SEPA payouts are free ($100 minimum); wire transfers ($15) or currency conversion (~1.5%) may apply if payout currency differs

