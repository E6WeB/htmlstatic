# EffectCraft

> Open-source motion graphics and visual effects compositor with 250+ effects and Lottie export in pure Rust.

1. **Official Website**: <a href="https://getartcraft.com/apps/effectcraft" target="_blank" rel="noopener noreferrer">getartcraft.com/apps/effectcraft</a>
2. **Category**: [Development Tools](../../README.md#development-tools)
3. **Type**: Open Source Motion Graphics & VFX Compositor
4. **Pricing / License**: Open Source / Freemium

- **Tags**: `motion-graphics`, `rust`, `after-effects-alternative`, `lottie`, `vfx`, `animation`, `video`, `beta`, `effectcraft`, `open-source-after-effects`
---

## Overview

> [!NOTE]
> **Beta Release** — EffectCraft is currently in active beta development as part of the open-source ArtCraft suite. Official standalone builds and launcher packages are available on GitHub Releases.

**EffectCraft** is a native, open-source motion graphics and visual effects compositor written from scratch in pure Rust. Designed as an independent alternative to Adobe After Effects, EffectCraft combines multi-track timelines, keyframe interpolation, 3D space, and a library of over 250 effects in a fast native compositor with zero subscription barriers or telemetry tracking.

EffectCraft is especially powerful for web developers and static site creators because it natively exports animated Lottie JSON files, clean WebM/MP4 videos, transparent ProRes clips, and lightweight animated GIFs. You can create hero animations, interactive button micro-interactions, or feature explainer animations in a native GUI and drop them straight into your static HTML pages.

---

## Key Highlights & Features

1. **Native Rust Compositor**: Fast, GPU-accelerated rendering pipeline with zero web-engine or Electron overhead.
2. **Intuitive Animation Timeline**: Linear, bezier, hold, and eased keyframes, roving keys, and a dedicated graph editor for fine-tuning speed and value curves.
3. **Multi-Track Layer Types**: Supports solid layers, vector shapes, kinetic typography animators, video footage, nested compositions, null objects, and adjustment layers.
4. **259 Built-in Effects**: Complete suite of blurs, color grading, particle simulations, geometric distortion, keying, and procedural generators.
5. **True 3D Workspace**: 3D layers with ray-traced virtual cameras, depth of field, point and spot lights, soft cast shadows, and orbit navigation.
6. **JavaScript Expression Support**: Powerful expressions (including `wiggle`, loops, and layer references) editable inline and directly linked to any property.
7. **Web-Ready Export Formats**: Direct export to Lottie JSON for static websites, H.264 MP4, ProRes 4444 with alpha transparency, PNG/EXR image sequences, and optimized GIFs.

---

## How It Works with Static Websites

### 1. Exporting Lottie Animations for Web Pages

Animate icons, loading states, or landing page graphics and export directly to Lottie JSON:

```html
<!-- Include lightweight Lottie web player -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>

<div id="hero-animation" style="width: 320px; height: 320px;"></div>

<script>
  lottie.loadAnimation({
    container: document.getElementById('hero-animation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '/assets/animations/hero-animation.json' // Exported from EffectCraft
  });
</script>
```

### 2. High-Performance Web Video Backgrounds

Export hero background loops in H.264 or WebM format with minimal file sizes for fast static site loads:

```html
<video autoplay loop muted playsinline poster="/assets/hero-poster.webp" style="width: 100%; border-radius: 12px;">
  <source src="/assets/hero-loop.mp4" type="video/mp4">
</video>
```

---

## When to Use It

1. Motion designers and web creators building animated vector assets, hero animations, and Lottie graphics for static websites.
2. Video editors and developers looking for a lightweight, open-source After Effects replacement written in Rust.
3. Projects needing programmatic rendering and automated video/Lottie compilation via command line.

---

## Pricing & Limits

- **Open Source / Free Tier**: $0 — free desktop app and open-source code when bringing your own compute or third-party model keys
- **ArtCraft Cloud AI Credits**: Basic (~$8–$10/mo, ~1,000 credits), Pro (~$28–$35/mo, ~3,750 credits), Max (~$48–$60/mo, ~6,600 credits)
