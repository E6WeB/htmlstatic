# Clerk

> Complete user management and authentication with drop-in UI and vanilla JavaScript SDK.

- **Official Website**: <a href="https://clerk.com/" target="_blank" rel="noopener noreferrer">clerk.com</a>
- **Category**: [Authentication & User Management](../../README.md#authentication--user-management)
- **Type**: User Authentication & Management Platform

---

## Overview

Clerk is a comprehensive authentication and user management platform built for modern web applications. While popular in React and Next.js, Clerk also provides a pure vanilla JavaScript SDK that can be loaded on static HTML pages via a script tag.

It includes pre-built modal components for sign-up, sign-in, user profiles, and organization management, eliminating the need to write backend authentication logic.

---

## Key Highlights & Features

- **Drop-In Modals**: Beautiful, accessible sign-in and profile components out of the box.
- **Social Logins & Passkeys**: Support for Google, GitHub, Apple, passkeys, and magic links.
- **Vanilla JS SDK**: Load via CDN without complex build tools or frameworks.
- **Session Management**: Secure JWT handling and token renewal performed automatically in the browser.

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

- Adding gated content, member portals, or user dashboards to static sites.
- Websites needing secure social logins and passkeys with zero backend maintenance.
- Client portals that require complete user profile management.
