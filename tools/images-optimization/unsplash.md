# Unsplash

> High-resolution, royalty-free stock photography library for website assets.

1. **Official Website**: <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer">unsplash.com</a>
2. **Category**: [Images & Optimization](../../README.md#images--optimization)
3. **Type**: Stock Photography & Image CDN
4. **Pricing / License**: Freemium

- **Tags**: `unsplash`, `royalty-free-photos`, `hd-stock-images`, `commercial-free-photography`, `hero-background-images`, `webp-converter`, `svg-vectorizer`, `image-compression`, `core-web-vitals`, `fast-page-load`
---

## Overview

Unsplash is one of the world's largest collections of high-resolution, freely usable imagery provided by a global community of photographers. With over 6 million curated photographs, Unsplash provides static website creators with high-quality visual assets for hero banners, blog post thumbnails, product backgrounds, and editorial layouts.

Photos are free to download and use for both commercial and non-commercial purposes under the Unsplash License, with no mandatory attribution required (though appreciated). Additionally, Unsplash provides dynamic CDN URL parameters (powered by imgix) for resizing, cropping, and formatting images on the fly.

---

## Key Highlights & Features

1. **Millions of Free Photos**: Vast catalog of professional photography covering tech, nature, architecture, business, and lifestyles.
2. **Unsplash License**: Free for commercial and personal static website projects without copyright royalties.
3. **Dynamic Image URL API**: Resize, crop, and convert images to WebP on the fly via query parameters (`?w=800&auto=format&fit=crop`).
4. **Official Developer API**: Fetch random or topic-based photos dynamically via client-side JavaScript or during static build steps.
5. **Curated Collections & Topics**: Easily find coherent imagery sets tailored to specific website design themes.

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

1. Sourcing high-quality photography for static landing pages, portfolios, and blog post covers.
2. Prototyping mockups and UI designs with realistic placeholder imagery.
3. Serving responsive, auto-compressed WebP visuals on static websites via URL query parameters.
