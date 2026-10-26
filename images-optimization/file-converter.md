# File Converter

> Open-source Windows utility to convert and compress images, audio, and video directly from the Windows Explorer context menu.

- **Official Website**: <a href="https://file-converter.io/" target="_blank" rel="noopener noreferrer">file-converter.io</a>
- **Source Code**: <a href="https://github.com/Tichau/FileConverter" target="_blank" rel="noopener noreferrer">github.com/Tichau/FileConverter</a>
- **Category**: [Images & Optimization](../README.md#images--optimization)
- **Platform**: Windows (Windows 11 & Windows 10)
- **Type**: Desktop Context-Menu Utility (Open Source)

---

## Overview

File Converter is an open-source Windows application created by Adrien Allard (Tichau) that allows you to convert and compress one or multiple files directly from the Windows File Explorer context menu. 

For static website creators, it provides a fast offline workflow to batch-convert images (PNG, JPEG, TIFF, BMP) into lightweight modern web formats such as **WebP** or **ICO**, as well as compress assets before committing them to Git—all without opening graphic design software or uploading files to an online service.

---

> [!NOTE]
> **Windows 11 Usage Note**:  
> Because Windows 11 uses a streamlined right-click menu, File Converter appears under the classic context menu. To access it on Windows 11:
> 1. Right-click the file(s) in Windows File Explorer.
> 2. Click **Show more options** (or press `Shift` + `F10`).
> 3. Hover over **File Converter** in the menu and select your target format (e.g., *To Webp*, *To Png*).

---

## Key Highlights & Features

- **Explorer Integration**: Convert files directly from the right-click menu with zero application switching.
- **Batch Processing**: Select dozens or hundreds of images at once and convert them in parallel.
- **Web-Ready Formats**: Convert to WebP, PNG, JPEG, GIF, and ICO with customized compression presets.
- **Custom Presets**: Create custom presets to adjust image quality, scaling, and output folders.
- **100% Free & Open Source**: Licensed under GPL v3 with no ads, tracking, or subscription tiers.

---

## How It Works with Static Websites

### 1. Rapid WebP Conversion
Select all raw PNG/JPEG images in your static site project's `assets/images/` directory:
1. Highlight your images in Windows Explorer.
2. Right-click → **Show more options** → **File Converter** → **To Webp**.
3. File Converter generates optimized `.webp` copies alongside your originals in seconds.

### 2. Favicon Generation
Right-click your brand logo (PNG) → **File Converter** → **To Ico** to instantly create a multi-resolution `favicon.ico` for your static site `<head>`.

---

## Supported Input & Output Formats (Web Relevant)

| Media Type | Input Formats | Output Formats |
| :--- | :--- | :--- |
| **Images** | PNG, JPG, JPEG, WebP, GIF, ICO, BMP, TIFF, SVG, PSD | **WebP, PNG, JPG, GIF, ICO** |
| **Audio / Video** | MP4, MKV, WebM, MP3, WAV, OGG, FLAC | **WebM, MP4, MP3, OGG** |

---

## When to Use It

- Batch converting static website images to WebP format directly on Windows 11.
- Generating favicons (`favicon.ico`) quickly without using third-party web tools.
- Compressing screenshots and blog post illustrations offline with full privacy.
