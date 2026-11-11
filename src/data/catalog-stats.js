// ==========================================================================
// Centralized Catalog Statistics & Live Tool Counter
// Single Source of Truth for tool counts and category counts across the site.
// ==========================================================================

const path = require('path');
const { loadCatalog } = require('./parse-readme');

let _catalogCache = null;

/**
 * Loads and caches the full parsed catalog from README.md
 * @param {string} [rootDir] Optional root directory
 * @returns {object} Full catalog data including allTools, categories, and helpers
 */
function getCatalog(rootDir = path.resolve(__dirname, '..', '..')) {
  if (_catalogCache) return _catalogCache;
  _catalogCache = loadCatalog(rootDir);
  return _catalogCache;
}

/**
 * Returns the exact current total tool count across all categories.
 * @param {string} [rootDir] Optional root directory
 * @returns {number} Current tool count (e.g. 144)
 */
function getLiveToolCount(rootDir) {
  const catalog = getCatalog(rootDir);
  return catalog.allTools.length;
}

/**
 * Returns the exact current total category count.
 * @param {string} [rootDir] Optional root directory
 * @returns {number} Current category count (e.g. 29)
 */
function getLiveCategoryCount(rootDir) {
  const catalog = getCatalog(rootDir);
  return catalog.categories.length;
}

/**
 * Returns a summary statistics object for the site.
 * @param {string} [rootDir] Optional root directory
 * @returns {{ totalTools: number, totalCategories: number, allTools: Array, categories: Array }}
 */
function getCatalogStats(rootDir) {
  const catalog = getCatalog(rootDir);
  const totalTools = catalog.allTools.length;
  const totalCategories = catalog.categories.length;

  return {
    ...catalog,
    totalTools,
    totalCategories,
    totalToolsCount: totalTools,
    totalCategoriesCount: totalCategories
  };
}

module.exports = {
  getCatalog,
  getLiveToolCount,
  getLiveCategoryCount,
  getCatalogStats
};

