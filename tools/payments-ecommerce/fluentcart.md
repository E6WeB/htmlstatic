# FluentCart

> Headless-ready WordPress e-commerce plugin with REST APIs and direct Buy Links for external static websites.

1. **Official Website**: <a href="https://fluentcart.com/" target="_blank" rel="noopener noreferrer">fluentcart.com</a>
2. **Category**: [Payments & E-commerce](../../README.md#payments--e-commerce)
3. **Type**: WordPress Headless E-Commerce & Checkout Links
4. **Pricing / License**: Freemium

- **Tags**: `fluentcart`, `headless-ecommerce`, `wordpress-rest-api`, `buy-links`, `zero-transaction-fee`, `static-ecommerce`, `digital-downloads`, `subscriptions`
---

## Overview

FluentCart is a performance-focused WordPress e-commerce plugin with a headless-capable REST API (`fluent-cart/v2`) and direct **Buy Links**. While it **requires a WordPress backend** to run the store engine (unlike standalone SaaS embeds), static HTML websites can fetch product catalogs via the REST API and link Buy Now buttons directly to FluentCart's checkout.

FluentCart charges **0% platform transaction fees** on both its Free and Pro tiers, connecting directly to Stripe, PayPal, and other payment gateways.

---

## Key Highlights & Features

1. **0% Platform Transaction Fees**: FluentCart never takes a cut of your sales on Free or Pro plans.
2. **Headless REST API**: Query products, pricing, variations, and orders from `/wp-json/fluent-cart/v2/products` to render items in static HTML.
3. **Direct Buy Links**: Generate pre-configured checkout URLs (with optional coupons) to attach to any static HTML button.
4. **WordPress Backend Required**: Requires self-hosting WordPress with the FluentCart plugin; not a zero-backend SaaS widget.

---

## How It Works with Static Websites

Fetch products from your WordPress FluentCart REST API and link to a direct checkout URL:

```html
<div id="fc-products"></div>
<script>
  fetch('https://your-wordpress-site.com/wp-json/fluent-cart/v2/products')
    .then(r => r.json())
    .then(data => {
      const items = data.products || data.data || [];
      document.getElementById('fc-products').innerHTML = items.map(p => `
        <div class="product-card">
          <h3>${p.post_title || p.title}</h3>
          <a href="${p.checkout_url || p.guid}">Buy Now</a>
        </div>
      `).join('');
    });
</script>
```

---

## When to Use It

1. You already run a WordPress backend and want to sell products from a separate static HTML/Jamstack frontend.
2. You want **0% platform transaction fees** while keeping full control over your product and order data.
3. Landing pages linking directly to FluentCart's fast one-page checkout via Buy Links.

---

## Pricing & Transaction Fees

- **Free Plugin (WordPress.org)**: $0 — includes physical/digital products, subscriptions, coupons, Stripe, and PayPal with **0% platform transaction fee**
- **FluentCart Pro**: Paid license — adds software license keys, order bumps, dynamic pricing, EU VAT/OSS tools, and extra gateways (Mollie, Razorpay, Authorize.net)
- **Payment Processor Fees**: 0% fee from FluentCart; standard Stripe/PayPal processing fees still apply
- **Hosting Requirement**: Requires a WordPress site to host the FluentCart plugin

