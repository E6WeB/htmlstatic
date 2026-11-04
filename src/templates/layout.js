// ==========================================================================
// Shared Layout, Mini Hero, and Breadcrumb Templates
// ==========================================================================

const { ICONS, escapeHtml } = require('../data/icons');

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

  return `
  <!-- Mini Hero Section -->
  <section class="mini-hero">
    <div class="container mini-hero-inner">
      ${breadcrumbsHtml}
      ${badgeRowHtml}
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
    jsonLd = null
  }) {
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
        target: 'https://www.staticstack.app/archive?q={search_term_string}',
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
    <nav class="breadcrumbs" aria-label="Breadcrumbs">
      ${breadcrumbs.map((b, i) => i === breadcrumbs.length - 1 ? `<span>${escapeHtml(b.label)}</span>` : `<a href="${b.url}">${escapeHtml(b.label)}</a><span>/</span>`).join('')}
    </nav>
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
  <link rel="stylesheet" href="/asset/css/style.css">

  <!-- iine Open Source Appreciation / Like Button -->
  <script defer src="https://cdn.jsdelivr.net/gh/welpo/iine@main/iine.mini.js"></script>
</head>
<body>

  <!-- Site Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="${rootPath || './'}" class="brand">
        <span class="brand-icon">${ICONS.logo}</span>
        <span>StaticStack</span>
        <span class="brand-badge">.app</span>
      </a>

      <!-- Desktop Clean Nav Menu -->
      <nav class="nav-drawer" aria-label="Main Navigation">
        <ul id="nav-links" class="nav-links">
          <li><a href="${rootPath || './'}" class="nav-link ${currentNav === 'home' ? 'active' : ''}">Home</a></li>
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

  ${miniHeroHtml}

  <main class="site-main container">
    ${breadcrumbFallbackHtml}
    ${content}
  </main>

  <!-- Pre-Footer Call to Action -->
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
  </section>

  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-col footer-col-brand">
          <a href="${rootPath || './'}" class="brand" style="margin-bottom: 0.75rem;">
            <span class="brand-icon">${ICONS.logo}</span>
            <span>StaticStack</span>
          </a>
          <p class="footer-desc">
            A community-curated collection of tools, services, and resources for building and hosting modern static websites with HTML, CSS, and JavaScript.
          </p>
          <div class="footer-pill-badge">
            <span class="status-dot"></span>
            <span>${allTools.length} Tools &bull; ${categories.length} Categories</span>
          </div>
        </div>

        <div class="footer-col">
          <h4>Navigation</h4>
          <ul class="footer-links">
            <li><a href="${rootPath || './'}">Home</a></li>
            <li><a href="${rootPath}archive">Master Archive</a></li>
            <li><a href="${rootPath}submit">Submit a Tool</a></li>
            <li><a href="${rootPath}community">Community</a></li>
            <li><a href="${rootPath}contribute">Contributing Guide</a></li>
            <li><a href="${rootPath}thankyou">Thank You &amp; Credits</a></li>
            <li><a href="${rootPath}contact">Contact</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Popular Categories</h4>
          <ul class="footer-links">
            <li><a href="${rootPath}archive#hosting-deployment">Hosting &amp; Deployment</a></li>
            <li><a href="${rootPath}archive#contact-forms">Contact Forms</a></li>
            <li><a href="${rootPath}archive#css-components">CSS &amp; UI Components</a></li>
            <li><a href="${rootPath}archive#content-management">Content Management</a></li>
            <li><a href="${rootPath}archive#analytics-privacy">Analytics &amp; Privacy</a></li>
            <li><a href="${rootPath}archive#browser-extensions">Browser Extensions</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Community &amp; Project</h4>
          <ul class="footer-links">
            <li><a href="https://github.com/E6WeB/htmlstatic/discussions" target="_blank" rel="noopener noreferrer">GitHub Discussions ${ICONS.external}</a></li>
            <li><a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer">GitHub Repository ${ICONS.external}</a></li>
            <li><a href="https://github.com/E6WeB/htmlstatic/issues" target="_blank" rel="noopener noreferrer">Submit an Issue ${ICONS.external}</a></li>
            <li><a href="https://www.facebook.com/groups/dynamicwebsites" target="_blank" rel="noopener noreferrer">Dynamic Websites Group ${ICONS.external}</a></li>
            <li><a href="https://www.facebook.com/groups/staticshark" target="_blank" rel="noopener noreferrer">StaticStack Official Group ${ICONS.external}</a></li>
            <li><a href="https://wasmer.io" target="_blank" rel="noopener noreferrer">Hosted by Wasmer.io ${ICONS.external}</a></li>
            <li><a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 1.0 Public Domain</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; <span id="year">2026</span> StaticStack. Hosted by: <a href="https://wasmer.io" target="_blank" rel="noopener noreferrer">wasmer.io</a> &middot; Created by: <a href="https://www.e6web.com/contact/" target="_blank" rel="noopener">E6WeB</a> &middot; <span class="footer-statcounter" title="Total Site Visitors"><!-- Default Statcounter code for StaticStacks https://www.staticstack.app/ --><script type="text/javascript">
var sc_project=13364370; 
var sc_invisible=0; 
var sc_security="cae7fdd5"; 
var scJsHost = "https://";
document.write("<sc"+"ript type='text/javascript' src='" + scJsHost+
"statcounter.com/counter/counter.js'></"+"script>");
</script><noscript><span class="statcounter"><img class="statcounter" src="https://c.statcounter.com/13364370/0/cae7fdd5/0/" alt="Web Analytics" referrerPolicy="no-referrer-when-downgrade"></span></noscript><!-- End of Statcounter Code --></span></p>
      </div>
    </div>
  </footer>

  <!-- Floating Back to Top Button -->
  <button id="back-to-top" class="back-to-top-btn" aria-label="Back to top" title="Back to top" onclick="scrollToTop()">
    <span class="btt-icon">${ICONS.arrowUp}</span>
    <span>Back to Top</span>
  </button>

  <script>
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

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

