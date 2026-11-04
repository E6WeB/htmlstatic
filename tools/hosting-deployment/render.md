# Render

> Modern cloud hosting platform offering free static site hosting with global CDN, custom domains, and auto Git deploys.

1. **Official Website**: <a href="https://render.com/" target="_blank" rel="noopener noreferrer">render.com</a>
2. **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
3. **Type**: Cloud Application & Static Hosting Platform
4. **Pricing / License**: Freemium

- **Tags**: `render-static-sites`, `free-global-cdn`, `heroku-alternative`, `auto-git-deploys`, `zero-downtime-hosting`, `free-static-hosting`, `edge-cdn`, `git-deploy`, `jamstack-hosting`, `serverless-deploy`
---

## Overview

Render is a modern cloud hosting platform built to simplify building and deploying web applications, backend services, and static sites. Static site hosting on Render is included in their free tier, providing developers with continuous deployment from GitHub and GitLab, a lightning-fast global CDN, and automated SSL certificate management.

Render handles cache invalidation, custom rewrite and redirect rules, header modifications, and pull request preview environments, making it an ideal hosting solution for both vanilla HTML/CSS/JS projects and complex Jamstack sites.

---

## Key Highlights & Features

1. **Free Static Web Hosting**: Host static websites and SPAs with no monthly infrastructure fees.
2. **Continuous Deployment**: Automatically triggers builds and deploys on every Git push to your repository.
3. **Global CDN Delivery**: High-speed edge caching powered by Cloudflare with automated cache purging.
4. **Custom Domains & Auto SSL**: Free Let's Encrypt SSL certificates with automatic renewal and custom domain mapping.
5. **Redirects & Rewrites**: Configure client-side routing, URL rewrites, and 301/302 redirects in the dashboard.
6. **PR Preview Environments**: Automatically creates preview builds for every pull request to review changes before merging.

---

## How It Works with Static Websites

1. Sign up on Render and click **New +** > **Static Site**.
2. Connect your GitHub or GitLab repository.
3. Configure your build settings:
   4. **Build Command**: leave empty for vanilla HTML/CSS/JS, or enter `npm run build` for static generators.
   5. **Publish Directory**: enter `./`, `public`, or `dist`.
6. Click **Create Static Site**. Render automatically builds and deploys your website on a free `onrender.com` subdomain.
7. In **Settings**, add your custom domain and point your DNS CNAME record to Render.

---

## When to Use It

1. Static websites, documentation portals, and portfolios requiring reliable automated Git deployments.
2. Jamstack applications requiring client-side single-page app (SPA) rewrite rules.
3. Developers hosting static frontends alongside backend microservices or databases on the same platform.
