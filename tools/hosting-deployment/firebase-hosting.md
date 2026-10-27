# Firebase Hosting

> Fast, secure static and dynamic web hosting backed by Google's global SSD CDN.

- **Official Website**: <a href="https://firebase.google.com/docs/hosting" target="_blank" rel="noopener noreferrer">firebase.google.com/docs/hosting</a>
- **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
- **Type**: Static Hosting & Cloud Infrastructure
- **Pricing / License**: Freemium

---

## Overview

Firebase Hosting is Google's developer-focused hosting service tailored for static web apps, single-page applications, and landing pages. Delivered through Google's high-speed global Content Delivery Network (CDN) with SSD-level caching, Firebase Hosting serves static HTML, CSS, JavaScript, fonts, and images with enterprise reliability.

Every site deployed on Firebase Hosting automatically receives a free SSL certificate and supports custom domain mapping. With the generous free "Spark" plan, developers receive 10 GB of storage and 10 GB of monthly transfer at zero cost.

---

## Key Highlights & Features

- **Google Global CDN**: Content is cached on SSDs across Google data centers worldwide.
- **Generous Free Spark Plan**: 10 GB free hosting storage, 360 MB/day (or 10 GB/month) data transfer.
- **Custom Domains & Free SSL**: Zero-configuration SSL certificates provisioned automatically for custom domains.
- **Preview Channels**: Create temporary, shareable preview URLs for testing staging branches before merging.
- **Multi-Site Management**: Host multiple distinct websites under a single Firebase project.
- **One-Command CLI Deploys**: Deploy locally using `firebase deploy` or automate via GitHub Actions.

---

## How It Works with Static Websites

1. Install the Firebase CLI and initialize your project:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

2. Point the public directory to your static files in `firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true
  }
}
```

3. Deploy your static website:

```bash
firebase deploy --only hosting
```

---

## When to Use It

- Static websites and landing pages requiring Google-backed reliability and speed.
- Projects integrating with client-side Firebase services like Firestore, Firebase Auth, or Cloud Storage.
- Teams needing automated preview URLs for GitHub pull requests.
