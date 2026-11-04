# Plyr

> Simple, lightweight, accessible HTML5 media player for video, audio, and YouTube.

1. **Official Website**: <a href="https://plyr.io/" target="_blank" rel="noopener noreferrer">plyr.io</a>
2. **Category**: [Media & Video Players](../../README.md#media--video-players)
3. **Type**: HTML5 Media Player
4. **Pricing / License**: Open Source

- **Tags**: `plyr-io`, `accessible-html5-player`, `custom-youtube-vimeo-player`, `stylable-css-video-player`, `audio-video-controls`, `html5-video-player`, `hls-streaming`, `audio-waveform`, `podcast-player`, `custom-media-player`
---

## Overview

Plyr is a simple, lightweight, accessible, and customizable media player for modern web browsers. It wraps HTML5 video, audio, YouTube, and Vimeo embeds in a clean, consistent interface that matches your site's design.

It features full keyboard navigation, picture-in-picture, fullscreen support, captions, speed controls, and zero advertising or tracking scripts.

---

## Key Highlights & Features

1. **Unified Interface**: One consistent, beautiful player UI for HTML5 video, audio, and YouTube/Vimeo.
2. **Accessibility First**: Full keyboard navigation, screen reader support, and ARIA labels.
3. **Lightweight & Fast**: No jQuery dependencies; pure modern JavaScript and CSS.
4. **Responsive & Mobile-Ready**: Adapts gracefully to all screen resolutions and touch devices.

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

1. Hosting product demo videos, course content, or portfolio videos on static sites.
2. Wrapping YouTube/Vimeo embeds to remove distracting branding and player clutter.
3. Podcasts and music portfolios requiring a clean, custom HTML5 audio player.
