# TinyPNG

> Smart lossy compression for WebP, PNG, and JPEG images.

- **Official Website**: <a href="https://tinypng.com/" target="_blank" rel="noopener noreferrer">tinypng.com</a>
- **Category**: [Images & Optimization](../../README.md#images--optimization)
- **Type**: Image Compression Service

---

## Overview

TinyPNG is a widely popular image optimization tool that uses smart lossy compression techniques to reduce the file size of WebP, PNG, and JPEG files. By selectively decreasing the number of colors in an image, file sizes are reduced by 50% to 80% with virtually no noticeable visual degradation.

It preserves full alpha transparency for PNGs and WebP images and offers a web drag-and-drop tool as well as a developer API.

---

## Key Highlights & Features

- **Dramatic Size Reduction**: Shrinks image sizes by up to 70-80% without noticeable quality loss.
- **Preserves Transparency**: Full support for transparent PNG and WebP files.
- **Batch Processing**: Drag and drop up to 20 images at once via the web interface.
- **Developer API**: Automate image compression during static build workflows.

---

## How It Works with Static Websites

Upload images via [tinypng.com](https://tinypng.com/) or use the official Node.js package in your build pipeline:

```bash
# Compress images using the tinify API
npm install tinify
```

```javascript
const tinify = require("tinify");
tinify.key = "YOUR_API_KEY";
tinify.fromFile("unoptimized.png").toFile("optimized.png");
```

---

## When to Use It

- Shrinking hero images, photography, and illustrations on static pages to speed up load times.
- Optimizing transparent PNG logos and graphics to lower bandwidth usage.
- Automating image compression in static site build scripts.
