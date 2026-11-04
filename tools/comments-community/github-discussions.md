# GitHub Discussions

> Collaborative community discussion forum and Q&A platform built natively into GitHub.

1. **Official Website**: <a href="https://docs.github.com/en/discussions" target="_blank" rel="noopener noreferrer">docs.github.com</a>
2. **Category**: [Comments & Community](../../README.md#comments--community)
3. **Type**: Hosted Community & Discussion Forum
4. **Pricing / License**: Free

- **Tags**: `github-discussions`, `open-source-community`, `developer-qna`, `repo-forum`, `zero-cost-community`, `static-blog-comments`, `disqus-alternative`, `github-comments`, `no-database`, `community-widget`
---

## Overview

GitHub Discussions is a collaborative communication forum hosted natively within GitHub repositories and organizations. It provides a dedicated space for community members and maintainers to ask questions, share announcements, discuss feature ideas, and run polls without cluttering GitHub Issues or pull requests.

For static websites and documentation projects, GitHub Discussions acts as a powerful, zero-maintenance discussion backend. Because GitHub provides a rich GraphQL API, static websites can either link directly to discussion categories or embed interactive discussion threads directly into static pages using client-side tools like Giscus.

---

## Key Highlights & Features

1. **Free & Hosted**: Built directly into GitHub with zero hosting fees, server maintenance, or database setup.
2. **Q&A Format with Answer Upvoting**: Community members can ask questions and mark the most helpful response as the accepted answer.
3. **GraphQL API Support**: Query threads, submit comments, and fetch reactions programmatically from static web applications.
4. **Comment Widget Integration**: Powers static comment widgets like Giscus to provide clean, tracker-free blog commenting.
5. **GitHub Flavored Markdown**: Full support for syntax-highlighted code snippets, checklists, tables, and emoji reactions.
6. **Built-in Moderation & Access Control**: Robust spam filtering, user blocking, lockable threads, and customizable permissions.

---

## How It Works with Static Websites

### 1. Direct Community Discussion Links
Add direct links from your static site navigation or documentation headers pointing to your repository's Discussions boards:

```html
<a href="https://github.com/YOUR_ORG/YOUR_REPO/discussions" target="_blank" rel="noopener noreferrer" class="btn">
  Join the Community Forum →
</a>
```

### 2. Embed Discussions as Comments via Giscus
Use Giscus to embed GitHub Discussions directly onto your static blog posts or documentation articles:

```html
<div class="giscus"></div>

<script src="https://giscus.app/client.js"
        data-repo="your-username/your-repo"
        data-repo-id="R_kgDO..."
        data-category="Announcements"
        data-category-id="DIC_kwDO..."
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="light"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
```

---

## When to Use It

1. Open-source projects, developer tools, and technical documentation websites.
2. Blogs and documentation where readers and contributors already possess GitHub accounts.
3. Site owners who want full forum and Q&A functionality with zero server overhead and robust GitHub-grade spam filtering.
