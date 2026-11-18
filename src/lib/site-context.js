const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const {
  ICONS,
  CATEGORY_ICONS,
  escapeHtml,
  renderStackSaveBtn
} = require('../data/icons');
const { getCatalogStats } = require('../data/catalog-stats');
const { getMinifiedBaseCss } = require('../styles/base-css');
const { createLayoutRenderer } = require('../templates/layout');
const { renderToolPage } = require('../templates/tool-page');
const { renderCategoryPage } = require('../templates/category-page');
const { renderSidebarDonationWidget } = require('../templates/sidebar-donation');
const { syncAllCommunityPages } = require('../templates/sync-community');
const { getAllBlogPosts } = require('../data/blog-posts');
const { renderBlogArticlePage, renderBlogIndexPage } = require('../templates/blog-page');
const { generateLlmsFiles } = require('../templates/llms-txt');
const { createDiscoveryContext } = require('../data/discovery-badges');
const { renderStackPage } = require('../templates/stack-page');
const { renderToolBadgeSvg } = require('../templates/badge');

let markedConfigured = false;
function configureMarked() {
  if (markedConfigured) return;
  markedConfigured = true;
  marked.setOptions({
    gfm: true,
    breaks: false
  });
  marked.use({
    renderer: {
      heading({ tokens, depth, text }) {
        const parsedText = this.parser.parseInline(tokens);
        const cleanText = text.replace(/<[^>]*>/g, '');
        const slugGfm = cleanText.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
        const slugLiteral = cleanText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s/g, '-');
        const slugNoParens = cleanText.toLowerCase().replace(/\s*\([^)]*\)/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

        let extraAnchors = '';
        if (slugLiteral && slugLiteral !== slugGfm) {
          extraAnchors += `<span id="${slugLiteral}" class="heading-anchor-target"></span>`;
        }
        if (slugNoParens && slugNoParens !== slugGfm && slugNoParens !== slugLiteral) {
          extraAnchors += `<span id="${slugNoParens}" class="heading-anchor-target"></span>`;
        }

        return `<h${depth} id="${slugGfm}">${extraAnchors}${parsedText}</h${depth}>\n`;
      }
    }
  });
}

let cachedContext = null;

function getSiteContext() {
  if (cachedContext) return cachedContext;

  configureMarked();

  const ROOT_DIR = path.resolve(__dirname, '../..');
  const ASSET_DIR = path.join(ROOT_DIR, 'asset');

  const {
    categories,
    allTools,
    uniqueToolsCount,
    getToolSiteIcon,
    getRandomTools,
    toolsData
  } = getCatalogStats(ROOT_DIR);

  const renderLayout = createLayoutRenderer({ allTools, categories });

  let cachedViewsMap = {};
  const toolViewsJsonPath = path.join(ASSET_DIR, 'json', 'tool-views-cache.json');
  try {
    if (fs.existsSync(toolViewsJsonPath)) {
      cachedViewsMap = JSON.parse(fs.readFileSync(toolViewsJsonPath, 'utf8'));
    }
  } catch (e) {}

  let cachedLikesMap = {};
  const toolLikesJsonPath = path.join(ASSET_DIR, 'json', 'tool-likes-cache.json');
  try {
    if (fs.existsSync(toolLikesJsonPath)) {
      cachedLikesMap = JSON.parse(fs.readFileSync(toolLikesJsonPath, 'utf8'));
    }
  } catch (e) {}

  const initialTotalLikes = Object.values(cachedLikesMap).reduce((sum, v) => sum + (Number(v) || 0), 0);

  const discovery = createDiscoveryContext({
    allTools,
    rootDir: ROOT_DIR,
    cachedViewsMap
  });

  const blogPosts = getAllBlogPosts();

  cachedContext = {
    ROOT_DIR,
    ASSET_DIR,
    fs,
    path,
    marked,
    ICONS,
    CATEGORY_ICONS,
    escapeHtml,
    renderStackSaveBtn,
    getMinifiedBaseCss,
    renderToolPage,
    renderCategoryPage,
    renderSidebarDonationWidget,
    syncAllCommunityPages,
    renderBlogArticlePage,
    renderBlogIndexPage,
    generateLlmsFiles,
    renderStackPage,
    renderToolBadgeSvg,
    categories,
    allTools,
    uniqueToolsCount,
    getToolSiteIcon,
    getRandomTools,
    toolsData,
    renderLayout,
    cachedViewsMap,
    cachedLikesMap,
    initialTotalLikes,
    discovery,
    blogPosts
  };

  return cachedContext;
}

module.exports = { getSiteContext };

