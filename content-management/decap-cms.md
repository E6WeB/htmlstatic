# Decap CMS

> Open-source, Git-based content management for static site generators.

- **Official Website**: <a href="https://decapcms.org/" target="_blank" rel="noopener noreferrer">decapcms.org</a>
- **Category**: [Content Management](../README.md#content-management)
- **Type**: Git-Based Headless CMS

---

## Overview

Decap CMS (formerly Netlify CMS) is an open-source, client-side content management system designed for static site generators. It runs as a single-page React application hosted directly alongside your static site (typically in an `admin/` folder).

When content editors publish or update posts, Decap CMS commits the changes directly to your Git repository as Markdown, YAML, or JSON files, triggering your site's automated build process.

---

## Key Highlights & Features

- **Git as a Single Source of Truth**: Content versioned alongside source code.
- **Rich Text & Markdown Editor**: Clean UI with live previews for editors.
- **Media Library**: Upload and manage images directly within the browser.
- **Configurable Collections**: Define content schemas using simple YAML.

---

## How It Works with Static Websites

Create an `admin/index.html` file in your static site:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Content Manager</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

Define your content schema in `admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "assets/uploads"
public_folder: "/assets/uploads"

collections:
  - name: "blog"
    label: "Blog"
    folder: "_posts"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Body", name: "body", widget: "markdown"}
```

---

## When to Use It

- Client websites where non-technical editors need a friendly UI to publish posts.
- Static sites built with Astro, Hugo, Jekyll, or 11ty wanting Git-backed content.
- Projects avoiding the ongoing expense and hosting of database CMSs like WordPress.
