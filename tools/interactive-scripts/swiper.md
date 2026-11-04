# Swiper.js

> Modern mobile touch slider with hardware accelerated transitions and zero framework dependencies.

1. **Official Website**: <a href="https://swiperjs.com/" target="_blank" rel="noopener noreferrer">swiperjs.com</a>
2. **Category**: [Interactive Scripts & Animation](../../README.md#interactive-scripts--animation)
3. **Type**: Touch Slider & Carousel Library
4. **Pricing / License**: Open Source

- **Tags**: `swiper-js`, `mobile-touch-carousel`, `hardware-accelerated-slider`, `3d-coverflow-slider`, `vanilla-js-carousel`, `vanilla-js`, `scroll-animations`, `touch-slider`, `lightbox-gallery`, `zero-dependencies`
---

## Overview

Swiper is the industry-standard mobile touch slider and carousel library. It utilizes hardware-accelerated CSS transitions for fluid 60fps animations and provides full touch/swipe gestures on mobile devices.

It does not depend on jQuery or any external framework, making it ideal for static HTML websites needing image carousels, testimonial sliders, or card carousels.

---

## Key Highlights & Features

1. **Hardware Accelerated**: Smooth 60fps animations powered by pure CSS transitions.
2. **Full Touch Support**: Responsive touch and swipe gesture recognition.
3. **Rich Effects**: Slide, Fade, Cube, Coverflow, Flip, and Creative effects.
4. **Zero Dependencies**: Works natively with pure vanilla JavaScript and CSS.

---

## How It Works with Static Websites

Include Swiper via CDN in your static HTML:

```html
<!-- Link Swiper's CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

<!-- Swiper HTML layout -->
<div class="swiper mySwiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>
  <!-- Navigation buttons -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script>
  const swiper = new Swiper(".mySwiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true
  });
</script>
```

---

## When to Use It

1. Image galleries, testimonial sliders, and product showcases on static sites.
2. Touch-friendly mobile carousels with smooth hardware-accelerated transitions.
