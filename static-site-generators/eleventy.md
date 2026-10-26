# Eleventy (11ty)

> Simple, flexible static site generator that transforms templates and Markdown into fast static HTML.

- **Official Website**: <a href="https://www.11ty.dev/" target="_blank" rel="noopener noreferrer">11ty.dev</a>
- **Category**: [Static Site Generators](../README.md#static-site-generators)
- **Type**: Zero-Config Static Site Generator

---

## Overview

Eleventy (11ty) is a simpler, JavaScript-based static site generator that operates without framework client-side bloat. It does not force you to adopt client-side frameworks; instead, it parses templates (HTML, Markdown, Nunjucks, Liquid, WebC) and compiles them into static HTML.

It is renowned for its speed, simplicity, and flexibility, making it a favorite among web standards purists.

---

## Key Highlights & Features

- **Zero Client-Side JavaScript**: Outputs clean static HTML files without framework overhead.
- **Multiple Template Engines**: Mix and match Markdown, Nunjucks, Liquid, and HTML seamlessly.
- **Blazing Build Speeds**: Rapid local development reload times.
- **Independent Data Directory**: Feed content from local JSON/JS files or remote APIs.

---

## How It Works with Static Websites

Run Eleventy with npx:

```bash
# Create sample file
echo "# Hello World from Eleventy" > index.md

# Run Eleventy development server
npx @11ty/eleventy --serve

# Build static output to _site/
npx @11ty/eleventy
```

---

## When to Use It

- Personal blogs, documentation, and simple multi-page websites.
- Web developers who want to write standard HTML and CSS without framework compilation.
- Fast, dependency-light static generation.
