# Surge.sh

> Single-command CLI web publishing for static sites with custom domain and automated SSL support.

- **Official Website**: <a href="https://surge.sh/" target="_blank" rel="noopener noreferrer">surge.sh</a>
- **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
- **Type**: Static Web Publishing & CLI Host
- **Pricing / License**: Freemium

---

## Overview

Surge is a famously minimalist, single-command static web publishing platform designed for frontend developers. It allows creators to deploy HTML, CSS, JavaScript, and client-side applications directly from their local terminal in seconds without configuring complicated dashboards, Git repositories, or cloud providers.

Surge features a robust free tier with unlimited projects, custom domain support, automatic SSL encryption, clean URLs, and custom `404.html` and `200.html` routing for single-page applications.

---

## Key Highlights & Features

- **Single-Command Publishing**: Deploy any local directory directly from the command line in seconds using `surge`.
- **Custom Domains on Free Tier**: Connect your own domain for free by placing a `CNAME` file in your project directory.
- **Automated SSL/TLS**: Every custom domain and `surge.sh` subdomain includes free SSL encryption.
- **Clean URLs & SPA Fallback**: Automatically serves `about.html` as `/about` and routes single-page apps via `200.html`.
- **Zero Configuration**: No build steps, complex configuration files, or cloud dashboards required.
- **CI/CD Integration**: Seamlessly scriptable in GitHub Actions, GitLab CI, Travis, or npm scripts.

---

## How It Works with Static Websites

1. Install the Surge CLI tool globally via npm:

```bash
npm install -g surge
```

2. Run the `surge` command inside your static website folder:

```bash
surge
```

3. Confirm your project path and choose a subdomain (e.g. `my-awesome-site.surge.sh`):

```bash
   project: /path/to/my-static-site
    domain: my-awesome-site.surge.sh
```

4. Press Enter. Your static site is live on the web instantly!
5. To deploy to a custom domain, pass the domain directly:

```bash
surge ./dist mycustomdomain.com
```

---

## When to Use It

- Quick developer prototypes, portfolio staging, and instant client review previews.
- Lightweight static sites that do not require complex Git CI/CD deployment pipelines.
- Terminal-first developers wanting the fastest path from a local folder to a live URL.
