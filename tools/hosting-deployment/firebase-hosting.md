# Firebase Hosting

> Fast, secure static and dynamic web hosting backed by Google's global SSD CDN.

1. **Official Website**: <a href="https://firebase.google.com/docs/hosting" target="_blank" rel="noopener noreferrer">firebase.google.com/docs/hosting</a>
2. **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
3. **Type**: Static Hosting & Cloud Infrastructure
4. **Pricing / License**: Freemium

- **Tags**: `firebase-hosting`, `google-cloud-cdn`, `single-command-deploy`, `free-ssl-hosting`, `preview-channels`, `free-static-hosting`, `edge-cdn`, `git-deploy`, `jamstack-hosting`, `serverless-deploy`
---

## Overview

Firebase Hosting is Google's developer-focused hosting service tailored for static web apps, single-page applications, and landing pages. Delivered through Google's high-speed global Content Delivery Network (CDN) with SSD-level caching, Firebase Hosting serves static HTML, CSS, JavaScript, fonts, and images with enterprise reliability.

Every site deployed on Firebase Hosting automatically receives a free SSL certificate and supports custom domain mapping. With the generous free "Spark" plan, developers receive 10 GB of storage and 10 GB of monthly transfer at zero cost.

---

## Key Highlights & Features

1. **Google Global CDN**: Content is cached on SSDs across Google data centers worldwide.
2. **Generous Free Spark Plan**: 10 GB free hosting storage, 360 MB/day (or 10 GB/month) data transfer.
3. **Custom Domains & Free SSL**: Zero-configuration SSL certificates provisioned automatically for custom domains.
4. **Preview Channels**: Create temporary, shareable preview URLs for testing staging branches before merging.
5. **Multi-Site Management**: Host multiple distinct websites under a single Firebase project.
6. **One-Command CLI Deploys**: Deploy locally using `firebase deploy` or automate via GitHub Actions.

---

## How It Works with Static Websites

1. Install the Firebase CLI and initialize your project:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

1. Point the public directory to your static files in `firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true
  }
}
```

1. Deploy your static website:

```bash
firebase deploy --only hosting
```

---

## When to Use It

1. Static websites and landing pages requiring Google-backed reliability and speed.
2. Projects integrating with client-side Firebase services like Firestore, Firebase Auth, or Cloud Storage.
3. Teams needing automated preview URLs for GitHub pull requests.
