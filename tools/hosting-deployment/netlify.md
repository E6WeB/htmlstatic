# Netlify

> Static hosting with automated continuous deployment and edge services.

1. **Official Website**: <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">netlify.com</a>
2. **Category**: [Hosting & Deployment](../../README.md#hosting--deployment)
3. **Type**: Jamstack & Frontend Cloud
4. **Pricing / License**: Freemium

- **Tags**: `netlify`, `jamstack-pioneer`, `deploy-previews`, `netlify-forms`, `edge-functions`, `instant-rollbacks`, `free-static-hosting`, `edge-cdn`, `git-deploy`, `jamstack-hosting`
---

## Overview

Netlify is a pioneer of the modern Jamstack architecture. It provides automated build and deployment pipelines from Git repositories, instant global cache invalidation, automated HTTPS, and continuous branch previews.

Beyond simple static file serving, Netlify offers built-in form handling, serverless background functions, split testing, and identity services, making it a comprehensive solution for modern frontend projects.

---

## Key Highlights & Features

1. **Automated Git Workflows**: Builds and deploys automatically upon every push.
2. **Instant Cache Invalidation**: Instant global updates across edge nodes.
3. **Built-in Form Handling**: Collect submissions directly by adding a `netlify` attribute to HTML forms.
4. **Deploy Previews**: Unique URLs for each branch and pull request for rapid review.

---

## How It Works with Static Websites

Configure build settings in a `netlify.toml` file at the root of your project:

```toml
[build]
  publish = "public"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## When to Use It

1. Production static websites and web applications with automated CI/CD.
2. Websites needing built-in forms and edge redirects without third-party services.
3. Cross-functional teams that rely on Deploy Previews for visual QA.
