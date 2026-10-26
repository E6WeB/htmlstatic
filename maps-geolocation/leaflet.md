# Leaflet.js

> Lightweight open-source JavaScript library for mobile-friendly interactive maps.

- **Official Website**: <a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">leafletjs.com</a>
- **Category**: [Interactive Maps & Geolocation](../README.md#interactive-maps--geolocation)
- **Type**: Open Source Map Library

---

## Overview

Leaflet is the leading open-source JavaScript library for mobile-friendly interactive maps. Weighing just about 42 KB of JS, it has all the mapping features most developers ever need.

It works smoothly across all major desktop and mobile platforms, has a huge plugin ecosystem, and can be used on static HTML pages with free tile providers like OpenStreetMap without requiring API keys or billing accounts.

---

## Key Highlights & Features

- **Ultra Lightweight**: ~42 KB gzipped JavaScript footprint.
- **No Billing / Credit Card**: Use OpenStreetMap or free tile servers without billing accounts.
- **Mobile Gesture Support**: Hardware-accelerated panning, pinch-to-zoom, and inertial scrolling.
- **Rich Plugin Ecosystem**: Hundreds of community plugins for markers, clusters, and geoJSON.

---

## How It Works with Static Websites

Embed a working map in static HTML in seconds:

```html
<!-- Leaflet CSS & JS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Map container -->
<div id="map" style="height: 400px; width: 100%;"></div>

<script>
  // Initialize map centered at coordinates (e.g. London)
  const map = L.map('map').setView([51.505, -0.09], 13);

  // Add free OpenStreetMap tiles
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Add marker with popup
  L.marker([51.505, -0.09]).addTo(map)
    .bindPopup('<b>Hello world!</b><br />We are located here.')
    .openPopup();
</script>
```

---

## When to Use It

- Displaying business locations, event venues, or contact page maps on static sites.
- Mapping projects that want to avoid Google Maps API billing surprises and quotas.
- Mobile-optimized websites needing fast-loading interactive maps.
