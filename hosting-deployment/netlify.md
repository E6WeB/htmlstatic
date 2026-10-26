# Netlify

> Static hosting with automated continuous deployment and edge services.

- **Official Website**: <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">netlify.com</a>
- **Category**: [Hosting & Deployment](../README.md#hosting--deployment)
- **Type**: Jamstack & Frontend Cloud

---

## Overview

Netlify is a pioneer of the modern Jamstack architecture. It provides automated build and deployment pipelines from Git repositories, instant global cache invalidation, automated HTTPS, and continuous branch previews.

Beyond simple static file serving, Netlify offers built-in form handling, serverless background functions, split testing, and identity services, making it a comprehensive solution for modern frontend projects.

---

## Key Highlights & Features

- **Automated Git Workflows**: Builds and deploys automatically upon every push.
- **Instant Cache Invalidation**: Instant global updates across edge nodes.
- **Built-in Form Handling**: Collect submissions directly by adding a `netlify` attribute to HTML forms.
- **Deploy Previews**: Unique URLs for each branch and pull request for rapid review.

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

- Production static websites and web applications with automated CI/CD.
- Websites needing built-in forms and edge redirects without third-party services.
- Cross-functional teams that rely on Deploy Previews for visual QA.

---

[← Back to Hosting & Deployment](../README.md#hosting--deployment) | [← Back to Static Website Toolkit](../README.md)
