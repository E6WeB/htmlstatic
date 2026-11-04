# Zola

> Single-binary static site generator written in Rust with built-in Sass compilation, syntax highlighting, and search indexing.

- **Official Website**: <a href="https://www.getzola.org/" target="_blank" rel="noopener noreferrer">getzola.org</a>
- **Category**: [Static Site Generators](../../README.md#static-site-generators)
- **Type**: Single-Binary Static Generator (Rust)

- **Tags**: `getzola`, `rust-single-binary-ssg`, `tera-templates`, `built-in-sass-search`, `zero-dependency-ssg`, `ssg`, `jamstack`, `markdown-to-html`, `zero-js`, `fast-static-sites`

---

## Overview

Zola is a fast, modern static site generator written in Rust and distributed as a single standalone executable with zero runtime dependencies. Following a "batteries-included" philosophy, Zola ships with built-in Sass compilation, image processing, syntax highlighting, multilingual support, and client-side search index generation—all without needing npm, Node.js, or external plugins.

It uses the Tera template engine (inspired by Jinja2 and Django templates) paired with CommonMark Markdown and TOML front matter, making it approachable and rock-solid.

---

## Key Highlights & Features

- **Single Binary & Zero Dependencies**: One lightweight Rust executable handles everything—no Node.js, Python, or Ruby environment needed.
- **Batteries Included**: Built-in Sass/SCSS compiler, syntax highlighting, responsive image resizing (`resize_image`), and Elasticlunr/Fuse search index generation.
- **Blazing-Fast Rust Builds**: Compiles entire websites and reloads local changes in milliseconds.
- **Tera Templating & Shortcodes**: Expressive Jinja2/Django-style templates with reusable Markdown shortcodes, taxonomies, and automatic internal link checking (`zola check`).

---

## How It Works with Static Websites

Initialize and build a static site with Zola:

```bash
# Initialize a new Zola site interactively
zola init my-zola-site
cd my-zola-site

# Start local dev server with live reload at http://127.0.0.1:1111
zola serve

# Validate all internal and external links
zola check

# Build production static HTML into public/
zola build
```

Example Markdown page (`content/blog/first-post.md`):

```markdown
+++
title = "Fast Static Sites with Zola"
date = 2026-01-20
+++

Zola compiles this page into pure static HTML in milliseconds with zero dependencies.
```

---

## When to Use It

- Developers who want a fast, single-binary static site generator with readable Jinja2-like (`Tera`) templates.
- Blogs, documentation sites, and knowledge bases that want built-in search, Sass compilation, and link checking without managing npm packages.
- CI/CD pipelines where minimal install time and sub-second Rust build speeds matter.

