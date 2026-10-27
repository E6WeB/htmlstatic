# Deno Deploy

> Distributed, multi-region edge hosting platform serving static assets and edge logic globally.

- **Official Website**: <a href="https://deno.com/deploy" target="_blank" rel="noopener noreferrer">deno.com/deploy</a>
- **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
- **Type**: Edge Hosting & Serverless Platform
- **Pricing / License**: Freemium

---

## Overview

Deno Deploy is a globally distributed edge computing and static file hosting system designed by the team behind Deno. It runs your web frontends and APIs across 35+ data centers around the world, placing static HTML, CSS, JavaScript, and media assets within milliseconds of global users.

Deno Deploy eliminates cold starts and provides generous free tier allowances (100,000 requests per day and 100 GB outbound transfer per month). With zero server maintenance and automatic GitHub synchronization, developers can deploy static sites and edge-enhanced frontends in seconds.

---

## Key Highlights & Features

- **Worldwide Edge Network**: Deploys across 35+ global data centers with sub-millisecond response times.
- **Generous Free Tier**: 100,000 requests/day, 100 GB monthly bandwidth, and unlimited projects.
- **Automatic SSL & Custom Domains**: Instant HTTPS provisioning with custom domain verification.
- **GitHub Integration**: Automatically builds and deploys on every Git push with per-branch preview URLs.
- **Static & Edge Hybrid**: Host pure static files with standard caching or augment with TypeScript edge functions.

---

## How It Works with Static Websites

You can deploy static assets using the `deployctl` CLI or by connecting your GitHub repository:

```bash
# Install the deployctl CLI tool
deno install -A -r https://deno.land/x/deploy/deployctl.ts

# Deploy a static directory to Deno Deploy
deployctl deploy --project=my-static-site --static=./dist
```

For continuous integration, connect your GitHub repository in the Deno Deploy dashboard and specify your static build output folder (`dist`, `build`, or `./`).

---

## When to Use It

- Static websites requiring ultra-low global latency and edge delivery.
- Jamstack frontends needing optional edge middleware or geo-routing.
- Teams looking for a fast, modern alternative to Cloudflare Pages or Vercel.
