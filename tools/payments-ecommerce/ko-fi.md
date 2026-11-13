# Ko-fi

> Accept tips, donations, memberships, and digital shop sales on static websites with zero platform fees on donations.

1. **Official Website**: <a href="https://ko-fi.com/" target="_blank" rel="noopener noreferrer">ko-fi.com</a>
2. **Category**: [Payments & E-commerce](../../README.md#payments--e-commerce)
3. **Type**: Donations, Memberships & Digital Shop
4. **Pricing / License**: Freemium

- **Tags**: `ko-fi`, `tip-jar`, `donations-widget`, `creator-memberships`, `sell-digital-products`, `static-ecommerce`, `no-backend-store`
---

## Overview

Ko-fi gives creators, open-source maintainers, and bloggers an easy way to accept one-time tips, recurring memberships, commissions, and digital product sales. Payments go directly into your connected Stripe or PayPal account.

For static HTML websites, Ko-fi provides an embeddable floating tip button, inline donation widget, and direct checkout links.

---

## Key Highlights & Features

1. **0% Fee on One-Time Donations**: Keep 100% of one-time tips (minus Stripe/PayPal processing fees) on the free plan.
2. **Embeddable Floating Widget**: Drop a floating support button onto any static page with a few lines of JS.
3. **Direct Payouts**: Funds route directly to your PayPal or Stripe account without waiting for monthly payout thresholds.
4. **Shop & Memberships**: Sell digital downloads or recurring supporter tiers from one link.

---

## How It Works with Static Websites

Embed Ko-fi's floating donation widget before `</body>`:

```html
<script src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"></script>
<script>
  kofiWidgetOverlay.draw('YOUR_KOFI_USERNAME', {
    'type': 'floating-chat',
    'floating-chat.donateButton.text': 'Support me',
    'floating-chat.donateButton.background-color': '#00b9fe',
    'floating-chat.donateButton.text-color': '#fff'
  });
</script>
```

---

## When to Use It

1. Open-source projects, blogs, and indie creators accepting tips or sponsorships.
2. Static sites wanting a lightweight donation widget without paying a platform fee on one-time tips.
3. Selling small digital downloads or supporter memberships alongside a static portfolio.

---

## Pricing & Transaction Fees

- **Free Plan**: $0/month — **0% platform fee** on one-time donations; **5% platform fee** on shop sales, memberships, commissions, and monthly tips
- **Ko-fi Gold**: ~$12/month — removes the 5% platform fee across shop sales, memberships, and commissions
- **Payment Processor Fees**: Standard Stripe or PayPal processing fees (typically ~2.9%–3% + $0.30) apply to all payments

