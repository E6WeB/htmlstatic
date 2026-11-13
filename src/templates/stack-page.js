// ==========================================================================
// Dedicated "My Static Stack" Bookmark Page (`/stack/index.html`)
// ==========================================================================

const { ICONS } = require('../data/icons');

function renderStackPage({ renderLayout }) {
  const contentHtml = `
    <section class="page-section" style="padding-top:2rem; padding-bottom:3rem;">
      <div class="container">
        <div style="margin-bottom:1.5rem;">
          <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.4rem;">
            <span style="display:inline-flex; align-items:center; color:var(--accent);">${ICONS.bookmark}</span>
            <h1 style="margin:0; font-size:1.75rem; font-weight:700; color:var(--text-main);">My Static Stack</h1>
          </div>
          <p style="margin:0 0 0.75rem; color:var(--text-muted); font-size:0.95rem;">
            Your personal GitHub-synced bookmark list of static website tools.
          </p>
          <p style="margin:0; color:var(--text-muted); font-size:0.875rem; display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
            <span style="display:inline-flex; align-items:center; color:var(--accent);">${ICONS.bookmark}</span>
            <span><strong>How to add tools:</strong> Sign in with GitHub, then click the bookmark icon on any tool card, archive row, or tool page to save it to your stack.</span>
          </p>
        </div>
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
    </section>
  `;

  return renderLayout({
    title: 'My Static Stack — Bookmarked Static Web Tools | StaticStack',
    description: 'View, manage, and share your bookmarked static web tools on StaticStack using your GitHub account.',
    currentNav: 'stack',
    rootPath: '../',
    content: contentHtml
  });
}

module.exports = { renderStackPage };
