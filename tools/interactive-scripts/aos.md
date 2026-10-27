# AOS (Animate On Scroll)

> Animate elements on your static web pages as visitors scroll down with simple data attributes.

- **Official Website**: <a href="https://michalsnik.github.io/aos/" target="_blank" rel="noopener noreferrer">michalsnik.github.io/aos</a>
- **Category**: [Interactive Scripts & Animation](../../README.md#interactive-scripts--animation)
- **Type**: Scroll Animation Library

---

## Overview

AOS (Animate On Scroll) is a lightweight JavaScript library that triggers CSS animations as elements scroll into the viewport. 

Instead of writing complex intersection observers or scroll listeners, you simply add `data-aos="fade-up"` attributes to your HTML elements. AOS handles the rest smoothly, creating a polished, dynamic experience on static landing pages.

---

## Key Highlights & Features

- **Simple Data Attributes**: Add animations via `data-aos="fade-up"` or `data-aos="zoom-in"`.
- **Hardware-Accelerated CSS**: Animations use smooth CSS transitions for high frame rates.
- **Configurable Timing**: Control animation duration, easing, delay, and offset.
- **Zero Dependencies**: Standalone script that pairs effortlessly with any static HTML page.

---

## How It Works with Static Websites

Add AOS to your static HTML:

```html
<!-- AOS CSS in head -->
<link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />

<!-- Animate elements with data-aos attributes -->
<div data-aos="fade-up" data-aos-duration="800">
  <h2>This heading fades up on scroll</h2>
</div>

<div data-aos="flip-left" data-aos-delay="200">
  <p>This box flips in as you scroll down!</p>
</div>

<!-- AOS Script before closing body -->
<script src="https://unpkg.com/aos@next/dist/aos.js"></script>
<script>
  AOS.init({
    once: true // Animation happens only once while scrolling down
  });
</script>
```

---

## When to Use It

- Marketing landing pages and portfolios needing subtle entrance animations.
- Highlighting features, cards, and testimonials as users scroll down static pages.
