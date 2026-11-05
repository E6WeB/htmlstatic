/**
 * Unified HTML Site Generator
 * Generates standalone, zero-dependency HTML pages using pure native system typography:
 * - index.html (Home)
 * - archive/index.html (Master Archive with wider 320px sidebar)
 * - submit/index.html (Submit a Tool)
 * - contribute/index.html (Contributing Guide)
 * - thankyou/index.html (Thank You & Credits)
 * - tools/<category>/<tool>.html (Dedicated page for all tools!)
 *
 * Modularized architecture:
 * - src/data/icons.js        -> SVG icons, category icons, HTML escaping & badge/tag parsers
 * - src/data/parse-readme.js -> README parser, local tool icon resolver & random tool selector
 * - src/styles/base-css.js   -> Global system-font CSS & minifier (/asset/css/style.css)
 * - src/templates/layout.js  -> Shared layout, breadcrumbs & mini-hero templates
 * - src/templates/tool-page.js -> Dedicated tool documentation page template
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const {
  ICONS,
  CATEGORY_ICONS,
  escapeHtml
} = require('./src/data/icons');
const { loadCatalog } = require('./src/data/parse-readme');
const { getMinifiedBaseCss } = require('./src/styles/base-css');
const { createLayoutRenderer } = require('./src/templates/layout');
const { renderToolPage } = require('./src/templates/tool-page');
const { renderCategoryPage } = require('./src/templates/category-page');

marked.setOptions({
  gfm: true,
  breaks: false
});

marked.use({
  renderer: {
    heading({ tokens, depth, text }) {
      const parsedText = this.parser.parseInline(tokens);
      const cleanText = text.replace(/<[^>]*>/g, '');
      const slugGfm = cleanText.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
      const slugLiteral = cleanText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s/g, '-');
      const slugNoParens = cleanText.toLowerCase().replace(/\s*\([^)]*\)/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

      let extraAnchors = '';
      if (slugLiteral && slugLiteral !== slugGfm) {
        extraAnchors += `<span id="${slugLiteral}" class="heading-anchor-target"></span>`;
      }
      if (slugNoParens && slugNoParens !== slugGfm && slugNoParens !== slugLiteral) {
        extraAnchors += `<span id="${slugNoParens}" class="heading-anchor-target"></span>`;
      }

      return `<h${depth} id="${slugGfm}">${extraAnchors}${parsedText}</h${depth}>\n`;
    }
  }
});

const ROOT_DIR = __dirname;
const ASSET_DIR = path.join(ROOT_DIR, 'asset');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 0. Parse README catalog & export tools-data.json + style.css
const {
  categories,
  allTools,
  uniqueToolsCount,
  getToolSiteIcon,
  getRandomTools,
  toolsData
} = loadCatalog(ROOT_DIR);

console.log(`Parsed ${categories.length} categories and ${allTools.length} tools.`);

ensureDir(path.join(ASSET_DIR, 'json'));
fs.writeFileSync(path.join(ASSET_DIR, 'json', 'tools-data.json'), JSON.stringify(toolsData));

ensureDir(path.join(ASSET_DIR, 'css'));
fs.writeFileSync(path.join(ASSET_DIR, 'css', 'style.css'), getMinifiedBaseCss() + '\n');

const renderLayout = createLayoutRenderer({ allTools, categories });

// ==========================================================================
// 1. Generate index.html (Home Page)
// ==========================================================================
console.log('🏠 Generating Home Page (index.html)...');

// Load current view counts from tool-views-cache.json to pick top 4 tools
let cachedViewsMap = {};
const toolViewsJsonPath = path.join(ASSET_DIR, 'json', 'tool-views-cache.json');
try {
  if (fs.existsSync(toolViewsJsonPath)) {
    cachedViewsMap = JSON.parse(fs.readFileSync(toolViewsJsonPath, 'utf8'));
  }
} catch (e) {}

const topToolsList = allTools.map(tool => {
  const key = `htmlstatic-${tool.categorySlug}-${tool.slug}`;
  const views = Number(cachedViewsMap[key]) || 0;
  return {
    ...tool,
    key,
    views
  };
}).sort((a, b) => b.views - a.views).slice(0, 4);

const homeTopToolsHtml = topToolsList.map(t => {
  let badgeClass = 'badge-freemium';
  const pBadge = (t.primaryBadge || '').toLowerCase();
  if (pBadge.includes('open source')) {
    badgeClass = 'badge-open-source';
  } else if (pBadge.includes('freemium')) {
    badgeClass = 'badge-freemium';
  } else if (pBadge.includes('free')) {
    badgeClass = 'badge-free';
  } else if (pBadge.includes('paid')) {
    badgeClass = 'badge-paid';
  }

  const coverUrl = `tools/${t.categorySlug}/${t.slug}-cover.webp`;
  const toolPageUrl = `tools/${t.categorySlug}/${t.slug}`;
  const toolSlugPath = `/tools/${t.categorySlug}/${t.slug}`;

  return `
    <a href="${toolPageUrl}" class="home-top-tool-card" data-slug="${toolSlugPath}" data-key="${t.key}" title="Explore ${escapeHtml(t.name)}">
      <div class="home-top-tool-cover-wrap">
        <img src="${coverUrl}" alt="${escapeHtml(t.name)} preview screenshot" width="640" height="360" loading="lazy" decoding="async">
        <span class="home-top-tool-cat-pill">${escapeHtml(t.categoryTitle)}</span>
      </div>
      <div class="home-top-tool-body">
        <div class="home-top-tool-header">
          <div class="home-top-tool-title-wrap">
            <span class="home-top-tool-icon">${getToolSiteIcon(t, 22)}</span>
            <h3 class="home-top-tool-title">${escapeHtml(t.name)}</h3>
          </div>
          <span class="badge ${badgeClass}" style="font-size:0.675rem; padding:0.12rem 0.45rem;">${escapeHtml(t.primaryBadge)}</span>
        </div>
        <p class="home-top-tool-desc">${escapeHtml(t.tagline || t.description)}</p>
        <div class="home-top-tool-footer">
          <div class="home-top-tool-stats">
            <span class="home-stat-pill" title="Total Views">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span class="home-top-tool-views-val">${t.views}</span> views
            </span>
            <span class="home-stat-pill home-stat-pill-likes" title="Community Likes">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span class="home-top-tool-likes-val" data-likes-slug="${toolSlugPath}">0</span> likes
            </span>
          </div>
          <span class="home-top-tool-arrow">${ICONS.arrowRight}</span>
        </div>
      </div>
    </a>
  `;
}).join('');

const homeContent = `
  <section class="hero" style="text-align:center; padding: 4rem 0 3rem;">
    <div style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.35rem 0.9rem; background:var(--accent-light); color:var(--accent); border:1px solid var(--border-color); border-radius:var(--radius-full); font-size:0.85rem; font-weight:600; margin-bottom:1.5rem;">
      ${ICONS.sparkles} 100% Jamstack • Zero Backend Servers Required
    </div>
    <h1 style="font-size:clamp(2.2rem, 5vw, 3.5rem); font-weight:800; line-height:1.15; letter-spacing:-0.03em; margin-bottom:1.25rem;">
      Empower Static Websites with <span style="background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Zero Backend Servers</span>
    </h1>
    <p style="font-size:clamp(1.05rem, 2vw, 1.25rem); color:var(--text-muted); max-width:740px; margin:0 auto 2rem; line-height:1.6;">
      You don't need WordPress, a monolithic CMS, or expensive cloud servers. Discover ${uniqueToolsCount}+ curated tools, services, and APIs for building modern static sites with HTML, CSS, and JavaScript.
    </p>

    <!-- Command Hero Search Hub -->
    <div style="max-width:780px; margin:0 auto 2.5rem;">
      <div class="hero-search-box" style="display:flex; align-items:center; background:var(--bg-surface); border:2px solid var(--border-color); border-radius:var(--radius-full); padding:0.5rem 0.6rem 0.5rem 1.35rem; box-shadow:0 12px 28px -6px rgba(0,0,0,0.09); gap:0.65rem;">
        <span style="color:var(--accent); display:flex; align-items:center;">${ICONS.search}</span>
        <input type="text" id="hero-search-input" style="flex:1; min-width:0; border:none; background:transparent; outline:none; font-size:1.125rem; font-family:inherit; color:var(--text-main); padding:0.55rem 0.35rem;" placeholder="Search ${uniqueToolsCount}+ static tools, APIs, forms, auth..." autocomplete="off">
        <span class="hero-kbd" style="background:var(--bg-muted); border:1px solid var(--border-color); padding:0.2rem 0.55rem; border-radius:4px; font-size:0.8rem; font-family:var(--font-mono); color:var(--text-subtle);">/</span>
        <button type="button" onclick="submitHeroSearch()" class="btn btn-primary" style="border-radius:var(--radius-full); padding:0.65rem 1.45rem; font-size:0.95rem; flex-shrink:0;">
          Search
        </button>
      </div>
      <div id="hero-popular-tags" style="display:flex; align-items:center; justify-content:center; gap:0.9rem; flex-wrap:wrap; margin-top:1.1rem; font-size:0.9rem;">
        <span style="color:var(--accent); font-weight:600;">Popular:</span>
        <a href="tools/payments-ecommerce/reflow" style="color:var(--text-muted); font-weight:500; text-decoration:none;">Reflow</a>
        <a href="tools/authentication-users/clerk" style="color:var(--text-muted); font-weight:500; text-decoration:none;">Clerk</a>
        <a href="tools/search/pagefind" style="color:var(--text-muted); font-weight:500; text-decoration:none;">Pagefind</a>
        <a href="tools/static-site-generators/astro" style="color:var(--text-muted); font-weight:500; text-decoration:none;">Astro</a>
        <a href="tools/contact-forms/formspree" style="color:var(--text-muted); font-weight:500; text-decoration:none;">Formspree</a>
        <a href="tools/database-storage/supabase" style="color:var(--text-muted); font-weight:500; text-decoration:none;">Supabase</a>
      </div>
    </div>

    <div style="display:flex; align-items:center; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:3.5rem;">
      <a href="archive" class="btn btn-primary">
        Browse Master Archive ${ICONS.arrowRight}
      </a>
      <a href="#categories" class="btn btn-secondary">
        Browse ${categories.length} Categories
      </a>
      <a href="community/" class="btn btn-secondary">
        ${ICONS.comments} Community Forum
      </a>
      <a href="submit" class="btn btn-secondary">
        Submit a Tool
      </a>
    </div>

    <div class="hero-stats-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:1.25rem; max-width:1040px; margin:0 auto; padding:1.75rem 2rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); box-shadow:var(--shadow-card); text-align:center;">
      <div>
        <div style="font-size:2rem; font-weight:800; color:var(--accent); margin-bottom:0.25rem;">${categories.length}</div>
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">Curated Categories</div>
      </div>
      <div>
        <div style="font-size:2rem; font-weight:800; color:var(--accent); margin-bottom:0.25rem;">${uniqueToolsCount}</div>
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">Hand-Picked Tools</div>
      </div>
      <div title="Total community thumbs-up appreciations across all tools on StaticStack">
        <div style="font-size:2rem; font-weight:800; color:var(--accent); margin-bottom:0.25rem; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color:var(--accent); vertical-align:middle;"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
          <span id="hero-total-likes">0</span>
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">Community Likes</div>
      </div>
      <div>
        <div style="font-size:2rem; font-weight:800; color:var(--accent); margin-bottom:0.25rem;">0%</div>
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">Server Maintenance</div>
      </div>
      <div>
        <div style="font-size:2rem; font-weight:800; color:var(--accent); margin-bottom:0.25rem;">100%</div>
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">Free &amp; Open Source</div>
      </div>
    </div>
  </section>

  <!-- Top 4 Viewed Tools Section -->
  <section id="top-tools" style="padding: 3.5rem 0 1.25rem;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.75rem; gap:1rem; flex-wrap:wrap;">
      <div>
        <div style="display:inline-flex; align-items:center; gap:0.45rem; padding:0.25rem 0.75rem; background:rgba(37, 99, 235, 0.08); color:var(--accent); border:1px solid rgba(37, 99, 235, 0.2); border-radius:var(--radius-full); font-size:0.775rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.75rem;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>Community Favorites</span>
        </div>
        <h2 style="font-size:clamp(1.65rem, 3vw, 2.15rem); font-weight:800; letter-spacing:-0.02em; margin-bottom:0.35rem; color:var(--text-main);">
          Top Viewed Tools
        </h2>
        <p style="color:var(--text-muted); font-size:0.975rem; margin:0;">
          The most popular and explored tools across the static web ecosystem.
        </p>
      </div>
      <a href="archive" class="btn btn-secondary" style="font-size:0.85rem;">
        View Master Archive &rarr;
      </a>
    </div>

    <div class="home-top-tools-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.35rem;">
      ${homeTopToolsHtml}
    </div>
  </section>

  <!-- Categories Grid -->
  <section id="categories" style="padding: 3rem 0;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; gap:1rem; flex-wrap:wrap;">
      <div>
        <h2 style="font-size:1.85rem; font-weight:800; margin-bottom:0.35rem;">Explore by Category</h2>
        <p style="color:var(--text-muted); font-size:1rem;">Jump to any category or view all tools in the master archive.</p>
      </div>
      <a href="archive" class="btn btn-secondary" style="font-size:0.85rem;">View Full Archive →</a>
    </div>

    <div id="category-cards-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(270px, 1fr)); gap:1.25rem;">
      ${categories.map(cat => {
        const icon = CATEGORY_ICONS[cat.slug] || ICONS.zap;
        const visibleWords = new Set((cat.title + ' ' + cat.description).toLowerCase().split(/\s+/).filter(Boolean));
        const extraWords = Array.from(new Set(
          cat.tools.map(t => t.name + ' ' + (t.tags || []).slice(0, 3).join(' ').replace(/-/g, ' ')).join(' ').toLowerCase().split(/\s+/).filter(w => w && !visibleWords.has(w))
        )).join(' ');
        return `
        <a href="/category/${cat.slug}/" class="category-card" data-search="${escapeHtml(extraWords)}">
          <div class="category-card-head">
            <div class="category-card-icon">${icon}</div>
            <h3 class="category-card-title">${escapeHtml(cat.title)}</h3>
          </div>
          <p class="category-card-desc">${escapeHtml(cat.description)}</p>
          <div class="category-card-foot">
            <span>Explore Category &rarr;</span>
            <span class="category-card-count">Tools: <strong>${cat.tools.length}</strong></span>
          </div>
        </a>`;
      }).join('')}

      <div id="home-no-categories" style="display:none; grid-column:1/-1; text-align:center; padding:3rem 1.5rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg);">
        <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:0.5rem;">No matching categories on home page</h3>
        <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.25rem;">Try searching the Master Archive directly for all ${uniqueToolsCount} tools, APIs, and services.</p>
        <button type="button" onclick="submitHeroSearch()" class="btn btn-primary">Search in Master Archive</button>
      </div>
    </div>
  </section>

  <!-- Community Forum Section -->
  <section id="community-forum" style="padding: 3.5rem 0 1.5rem;">
    <div class="community-forum-card" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: clamp(1.75rem, 4vw, 3rem); box-shadow: var(--shadow-card); position: relative; overflow: hidden;">
      <!-- Subtle Ambient Gradient -->
      <div style="position: absolute; top: -50px; right: -50px; width: 450px; height: 450px; background: radial-gradient(circle, var(--accent-light) 0%, transparent 70%); pointer-events: none; opacity: 0.85;"></div>

      <div style="position: relative; z-index: 1;">
        <!-- Header Row -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; flex-wrap: wrap; margin-bottom: 2.25rem;">
          <div style="max-width: 680px;">
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.85rem; background: var(--accent-light); color: var(--accent); border: 1px solid var(--accent-border); border-radius: var(--radius-full); font-size: 0.825rem; font-weight: 600; margin-bottom: 1rem;">
              <span style="display: inline-flex; align-items: center;">${ICONS.comments}</span>
              <span>Community Forum</span>
              <span class="status-dot" style="margin-left: 0.25rem;"></span>
            </div>
            <h2 style="font-size: clamp(1.85rem, 3.5vw, 2.35rem); font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 0.85rem; color: var(--text-main);">
              Join the Static Web &amp; Jamstack Discussion
            </h2>
            <p style="font-size: clamp(0.95rem, 1.8vw, 1.1rem); color: var(--text-muted); line-height: 1.6; margin: 0;">
              Connect with fellow developers building high-performance static websites without server bloat. Share tools, showcase projects, get help with HTML, CSS &amp; JavaScript, and collaborate with the community.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; min-width: 220px;">
            <a href="community/" class="btn btn-primary" style="padding: 0.75rem 1.4rem; font-size: 0.95rem; font-weight: 600; justify-content: center; box-shadow: 0 4px 12px rgba(37,99,235,0.25);">
              ${ICONS.comments}
              <span>Visit Community Forum</span>
              ${ICONS.arrowRight}
            </a>
            <a href="community/?category=showcase" class="btn btn-secondary" style="padding: 0.65rem 1.25rem; font-size: 0.9rem; justify-content: center;">
              ${ICONS.rocket}
              <span>Explore Showcases</span>
            </a>
          </div>
        </div>

        <!-- Channels Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <a href="community/?category=showcase" class="community-channel-card" style="background: var(--bg-body); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; text-decoration: none; color: var(--text-main); transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-sm); background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center;">
                ${ICONS.rocket}
              </div>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--accent); display: flex; align-items: center; gap: 0.25rem;">
                Browse &rarr;
              </span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-main);">Show &amp; Tell</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0; flex-grow: 1;">
              Show off your static sites, portfolio builds, and custom Jamstack architectures.
            </p>
          </a>

          <a href="community/?category=help" class="community-channel-card" style="background: var(--bg-body); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; text-decoration: none; color: var(--text-main); transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-sm); background: #dbeafe; color: #1d4ed8; display: flex; align-items: center; justify-content: center;">
                ${ICONS.helpCircle}
              </div>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--accent); display: flex; align-items: center; gap: 0.25rem;">
                Browse &rarr;
              </span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-main);">Help &amp; Questions</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0; flex-grow: 1;">
              Ask troubleshooting questions on HTML, CSS, JavaScript, SSGs, forms, or APIs.
            </p>
          </a>

          <a href="community/?category=tools" class="community-channel-card" style="background: var(--bg-body); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; text-decoration: none; color: var(--text-main); transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-sm); background: #dcfce7; color: #15803d; display: flex; align-items: center; justify-content: center;">
                ${ICONS.zap}
              </div>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--accent); display: flex; align-items: center; gap: 0.25rem;">
                Browse &rarr;
              </span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-main);">Tools &amp; Components</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0; flex-grow: 1;">
              Share and discover open-source scripts, CSS libraries, client-side APIs, and micro-tools.
            </p>
          </a>

          <a href="community/?category=discussion" class="community-channel-card" style="background: var(--bg-body); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; text-decoration: none; color: var(--text-main); transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-sm); background: #ede9fe; color: #6d28d9; display: flex; align-items: center; justify-content: center;">
                ${ICONS.comments}
              </div>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--accent); display: flex; align-items: center; gap: 0.25rem;">
                Browse &rarr;
              </span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-main);">General Discussion</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0; flex-grow: 1;">
              Discuss static web trends, zero-backend philosophy, performance, and best practices.
            </p>
          </a>

          <a href="community/?category=support" class="community-channel-card" style="background: var(--bg-body); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; text-decoration: none; color: var(--text-main); transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="width: 2.25rem; height: 2.25rem; border-radius: var(--radius-sm); background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center;">
                ${ICONS.lifeBuoy}
              </div>
              <span style="font-size: 0.75rem; font-weight: 600; color: var(--accent); display: flex; align-items: center; gap: 0.25rem;">
                Browse &rarr;
              </span>
            </div>
            <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-main);">StaticStack Support</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0; flex-grow: 1;">
              Question and answer only about the StaticStack website.
            </p>
          </a>
        </div>

        <!-- Forum Pillars / Trust Badges -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; padding-top: 1.5rem; border-top: 1px solid var(--border-color); font-size: 0.85rem; color: var(--text-muted);">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: var(--accent); display: inline-flex;">${ICONS.shield}</span>
            <span><strong>GitHub OAuth:</strong> Fast, 1-click sign-in without extra passwords</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: #10b981; display: inline-flex;">${ICONS.thumbsUp}</span>
            <span><strong>Community Votes:</strong> Upvote helpful replies &amp; curated discussions</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: #8b5cf6; display: inline-flex;">${ICONS.sparkles}</span>
            <span><strong>Zero Backend Bloat:</strong> Pure HTML/JS on Wasmer Edge &amp; PostgreSQL</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <script>
    const heroSearchInput = document.getElementById('hero-search-input');

    function searchHomeCategories(query) {
      const q = query.trim().toLowerCase();
      const qWords = q.split(/[\\s\\-]+/).filter(Boolean);
      const categoryCards = document.querySelectorAll('.category-card');
      let visibleCount = 0;
      categoryCards.forEach(card => {
        const text = (card.getAttribute('data-search') || '') + ' ' + card.textContent.toLowerCase();
        const matches = qWords.length === 0 || qWords.every(w => text.includes(w));
        if (matches) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      const noResults = document.getElementById('home-no-categories');
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    function submitHeroSearch() {
      const val = heroSearchInput ? heroSearchInput.value.trim() : '';
      if (val) {
        window.location.href = 'archive?q=' + encodeURIComponent(val);
      } else {
        window.location.href = 'archive';
      }
    }

    if (heroSearchInput) {
      heroSearchInput.addEventListener('input', e => {
        searchHomeCategories(e.target.value);
      });
      heroSearchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          submitHeroSearch();
        }
      });
    }

    function quickSearchTag(tag) {
      window.location.href = 'archive?q=' + encodeURIComponent(tag);
    }

    document.addEventListener('keydown', e => {
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== heroSearchInput) {
        e.preventDefault();
        if (heroSearchInput) heroSearchInput.focus();
      }
    });

    // Fetch and aggregate live iine thumbs-up count across all tools
    (function initHeroTotalLikes() {
      const counterEl = document.getElementById('hero-total-likes');
      if (!counterEl) return;

      const cached = sessionStorage.getItem('staticstack_total_likes');
      if (cached !== null) {
        counterEl.textContent = cached;
      }

      function animateCounter(el, target) {
        if (target <= 0) { el.textContent = '0'; return; }
        const start = parseInt(el.textContent, 10) || 0;
        if (start === target) return;
        const duration = 600;
        const startTime = performance.now();
        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - (1 - progress) * (1 - progress);
          const current = Math.floor(start + (target - start) * ease);
          el.textContent = current.toLocaleString();
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target.toLocaleString();
          }
        }
        requestAnimationFrame(step);
      }

      const SUPABASE_URL = 'https://vhiweeypifbwacashxjz.supabase.co';
      const SUPABASE_KEY = 'sb_publishable_EoB7MFJhCmb6PiAk-GPJ4w_PGhQ44Ru';
      const toolMeta = ${JSON.stringify(allTools.map(t => ({ s: `/tools/${t.categorySlug}/${t.slug}`, n: t.name })))};
      const slugs = toolMeta.map(t => t.s);
      const defaultPopularNames = ['Reflow', 'Clerk', 'Pagefind', 'Astro', 'Formspree', 'Supabase'];

      // Escape helper for client-side rendering
      function escapeClientHtml(str) {
        return String(str || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function renderPopularTags(likesMap) {
        const popularContainer = document.getElementById('hero-popular-tags');
        if (!popularContainer || !likesMap) return;

        const votedTools = toolMeta
          .map(t => ({ name: t.n, slug: t.s, likes: Number(likesMap[t.s]) || 0 }))
          .filter(t => t.likes > 0)
          .sort((a, b) => (b.likes !== a.likes ? b.likes - a.likes : a.name.localeCompare(b.name)));

        const topList = votedTools.slice(0, 6);
        const usedNames = new Set(topList.map(t => t.name.toLowerCase()));

        for (let i = 0; i < defaultPopularNames.length && topList.length < 6; i++) {
          const fallbackName = defaultPopularNames[i];
          if (!usedNames.has(fallbackName.toLowerCase())) {
            const foundMeta = toolMeta.find(t => t.n.toLowerCase() === fallbackName.toLowerCase());
            usedNames.add(fallbackName.toLowerCase());
            topList.push({
              name: fallbackName,
              slug: foundMeta ? foundMeta.s : ('/archive?q=' + encodeURIComponent(fallbackName)),
              likes: 0
            });
          }
        }

        const linksHtml = topList.map(item => {
          const safeName = escapeClientHtml(item.name);
          const rawSlug = item.slug || '';
          const href = rawSlug.charAt(0) === '/' ? rawSlug.slice(1) : rawSlug;
          const label = item.likes > 0
            ? safeName + '(<span style="color:var(--accent); font-weight:700;">' + item.likes.toLocaleString() + '</span>)'
            : safeName;
          return '<a href="' + href + '" style="color:var(--text-muted); font-weight:500; text-decoration:none;">' + label + '</a>';
        }).join('');

        popularContainer.innerHTML = '<span style="color:var(--accent); font-weight:600;">Popular:</span>' + linksHtml;
      }

      try {
        const cachedLikesMap = sessionStorage.getItem('staticstack_tool_likes_map');
        if (cachedLikesMap) {
          const parsedMap = JSON.parse(cachedLikesMap);
          window.__staticstack_tool_likes = parsedMap;
          renderPopularTags(parsedMap);
        }
      } catch (e) {}

      const batches = [];
      for (let i = 0; i < slugs.length; i += 20) {
        batches.push(slugs.slice(i, i + 20));
      }

      Promise.all(batches.map(batch =>
        fetch(SUPABASE_URL + '/rest/v1/rpc/get_hits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY
          },
          body: JSON.stringify({ page_slugs: batch })
        }).then(r => r.ok ? r.json() : {})
      ))
      .then(results => {
        let total = 0;
        window.__staticstack_tool_likes = window.__staticstack_tool_likes || {};
        results.forEach(res => {
          if (res && typeof res === 'object') {
            for (const k in res) {
              const count = Number(res[k]) || 0;
              total += count;
              window.__staticstack_tool_likes[k] = count;
              const likeEl = document.querySelector('[data-likes-slug="' + k + '"]');
              if (likeEl) {
                likeEl.textContent = count.toLocaleString();
              }
            }
          }
        });
        animateCounter(counterEl, total);
        sessionStorage.setItem('staticstack_total_likes', total);
        try {
          sessionStorage.setItem('staticstack_tool_likes_map', JSON.stringify(window.__staticstack_tool_likes));
        } catch (e) {}
        renderPopularTags(window.__staticstack_tool_likes);
      })
      .catch(err => {
        console.warn('Could not refresh live total likes:', err);
      });

      // Fetch and render Top Viewed Tools dynamically
      function refreshHomeTopTools() {
        const grid = document.querySelector('.home-top-tools-grid');
        if (!grid) return;

        const endpoints = ['/community/api?action=top-tools', '/api/top-tools'];
        function tryFetchTop(index) {
          if (index >= endpoints.length) return Promise.reject(new Error('Endpoints failed'));
          return fetch(endpoints[index])
            .then(r => {
              if (!r.ok) throw new Error('Status ' + r.status);
              return r.json();
            })
            .catch(() => tryFetchTop(index + 1));
        }

        tryFetchTop(0)
          .then(data => {
            if (!data || !Array.isArray(data.top_tools) || !data.top_tools.length) return;
            const top4 = data.top_tools.slice(0, 4);

            grid.innerHTML = top4.map(t => {
              const url = t.url.startsWith('/') ? t.url.slice(1) : t.url;
              const slugPath = t.url.startsWith('/') ? t.url : '/' + t.url;
              const pBadge = t.primaryBadge || 'Free';
              const badgeClass = t.badgeClass || (
                pBadge.toLowerCase().includes('open source') ? 'badge-open-source' :
                pBadge.toLowerCase().includes('freemium') ? 'badge-freemium' :
                pBadge.toLowerCase().includes('free') ? 'badge-free' :
                pBadge.toLowerCase().includes('paid') ? 'badge-paid' : 'badge-freemium'
              );
              const viewsNum = Number(t.views || 0);
              const viewsFormatted = viewsNum.toLocaleString();
              const coverUrl = 'tools/' + t.categorySlug + '/' + t.slug + '-cover.webp';
              const iconUrl = t.faviconUrl || ('/tools/' + t.categorySlug + '/' + t.slug + '-icon.webp');
              const iconImg = '<img src=\"' + iconUrl + '\" width=\"22\" height=\"22\" class=\"tool-siteicon\" alt=\"\" loading=\"lazy\" decoding=\"async\" aria-hidden=\"true\" style=\"border-radius:4px; vertical-align:middle; flex-shrink:0; object-fit:contain;\">';

              const desc = t.desc || t.description || '';

              return '<a href=\"' + url + '\" class=\"home-top-tool-card\" data-slug=\"' + slugPath + '\" data-key=\"' + t.key + '\" title=\"Explore ' + escapeClientHtml(t.name) + '\">' +
                '<div class=\"home-top-tool-cover-wrap\">' +
                  '<img src=\"' + coverUrl + '\" alt=\"' + escapeClientHtml(t.name) + ' preview screenshot\" width=\"640\" height=\"360\" loading=\"lazy\" decoding=\"async\">' +
                  '<span class=\"home-top-tool-cat-pill\">' + escapeClientHtml(t.categoryTitle || '') + '</span>' +
                '</div>' +
                '<div class=\"home-top-tool-body\">' +
                  '<div class=\"home-top-tool-header\">' +
                    '<div class=\"home-top-tool-title-wrap\">' +
                      '<span class=\"home-top-tool-icon\">' + iconImg + '</span>' +
                      '<h3 class=\"home-top-tool-title\">' + escapeClientHtml(t.name) + '</h3>' +
                    '</div>' +
                    '<span class=\"badge ' + badgeClass + '\" style=\"font-size:0.675rem; padding:0.12rem 0.45rem;\">' + escapeClientHtml(pBadge) + '</span>' +
                  '</div>' +
                  '<p class=\"home-top-tool-desc\">' + escapeClientHtml(desc) + '</p>' +
                  '<div class=\"home-top-tool-footer\">' +
                    '<div class=\"home-top-tool-stats\">' +
                      '<span class=\"home-stat-pill\" title=\"Total Views\">' +
                        '<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">' +
                          '<path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"></path>' +
                          '<circle cx=\"12\" cy=\"12\" r=\"3\"></circle>' +
                        '</svg>' +
                        '<span class=\"home-top-tool-views-val\">' + viewsFormatted + '</span> views' +
                      '</span>' +
                      '<span class=\"home-stat-pill home-stat-pill-likes\" title=\"Community Likes\">' +
                        '<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">' +
                          '<path d=\"M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3\"></path>' +
                        '</svg>' +
                        '<span class=\"home-top-tool-likes-val\" data-likes-slug=\"' + slugPath + '\">0</span> likes' +
                      '</span>' +
                    '</div>' +
                    '<span class=\"home-top-tool-arrow\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line><polyline points=\"12 5 19 12 12 19\"></polyline></svg></span>' +
                  '</div>' +
                '</div>' +
              '</a>';
            }).join('');

            // Re-apply any cached likes to newly rendered cards
            if (window.__staticstack_tool_likes) {
              for (const slug in window.__staticstack_tool_likes) {
                const el = document.querySelector('[data-likes-slug=\"' + slug + '\"]');
                if (el) el.textContent = window.__staticstack_tool_likes[slug].toLocaleString();
              }
            }
          })
          .catch(() => {
            // Fallback: hydrate existing view elements
            fetch('/community/api?action=tool-views')
              .then(r => r.ok ? r.json() : null)
              .then(data => {
                if (data && data.views) {
                  document.querySelectorAll('.home-top-tool-card').forEach(card => {
                    const key = card.getAttribute('data-key');
                    if (key && data.views[key] !== undefined) {
                      const vEl = card.querySelector('.home-top-tool-views-val');
                      if (vEl) vEl.textContent = Number(data.views[key]).toLocaleString();
                    }
                  });
                }
              })
              .catch(() => {});
          });
      }

      refreshHomeTopTools();

      // Refresh on bfcache page restore and visibility change
      window.addEventListener('pageshow', function() {
        refreshHomeTopTools();
      });
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
          refreshHomeTopTools();
        }
      });
    })();
  </script>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), renderLayout({
  title: 'StaticStack - Modern Tools & APIs for Static Websites',
  description: `Curated directory of ${uniqueToolsCount}+ tools, services, and APIs for building high-performance static websites with HTML, CSS, and JavaScript—zero backend servers required.`,
  currentNav: 'home',
  ogImage: 'https://www.staticstack.app/asset/img/og-home.webp',
  content: homeContent
}));

// ==========================================================================
// 2. Generate archive.html (Master Archive Page with Wider 320px Sidebar)
// ==========================================================================
console.log('📚 Generating Archive Page with wider sidebar (archive.html)...');

const initialArchiveTopTools = [
  {
    name: 'imgmov',
    slug: 'imgmov',
    categorySlug: 'ai-content-creation',
    tagline: 'AI generator for commercial product videos, images, and visual assets.',
    views: 12
  },
  {
    name: 'PhotoSwipe',
    slug: 'photoswipe',
    categorySlug: 'interactive-scripts',
    tagline: 'Lightweight JavaScript image gallery and lightbox with smooth zoom.',
    views: 3
  },
  {
    name: 'Umami',
    slug: 'umami',
    categorySlug: 'analytics-privacy',
    tagline: 'Simple, privacy-focused open-source analytics alternative.',
    views: 2
  },
  {
    name: 'Codeberg Pages',
    slug: 'codeberg-pages',
    categorySlug: 'hosting-deployment',
    tagline: 'Community-driven, privacy-respecting, and free static website hosting.',
    views: 2
  }
];

const archiveTopToolsHtml = initialArchiveTopTools.map(t => `
    <a href="/tools/${t.categorySlug}/${t.slug}" class="sidebar-tool-card" title="${escapeHtml(t.name)}">
      <span class="sidebar-tool-icon" style="display:inline-flex; align-items:center; justify-content:center;">
        ${getToolSiteIcon(t, 20)}
      </span>
      <div class="sidebar-tool-info">
        <div class="sidebar-tool-name">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px;">${escapeHtml(t.name)}</span>
          <span class="badge" style="font-size:0.65rem; padding:0.12rem 0.45rem; background:var(--accent-light); color:var(--accent); border:1px solid rgba(37,99,235,0.18); display:inline-flex; align-items:center; gap:0.25rem; font-variant-numeric:tabular-nums; font-weight:600; white-space:nowrap;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span>${t.views} views</span>
          </span>
        </div>
        <div class="sidebar-tool-desc">${escapeHtml(t.tagline)}</div>
      </div>
    </a>
`).join('');

const archiveContent = `
  <!-- Archive Layout -->
  <div class="archive-layout" style="padding-bottom: 4rem;">
    <!-- Sidebar Category Links & Tool Widgets -->
    <aside class="archive-sidebar">
      <!-- Category Widget -->
      <div class="sidebar-widget archive-categories-widget">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem; padding:0 0.5rem;">
          <span style="font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-subtle);">Categories (${categories.length})</span>
          <a href="javascript:void(0)" onclick="resetArchiveFilters()" style="font-size:0.75rem; color:var(--accent); font-weight:600; text-decoration:none;">Show All</a>
        </div>
        <ul id="archive-sidebar-list" class="archive-categories-list" style="list-style:none; display:flex; flex-direction:column; gap:0.25rem;">
          ${categories.map(c => `
            <li>
              <a href="#${c.slug}" class="archive-cat-link">
                <span class="archive-cat-icon"><svg width="18" height="18" viewBox="0 0 24 24"><use href="#ci-${c.slug}"/></svg></span>
                <span class="archive-cat-name">${escapeHtml(c.title)}</span>
                <span class="archive-cat-count">${c.tools.length}</span>
              </a>
            </li>`).join('')}
        </ul>
      </div>

      <!-- Static Site Hints & Tips Card -->
      <div class="sidebar-widget archive-sidebar-secondary">
        <div class="sidebar-widget-header">
          <span style="color:var(--accent); display:inline-flex; align-items:center;">${ICONS.sparkles}</span>
          <h4 class="sidebar-widget-title">Static Site Hints &amp; Tips</h4>
        </div>
        <div class="sidebar-widget-body">
          <div class="sidebar-tip-item">
            <span class="sidebar-tip-icon">${ICONS.tag}</span>
            <div>
              <strong style="color:var(--text-main); font-size:0.825rem; display:block;">Pricing &amp; License Structure</strong>
              <div style="font-size:0.8rem; line-height:1.45; margin-top:0.35rem; display:flex; flex-direction:column; gap:0.35rem;">
                <div><span class="badge badge-free" style="font-size:0.65rem; padding:0.1rem 0.35rem; margin-right:0.3rem;">Free</span> 100% free with no payment required.</div>
                <div><span class="badge badge-freemium" style="font-size:0.65rem; padding:0.1rem 0.35rem; margin-right:0.3rem;">Freemium</span> Free tier exists with paid plans/credits.</div>
                <div><span class="badge badge-paid" style="font-size:0.65rem; padding:0.1rem 0.35rem; margin-right:0.3rem;">Paid</span> Commercial only; no permanent free tier.</div>
                <div><span class="badge badge-open-source" style="font-size:0.65rem; padding:0.1rem 0.35rem; margin-right:0.3rem;">Open Source</span> Public code with verified license (MIT, Apache, etc.).</div>
                <div><span class="badge badge-free" style="font-size:0.65rem; padding:0.1rem 0.35rem; margin-right:0.3rem;">Free / Open Source</span> Free platform with open-source foundation.</div>
              </div>
            </div>
          </div>
          <div class="sidebar-tip-item">
            <span class="sidebar-tip-icon">${ICONS.check}</span>
            <div>
              <strong style="color:var(--text-main); font-size:0.825rem; display:block;">Zero Backend Required</strong>
              All tools here integrate directly into HTML/CSS/JS without hosting server runtimes or databases.
            </div>
          </div>
          <div class="sidebar-tip-item">
            <span class="sidebar-tip-icon">${ICONS.zap}</span>
            <div>
              <strong style="color:var(--text-main); font-size:0.825rem; display:block;">Async Performance</strong>
              Always use <code>async</code> or <code>defer</code> on widget scripts to keep page load times fast.
            </div>
          </div>
          <div class="sidebar-tip-item">
            <span class="sidebar-tip-icon">${ICONS.shield}</span>
            <div>
              <strong style="color:var(--text-main); font-size:0.825rem; display:block;">API Key Security</strong>
              Never commit secret tokens to static repositories. Use public client keys or edge proxies.
            </div>
          </div>
          <div class="sidebar-tip-item">
            <span class="sidebar-tip-icon">${ICONS.globe}</span>
            <div>
              <strong style="color:var(--text-main); font-size:0.825rem; display:block;">Host Anywhere</strong>
              Compatible with GitHub Pages, Cloudflare Pages, Netlify, Vercel, and Wasmer Edge.
            </div>
          </div>
        </div>
      </div>

      <!-- Top Viewed Tools Card -->
      <div class="sidebar-widget archive-sidebar-secondary" id="archive-top-tools-widget">
        <div class="sidebar-widget-header" style="justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="color:var(--accent); display:inline-flex; align-items:center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </span>
            <h4 class="sidebar-widget-title">Top Viewed Tools</h4>
          </div>
          <a href="#ai-content-creation" style="font-size:0.75rem; color:var(--accent); font-weight:600; text-decoration:none;">Explore All &rarr;</a>
        </div>
        <div id="archive-top-tools-list" class="sidebar-widget-body" style="display:flex; flex-direction:column; gap:0.4rem;">
          ${archiveTopToolsHtml}
        </div>
      </div>

      <!-- Submit Alternative Card -->
      <div class="sidebar-widget archive-sidebar-secondary" style="background:var(--bg-muted); border-style:dashed;">
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
          <span style="color:var(--accent); display:inline-flex;">${ICONS.plusCircle}</span>
          <strong style="font-size:0.875rem; color:var(--text-main);">Know a Great Tool?</strong>
        </div>
        <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin-bottom:0.85rem;">
          StaticStack is community curated. Share your favorite static web service or tool with the community.
        </p>
        <a href="/submit" class="btn btn-secondary" style="width:100%; font-size:0.825rem; padding:0.5rem 0.75rem;">
          Submit a Tool &rarr;
        </a>
      </div>

      <!-- Facebook Community Group Card -->
      <div class="sidebar-widget archive-sidebar-secondary">
        <div class="sidebar-widget-header">
          <span style="color:#1877f2; display:inline-flex; align-items:center;">${ICONS.facebook}</span>
          <h4 class="sidebar-widget-title">Facebook Community</h4>
        </div>
        <p style="font-size:0.825rem; color:var(--text-muted); line-height:1.5; margin-bottom:0.9rem;">
          Connect with fellow static site developers, discuss tools, and share projects in the Dynamic Websites and official StaticStack Facebook Groups.
        </p>
        <a href="https://www.facebook.com/groups/dynamicwebsites" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width:100%; font-size:0.85rem; padding:0.55rem 0.85rem; display:inline-flex; align-items:center; justify-content:center; gap:0.5rem;">
          <span style="color:#1877f2; display:inline-flex;">${ICONS.facebook}</span>
          <span>Dynamic Websites Group</span>
          ${ICONS.external}
        </a>
        <a href="https://www.facebook.com/groups/staticshark" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width:100%; font-size:0.85rem; padding:0.55rem 0.85rem; display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; margin-top:0.5rem;">
          <span style="color:#1877f2; display:inline-flex;">${ICONS.facebook}</span>
          <span>StaticStack Official Group</span>
          ${ICONS.external}
        </a>
      </div>
    </aside>

    <!-- Category Sections & Tool Tables -->
    <div class="archive-main">
      <svg style="display:none" aria-hidden="true">
        <symbol id="ico-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></symbol>
        <symbol id="ico-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></symbol>
        ${categories.map(c => {
          const rawSvg = CATEGORY_ICONS[c.slug] || ICONS.zap;
          const inner = rawSvg.replace(/^<svg[^>]*>|<\/svg>$/g, '');
          return `<symbol id="ci-${c.slug}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</symbol>`;
        }).join('')}
      </svg>
      <div id="archive-no-results" style="display:none; text-align:center; padding:3.5rem 2rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); margin-bottom:3rem; box-shadow:var(--shadow-card);">
        <div style="font-size:1.35rem; font-weight:700; margin-bottom:0.5rem;">No tools found</div>
        <p style="color:var(--text-muted); font-size:1rem; margin-bottom:1.5rem;">No tools match your current filter or search criteria.</p>
        <button class="btn btn-primary" onclick="resetArchiveFilters()">Reset Filters &amp; Show All ${uniqueToolsCount} Tools</button>
      </div>

      ${categories.map(cat => {
        return `
        <section id="${cat.slug}" class="archive-cat-section" data-cat="${cat.slug}">
          <div class="archive-cat-header" onclick="toggleArchiveCategory('${cat.slug}')" role="button" tabindex="0" aria-expanded="true" aria-controls="cat-body-${cat.slug}">
            <div class="archive-cat-header-main">
              <div class="archive-cat-toggle-btn">
                <span class="archive-cat-ico"><svg width="18" height="18" viewBox="0 0 24 24"><use href="#ci-${cat.slug}"/></svg></span>
                <h2 class="archive-cat-title">${escapeHtml(cat.title)}</h2>
                <span class="archive-cat-pill">${cat.tools.length} tools</span>
                <a href="/category/${cat.slug}/" class="archive-cat-hub-link" title="Open dedicated ${escapeHtml(cat.title)} landing page" onclick="event.stopPropagation()">Hub &rarr;</a>
              </div>
              <p class="archive-cat-desc">${escapeHtml(cat.description)}</p>
            </div>
            <span class="archive-cat-chevron" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24"><use href="#ico-chev"/></svg></span>
          </div>
          <div id="cat-body-${cat.slug}" class="archive-cat-body">
            <div class="archive-table-wrapper">
              <table class="archive-table">
                <thead>
                  <tr>
                    <th>Tool</th>
                    <th>Views</th>
                    <th>Description</th>
                    <th>Pricing</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  ${cat.tools.map(tool => {
                    const toolBadgesList = (tool.badges && tool.badges.length > 0) ? tool.badges : [tool.primaryBadge];
                    const badgesHtml = toolBadgesList.map(b => {
                      const lb = (b || '').toLowerCase();
                      let bClass = 'badge-freemium';
                      if (lb.includes('open source')) bClass = 'badge-open-source';
                      else if (lb.includes('beta')) bClass = 'badge-beta';
                      else if (lb.includes('freemium')) bClass = 'badge-freemium';
                      else if (lb.includes('free')) bClass = 'badge-free';
                      else if (lb.includes('paid')) bClass = 'badge-paid';
                      return `<span class="badge ${bClass}">${escapeHtml(b)}</span>`;
                    }).join(' ');
                    const rowVisibleWords = new Set((tool.name + ' ' + tool.description + ' ' + toolBadgesList.join(' ')).toLowerCase().split(/\s+/).filter(Boolean));
                    const extraSearchWords = Array.from(new Set(
                      (cat.title + ' ' + tool.slug + ' ' + (tool.websiteLabel || '') + ' ' + (tool.tags || []).join(' ').replace(/-/g, ' ')).toLowerCase().split(/\s+/).filter(w => w && !rowVisibleWords.has(w))
                    )).join(' ');

                    return `
                    <tr class="archive-row" data-search="${escapeHtml(extraSearchWords)}">
                      <td><a href="/tools/${tool.categorySlug}/${tool.slug}">${getToolSiteIcon(tool, 18)}${escapeHtml(tool.name)}</a></td>
                      <td><span class="tool-archive-views">--</span></td>
                      <td>${escapeHtml(tool.description)}</td>
                      <td>${badgesHtml}</td>
                      <td><a href="${tool.websiteUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">Link <svg width="14" height="14" viewBox="0 0 24 24"><use href="#ico-ext"/></svg></a></td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>`;
      }).join('')}
    </div>
  </div>

  <script>
    const archiveFilters = document.querySelectorAll('.archive-filter');
    const archiveRows = document.querySelectorAll('.archive-row');
    archiveRows.forEach(row => {
      const link = row.querySelector('a[href^="/tools/"]');
      const viewEl = row.querySelector('.tool-archive-views');
      if (link && viewEl && !viewEl.getAttribute('data-key')) {
        viewEl.setAttribute('data-key', 'htmlstatic-' + link.getAttribute('href').slice(7).replace('/', '-'));
      }
    });
    const archiveSections = document.querySelectorAll('.archive-cat-section');
    const archiveSearchInput = document.getElementById('archive-search-input');
    const archiveClearBtn = document.getElementById('archive-search-clear');
    const archiveCountEl = document.getElementById('archive-results-count');
    const archiveNoResultsEl = document.getElementById('archive-no-results');

    let currentFilter = 'all';
    let currentSearch = '';

    function toggleArchiveCategory(slug, forceState) {
      const sec = document.querySelector('.archive-cat-section[data-cat="' + slug + '"]');
      if (!sec) return;
      const isCurrentlyCollapsed = sec.classList.contains('is-collapsed');
      const shouldCollapse = typeof forceState === 'boolean' ? !forceState : !isCurrentlyCollapsed;
      sec.classList.toggle('is-collapsed', shouldCollapse);
      const btn = sec.querySelector('.archive-cat-header');
      if (btn) btn.setAttribute('aria-expanded', shouldCollapse ? 'false' : 'true');
    }

    function toggleAllArchiveCategories(expand) {
      document.querySelectorAll('.archive-cat-section').forEach(sec => {
        sec.classList.toggle('is-collapsed', !expand);
        const btn = sec.querySelector('.archive-cat-header');
        if (btn) btn.setAttribute('aria-expanded', expand ? 'true' : 'false');
      });
    }

    function applyArchiveFilter() {
      let count = 0;
      const q = currentSearch.trim().toLowerCase();
      const qWords = q.split(/[\\s\\-]+/).filter(Boolean);

      if (archiveClearBtn) {
        archiveClearBtn.style.display = q ? 'inline-flex' : 'none';
      }

      const hasActiveSearchOrFilter = qWords.length > 0 || currentFilter !== 'all';

      archiveSections.forEach(section => {
        let secMatches = 0;
        const rows = section.querySelectorAll('.archive-row');
        rows.forEach(row => {
          const badge = (row.cells[3] ? row.cells[3].textContent : '').toLowerCase();
          const searchTxt = (row.getAttribute('data-search') || '') + ' ' + row.textContent.toLowerCase();

          const matchFilter = currentFilter === 'all' || badge.includes(currentFilter.replace('-', ' '));
          const matchSearch = qWords.length === 0 || qWords.every(w => searchTxt.includes(w));

          if (matchFilter && matchSearch) {
            row.style.display = '';
            secMatches++;
            count++;
          } else {
            row.style.display = 'none';
          }
        });

        // Hide category section if 0 matches
        section.style.display = secMatches > 0 ? '' : 'none';

        // Auto-expand matching sections during search/filter so users immediately see their results
        if (hasActiveSearchOrFilter && secMatches > 0) {
          section.classList.remove('is-collapsed');
          const hdr = section.querySelector('.archive-cat-header');
          if (hdr) hdr.setAttribute('aria-expanded', 'true');
        }

        // Update sidebar item opacity without hiding it completely
        const secId = section.getAttribute('id');
        const sideLink = document.querySelector('.archive-cat-link[href="#' + secId + '"]');
        if (sideLink) {
          sideLink.style.opacity = secMatches > 0 ? '1' : '0.45';
        }
      });

      if (archiveNoResultsEl) {
        archiveNoResultsEl.style.display = count === 0 ? 'block' : 'none';
      }

      if (archiveCountEl) {
        if (q) {
          archiveCountEl.innerHTML = 'Showing ' + count + ' of ${uniqueToolsCount} tools matching &ldquo;<strong>' + q.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</strong>&rdquo; &bull; <a href="javascript:void(0)" onclick="clearArchiveSearch()" style="color:var(--accent); font-weight:600; text-decoration:underline;">Show all ${uniqueToolsCount} tools</a>';
        } else if (currentFilter !== 'all') {
          archiveCountEl.innerHTML = 'Showing ' + count + ' ' + currentFilter + ' tools &bull; <a href="javascript:void(0)" onclick="resetArchiveFilters()" style="color:var(--accent); font-weight:600; text-decoration:underline;">Show all ${uniqueToolsCount} tools</a>';
        } else {
          archiveCountEl.textContent = 'Showing all ${uniqueToolsCount} tools across ${categories.length} categories';
        }
      }
    }

    function clearArchiveSearch() {
      if (archiveSearchInput) archiveSearchInput.value = '';
      currentSearch = '';
      try {
        if (window.history && window.history.replaceState && window.location.protocol !== 'file:') {
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({path: cleanUrl}, '', cleanUrl);
        }
      } catch (err) {
        // Safe failover for file protocol or restricted contexts
      }
      applyArchiveFilter();
    }

    function resetArchiveFilters() {
      currentFilter = 'all';
      archiveFilters.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
      clearArchiveSearch();
    }

    archiveFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        archiveFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        applyArchiveFilter();
      });
    });

    if (archiveSearchInput) {
      archiveSearchInput.addEventListener('input', e => {
        currentSearch = e.target.value;
        applyArchiveFilter();
      });

      // Handle ?q= query param
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('q');
      if (queryParam) {
        archiveSearchInput.value = queryParam;
        currentSearch = queryParam;
        applyArchiveFilter();

        // Scroll to the first matching category section smoothly
        setTimeout(() => {
          const firstVisible = document.querySelector('.archive-cat-section:not([style*="display: none"])');
          if (firstVisible) {
            firstVisible.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }

    // Sidebar Category Click: clear search or filter and expand the chosen category so its tools are visible immediately!
    document.querySelectorAll('.archive-cat-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href') || '';
        const slug = href.replace(/^#/, '');
        if (slug) {
          toggleArchiveCategory(slug, true);
        }
        if (currentSearch || currentFilter !== 'all') {
          currentFilter = 'all';
          archiveFilters.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
          clearArchiveSearch();
        }
      });
    });

    document.addEventListener('keydown', e => {
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== archiveSearchInput) {
        e.preventDefault();
        if (archiveSearchInput) archiveSearchInput.focus();
      }
    });

    // Tool Views Auto-Loader (Instant sessionStorage + Immediate IntersectionObserver + Fast Static Cache + API Fallback)
    const viewCache = new Map();

    function applyViewsMap(viewsMap) {
      if (!viewsMap || typeof viewsMap !== 'object') return;
      try {
        const existing = JSON.parse(sessionStorage.getItem('staticstack_tool_views') || '{}');
        Object.assign(existing, viewsMap);
        sessionStorage.setItem('staticstack_tool_views', JSON.stringify(existing));
      } catch (e) {}

      document.querySelectorAll('.tool-archive-views[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (viewsMap[key] !== undefined) {
          const val = Number(viewsMap[key]) || 0;
          const formatted = val.toLocaleString();
          viewCache.set(key, formatted);
          const numEl = el.querySelector('.view-count-num') || el;
          numEl.textContent = formatted;
          el.setAttribute('data-fetched', 'true');
        }
      });
    }

    // 1. Immediately apply any views already saved in sessionStorage (0ms instant display)
    try {
      const saved = sessionStorage.getItem('staticstack_tool_views');
      if (saved) {
        applyViewsMap(JSON.parse(saved));
      }
    } catch (e) {}

    // 2. Direct CountAPI Queue
    const viewQueue = [];
    let activeWorkers = 0;
    const MAX_WORKERS = 4;

    function processViewQueue() {
      if (activeWorkers >= MAX_WORKERS || viewQueue.length === 0) return;
      activeWorkers++;
      const item = viewQueue.shift();
      const key = item.key;
      const el = item.el;

      if (viewCache.has(key)) {
        const numEl = el.querySelector('.view-count-num') || el;
        numEl.textContent = viewCache.get(key);
        activeWorkers--;
        setTimeout(processViewQueue, 10);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      fetch('https://countapi.mileshilliard.com/api/v1/get/' + encodeURIComponent(key), { signal: controller.signal })
        .then(res => res.ok ? res.json() : { value: 0 })
        .then(data => {
          clearTimeout(timeoutId);
          const raw = data && data.value !== undefined ? Number(data.value) : 0;
          const val = (!isNaN(raw) && raw >= 0) ? raw : 0;
          const formatted = val.toLocaleString();
          viewCache.set(key, formatted);
          try {
            const saved = JSON.parse(sessionStorage.getItem('staticstack_tool_views') || '{}');
            saved[key] = val;
            sessionStorage.setItem('staticstack_tool_views', JSON.stringify(saved));
          } catch (e) {}
          const numEl = el.querySelector('.view-count-num') || el;
          numEl.textContent = formatted;
        })
        .catch(() => {
          clearTimeout(timeoutId);
          const numEl = el.querySelector('.view-count-num') || el;
          if (numEl.textContent === '--') numEl.textContent = '0';
        })
        .finally(() => {
          activeWorkers--;
          setTimeout(processViewQueue, 20);
        });
    }

    function queueViewFetch(el) {
      if (!el || el.getAttribute('data-fetched') === 'true') return;
      el.setAttribute('data-fetched', 'true');
      const key = el.getAttribute('data-key');
      if (key) {
        viewQueue.push({ el: el, key: key });
        processViewQueue();
      }
    }

    // 3. Immediately start observing all visible rows on screen (zero delay!)
    function initViewObserver() {
      if ('IntersectionObserver' in window) {
        const viewObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              obs.unobserve(entry.target);
              queueViewFetch(entry.target);
            }
          });
        }, { rootMargin: '350px 0px' });

        document.querySelectorAll('.tool-archive-views[data-key]').forEach(el => {
          if (el.getAttribute('data-fetched') !== 'true') {
            viewObserver.observe(el);
          }
        });
      } else {
        document.querySelectorAll('.tool-archive-views[data-key]').forEach(el => {
          queueViewFetch(el);
        });
      }
    }

    // 4. Fast static JSON batch loader + API fallback in background
    function loadArchiveBatchViews() {
      const tryFetch = function(url) {
        const ctrl = new AbortController();
        const tid = setTimeout(function() { ctrl.abort(); }, 2500);
        return fetch(url, { signal: ctrl.signal })
          .then(function(res) {
            clearTimeout(tid);
            return res.ok ? res.json() : null;
          })
          .catch(function() {
            clearTimeout(tid);
            return null;
          });
      };

      tryFetch('/asset/json/tool-views-cache.json')
        .then(function(data) {
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            applyViewsMap(data.views || data);
            return true;
          }
          return tryFetch('/community/api?action=tool-views');
        })
        .then(function(data) {
          if (data && data !== true && data.views && Object.keys(data.views).length > 0) {
            applyViewsMap(data.views);
          }
        })
        .catch(function() {});

      // Refresh Top Viewed Tools in archive sidebar
      tryFetch('/community/api?action=top-tools')
        .then(function(data) {
          if (!data || !Array.isArray(data.top_tools) || !data.top_tools.length) return;
          const listEl = document.getElementById('archive-top-tools-list');
          if (!listEl) return;
          listEl.innerHTML = data.top_tools.slice(0, 4).map(function(t) {
            var icon = t.iconSvg || '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
            var v = Number(t.views || 0);
            var vText = v === 1 ? '1 view' : v.toLocaleString() + ' views';
            var link = t.url.startsWith('/') ? t.url : '/' + t.url;
            return '<a href="' + link + '" class="sidebar-tool-card" title="' + t.name + '">' +
              '<span class="sidebar-tool-icon">' + icon + '</span>' +
              '<div class="sidebar-tool-info">' +
                '<div class="sidebar-tool-name">' +
                  '<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px;">' + t.name + '</span>' +
                  '<span class="badge" style="font-size:0.65rem; padding:0.12rem 0.45rem; background:var(--accent-light); color:var(--accent); border:1px solid rgba(37,99,235,0.18); display:inline-flex; align-items:center; gap:0.25rem; font-variant-numeric:tabular-nums; font-weight:600; white-space:nowrap;">' +
                    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>' +
                    '<span>' + vText + '</span>' +
                  '</span>' +
                '</div>' +
                '<div class="sidebar-tool-desc">' + (t.desc || t.description || '') + '</div>' +
              '</div>' +
            '</a>';
          }).join('');
        })
        .catch(function() {});
    }

    // Execute immediately on load
    initViewObserver();
    loadArchiveBatchViews();

    // Auto-refresh when navigating back via browser history or switching tabs (bfcache support)
    window.addEventListener('pageshow', function(e) {
      initViewObserver();
      loadArchiveBatchViews();
    });
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') {
        loadArchiveBatchViews();
      }
    });
  </script>
`;

ensureDir(path.join(ROOT_DIR, 'archive'));
fs.writeFileSync(path.join(ROOT_DIR, 'archive', 'index.html'), renderLayout({
  title: `Master Archive - ${uniqueToolsCount}+ Static Website Tools | StaticStack`,
  description: `Explore the complete directory of ${uniqueToolsCount} curated tools across ${categories.length} static website categories with our expanded navigation sidebar.`,
  currentNav: 'archive',
  rootPath: '/',
  ogImage: 'https://www.staticstack.app/archive/og-archive.webp',
  miniHero: {
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Archive', url: '/archive' }
    ],
    icon: ICONS.archive,
    title: 'Master Directory',
    subtext: `Complete catalog of all ${uniqueToolsCount} tools across ${categories.length} categories for static websites. Filter by pricing or jump directly to any category section.`,
    extraHtml: `
      <!-- Archive Search & Filter Controls -->
      <div class="archive-controls-row" style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-top:1.25rem; width:100%; max-width:100%; box-sizing:border-box;">
        <div style="flex:1 1 260px; position:relative; max-width:480px; width:100%; min-width:0; box-sizing:border-box;">
          <input type="text" id="archive-search-input" style="width:100%; max-width:100%; box-sizing:border-box; padding:0.6rem 2.2rem 0.6rem 2.5rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-full); font-size:0.925rem; color:var(--text-main); font-family:inherit; outline:none;" placeholder="Filter all ${uniqueToolsCount} tools by name, description, keyword...">
          <span style="position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:var(--text-subtle); display:flex;">${ICONS.search}</span>
          <button id="archive-search-clear" onclick="clearArchiveSearch()" style="position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-subtle); display:none; align-items:center; justify-content:center; padding:2px;" title="Clear search" aria-label="Clear search">
            ${ICONS.close}
          </button>
        </div>

        <!-- Filter Buttons & Expand/Collapse Toggle -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:0.75rem; flex-wrap:wrap; width:100%;">
          <div class="archive-filter-chips" style="display:flex; gap:0.5rem; flex-wrap:wrap; max-width:100%; box-sizing:border-box;">
            <button class="btn btn-sm btn-secondary archive-filter active" data-filter="all">All Tools (${uniqueToolsCount})</button>
            <button class="btn btn-sm btn-secondary archive-filter" data-filter="open-source">Open Source</button>
            <button class="btn btn-sm btn-secondary archive-filter" data-filter="free">Free</button>
            <button class="btn btn-sm btn-secondary archive-filter" data-filter="freemium">Freemium</button>
            <button class="btn btn-sm btn-secondary archive-filter" data-filter="paid">Paid</button>
          </div>
          <div class="archive-view-controls">
            <button type="button" class="archive-toggle-all-btn" onclick="toggleAllArchiveCategories(false)">Collapse All</button>
            <button type="button" class="archive-toggle-all-btn" onclick="toggleAllArchiveCategories(true)">Expand All</button>
          </div>
        </div>
      </div>
      <div id="archive-results-count" style="font-size:0.85rem; color:var(--text-subtle); margin-top:0.75rem;">Showing all ${uniqueToolsCount} tools across ${categories.length} categories</div>
    `
  },
  content: archiveContent
}));

// ==========================================================================
// 3. Generate submit.html (Tool Submission Page)
// ==========================================================================
console.log('✉️ Generating Submit Page (submit.html)...');

const submitContent = `
  <div class="submit-layout" style="display:grid; grid-template-columns: 3fr 2fr; gap:2.5rem; align-items:start; margin-bottom: 5.5rem;">
    <!-- Form Card -->
    <div class="submit-card" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2.25rem; box-shadow:var(--shadow-card); margin-bottom: 2rem;">
      <h2 style="font-size:1.35rem; font-weight:700; margin-bottom:0.5rem;">Propose a Tool or Service</h2>
      <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">
        Fill out the details below. Clicking <strong>"Continue to GitHub"</strong> will securely pre-fill an issue template on our official repository.
      </p>

      <form id="submission-form" onsubmit="handleFormSubmit(event)" style="margin-bottom: 1rem;">
        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="tool-name">Tool or Service Name *</label>
          <input type="text" id="tool-name" required placeholder="e.g. Bootstrap Studio, Pagefind, Reflow" style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main);">
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="website-url">Official HTTPS Website URL *</label>
          <input type="url" id="website-url" required placeholder="https://example.com/" style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main);">
          <span style="font-size:0.75rem; color:var(--text-subtle); display:block; margin-top:0.25rem;">Must be an official HTTPS link with zero affiliate or referral codes.</span>
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="tool-category">Suggested Category *</label>
          <select id="tool-category" required style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main);">
            <option value="" disabled selected>-- Select a Toolkit Category --</option>
            ${categories.map(c => `<option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>`).join('')}
          </select>
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="pricing-model">Pricing / License Model *</label>
          <select id="pricing-model" required style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main);">
            <option value="" disabled selected>-- Select Pricing Model --</option>
            <option value="Open Source">Open Source (Public source code)</option>
            <option value="Free">Completely Free (100% free with zero payment requirements)</option>
            <option value="Freemium">Freemium (Generous free tier with optional paid plans)</option>
            <option value="Paid">Commercial / Paid Only</option>
          </select>
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="tool-description">Short Description *</label>
          <textarea id="tool-description" required rows="2" placeholder="Brief 1-2 sentence description explaining what the tool does..." style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main); line-height:1.5;"></textarea>
        </div>

        <div style="margin-bottom:1.75rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="static-value">How does it help Static Websites? *</label>
          <textarea id="static-value" required rows="2" placeholder="Explain how developers integrate it with static HTML/JS without running backend servers..." style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main); line-height:1.5;"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%;">
          Continue to GitHub Issue Template ${ICONS.arrowRight}
        </button>
      </form>
    </div>

    <!-- Right Column: Criteria -->
    <div class="submit-info-card" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-card);">
      <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">Inclusion Guidelines</h3>
      <ul style="padding-left:1.25rem; font-size:0.9rem; line-height:1.7; color:var(--text-muted); display:flex; flex-direction:column; gap:0.5rem;">
        <li><strong>Relevant to Static Frontends</strong>: Must enhance HTML, CSS, and JS sites without requiring a traditional backend server.</li>
        <li><strong>Zero Affiliate Links</strong>: Direct official links only. Referrals or promotional campaign parameters are rejected.</li>
        <li><strong>Working &amp; Maintained</strong>: Tools must be actively developed and reliable. Discontinued or broken tools will not be accepted.</li>
        <li><strong>Quality Over Quantity</strong>: We aim to provide the best tools in each category rather than an unfiltered directory.</li>
      </ul>

      <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--border-color);">
        <h4 style="font-size:1rem; font-weight:700; margin-bottom:0.5rem;">Prefer opening a Pull Request?</h4>
        <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.6; margin-bottom:1rem;">
          You can edit <code>README.md</code> directly and submit a PR with your proposed addition.
        </p>
        <a href="/contribute" class="btn btn-secondary btn-sm">Read Contributing Guide →</a>
      </div>
    </div>
  </div>

  <script>
    function handleFormSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('tool-name').value.trim();
      const url = document.getElementById('website-url').value.trim();
      const category = document.getElementById('tool-category').value;
      const pricing = document.getElementById('pricing-model').value;
      const desc = document.getElementById('tool-description').value.trim();
      const value = document.getElementById('static-value').value.trim();

      const issueTitle = encodeURIComponent(\`Add tool: \${name}\`);
      const body = encodeURIComponent(
        \`### Tool Name\\n\${name}\\n\\n\` +
        \`### Official Website URL\\n\${url}\\n\\n\` +
        \`### Category\\n\${category}\\n\\n\` +
        \`### Pricing / License\\n\${pricing}\\n\\n\` +
        \`### Description\\n\${desc}\\n\\n\` +
        \`### How It Integrates with Static Websites\\n\${value}\\n\\n\` +
        \`### Checklist\\n- [x] I confirmed this link is the official website with zero affiliate parameters.\\n- [x] The tool is actively maintained and supports static web frontends.\`
      );

      const targetUrl = \`https://github.com/E6WeB/htmlstatic/issues/new?title=\${issueTitle}&body=\${body}\`;
      window.open(targetUrl, '_blank');
    }
  </script>
`;

ensureDir(path.join(ROOT_DIR, 'submit'));
fs.writeFileSync(path.join(ROOT_DIR, 'submit', 'index.html'), renderLayout({
  title: 'Submit a Static Website Tool or API Service | StaticStack',
  description: 'Propose a new static website tool, API, or service to include in the StaticStack directory.',
  currentNav: 'submit',
  rootPath: '/',
  ogImage: 'https://www.staticstack.app/submit/og-submit.webp',
  miniHero: {
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Submit a Tool', url: '/submit' }
    ],
    icon: ICONS.plusCircle,
    title: 'Submit a Tool',
    subtext: 'StaticStack is 100% community-curated and maintained on GitHub. Submissions are processed through <strong>GitHub Issues</strong> to ensure transparency, security, and spam prevention.'
  },
  content: submitContent
}));

// ==========================================================================
// 4. Generate contribute/index.html (Contributing Guide Page)
// ==========================================================================
console.log('🤝 Generating Contribute Page (contribute/index.html)...');

const contributingMd = fs.readFileSync(path.join(ROOT_DIR, 'contribute', 'CONTRIBUTING.md'), 'utf8');
const renderedContributing = marked.parse(contributingMd);

const contributeContent = `
  <div class="markdown-body">
    ${renderedContributing}
  </div>
`;

ensureDir(path.join(ROOT_DIR, 'contribute'));
fs.writeFileSync(path.join(ROOT_DIR, 'contribute', 'index.html'), renderLayout({
  title: 'Contributing Guide - Static Website Toolkit',
  description: 'Learn how to contribute new tools, report updates, and submit pull requests to the Static Website Toolkit.',
  currentNav: 'contribute',
  rootPath: '/',
  miniHero: {
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Contributing Guide', url: '/contribute' }
    ],
    icon: ICONS.gitPullRequest,
    title: 'Contributing Guide',
    subtext: 'Thank you for helping keep the Static Website Toolkit accurate, comprehensive, and valuable! Learn how to propose tools, improve docs, or open pull requests.',
    actions: `
      <a href="/submit" class="btn btn-primary btn-sm">Use Web Submit Form →</a>
      <a href="https://github.com/E6WeB/htmlstatic/issues" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
        GitHub Issues ${ICONS.external}
      </a>
      <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
        ${ICONS.github} View Repository
      </a>
    `
  },
  content: contributeContent
}));

// ==========================================================================
// 5. Generate thankyou/index.html (Thank You & Credits Page)
// ==========================================================================
console.log('💖 Generating Thank You Page (thankyou/index.html)...');

const thankYouMd = fs.readFileSync(path.join(ROOT_DIR, 'thankyou', 'THANKYOU.md'), 'utf8');
const renderedThankYou = marked.parse(thankYouMd);

const thankYouContent = `
  <div class="markdown-body">
    ${renderedThankYou}
  </div>
`;

ensureDir(path.join(ROOT_DIR, 'thankyou'));
fs.writeFileSync(path.join(ROOT_DIR, 'thankyou', 'index.html'), renderLayout({
  title: 'Thank You & Credits - Static Website Toolkit',
  description: 'Special thanks to the contributors, maintainers, and community behind Static Website Toolkit.',
  currentNav: 'thankyou',
  rootPath: '/',
  miniHero: {
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Thank You & Credits', url: '/thankyou' }
    ],
    icon: ICONS.heart,
    title: 'Thank You & Credits',
    subtext: 'Recognizing the community, contributors, and tool creators who make modern static websites exceptional.',
    actions: `
      <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
        ${ICONS.github} GitHub Repository ${ICONS.external}
      </a>
    `
  },
  content: thankYouContent
}));

// ==========================================================================
// 5b. Generate contact/index.html (Contact & Connect Page - No Contact Form)
// ==========================================================================
console.log('💬 Generating Contact Page (contact/index.html)...');

const contactMd = fs.readFileSync(path.join(ROOT_DIR, 'contact', 'CONTACT.md'), 'utf8');
const renderedContactMd = marked.parse(contactMd);

const contactContent = `
  <section style="padding: 0 0 2.5rem;">
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem; margin-bottom:2.25rem;">
      <!-- Facebook Group Card -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-card); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.35rem 0.8rem; background:rgba(24, 119, 242, 0.1); color:#1877f2; border:1px solid rgba(24, 119, 242, 0.25); border-radius:var(--radius-full); font-size:0.8rem; font-weight:700; margin-bottom:1.15rem;">
            ${ICONS.facebook}
            <span>Facebook Community</span>
          </div>
          <h2 style="font-size:1.45rem; font-weight:800; color:var(--text-main); margin-bottom:0.65rem;">Connect in Our Facebook Group</h2>
          <p style="font-size:0.95rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.5rem;">
            Join our official Facebook group to message the maintainer directly, share your static website builds, ask questions, and connect with fellow developers.
          </p>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <a href="https://www.facebook.com/groups/staticshark" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="justify-content:center; width:100%;">
            ${ICONS.facebook}
            <span>StaticStack Official Group</span>
            ${ICONS.external}
          </a>
          <a href="/community" class="btn btn-secondary" style="justify-content:center; width:100%;">
            ${ICONS.comments}
            <span>Visit On-Site Community Forum</span>
            ${ICONS.arrowRight}
          </a>
        </div>
      </div>

      <!-- GitHub Point of Contact Card -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-card); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.35rem 0.8rem; background:var(--accent-light); color:var(--accent); border:1px solid var(--accent-border); border-radius:var(--radius-full); font-size:0.8rem; font-weight:700; margin-bottom:1.15rem;">
            ${ICONS.github}
            <span>GitHub Point of Contact</span>
          </div>
          <h2 style="font-size:1.45rem; font-weight:800; color:var(--text-main); margin-bottom:0.65rem;">Reach Out on GitHub</h2>
          <p style="font-size:0.95rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.5rem;">
            Have a question about the catalog, spotted a broken link, or want to collaborate on the codebase? Reach us directly on GitHub via Discussions or Issues.
          </p>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <a href="https://github.com/E6WeB/htmlstatic/discussions" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="justify-content:center; width:100%;">
            ${ICONS.github}
            <span>Open a GitHub Discussion</span>
            ${ICONS.external}
          </a>
          <a href="https://github.com/E6WeB/htmlstatic/issues" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="justify-content:center; width:100%;">
            ${ICONS.github}
            <span>Report an Issue on GitHub</span>
            ${ICONS.external}
          </a>
        </div>
      </div>
    </div>

    <div class="markdown-body">
      ${renderedContactMd}
    </div>
  </section>
`;

ensureDir(path.join(ROOT_DIR, 'contact'));
fs.writeFileSync(path.join(ROOT_DIR, 'contact', 'index.html'), renderLayout({
  title: 'Contact & Connect - Community & GitHub Hub | StaticStack',
  description: 'Get in touch with StaticStack through our official Facebook Group and GitHub repository—no spammy contact forms required.',
  currentNav: 'contact',
  rootPath: '/',
  miniHero: {
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Contact & Connect', url: '/contact' }
    ],
    icon: ICONS.comments,
    title: 'Contact & Connect',
    subtext: 'No contact forms or private ticket queues—connect with us directly in our official Facebook Group or on GitHub.',
    actions: `
      <a href="https://www.facebook.com/groups/staticshark" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
        ${ICONS.facebook} Facebook Group ${ICONS.external}
      </a>
      <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
        ${ICONS.github} GitHub Repo ${ICONS.external}
      </a>
    `
  },
  content: contactContent
}));

// ==========================================================================
// 5c. Generate 404.html (Page Not Found with Modern App Shell)
// ==========================================================================
console.log('🔍 Generating 404 Page (404.html)...');

const notFoundContent = `
  <section class="not-found-section">
    <div class="not-found-code" aria-hidden="true">404</div>
    <h1 class="not-found-title">Page Not Found</h1>
    <p class="not-found-desc">
      The page or resource you are looking for does not exist, has been moved, or is temporarily unavailable.
    </p>

    <!-- Quick Search on 404 -->
    <div class="not-found-search">
      <form action="/archive" method="GET" class="not-found-search-form" onsubmit="if(!this.q.value.trim()){return false;}">
        <input type="text" name="q" class="not-found-search-input" placeholder="Search 130+ static tools &amp; categories..." autocomplete="off">
        <button type="submit" class="btn btn-primary" style="font-size:0.875rem; padding:0.6rem 1.15rem; flex-shrink:0;">
          Search
        </button>
      </form>
    </div>

    <div class="not-found-actions">
      <a href="/" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:0.4rem;">
        ${ICONS.home} Back to Home
      </a>
      <a href="/archive" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:0.4rem;">
        ${ICONS.compass} Explore Master Archive
      </a>
      <a href="/community" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:0.4rem;">
        ${ICONS.comments} Community Forum
      </a>
    </div>
  </section>
`;

fs.writeFileSync(path.join(ROOT_DIR, '404.html'), renderLayout({
  title: '404 - Page Not Found | StaticStack',
  description: 'The requested page could not be found on StaticStack. Explore 130+ curated zero-backend tools and services.',
  currentNav: '',
  rootPath: '/',
  canonicalUrl: 'https://www.staticstack.app/404',
  breadcrumbs: [
    { label: 'Home', url: '/' },
    { label: '404 Not Found', url: '#' }
  ],
  content: notFoundContent
}));

// ==========================================================================
// 6. Generate Dedicated HTML Pages for ALL Tools!
// ==========================================================================
console.log(`🔧 Generating Dedicated HTML Pages for all ${allTools.length} tools...`);
allTools.forEach(tool => {
  const renderedToolHtml = renderToolPage({
    tool,
    rootDir: ROOT_DIR,
    renderLayout,
    getRandomTools,
    getToolSiteIcon
  });

  const toolCatDir = path.join(ROOT_DIR, 'tools', tool.categorySlug);
  ensureDir(toolCatDir);
  fs.writeFileSync(path.join(toolCatDir, `${tool.slug}.html`), renderedToolHtml);
});

// ==========================================================================
// 7. Generate Dedicated Category Landing Hub Pages (/category/<slug>/index.html)
// ==========================================================================
console.log(`🌐 Generating Dedicated Category Landing Hub Pages for all ${categories.length} categories...`);
categories.forEach(cat => {
  const renderedCatHtml = renderCategoryPage({
    category: cat,
    allCategories: categories,
    rootDir: ROOT_DIR,
    renderLayout,
    getToolSiteIcon,
    cachedViewsMap
  });

  const catDir = path.join(ROOT_DIR, 'category', cat.slug);
  ensureDir(catDir);
  fs.writeFileSync(path.join(catDir, 'index.html'), renderedCatHtml);
});

// ==========================================================================
// 8. Generate XML Sitemap (sitemap.xml) & Custom Tool Feed (tools.xml) & robots.txt
// ==========================================================================
const today = new Date().toISOString().split('T')[0];

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 1. Search Engine Sitemap (sitemap.xml)
const sitemapUrls = [
  { loc: 'https://www.staticstack.app/', priority: '1.0', changefreq: 'daily' },
  { loc: 'https://www.staticstack.app/archive', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://www.staticstack.app/submit', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://www.staticstack.app/community', priority: '0.85', changefreq: 'weekly' },
  { loc: 'https://www.staticstack.app/contribute', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://www.staticstack.app/thankyou', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://www.staticstack.app/contact', priority: '0.7', changefreq: 'monthly' },
];

categories.forEach(cat => {
  sitemapUrls.push({
    loc: `https://www.staticstack.app/category/${cat.slug}/`,
    priority: '0.85',
    changefreq: 'weekly'
  });
});

categories.forEach(cat => {
  cat.tools.forEach(tool => {
    sitemapUrls.push({
      loc: `https://www.staticstack.app/tools/${cat.slug}/${tool.slug}`,
      priority: '0.8',
      changefreq: 'monthly'
    });
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapXml);

// 2. Custom Tool Directory XML (tools.xml)
const toolsXml = `<?xml version="1.0" encoding="UTF-8"?>
<tools>
${allTools.map(tool => {
  const coverRelativeName = `${tool.slug}-cover.webp`;
  const coverDiskPath = path.join(ROOT_DIR, 'tools', tool.categorySlug, coverRelativeName);
  const imageTag = fs.existsSync(coverDiskPath)
    ? `\n    <image>https://www.staticstack.app/tools/${tool.categorySlug}/${coverRelativeName}</image>`
    : '';
  return `  <tool>
    <title>${escapeXml(tool.name)}</title>
    <category>${escapeXml(tool.categoryTitle)}</category>
    <url>https://www.staticstack.app/tools/${tool.categorySlug}/${tool.slug}</url>${imageTag}
    <description>
      ${escapeXml(tool.description)}
    </description>
    <lastmod>${today}</lastmod>
  </tool>`;
}).join('\n')}
</tools>
`;
fs.writeFileSync(path.join(ROOT_DIR, 'tools.xml'), toolsXml);

// 3. robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://www.staticstack.app/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robotsTxt);

// ==========================================================================
// 9. Generate Search Index (search-data.json)
// ==========================================================================
const searchIndex = [];

searchIndex.push({
  title: 'Community & Discussions',
  description: 'Connect with static site developers, ask questions, share projects, and join our GitHub and Facebook discussions.',
  category: 'Community',
  url: '/community'
});

categories.forEach(cat => {
  searchIndex.push({
    title: cat.title,
    description: cat.description,
    category: 'Category',
    url: `/category/${cat.slug}/`
  });
});

allTools.forEach(tool => {
  searchIndex.push({
    title: tool.name,
    description: tool.description,
    category: tool.categoryTitle,
    tags: tool.tags || [],
    url: `/tools/${tool.categorySlug}/${tool.slug}`
  });
});

ensureDir(path.join(ASSET_DIR, 'json'));
fs.writeFileSync(
  path.join(ASSET_DIR, 'json', 'search-data.json'),
  JSON.stringify(searchIndex)
);

console.log(`🎉 Complete! Generated all main pages with wider 320px archive sidebar + dedicated HTML pages for all ${allTools.length} tools!`);
