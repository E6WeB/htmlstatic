// ==========================================================================
// Shared Layout, Mini Hero, and Breadcrumb Templates
// ==========================================================================

const fs = require('fs');
const path = require('path');
const { ICONS, escapeHtml } = require('../data/icons');

let _cachedTotalViews = null;
function getTotalToolViews() {
  if (_cachedTotalViews !== null) return _cachedTotalViews;
  try {
    const p = path.resolve(__dirname, '..', '..', 'asset', 'json', 'tool-views-cache.json');
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      const sum = Object.values(data).reduce((acc, v) => acc + (Number(v) || 0), 0);
      _cachedTotalViews = sum;
      return _cachedTotalViews;
    }
  } catch {}
  _cachedTotalViews = 0;
  return _cachedTotalViews;
}

function renderBreadcrumbs(crumbs, rootPath = '') {
  if (!crumbs || crumbs.length === 0) return '';
  return `
    <nav class="mini-hero-breadcrumbs" aria-label="Breadcrumbs">
      ${crumbs.map((crumb, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === crumbs.length - 1;
        const homeIconHtml = isFirst ? `<span style="display:inline-flex;align-items:center;">${ICONS.home}</span> ` : '';
        if (isLast) {
          return `<span class="crumb-current" aria-current="page">${escapeHtml(crumb.label)}</span>`;
        }
        return `
          <a href="${crumb.url}">${homeIconHtml}<span>${escapeHtml(crumb.label)}</span></a>
          <span class="crumb-sep" aria-hidden="true">${ICONS.chevronRight}</span>
        `;
      }).join('')}
    </nav>
  `;
}

function renderMiniHero(miniHero, rootPath = '') {
  if (!miniHero) return '';

  const breadcrumbsHtml = renderBreadcrumbs(miniHero.breadcrumbs, rootPath);
  const iconHtml = miniHero.icon ? `<div class="mini-hero-icon-box" aria-hidden="true">${miniHero.icon}</div>` : '';
  const badgeRowHtml = miniHero.badgeRow ? `<div class="mini-hero-badge-row">${miniHero.badgeRow}</div>` : '';
  const actionsHtml = miniHero.actions ? `<div class="mini-hero-actions">${miniHero.actions}</div>` : '';
  const extraHtml = miniHero.extraHtml ? `<div class="mini-hero-extra">${miniHero.extraHtml}</div>` : '';

  const hasTitle = Boolean(miniHero.title);
  const headerHtml = hasTitle ? `
      <div class="mini-hero-header">
        <div class="mini-hero-header-main">
          <div class="mini-hero-title-row">
            ${iconHtml}
            <h1 class="mini-hero-title">${miniHero.title}</h1>
          </div>
          ${miniHero.subtext ? `<p class="mini-hero-subtext">${miniHero.subtext}</p>` : ''}
        </div>
        ${actionsHtml}
      </div>
  ` : '';

  const extraClass = (!hasTitle && !miniHero.subtext && !miniHero.badgeRow) ? ' mini-hero-breadcrumbs-only' : '';

  return `
  <!-- Mini Hero Section -->
  <section class="mini-hero${extraClass}">
    <div class="container mini-hero-inner">
      ${breadcrumbsHtml}
      ${badgeRowHtml}
      ${headerHtml}
      ${extraHtml}
    </div>
  </section>
  `;
}

function createLayoutRenderer({ allTools, categories }) {
  return function renderLayout({
    title,
    description,
    currentNav = '',
    content,
    miniHero = null,
    breadcrumbs = [],
    rootPath = '',
    ogImage = '',
    ogImageWidth = 1200,
    ogImageHeight = 630,
    canonicalUrl = '',
    keywords = '',
    jsonLd = null,
    showFooter = true,
    showPreFooter = true,
    totalViews
  }) {
    const siteViews = totalViews !== undefined ? Number(totalViews) : getTotalToolViews();
    const siteViewsFormatted = Number(siteViews || 0).toLocaleString();
    const rawDesc = description || 'StaticStack - A community-curated collection of tools, services, and resources for static websites with zero backend servers.';
    const cleanDescription = rawDesc.length > 160 ? rawDesc.slice(0, 157).replace(/\s+\S*$/, '') + '...' : rawDesc;
    const cleanKeywords = keywords || 'static websites, jamstack, static site generators, zero backend, serverless apis, html css javascript tools, astro, hugo, 11ty, nextjs, free static hosting, headless cms, static form backend, open source web tools';
    let pageTitle = title.includes('StaticStack') ? title : `${title} | StaticStack`;
    if (pageTitle.length > 60 && !title.includes('StaticStack')) {
      pageTitle = title.length <= 60 ? title : title.slice(0, 57).replace(/\s+\S*$/, '') + '...';
    } else if (pageTitle.length > 60) {
      pageTitle = pageTitle.replace(/\s*\|\s*StaticStack$/, '');
      if (pageTitle.length > 60) {
        pageTitle = pageTitle.slice(0, 57).replace(/\s+\S*$/, '') + '...';
      }
    }

    const pageOgImage = ogImage || (
      currentNav === 'home' ? 'https://www.staticstack.app/asset/img/og-home.webp' :
      currentNav === 'archive' ? 'https://www.staticstack.app/archive/og-archive.webp' :
      currentNav === 'submit' ? 'https://www.staticstack.app/submit/og-submit.webp' :
      currentNav === 'community' ? 'https://www.staticstack.app/asset/img/og-community.webp' :
      'https://www.staticstack.app/asset/img/og-image.webp'
    );

    let pageUrl = canonicalUrl;
    if (!pageUrl) {
      if (currentNav === 'home') pageUrl = 'https://www.staticstack.app/';
      else if (currentNav === 'archive') pageUrl = 'https://www.staticstack.app/archive';
      else if (currentNav === 'submit') pageUrl = 'https://www.staticstack.app/submit';
      else if (currentNav === 'contribute') pageUrl = 'https://www.staticstack.app/contribute';
      else if (currentNav === 'thankyou') pageUrl = 'https://www.staticstack.app/thankyou';
      else if (currentNav === 'contact') pageUrl = 'https://www.staticstack.app/contact';
      else if (currentNav === 'community') pageUrl = 'https://www.staticstack.app/community/';
      else pageUrl = 'https://www.staticstack.app/';
    }

    const structuredDataObj = jsonLd || (currentNav === 'home' ? {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'StaticStack',
      alternateName: 'StaticStack - Modern Tools & APIs for Static Websites',
      url: 'https://www.staticstack.app/',
      description: cleanDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.staticstack.app/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    } : {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      url: pageUrl,
      description: cleanDescription,
      isPartOf: {
        '@type': 'WebSite',
        name: 'StaticStack',
        url: 'https://www.staticstack.app/'
      }
    });
    const jsonLdString = JSON.stringify(structuredDataObj).replace(/<\//g, '<\\/');

    const miniHeroHtml = miniHero ? renderMiniHero(miniHero, rootPath) : '';
    const breadcrumbFallbackHtml = (!miniHero && breadcrumbs.length > 0) ? `
  <section class="mini-hero mini-hero-breadcrumbs-only">
    <div class="container mini-hero-inner">
      ${renderBreadcrumbs(breadcrumbs, rootPath)}
    </div>
  </section>
  ` : '';

    const rawHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(cleanDescription)}">
  <meta name="keywords" content="${escapeHtml(cleanKeywords)}">
  <meta name="theme-color" content="#2563eb">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 2 7 12 12 22 7 12 2'/><polyline points='2 17 12 22 22 17'/><polyline points='2 12 12 17 22 12'/></svg>">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="canonical" href="${pageUrl}">

  <!-- OpenGraph & Social Cards -->
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="StaticStack">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(cleanDescription)}">
  <meta property="og:image" content="${pageOgImage}">
  <meta property="og:image:type" content="image/webp">
  <meta property="og:image:width" content="${ogImageWidth}">
  <meta property="og:image:height" content="${ogImageHeight}">
  <meta property="og:image:alt" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@staticstack">
  <meta name="twitter:url" content="${pageUrl}">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(cleanDescription)}">
  <meta name="twitter:image" content="${pageOgImage}">

  <script type="application/ld+json">${jsonLdString}</script>
  <link rel="stylesheet" href="/asset/css/style.css?v=14">

  <!-- Local StaticStack Appreciation / Like Button -->
  <script defer src="/asset/js/likes.js?v=1"></script>
</head>
<body>

  <!-- Left Navigation Rail (Desktop & Tablet >= 768px) -->
  <aside class="left-nav-rail" aria-label="Desktop Navigation Rail">
    <div class="rail-top">
      <a href="${rootPath || './'}" class="rail-brand" aria-label="StaticStack Home">
        ${ICONS.logo}
        <span class="rail-tooltip">StaticStack.app</span>
      </a>

      <nav class="rail-nav" aria-label="Primary Navigation">
        <ul class="rail-list">
          <li>
            <a href="${rootPath || './'}" class="rail-item ${currentNav === 'home' ? 'active' : ''}" aria-label="Home">
              ${ICONS.home}
              <span class="rail-tooltip">Home</span>
            </a>
          </li>
          <li>
            <a href="${rootPath}search" class="rail-item ${currentNav === 'search' ? 'active' : ''}" aria-label="Search Tools">
              ${ICONS.search}
              <span class="rail-tooltip">Search</span>
            </a>
          </li>
          <li>
            <a href="${rootPath}archive" class="rail-item ${currentNav === 'archive' ? 'active' : ''}" aria-label="Master Archive">
              ${ICONS.compass}
              <span class="rail-tooltip">Archive (${allTools.length} Tools)</span>
            </a>
          </li>
          <li>
            <a href="${rootPath}community" class="rail-item ${currentNav === 'community' ? 'active' : ''}" aria-label="Community">
              ${ICONS.users}
              <span class="rail-tooltip">Community</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="rail-item" aria-label="GitHub Repository">
              ${ICONS.github}
              <span class="rail-tooltip">Star on GitHub</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="rail-bottom">
      <a href="${rootPath}submit" class="rail-action-btn ${currentNav === 'submit' ? 'active' : ''}" aria-label="Submit a Tool">
        ${ICONS.plus}
        <span class="rail-tooltip">Submit a Tool</span>
      </a>
      <a href="${rootPath}thankyou" class="rail-item ${currentNav === 'thankyou' ? 'active' : ''}" aria-label="Credits & Thanks">
        ${ICONS.heart}
        <span class="rail-tooltip">Credits & Thanks</span>
      </a>
    </div>
  </aside>

  <!-- Mobile Bottom Navigation Bar (Phones < 768px) -->
  <nav class="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
    <div class="bottom-nav-inner">
      <a href="${rootPath || './'}" class="bottom-nav-item ${currentNav === 'home' ? 'active' : ''}">
        <span class="bottom-nav-icon">${ICONS.home}</span>
        <span>Home</span>
      </a>
      <a href="${rootPath}search" class="bottom-nav-item ${currentNav === 'search' ? 'active' : ''}" aria-label="Search Tools">
        <span class="bottom-nav-icon">${ICONS.search}</span>
        <span>Search</span>
      </a>
      <a href="${rootPath}submit" class="bottom-nav-fab" aria-label="Submit a Tool">
        ${ICONS.plus}
      </a>
      <a href="${rootPath}archive" class="bottom-nav-item ${currentNav === 'archive' ? 'active' : ''}">
        <span class="bottom-nav-icon">${ICONS.compass}</span>
        <span>Archive</span>
      </a>
      <button type="button" class="bottom-nav-item" onclick="openMobileNav()" aria-label="Open More Menu">
        <span class="bottom-nav-icon">${ICONS.moreHorizontal}</span>
        <span>More</span>
      </button>
    </div>
  </nav>

  <!-- Site Header (Mobile Only < 768px) -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="${rootPath || './'}" class="brand">
        <span class="brand-icon">${ICONS.logo}</span>
        <span>StaticStack</span>
        <span class="brand-badge">.app</span>
      </a>

      <!-- Quick Search Link -->
      <a href="${rootPath}search" class="header-search-btn" aria-label="Search Tools" style="text-decoration:none;">
        <span class="header-search-icon">${ICONS.search}</span>
        <span class="header-search-label">Search...</span>
        <kbd class="header-search-kbd">/</kbd>
      </a>

      <!-- Desktop Clean Nav Menu -->
      <nav class="nav-drawer" aria-label="Main Navigation">
        <ul id="nav-links" class="nav-links">
          <li><a href="${rootPath || './'}" class="nav-link ${currentNav === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="${rootPath}search" class="nav-link ${currentNav === 'search' ? 'active' : ''}">Search</a></li>
          <li><a href="${rootPath}archive" class="nav-link ${currentNav === 'archive' ? 'active' : ''}">Archive</a></li>
          <li><a href="${rootPath}submit" class="nav-link ${currentNav === 'submit' ? 'active' : ''}">Submit</a></li>
          <li><a href="${rootPath}community" class="nav-link ${currentNav === 'community' ? 'active' : ''}">Community</a></li>
          <li><a href="${rootPath}contact" class="nav-link ${currentNav === 'contact' ? 'active' : ''}">Contact</a></li>
          <li><a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="nav-link" style="display:flex;align-items:center;gap:0.35rem;">${ICONS.github} GitHub</a></li>
        </ul>
      </nav>

      <!-- Mobile Hamburger Menu Button -->
      <button id="mobile-menu-btn" class="hamburger-btn" type="button" aria-label="Open Navigation Menu" aria-expanded="false" aria-controls="mobile-nav-modal">
        ${ICONS.menu}
      </button>
    </div>
  </header>

  <!-- Full-Screen Mobile Navigation Overlay -->
  <div id="mobile-nav-modal" class="mobile-nav-modal" role="dialog" aria-modal="true" aria-label="Navigation Menu" tabindex="-1">
    <div class="mobile-nav-header">
      <a href="${rootPath || './'}" class="brand" onclick="closeMobileNav()">
        <span class="brand-icon">${ICONS.logo}</span>
        <span>StaticStack</span>
      </a>
      <button id="mobile-menu-close" class="mobile-nav-close" type="button" aria-label="Close Navigation Menu" onclick="closeMobileNav()">
        ${ICONS.close}
      </button>
    </div>

    <div class="mobile-nav-body">
      <ul class="mobile-nav-list">
        <li class="mobile-nav-item">
          <a href="${rootPath || './'}" class="${currentNav === 'home' ? 'active' : ''}" onclick="closeMobileNav()">
            <span class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon">${ICONS.home}</span>
              <span>Home</span>
            </span>
            <span class="mobile-nav-badge">${currentNav === 'home' ? 'Current' : 'Explore'}</span>
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${rootPath}search" class="${currentNav === 'search' ? 'active' : ''}" onclick="closeMobileNav()">
            <span class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon">${ICONS.search}</span>
              <span>Search Tools</span>
            </span>
            <span class="mobile-nav-badge">Instant</span>
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${rootPath}archive" class="${currentNav === 'archive' ? 'active' : ''}" onclick="closeMobileNav()">
            <span class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon">${ICONS.archive}</span>
              <span>Master Archive</span>
            </span>
            <span class="mobile-nav-badge">${allTools.length} Tools</span>
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${rootPath}submit" class="${currentNav === 'submit' ? 'active' : ''}" onclick="closeMobileNav()">
            <span class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon">${ICONS.plusCircle}</span>
              <span>Submit a Tool</span>
            </span>
            <span class="mobile-nav-badge">Contribute</span>
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${rootPath}community" class="${currentNav === 'community' ? 'active' : ''}" onclick="closeMobileNav()">
            <span class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon">${ICONS.users}</span>
              <span>Community</span>
            </span>
            <span class="mobile-nav-badge">Discussions</span>
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${rootPath}contribute" class="${currentNav === 'contribute' ? 'active' : ''}" onclick="closeMobileNav()">
            <span class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon">${ICONS.gitPullRequest}</span>
              <span>Contributing Guide</span>
            </span>
            <span class="mobile-nav-badge">Docs</span>
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${rootPath}thankyou" class="${currentNav === 'thankyou' ? 'active' : ''}" onclick="closeMobileNav()">
            <span class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon">${ICONS.heart}</span>
              <span>Thank You &amp; Credits</span>
            </span>
            <span class="mobile-nav-badge">Credits</span>
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${rootPath}contact" class="${currentNav === 'contact' ? 'active' : ''}" onclick="closeMobileNav()">
            <span class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon">${ICONS.comments}</span>
              <span>Contact &amp; Connect</span>
            </span>
            <span class="mobile-nav-badge">Connect</span>
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer">
            <span class="mobile-nav-link-left">
              <span class="mobile-nav-link-icon">${ICONS.github}</span>
              <span>GitHub Repository</span>
            </span>
            <span class="mobile-nav-badge" style="display:flex;align-items:center;gap:0.25rem;">${ICONS.external} Star</span>
          </a>
        </li>
      </ul>
    </div>
  </div>

  ${miniHeroHtml || breadcrumbFallbackHtml}

  <main class="site-main container">
    ${content}
  </main>

  ${showPreFooter ? `<!-- Pre-Footer Call to Action -->
  <section class="pre-footer-cta">
    <div class="container">
      <div class="pre-footer-card">
        <div class="pre-footer-content">
          <h2 class="pre-footer-title">Have a great static tool to recommend?</h2>
          <p class="pre-footer-desc">Help developers build faster, cleaner static sites. Submit new tools or contribute directly to the repository on GitHub.</p>
        </div>
        <div class="pre-footer-actions">
          <a href="${rootPath}submit" class="btn btn-primary">
            ${ICONS.plusCircle}
            <span>Submit a Tool</span>
          </a>
          <a href="${rootPath}archive" class="btn btn-secondary">
            ${ICONS.archive}
            <span>Browse all Categories</span>
          </a>
          <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" title="Star on GitHub">
            ${ICONS.github}
            <span>Star on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  </section>` : ''}

  ${showFooter ? `<!-- Site Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-col footer-col-brand">
          <a href="${rootPath || './'}" class="brand" style="margin-bottom: 0.5rem;">
            <span class="brand-icon">${ICONS.logo}</span>
            <span>StaticStack</span>
          </a>
          <p class="footer-desc">
            Community-curated tools, APIs, and services for building modern static websites with zero backend bloat.
          </p>
          <div class="footer-pill-badge">
            <span class="status-dot"></span>
            <span>${allTools.length} Tools &bull; ${categories.length} Categories</span>
          </div>
        </div>

        <div class="footer-col">
          <h4>Directory</h4>
          <ul class="footer-links">
            <li><a href="${rootPath}search">Search Tools</a></li>
            <li><a href="${rootPath}archive">Master Archive</a></li>
            <li><a href="${rootPath}community">Community Forum</a></li>
            <li><a href="${rootPath}submit">Submit a Tool</a></li>
            <li><a href="${rootPath}contribute">Contributing Guide</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Top Categories</h4>
          <ul class="footer-links">
            <li><a href="${rootPath}category/hosting-deployment/">Hosting &amp; Deployment</a></li>
            <li><a href="${rootPath}category/contact-forms/">Contact Forms</a></li>
            <li><a href="${rootPath}category/authentication-users/">Authentication</a></li>
            <li><a href="${rootPath}category/content-management/">Content Management</a></li>
            <li><a href="${rootPath}category/analytics-privacy/">Analytics &amp; Privacy</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Community &amp; Info</h4>
          <ul class="footer-links">
            <li><a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer">GitHub Repository ${ICONS.external}</a></li>
            <li><a href="https://www.facebook.com/groups/dynamicwebsites" target="_blank" rel="noopener noreferrer">Dynamic Websites Group ${ICONS.external}</a></li>
            <li><a href="https://www.facebook.com/groups/staticshark" target="_blank" rel="noopener noreferrer">StaticStack Official Group ${ICONS.external}</a></li>
            <li><a href="${rootPath}thankyou">Thank You &amp; Credits</a></li>
            <li><a href="${rootPath}contact">Contact</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; <span id="year">2026</span> StaticStack. Hosted by: <a href="https://wasmer.io" target="_blank" rel="noopener noreferrer">wasmer.io</a> &middot; Created by: <a href="https://www.e6web.com/contact/" target="_blank" rel="noopener">E6WeB</a> &middot; <a href="/stats" class="footer-stat-text" title="Total Site Views &middot; StaticStack Analytics"><span id="footer-stat-count">${siteViewsFormatted}</span> views</a><span class="footer-statcounter" style="display:none;" aria-hidden="true"><!-- Default Statcounter code for StaticStacks https://www.staticstack.app/ --><script type="text/javascript">
var sc_project=13364370; 
var sc_invisible=1; 
var sc_security="cae7fdd5"; 
var scJsHost = "https://";
document.write("<sc"+"ript type='text/javascript' src='" + scJsHost+
"statcounter.com/counter/counter.js'></"+"script>");
</script><noscript><span class="statcounter"><img class="statcounter" src="https://c.statcounter.com/13364370/0/cae7fdd5/0/" alt="Web Analytics" referrerPolicy="no-referrer-when-downgrade"></span></noscript><!-- End of Statcounter Code --></span></p>
      </div>
    </div>
  </footer>` : ''}

  <!-- Floating Back to Top Button -->
  <button id="back-to-top" class="back-to-top-btn" aria-label="Back to top" title="Back to top" onclick="scrollToTop()">
    <span class="btt-icon">${ICONS.arrowUp}</span>
    <span>Back to Top</span>
  </button>

  <script>
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Live Footer Stat Counter updater
    (function() {
      const el = document.getElementById('footer-stat-count');
      if (!el) return;
      function updateCount(val) {
        if (typeof val === 'number' && !isNaN(val) && val > 0) {
          el.textContent = val.toLocaleString();
        }
      }
      try {
        const cached = sessionStorage.getItem('staticstack_total_views');
        if (cached) updateCount(Number(cached));
      } catch (e) {}

      fetch('/community/api?action=tool-views')
        .then(r => r.json())
        .then(d => {
          if (d && d.views) {
            const sum = Object.values(d.views).reduce((a, b) => a + (Number(b) || 0), 0);
            if (sum > 0) {
              updateCount(sum);
              try { sessionStorage.setItem('staticstack_total_views', String(sum)); } catch(e){}
            }
          }
        })
        .catch(() => {
          fetch('/asset/json/tool-views-cache.json')
            .then(r => r.json())
            .then(d => {
              if (d) {
                const sum = Object.values(d).reduce((a, b) => a + (Number(b) || 0), 0);
                if (sum > 0) updateCount(sum);
              }
            })
            .catch(() => {});
        });
    })();

    // Strip hyperlinks from statcounter so only plain counter displays
    const scWrap = document.querySelector('.footer-statcounter');
    if (scWrap) {
      const cleanSc = () => {
        scWrap.querySelectorAll('a').forEach(a => {
          a.removeAttribute('href');
          a.removeAttribute('target');
          a.removeAttribute('title');
          a.style.pointerEvents = 'none';
          a.style.cursor = 'default';
        });
      };
      cleanSc();
      new MutationObserver(cleanSc).observe(scWrap, { childList: true, subtree: true });
    }

    // Floating Back to Top
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Full-Screen Mobile Navigation Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavModal = document.getElementById('mobile-nav-modal');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');

    function openMobileNav() {
      if (!mobileNavModal) return;
      mobileNavModal.classList.add('is-open');
      document.body.classList.add('mobile-nav-open');
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
      if (mobileMenuCloseBtn) mobileMenuCloseBtn.focus();
    }

    function closeMobileNav() {
      if (!mobileNavModal) return;
      mobileNavModal.classList.remove('is-open');
      document.body.classList.remove('mobile-nav-open');
      if (mobileMenuBtn) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.focus();
      }
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', openMobileNav);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavModal && mobileNavModal.classList.contains('is-open')) {
        closeMobileNav();
      }
    });

    // Close on desktop resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileNavModal && mobileNavModal.classList.contains('is-open')) {
        closeMobileNav();
      }
    });
  </script>

  <!-- High-Performance Instant Client-Side Search Engine -->
  <script defer src="${rootPath}asset/js/search.js?v=3"></script>
</body>
</html>
`;
    const preBlocks = [];
    const withPlaceholders = rawHtml.replace(/<pre[\s\S]*?<\/pre>/gi, m => {
      preBlocks.push(m);
      return `__PRE_BLOCK_${preBlocks.length - 1}__`;
    });
    return withPlaceholders
      .replace(/^[ \t]+/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/__PRE_BLOCK_(\d+)__/g, (_, i) => preBlocks[Number(i)]);
  };
}

module.exports = {
  renderBreadcrumbs,
  renderMiniHero,
  createLayoutRenderer
};

