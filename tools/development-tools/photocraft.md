# PhotoCraft

> Open-source desktop image editor with layers, masks, curves, and PSD/PSB support in pure Rust.

- **Official Website**: <a href="https://getartcraft.com/apps/photocraft" target="_blank" rel="noopener noreferrer">getartcraft.com/apps/photocraft</a>
- **GitHub Repository**: <a href="https://github.com/storytold/photocraft" target="_blank" rel="noopener noreferrer">github.com/storytold/photocraft</a>
- **Category**: [Development Tools](../../README.md#development-tools)
- **Type**: Open Source Raster Image Editor & Layered Canvas
- **Pricing / License**: Free / Open Source
- **Status**: Beta / Early Alpha
- **Platform**: macOS, Windows, Linux, Web
- **Tags**: `image-editor`, `rust`, `photoshop-alternative`, `psd`, `layers`, `graphics`, `offline`, `beta`, `photocraft`, `open-source-photoshop`

---

## Overview

> [!NOTE]
> **Beta Release** — PhotoCraft is currently in active beta / early alpha development as part of the open-source ArtCraft suite. Native installers and standalone portable binaries are available on GitHub Releases.

**PhotoCraft** is a native, open-source image editor written entirely in Rust from the ground up. Designed as a free, offline alternative to proprietary image editors like Adobe Photoshop, it delivers the familiar shortcuts, panels, menus, and layer workflows creators already know without subscription fees, mandatory accounts, or invasive telemetry.

Instead of running inside heavy web frameworks or Electron wrappers, PhotoCraft renders its canvas using a fast, native GPU compositor on Metal, Vulkan, DirectX 12, and WebGPU. It opens and saves real layered PSD and PSB files byte-for-byte, making it an ideal local tool for web designers preparing raster graphics, optimizing promotional banners, and editing photographic assets for static websites.

---

## Key Highlights & Features

- **Native Rust & GPU Acceleration**: Zero Electron or web-view overhead. Renders instantly on Metal (macOS), DirectX 12 (Windows), Vulkan (Linux), and WebGPU.
- **Layered PSD & PSB Compatibility**: Seamlessly open, edit, and export layered Photoshop files with full layer hierarchy and blending modes.
- **Non-Destructive Adjustments**: 16 adjustment layers (Curves, Levels with live histogram, Hue/Saturation, Color Balance, Brightness/Contrast) and 70+ real-time filters.
- **Full Layer Styles & Vectors**: Drop shadows, outer glow, stroke, color overlays, smart objects, editable type, and vector paths.
- **On-Device Selections**: Fast subject, object, and color selections running locally on your hardware with no cloud upload required.
- **Color Depth & Management**: Full support for 8, 16, and 32-bit documents in RGB, CMYK, Lab, and Grayscale with ICC color profile management and soft proofing.
- **Headless CLI & Agent Automation**: Includes `photocraft-cli`, a JSON control socket, and an MCP server for programmatic batch asset generation.

---

## How It Works with Static Websites

### 1. Preparing and Exporting Web Graphics

Design your website hero banners, social share open graph images (1200×630), or avatars with non-destructive text and curves:

```bash
# Automate image exports with the headless CLI
photocraft-cli render hero-banner.psd --format webp --quality 85 -o dist/hero.webp
```

### 2. Batch Scripting in Build Pipelines

Integrate PhotoCraft into static site build pipelines (e.g., Astro, Eleventy, or Vite) to convert layered master graphics into web assets:

```javascript
// package.json script example
{
  "scripts": {
    "assets:build": "photocraft-cli export assets/*.psd --out public/images/ --format webp"
  }
}
```

---

## When to Use It

- Designing and exporting responsive raster artwork, banners, and thumbnails for static blogs and landing pages.
- Developers and designers seeking an offline, subscription-free Photoshop replacement with instant launch times.
- Teams that need programmatic image compositing and format conversion using a headless Rust CLI or MCP server.
