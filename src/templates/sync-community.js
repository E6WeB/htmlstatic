const fs = require('fs');
const path = require('path');
const {
  renderNavRail,
  renderSiteHeader,
  renderMobileBottomNav,
  renderMobileNavModal,
  renderSiteFooter
} = require('./layout');
const { getLiveToolCount, getLiveCategoryCount } = require('../data/catalog-stats');

/**
 * Synchronizes shared site layout components (left-nav-rail, mobile nav,
 * site-header, mobile nav modal, and site footer) into standalone community pages.
 */
function syncCommunityFile(filePath, { allTools = null, categories = null, siteViewsFormatted = '0' } = {}) {
  if (!fs.existsSync(filePath)) return;

  const toolCount = (allTools && Array.isArray(allTools)) ? allTools.length : getLiveToolCount();
  const catCount = (categories && Array.isArray(categories)) ? categories.length : getLiveCategoryCount();

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Sync Left Nav Rail
  const navRailHtml = renderNavRail({
    currentNav: 'community',
    totalToolsCount: toolCount,
    rootPath: '/'
  });
  html = html.replace(/<aside class="left-nav-rail"[\s\S]*?<\/aside>/, navRailHtml);

  // 2. Sync Mobile Bottom Nav
  const mobileBottomNavHtml = renderMobileBottomNav({
    currentNav: 'community',
    rootPath: '/'
  });
  html = html.replace(/<nav class="mobile-bottom-nav"[\s\S]*?<\/nav>/, mobileBottomNavHtml);

  // 3. Sync Site Header
  const siteHeaderHtml = renderSiteHeader({
    currentNav: 'community',
    rootPath: '/'
  });
  html = html.replace(/<header class="site-header"[\s\S]*?<\/header>/, siteHeaderHtml);

  // 4. Sync Mobile Nav Modal (dialog overlay)
  const mobileNavModalHtml = renderMobileNavModal({
    currentNav: 'community',
    totalToolsCount: toolCount,
    rootPath: '/'
  });
  html = html.replace(/<div id="mobile-nav-modal" class="mobile-nav-modal"[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/, mobileNavModalHtml);

  // 5. Sync Site Footer
  const siteFooterHtml = renderSiteFooter({
    allTools: allTools || [],
    categories: categories || [],
    rootPath: '/',
    siteViewsFormatted
  });
  html = html.replace(/<footer class="site-footer"[\s\S]*?<\/footer>/, siteFooterHtml);

  // 6. Ensure global design system CSS link is up-to-date (v=14)
  html = html.replace(/\/asset\/css\/style\.css\?v=\d+/g, '/asset/css/style.css?v=14');

  fs.writeFileSync(filePath, html, 'utf8');
}

function syncAllCommunityPages({ allTools, categories, siteViewsFormatted = '0', rootDir = process.cwd() }) {
  const communityIndex = path.join(rootDir, 'community', 'index.html');
  const communityTopic = path.join(rootDir, 'community', 'topic.html');

  syncCommunityFile(communityIndex, { allTools, categories, siteViewsFormatted });
  syncCommunityFile(communityTopic, { allTools, categories, siteViewsFormatted });
}

module.exports = {
  syncCommunityFile,
  syncAllCommunityPages
};

