# FigCraft

> Open-source interface design, auto layout, and prototyping tool rebuilt in pure Rust.

1. **Official Website**: <a href="https://getartcraft.com/apps/figcraft" target="_blank" rel="noopener noreferrer">getartcraft.com/apps/figcraft</a>
2. **Category**: [Development Tools](../../README.md#development-tools)
3. **Type**: Open Source Interface Design & Prototyping Platform
4. **Pricing / License**: Open Source / Freemium

- **Tags**: `ui-design`, `rust`, `figma-alternative`, `prototyping`, `auto-layout`, `dev-mode`, `vector`, `beta`, `figcraft`, `open-source-figma`
---

## Overview

> [!NOTE]
> **Beta Release** — FigCraft is currently in active beta / early alpha development as part of the open-source ArtCraft suite. Installers and binaries are available on GitHub Releases.

**FigCraft** is a native, open-source interface design and prototyping application rebuilt from scratch in pure Rust. Created as an offline-first alternative to Figma, FigCraft delivers a familiar design workspace—featuring frames, bi-directional auto layout, component variants, design tokens, and vector networks—with zero subscriptions, zero telemetry, and zero mandatory cloud accounts.

Because FigCraft compiles to native machine code and renders via GPU acceleration, it launches instantly and handles large design systems with thousands of nested components without browser tab crashes or memory lag. It offers built-in peer-to-peer and self-hostable live collaboration, interactive prototyping transitions, and a developer mode that produces production-ready CSS, HTML, React, SwiftUI, and Jetpack Compose code.

---

## Key Highlights & Features

1. **Familiar Workspace & Intuitive UX**: Toolbar, layers panel, design inspector, assets drawer, and keyboard shortcuts positioned exactly where designers expect them.
2. **Bi-Directional Auto Layout**: Full flexbox-style auto layout with horizontal and vertical wrapping, layout grids, auto-padding, gap controls, and Hug/Fill/Fixed sizing rules.
3. **Components & Variants at Scale**: Reusable master components, variant matrices, property bindings, and design variable modes (supporting instant light/dark theme toggles).
4. **Advanced Vector Networks**: Native pen and pencil tools, shape builder, editable boolean operations (union, subtract, intersect, exclude), and variable-width strokes.
5. **Interactive Prototyping**: Connect screens with triggers, animated easing transitions, overlay states, and responsive presentation previews.
6. **Developer Mode & Code Generation**: Inspect paddings, view design annotations, and copy generated HTML, CSS, React, SwiftUI, or Compose snippets directly.
7. **Live Collaborative Sessions**: Host a design session from your machine or a private self-hosted server with live multi-user cursors, selection highlights, and cursor chat.
8. **MCP Server & Agent Control**: 400+ discrete commands allowing programmatic design generation through the command line or AI coding agents.

---

## How It Works with Static Websites

### 1. Designing and Exporting Static Web Components

Create design tokens, layouts, and SVG assets in FigCraft, then inspect and copy clean CSS or SVG paths directly into your static site:

```html
<!-- Example exported design token classes & SVG markup -->
<div class="card-feature" style="display: flex; gap: 1rem; padding: 1.5rem; border-radius: 12px; background: var(--bg-surface);">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <!-- Clean SVG vector path exported directly from FigCraft -->
  </svg>
  <h3>Feature Title</h3>
</div>
```

### 2. Automated Asset Sync via CLI & MCP

Automate vector icon exports and design token generation into your static site's repository:

```bash
# Export all component vectors as optimized SVG files
figcraft-cli export design-system.figcraft --components "Icons/*" --format svg -o src/assets/icons/
```

---

## When to Use It

1. Designing landing pages, application interfaces, and component libraries for static web and Jamstack applications.
2. Teams and independent creators seeking a private, offline Figma alternative without monthly subscriptions.
3. Developers who want instant Dev Mode code generation and automated CLI/MCP design pipeline integration.

---

## Pricing & Limits

- **Open Source / Free Tier**: $0 — free desktop app and open-source code when bringing your own compute or third-party model keys
- **ArtCraft Cloud AI Credits**: Basic (~$8–$10/mo, ~1,000 credits), Pro (~$28–$35/mo, ~3,750 credits), Max (~$48–$60/mo, ~6,600 credits)
