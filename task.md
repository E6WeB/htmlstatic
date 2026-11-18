# StaticStack — Astro Migration & UI/Build Updates

Summary of all changes made in `F:\html-static`.

## 1. Astro Static Site Migration
- Installed `astro` and configured [astro.config.mjs](astro.config.mjs) (`output: 'static'`, `outDir: './dist'`, `build: { format: 'file' }`).
- Added the `staticstackAssets` Astro integration in [astro.config.mjs](astro.config.mjs) to copy `/asset/*`, `tools/**/*.webp`, `blog/**/*.webp`, `archive/og-archive.webp`, `submit/og-submit.webp`, root verification/manifest files, and sync `community/index.html` + `community/topic.html` into `dist/`.
- Created shared build modules:
  - [src/lib/site-context.js](src/lib/site-context.js) — cached catalog, `marked`, view/like caches, discovery badges, and blog posts.
  - [src/lib/pages-content.js](src/lib/pages-content.js) — page renderers extracted from [generate-pages.js](generate-pages.js).
  - [src/lib/feeds.js](src/lib/feeds.js) — `sitemap.xml`, `tools.xml`, `feed.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, and `search-data.json` generators.
- Added Astro routes and static endpoints under `src/pages/`:
  - Pages: `index.astro`, `404.astro`, `archive/index.astro`, `search/index.astro`, `submit/index.astro`, `contribute/index.astro`, `thankyou/index.astro`, `contact/index.astro`, `stack/index.astro`, `blog/index.astro`, `blog/[slug]/index.astro`, `category/[slug]/index.astro`, `tools/[category]/[tool].astro`.
  - Endpoints: `sitemap.xml.js`, `tools.xml.js`, `feed.xml.js`, `robots.txt.js`, `llms.txt.js`, `llms-full.txt.js`, `badge/[slug].svg.js`, `asset/css/style.css.js`, `asset/json/tools-data.json.js`, `asset/json/search-data.json.js`.
- Updated [serve.js](serve.js) to serve static files from `dist/` (keeping `/api/*`, `/community/*`, and `/stats/*` PostgreSQL handlers intact) and fall back cleanly to `<path>.html` when an asset directory shares the same name.
- Updated [package.json](package.json) (`build`: `astro build`, `dev`: `astro dev`, `preview`: `astro preview`), [.github/workflows/deploy.yml](.github/workflows/deploy.yml) (`path: 'dist'`), [.gitignore](.gitignore) (ignored `dist/` and `.astro/`), and [scripts/seo_audit.js](scripts/seo_audit.js) (audit `dist/`).

## 2. Search Bar & Page Header Consistency
- Created [src/templates/components/search-bar.js](src/templates/components/search-bar.js) (`renderSearchBar`) using the Archive-style `search-box-pill search-box-pill-compact` component.
- Replaced the `/search` page search card with `renderSearchBar`, centered in the main search section, and standardized Home, Archive, 404, and Category pages ([src/templates/category-page.js](src/templates/category-page.js)) to use it.
- Moved the search bar and filter controls out of `.mini-hero-inner` on `/archive` into `archiveContent` ([src/lib/pages-content.js](src/lib/pages-content.js)).
- Standardized `.mini-hero` across all non-home pages (including `/search` and `/stack/` in [src/templates/stack-page.js](src/templates/stack-page.js)) and aligned [community/assets/style.css](community/assets/style.css) with [src/styles/base-css.js](src/styles/base-css.js).
- Updated `.mini-hero-icon-box` in [src/styles/base-css.js](src/styles/base-css.js) and [community/assets/style.css](community/assets/style.css) to use `var(--accent-gradient)` with `#ffffff` icon color.
- Added `scrollbar-gutter: stable;` to `html` and refined `.mini-hero-header-main` in [src/styles/base-css.js](src/styles/base-css.js) to prevent horizontal layout shift between short and tall pages.

## 3. Sidebars & Widgets
- Unified sidebar column width to `440px` across Archive, Blog (`.blog-layout`), Tools, Community, and Topic pages in [src/styles/base-css.js](src/styles/base-css.js).
- Created [src/templates/components/sidebar-shared.js](src/templates/components/sidebar-shared.js) with `renderBlogPostsSidebarWidget`, `renderKnowGreatToolWidget`, `renderFacebookCommunityWidget`, and `renderPostSidebar`.
- Redesigned `.blog-toc-list` in [src/styles/base-css.js](src/styles/base-css.js) into a bordered card-rail style with left accent bar and hover slide.
- Renamed `In This Article` to **Blog Post** and standardized sidebar widget order across:
  - Blog posts ([src/templates/blog-page.js](src/templates/blog-page.js)), My Static Stack ([src/templates/stack-page.js](src/templates/stack-page.js)), Contact, and Thank You ([src/lib/pages-content.js](src/lib/pages-content.js))
  - Tool pages ([src/templates/tool-page.js](src/templates/tool-page.js))
  - Community & Topic pages ([community/index.html](community/index.html), [community/topic.html](community/topic.html))

## 4. Home Page, Catalog & Bookmarks
- Updated **Top Categories** (`#categories`) on the home page ([src/lib/pages-content.js](src/lib/pages-content.js)) to show the top 8 categories by tool count, and added a **Build & Save Your Static Stack** section (`#my-static-stack`) below it.
- Removed **Lemon Squeezy** from [README.md](README.md), deleted `tools/payments-ecommerce/lemon-squeezy.*`, removed it from [src/data/icons.js](src/data/icons.js), and updated references in [src/data/blog-posts.js](src/data/blog-posts.js) and blog articles to **Paddle**.
- Added **Download Bookmarks** (`#stack-export-bookmarks-btn`) to [asset/js/stack.js](asset/js/stack.js) to export a browser-importable `staticstack-bookmarks.html` file with a `StaticStack Bookmarks` folder.

## 5. Cleanup & Build Optimization
- Removed old root-level generated HTML, XML, TXT, CSS, JSON, and SVG badge files from the repository root while preserving all source `.md`, `.webp`, `community/`, `src/`, and `scripts/` files (reducing repo source size to **8.73 MB across 647 files**).
- Installed `clean-css` and `terser` (`devDependencies`) and added post-build HTML, CSS, and JS minification in [astro.config.mjs](astro.config.mjs) (saving **1,258.4 KB** in `dist/`, bringing `dist/` to **23.50 MB across 790 files**).
- Verified `npm run build` (237 pages/endpoints) and `node scripts/seo_audit.js` (240 HTML files audited, **0 errors**).

