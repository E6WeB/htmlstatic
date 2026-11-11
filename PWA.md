# StaticStack Progressive Web App (PWA) Implementation Guide

This document outlines the architecture, caching strategies, offline UX, and step-by-step implementation plan for turning **StaticStack** into a production-grade Progressive Web App (PWA).

---

## 1. Executive Summary & Why PWA for StaticStack

StaticStack is an ideal candidate for a Progressive Web App:
- **100% Static HTML/CSS/JS**: All pages, stylesheets, scripts, and search data are static assets, making them lightweight and trivial to cache.
- **Offline Directory Access**: Developers can look up tools, categories, and offline-cached blog articles on trains, flights, or spotty cellular connections.
- **Offline Search**: Since `/search-data.json` is ~120 KB, the entire search index can be precached or cached on first load, enabling instant, zero-latency client-side search even when completely offline.
- **Native App Feel**: Can be installed to desktop (Chrome/Edge/macOS) and mobile (iOS Safari, Android Chrome) home screens with a clean standalone window (no browser address bar).

---

## 2. Current PWA Status

| Component | Status | Location / Details |
| :--- | :---: | :--- |
| **Web App Manifest** | ✅ Present | [`site.webmanifest`](file:///f:/GitHub/html-static/site.webmanifest) |
| **App Icons (192x192 & 512x512)** | ✅ Present | [`asset/img/icon-192.png`](file:///f:/GitHub/html-static/asset/img/icon-192.png), [`asset/img/icon-512.png`](file:///f:/GitHub/html-static/asset/img/icon-512.png) |
| **Apple Touch Icon (180x180)** | ✅ Present | [`apple-touch-icon.png`](file:///f:/GitHub/html-static/apple-touch-icon.png) |
| **Head Tags (`manifest`, `theme-color`)** | ✅ Present | Present across all 193 pages |
| **Service Worker (`sw.js`)** | ❌ Missing | Needs implementation |
| **Registration Script (`pwa.js`)** | ❌ Missing | Needs implementation |
| **Offline Fallback Page (`offline.html`)** | ❌ Missing | Needs implementation |
| **Install Prompt UX ("Add to Home Screen")** | ❌ Missing | Optional custom banner/button |
| **Update Notification ("New version available")** | ❌ Missing | Service worker update handling |

---

## 3. Recommended Architecture

```
                    ┌──────────────────────────────┐
                    │      Browser / User Client   │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │   Service Worker (sw.js)     │
                    │   Version: staticstack-v1    │
                    └──────┬───────────────┬───────┘
                           │               │
            ┌──────────────▼──────┐ ┌──────▼──────────────┐
            │   Cache Storage     │ │     Network Fetch   │
            │  (Precache + Runtime)│ │  (Origin / CDN)     │
            └─────────────────────┘ └─────────────────────┘
```

### Caching Strategies by Asset Type

| Asset Type | Strategy | Cache Name | Rationale |
| :--- | :--- | :--- | :--- |
| **Core Shell** (`/`, `/asset/css/style.css`, `/asset/js/main.js`, `/offline.html`) | **Cache-First (Precached)** | `staticstack-core-v1` | Ensures the core UI shell boots instantly even offline. |
| **Search Data** (`/search-data.json`) | **Stale-While-Revalidate** | `staticstack-data-v1` | Instant search offline; silently updates in background when online. |
| **HTML Pages** (`/category/*`, `/tools/*`, `/blog/*`) | **Network-First with Cache Fallback** | `staticstack-pages-v1` | Always shows freshest content when connected; falls back to cached copy or `/offline.html`. |
| **Images** (`.webp`, `.png`, `.svg`, favicons) | **Cache-First (Runtime)** | `staticstack-images-v1` | Fast loading, low bandwidth. Cap at ~150 items with LRU eviction. |
| **Dynamic API** (`/api/view`, `/api/top-tools`) | **Network-Only (or Silent Fallback)** | *None* | Live counters and forum updates require live connection. |

---

## 4. File-by-File Implementation Plan

### Step 1: Create the Offline Page (`offline.html`)
A standalone fallback page rendered when a user navigates to an uncached page while disconnected.
- Matches StaticStack design tokens (Inter typography, navbar, dark/light theme).
- Displays clear status: *"You're currently offline"*.
- Lists pages already available in cache (Home, Directory, Search, Bookmarks).
- Includes a *"Try Reconnecting"* button.

### Step 2: Implement the Service Worker (`sw.js`)
Placed in the root directory (`/sw.js`) so its scope covers the entire origin (`scope: '/'`).

```javascript
// sw.js - StaticStack Service Worker
const CACHE_VERSION = 'v1.0.0';
const CORE_CACHE = `staticstack-core-${CACHE_VERSION}`;
const RUNTIME_CACHE = `staticstack-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `staticstack-images-${CACHE_VERSION}`;

// Assets to precache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/search-data.json',
  '/asset/css/style.css',
  '/asset/js/main.js',
  '/asset/js/search.js',
  '/site.webmanifest',
  '/apple-touch-icon.png'
];

// Install Event - Precache critical shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CORE_CACHE, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => !currentCaches.includes(cacheName))
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Route requests according to strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin or non-GET requests
  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  // 1. Navigation requests (HTML pages): Network-first -> Cache -> offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // 2. Images: Cache-first -> Network -> fallback
  if (request.destination === 'image' || url.pathname.match(/\.(webp|png|jpg|svg|ico)$/i)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(IMAGE_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Static Assets & Search Data: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CORE_CACHE).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
```

### Step 3: Client Registration & Update Handler (`asset/js/pwa.js`)
Handles registration, install prompt listeners, and background update toasts:

```javascript
// Register service worker with grace period
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateToast(); // "New version available. Refresh to update."
          }
        });
      });
    }).catch((err) => {
      console.warn('PWA registration failed:', err);
    });
  });
}

// "Add to Home Screen" custom prompt handling
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Expose install button in header or left-nav rail
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.style.display = 'inline-flex';
    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
    });
  }
});
```

### Step 4: Update Manifest (`site.webmanifest`)
Enhance `site.webmanifest` with shortcuts and screenshots for rich app store-style install prompts:

```json
{
  "name": "StaticStack - Modern Tools & APIs for Static Websites",
  "short_name": "StaticStack",
  "description": "Curated directory of 144+ tools, services, and APIs for building high-performance static websites.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0b0f19",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/asset/img/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/asset/img/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Search Directory",
      "url": "/search/",
      "icons": [{ "src": "/asset/img/icon-192.png", "sizes": "192x192" }]
    },
    {
      "name": "Browse Categories",
      "url": "/archive.html",
      "icons": [{ "src": "/asset/img/icon-192.png", "sizes": "192x192" }]
    },
    {
      "name": "StaticStack Blog",
      "url": "/blog/",
      "icons": [{ "src": "/asset/img/icon-192.png", "sizes": "192x192" }]
    }
  ]
}
```

### Step 5: Edge Server Support (`serve.js`)
Ensure `serve.js` serves `sw.js` with zero-cache headers so browsers instantly pick up service worker changes:
```javascript
if (req.url === '/sw.js') {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Content-Type', 'application/javascript');
}
```

---

## 5. Testing & Verification Checklist

- [ ] **Lighthouse PWA Audit**: Run Chrome DevTools Lighthouse &rarr; Check for *"Installable"* badge and Service Worker detection.
- [ ] **Offline Simulation**: In DevTools Network tab &rarr; Set to **Offline** &rarr; Verify `/`, `/search/`, and visited tool pages load without network.
- [ ] **Search Verification**: Test `/search/` query while offline; confirm results render from cached `search-data.json`.
- [ ] **Cache Storage Inspection**: Inspect `Application > Storage > Cache Storage` &rarr; verify `staticstack-core-v1` and `staticstack-images-v1` entries.
- [ ] **Unvisited Page Offline Fallback**: Navigate to an uncached URL while offline &rarr; verify `offline.html` renders cleanly.
- [ ] **Desktop & Mobile Install**: Install on Chrome/Edge Desktop and iOS Safari ("Add to Home Screen").

---

## 6. Next Steps to Enable

When ready to roll this out:
1. Create `offline.html` with StaticStack styling.
2. Add `sw.js` to root and `asset/js/pwa.js`.
3. Include `<script src="/asset/js/pwa.js" defer></script>` in [`src/templates/layout.js`](file:///f:/GitHub/html-static/src/templates/layout.js).
4. Run `npm run build` to compile the site.
5. Test using Chrome DevTools Application tab.

