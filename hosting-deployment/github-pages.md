# GitHub Pages

> Host websites directly from GitHub repositories with Git-driven automation.

- **Official Website**: <a href="https://pages.github.com/" target="_blank" rel="noopener noreferrer">pages.github.com</a>
- **Category**: [Hosting & Deployment](../README.md#hosting--deployment)
- **Type**: Git-Integrated Static Hosting

---

## Overview

GitHub Pages is a free static website hosting service that turns code repositories into live websites. Maintained by GitHub, it natively integrates with Git workflows: whenever you push updates to a designated branch or run a GitHub Actions workflow, your site updates automatically.

GitHub Pages supports custom domains, automatic SSL/TLS certificate provisioning via Let's Encrypt, and built-in Jekyll support for blogging and documentation.

---

## Key Highlights & Features

- **100% Git-Driven**: Deploy automatically on every `git push`.
- **Free Custom Domains & SSL**: Bring your own domain with automatically renewed HTTPS certificates.
- **Native GitHub Actions Support**: Build with any static generator (Vite, Astro, Hugo, Eleventy) and deploy.
- **Zero Cost**: Free for public repositories on standard GitHub accounts.

---

## How It Works with Static Websites

You can host your site by placing an `index.html` in the root or `docs/` directory of your repository, or use a GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: "."
      - uses: actions/deploy-pages@v4
```

---

## When to Use It

- Open-source project documentation and personal portfolios.
- Websites version-controlled in GitHub repositories.
- Zero-cost hosting with simple continuous deployment.

---

[← Back to Hosting & Deployment](../README.md#hosting--deployment) | [← Back to Static Website Toolkit](../README.md)
