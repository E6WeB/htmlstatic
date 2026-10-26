# Plyr

> Simple, lightweight, accessible HTML5 media player for video, audio, and YouTube.

- **Official Website**: <a href="https://plyr.io/" target="_blank" rel="noopener noreferrer">plyr.io</a>
- **Category**: [Media & Video Players](../README.md#media--video-players)
- **Type**: HTML5 Media Player

---

## Overview

Plyr is a simple, lightweight, accessible, and customizable media player for modern web browsers. It wraps HTML5 video, audio, YouTube, and Vimeo embeds in a clean, consistent interface that matches your site's design.

It features full keyboard navigation, picture-in-picture, fullscreen support, captions, speed controls, and zero advertising or tracking scripts.

---

## Key Highlights & Features

- **Unified Interface**: One consistent, beautiful player UI for HTML5 video, audio, and YouTube/Vimeo.
- **Accessibility First**: Full keyboard navigation, screen reader support, and ARIA labels.
- **Lightweight & Fast**: No jQuery dependencies; pure modern JavaScript and CSS.
- **Responsive & Mobile-Ready**: Adapts gracefully to all screen resolutions and touch devices.

---

## How It Works with Static Websites

Use Plyr on a static HTML page:

```html
<!-- Plyr CSS & JS -->
<link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
<script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>

<!-- HTML5 Video element -->
<video id="player" playsinline controls data-poster="/assets/poster.jpg">
  <source src="/assets/video.mp4" type="video/mp4" />
</video>

<script>
  const player = new Plyr('#player', {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'fullscreen']
  });
</script>
```

---

## When to Use It

- Hosting product demo videos, course content, or portfolio videos on static sites.
- Wrapping YouTube/Vimeo embeds to remove distracting branding and player clutter.
- Podcasts and music portfolios requiring a clean, custom HTML5 audio player.
