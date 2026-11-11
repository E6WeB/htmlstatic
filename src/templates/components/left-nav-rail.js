const { ICONS } = require('../../data/icons');
const { getLiveToolCount } = require('../../data/catalog-stats');

/**
 * Shared Left Navigation Rail (Desktop & Tablet >= 768px)
 */
function renderNavRail({ currentNav = '', totalToolsCount = null, rootPath = '' } = {}) {
  const toolCount = totalToolsCount !== null && totalToolsCount !== undefined ? totalToolsCount : getLiveToolCount();
  return `
  <!-- Left Navigation Rail (Desktop & Tablet >= 768px) -->
  <aside class="left-nav-rail" aria-label="Desktop Navigation Rail">
    <div class="rail-top">
      <a href="${rootPath || './'}" class="rail-brand" aria-label="StaticStack Home">
        ${ICONS.logo}
        <span class="rail-tooltip">StaticStack.app</span>
      </a>

      <nav class="rail-nav" aria-label="Primary Navigation">
        <ul class="rail-list">
          <li>
            <a href="${rootPath || './'}" class="rail-item ${currentNav === 'home' ? 'active' : ''}" aria-label="Home">
              ${ICONS.home}
              <span class="rail-tooltip">Home</span>
            </a>
          </li>
          <li>
            <a href="${rootPath}search" class="rail-item ${currentNav === 'search' ? 'active' : ''}" aria-label="Search Tools">
              ${ICONS.search}
              <span class="rail-tooltip">Search</span>
            </a>
          </li>
          <li>
            <a href="${rootPath}archive" class="rail-item ${currentNav === 'archive' ? 'active' : ''}" aria-label="Master Archive">
              ${ICONS.compass}
              <span class="rail-tooltip">Archive (${toolCount} Tools)</span>
            </a>
          </li>
          <li>
            <a href="${rootPath}community" class="rail-item ${currentNav === 'community' ? 'active' : ''}" aria-label="Community">
              ${ICONS.users}
              <span class="rail-tooltip">Community</span>
            </a>
          </li>
          <li>
            <a href="${rootPath}blog" class="rail-item ${currentNav === 'blog' ? 'active' : ''}" aria-label="Blog & Guides">
              ${ICONS.bookOpen || ICONS.book}
              <span class="rail-tooltip">Blog & Guides</span>
            </a>
          </li>
          <li>
            <a href="${rootPath}contact" class="rail-item ${currentNav === 'contact' ? 'active' : ''}" aria-label="Contact & Connect">
              ${ICONS.mail}
              <span class="rail-tooltip">Contact & Connect</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="rail-item" aria-label="GitHub Repository">
              ${ICONS.github}
              <span class="rail-tooltip">Star on GitHub</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="rail-bottom">
      <button type="button" id="stackbot-btn" aria-label="Open StackBot chat">
        <span class="stackbot-icon" aria-hidden="true"></span>
        <span class="rail-tooltip">Ask StackBot</span>
      </button>
      <a href="${rootPath}submit" class="rail-action-btn ${currentNav === 'submit' ? 'active' : ''}" aria-label="Submit a Tool">
        ${ICONS.plus}
        <span class="rail-tooltip">Submit a Tool</span>
      </a>
      <a href="${rootPath}thankyou" class="rail-item ${currentNav === 'thankyou' ? 'active' : ''}" aria-label="Credits & Thanks">
        ${ICONS.heart}
        <span class="rail-tooltip">Credits & Thanks</span>
      </a>
    </div>
  </aside>
  `.trim();
}

module.exports = { renderNavRail };

