# Fleek

> Edge-optimized web hosting for static frontends and modern Jamstack sites with automated Git deployment.

1. **Official Website**: <a href="https://fleek.xyz/" target="_blank" rel="noopener noreferrer">fleek.xyz</a>
2. **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
3. **Type**: Edge Hosting & Decentralized Web Platform
4. **Pricing / License**: Freemium

- **Tags**: `fleek-hosting`, `ipfs-web-hosting`, `decentralized-cdn`, `edge-static-deploy`, `censorship-resistant-web`, `free-static-hosting`, `edge-cdn`, `git-deploy`, `jamstack-hosting`, `serverless-deploy`
---

## Overview

Fleek is a modern edge hosting and cloud platform designed to make deploying static frontends, decentralized websites, and Jamstack applications fast and frictionless. Featuring a global edge CDN, Fleek provides developers with high-performance content delivery, automated continuous integration, and seamless custom domain management.

Fleek connects directly to your GitHub repository, automatically triggering build and deployment pipelines on every commit. It features a generous free tier with SSL certificates, edge caching, and support for all modern static site generators and vanilla HTML/CSS/JS frameworks.

---

## Key Highlights & Features

1. **Automated Git CI/CD**: Connect GitHub to trigger automatic builds and atomic deployments on every push.
2. **Global Edge CDN**: Delivers static files from edge nodes situated close to your global audience.
3. **Custom Domains & SSL**: Seamless custom domain configuration with automatic SSL/TLS encryption.
4. **Preview Deployments**: Generates isolated preview links for testing pull requests and staging branches.
5. **Multi-Framework Support**: Zero-configuration support for Astro, Hugo, Next.js static exports, Vite, and vanilla static HTML.
6. **Generous Free Tier**: Deploy static sites with global caching without requiring upfront payment information.

---

## How It Works with Static Websites

1. Sign in to Fleek using your GitHub account.
2. Select your static repository and specify your publish directory (e.g. `./`, `dist`, or `public`).
3. Fleek builds and deploys your static website to the global edge network.
4. Add your custom domain under site settings and update your DNS records to activate free SSL.

You can also use the Fleek CLI for local terminal deployments:

```bash
npm install -g @fleek-platform/cli
fleek login
fleek sites deploy --path ./dist
```

---

## When to Use It

1. Static websites requiring modern, decentralized edge infrastructure and high resilience.
2. Fast deployment workflows with automated GitHub pull request previews.
3. Jamstack developers building resilient, censorship-resistant static web presences.
