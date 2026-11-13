# PdfCraft

> Open-source desktop PDF workbench to read, split, merge, and organize documents offline in pure Rust.

1. **Official Website**: <a href="https://getartcraft.com/apps/pdfcraft" target="_blank" rel="noopener noreferrer">getartcraft.com/apps/pdfcraft</a>
2. **Category**: [Development Tools](../../README.md#development-tools)
3. **Type**: Open Source PDF Reader, Editor & Workbench
4. **Pricing / License**: Open Source / Freemium

- **Tags**: `pdf`, `rust`, `pdf-editor`, `document-tools`, `split-pdf`, `merge-pdf`, `offline`, `beta`, `pdfcraft`, `open-source-acrobat`
---

## Overview

> [!NOTE]
> **Beta Release** — PdfCraft is currently in active beta / early alpha development as part of the open-source ArtCraft suite. Official builds and standalone binaries are available on GitHub Releases.

**PdfCraft** is a fast, native PDF workbench written entirely in Rust from the ground up. Created as a free, privacy-first alternative to Adobe Acrobat and web-based PDF upload utilities, PdfCraft operates 100% locally on your machine with zero cloud telemetry, no accounts, and no data tracking.

PdfCraft combines a crisp document viewer with an intuitive card-style visual page organizer. You can effortlessly reorder pages, rotate misaligned scans, extract specific sections, and merge multiple documents into a single cohesive file while maintaining bookmarks, interactive form fields, and internal hyperlinks intact.

---

## Key Highlights & Features

1. **Pure Rust Native Engine**: Blazing-fast startup and smooth rendering across complex documents without browser plugins or heavy Electron frameworks.
2. **Card-Style Page Organizer**: View all pages as a visual grid to drag, drop, rotate, duplicate, delete, and reorder pages with deep multi-level undo.
3. **Combine, Extract & Split**: Merge multiple PDFs or split large documents into distinct chapters while preserving bookmarks, links, and annotations.
4. **Faithful Typography & Graphics**: Renders international scripts, vertical text, transparency, and color emoji accurately with zero crashes across extensive stress-test suites.
5. **Search As You Type**: Instant keyword search with text selection that strictly follows the document's natural reading order.
6. **Built-in PDF Security**: Opens documents encrypted with RC4 through AES-256, respects author permissions, and allows setting access passwords.
7. **Command Palette & Headless CLI**: Press `Cmd/Ctrl+K` for instant tool navigation, or use `pdfcraft-cli` to automate PDF operations in terminal scripts.

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

1. Developers, creators, and students who want a fast, offline PDF tool without uploading sensitive documents to third-party web servers.
2. Static site projects needing to bundle, split, or optimize downloadable PDF guides and resources.
3. Anyone looking for a lightweight, ad-free alternative to bloated commercial PDF editors.

---

## Pricing & Limits

- **Open Source / Free Tier**: $0 — free desktop app and open-source code when bringing your own compute or third-party model keys
- **ArtCraft Cloud AI Credits**: Basic (~$8–$10/mo, ~1,000 credits), Pro (~$28–$35/mo, ~3,750 credits), Max (~$48–$60/mo, ~6,600 credits)
