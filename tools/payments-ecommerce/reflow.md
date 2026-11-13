# Reflow

> Add complete e-commerce stores, shopping carts, subscriptions, and user authentication to static websites.

1. **Official Website**: <a href="https://reflowhq.com/" target="_blank" rel="noopener noreferrer">reflowhq.com</a>
2. **Category**: [Payments & E-commerce](../../README.md#payments--e-commerce) | [Authentication & User Management](../../README.md#authentication--user-management)
3. **Type**: E-Commerce, Subscriptions & User Authentication
4. **Pricing / License**: Freemium

- **Tags**: `reflow-hq`, `static-site-shopping-cart`, `html-data-attribute-store`, `stripe-paypal-static-cart`, `jamstack-ecommerce`, `static-ecommerce`, `digital-downloads`, `stripe-checkout`, `no-backend-store`, `sell-digital-products`
---

## Overview

Reflow is an e-commerce, subscriptions, and authentication platform built specifically for static websites, Jamstack frontends, and client-side web applications. Developed by Zine EOOD (the creators of Bootstrap Studio), Reflow allows developers and designers to add product catalogs, shopping carts, customer accounts, and recurring billing to any static HTML site without configuring a backend server or database.

Connecting directly to your existing Stripe, PayPal, or Paddle account, Reflow charges zero transaction fees on top of standard payment processing. Integration can be done entirely through drop-in HTML Web Components, vanilla JavaScript, or official React hooks.

---

## Key Highlights & Features

1. **Drop-In Static Integration**: Embed product listings, shopping carts, checkout buttons, and user login modals with simple HTML `data-reflow-type` tags.
2. **Zero Transaction Fees**: Reflow charges 0% commission on sales. Keep 100% of your revenue (minus standard payment gateway fees).
3. **Native Shopping Cart & Checkout**: Slide-out cart drawer, coupon codes, tax calculations, shipping options, and multi-currency support.
4. **Product & Order Management**: Full dashboard for managing physical goods, product variants, inventory, and digital file downloads.
5. **Subscriptions & Recurring Billing**: Create recurring subscription plans, manage free trials, handle customer upgrades, and restrict member content.
6. **Customer Authentication**: Secure user sign-in supporting Google, Apple, Facebook, X, and email/password with client-side JWT token verification.
7. **Bootstrap Studio Integration**: Native drag-and-drop e-commerce and auth components inside Bootstrap Studio.

---

## How It Works with Static Websites

### 1. Drop-In HTML Toolkit (No Build Step Required)

Include the Reflow JavaScript toolkit in your static HTML `<head>` or before `</body>`:

```html
<script src="https://api.reflowhq.com/v2/toolkit.min.js" data-reflow-store="YOUR_STORE_ID" defer></script>
```

### 2. Embed a Product List & Shopping Cart

Place pre-built Web Components anywhere in your markup:

```html
<!-- Slide-out Shopping Cart -->
<div data-reflow-type="shopping-cart"></div>

<!-- Embedded Product List -->
<div data-reflow-type="product-list" data-reflow-perpage="6"></div>

<!-- Single Product Card with Buy Button -->
<div data-reflow-type="product" data-reflow-product="PRODUCT_ID"></div>
```

### 3. Customer Sign-In & Member Content

Add customer authentication buttons with custom triggers:

```html
<!-- Customer Login / Sign-up Button -->
<div data-reflow-type="auth-button"></div>

<!-- Direct Login Link -->
<a href="#reflow-sign-in">Sign In</a>

<!-- User Profile Management -->
<div data-reflow-type="user-profile"></div>
```

---

## When to Use It

1. Adding a complete store, shopping cart, or subscription portal to static HTML/CSS/JS websites.
2. Projects built with Bootstrap Studio that want plug-and-play e-commerce and customer accounts.
3. Creators selling physical items or digital downloads without paying high 2%–5% platform commissions.
4. Membership sites and SaaS apps that need customer authentication and subscription management without backend servers.

---

## Pricing & Transaction Fees

- **Free Tier**: $0/month — core store and checkout functionality with **0% platform transaction fee**
- **Pro Plan**: $9.99/month — unlocks full commercial features while keeping **0% platform transaction fee**
- **Payment Processor Fees**: Reflow takes 0% commission; standard Stripe, PayPal, or Paddle processing fees still apply
