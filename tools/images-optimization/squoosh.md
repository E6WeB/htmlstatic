# Squoosh

> Compress and convert images directly in your browser with instant visual comparison.

- **Official Website**: <a href="https://squoosh.app/" target="_blank" rel="noopener noreferrer">squoosh.app</a>
- **Category**: [Images & Optimization](../../README.md#images--optimization)
- **Type**: Browser-Based Image Compression

---

## Overview

Squoosh is an open-source web application created by Google Chrome Labs. It uses WebAssembly to run advanced image compression codecs (MozJPEG, WebP, AVIF, OxiPNG) directly inside your web browser.

Because all processing happens locally on your computer, your images are never uploaded to a remote server, ensuring total privacy and near-instant processing.

---

## Key Highlights & Features

- **Runs 100% in Browser**: Private and secure; images never leave your machine.
- **Side-by-Side Visual Slider**: Compare original vs compressed image quality in real time.
- **Next-Gen Formats**: Convert images into lightweight WebP and AVIF files.
- **Detailed Compression Controls**: Fine-tune color palettes, effort levels, and smoothing.

---

## How It Works with Static Websites

Visit [squoosh.app](https://squoosh.app/) in your browser, drag and drop an image, select your desired format (e.g. WebP or AVIF), inspect the quality slider, and download the compressed file.

You can also automate optimization using the Squoosh CLI in your build scripts:

```bash
# Convert all PNGs to WebP
npx @squoosh/cli --webp auto images/*.png
```

---

## When to Use It

- Optimizing hero banners, screenshots, and illustrations before publishing static pages.
- Converting heavy JPEG and PNG files into high-efficiency WebP and AVIF formats.
- Quick manual image compression without installing desktop software.
