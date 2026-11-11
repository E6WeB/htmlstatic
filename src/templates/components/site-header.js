const { ICONS } = require('../../data/icons');

/**
 * Site Header (Mobile Only < 768px, with Clean Desktop Navigation Drawer)
 */
function renderSiteHeader({ currentNav = '', rootPath = '' }) {
  return `
  <!-- Site Header (Mobile Only < 768px) -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="${rootPath || './'}" class="brand">
        <span class="brand-icon">${ICONS.logo}</span>
        <span>StaticStack</span>
        <span class="brand-badge">.app</span>
      </a>

      <!-- Quick Search Link -->
      <a href="${rootPath}search" class="header-search-btn" aria-label="Search Tools" style="text-decoration:none;">
        <span class="header-search-icon">${ICONS.search}</span>
        <span class="header-search-label">Search...</span>
        <kbd class="header-search-kbd">/</kbd>
      </a>

      <!-- Desktop Clean Nav Menu -->
      <nav class="nav-drawer" aria-label="Main Navigation">
        <ul id="nav-links" class="nav-links">
          <li><a href="${rootPath || './'}" class="nav-link ${currentNav === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="${rootPath}search" class="nav-link ${currentNav === 'search' ? 'active' : ''}">Search</a></li>
          <li><a href="${rootPath}archive" class="nav-link ${currentNav === 'archive' ? 'active' : ''}">Archive</a></li>
          <li><a href="${rootPath}blog" class="nav-link ${currentNav === 'blog' ? 'active' : ''}">Blog</a></li>
          <li><a href="${rootPath}community" class="nav-link ${currentNav === 'community' ? 'active' : ''}">Community</a></li>
          <li><a href="${rootPath}submit" class="nav-link ${currentNav === 'submit' ? 'active' : ''}">Submit</a></li>
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
  `.trim();
}

module.exports = { renderSiteHeader };

