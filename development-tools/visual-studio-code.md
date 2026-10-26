# Visual Studio Code

> The leading code editor with rich extension support for web development.

- **Official Website**: <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer">code.visualstudio.com</a>
- **Category**: [Development Tools](../README.md#development-tools)
- **Type**: Code Editor & IDE

---

## Overview

Visual Studio Code (VS Code) is a versatile code editor developed by Microsoft. It features built-in Git integration, intelligent code completion (IntelliSense), syntax highlighting, and an extensive extension marketplace.

For static site authors, VS Code offers live server extensions, HTML/CSS validation, markdown previewing, and automated code formatting tools.

---

## Key Highlights & Features

- **IntelliSense**: Smart code completion and parameter info for HTML, CSS, and JS.
- **Built-in Git**: Stage, commit, diff, and push changes directly from the editor.
- **Extension Ecosystem**: Thousands of web development plugins (Live Server, Prettier, ESLint).
- **Integrated Terminal**: Run local servers, build scripts, and CLI utilities inside the app.

---

## How It Works with Static Websites

Recommended `.vscode/extensions.json` for static site projects:

```json
{
  "recommendations": [
    "ritwickdey.liveserver",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bierner.markdown-preview-github-styles"
  ]
}
```

---

## When to Use It

- Daily code editing, file management, and static site development.
- Developers who want a fast, customizable environment with extensive extension support.
