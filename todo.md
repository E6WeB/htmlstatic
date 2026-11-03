# StaticStack Project Review & TODO

## Project Overview & Strengths

**StaticStack (`staticstack.app`)** is a fast, SEO-friendly static website toolkit directory and community hub built with minimal dependencies.

### Key Strengths
- **Zero-Bloat Architecture & Performance**
  - **Pre-rendered Static Core**: `generate-pages.js` compiles everything ahead of time from a single source of truth (`asset/json/tools-data.json`) into standalone HTML pages (`index.html`, `archive`, dedicated `/tools/<category>/<tool>` pages), plus `sitemap.xml`, `tools.xml`, `search-data.json`, and `README.md`.
  - **Pure Native Typography & Assets**: Avoids external Google Fonts requests and uses `.webp` covers + inline SVGs for instant page loads and minimal layout shift.
  - **Smart Custom Edge Server**: `serve.js` uses Node's built-in `http` and `zlib` modules to handle Brotli/Gzip streaming compression, immutable caching headers for images, clean extensionless URLs, and path-traversal/dotfile blocking (`isBlockedPath`) without needing Express or a heavy framework.
- **Hybrid Static + Lightweight Dynamic Layer**
  - Pairs a 100% static catalog with `community/forum.js` (PostgreSQL on Wasmer Edge via `app.yaml`) for dynamic view counters (`/api/view`, `/api/top-tools`) and a community forum with in-memory + JSON file fallback caching (`tool-views-cache.json`).
- **Automated Visual & SEO Polish**
  - `build_og_images.py` and `capture_tool_covers.py` automate headless Chrome screenshots and WebP conversion for OpenGraph cards and tool previews.

---

## Actionable TODOs (Opportunities for Improvement)

### 1. Modularize `generate-pages.js` (~5,000 lines) ✅
- [x] Split HTML templates into `src/templates/` (`src/templates/layout.js`, `src/templates/tool-page.js`)
- [x] Extract inline CSS into `src/styles/` (`src/styles/base-css.js`)
- [x] Extract SVG icons and tool enrichment/metadata into `src/data/` (`src/data/icons.js`, `src/data/parse-readme.js`)
- [x] Keep `generate-pages.js` focused on orchestrating the build pipeline
- [x] Download and store all 124 tool siteicons locally (`tools/<category>/<slug>-icon.webp`) via `download_tool_icons.py`

### 2. Cross-Platform Chrome Path Detection in Python Scripts ✅
- [x] Update `build_og_images.py` and `capture_tool_covers.py` with `detect_chrome_path()`:
  ```python
  CHROME_PATH = detect_chrome_path()
  ```
- [x] Add cross-platform detection (`sys.platform` / `shutil.which`) to automatically resolve:
  - **macOS**: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
  - **Windows**: `C:\Program Files\Google\Chrome\Application\chrome.exe`
  - **Linux**: `google-chrome` / `chromium`

### 3. Pre-compress Static Assets or Cache Compressed Buffers in `serve.js` ✅
- [x] Avoid running Brotli/Gzip compression on the fly for every request in `serveFile` (`serve.js`).
- [x] Added in-memory caching (`staticBufferCache` and `resolvedPathCache` in `serve.js`) of raw, `.gz`, and `.br` buffers for text assets (<= 512 KB) and tool icons (<= 32 KB), eliminating repeated disk I/O and WASIX CPU spikes.

