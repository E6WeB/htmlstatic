# Mapbox GL JS

> Interactive WebGL vector maps with customizable visual styles and 3D terrain.

1. **Official Website**: <a href="https://www.mapbox.com/mapbox-gl-js" target="_blank" rel="noopener noreferrer">mapbox.com/mapbox-gl-js</a>
2. **Category**: [Interactive Maps & Geolocation](../../README.md#interactive-maps--geolocation)
3. **Type**: Vector WebGL Mapping Engine
4. **Pricing / License**: Freemium

- **Tags**: `mapbox-gl-js`, `webgl-vector-maps`, `3d-terrain-maps`, `custom-map-studio`, `smooth-interactive-maps`, `interactive-maps`, `webgl-maps`, `google-maps-alternative`, `geojson`, `store-locator`
---

## Overview

Mapbox GL JS is a JavaScript library that uses WebGL to render interactive, customizable maps from vector tiles and Mapbox styles. It delivers smooth, 60fps vector map transitions, 3D building extrusions, and pitch/rotation controls.

With a generous free tier of up to 50,000 monthly map loads, it is an exceptional choice for modern static websites seeking high-end cartography.

---

## Key Highlights & Features

1. **WebGL Acceleration**: 60fps rendering, smooth zooming, tilting, and rotating.
2. **Custom Map Styling**: Design custom color palettes, dark modes, and brand-matching maps with Mapbox Studio.
3. **3D Terrains & Buildings**: Render 3D topography and architectural models directly in the browser.
4. **Generous Free Tier**: Up to 50,000 map loads per month at no charge.

---

## How It Works with Static Websites

Embed a Mapbox GL vector map in static HTML:

```html
<link href="https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.js"></script>

<div id="map" style="width: 100%; height: 450px;"></div>

<script>
  mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11', // Dark mode vector style
    center: [-74.006, 40.7128], // New York City
    zoom: 12
  });

  new mapboxgl.Marker({ color: '#6e44ff' })
    .setLngLat([-74.006, 40.7128])
    .addTo(map);
</script>
```

---

## When to Use It

1. Modern dark-mode landing pages requiring custom-branded vector maps.
2. Real estate, travel, or data visualization static websites.
3. Applications needing smooth rotation, tilting, or 3D terrain.
