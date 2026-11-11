const { ICONS } = require('../../data/icons');
const { getLiveToolCount } = require('../../data/catalog-stats');

/**
 * Mobile Bottom Navigation Bar (Phones < 768px)
 */
function renderMobileBottomNav({ currentNav = '', rootPath = '' }) {
  return `
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
  `.trim();
}

/**
 * Full-Screen Mobile Navigation Overlay Dialog Modal
 */
function renderMobileNavModal({ currentNav = '', totalToolsCount = null, rootPath = '' } = {}) {
  const toolCount = totalToolsCount !== null && totalToolsCount !== undefined ? totalToolsCount : getLiveToolCount();
  return `
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
            <span class="mobile-nav-badge">${toolCount} Tools</span>
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
  `.trim();
}

module.exports = {
  renderMobileBottomNav,
  renderMobileNavModal
};

