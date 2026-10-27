# Render

> Modern cloud hosting platform offering free static site hosting with global CDN, custom domains, and auto Git deploys.

- **Official Website**: <a href="https://render.com/" target="_blank" rel="noopener noreferrer">render.com</a>
- **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
- **Type**: Cloud Application & Static Hosting Platform
- **Pricing / License**: Freemium

---

## Overview

Render is a modern cloud hosting platform built to simplify building and deploying web applications, backend services, and static sites. Static site hosting on Render is included in their free tier, providing developers with continuous deployment from GitHub and GitLab, a lightning-fast global CDN, and automated SSL certificate management.

Render handles cache invalidation, custom rewrite and redirect rules, header modifications, and pull request preview environments, making it an ideal hosting solution for both vanilla HTML/CSS/JS projects and complex Jamstack sites.

---

## Key Highlights & Features

- **Free Static Web Hosting**: Host static websites and SPAs with no monthly infrastructure fees.
- **Continuous Deployment**: Automatically triggers builds and deploys on every Git push to your repository.
- **Global CDN Delivery**: High-speed edge caching powered by Cloudflare with automated cache purging.
- **Custom Domains & Auto SSL**: Free Let's Encrypt SSL certificates with automatic renewal and custom domain mapping.
- **Redirects & Rewrites**: Configure client-side routing, URL rewrites, and 301/302 redirects in the dashboard.
- **PR Preview Environments**: Automatically creates preview builds for every pull request to review changes before merging.

---

## How It Works with Static Websites

1. Sign up on Render and click **New +** > **Static Site**.
2. Connect your GitHub or GitLab repository.
3. Configure your build settings:
   - **Build Command**: leave empty for vanilla HTML/CSS/JS, or enter `npm run build` for static generators.
   - **Publish Directory**: enter `./`, `public`, or `dist`.
4. Click **Create Static Site**. Render automatically builds and deploys your website on a free `onrender.com` subdomain.
5. In **Settings**, add your custom domain and point your DNS CNAME record to Render.

---

## When to Use It

- Static websites, documentation portals, and portfolios requiring reliable automated Git deployments.
- Jamstack applications requiring client-side single-page app (SPA) rewrite rules.
- Developers hosting static frontends alongside backend microservices or databases on the same platform.
