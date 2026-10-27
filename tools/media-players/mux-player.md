# Mux Player

> Responsive, high-performance web video player with automatic HLS streaming.

- **Official Website**: <a href="https://mux.com/player" target="_blank" rel="noopener noreferrer">mux.com/player</a>
- **Category**: [Media & Video Players](../../README.md#media--video-players)
- **Type**: Modern Video Streaming Component

---

## Overview

Mux Player is an open-source, responsive web component designed for playing video with optimal performance. It handles adaptive bitrate HLS video streaming, automated poster generation, and timeline previews out of the box.

Because it is built as a standard Web Component, it drops directly into static HTML pages with zero framework overhead.

---

## Key Highlights & Features

- **Standard Web Component**: Usable in pure static HTML via `<mux-player>` tags.
- **Adaptive Bitrate Streaming**: Automatically adjusts playback quality to the viewer's network speed.
- **Built-In Performance Metrics**: Monitors playback health and buffering in real time.
- **Privacy Respecting**: Zero third-party ad networks, trackers, or cookie banners.

---

## How It Works with Static Websites

Embed Mux Player in static HTML:

```html
<!-- Load Mux Player web component -->
<script src="https://cdn.jsdelivr.net/npm/@mux/mux-player"></script>

<!-- Use mux-player custom element -->
<mux-player
  playback-id="YOUR_MUX_PLAYBACK_ID"
  metadata-video-title="Product Overview Video"
  stream-type="on-demand"
  accent-color="#6e44ff">
</mux-player>
```

---

## When to Use It

- High-quality video streaming on static sites without YouTube ads or suggested videos.
- Video-first landing pages that need instant playback and adaptive streaming on mobile.
