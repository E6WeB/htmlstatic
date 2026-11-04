# Mux Player

> Responsive, high-performance web video player with automatic HLS streaming.

1. **Official Website**: <a href="https://mux.com/player" target="_blank" rel="noopener noreferrer">mux.com/player</a>
2. **Category**: [Media & Video Players](../../README.md#media--video-players)
3. **Type**: Modern Video Streaming Component
4. **Pricing / License**: Open Source

- **Tags**: `mux-player`, `hls-video-web-component`, `adaptive-bitrate-streaming`, `timeline-hover-previews`, `video-api`, `html5-video-player`, `hls-streaming`, `audio-waveform`, `podcast-player`, `custom-media-player`
---

## Overview

Mux Player is an open-source, responsive web component designed for playing video with optimal performance. It handles adaptive bitrate HLS video streaming, automated poster generation, and timeline previews out of the box.

Because it is built as a standard Web Component, it drops directly into static HTML pages with zero framework overhead.

---

## Key Highlights & Features

1. **Standard Web Component**: Usable in pure static HTML via `<mux-player>` tags.
2. **Adaptive Bitrate Streaming**: Automatically adjusts playback quality to the viewer's network speed.
3. **Built-In Performance Metrics**: Monitors playback health and buffering in real time.
4. **Privacy Respecting**: Zero third-party ad networks, trackers, or cookie banners.

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

1. High-quality video streaming on static sites without YouTube ads or suggested videos.
2. Video-first landing pages that need instant playback and adaptive streaming on mobile.
