# PhotoSwipe

> Lightweight, responsive JavaScript image gallery and lightbox with smooth gestures and zoom.

- **Official Website**: <a href="https://photoswipe.com/" target="_blank" rel="noopener noreferrer">photoswipe.com</a>
- **Category**: [Interactive Scripts & Animation](../README.md#interactive-scripts--animation)
- **Type**: Image Lightbox & Gallery Library

---

## Overview

PhotoSwipe is an open-source JavaScript image lightbox library designed for mobile and desktop. It allows visitors to click any image on a static page to open an immersive, fullscreen lightbox with zoom, pinch, and swipe navigation.

PhotoSwipe is modular, fast, and does not require jQuery, ensuring minimal page weight and high performance for static photography and portfolio sites.

---

## Key Highlights & Features

- **Pinch to Zoom & Swipe**: Native-feeling mobile gestures and zoom controls.
- **Zero Dependencies**: Pure vanilla JavaScript with no bulky libraries.
- **Responsive Layouts**: Adapts seamlessly to all screen sizes and orientations.
- **Accessible**: Keyboard navigation (arrow keys, Escape) and ARIA attributes.

---

## How It Works with Static Websites

Include PhotoSwipe via modern ES modules in static HTML:

```html
<link rel="stylesheet" href="https://unpkg.com/photoswipe@5/dist/photoswipe.css">

<!-- Gallery items -->
<div id="gallery">
  <a href="large-image.jpg"
     data-pswp-width="1600"
     data-pswp-height="1067"
     target="_blank">
    <img src="thumb.jpg" alt="Thumbnail" />
  </a>
</div>

<script type="module">
  import PhotoSwipeLightbox from "https://unpkg.com/photoswipe@5/dist/photoswipe-lightbox.esm.js";
  const lightbox = new PhotoSwipeLightbox({
    gallery: "#gallery",
    children: "a",
    pswpModule: () => import("https://unpkg.com/photoswipe@5/dist/photoswipe.esm.js")
  });
  lightbox.init();
</script>
```

---

## When to Use It

- Photography portfolios, art showcases, and product image zoom galleries.
- Static blogs and travel sites wanting rich lightbox image viewing.
