# Codeberg Pages

> Community-driven, privacy-respecting, and free static website hosting powered by Codeberg and Forgejo.

- **Official Website**: <a href="https://pages.codeberg.org/" target="_blank" rel="noopener noreferrer">pages.codeberg.org</a>
- **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
- **Type**: Static Web Hosting & Git Platform
- **Pricing / License**: Free / Open Source

---

## Overview

Codeberg Pages is a free, non-profit static website hosting service provided by Codeberg e.V., a member-based organization headquartered in Germany. Built on top of the open-source Forgejo Git platform, Codeberg Pages allows creators to publish websites directly from a Git repository with an uncompromising commitment to privacy and freedom.

Codeberg Pages contains zero advertising, no telemetry, and zero tracking scripts. It supports standard static HTML, CSS, JavaScript, and static site generator builds, providing free custom domain mapping with automatic Let's Encrypt SSL certificates.

---

## Key Highlights & Features

- **100% Free & Open Source**: Run by a registered non-profit with zero monetization of user data.
- **Privacy by Design**: No visitor tracking, no external trackers, and hosted on European servers adhering to strict GDPR standards.
- **Custom Domains**: Connect any custom domain with automated Let's Encrypt SSL certificate renewal.
- **Direct Git Workflow**: Automatically updates your live website whenever you push commits to your `pages` branch or repository.
- **Static Generator Compatibility**: Deploy outputs from Astro, Hugo, Eleventy, or vanilla HTML/JS via Codeberg Actions (CI/CD).

---

## How It Works with Static Websites

1. Create a repository on Codeberg named `<username>.codeberg.page` or enable Pages on an existing repository's `pages` branch.
2. Push your static HTML, CSS, and JS files to the repository:

```bash
git init
git add index.html style.css main.js
git commit -m "Initial static website commit"
git remote add origin https://codeberg.org/<username>/<repo>.git
git push -u origin pages
```

3. Your website goes live immediately at `https://<username>.codeberg.page/<repo>/`.
4. To add a custom domain, add a `.domains` file in the root of your pages branch containing your domain name and point your DNS CNAME to `<username>.codeberg.page`.

---

## When to Use It

- Open-source projects and developer portfolios prioritizing digital autonomy and privacy.
- Developers looking for a non-profit alternative to GitHub Pages or proprietary platforms.
- Static sites that require zero-tracking, ad-free hosting under European privacy laws.
