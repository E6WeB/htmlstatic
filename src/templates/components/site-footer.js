const { ICONS } = require('../../data/icons');
const { getLiveToolCount, getLiveCategoryCount } = require('../../data/catalog-stats');

/**
 * Pre-Footer Call to Action Section
 */
function renderPreFooterCta({ rootPath = '' }) {
  return `
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
  `.trim();
}

/**
 * Global Site Footer
 */
function renderSiteFooter({ allTools = null, categories = null, rootPath = '', siteViewsFormatted = '0' } = {}) {
  const toolCount = (allTools && Array.isArray(allTools)) ? allTools.length : getLiveToolCount();
  const catCount = (categories && Array.isArray(categories)) ? categories.length : getLiveCategoryCount();
  return `
  <!-- Site Footer -->
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
            <span>${toolCount} Tools &bull; ${catCount} Categories</span>
          </div>
          <div style="margin-top:0.75rem;">
            <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display:inline-flex; align-items:center; gap:0.4rem;">
              ${ICONS.github}
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Directory</h4>
          <ul class="footer-links">
            <li><a href="${rootPath}search">Search Tools</a></li>
            <li><a href="${rootPath}archive">Master Archive</a></li>
            <li><a href="${rootPath}blog">Blog &amp; Guides</a></li>
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
            <li><a href="${rootPath}stats" rel="nofollow">Site Stats</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; <span id="year">2026</span> StaticStack. Hosted by: <a href="https://wasmer.io" target="_blank" rel="noopener noreferrer">wasmer.io</a> &middot; Created by: <a href="https://www.e6web.com/contact/" target="_blank" rel="noopener">E6WeB</a> &middot; <a href="/stats" rel="nofollow" class="footer-stat-text" title="Total Site Views &middot; StaticStack Analytics"><span id="footer-stat-count">${siteViewsFormatted}</span> views</a></p>
      </div>
    </div>
  </footer>
  `.trim();
}

module.exports = {
  renderPreFooterCta,
  renderSiteFooter
};

