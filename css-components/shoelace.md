# Shoelace (Web Awesome)

> Forward-thinking library of framework-agnostic web components that work with plain HTML.

- **Official Website**: <a href="https://shoelace.style/" target="_blank" rel="noopener noreferrer">shoelace.style</a>
- **Category**: [CSS & UI Component Libraries](../README.md#css--ui-component-libraries)
- **Type**: Standard Web Components Library

---

## Overview

Shoelace (now evolving into Web Awesome) provides a comprehensive library of professionally crafted UI components built on standard Web Components (Custom Elements). 

Unlike component libraries that require React, Vue, or build tools, Shoelace components can be used directly in plain static HTML with a simple script tag. It includes buttons, modals, dropdowns, drawers, tooltips, and tabs that look modern and feel smooth.

---

## Key Highlights & Features

- **Framework Agnostic**: Works natively in static HTML, Astro, Hugo, or any JS framework.
- **Full Accessibility**: Built-in keyboard navigation, ARIA attributes, and focus management.
- **Customizable via CSS Tokens**: Easily theme components with simple CSS custom properties.
- **Rich Component Set**: Dialogs, tooltips, color pickers, progress bars, and icon integrations.

---

## How It Works with Static Websites

Load Shoelace from CDN and use custom elements directly in HTML:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/themes/light.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/shoelace-autoloader.js"></script>

<!-- Interactive dialog component -->
<sl-dialog label="Dialog Header" class="dialog-overview">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  <sl-button slot="footer" variant="primary">Close</sl-button>
</sl-dialog>

<sl-button variant="primary" onclick="document.querySelector('.dialog-overview').show()">
  Open Dialog
</sl-button>
```

---

## When to Use It

- Adding advanced UI components (drawers, modals, tabs, tooltips) to static HTML.
- Building web applications without bundlers, webpack, or framework dependencies.
- Teams wanting accessible, enterprise-grade UI components in pure HTML.
