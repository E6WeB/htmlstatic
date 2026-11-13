// ==========================================================================
// StaticStack Discovery Badges ("Verified Live", "New", "Trending")
// - Verified Live: backed by asset/json/link-health.json
// - New: git commit addition date strictly after NEW_TOOL_CUTOFF, capped at MAX_NEW_BADGES
// - Trending: top MAX_TRENDING_BADGES active tools by view count in tool-views-cache.json
// ==========================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { escapeHtml } = require('./icons');

const NEW_TOOL_CUTOFF = '2026-11-12';
const MAX_NEW_BADGES = 6;
const MAX_TRENDING_BADGES = 6;

/**
 * Load first-added YYYY-MM-DD dates for tools/<cat>/<slug>.md from git log.
 */
function getToolAddedDates(rootDir) {
  const dateMap = {};
  try {
    const out = execSync('git log --diff-filter=A --format=COMMIT:%cs --name-only -- tools/', {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });
    let currentDate = '';
    for (const rawLine of out.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.startsWith('COMMIT:')) {
        currentDate = line.slice(7);
      } else if (currentDate && line.endsWith('.md')) {
        const normalized = line.replace(/\\/g, '/');
        if (!dateMap[normalized]) {
          dateMap[normalized] = currentDate;
        }
      }
    }
  } catch {
    // Graceful no-op when git is unavailable
  }
  return dateMap;
}

/**
 * Load asset/json/link-health.json if present.
 */
function loadLinkHealthMap(rootDir) {
  const healthPath = path.join(rootDir, 'asset', 'json', 'link-health.json');
  try {
    if (fs.existsSync(healthPath)) {
      return JSON.parse(fs.readFileSync(healthPath, 'utf8'));
    }
  } catch {}
  return {};
}

/**
 * Compute discovery metadata and reusable badge renderers for the catalog.
 */
function createDiscoveryContext({
  allTools = [],
  rootDir,
  cachedViewsMap = {},
  linkHealthMap = null
}) {
  const healthMap = linkHealthMap || loadLinkHealthMap(rootDir);
  const gitDates = getToolAddedDates(rootDir);

  const activeTools = allTools.filter(t => t.categorySlug !== 'inactive');

  // Top N most-viewed active tools
  const trendingSlugs = new Set(
    activeTools
      .map(t => {
        const key = `htmlstatic-${t.categorySlug}-${t.slug}`;
        return { slug: t.slug, views: Number(cachedViewsMap[key]) || 0 };
      })
      .filter(item => item.views > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, MAX_TRENDING_BADGES)
      .map(item => item.slug)
  );

  // Newest N active tools added strictly after NEW_TOOL_CUTOFF
  const addedDateBySlug = {};
  const newCandidates = [];
  for (const t of activeTools) {
    const mdRelPath = `tools/${t.categorySlug}/${t.slug}.md`;
    const addedDate = t.addedAt || gitDates[mdRelPath] || '';
    if (addedDate) {
      addedDateBySlug[t.slug] = addedDate;
      if (addedDate > NEW_TOOL_CUTOFF) {
        newCandidates.push({ slug: t.slug, addedDate });
      }
    }
  }
  newCandidates.sort((a, b) => b.addedDate.localeCompare(a.addedDate));
  const newSlugs = new Set(newCandidates.slice(0, MAX_NEW_BADGES).map(item => item.slug));

  function getHealth(tool) {
    return healthMap[tool.slug] || null;
  }

  function isVerifiedLive(tool) {
    if (tool.categorySlug === 'inactive') return false;
    const h = getHealth(tool);
    return Boolean(h && h.status === 'online');
  }

  function isNew(tool) {
    return newSlugs.has(tool.slug);
  }

  function isTrending(tool) {
    return trendingSlugs.has(tool.slug);
  }

  function renderVerifiedDot(tool) {
    if (!isVerifiedLive(tool)) return '';
    const h = getHealth(tool);
    const checkedLabel = h && h.checked_at ? ` • Checked ${h.checked_at}` : '';
    return `<span class="verified-live-dot" title="Website verified live${escapeHtml(checkedLabel)}" aria-label="Website verified live"></span>`;
  }

  function renderDiscoveryPills(tool, { compact = false } = {}) {
    const pills = [];
    const styleAttr = compact ? ' style="font-size:0.675rem; padding:0.12rem 0.45rem;"' : '';
    if (isNew(tool)) {
      const addedDate = addedDateBySlug[tool.slug] || '';
      const titleAttr = addedDate ? ` title="Added ${escapeHtml(addedDate)}"` : '';
      pills.push(`<span class="badge badge-new"${styleAttr}${titleAttr}>New</span>`);
    }
    if (isTrending(tool)) {
      pills.push(`<span class="badge badge-trending"${styleAttr} title="Popular on StaticStack">Trending</span>`);
    }
    return pills.join(' ');
  }

  return {
    healthMap,
    isVerifiedLive,
    isNew,
    isTrending,
    getHealth,
    renderVerifiedDot,
    renderDiscoveryPills
  };
}

module.exports = {
  NEW_TOOL_CUTOFF,
  MAX_NEW_BADGES,
  MAX_TRENDING_BADGES,
  createDiscoveryContext
};

