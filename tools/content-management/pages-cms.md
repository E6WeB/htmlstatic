# Pages CMS

> Modern Git-based content management with a sleek, browser-based interface.

1. **Official Website**: <a href="https://pagescms.org/" target="_blank" rel="noopener noreferrer">pagescms.org</a>
2. **Category**: [Content Management](../../README.md#content-management)
3. **Type**: Modern Git-Backed CMS
4. **Pricing / License**: Open Source

- **Tags**: `pages-cms`, `github-cms`, `markdown-frontmatter-editor`, `collaborative-git-cms`, `nextjs-astro-cms`, `git-based-cms`, `headless-cms`, `markdown-cms`, `wordpress-alternative`, `static-site-cms`
---

## Overview

Pages CMS is an open-source, user-friendly CMS for static websites hosted in GitHub repositories. It provides an intuitive, distraction-free interface for editing Markdown, frontmatter, and media assets.

Unlike traditional CMSs that require hosting a server and database, Pages CMS connects securely via GitHub OAuth and writes changes directly as Git commits.

---

## Key Highlights & Features

1. **Zero Setup Hosting**: Access through the hosted app or self-host your own instance.
2. **Schema Definition**: Configure collections, singletons, and custom fields with `.pages.yml`.
3. **Media Management**: Drag-and-drop image uploads directly committed to Git.
4. **Modern UI**: Fast, responsive, accessible interface built for modern workflows.

---

## How It Works with Static Websites

Add a `.pages.yml` file to the root of your GitHub repository:

```yaml
media:
  input: assets/images
  output: /assets/images

content:
  - name: posts
    label: Posts
    type: collection
    path: content/posts
    fields:
      - name: title
        label: Title
        type: string
      - name: date
        label: Publish Date
        type: date
      - name: body
        label: Content
        type: rich-text
```

Then log in to [pagescms.org](https://pagescms.org/) with GitHub to manage your content.

---

## When to Use It

1. Static websites where clients or content writers need a modern editing interface.
2. Content management without hosting or maintaining servers, databases, or plugins.
3. Repositories seeking a lighter, more modern alternative to legacy Git CMSs.
