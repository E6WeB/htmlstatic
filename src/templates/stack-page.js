// ==========================================================================
// Dedicated "My Static Stack" Bookmark Page (`/stack/index.html`)
// ==========================================================================

const { ICONS } = require('../data/icons');
const { renderPostSidebar } = require('./components/sidebar-shared');

function renderStackPage({ renderLayout, allTools = [], cachedViewsMap = {}, getToolSiteIcon = null }) {
  const contentHtml = `
    <div class="tool-page-layout" style="padding-top:0.5rem; padding-bottom:3rem;">
      <!-- Main Stack Content -->
      <div class="tool-page-main">
        <p style="margin:0 0 1.25rem; color:var(--text-muted); font-size:0.875rem; display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
          <span style="display:inline-flex; align-items:center; color:var(--accent);">${ICONS.bookmark}</span>
          <span><strong>How to add tools:</strong> Sign in with GitHub, then click the bookmark icon on any tool card, archive row, or tool page to save it to your stack.</span>
        </p>
        <div id="stack-page-app">
          <div class="stack-page-card" style="text-align:center; padding:2rem;">
            <p style="color:var(--text-muted); margin:0;">Loading your Static Stack…</p>
          </div>
        </div>
        <div style="margin-top:1.25rem; padding:0.85rem 1.1rem; border-radius:var(--radius-md); border:1px solid var(--border-color); background:var(--bg-muted, #f8fafc); color:var(--text-muted); font-size:0.85rem; display:flex; align-items:center; gap:0.55rem;">
          <span style="display:inline-flex; align-items:center; flex-shrink:0; color:var(--accent);">${ICONS.info}</span>
          <span><strong>Retention Notice:</strong> To keep our database lightweight, saved bookmarks are automatically cleared if you haven&rsquo;t logged in for <strong>2 weeks (14 days)</strong>.</span>
        </div>
      </div>

      ${renderPostSidebar({ allTools, cachedViewsMap, getToolSiteIcon, rootPath: '../' })}
    </div>
  `;

  return renderLayout({
    title: 'My Static Stack — Bookmarked Static Web Tools | StaticStack',
    description: 'View, manage, and share your bookmarked static web tools on StaticStack using your GitHub account.',
    currentNav: 'stack',
    rootPath: '../',
    canonicalUrl: 'https://www.staticstack.app/stack/',
    miniHero: {
      breadcrumbs: [
        { label: 'Home', url: '../' },
        { label: 'My Static Stack', url: '#' }
      ],
      icon: ICONS.bookmark,
      title: 'My Static Stack',
      subtext: 'Your personal GitHub-synced bookmark list of static website tools.',
      actions: `
        <a href="/archive" class="btn btn-primary btn-sm">
          ${ICONS.compass} Browse Archive
        </a>
        <a href="/search" class="btn btn-secondary btn-sm">
          ${ICONS.search} Search Tools
        </a>
      `
    },
    content: contentHtml
  });
}

module.exports = { renderStackPage };
