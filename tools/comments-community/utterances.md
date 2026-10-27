# Utterances

> Lightweight commenting system powered by GitHub Issues.

- **Official Website**: <a href="https://utteranc.es/" target="_blank" rel="noopener noreferrer">utteranc.es</a>
- **Category**: [Comments & Community](../../README.md#comments--community)
- **Type**: Minimalist GitHub Issue Comment Widget

---

## Overview

Utterances is a lightweight, open-source comment widget that uses GitHub issues to store and display comments. When a page is visited, Utterances uses the GitHub search API to find the issue associated with the article or creates one automatically when the first comment is submitted.

It has zero tracking, zero ads, no bloat, and pairs naturally with static blogs.

---

## Key Highlights & Features

- **Ultra Lightweight**: Minimal JavaScript footprint with zero tracking.
- **GitHub Issues Backend**: Read and reply to comments directly inside GitHub Issues.
- **Markdown Support**: Full GitHub Flavored Markdown support in comments.
- **Clean Themes**: Seamlessly blends with light and dark GitHub styles.

---

## How It Works with Static Websites

Embed Utterances into your HTML template:

```html
<script src="https://utteranc.es/client.js"
        repo="your-username/your-repo-name"
        issue-term="pathname"
        theme="github-light"
        crossorigin="anonymous"
        async>
</script>
```

---

## When to Use It

- Minimalist developer blogs and portfolios.
- Static sites built with Hugo, Eleventy, Jekyll, or Astro.
- Creators who want simple, bloat-free commenting powered by GitHub.
