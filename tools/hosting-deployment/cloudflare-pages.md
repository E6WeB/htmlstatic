# Cloudflare Pages

> Fast, secure Jamstack hosting on Cloudflare's global edge network.

1. **Official Website**: <a href="https://pages.cloudflare.com/" target="_blank" rel="noopener noreferrer">pages.cloudflare.com</a>
2. **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
3. **Type**: Global Edge Jamstack Hosting
4. **Pricing / License**: Freemium

- **Tags**: `cloudflare-pages`, `unlimited-bandwidth-hosting`, `edge-static-hosting`, `cloudflare-workers`, `git-auto-deploy`, `fast-global-cdn`, `free-static-hosting`, `edge-cdn`, `git-deploy`, `jamstack-hosting`
---

## Overview

Cloudflare Pages is a Jamstack deployment platform powered by Cloudflare's massive global network spanning hundreds of cities worldwide. It offers git integration for automated builds, unlimited bandwidth, edge functions via Cloudflare Workers, and built-in DDoS protection.

Sites hosted on Cloudflare Pages enjoy industry-leading latency because assets are served from the nearest edge data center directly to the visitor.

---

## Key Highlights & Features

1. **Global CDN & Edge Network**: Assets are cached and served across 300+ edge locations worldwide.
2. **Unlimited Bandwidth**: Generous free tier with no bandwidth surcharges.
3. **Built-in Preview Deployments**: Automatic staging URLs generated for every pull request.
4. **Edge Functions**: Enhance static sites with serverless Cloudflare Workers functions when needed.

---

## How It Works with Static Websites

Connect your GitHub or GitLab repository in the Cloudflare dashboard, or deploy manually using Wrangler:

```bash
# Deploy static folder directly with Wrangler CLI
npx wrangler pages deploy ./dist --project-name my-static-site
```

---

## When to Use It

1. High-traffic static websites needing fast global delivery without bandwidth worries.
2. Static sites that occasionally need edge functions, redirects, or header rules.
3. Teams wanting automatic branch preview URLs for collaborative development.
