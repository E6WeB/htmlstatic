# Antigravity CLI (`agy`)

> Command-line AI coding agent that brings autonomous planning, editing, and automation directly into your terminal.

- **Official Website**: <a href="https://antigravity.google/docs/cli" target="_blank" rel="noopener noreferrer">antigravity.google/docs/cli</a>
- **Category**: [Development Tools](../README.md#development-tools)
- **Type**: Command-Line Interface & AI Agent
- **Pricing / License**: Free

---

## Overview

The Antigravity CLI (`agy`) is a terminal-native AI agent designed for developers who prefer command-line workflows. It allows you to run high-level natural language instructions against any codebase, executing multi-file edits, running shell commands, executing automated test suites, and orchestrating complex background tasks.

For static website creators, `agy` streamlines tasks like batch image optimization, HTML SEO meta tag audits, asset reorganizations, and static site generator builds without leaving your shell.

---

## Key Highlights & Features

- **Terminal-First Workflow**: Run interactive sessions or one-shot commands directly inside PowerShell, Bash, or Zsh.
- **Slash Commands**: Quick shortcuts like `/plan` (step-by-step roadmaps), `/goal` (deep long-running execution), and `/grill-me` (interactive interview to finalize specs).
- **Customization Ecosystem**: Native loading of workspace skills, project rules (`.agents/`), hooks, and Model Context Protocol (MCP) servers.
- **Headless Task Execution**: Ideal for CI/CD pipelines, git hook automation, and automated repository maintenance.
- **Full Shell Integration**: Safely runs commands, monitors dev servers, and parses build outputs autonomously.

---

## Example Usage with Static Websites

### 1. Interactive Agent Session
```bash
agy
```

### 2. Single-Command Prompt
```bash
agy "Audit all HTML files in public/ for missing meta description tags and add appropriate fallbacks."
```

### 3. Automated Asset Optimization
```bash
agy "Convert all raw JPEG images in assets/images to optimized WebP format and update the img tags across index.html."
```

---

## When to Use It

- Developers who live in the terminal and want keyboard-driven AI coding assistance.
- Scripting repetitive web maintenance, formatting, and file refactoring.
- Automating static site deployment prep and validation in CI/CD pipelines.

---

[← Back to Development Tools](../README.md#development-tools) | [← Back to Static Website Toolkit](../README.md)
