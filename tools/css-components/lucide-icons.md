# Lucide Icons

> Clean, customizable open-source icon set with lightweight vanilla JavaScript and SVG support.

1. **Official Website**: <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer">lucide.dev</a>
2. **Category**: [CSS & UI Component Libraries](../../README.md#css--ui-component-libraries)
3. **Type**: Vector Icon System
4. **Pricing / License**: Open Source

- **Tags**: `lucide-icons`, `feather-icons-fork`, `svg-icon-library`, `tree-shakable-icons`, `clean-vector-icons`, `ui-components`, `classless-css`, `lightweight-css`, `web-components`, `responsive-design`
---

## Overview

Lucide is a community-run fork of Feather Icons featuring over 1,400 sharp, consistent vector icons. It is designed to be lightweight, customizable, and easily embeddable into static web projects.

You can use Lucide as standalone inline SVGs, reference external files, or use the small vanilla JavaScript package that replaces `<i data-lucide="...">` elements with crisp SVGs.

---

## Key Highlights & Features

1. **1,400+ Icons**: High-quality, consistent 24x24 outline vector icons.
2. **Vanilla JS Helper**: Automatically replaces HTML placeholders with rendered SVGs.
3. **Highly Customizable**: Easily modify size, stroke width, and colors via CSS.
4. **Open Source**: Permissive ISC license for commercial and personal projects.

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

1. Adding clean, consistent icons to buttons, headers, and feature lists on static pages.
2. Developers avoiding heavy icon fonts like FontAwesome that slow down load times.
3. Projects looking for scalable, responsive icons that match modern design trends.
