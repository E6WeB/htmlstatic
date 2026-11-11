/**
 * Blog Page Templates
 * Renders:
 * 1. Dedicated Blog Article Pages (/blog/<slug>/index.html) with 2-column layout (content left, sidebar right)
 * 2. Blog Index / Directory Page (/blog/index.html)
 */

const { ICONS, CATEGORY_ICONS, escapeHtml } = require('../data/icons');
const { renderSidebarDonationWidget } = require('./sidebar-donation');

/**
 * Render a single blog article page
 */
function renderBlogArticlePage({
  post,
  parsedHtml,
  allTools = [],
  categories = [],
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

  const articleContent = `
    <!-- Blog 2-Column Responsive Layout (Main Content Left + Sidebar Right) -->
    <div class="blog-layout">
      <!-- Main Content (Left Column) -->
      <div class="blog-main">
        <article class="blog-article-card">
          <!-- Article Meta Header -->
          <div class="blog-article-meta">
            <a href="${rootPath}category/${post.categorySlug}/" class="blog-category-badge">
              ${CATEGORY_ICONS[post.categorySlug] || ICONS.tag}
              <span>${escapeHtml(post.category)}</span>
            </a>
            <span>&bull;</span>
            <span class="blog-meta-badge">
              ${ICONS.sparkles}
              <span>${escapeHtml(post.dateFormatted)}</span>
            </span>
            <span>&bull;</span>
            <span class="blog-meta-badge">
              ${ICONS.eye}
              <span>${escapeHtml(post.readTime)}</span>
            </span>
            <span>&bull;</span>
            <span class="blog-meta-badge">
              By <strong>${escapeHtml(post.author)}</strong>
            </span>
          </div>

          <!-- Article Cover Banner -->
          <div class="blog-cover-wrapper" style="margin-bottom:2rem; border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--border-color); box-shadow:var(--shadow-card);">
            <img src="cover.webp" alt="${escapeHtml(post.title)}" width="1200" height="630" style="width:100%; height:auto; display:block; aspect-ratio:1200/630; object-fit:cover;">
          </div>

          <!-- Article Markdown Body -->
          <div class="markdown-body">
            ${parsedHtml}
          </div>

          <!-- Topics / Tags -->
          ${tagsHtml}

          <!-- Discussion Section via Giscus -->
          <section class="tool-comments-section" style="margin-top:2.5rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-card);">
            <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
              <div style="display:flex; align-items:center; gap:0.55rem;">
                <span style="color:var(--accent); display:inline-flex; align-items:center;">${ICONS.comments}</span>
                <h3 style="font-size:1.25rem; font-weight:700; margin:0; color:var(--text-main);">Community Discussion</h3>
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
                    data-reactions-enabled="1"
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

  const cardsHtml = posts.map(post => {
    return `
      <article class="blog-card">
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
          <div class="blog-card-footer">
            <span>By ${escapeHtml(post.author)} &middot; ${escapeHtml(post.dateFormatted)}</span>
            <a href="/blog/${post.slug}/" style="font-weight:700; color:var(--accent); text-decoration:none; display:inline-flex; align-items:center; gap:0.25rem;">
              Read Article &rarr;
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  const blogIndexContent = `
    <div style="padding: 0 0 3.5rem;">
      <!-- Blog Category Pill Filter / Bar -->
      <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom:2rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
        <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <span style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-right:0.25rem;">Browse Topics:</span>
          <a href="/blog" class="badge badge-accent" style="text-decoration:none; font-size:0.8rem; padding:0.3rem 0.75rem;">All Articles</a>
          <a href="/category/contact-forms/" class="badge badge-neutral" style="text-decoration:none; font-size:0.8rem; padding:0.3rem 0.75rem;">Contact Forms</a>
          <a href="/category/hosting-deployment/" class="badge badge-neutral" style="text-decoration:none; font-size:0.8rem; padding:0.3rem 0.75rem;">Hosting</a>
          <a href="/category/security-spam-protection/" class="badge badge-neutral" style="text-decoration:none; font-size:0.8rem; padding:0.3rem 0.75rem;">Security &amp; Spam</a>
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted);">
          <span>${posts.length} Article${posts.length === 1 ? '' : 's'} Published</span>
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

