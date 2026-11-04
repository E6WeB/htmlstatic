# Clerk

> Complete user management and authentication with drop-in UI and vanilla JavaScript SDK.

1. **Official Website**: <a href="https://clerk.com/" target="_blank" rel="noopener noreferrer">clerk.com</a>
2. **Category**: [Authentication & User Management](../../README.md#authentication--user-management)
3. **Type**: User Authentication & Management Platform
4. **Pricing / License**: Freemium

- **Tags**: `clerk-auth`, `drop-in-auth`, `passkey-login`, `social-oauth`, `user-profiles`, `javascript-auth-sdk`, `auth0-alternative`, `passkeys`, `oauth-login`, `jwt-auth`
---

## Overview

Clerk is a comprehensive authentication and user management platform built for modern web applications. While popular in React and Next.js, Clerk also provides a pure vanilla JavaScript SDK that can be loaded on static HTML pages via a script tag.

It includes pre-built modal components for sign-up, sign-in, user profiles, and organization management, eliminating the need to write backend authentication logic.

---

## Key Highlights & Features

1. **Drop-In Modals**: Beautiful, accessible sign-in and profile components out of the box.
2. **Social Logins & Passkeys**: Support for Google, GitHub, Apple, passkeys, and magic links.
3. **Vanilla JS SDK**: Load via CDN without complex build tools or frameworks.
4. **Session Management**: Secure JWT handling and token renewal performed automatically in the browser.

---

## How It Works with Static Websites

Add Clerk to any static HTML page using the JavaScript SDK:

```html
<!-- Load Clerk SDK -->
<script
  async
  crossorigin="anonymous"
  data-clerk-publishable-key="pk_test_YOUR_KEY"
  src="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"
  type="text/javascript">
</script>

<div id="auth-container">
  <button id="sign-in-btn">Sign In</button>
  <div id="user-button"></div>
</div>

<script>
  window.addEventListener("load", async () => {
    await window.Clerk.load();

    if (window.Clerk.user) {
      document.getElementById("sign-in-btn").style.display = "none";
      window.Clerk.mountUserButton(document.getElementById("user-button"));
    } else {
      document.getElementById("sign-in-btn").addEventListener("click", () => {
        window.Clerk.openSignIn();
      });
    }
  });
</script>
```

---

## When to Use It

1. Adding gated content, member portals, or user dashboards to static sites.
2. Websites needing secure social logins and passkeys with zero backend maintenance.
3. Client portals that require complete user profile management.
