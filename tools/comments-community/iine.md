# iine

> Lightweight, privacy-first appreciation and like button widget without tracking.

1. **Official Website**: <a href="https://iine.to/" target="_blank" rel="noopener noreferrer">iine.to</a>
2. **Category**: [Comments & Community](../../README.md#comments--community)
3. **Type**: Open Source Reaction & Like Button Widget
4. **Pricing / License**: Free

- **Tags**: `like-button`, `reactions`, `appreciation`, `privacy-first`, `widget`, `open-source`, `like-button-widget`, `clap-button`, `appreciation-counter`, `privacy-first-likes`
---

## Overview

**いいね (iine)** is a lightweight, privacy-respecting like and appreciation button built specifically for blogs, documentation, and the indie web. It enables visitors to express appreciation with a single click—no accounts, no trackers, and zero personal data collection.

Unlike traditional social reaction widgets that load heavy third-party tracking scripts, cookies, or fingerprinting beacons, iine stores no IP addresses, user agents, or individual timestamps. It operates simply as an anonymous counter that increments per page slug.

---

## Key Highlights & Features

1. **Zero Tracking & Privacy-First**: No personal data, cookies, timestamps, or IP addresses collected.
2. **Ultra Lightweight**: Minimal client-side JavaScript (~3.7 KB) with zero third-party framework dependencies.
3. **100% Free & Open Source**: AGPL-licensed; free hosted backend provided for small web creators, with simple self-hosting on Supabase.
4. **Customizable Icons**: Built-in support for thumbs up, hearts, upvotes, or custom emoji.
5. **Works Without JavaScript**: Supports progressive enhancement via standard HTML form submission.
6. **Smooth Animations & Micro-Interactions**: Tactile button feedback with filled icon states and interactive counters.

---

## How It Works with Static Websites

### 1. Simple Drop-in Setup (JavaScript)

Add the script before your closing `</body>` tag and place the button anywhere on your static page:

```html
<!-- Include script -->
<script defer src="https://cdn.jsdelivr.net/gh/welpo/iine@main/iine.mini.js"></script>

<!-- Add the button -->
<button class="iine-button" data-icon="thumbs_up" data-slug="/your-page" aria-label="Like this post"></button>
```

### 2. Progressive Enhancement (Works Without JavaScript)

For environments with JavaScript disabled or strict noscript policies, embed an accessible form action:

```html
<form action="https://YOUR_PROJECT.supabase.co/rest/v1/rpc/increment_hits?apikey=YOUR_PUBLISHABLE_KEY" method="post">
  <input type="hidden" name="page_slug" value="/your-page">
  <button type="submit" class="iine-button" data-icon="thumbs_up" aria-label="Send appreciation">
    <noscript>👍</noscript>
  </button>
</form>
```

---

## When to Use It

1. Static blogs, personal portfolios, and digital gardens looking for lightweight reader feedback.
2. Documentation sites wanting quick "Was this helpful?" thumbs-up appreciation.
3. Privacy-conscious web developers who avoid intrusive analytics and cookies.
