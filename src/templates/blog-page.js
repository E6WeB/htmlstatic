/**
 * Blog Page Templates
 * Renders:
 * 1. Dedicated Blog Article Pages (/blog/<slug>/index.html) with 2-column layout (content left, sidebar right)
 * 2. Blog Index / Directory Page (/blog/index.html)
 */

const fs = require('fs');
const path = require('path');
const { ICONS, CATEGORY_ICONS, escapeHtml } = require('../data/icons');
const { renderSidebarDonationWidget } = require('./sidebar-donation');

function loadBlogViewsMap() {
  try {
    const p = path.resolve(__dirname, '..', '..', 'asset', 'json', 'tool-views-cache.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8')) || {};
    }
  } catch (e) {}
  return {};
}

/**
 * Render a single blog article page
 */
function renderBlogArticlePage({
  post,
  parsedHtml,
  allTools = [],
  categories = [],
  allPosts = [],
  renderLayout,
  getToolSiteIcon
}) {
  const rootPath = '../../';
  const pageCanonical = `https://www.staticstack.app/blog/${post.slug}/`;

  // Lookup featured tools in sidebar
  const featuredTools = (post.featuredToolSlugs || []).map(slug => {
    return allTools.find(t => t.slug === slug);
  }).filter(Boolean);

  // Render sidebar tools list
  const sidebarToolsHtml = featuredTools.map(rt => {
    const rawBadge = (rt.primaryBadge || '').toLowerCase();
    const rtBadgeClass = rawBadge.includes('open')
      ? 'badge-open-source'
      : rawBadge.includes('free')
        ? 'badge-free'
        : rawBadge.includes('freemium')
          ? 'badge-freemium'
          : 'badge-paid';

    const iconHtml = typeof getToolSiteIcon === 'function' ? getToolSiteIcon(rt, 20) : '';

    return `
      <a href="${rootPath}tools/${rt.categorySlug}/${rt.slug}" class="sidebar-tool-card" title="${escapeHtml(rt.name)} - ${escapeHtml(rt.categoryTitle)}">
        <span class="sidebar-tool-icon" style="display:inline-flex; align-items:center; justify-content:center;">
          ${iconHtml}
        </span>
        <div class="sidebar-tool-info">
          <div class="sidebar-tool-name">
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(rt.name)}</span>
            <span class="badge ${rtBadgeClass}" style="font-size:0.65rem; padding:0.1rem 0.4rem;">${escapeHtml(rt.primaryBadge)}</span>
          </div>
          <div class="sidebar-tool-desc">${escapeHtml(rt.tagline || rt.description)}</div>
        </div>
      </a>
    `;
  }).join('');

  // Table of Contents HTML
  const tocHtml = (post.toc || []).map(item => `
    <li>
      <a href="#${item.id}" class="blog-toc-link">
        <span>${escapeHtml(item.title)}</span>
        <span style="color:var(--text-subtle);">${ICONS.chevronRight}</span>
      </a>
    </li>
  `).join('');

  // Article Tags HTML
  let tagsHtml = '';
  if (post.tags && post.tags.length > 0) {
    const pills = post.tags.map(t => {
      const cleanTag = escapeHtml(t);
      return `<a href="${rootPath}search?q=${encodeURIComponent(t)}" class="tool-tag-pill">#${cleanTag}</a>`;
    }).join(' ');

    tagsHtml = `
      <section class="tool-tags-section" aria-label="Article Topics">
        <span class="tool-tags-label">
          ${ICONS.tag}
          <span>Topics:</span>
        </span>
        <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
          ${pills}
        </div>
      </section>
    `;
  }

  // Schema.org BlogPosting JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://www.staticstack.app/'
    },
    publisher: {
      '@type': 'Organization',
      name: 'StaticStack',
      url: 'https://www.staticstack.app/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.staticstack.app/apple-touch-icon.png'
      }
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageCanonical
    },
    keywords: post.tags.join(', ')
  };

  // Format date as MM.DD.YY (e.g. 03.19.26)
  const dotDateParts = (post.date || '').split('-');
  const dotDate = dotDateParts.length === 3 ? `${dotDateParts[1]}.${dotDateParts[2]}.${dotDateParts[0].slice(-2)}` : (post.dateFormatted || '');
  const authorDisplay = escapeHtml(post.author || 'StaticStack');
  const categoryDisplay = escapeHtml(post.category || '');
  const blogViewKey = `blog-${post.slug}`;
  const viewsMap = loadBlogViewsMap();
  const initialViews = Number(viewsMap[blogViewKey]) || 0;

  const metaUserIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-flex;vertical-align:-2px;margin-right:0.35rem;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
  const metaFolderIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-flex;vertical-align:-2px;margin-right:0.35rem;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
  const metaCalendarIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-flex;vertical-align:-2px;margin-right:0.35rem;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
  const metaEyeIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-flex;vertical-align:-2px;margin-right:0.35rem;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

  const articleContent = `
    <!-- Blog 2-Column Responsive Layout (Main Content Left + Sidebar Right) -->
    <div class="blog-layout">
      <!-- Main Content (Left Column) -->
      <div class="blog-main">
        <article class="blog-article-card">
          <!-- Article Cover Banner -->
          <div class="blog-cover-wrapper" style="margin-bottom:1.25rem; border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--border-color); box-shadow:var(--shadow-card);">
            <img src="cover.webp" alt="${escapeHtml(post.title)}" width="1200" height="630" style="width:100%; height:auto; display:block; aspect-ratio:1200/630; object-fit:cover;">
          </div>

          <!-- Developer-Style Meta Bar (Below Cover Image) -->
          <div class="blog-article-meta-bar" aria-label="Article Details">
            <span class="blog-meta-item">
              ${metaUserIcon}<span>${authorDisplay}</span>
            </span>
            <span class="blog-meta-pipe">|</span>
            <span class="blog-meta-item">
              ${metaFolderIcon}<a href="${rootPath}category/${post.categorySlug}/" class="blog-meta-link">${categoryDisplay}</a>
            </span>
            <span class="blog-meta-pipe">|</span>
            <span class="blog-meta-item">
              ${metaCalendarIcon}<span>${dotDate}</span>
            </span>
            <span class="blog-meta-pipe">|</span>
            <span class="blog-meta-item">
              ${metaEyeIcon}<span>view:<span id="blog-view-count" class="blog-meta-num" data-key="${escapeHtml(blogViewKey)}">${initialViews.toLocaleString()}</span></span>
            </span>
          </div>

          <!-- Article Markdown Body -->
          ${(() => {
            if (!post.series || !allPosts.length) return '';
            const seriesPosts = allPosts
              .filter(p => p.series && p.series.name === post.series.name)
              .sort((a, b) => a.series.part - b.series.part);
            if (!seriesPosts.length) return '';
            const currentIdx = seriesPosts.findIndex(p => p.slug === post.slug);
            const prevPost = currentIdx > 0 ? seriesPosts[currentIdx - 1] : null;
            const nextPost = currentIdx >= 0 && currentIdx < seriesPosts.length - 1 ? seriesPosts[currentIdx + 1] : null;
            return `
              <div style="margin-bottom:1.5rem; padding:0.9rem 1.1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); background:var(--bg-body); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.65rem;">
                <div style="font-size:0.875rem; color:var(--text-main);">
                  <strong>${escapeHtml(post.series.name)}</strong> &middot; <span class="badge badge-free" style="font-size:0.72rem; padding:0.12rem 0.45rem;">Part ${post.series.part} of ${seriesPosts.length}</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  ${prevPost ? `<a href="${rootPath}blog/${prevPost.slug}/" class="btn btn-secondary btn-sm" style="font-size:0.78rem; padding:0.3rem 0.65rem;">&larr; Part ${prevPost.series.part}</a>` : ''}
                  ${nextPost ? `<a href="${rootPath}blog/${nextPost.slug}/" class="btn btn-primary btn-sm" style="font-size:0.78rem; padding:0.3rem 0.65rem;">Part ${nextPost.series.part} &rarr;</a>` : ''}
                </div>
              </div>
            `;
          })()}
          <div class="markdown-body">
            ${parsedHtml}
          </div>

          ${(() => {
            if (!post.series || !allPosts.length) return '';
            const seriesPosts = allPosts
              .filter(p => p.series && p.series.name === post.series.name)
              .sort((a, b) => a.series.part - b.series.part);
            if (!seriesPosts.length) return '';
            const itemsHtml = seriesPosts.map(p => {
              const isCurrent = p.slug === post.slug;
              return `
                <li style="margin-bottom:0.4rem;">
                  ${isCurrent
                    ? `<strong style="color:var(--accent);">Part ${p.series.part}: ${escapeHtml(p.title)} (Current)</strong>`
                    : `<a href="${rootPath}blog/${p.slug}/" style="color:var(--text-main); text-decoration:none;">Part ${p.series.part}: ${escapeHtml(p.title)}</a>`
                  }
                </li>
              `;
            }).join('');
            return `
              <nav aria-label="${escapeHtml(post.series.name)} Index" style="margin-top:2rem; padding:1.25rem 1.4rem; border-radius:var(--radius-md); border:1px solid var(--border-color); background:var(--bg-body);">
                <div style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.65rem;">${escapeHtml(post.series.name)} (${seriesPosts.length} Parts)</div>
                <ol style="margin:0; padding-left:1.25rem; font-size:0.9rem; line-height:1.55;">
                  ${itemsHtml}
                </ol>
              </nav>
            `;
          })()}

          <!-- Topics / Tags -->
          ${tagsHtml}

          <!-- Discussion Section via Giscus -->
          <section class="tool-comments-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-card);">
            <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
              <div style="display:flex; align-items:center; gap:0.55rem;">
                <span style="color:var(--accent); display:inline-flex; align-items:center;">${ICONS.chatBubbles}</span>
                <h3 style="font-size:1.25rem; font-weight:700; margin:0; color:var(--text-main);">Discussion</h3>
              </div>
              <p style="font-size:0.875rem; color:var(--text-muted); margin:0.35rem 0 0 0;">Questions, thoughts, or form tips? Join the conversation below.</p>
            </div>
            <div class="giscus"></div>
            <script src="https://giscus.app/client.js"
                    data-repo="E6WeB/static-comment"
                    data-repo-id="R_kgDOVYc0DQ"
                    data-category="General"
                    data-category-id="DIC_kwDOVYc0Dc4DJsXu"
                    data-mapping="pathname"
                    data-strict="0"
                    data-reactions-enabled="0"
                    data-emit-metadata="0"
                    data-input-position="bottom"
                    data-theme="light"
                    data-lang="en"
                    crossorigin="anonymous"
                    async>
            </script>
          </section>

          <!-- Bottom Navigation Bar -->
          <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap; padding-top:2rem; margin-top:2rem; border-top:1px solid var(--border-color);">
            <a href="${rootPath}blog" class="btn btn-secondary">
              ${ICONS.arrowLeft} Back to All Articles
            </a>
            <a href="${rootPath}category/${post.categorySlug}/" class="btn btn-secondary">
              Browse ${escapeHtml(post.category)} Tools
            </a>
            <a href="${rootPath}submit" class="btn btn-primary">
              Submit a Tool &rarr;
            </a>
          </div>
        </article>

        <!-- Blog Article View Counter: Only counts new unique visitors -->
        <script>
          (function() {
            const countEl = document.getElementById('blog-view-count');
            if (!countEl) return;
            const key = countEl.getAttribute('data-key');
            if (!key) return;

            const viewedKey = 'hs_viewed_' + key;
            let alreadyViewed = false;
            try {
              alreadyViewed = !!localStorage.getItem(viewedKey) || (document.cookie.indexOf(viewedKey + '=1') !== -1);
            } catch (e) {}

            if (!alreadyViewed) {
              try {
                localStorage.setItem(viewedKey, '1');
                document.cookie = viewedKey + '=1; path=/; max-age=315360000; SameSite=Lax';
              } catch (e) {}
            }

            function updateDisplay(val) {
              const num = Number(val);
              if (!isNaN(num) && num >= 0) {
                countEl.textContent = num.toLocaleString();
              }
            }

            const apiParam = alreadyViewed ? '&hit=0' : '&hit=1';
            fetch('/community/api?action=tool-view&key=' + encodeURIComponent(key) + apiParam)
              .then(function(res) {
                if (!res.ok) throw new Error('API error');
                return res.json();
              })
              .then(function(data) {
                if (data && data.value !== undefined) {
                  updateDisplay(data.value);
                }
              })
              .catch(function() {
                fetch('/asset/json/tool-views-cache.json')
                  .then(function(res) { return res.ok ? res.json() : null; })
                  .then(function(data) {
                    if (data && data[key] !== undefined) {
                      updateDisplay(data[key]);
                    }
                  })
                  .catch(function() {});
              });
          })();
        </script>
      </div>

      <!-- Right Sidebar (Table of Contents + Related Tools + Tips + Support) -->
      <aside class="blog-sidebar">
        <!-- Table of Contents Widget -->
        ${post.toc && post.toc.length > 0 ? `
        <div class="sidebar-widget" style="position:sticky; top:5.5rem;">
          <div class="sidebar-widget-header">
            <span style="color:var(--accent); display:inline-flex; align-items:center;">${ICONS.book}</span>
            <h4 class="sidebar-widget-title">In This Article</h4>
          </div>
          <div class="sidebar-widget-body">
            <ul class="blog-toc-list">
              ${tocHtml}
            </ul>
          </div>
        </div>
        ` : ''}

        <!-- Related Catalog Tools Widget -->
        ${featuredTools.length > 0 ? `
        <div class="sidebar-widget">
          <div class="sidebar-widget-header" style="justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="color:var(--accent); display:inline-flex; align-items:center;">${CATEGORY_ICONS[post.categorySlug] || ICONS.sparkles}</span>
              <h4 class="sidebar-widget-title">Featured Tools</h4>
            </div>
            <a href="${rootPath}category/${post.categorySlug}/" style="font-size:0.75rem; font-weight:700; color:var(--accent); text-decoration:none;">
              View All &rarr;
            </a>
          </div>
          <div class="sidebar-widget-body" style="display:flex; flex-direction:column; gap:0.4rem;">
            ${sidebarToolsHtml}
          </div>
        </div>
        ` : ''}

        <!-- Static Site Tips Widget -->
        <div class="sidebar-widget">
          <div class="sidebar-widget-header">
            <span style="color:var(--accent); display:inline-flex; align-items:center;">${ICONS.lightbulb}</span>
            <h4 class="sidebar-widget-title">Static Site Pro Tip</h4>
          </div>
          <div class="sidebar-widget-body">
            <div class="sidebar-tip-item">
              <span class="sidebar-tip-icon">${ICONS.shield}</span>
              <div>
                <strong style="color:var(--text-main); font-size:0.85rem; display:block;">Always Add a Honeypot</strong>
                <p style="font-size:0.8rem; margin:0.25rem 0 0; color:var(--text-muted); line-height:1.45;">
                  A hidden honeypot input filters out over 90% of automated spam submissions with zero human friction.
                </p>
              </div>
            </div>
            <div class="sidebar-tip-item">
              <span class="sidebar-tip-icon">${ICONS.zap}</span>
              <div>
                <strong style="color:var(--text-main); font-size:0.85rem; display:block;">Progressive Enhancement</strong>
                <p style="font-size:0.8rem; margin:0.25rem 0 0; color:var(--text-muted); line-height:1.45;">
                  Start with a valid HTML POST action, then layer on JavaScript <code>fetch()</code> for instantaneous inline confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar PayPal Donation Widget -->
        ${renderSidebarDonationWidget()}

        <!-- Facebook Community Card -->
        <div class="sidebar-widget">
          <div class="sidebar-widget-header">
            <span style="color:#1877f2; display:inline-flex; align-items:center;">${ICONS.facebook}</span>
            <h4 class="sidebar-widget-title">Join the Community</h4>
          </div>
          <div class="sidebar-widget-body">
            <p style="font-size:0.825rem; color:var(--text-muted); line-height:1.5; margin-bottom:0.85rem;">
              Connect with fellow static site developers, share Jamstack workflows, and get feedback.
            </p>
            <a href="https://www.facebook.com/groups/dynamicwebsites" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="width:100%; justify-content:center; gap:0.4rem;">
              ${ICONS.facebook} Join Dynamic Websites ${ICONS.external}
            </a>
          </div>
        </div>
      </aside>
    </div>
  `;

  return renderLayout({
    title: `${post.title} - StaticStack Blog`,
    description: post.description,
    keywords: post.tags.join(', '),
    canonicalUrl: pageCanonical,
    ogImage: `${pageCanonical}cover.webp`,
    currentNav: 'blog',
    rootPath,
    jsonLd: articleJsonLd,
    miniHero: {
      breadcrumbs: [
        { label: 'Home', url: rootPath },
        { label: 'Blog', url: `${rootPath}blog` },
        { label: post.title, url: '#' }
      ],
      icon: ICONS.bookOpen || ICONS.book,
      title: post.title,
      subtext: post.description,
      actions: `
        <a href="${rootPath}category/${post.categorySlug}/" class="btn btn-primary btn-sm">
          ${CATEGORY_ICONS[post.categorySlug] || ICONS.tag} Explore ${escapeHtml(post.category)} Tools
        </a>
        <a href="${rootPath}blog" class="btn btn-secondary btn-sm">
          ${ICONS.arrowLeft} Back to Blog
        </a>
      `
    },
    content: articleContent
  });
}

/**
 * Render the main Blog Index page (/blog/index.html)
 */
function renderBlogIndexPage({
  posts = [],
  allTools = [],
  categories = [],
  renderLayout
}) {
  const rootPath = '../';
  const pageCanonical = 'https://www.staticstack.app/blog/';

  const metaUserIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-flex;vertical-align:-2px;margin-right:0.2rem;flex-shrink:0;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
  const metaFolderIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-flex;vertical-align:-2px;margin-right:0.2rem;flex-shrink:0;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
  const metaCalendarIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-flex;vertical-align:-2px;margin-right:0.2rem;flex-shrink:0;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
  const metaEyeIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-flex;vertical-align:-2px;margin-right:0.2rem;flex-shrink:0;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const viewsMap = loadBlogViewsMap();

  const cardsHtml = posts.map(post => {
    const dotDateParts = (post.date || '').split('-');
    const dotDate = dotDateParts.length === 3 ? `${dotDateParts[1]}.${dotDateParts[2]}.${dotDateParts[0].slice(-2)}` : (post.dateFormatted || '');
    const authorDisplay = escapeHtml(post.author || 'StaticStack');
    const categoryDisplay = escapeHtml(post.category || '');
    const blogViewKey = `blog-${post.slug}`;
    const initialViews = Number(viewsMap[blogViewKey]) || 0;

    return `
      <article class="blog-card" data-category="${escapeHtml(post.categorySlug)}">
        <div>
          <a href="/blog/${post.slug}/" style="display:block; border-radius:var(--radius-md); overflow:hidden; margin-bottom:1.15rem; border:1px solid var(--border-color); box-shadow:var(--shadow-card);">
            <img src="/blog/${post.slug}/cover.webp" alt="${escapeHtml(post.title)}" width="600" height="315" loading="lazy" style="width:100%; height:auto; display:block; aspect-ratio:1200/630; object-fit:cover;">
          </a>

          <div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem; margin-bottom:0.75rem;">
            <span class="blog-category-badge" style="font-size:0.75rem; padding:0.2rem 0.6rem;">
              ${CATEGORY_ICONS[post.categorySlug] || ICONS.tag}
              <span>${escapeHtml(post.category)}</span>
            </span>
            <span style="font-size:0.75rem; color:var(--text-subtle);">${escapeHtml(post.readTime)}</span>
          </div>

          <h3 class="blog-card-title">
            <a href="/blog/${post.slug}/" style="color:inherit; text-decoration:none;">
              ${escapeHtml(post.title)}
            </a>
          </h3>

          <p class="blog-card-excerpt">
            ${escapeHtml(post.excerpt || post.description)}
          </p>
        </div>

        <div>
          <div class="blog-article-meta-bar" aria-label="Article Details" style="display:flex; align-items:center; flex-wrap:nowrap; gap:0.2rem; font-size:0.7rem; white-space:nowrap; overflow:hidden; margin-bottom:0.85rem;">
            <span class="blog-meta-item" style="flex-shrink:0;">
              ${metaUserIcon}<span>${authorDisplay}</span>
            </span>
            <span class="blog-meta-pipe" style="flex-shrink:0;">|</span>
            <span class="blog-meta-item" style="min-width:0; overflow:hidden; text-overflow:ellipsis;">
              ${metaFolderIcon}<a href="/category/${escapeHtml(post.categorySlug)}/" class="blog-meta-link" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${categoryDisplay}</a>
            </span>
            <span class="blog-meta-pipe" style="flex-shrink:0;">|</span>
            <span class="blog-meta-item" style="flex-shrink:0;">
              ${metaCalendarIcon}<span>${dotDate}</span>
            </span>
            <span class="blog-meta-pipe" style="flex-shrink:0;">|</span>
            <span class="blog-meta-item" style="flex-shrink:0;">
              ${metaEyeIcon}<span>view:<span class="blog-meta-num blog-card-view-count" data-key="${escapeHtml(blogViewKey)}">${initialViews.toLocaleString()}</span></span>
            </span>
          </div>
          <div class="blog-card-footer" style="justify-content:flex-end;">
            <a href="/blog/${post.slug}/" style="font-weight:700; color:var(--accent); text-decoration:none; display:inline-flex; align-items:center; gap:0.25rem;">
              Read Article &rarr;
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const seenTopics = new Set();
  const topicLinksHtml = posts
    .filter(post => {
      if (!post.categorySlug || seenTopics.has(post.categorySlug)) return false;
      seenTopics.add(post.categorySlug);
      return true;
    })
    .map(post => {
      const matchedCat = categories.find(c => c.slug === post.categorySlug);
      const label = (matchedCat && (matchedCat.title || matchedCat.name)) || post.category || post.categorySlug;
      return `<button type="button" class="badge badge-neutral blog-cat-filter-btn" data-category="${escapeHtml(post.categorySlug)}" aria-pressed="false" style="border:1px solid transparent; cursor:pointer; font-family:inherit; font-size:0.8rem; padding:0.3rem 0.75rem;">${escapeHtml(label)}</button>`;
    })
    .join('\n          ');

  const blogIndexContent = `
    <div style="padding: 0 0 3.5rem;">
      <!-- Blog Category Pill Filter / Bar -->
      <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom:2rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <span style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-right:0.25rem;">Browse Category:</span>
          <button type="button" class="badge badge-accent blog-cat-filter-btn" data-category="all" aria-pressed="true" style="border:1px solid transparent; cursor:pointer; font-family:inherit; font-size:0.8rem; padding:0.3rem 0.75rem;">All Articles</button>
          ${topicLinksHtml}
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted);">
          <span id="blog-filter-count">${posts.length} Article${posts.length === 1 ? '' : 's'} Published</span>
        </div>
      </div>

      <!-- Articles Grid (Matches Container Width) -->
      <div class="blog-grid">
        ${cardsHtml}
      </div>

      <!-- Callout Banner -->
      <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-xl); padding:2.5rem; text-align:center; box-shadow:var(--shadow-card);">
        <span style="display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; background:var(--accent-light); color:var(--accent); border-radius:var(--radius-full); margin-bottom:1rem;">
          ${ICONS.bookOpen || ICONS.book}
        </span>
        <h3 style="font-size:1.5rem; font-weight:800; color:var(--text-main); margin-bottom:0.5rem;">
          Have a Tutorial or Static Site Workflow to Share?
        </h3>
        <p style="font-size:0.95rem; color:var(--text-muted); max-width:600px; margin:0 auto 1.5rem; line-height:1.6;">
          StaticStack is open-source and community driven. Propose a guide, contribute corrections, or share your Jamstack implementation with thousands of developers.
        </p>
        <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
          <a href="/contribute" class="btn btn-primary">
            ${ICONS.gitPullRequest} Contributing Guide
          </a>
          <a href="/submit" class="btn btn-secondary">
            ${ICONS.plus} Submit a Tool
          </a>
        </div>
      </div>

      <!-- Blog Category Filter -->
      <script>
        (function() {
          var buttons = document.querySelectorAll('.blog-cat-filter-btn');
          var cards = document.querySelectorAll('.blog-card[data-category]');
          var countEl = document.getElementById('blog-filter-count');
          if (!buttons.length || !cards.length) return;
          var total = cards.length;

          function applyFilter(cat, updateUrl) {
            var visible = 0;
            cards.forEach(function(card) {
              var match = (cat === 'all' || card.getAttribute('data-category') === cat);
              card.style.display = match ? '' : 'none';
              if (match) visible++;
            });
            buttons.forEach(function(btn) {
              var active = btn.getAttribute('data-category') === cat;
              btn.classList.toggle('badge-accent', active);
              btn.classList.toggle('badge-neutral', !active);
              btn.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            if (countEl) {
              countEl.textContent = (cat === 'all')
                ? total + ' Article' + (total === 1 ? '' : 's') + ' Published'
                : 'Showing ' + visible + ' of ' + total + ' Articles';
            }
            if (updateUrl && window.history && window.history.replaceState) {
              var url = new URL(window.location.href);
              if (cat === 'all') url.searchParams.delete('category');
              else url.searchParams.set('category', cat);
              window.history.replaceState({}, '', url.pathname + url.search);
            }
          }

          buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
              applyFilter(btn.getAttribute('data-category') || 'all', true);
            });
          });

          try {
            var initialCat = new URLSearchParams(window.location.search).get('category');
            if (initialCat && Array.prototype.some.call(buttons, function(b) { return b.getAttribute('data-category') === initialCat; })) {
              applyFilter(initialCat, false);
            }
          } catch (e) {}
        })();
      </script>

      <!-- Blog Cards Batch View Counter Loader -->
      <script>
        (function() {
          var els = document.querySelectorAll('.blog-card-view-count[data-key]');
          if (!els.length) return;
          function applyViews(views) {
            if (!views || typeof views !== 'object') return;
            els.forEach(function(el) {
              var k = el.getAttribute('data-key');
              if (k && views[k] !== undefined) {
                var n = Number(views[k]);
                if (!isNaN(n) && n >= 0) el.textContent = n.toLocaleString();
              }
            });
          }
          fetch('/community/api?action=tool-views')
            .then(function(res) { return res.ok ? res.json() : null; })
            .then(function(data) {
              if (data && data.views) applyViews(data.views);
              else throw new Error('no views');
            })
            .catch(function() {
              fetch('/asset/json/tool-views-cache.json')
                .then(function(res) { return res.ok ? res.json() : null; })
                .then(function(data) {
                  if (data) applyViews(data.views || data);
                })
                .catch(function() {});
            });
        })();
      </script>
    </div>
  `;

  return renderLayout({
    title: 'Blog & Tutorials - StaticStack',
    description: 'Practical guides, architectural blueprints, and step-by-step tutorials for building fast, secure static websites with zero backend bloat.',
    canonicalUrl: pageCanonical,
    currentNav: 'blog',
    rootPath,
    miniHero: {
      breadcrumbs: [
        { label: 'Home', url: '/' },
        { label: 'Blog', url: '/blog' }
      ],
      icon: ICONS.bookOpen || ICONS.book,
      title: 'StaticStack Blog & Tutorials',
      subtext: 'Deep-dive guides, best practices, and production patterns for modern static HTML, CSS, and serverless workflows.',
      actions: `
        <a href="/search" class="btn btn-primary btn-sm">
          ${ICONS.search} Search All Tools
        </a>
        <a href="/archive" class="btn btn-secondary btn-sm">
          ${ICONS.compass} Master Archive
        </a>
      `
    },
    content: blogIndexContent
  });
}

module.exports = {
  renderBlogArticlePage,
  renderBlogIndexPage
};

