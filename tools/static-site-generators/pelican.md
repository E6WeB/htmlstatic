# Pelican

> Python-powered static site generator that compiles Markdown and reStructuredText into clean static HTML using Jinja2 templates.

- **Official Website**: <a href="https://getpelican.com/" target="_blank" rel="noopener noreferrer">getpelican.com</a>
- **Category**: [Static Site Generators](../../README.md#static-site-generators)
- **Type**: Python Static Site Generator

- **Tags**: `pelican-ssg`, `python-static-generator`, `jinja2-templates`, `restructuredtext-markdown`, `ssg`, `jamstack`, `markdown-to-html`, `zero-js`, `fast-static-sites`, `blog-generator`

---

## Overview

Pelican is a mature, open-source static site generator written in Python that requires no database or server-side logic. It lets you write content in Markdown or reStructuredText (reST), style your site with flexible Jinja2 templates, and output completely static HTML files ready to host anywhere.

Pelican is especially popular in the Python, data science, and technical writing communities thanks to its native reStructuredText support, Pygments syntax highlighting, and rich plugin ecosystem.

---

## Key Highlights & Features

- **Markdown & reStructuredText Support**: Write articles and pages in standard Markdown, reStructuredText, or AsciiDoc via plugins.
- **Jinja2 Templating Engine**: Customize themes and layouts easily using Python's popular Jinja2 template syntax.
- **Built-in Pygments Syntax Highlighting**: Produces crisp, server-free code syntax highlighting for hundreds of programming languages at build time.
- **Atom/RSS Feeds & Multi-Language Publishing**: Automatically generates Atom and RSS feeds, categories, tags, and translated article variants.

---

## How It Works with Static Websites

Install Pelican with `pip` and generate a static site:

```bash
# Install Pelican with Markdown support
pip install "pelican[markdown]"

# Scaffold a new Pelican project via interactive quickstart
pelican-quickstart

# Generate static HTML into output/
pelican content

# Preview locally with live auto-reload at http://localhost:8000
pelican --listen --autoreload
```

Example article (`content/hello-pelican.md`):

```markdown
Title: Building Static Sites with Python
Date: 2026-01-15 10:00
Category: Tutorials
Tags: python, static-web

Pelican compiles this Markdown file directly into static HTML using Jinja2 templates.
```

---

## When to Use It

- Python developers and data scientists who prefer a Python/Jinja2 toolchain over Node.js, Go, or Ruby.
- Technical blogs and documentation sites written in reStructuredText or Markdown with heavy code samples.
- Migrating existing WordPress, Dotclear, or RSS feeds into a clean static website using Pelican's built-in importer CLI.

