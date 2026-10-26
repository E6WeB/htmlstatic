# Contributing to Static Website Toolkit

Thank you for your interest in contributing to the **Static Website Toolkit**! 🎉

This is an open, community-curated collection of tools, services, and resources that help people build, host, and enhance static websites with HTML, CSS, and JavaScript. Every contribution—whether adding a new tool, fixing a broken link, or suggesting a new category—helps keep this resource accurate and valuable for everyone.

---

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Submission Guidelines](#submission-guidelines)
- [Entry Format & Template](#entry-format--template)
- [How to Submit a Pull Request](#how-to-submit-a-pull-request)
- [How to Submit via an Issue](#how-to-submit-via-an-issue)
- [Pull Request Checklist](#pull-request-checklist)
- [License](#license)

---

## Ways to Contribute

You can help improve this list in several ways:

1. **Add a new tool**: Introduce a service or tool that helps static websites operate without a traditional CMS or dedicated backend.
2. **Suggest a new category**: If you know of valuable tools that don't fit into existing sections (e.g., Auth, A/B Testing, Video Hosting), suggest a new category.
3. **Fix outdated entries**: Report or fix broken links, outdated descriptions, pricing model changes, or discontinued services.
4. **Share open-source / free alternatives**: We love highlighting accessible, privacy-respecting, and open-source solutions.
5. **Improve documentation**: Refine descriptions for clarity and accuracy.

---

## Submission Guidelines

To keep this collection high-quality, practical, and spam-free, please adhere to these guidelines:

### 1. Relevance
- The tool must directly benefit **static HTML, CSS, and JavaScript websites** or Jamstack/frontend architectures.
- It should enable features typically requiring a backend (e.g., forms, comments, payments, search, auth) via APIs, widgets, edge functions, or client-side scripts.
- General web tools that are not particularly relevant to static site development may be declined.

### 2. Zero Advertising & No Affiliate Links
- **Zero advertisement and no affiliate links are allowed.**
- Always link directly to the **official website** or official repository using clean, secure HTTPS URLs.
- Submissions containing sponsored promotions, advertisements, referral parameters, or affiliate tags will be rejected immediately.

### 3. Clear, Objective Descriptions
- Write a concise, one-sentence description explaining **what the tool does**, not how great it is.
- Avoid marketing hype, buzzwords, or unverified claims (e.g., avoid *"The #1 blazing-fast ultimate solution"*).
- Good example: `Static search indexing designed for static websites`
- Bad example: `The best, most powerful search engine on the planet!`

### 4. No Duplicates
- Before submitting, search [`README.md`](README.md) (`Ctrl`+`F` or `Cmd`+`F`) to verify that the tool has not already been listed under another category.

### 5. Transparency & Affiliation
- Creators and maintainers are welcome to submit their own tools!
- Please be transparent if you are affiliated with the product or service you are submitting.
- Submissions must prioritize usefulness to the community over advertising or self-promotion.

---

## Entry Format & Template

All tools in [`README.md`](README.md) are listed in Markdown tables with three columns: **Tool**, **Description**, and **Website**.

External links use HTML anchor tags formatted with `target="_blank" rel="noopener noreferrer"`.

### Template:

```markdown
| <a href="https://example.com/" target="_blank" rel="noopener noreferrer">Tool Name</a> | Clear one-sentence description of what it does | <a href="https://example.com/" target="_blank" rel="noopener noreferrer">example.com</a> |
```

### Example:

```markdown
| <a href="https://pagefind.app/" target="_blank" rel="noopener noreferrer">Pagefind</a> | Static search indexing designed for static websites | <a href="https://pagefind.app/" target="_blank" rel="noopener noreferrer">pagefind.app</a> |
```

---

## How to Submit a Pull Request

If you are comfortable using Git and GitHub:

1. **Fork the Repository**: Click the **Fork** button at the top right of this repository to create your own copy.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/<your-username>/htmlstatic.git
   cd htmlstatic
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b add-tool-name
   ```
4. **Edit [`README.md`](README.md)**:
   - Locate the most relevant category table.
   - Insert your new entry following the [Entry Format](#entry-format--template).
   - Ensure the table syntax remains properly aligned and valid markdown.
5. **Commit your Changes**:
   Write a clear, descriptive commit message:
   ```bash
   git commit -m "Add ToolName to Contact Forms category"
   ```
6. **Push to GitHub**:
   ```bash
   git push origin add-tool-name
   ```
7. **Open a Pull Request**:
   - Go to your fork on GitHub and click **Compare & pull request**.
   - Provide a brief description explaining what the tool is and why it belongs in this collection.
   - Submit the PR for review!

---

## How to Submit via an Issue (Recommended)

Submitting via GitHub Issues is the quickest and easiest way to propose a tool, service, or resource:

1. Go to the **<a href="https://github.com/E6WeB/htmlstatic/issues" target="_blank" rel="noopener noreferrer">GitHub Issues Section</a>** and click **<a href="https://github.com/E6WeB/htmlstatic/issues/new/choose" target="_blank" rel="noopener noreferrer">New Issue</a>**.
2. Select the **Submit a Tool or Site** template.
3. Fill out the form fields:
   - **Tool or Site Name**: Official name
   - **Official Website URL**: Clean HTTPS link (no tracking or affiliate codes)
   - **Category**: Select the best category match (or suggest a new one)
   - **Short Description**: One objective sentence explaining what it does
4. Submit the issue! Once the site is verified, it will be added to `README.md`.

---

## Pull Request Checklist

Before opening your pull request, please make sure:

- [ ] The tool is relevant to static websites and frontend development.
- [ ] You searched [`README.md`](README.md) to ensure it is not already listed.
- [ ] Zero advertisement and no affiliate links (official HTTPS URL with no tracking/referral parameters).
- [ ] The description is concise, objective, and one sentence long.
- [ ] The entry follows the table format with `target="_blank" rel="noopener noreferrer"`.
- [ ] All existing tables and markdown formatting remain valid.

---

## License

By contributing to this repository, you agree that your contributions will be licensed under the [Creative Commons Zero (CC0 1.0 Universal) Public Domain Dedication](https://creativecommons.org/publicdomain/zero/1.0/).
