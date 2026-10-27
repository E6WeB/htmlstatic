# Bulma

> Modern CSS framework based on Flexbox with 100% CSS and zero JavaScript dependencies.

- **Official Website**: <a href="https://bulma.io/" target="_blank" rel="noopener noreferrer">bulma.io</a>
- **Category**: [CSS & UI Component Libraries](../../README.md#css--ui-component-libraries)
- **Type**: Pure CSS Framework

---

## Overview

Bulma is a popular open-source CSS framework based on Flexbox. It provides clean, semantic class names and responsive grid systems with 100% pure CSS—meaning there is zero JavaScript code included.

You retain complete freedom to implement interactive behaviors in vanilla JavaScript, while Bulma provides the layouts, typography, form controls, cards, and navigation bars.

---

## Key Highlights & Features

- **100% Pure CSS**: Zero JavaScript overhead; no unexpected conflicts with your code.
- **Modular Architecture**: Import only the columns, forms, or components you need.
- **Simple Flexbox Grid**: Intuitive `.columns` and `.column` syntax that is naturally responsive.
- **Modern Design**: Fresh colors, clean typography, and polished UI elements.

---

## How It Works with Static Websites

Include Bulma via CDN in your static HTML:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css">

<section class="section">
  <div class="container">
    <h1 class="title">Bulma Columns</h1>
    <div class="columns">
      <div class="column">First Column</div>
      <div class="column">Second Column</div>
      <div class="column">Third Column</div>
    </div>
    <button class="button is-primary">Primary Button</button>
  </div>
</section>
```

---

## When to Use It

- Static websites wanting clean responsive styling without complex CSS preprocessors.
- Projects where you want full control over your JavaScript without framework interference.
- Landing pages, blogs, and admin dashboards.
