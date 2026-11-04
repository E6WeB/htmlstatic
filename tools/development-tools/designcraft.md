# DesignCraft

> Open-source desktop page layout and publishing app with Knuth-Plass typography in pure Rust.

- **Official Website**: <a href="https://getartcraft.com/apps/designcraft" target="_blank" rel="noopener noreferrer">getartcraft.com/apps/designcraft</a>
- **GitHub Repository**: <a href="https://github.com/storytold/designcraft" target="_blank" rel="noopener noreferrer">github.com/storytold/designcraft</a>
- **Category**: [Development Tools](../../README.md#development-tools)
- **Type**: Open Source Page Layout & Desktop Publishing App
- **Pricing / License**: Free / Open Source
- **Status**: Beta / In Development
- **Platform**: macOS, Windows, Linux, Web
- **Tags**: `page-layout`, `rust`, `indesign-alternative`, `desktop-publishing`, `typography`, `pdf-export`, `print-design`, `beta`, `designcraft`, `open-source-indesign`

---

## Overview

> [!NOTE]
> **Beta Release** — DesignCraft is currently in active beta development as part of the open-source ArtCraft suite. Official installers and portable builds are available on GitHub Releases.

**DesignCraft** is an open-source desktop page layout and publication design application written entirely in pure Rust. Built as a native alternative to Adobe InDesign and QuarkXPress, DesignCraft provides a professional workspace for creating brochures, magazines, digital zines, manuals, and ebooks with zero subscription licenses, zero phone-home servers, and zero telemetry.

DesignCraft features multi-page spreads, parent (master) pages, threaded text frames, paragraph and character styles, and text wrapping around complex visual elements. At its core is a world-class Knuth–Plass paragraph composer with hyphenation dictionaries and optical margin alignment, ensuring that typography matches perfectly between on-screen design, web exports, and high-resolution print-ready PDFs.

---

## Key Highlights & Features

- **Native Rust Performance**: Fast, multithreaded layout engine using SIMD acceleration for instant redraws and silky smooth canvas panning.
- **Publication Spreads & Parent Pages**: Multi-page facing spreads, master parent pages for headers/footers, and flexible page geometry.
- **Threaded Stories & Text Wrapping**: Flow long-form copy across multiple linked text frames with automatic text wrap around images, shapes, and callouts.
- **Knuth–Plass Paragraph Composer**: Advanced global typesetting with dictionary-based hyphenation, optical margin hanging punctuation, and baseline grid alignment.
- **Print & Digital Output**: High-resolution PDF/A archival export with embedded fonts, bleed margins, crop marks, CMYK swatches, and spot color management.
- **Copy-on-Write Architecture**: Lightweight memory footprint with instantaneous multi-level undo and automatic session recovery.
- **Open Data Interchange & MCP**: Clean open document formats with PNG/SVG export, JSON control channel, and an MCP server for programmatic publishing and automated asset generation.

---

## How It Works with Static Websites

### 1. Generating Digital Publications & Zines

Design digital magazines, lookbooks, or product catalogs in DesignCraft and export optimized web-ready PDFs for visitors to browse or download:

```html
<!-- Embed a downloadable digital brochure on a static landing page -->
<div class="brochure-download-card" style="padding: 1.5rem; border: 1px solid var(--border-color); border-radius: 8px;">
  <h3>Download Spring 2026 Lookbook (PDF)</h3>
  <p>Typeset in DesignCraft with high-resolution vector typography.</p>
  <a href="/downloads/spring-lookbook.pdf" class="btn btn-primary" download>
    Download PDF (8.4 MB)
  </a>
</div>
```

### 2. Programmatic Layout Automation via CLI

Integrate `designcraft-cli` into your documentation builds to compile raw Markdown and images into publication-ready PDF documents:

```bash
# Compile documentation into an official print-quality manual
designcraft-cli build handbook.designcraft --export pdf -o public/handbook.pdf
```

---

## When to Use It

- Creators, publishers, and developers designing brochures, magazines, whitepapers, and guides for static sites.
- Teams looking for a private, offline Adobe InDesign alternative without monthly recurring software fees.
- Programmatic publication pipelines requiring a fast, headless CLI and MCP server for automated typesetting.
