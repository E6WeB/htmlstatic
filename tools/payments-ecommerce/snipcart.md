# Snipcart

> Add a customizable HTML/JavaScript shopping cart and checkout to any static website using simple data attributes.

1. **Official Website**: <a href="https://snipcart.com/" target="_blank" rel="noopener noreferrer">snipcart.com</a>
2. **Category**: [Payments & E-commerce](../../README.md#payments--e-commerce)
3. **Type**: Static-Site HTML/JS Shopping Cart
4. **Pricing / License**: Paid

- **Tags**: `snipcart`, `static-site-shopping-cart`, `html-data-attribute-store`, `jamstack-ecommerce`, `static-ecommerce`, `no-backend-store`, `digital-downloads`
---

## Overview

Snipcart is a developer-friendly shopping cart built specifically for static websites and Jamstack architectures. Instead of migrating to a hosted store platform, you define products directly in your HTML using `snipcart-add-item` classes and `data-item-*` attributes, and Snipcart renders a full-featured cart and checkout overlay.

It supports physical shipping rates, digital downloads, subscriptions, multi-currency, and connects to your own payment gateway (Stripe, PayPal, Square, and others).

---

## Key Highlights & Features

1. **Pure HTML Product Definitions**: Turn any HTML `<button>` into a buyable product using `data-item-*` attributes.
2. **Full Cart & Checkout Drawer**: Includes cart management, promo codes, tax rules, and shipping calculators.
3. **Bring Your Own Gateway**: Connects directly to Stripe, PayPal, Square, Braintree, and more.
4. **Free Sandbox Mode**: Unlimited testing in development before going live.

---

## How It Works with Static Websites

Include Snipcart's CSS/JS and annotate any HTML button with product data attributes:

```html
<button class="snipcart-add-item"
  data-item-id="static-kit"
  data-item-price="29.00"
  data-item-url="/products/static-kit"
  data-item-name="Static Starter Kit">
  Add to Cart ($29)
</button>

<div hidden id="snipcart" data-api-key="YOUR_PUBLIC_API_KEY"></div>
<script async src="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.js"></script>
```

---

## When to Use It

1. Static HTML, Astro, Hugo, Eleventy, or Jekyll sites that need a true multi-item shopping cart.
2. Developers who want full control over product markup and styling without managing a backend database.
3. Stores that need custom shipping, taxes, and inventory management while staying 100% static.

---

## Pricing & Transaction Fees

- **Sandbox / Test Mode**: Free forever for development and testing
- **Production Fee**: **2% per transaction** on sales
- **Monthly Minimum**: **$20/month flat minimum** when monthly sales are under $1,000 USD (replaces the 2% fee up to $1,000/month)
- **Payment Gateway Fees**: Standard Stripe, PayPal, or Square processing fees apply separately

