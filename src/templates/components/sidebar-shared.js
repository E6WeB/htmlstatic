const { ICONS, escapeHtml } = require('../../data/icons');
const { getAllBlogPosts } = require('../../data/blog-posts');
const { renderSidebarDonationWidget } = require('../sidebar-donation');

function renderBlogPostsSidebarWidget({ title = 'Blog Post', rootPath = '/' } = {}) {
  const posts = getAllBlogPosts().slice(0, 4);
  const itemsHtml = posts.map((post, idx) => `
              <li>
                <a href="${rootPath}blog/${post.slug}/">
                  <span>${idx + 1}. ${escapeHtml(post.title)}</span>
                  ${ICONS.chevronRight}
                </a>
              </li>`).join('');

  return `
          <!-- Blog Post Widget -->
          <div class="sidebar-widget">
            <div class="sidebar-widget-header">
              <span style="color:var(--accent); display:inline-flex; align-items:center;">${ICONS.book}</span>
              <h4 class="sidebar-widget-title">${escapeHtml(title)}</h4>
            </div>
            <div class="sidebar-widget-body">
              <ul class="blog-toc-list">
                ${itemsHtml}
              </ul>
            </div>
          </div>
  `.trim();
}

function renderKnowGreatToolWidget(submitHref = '/submit') {
  return `
          <!-- Submit Alternative Card -->
          <div class="sidebar-widget" style="background:var(--bg-muted); border-style:dashed;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
              <span style="color:var(--accent); display:inline-flex;">${ICONS.plusCircle}</span>
              <strong style="font-size:0.875rem; color:var(--text-main);">Know a Great Tool?</strong>
            </div>
            <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin-bottom:0.85rem;">
              StaticStack is community curated. Share your favorite static web service or tool with the community.
            </p>
            <a href="${submitHref}" class="btn btn-secondary" style="width:100%; font-size:0.825rem; padding:0.5rem 0.75rem;">
              Submit a Tool &rarr;
            </a>
          </div>
  `.trim();
}

function renderFacebookCommunityWidget() {
  return `
          <!-- Facebook Community Group Card -->
          <div class="sidebar-widget">
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
  `.trim();
}

function renderPostSidebar({ allTools = [], cachedViewsMap = {}, getToolSiteIcon = null, rootPath = '/' } = {}) {
  const featuredTools = [...allTools]
    .map(tool => {
      const key = `htmlstatic-${tool.categorySlug}-${tool.slug}`;
      return {
        ...tool,
        views: Number(cachedViewsMap[key]) || 0
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  const featuredToolsHtml = featuredTools.map(rt => {
    let rtBadgeClass = 'badge-freemium';
    const rtPBadge = (rt.primaryBadge || '').toLowerCase();
    if (rtPBadge.includes('open source')) {
      rtBadgeClass = 'badge-open-source';
    } else if (rtPBadge.includes('freemium')) {
      rtBadgeClass = 'badge-freemium';
    } else if (rtPBadge.includes('free')) {
      rtBadgeClass = 'badge-free';
    } else if (rtPBadge.includes('paid')) {
      rtBadgeClass = 'badge-paid';
    }
    const iconHtml = getToolSiteIcon ? getToolSiteIcon(rt, 20) : ICONS.star;

    return `
      <a href="${rootPath}tools/${rt.categorySlug}/${rt.slug}" class="sidebar-tool-card" title="${escapeHtml(rt.name)} - ${escapeHtml(rt.categoryTitle || '')}">
        <span class="sidebar-tool-icon" style="display:inline-flex; align-items:center; justify-content:center;">
          ${iconHtml}
        </span>
        <div class="sidebar-tool-info">
          <div class="sidebar-tool-name">
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(rt.name)}</span>
            <span class="badge ${rtBadgeClass}" style="font-size:0.65rem; padding:0.1rem 0.4rem;">${escapeHtml(rt.primaryBadge || 'Tool')}</span>
          </div>
          <div class="sidebar-tool-desc">${escapeHtml(rt.tagline || rt.description || '')}</div>
        </div>
      </a>
    `;
  }).join('');

  return `
      <aside class="tool-page-sidebar">
        ${renderBlogPostsSidebarWidget({ title: 'Blog Post', rootPath })}

        ${featuredTools.length > 0 ? `
        <div class="sidebar-widget">
          <div class="sidebar-widget-header" style="justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="color:var(--accent); display:inline-flex; align-items:center;">${ICONS.sparkles}</span>
              <h4 class="sidebar-widget-title">Featured Tools</h4>
            </div>
            <a href="${rootPath}archive" style="font-size:0.75rem; font-weight:700; color:var(--accent); text-decoration:none;">View All &rarr;</a>
          </div>
          <div class="sidebar-widget-body" style="display:flex; flex-direction:column; gap:0.4rem;">
            ${featuredToolsHtml}
          </div>
        </div>
        ` : ''}

        ${renderSidebarDonationWidget()}

        ${renderKnowGreatToolWidget(`${rootPath}submit`)}

        ${renderFacebookCommunityWidget()}
      </aside>
  `.trim();
}

module.exports = {
  renderBlogPostsSidebarWidget,
  renderKnowGreatToolWidget,
  renderFacebookCommunityWidget,
  renderPostSidebar
};

