# PdfCraft

> Open-source desktop PDF workbench to read, split, merge, and organize documents offline in pure Rust.

- **Official Website**: <a href="https://getartcraft.com/apps/pdfcraft" target="_blank" rel="noopener noreferrer">getartcraft.com/apps/pdfcraft</a>
- **GitHub Repository**: <a href="https://github.com/storytold/pdfcraft" target="_blank" rel="noopener noreferrer">github.com/storytold/pdfcraft</a>
- **Category**: [Development Tools](../../README.md#development-tools)
- **Type**: Open Source PDF Reader, Editor & Workbench
- **Pricing / License**: Free / Open Source
- **Status**: Beta / Early Alpha
- **Platform**: macOS, Windows, Linux, Web
- **Tags**: `pdf`, `rust`, `pdf-editor`, `document-tools`, `split-pdf`, `merge-pdf`, `offline`, `beta`

---

## Overview

> [!NOTE]
> **Beta Release** — PdfCraft is currently in active beta / early alpha development as part of the open-source ArtCraft suite. Official builds and standalone binaries are available on GitHub Releases.

**PdfCraft** is a fast, native PDF workbench written entirely in Rust from the ground up. Created as a free, privacy-first alternative to Adobe Acrobat and web-based PDF upload utilities, PdfCraft operates 100% locally on your machine with zero cloud telemetry, no accounts, and no data tracking.

PdfCraft combines a crisp document viewer with an intuitive card-style visual page organizer. You can effortlessly reorder pages, rotate misaligned scans, extract specific sections, and merge multiple documents into a single cohesive file while maintaining bookmarks, interactive form fields, and internal hyperlinks intact.

---

## Key Highlights & Features

- **Pure Rust Native Engine**: Blazing-fast startup and smooth rendering across complex documents without browser plugins or heavy Electron frameworks.
- **Card-Style Page Organizer**: View all pages as a visual grid to drag, drop, rotate, duplicate, delete, and reorder pages with deep multi-level undo.
- **Combine, Extract & Split**: Merge multiple PDFs or split large documents into distinct chapters while preserving bookmarks, links, and annotations.
- **Faithful Typography & Graphics**: Renders international scripts, vertical text, transparency, and color emoji accurately with zero crashes across extensive stress-test suites.
- **Search As You Type**: Instant keyword search with text selection that strictly follows the document's natural reading order.
- **Built-in PDF Security**: Opens documents encrypted with RC4 through AES-256, respects author permissions, and allows setting access passwords.
- **Command Palette & Headless CLI**: Press `Cmd/Ctrl+K` for instant tool navigation, or use `pdfcraft-cli` to automate PDF operations in terminal scripts.

---

## How It Works with Static Websites

### 1. Preparing Documentation and Downloads

Prepare whitepapers, cheat sheets, and downloadable user manuals for static sites by merging chapters, optimizing file sizes, and stripping unnecessary private metadata:

```bash
# Merge multiple chapter PDFs into a single unified manual
pdfcraft-cli merge chapter-1.pdf chapter-2.pdf chapter-3.pdf -o dist/downloads/full-manual.pdf
```

### 2. Automated Build Pipelines

Incorporate `pdfcraft-cli` into your continuous integration or static site build steps to generate clean, distribution-ready PDFs:

```bash
# Extract the first 3 pages as an introductory sample PDF
pdfcraft-cli extract ebook.pdf --pages 1-3 -o public/samples/ebook-preview.pdf
```

---

## When to Use It

- Developers, creators, and students who want a fast, offline PDF tool without uploading sensitive documents to third-party web servers.
- Static site projects needing to bundle, split, or optimize downloadable PDF guides and resources.
- Anyone looking for a lightweight, ad-free alternative to bloated commercial PDF editors.
