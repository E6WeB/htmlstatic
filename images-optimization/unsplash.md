# Unsplash

> High-resolution, royalty-free stock photography library for website assets.

- **Official Website**: <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer">unsplash.com</a>
- **Category**: [Images & Optimization](../README.md#images--optimization)
- **Type**: Stock Photography & Image CDN
- **Pricing / License**: Free & Freemium

---

## Overview

Unsplash is one of the world's largest collections of high-resolution, freely usable imagery provided by a global community of photographers. With over 6 million curated photographs, Unsplash provides static website creators with high-quality visual assets for hero banners, blog post thumbnails, product backgrounds, and editorial layouts.

Photos are free to download and use for both commercial and non-commercial purposes under the Unsplash License, with no mandatory attribution required (though appreciated). Additionally, Unsplash provides dynamic CDN URL parameters (powered by imgix) for resizing, cropping, and formatting images on the fly.

---

## Key Highlights & Features

- **Millions of Free Photos**: Vast catalog of professional photography covering tech, nature, architecture, business, and lifestyles.
- **Unsplash License**: Free for commercial and personal static website projects without copyright royalties.
- **Dynamic Image URL API**: Resize, crop, and convert images to WebP on the fly via query parameters (`?w=800&auto=format&fit=crop`).
- **Official Developer API**: Fetch random or topic-based photos dynamically via client-side JavaScript or during static build steps.
- **Curated Collections & Topics**: Easily find coherent imagery sets tailored to specific website design themes.

---

## How It Works with Static Websites

### 1. Direct Embed with On-the-Fly Formatting

Reference Unsplash image URLs directly in static HTML with responsive sizing parameters:

```html
<!-- Responsive hero image using Unsplash CDN parameters -->
<picture>
  <source 
    type="image/webp" 
    srcset="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80">
  <img 
    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?fit=crop&w=1200&q=80" 
    alt="Developer workspace" 
    loading="lazy" 
    width="1200" 
    height="675">
</picture>
```

### 2. Client-Side Dynamic Image Fetch

Fetch random thematic images using the Unsplash API in vanilla JavaScript:

```javascript
async function loadHeroBackground() {
  const accessKey = 'YOUR_UNSPLASH_ACCESS_KEY';
  const response = await fetch(`https://api.unsplash.com/photos/random?query=minimal-desk&client_id=${accessKey}`);
  const data = await response.json();
  
  const heroElement = document.querySelector('.hero');
  heroElement.style.backgroundImage = `url(${data.urls.regular})`;
}

loadHeroBackground();
```

---

## When to Use It

- Sourcing high-quality photography for static landing pages, portfolios, and blog post covers.
- Prototyping mockups and UI designs with realistic placeholder imagery.
- Serving responsive, auto-compressed WebP visuals on static websites via URL query parameters.
