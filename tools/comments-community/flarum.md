# Flarum

> Modern, lightweight open-source community forum platform.

- **Official Website**: <a href="https://flarum.org/" target="_blank" rel="noopener noreferrer">flarum.org</a>
- **Category**: [Comments & Community](../../README.md#comments--community)
- **Type**: Open Source Community Forum

---

## Overview

Flarum is a modern, delightfully simple open-source forum platform designed to make online discussions fast, engaging, and effortless. Built on top of a single-page application (SPA) architecture powered by Mithril.js and a robust PHP backend, Flarum offers two-pane navigation, infinite scrolling, floating reply composer, and instantaneous page transitions.

For static website creators, Flarum serves as a premier self-hosted community hub. You can deploy Flarum on a subdomain (such as `community.yourdomain.com` or `discuss.yourdomain.com`) or leverage its comprehensive JSON:API to query topics, display latest discussions, and syndicate community threads directly onto your static pages.

---

## Key Highlights & Features

- **100% Free & Open Source**: Released under the MIT license with complete ownership of your community data and database.
- **Fast & Responsive SPA UI**: Smooth infinite scrolling, instant transitions, and a floating composer that lets users read while typing.
- **Extensible Architecture**: Customize your community with hundreds of official and third-party extensions (OAuth logins, SEO, subscriptions, themes).
- **Headless JSON:API**: Full REST API for fetching discussion threads, user profiles, and comments to embed into static web pages.
- **Granular Permissions & Tags**: Flexible tag hierarchies, moderation controls, and custom role permissions.

---

## How It Works with Static Websites

### 1. Dedicated Community Hub on a Subdomain
Host Flarum on a subdomain (e.g. `discuss.yourdomain.com`) and add navigation links from your static site header, footer, or blog article callouts.

### 2. Fetch Recent Discussions via JSON:API
Embed recent forum topics dynamically onto your static homepage or sidebar using vanilla JavaScript:

```html
<div id="flarum-discussions">Loading community discussions...</div>

<script>
  async function loadFlarumDiscussions() {
    const container = document.getElementById('flarum-discussions');
    try {
      const response = await fetch('https://discuss.yourdomain.com/api/discussions?page[limit]=5');
      const json = await response.json();
      
      container.innerHTML = json.data.map(item => `
        <div class="community-thread">
          <a href="https://discuss.yourdomain.com/d/${item.id}" target="_blank" rel="noopener noreferrer">
            ${item.attributes.title}
          </a>
          <span class="reply-count">${item.attributes.commentCount} replies</span>
        </div>
      `).join('');
    } catch (err) {
      container.innerHTML = '<p>Unable to load discussions at this time.</p>';
    }
  }

  loadFlarumDiscussions();
</script>
```

---

## When to Use It

- Static blogs, product showcases, and documentation sites requiring a full-fledged community forum.
- Organizations seeking independent, self-hosted community software without vendor lock-in or recurring monthly subscriptions.
- Sites wanting a fast, modern discussion platform with active plugin support and headless API integration capabilities.
