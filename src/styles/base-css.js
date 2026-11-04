// ==========================================================================
// Base CSS using Native System Font Stack (NO Google Fonts)
// ==========================================================================
const BASE_CSS = `
  :root {
    /* Native System Font Stacks */
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

    /* Light Theme Palette (DEFAULT) */
    --bg-body: #f8fafc;
    --bg-surface: #ffffff;
    --bg-surface-elevated: #ffffff;
    --bg-muted: #f1f5f9;
    --bg-glass: rgba(255, 255, 255, 0.88);
    --border-color: #e2e8f0;
    --border-hover: #cbd5e1;
    --border-focus: #2563eb;
    --text-main: #0f172a;
    --text-muted: #475569;
    --text-subtle: #64748b;

    --accent: #2563eb;
    --accent-hover: #1d4ed8;
    --accent-light: #eff6ff;
    --accent-border: #bfdbfe;
    --accent-gradient: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);

    /* Badges */
    --badge-open-source-bg: #dcfce7;
    --badge-open-source-text: #166534;
    --badge-free-bg: #dcfce7;
    --badge-free-text: #15803d;
    --badge-freemium-bg: #dbeafe;
    --badge-freemium-text: #1e40af;
    --badge-paid-bg: #fef3c7;
    --badge-paid-text: #92400e;
    --badge-beta-bg: #fef3c7;
    --badge-beta-text: #b45309;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
    --shadow-card: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
    --shadow-card-hover: 0 12px 24px -6px rgba(15, 23, 42, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.06);

    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-full: 9999px;
    --container-max: 1440px;
  }

  [data-theme="dark"] {
    --bg-body: #090d16;
    --bg-surface: #111827;
    --bg-surface-elevated: #1a2234;
    --bg-muted: #1e293b;
    --bg-glass: rgba(17, 24, 39, 0.88);
    --border-color: #1f293d;
    --border-hover: #334155;
    --border-focus: #60a5fa;
    --text-main: #f9fafb;
    --text-muted: #94a3b8;
    --text-subtle: #64748b;

    --accent: #3b82f6;
    --accent-hover: #60a5fa;
    --accent-light: rgba(59, 130, 246, 0.12);
    --accent-border: rgba(59, 130, 246, 0.3);

    --badge-open-source-bg: rgba(34, 197, 94, 0.15);
    --badge-open-source-text: #4ade80;
    --badge-free-bg: rgba(34, 197, 94, 0.15);
    --badge-free-text: #4ade80;
    --badge-freemium-bg: rgba(59, 130, 246, 0.15);
    --badge-freemium-text: #93c5fd;
    --badge-paid-bg: rgba(245, 158, 11, 0.15);
    --badge-paid-text: #fcd34d;
    --badge-beta-bg: rgba(245, 158, 11, 0.15);
    --badge-beta-text: #fbbf24;

    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6);
    --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.4);
    --shadow-card-hover: 0 12px 24px -6px rgba(0, 0, 0, 0.6);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-family: var(--font-sans);
    color: var(--text-main);
    background-color: var(--bg-body);
    line-height: 1.6;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    overflow-x: hidden;
    max-width: 100%;
  }

  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-body);
    color: var(--text-main);
    transition: background-color 0.25s ease, color 0.25s ease;
    overflow-x: hidden;
    max-width: 100%;
    width: 100%;
    position: relative;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .site-main {
    flex: 1;
    width: 100%;
    max-width: var(--container-max);
    min-width: 0;
    box-sizing: border-box;
  }

  a {
    color: var(--accent);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  a:hover {
    color: var(--accent-hover);
  }

  .container {
    width: 100%;
    max-width: var(--container-max);
    margin-left: auto;
    margin-right: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    box-sizing: border-box;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    font-size: 0.925rem;
    font-weight: 600;
    padding: 0.6rem 1.15rem;
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: pointer;
    text-decoration: none;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .btn svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .btn-primary {
    background: var(--accent-gradient);
    color: #ffffff !important;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.25);
  }

  .btn-primary:hover {
    opacity: 0.95;
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.35);
  }

  .btn-secondary {
    background-color: var(--bg-surface);
    color: var(--text-main) !important;
    border-color: var(--border-color);
  }

  .btn-secondary:hover {
    background-color: var(--bg-muted);
    border-color: var(--border-hover);
  }

  #hero-popular-tags a {
    color: var(--text-muted);
    font-weight: 500;
    text-decoration: none;
    transform: none !important;
    transition: color 0.15s ease;
  }

  #hero-popular-tags a:hover {
    color: var(--accent);
    transform: none !important;
  }

  .btn-sm {
    padding: 0.35rem 0.75rem;
    font-size: 0.825rem;
  }

  /* Header */
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--bg-glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border-color);
    transition: all 0.25s ease;
    padding-top: env(safe-area-inset-top, 0px);
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4.25rem;
    gap: 1.5rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text-main);
    text-decoration: none;
    letter-spacing: -0.02em;
  }

  .brand-icon {
    width: 2.25rem;
    height: 2.25rem;
    background: var(--accent-gradient);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  }

  .brand-badge {
    font-size: 0.75rem;
    background: #FAF9ED;
    color: #2367EA;
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-full);
    font-weight: 700;
    margin-left: 0.25rem;
    border: 1px solid #EAE6B8;
    display: inline-flex;
    align-items: center;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    list-style: none;
    gap: 0.5rem;
  }

  .nav-link {
    color: var(--text-muted);
    font-size: 0.925rem;
    font-weight: 500;
    padding: 0.45rem 0.8rem;
    border-radius: var(--radius-sm);
    transition: all 0.15s ease;
  }

  .nav-link:hover {
    color: var(--accent);
    background-color: var(--accent-light);
  }

  .nav-link.active {
    color: var(--accent);
    background-color: var(--accent-light);
    font-weight: 700;
  }

  /* Hamburger Menu Button (Mobile) */
  .hamburger-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-md);
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    flex-shrink: 0;
  }

  .hamburger-btn:hover,
  .hamburger-btn:focus-visible {
    background: var(--accent-light);
    border-color: var(--accent);
    color: var(--accent);
    outline: none;
  }

  /* Full-Screen Mobile Navigation Overlay */
  .mobile-nav-modal {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background: var(--bg-surface);
    z-index: 99999;
    display: flex;
    flex-direction: column;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(-8px) scale(0.99);
    transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s;
    overflow: hidden;
    box-sizing: border-box;
  }

  .mobile-nav-modal.is-open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0) scale(1);
  }

  body.mobile-nav-open {
    overflow: hidden !important;
    touch-action: none !important;
  }

  .mobile-nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: calc(env(safe-area-inset-top, 0px) + 0.85rem) 1.25rem 0.85rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-surface);
    flex-shrink: 0;
  }

  .mobile-nav-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-full);
    background: var(--bg-muted);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    flex-shrink: 0;
  }

  .mobile-nav-close:hover,
  .mobile-nav-close:focus-visible {
    background: var(--accent-light);
    border-color: var(--accent);
    color: var(--accent);
    outline: none;
    transform: rotate(90deg);
  }

  .mobile-nav-body {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 1.25rem 1.25rem calc(env(safe-area-inset-bottom, 0px) + 1.5rem);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .mobile-nav-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    margin: 0;
    padding: 0;
  }

  .mobile-nav-item a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.95rem 1.15rem;
    border-radius: var(--radius-md);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-main);
    background: var(--bg-muted);
    border: 1px solid var(--border-color);
    transition: all 0.18s ease;
    text-decoration: none;
  }

  .mobile-nav-item a:hover,
  .mobile-nav-item a:focus-visible {
    background: var(--accent-light);
    border-color: var(--accent);
    color: var(--accent);
    transform: translateX(4px);
    outline: none;
  }

  .mobile-nav-item a.active {
    background: var(--accent-light);
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 2px 10px rgba(37, 99, 235, 0.12);
  }

  .mobile-nav-link-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .mobile-nav-link-icon {
    width: 2.25rem;
    height: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-surface);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
    color: var(--accent);
    flex-shrink: 0;
  }

  .mobile-nav-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-full);
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    color: var(--text-subtle);
  }

  .mobile-nav-item a.active .mobile-nav-badge {
    background: var(--accent);
    color: #ffffff;
    border-color: var(--accent);
  }

  /* Floating Back to Top Button */
  .back-to-top-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 99;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.65rem 1.05rem;
    background: var(--bg-surface);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    opacity: 0;
    pointer-events: none;
    transform: translateY(16px);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .back-to-top-btn.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .back-to-top-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 12px 28px rgba(37, 99, 235, 0.25);
    transform: translateY(-3px);
  }

  .back-to-top-btn .btt-icon {
    display: flex;
    align-items: center;
    transition: transform 0.2s ease;
  }

  .back-to-top-btn:hover .btt-icon {
    transform: translateY(-2px);
  }

  /* Mini Hero Section */
  .mini-hero {
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border-color);
    padding: 2.25rem 0 2rem;
    margin-bottom: 2.5rem;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  }

  .mini-hero-inner {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  /* Breadcrumbs inside Mini Hero */
  .mini-hero-breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.85rem;
    color: var(--text-subtle);
    flex-wrap: wrap;
    margin-bottom: 0.25rem;
  }

  .mini-hero-breadcrumbs a {
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.15s ease;
  }

  .mini-hero-breadcrumbs a:hover {
    color: var(--accent);
  }

  .mini-hero-breadcrumbs .crumb-sep {
    display: inline-flex;
    align-items: center;
    color: var(--text-subtle);
    opacity: 0.6;
  }

  .mini-hero-breadcrumbs .crumb-current {
    color: var(--text-main);
    font-weight: 600;
  }

  .mini-hero-badge-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.15rem;
  }

  .mini-hero-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .mini-hero-header-main {
    flex: 1 1 500px;
  }

  .mini-hero-title-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .mini-hero-icon-box {
    width: 2.75rem;
    height: 2.75rem;
    background: var(--bg-surface);
    color: var(--accent);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  }

  .tool-siteicon {
    display: inline-block;
    border-radius: 4px;
    vertical-align: middle;
    flex-shrink: 0;
    object-fit: contain;
  }

  .mini-hero-title {
    font-size: clamp(1.85rem, 3.5vw, 2.35rem);
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.025em;
    line-height: 1.2;
    margin: 0;
  }

  .mini-hero-subtext {
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 820px;
    margin: 0;
  }

  .mini-hero-actions {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    flex-wrap: wrap;
    align-self: flex-start;
  }

  .mini-hero-extra {
    margin-top: 0.25rem;
  }

  /* iine Appreciation / Like Button */
  .iine-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.4;
    padding: 0.6rem 1.15rem;
    border-radius: var(--radius-md);
    background-color: var(--bg-surface);
    color: var(--text-muted);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    user-select: none;
    -webkit-user-select: none;
    text-decoration: none;
  }

  .iine-button .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-subtle);
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.2s ease;
  }

  .iine-button .icon svg {
    width: 17px;
    height: 17px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
    transition: fill 0.2s ease, stroke 0.2s ease;
  }

  .iine-button .counter {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    color: var(--text-main);
    min-width: 0.6rem;
    text-align: left;
    transition: color 0.2s ease;
  }

  .iine-button .counter:empty {
    display: none;
  }

  .iine-button:hover:not([aria-disabled="true"]):not(.clicked) {
    background-color: var(--bg-muted);
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .iine-button:hover:not([aria-disabled="true"]):not(.clicked) .icon {
    color: var(--accent);
    transform: scale(1.15) rotate(-6deg);
  }

  .iine-button:hover:not([aria-disabled="true"]):not(.clicked) .counter {
    color: var(--accent);
  }

  .iine-button.clicked,
  .iine-button[aria-pressed="true"],
  .iine-button[aria-disabled="true"] {
    background-color: var(--accent-light);
    border-color: rgba(37, 99, 235, 0.35);
    color: var(--accent);
    cursor: default;
  }

  .iine-button.clicked .icon,
  .iine-button[aria-pressed="true"] .icon,
  .iine-button[aria-disabled="true"] .icon {
    color: var(--accent);
    transform: scale(1.08);
  }

  .iine-button.clicked .icon svg path,
  .iine-button[aria-pressed="true"] .icon svg path,
  .iine-button[aria-disabled="true"] .icon svg path {
    fill: var(--accent);
    stroke: var(--accent);
  }

  .iine-button.clicked .counter,
  .iine-button[aria-pressed="true"] .counter,
  .iine-button[aria-disabled="true"] .counter {
    color: var(--accent);
  }

  .iine-button:active:not(.clicked) {
    transform: scale(0.96);
  }

  .iine-button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-subtle);
    padding: 1.5rem 0 0.5rem;
    flex-wrap: wrap;
  }

  .breadcrumbs a {
    color: var(--text-muted);
  }

  .breadcrumbs a:hover {
    color: var(--accent);
  }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-full);
    white-space: nowrap;
  }

  .badge-open-source {
    background: var(--badge-open-source-bg);
    color: var(--badge-open-source-text);
  }

  .badge-free {
    background: var(--badge-free-bg);
    color: var(--badge-free-text);
  }

  .badge-freemium {
    background: var(--badge-freemium-bg);
    color: var(--badge-freemium-text);
  }

  .badge-paid {
    background: var(--badge-paid-bg);
    color: var(--badge-paid-text);
  }

  .badge-beta {
    background: var(--badge-beta-bg);
    color: var(--badge-beta-text);
    border: 1px solid rgba(217, 119, 6, 0.25);
  }

  /* Home Page Top 4 Viewed Tools Grid */
  .home-top-tool-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: var(--text-main);
    box-shadow: var(--shadow-card);
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .home-top-tool-card:hover {
    border-color: var(--accent);
    transform: translateY(-3px);
    box-shadow: 0 14px 28px -10px rgba(0, 0, 0, 0.12);
  }

  .home-top-tool-cover-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--bg-muted);
    border-bottom: 1px solid var(--border-color);
  }

  .home-top-tool-cover-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  .home-top-tool-card:hover .home-top-tool-cover-wrap img {
    transform: scale(1.03);
  }

  .home-top-tool-cat-pill {
    position: absolute;
    top: 0.65rem;
    left: 0.65rem;
    background: var(--bg-glass);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: var(--text-main);
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  }

  .home-top-tool-body {
    padding: 1.15rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 0.65rem;
  }

  .home-top-tool-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .home-top-tool-title-wrap {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    min-width: 0;
  }

  .home-top-tool-title {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-main);
  }

  .home-top-tool-desc {
    font-size: 0.825rem;
    color: var(--text-muted);
    line-height: 1.45;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1;
  }

  .home-top-tool-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
    margin-top: auto;
  }

  .home-top-tool-stats {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .home-stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.725rem;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--bg-muted);
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    font-variant-numeric: tabular-nums;
  }

  .home-stat-pill svg {
    color: var(--accent);
    flex-shrink: 0;
  }

  .home-stat-pill-likes svg {
    color: #e11d48;
  }

  .home-top-tool-arrow {
    color: var(--accent);
    display: flex;
    align-items: center;
    transition: transform 0.2s ease;
  }

  .home-top-tool-card:hover .home-top-tool-arrow {
    transform: translateX(3px);
  }

  /* Explore by Category Cards */
  .category-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    color: var(--text-main);
    box-shadow: var(--shadow-card);
    transition: all 0.2s ease;
    text-decoration: none;
  }

  .category-card-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .category-card-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-md);
    background: var(--accent-light);
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .category-card-title {
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.3;
  }

  .category-card-desc {
    font-size: 0.875rem;
    color: var(--text-muted);
    line-height: 1.5;
    flex-grow: 1;
    margin-bottom: 1rem;
  }

  .category-card-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--accent);
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
  }

  .category-card-count {
    color: var(--text-subtle);
  }

  .category-card-count strong {
    color: var(--accent);
    font-weight: 700;
  }

  /* Tool Icons & Master Archive Tables */
  .tool-siteicon {
    border-radius: 4px;
    vertical-align: middle;
    flex-shrink: 0;
    object-fit: contain;
  }

  .archive-cat-section {
    margin-bottom: 2rem;
    scroll-margin-top: 6rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1.25rem;
  }

  .archive-cat-section:last-of-type {
    border-bottom: none;
  }

  .archive-cat-header {
    display: flex;
    align-items: center;
    gap: 0.5rem 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
    width: 100%;
    max-width: 100%;
    cursor: pointer;
    user-select: none;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    transition: background-color 0.15s ease;
  }

  .archive-cat-header:hover {
    background: var(--bg-muted);
  }

  .archive-cat-toggle-btn {
    appearance: none;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem 0.75rem;
    flex: 1 1 auto;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    color: inherit;
  }

  .archive-cat-chevron {
    margin-left: auto;
    color: var(--text-subtle);
    display: inline-flex;
    align-items: center;
    transition: transform 0.2s ease;
  }

  .archive-cat-section.is-collapsed .archive-cat-chevron {
    transform: rotate(-90deg);
  }

  .archive-cat-section.is-collapsed .archive-cat-body {
    display: none;
  }

  .archive-view-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .archive-toggle-all-btn {
    appearance: none;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    padding: 0.25rem 0.65rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .archive-toggle-all-btn:hover {
    color: var(--accent);
    border-color: var(--accent);
  }

  .archive-cat-ico {
    color: var(--accent);
    flex-shrink: 0;
    display: inline-flex;
  }

  .archive-cat-title {
    font-weight: 800;
    margin: 0;
    min-width: 0;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  .archive-cat-pill {
    font-size: 0.8rem;
    background: var(--accent-light);
    color: var(--accent);
    padding: 0.15rem 0.55rem;
    border-radius: var(--radius-full);
    font-weight: 700;
    flex-shrink: 0;
  }

  .archive-cat-desc {
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.55;
    margin-bottom: 1.25rem;
  }

  .archive-table-wrapper {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    box-shadow: var(--shadow-card);
  }

  .archive-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.9rem;
    min-width: 580px;
  }

  .archive-table thead tr {
    background: var(--bg-muted);
    border-bottom: 1px solid var(--border-color);
  }

  .archive-table th {
    padding: 0.75rem 1rem;
  }

  .archive-table th:nth-child(1) { width: 22%; }
  .archive-table th:nth-child(2) { width: 12%; white-space: nowrap; }
  .archive-table th:nth-child(3) { width: 38%; }
  .archive-table th:nth-child(4) { width: 14%; }
  .archive-table th:nth-child(5) { width: 14%; }

  .archive-row {
    border-bottom: 1px solid var(--border-color);
  }

  .archive-table td {
    padding: 0.85rem 1rem;
  }

  .archive-table td:nth-child(1) {
    font-weight: 700;
  }

  .archive-table td:nth-child(1) a {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    text-decoration: none;
    color: var(--text-main);
    font-weight: 700;
  }

  .archive-table td:nth-child(2) {
    white-space: nowrap;
  }

  .tool-archive-views {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }

  .archive-table td:nth-child(3) {
    color: var(--text-muted);
    line-height: 1.5;
  }

  .archive-table td:nth-child(4) .badge {
    margin: 0.1rem 0.15rem 0.1rem 0;
  }

  .archive-table td:nth-child(5) a {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  /* Pre-Footer CTA */
  .pre-footer-cta {
    padding: 0 0 3.5rem;
    margin-top: 1rem;
  }

  .pre-footer-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
    background-image: radial-gradient(circle at top right, var(--accent-light) 0%, transparent 60%);
  }

  .pre-footer-content {
    max-width: 600px;
  }

  .pre-footer-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-light);
    border: 1px solid var(--accent-border);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    margin-bottom: 0.85rem;
    letter-spacing: 0.02em;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    background-color: #10b981;
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    animation: pulse-dot 2s infinite;
  }

  @keyframes pulse-dot {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }

  .pre-footer-title {
    font-size: 1.45rem;
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.02em;
    margin: 0 0 0.5rem;
    line-height: 1.25;
  }

  .pre-footer-desc {
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.55;
    margin: 0;
  }

  .pre-footer-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  /* Footer */
  .site-footer {
    background: var(--bg-surface);
    border-top: 1px solid var(--border-color);
    padding: 4rem 0 2rem;
    margin-top: auto;
  }

  .footer-inner {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1.15fr 1.15fr;
    gap: 2.75rem;
    margin-bottom: 3rem;
  }

  .footer-desc {
    color: var(--text-muted);
    font-size: 0.925rem;
    margin-top: 0.85rem;
    max-width: 420px;
    line-height: 1.6;
  }

  .footer-pill-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.775rem;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--bg-muted);
    border: 1px solid var(--border-color);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-full);
    margin-top: 1.15rem;
  }

  .footer-col h4 {
    font-size: 0.95rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-main);
  }

  .footer-links {
    list-style: none;
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .footer-links li {
    list-style: none;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .footer-links a {
    color: var(--text-muted);
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .footer-links a svg {
    vertical-align: middle;
    opacity: 0.65;
    transition: opacity 0.2s, transform 0.2s;
  }

  .footer-links a:hover {
    color: var(--accent);
  }

  .footer-links a:hover svg {
    opacity: 1;
    transform: translate(1px, -1px);
  }

  .footer-bottom {
    border-top: 1px solid var(--border-color);
    padding-top: 2rem;
    text-align: center;
    color: var(--text-subtle);
    font-size: 0.85rem;
  }

  .footer-statcounter {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }

  .footer-statcounter,
  .footer-statcounter *,
  .footer-statcounter a,
  .footer-statcounter .statcounter a {
    pointer-events: none !important;
    cursor: default !important;
    text-decoration: none !important;
    color: inherit !important;
  }

  .footer-statcounter img,
  .footer-statcounter .statcounter img {
    display: inline-block !important;
    vertical-align: middle !important;
    border: 0 !important;
    margin: 0 !important;
    pointer-events: none !important;
  }

  /* Markdown Body Rendering */
  .markdown-body {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    margin-bottom: 3rem;
    box-shadow: var(--shadow-card);
  }

  .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
    color: var(--text-main);
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    font-weight: 700;
  }

  .markdown-body h1 { font-size: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-top: 0; }
  .markdown-body h2 { font-size: 1.45rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem; }
  .markdown-body h3 { font-size: 1.2rem; }
  .markdown-body p { margin-bottom: 1.2rem; color: var(--text-main); line-height: 1.7; }
  .markdown-body ul, .markdown-body ol { margin-bottom: 1.25rem; padding-left: 1.75rem; }
  .markdown-body ol { list-style-type: decimal; }
  .markdown-body ol > li { list-style-type: decimal; }
  .markdown-body li { margin-bottom: 0.4rem; color: var(--text-main); line-height: 1.6; }
  .markdown-body p,
  .markdown-body li,
  .markdown-body blockquote,
  .markdown-body td {
    overflow-wrap: break-word;
    word-break: break-word;
  }
  .markdown-body pre {
    background: var(--bg-muted);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1rem 1.25rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  .markdown-body code {
    font-family: var(--font-mono);
    font-size: 0.875em;
    background: var(--bg-muted);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }
  .markdown-body pre code {
    background: transparent;
    padding: 0;
    border: none;
  }
  .markdown-body blockquote {
    border-left: 4px solid var(--accent);
    padding: 0.75rem 1.25rem;
    background: var(--accent-light);
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    margin-bottom: 1.5rem;
  }
  .markdown-body table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .markdown-body th, .markdown-body td {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    text-align: left;
  }
  .markdown-body th {
    background: var(--bg-muted);
    font-weight: 700;
  }

  /* Archive Layout Styles (sidebar scrolls with page) */
  .archive-layout {
    display: grid;
    grid-template-columns: 440px minmax(0, 1fr);
    gap: 2.5rem;
    align-items: start;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .archive-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 0;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .archive-main {
    min-width: 0;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .archive-cat-section {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .archive-cat-header {
    display: flex;
    align-items: center;
    gap: 0.5rem 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .archive-cat-title {
    font-size: 1.6rem;
    font-weight: 800;
    margin: 0;
    overflow-wrap: break-word;
    word-break: break-word;
    min-width: 0;
  }

  .archive-cat-link {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-muted);
    padding: 0.45rem 0.55rem;
    border-radius: var(--radius-sm);
    transition: all 0.15s ease;
    text-decoration: none;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .archive-cat-link:hover {
    color: var(--accent);
    background: var(--accent-light);
    transform: translateX(2px);
  }

  .archive-cat-icon {
    display: flex;
    align-items: center;
    color: var(--accent);
    width: 1.25rem;
    flex-shrink: 0;
  }

  .archive-cat-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .archive-cat-count {
    font-size: 0.725rem;
    font-weight: 700;
    color: var(--text-subtle);
    background: var(--bg-muted);
    padding: 0.1rem 0.45rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  @media (max-width: 1040px) {
    .archive-layout {
      grid-template-columns: minmax(0, 1fr) !important;
      width: 100% !important;
      max-width: 100% !important;
    }
  }

  /* Tool Page 2-Column Layout (Content + Right Sidebar) */
  .tool-page-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 440px;
    gap: 2.5rem;
    align-items: start;
    padding: 0 0 3.5rem;
  }

  .tool-page-main {
    min-width: 0;
  }

  /* Tool Tags / Keywords Section */
  .tool-tags-section {
    margin: 2rem 0 1.5rem;
    padding: 1.15rem 1.35rem;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    box-shadow: var(--shadow-card);
  }

  .tool-tags-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-subtle);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .tool-tags-list {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    flex-wrap: wrap;
  }

  .tool-tag-pill {
    display: inline-flex;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.25rem 0.65rem;
    border-radius: var(--radius-full);
    background: var(--bg-body);
    border: 1px solid var(--border-color);
    color: var(--text-muted);
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .tool-tag-pill:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-light);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  }

  .tool-page-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar-widget {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.35rem 1.25rem;
    box-shadow: var(--shadow-card);
  }

  .sidebar-widget-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }

  .sidebar-widget-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-main);
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0;
  }

  .sidebar-tip-item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    margin-bottom: 0.85rem;
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-muted);
  }

  .sidebar-tip-item:last-child {
    margin-bottom: 0;
  }

  .sidebar-tip-icon {
    color: var(--accent);
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-top: 0.15rem;
  }

  .sidebar-tool-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.6rem;
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    text-decoration: none;
    transition: all 0.18s ease;
  }

  .sidebar-tool-card:hover {
    background: var(--bg-muted);
    border-color: var(--border-hover);
    transform: translateX(2px);
  }

  .sidebar-tool-icon {
    width: 2.1rem;
    height: 2.1rem;
    background: var(--accent-light);
    color: var(--accent);
    border: 1px solid rgba(37, 99, 235, 0.15);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sidebar-tool-info {
    flex: 1;
    min-width: 0;
  }

  .sidebar-tool-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-main);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.35rem;
  }

  .sidebar-tool-desc {
    font-size: 0.775rem;
    color: var(--text-subtle);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 0.1rem;
  }

  /* Prevent iOS Safari 115% automatic zoom when tapping inputs/selects */
  @media (max-width: 768px) {
    input[type="text"],
    input[type="search"],
    input[type="url"],
    input[type="email"],
    select,
    textarea {
      font-size: 16px !important;
    }
  }

  /* Responsive Breakpoints & Mobile Viewport Handling */
  @media (max-width: 1040px) {
    .tool-page-layout {
      grid-template-columns: minmax(0, 1fr) !important;
      gap: 2rem;
    }
    .archive-layout {
      grid-template-columns: minmax(0, 1fr) !important;
      gap: 1.5rem;
      width: 100% !important;
      max-width: 100% !important;
    }
    .archive-sidebar,
    .archive-main {
      min-width: 0 !important;
      max-width: 100% !important;
      width: 100% !important;
    }
    .archive-sidebar-secondary {
      display: none !important;
    }
    .archive-categories-widget {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    .archive-categories-widget .archive-categories-list {
      max-height: 240px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-right: 0.25rem;
      width: 100%;
      box-sizing: border-box;
    }
  }

  /* Community Layout & Pillars */
  .community-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 2.25rem;
    align-items: start;
    margin-bottom: 4rem;
  }

  .community-pillars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
    margin-bottom: 2.25rem;
  }

  .community-pillar-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .community-pillar-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card-hover);
    border-color: var(--border-hover);
  }

  .community-category-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .community-tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.4rem 0.85rem;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    font-size: 0.825rem;
    font-weight: 500;
    color: var(--text-main);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .community-tag-pill:hover {
    background: var(--accent-light);
    border-color: var(--accent);
    color: var(--accent);
  }

  .community-channel-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .community-channel-card:hover {
    transform: translateY(-2px);
    border-color: var(--accent) !important;
    box-shadow: var(--shadow-card-hover);
  }

  @media (max-width: 960px) {
    .community-layout {
      grid-template-columns: 1fr !important;
      margin-bottom: 3rem !important;
      gap: 1.75rem !important;
    }
  }

  @media (max-width: 900px) {
    .submit-layout {
      grid-template-columns: 1fr !important;
      margin-bottom: 3rem !important;
      gap: 1.5rem !important;
    }
  }

  @media (max-width: 1024px) {
    .footer-inner {
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
    }
    .pre-footer-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
      padding: 2rem;
    }
    .pre-footer-actions {
      width: 100%;
    }
  }

  @media (max-width: 860px) {
    .back-to-top-btn {
      bottom: max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem));
      right: max(1.25rem, calc(env(safe-area-inset-right, 0px) + 0.75rem));
      padding: 0.55rem 0.85rem;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 640px) {
    .footer-inner {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .pre-footer-actions {
      flex-direction: column;
      align-items: stretch;
    }
    .pre-footer-actions .btn {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    .hamburger-btn {
      display: inline-flex !important;
    }
    .nav-drawer {
      display: none !important;
    }
  }

  @media (max-width: 640px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    /* Header & Navigation on iPhone / Mobile */
    .header-inner {
      height: 3.75rem;
      justify-content: space-between;
    }
    .brand {
      font-size: 1.1rem;
      gap: 0.6rem;
      flex-shrink: 0;
    }
    .brand-icon {
      width: 2.15rem;
      height: 2.15rem;
    }
    .brand-badge {
      display: none !important;
    }

    /* Mini Hero on Mobile */
    .mini-hero {
      padding: 1.5rem 0 1.25rem;
      margin-bottom: 1.5rem;
    }
    .mini-hero-inner {
      gap: 0.65rem;
    }
    .mini-hero-header {
      gap: 1rem;
    }
    .mini-hero-header-main {
      flex: 1 1 100%;
      min-width: 0;
    }
    .mini-hero-title-row {
      gap: 0.6rem;
    }
    .mini-hero-icon-box {
      width: 2.25rem;
      height: 2.25rem;
    }
    .mini-hero-title {
      font-size: 1.45rem;
    }
    .mini-hero-subtext {
      font-size: 0.925rem;
      line-height: 1.5;
    }
    .mini-hero-actions {
      width: 100%;
      justify-content: flex-start;
      gap: 0.5rem;
    }
    .mini-hero-actions .btn {
      flex: 1 1 auto;
      text-align: center;
      justify-content: center;
      font-size: 0.875rem;
      padding: 0.55rem 0.9rem;
    }
    .mini-hero-extra > div {
      gap: 0.75rem !important;
      font-size: 0.825rem !important;
    }
    .mini-hero-extra-edit {
      margin-left: 0 !important;
      width: 100%;
    }
    .mini-hero-extra-edit a {
      width: 100%;
      justify-content: center;
    }

    /* Home Hero & Stats Grid */
    .hero {
      padding: 2.25rem 0 1.75rem !important;
    }
    .hero-kbd {
      display: none !important;
    }
    .hero-search-box {
      padding: 0.3rem 0.4rem 0.3rem 0.85rem !important;
    }
    #hero-search-input {
      font-size: 16px !important;
    }
    .hero-stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      padding: 1.25rem 1rem !important;
      gap: 0.85rem !important;
    }
    .hero-stats-grid > div:last-child {
      grid-column: 1 / -1;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-color);
    }

    /* Archive Filter Chips (Swipeable horizontally on touch) */
    .archive-filter-chips {
      display: flex !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      flex-wrap: nowrap !important;
      padding-bottom: 0.4rem !important;
      scrollbar-width: none !important;
      width: 100% !important;
    }
    .archive-filter-chips::-webkit-scrollbar {
      display: none;
    }
    .archive-filter-chips .btn {
      white-space: nowrap !important;
      flex-shrink: 0 !important;
      font-size: 0.8rem !important;
      padding: 0.35rem 0.65rem !important;
    }

    /* Archive Table: smooth horizontal scroll without clipping or page blowout */
    .archive-table-wrapper {
      width: 100% !important;
      max-width: 100% !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      border-radius: var(--radius-md) !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      box-sizing: border-box !important;
    }
    .archive-table {
      min-width: 580px !important;
      font-size: 0.85rem !important;
      width: 100% !important;
    }
    .archive-table th,
    .archive-table td {
      padding: 0.65rem 0.75rem !important;
    }
    .archive-cat-title {
      font-size: 1.35rem !important;
    }

    /* Markdown Body on Mobile */
    .markdown-body {
      padding: 1.25rem 1rem !important;
      border-radius: var(--radius-md) !important;
      margin-bottom: 2rem !important;
    }
    .markdown-body h1 {
      font-size: 1.5rem !important;
    }
    .markdown-body h2 {
      font-size: 1.25rem !important;
    }
    .markdown-body h3 {
      font-size: 1.1rem !important;
    }
    .markdown-body pre {
      padding: 0.75rem 0.85rem !important;
      font-size: 0.8rem !important;
      margin-left: -0.25rem;
      margin-right: -0.25rem;
      border-radius: var(--radius-sm) !important;
      -webkit-overflow-scrolling: touch;
    }

    /* Submit Form Cards */
    .submit-card,
    .submit-info-card {
      padding: 1.35rem 1.15rem !important;
      border-radius: var(--radius-md) !important;
    }
  }
`;

function getMinifiedBaseCss() {
  return BASE_CSS
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

module.exports = {
  BASE_CSS,
  getMinifiedBaseCss
};

