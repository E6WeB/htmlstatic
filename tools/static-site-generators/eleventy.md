# Eleventy (11ty)

> Simple, flexible static site generator that transforms templates and Markdown into fast static HTML.

1. **Official Website**: <a href="https://www.11ty.dev/" target="_blank" rel="noopener noreferrer">11ty.dev</a>
2. **Category**: [Static Site Generators](../../README.md#static-site-generators)
3. **Type**: Zero-Config Static Site Generator
4. **Pricing / License**: Open Source

- **Tags**: `eleventy`, `11ty`, `zero-client-js-ssg`, `liquid-nunjucks-markdown`, `fast-node-ssg`, `ssg`, `jamstack`, `markdown-to-html`, `zero-js`, `fast-static-sites`
---

## Overview

Eleventy (11ty) is a simpler, JavaScript-based static site generator that operates without framework client-side bloat. It does not force you to adopt client-side frameworks; instead, it parses templates (HTML, Markdown, Nunjucks, Liquid, WebC) and compiles them into static HTML.

It is renowned for its speed, simplicity, and flexibility, making it a favorite among web standards purists.

---

## Key Highlights & Features

1. **Zero Client-Side JavaScript**: Outputs clean static HTML files without framework overhead.
2. **Multiple Template Engines**: Mix and match Markdown, Nunjucks, Liquid, and HTML seamlessly.
3. **Blazing Build Speeds**: Rapid local development reload times.
4. **Independent Data Directory**: Feed content from local JSON/JS files or remote APIs.

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

1. Personal blogs, documentation, and simple multi-page websites.
2. Web developers who want to write standard HTML and CSS without framework compilation.
3. Fast, dependency-light static generation.
