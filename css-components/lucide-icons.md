# Lucide Icons

> Clean, customizable open-source icon set with lightweight vanilla JavaScript and SVG support.

- **Official Website**: <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer">lucide.dev</a>
- **Category**: [CSS & UI Component Libraries](../README.md#css--ui-component-libraries)
- **Type**: Vector Icon System

---

## Overview

Lucide is a community-run fork of Feather Icons featuring over 1,400 sharp, consistent vector icons. It is designed to be lightweight, customizable, and easily embeddable into static web projects.

You can use Lucide as standalone inline SVGs, reference external files, or use the small vanilla JavaScript package that replaces `<i data-lucide="...">` elements with crisp SVGs.

---

## Key Highlights & Features

- **1,400+ Icons**: High-quality, consistent 24x24 outline vector icons.
- **Vanilla JS Helper**: Automatically replaces HTML placeholders with rendered SVGs.
- **Highly Customizable**: Easily modify size, stroke width, and colors via CSS.
- **Open Source**: Permissive ISC license for commercial and personal projects.

---

## How It Works with Static Websites

Use Lucide in static HTML with the CDN script:

```html
<!-- Include Lucide script -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Add icon placeholders -->
<i data-lucide="check-circle" style="color: green;"></i>
<i data-lucide="arrow-right"></i>
<i data-lucide="github"></i>

<!-- Initialize icons -->
<script>
  lucide.createIcons();
</script>
```

---

## When to Use It

- Adding clean, consistent icons to buttons, headers, and feature lists on static pages.
- Developers avoiding heavy icon fonts like FontAwesome that slow down load times.
- Projects looking for scalable, responsive icons that match modern design trends.
