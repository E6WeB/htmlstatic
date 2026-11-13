# WordCraft

> Fast, open-source word processor with native .docx support and clean PDF export built in pure Rust.

1. **Official Website**: <a href="https://getartcraft.com/apps/wordcraft" target="_blank" rel="noopener noreferrer">getartcraft.com/apps/wordcraft</a>
2. **Category**: [Development Tools](../../README.md#development-tools)
3. **Type**: Open Source Word Processor & Document Editor
4. **Pricing / License**: Open Source / Freemium

- **Tags**: `word-processor`, `rust`, `docx`, `markdown`, `documents`, `offline`, `mcp`, `beta`, `wordcraft`, `open-source-word-processor`
---

## Overview

> [!NOTE]
> **Beta Release** — WordCraft is currently in active beta development as part of the open-source ArtCraft suite. Standalone installers, portable builds, and CLI binaries are available on GitHub Releases.

**WordCraft** is a lightweight, high-performance word processor built from the ground up in pure Rust. Designed as an open-source, offline replacement for Microsoft Word, it offers the familiar ribbon layout, styles gallery, formatting shortcuts, and review workflow without account registrations, license servers, or internet dependencies.

Unlike bloated office suites that take seconds to load and consume gigabytes of memory, WordCraft starts instantaneously and caches paragraph layouts. Even in extensive documents spanning hundreds of pages, edits re-flow in approximately 1.4 milliseconds. It natively reads and writes `.docx` and `.odt` files and provides seamless bidirectional interoperability with Markdown, HTML, and print-ready PDF formats.

---

## Key Highlights & Features

1. **Native Rust Architecture**: Fast, responsive desktop binary with zero web-engine or Electron bloat.
2. **Native `.docx` & Multi-Format Support**: Reads and writes Microsoft Word `.docx` documents natively; imports and exports `.odt`, `.rtf`, `.html`, `.md` (Markdown), and plain text.
3. **High-Speed Layout Engine**: Advanced cached paragraph composition that lays out long-form documents in sub-2ms intervals on modern hardware.
4. **Track Changes & Collaborative Review**: In-line insertions, deletions, margin comment balloons, document diff comparisons, and built-in offline spelling and grammar tools.
5. **Academic & Business References**: Automated generation of tables of contents with dot leaders, footnotes, endnotes, captions, indexes, and citations in APA, MLA, Chicago, and IEEE styles.
6. **Print & Web PDF Export**: Generates clean, searchable PDFs with embedded fonts, crisp vector typography, and interactive bookmarks.
7. **Agent-Ready & MCP Server**: Features 389 discrete commands accessible via keyboard, `wordcraft-cli`, a JSON control channel, and an MCP server for AI-driven document automation.

---

## How It Works with Static Websites

### 1. Authoring Content and Exporting to Markdown or HTML

Writers and team members can compose long-form documentation, whitepapers, or articles using WordCraft's familiar GUI and export directly to clean Markdown for static site generators:

```bash
# Convert a WordCraft document to Markdown for static site generators
wordcraft-cli convert user-manual.docx --to markdown -o content/docs/manual.md
```

### 2. Automated Static Site Document Publishing

Integrate `wordcraft-cli` into your build workflow (e.g. Hugo, Astro, or Next.js) to generate both downloadable PDF versions and web pages from a single `.docx` source:

```bash
# Generate high-resolution PDF for site visitors
wordcraft-cli convert report.docx --to pdf --embed-fonts -o public/downloads/report.pdf
```

---

## When to Use It

1. Technical writers and developers authoring guides or blog posts who prefer a visual ribbon processor that exports clean Markdown and HTML.
2. Static sites and Jamstack projects offering downloadable, publication-quality PDF resources generated from local documents.
3. Anyone looking for a privacy-respecting, lightweight Word alternative that works completely offline.

---

## Pricing & Limits

- **Open Source / Free Tier**: $0 — free desktop app and open-source code when bringing your own compute or third-party model keys
- **ArtCraft Cloud AI Credits**: Basic (~$8–$10/mo, ~1,000 credits), Pro (~$28–$35/mo, ~3,750 credits), Max (~$48–$60/mo, ~6,600 credits)
