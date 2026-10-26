# Wavesurfer.js

> Customizable interactive audio waveform visualizer and player in vanilla JavaScript.

- **Official Website**: <a href="https://wavesurfer.xyz/" target="_blank" rel="noopener noreferrer">wavesurfer.xyz</a>
- **Category**: [Media & Video Players](../README.md#media--video-players)
- **Type**: Audio Waveform Visualizer

---

## Overview

Wavesurfer.js is an open-source audio visualization and player library built on Web Audio and Canvas. It generates an interactive, clickable waveform of audio files so users can see and scrub through audio tracks visually.

It is lightweight, highly customizable with CSS and plugins, and requires zero external frameworks.

---

## Key Highlights & Features

- **Interactive Waveforms**: Click and drag across waveforms to scrub audio playback.
- **Web Audio API**: Fast, responsive waveform rendering powered by native browser APIs.
- **Zero Dependencies**: Written in pure vanilla TypeScript/JavaScript.
- **Plugin System**: Add timeline markers, regions, audio spectrograms, and record audio.

---

## How It Works with Static Websites

Add an interactive audio waveform to static HTML:

```html
<div id="waveform"></div>
<button id="playBtn">Play / Pause</button>

<script type="module">
  import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';

  const ws = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#d0c4ff',
    progressColor: '#6e44ff',
    url: '/assets/sample-podcast.mp3',
  });

  document.getElementById('playBtn').addEventListener('click', () => {
    ws.playPause();
  });
</script>
```

---

## When to Use It

- Podcast episode players, voice memo portfolios, and music production static sites.
- Adding an engaging, interactive audio player experience to blog posts.

---

[← Back to Media & Video Players](../README.md#media--video-players) | [← Back to Static Website Toolkit](../README.md)
