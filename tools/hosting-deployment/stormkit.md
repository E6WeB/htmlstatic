# Stormkit

> Dedicated Jamstack and static web hosting platform with multi-environment staging and snippet injection.

1. **Official Website**: <a href="https://www.stormkit.io/" target="_blank" rel="noopener noreferrer">stormkit.io</a>
2. **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
3. **Type**: Static Hosting & Jamstack Platform
4. **Pricing / License**: Freemium

- **Tags**: `stormkit`, `self-hostable-netlify`, `jamstack-deployment`, `staged-rollouts`, `preview-environments`, `free-static-hosting`, `edge-cdn`, `git-deploy`, `jamstack-hosting`, `serverless-deploy`
---

## Overview

Stormkit is an infrastructure platform specifically designed for static websites, single-page applications, and serverless frontends. It decouples the hosting infrastructure from your code, integrating directly with GitHub, GitLab, and Bitbucket to provide enterprise-grade deployment workflows.

Stormkit's free tier includes 50 GB of monthly bandwidth, automated SSL certificates, custom domain management, and multi-environment setups (e.g. production, staging, feature branches). It also includes unique features like zero-configuration snippet injection (for analytics and fonts) and remote configuration without requiring code re-deployments.

---

## Key Highlights & Features

1. **Multi-Environment Architecture**: Manage staging, development, and production environments from one repository.
2. **Git Branch Deployments**: Automatically generates unique preview URLs for every pull request and feature branch.
3. **Snippet & Header Injection**: Inject meta tags, analytics scripts, and verification tags directly from the UI without modifying source code.
4. **Custom Domains & Automated TLS**: Instant SSL certificate provisioning with custom domain verification.
5. **Atomic Deploys & Instant Rollbacks**: Every build is stored immutably, allowing one-click rollbacks to any past deployment.
6. **Generous Free Tier**: 50 GB monthly bandwidth, unlimited staging environments, and zero credit card required.

---

## How It Works with Static Websites

1. Sign in to Stormkit and connect your Git provider (GitHub, GitLab, Bitbucket).
2. Create an application and specify your branch and publish directory (e.g. `public` or `dist`).
3. Push new commits to trigger automated builds and deployment.
4. Add your custom domain under **Domain Settings** and configure the provided DNS records.

---

## When to Use It

1. Static websites and SPAs requiring clean separation between staging and production environments.
2. Projects needing flexible header, footer, or analytics snippet injection without editing HTML source files.
3. Teams looking for a reliable, feature-rich alternative to Netlify or Vercel.
