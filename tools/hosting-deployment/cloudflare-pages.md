# Cloudflare Pages

> Fast, secure Jamstack hosting on Cloudflare's global edge network.

- **Official Website**: <a href="https://pages.cloudflare.com/" target="_blank" rel="noopener noreferrer">pages.cloudflare.com</a>
- **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
- **Type**: Global Edge Jamstack Hosting

---

## Overview

Cloudflare Pages is a Jamstack deployment platform powered by Cloudflare's massive global network spanning hundreds of cities worldwide. It offers git integration for automated builds, unlimited bandwidth, edge functions via Cloudflare Workers, and built-in DDoS protection.

Sites hosted on Cloudflare Pages enjoy industry-leading latency because assets are served from the nearest edge data center directly to the visitor.

---

## Key Highlights & Features

- **Global CDN & Edge Network**: Assets are cached and served across 300+ edge locations worldwide.
- **Unlimited Bandwidth**: Generous free tier with no bandwidth surcharges.
- **Built-in Preview Deployments**: Automatic staging URLs generated for every pull request.
- **Edge Functions**: Enhance static sites with serverless Cloudflare Workers functions when needed.

---

## How It Works with Static Websites

Connect your GitHub or GitLab repository in the Cloudflare dashboard, or deploy manually using Wrangler:

```bash
# Deploy static folder directly with Wrangler CLI
npx wrangler pages deploy ./dist --project-name my-static-site
```

---

## When to Use It

- High-traffic static websites needing fast global delivery without bandwidth worries.
- Static sites that occasionally need edge functions, redirects, or header rules.
- Teams wanting automatic branch preview URLs for collaborative development.
