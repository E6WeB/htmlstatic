// ==========================================================================
// Shared Layout, Mini Hero, and Breadcrumb Templates
// ==========================================================================

const fs = require('fs');
const path = require('path');
const { ICONS, escapeHtml } = require('../data/icons');
const { renderNavRail } = require('./components/left-nav-rail');
const { renderSiteHeader } = require('./components/site-header');
const { renderMobileBottomNav, renderMobileNavModal } = require('./components/mobile-nav');
const { renderPreFooterCta, renderSiteFooter } = require('./components/site-footer');

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
    totalViews,
    extraHeadHtml = '',
    extraBodyBottomHtml = ''
  }) {
    const siteViews = totalViews !== undefined ? Number(totalViews) : getTotalToolViews();
    const siteViewsFormatted = Number(siteViews || 0).toLocaleString();
    const rawDesc = description || 'StaticStack - A community-curated collection of tools, services, and resources for static websites with zero backend servers.';
    const cleanDescription = rawDesc.length > 160 ? rawDesc.slice(0, 157).replace(/\s+\S*$/, '') + '...' : rawDesc;
    const cleanKeywords = keywords || 'static websites, jamstack, static site generators, zero backend, serverless apis, html css javascript tools, astro, hugo, 11ty, nextjs, free static hosting, headless cms, static form backend, open source web tools';
    let pageTitle = title.includes('StaticStack') ? title : (title.length > 50 ? title : `${title} | StaticStack`);
    if (pageTitle.length > 70) {
      if (title.length <= 70) {
        pageTitle = title;
      } else {
        pageTitle = title.slice(0, 67).replace(/\s+\S*$/, '') + '...';
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
      else if (currentNav === 'stack') pageUrl = 'https://www.staticstack.app/stack/';
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
  <link rel="alternate" type="application/rss+xml" title="StaticStack RSS Feed" href="https://www.staticstack.app/feed.xml">
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
  ${extraHeadHtml}

  <!-- Local StaticStack Appreciation / Like Button -->
  <script defer src="/asset/js/likes.js?v=1"></script>
  <script defer src="/asset/js/stack.js?v=1"></script>
</head>
<body>

  ${renderNavRail({ currentNav, totalToolsCount: allTools.length, rootPath })}

  ${renderMobileBottomNav({ currentNav, rootPath })}

  ${renderSiteHeader({ currentNav, rootPath })}

  ${renderMobileNavModal({ currentNav, totalToolsCount: allTools.length, rootPath })}

  ${miniHeroHtml || breadcrumbFallbackHtml}

  <main class="site-main container">
    ${content}
  </main>

  ${showPreFooter ? renderPreFooterCta({ rootPath }) : ''}

  ${showFooter ? renderSiteFooter({ allTools, categories, rootPath, siteViewsFormatted }) : ''}

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

  <!-- StaticStack StackBot -->
  <link rel="stylesheet" href="/asset/css/stackbot.css?v=5">
  <script src="/asset/js/stackbot.js?v=8" defer></script>
  ${extraBodyBottomHtml}
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
  createLayoutRenderer,
  renderNavRail,
  renderSiteHeader,
  renderMobileBottomNav,
  renderMobileNavModal,
  renderPreFooterCta,
  renderSiteFooter
};

