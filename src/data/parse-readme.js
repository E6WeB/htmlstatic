// ==========================================================================
// README Catalog Parser, Local Tool Icon Resolver & Random Tool Selector
// ==========================================================================

const fs = require('fs');
const path = require('path');
const {
  parseBadges,
  getDomainFromUrl,
  getBlackWhiteFallbackSvg,
  extractToolTags
} = require('./icons');

function loadCatalog(rootDir) {
  const readmeContent = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8');
  const sections = readmeContent.split(/\n(?=##\s+)/);
  const categories = [];
  const allTools = [];

  for (const section of sections) {
    const headerMatch = section.match(/^##\s+([^\n\r]+)/);
    if (!headerMatch) continue;
    const title = headerMatch[1].trim();

    if ([
      'Table of Contents',
      'How to Contribute',
      'Submission Guidelines',
      'Help Grow the Collection',
      'Community & Discussion',
      'License'
    ].includes(title)) {
      continue;
    }
    if (!section.includes('<table') || !section.includes('<tbody>')) continue;

    const descMatch = section.match(/##[^\n]+\n+([\s\S]*?)(?=<table)/);
    const description = descMatch ? descMatch[1].trim() : '';

    const tbodyMatch = section.match(/<tbody>([\s\S]*?)<\/tbody>/);
    if (!tbodyMatch) continue;

    const rowRegex = /<tr>\s*<td>\s*<a\s+href="([^"]+)">([^<]+)<\/a>\s*<\/td>\s*<td>\s*([\s\S]*?)\s*<\/td>\s*<td>\s*([\s\S]*?)\s*<\/td>\s*<td>\s*<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>\s*<\/td>\s*<\/tr>/g;
    let rowMatch;
    const tools = [];

    while ((rowMatch = rowRegex.exec(tbodyMatch[1])) !== null) {
      const rawPath = rowMatch[1].trim();
      const toolName = rowMatch[2].trim();
      const toolDesc = rowMatch[3].trim().replace(/\s+/g, ' ');
      const badgeHtml = rowMatch[4].trim();
      const websiteUrl = rowMatch[5].trim();
      const websiteLabel = rowMatch[6].trim();

      const parts = rawPath.split('/');
      const isToolsPrefix = parts[0] === 'tools';
      const folder = isToolsPrefix ? parts[1] : parts[0];
      const file = isToolsPrefix ? (parts[2] || '') : (parts[1] || '');
      const toolSlug = file.replace(/\.md$/, '');

      let tagline = toolDesc;
      let overview = '';
      let rawMd = '';
      if (fs.existsSync(path.join(rootDir, rawPath))) {
        rawMd = fs.readFileSync(path.join(rootDir, rawPath), 'utf8');
        const quoteMatch = rawMd.match(/>\s*([^\n\r]+)/);
        if (quoteMatch) tagline = quoteMatch[1].trim();
        const overviewMatch = rawMd.match(/##\s+Overview\s*\n+([\s\S]*?)(?=\n+---|\n+##|$)/);
        if (overviewMatch) overview = overviewMatch[1].trim().replace(/\n+/g, ' ');
      }

      const badges = parseBadges(badgeHtml);
      const primaryBadge = badges[0] || 'Free';
      const tags = extractToolTags(rawMd, folder, toolSlug, primaryBadge, toolName);

      const toolObj = {
        name: toolName,
        slug: toolSlug,
        relPath: rawPath,
        folder: folder,
        categorySlug: folder,
        categoryTitle: title,
        description: toolDesc,
        tagline: tagline,
        overview: overview,
        rawMd: rawMd,
        tags: tags,
        badges: badges,
        primaryBadge: primaryBadge,
        websiteUrl: websiteUrl,
        websiteLabel: websiteLabel
      };

      tools.push(toolObj);
      allTools.push(toolObj);
    }

    if (tools.length > 0) {
      const slug = tools[0].folder;
      categories.push({
        title: title,
        slug: slug,
        description: description,
        tools: tools
      });
    }
  }

  function getToolSiteIcon(tool, size = 18, extraStyle = '') {
    let websiteUrl = tool.websiteUrl;
    let categorySlug = tool.categorySlug || tool.folder;
    const slug = tool.slug;

    if ((!websiteUrl || !categorySlug) && slug) {
      const found = allTools.find(at => at.slug === slug);
      if (found) {
        if (!websiteUrl) websiteUrl = found.websiteUrl;
        if (!categorySlug) categorySlug = found.categorySlug || found.folder;
      }
    }

    if (categorySlug && slug) {
      const localIconDiskPath = path.join(rootDir, 'tools', categorySlug, `${slug}-icon.webp`);
      if (fs.existsSync(localIconDiskPath)) {
        const localIconUrl = `/tools/${categorySlug}/${slug}-icon.webp`;
        const styleAttr = extraStyle ? ` style="${extraStyle.trim()}"` : '';
        return `<img src="${localIconUrl}" width="${size}" height="${size}" class="tool-siteicon" alt="" loading="lazy" decoding="async"${styleAttr}>`;
      }
    }

    const domain = getDomainFromUrl(websiteUrl);
    const bwFallback = getBlackWhiteFallbackSvg(tool.name, size);
    const styleAttr = extraStyle ? ` style="${extraStyle.trim()}"` : '';

    if (!domain) {
      return `<img src="${bwFallback}" width="${size}" height="${size}" class="tool-siteicon" alt="" decoding="async"${styleAttr}>`;
    }

    const faviconUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    return `<img src="${faviconUrl}" width="${size}" height="${size}" class="tool-siteicon" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${bwFallback}';"${styleAttr}>`;
  }

  function getRandomTools(currentSlug, count = 4) {
    const otherTools = allTools.filter(t => t.slug !== currentSlug);
    let hash = 0;
    for (let i = 0; i < currentSlug.length; i++) {
      hash = (hash << 5) - hash + currentSlug.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    const shuffled = [...otherTools].sort((a, b) => {
      const valA = ((a.slug.charCodeAt(0) * 31 + a.slug.length * 17 + seed) % 97);
      const valB = ((b.slug.charCodeAt(0) * 31 + b.slug.length * 17 + seed) % 97);
      return valA - valB;
    });

    const picked = [];
    const categoriesSeen = new Set();
    for (const t of shuffled) {
      if (!categoriesSeen.has(t.categorySlug)) {
        categoriesSeen.add(t.categorySlug);
        picked.push(t);
        if (picked.length >= count) break;
      }
    }

    if (picked.length < count) {
      for (const t of shuffled) {
        if (!picked.some(p => p.slug === t.slug)) {
          picked.push(t);
          if (picked.length >= count) break;
        }
      }
    }

    return picked;
  }

  const toolsData = categories.map(c => ({
    title: c.title,
    slug: c.slug,
    description: c.description,
    toolsCount: c.tools.length,
    tools: c.tools.map(t => ({
      name: t.name,
      slug: t.slug,
      relPath: t.relPath,
      folder: t.folder,
      description: t.description,
      badges: t.badges,
      websiteUrl: t.websiteUrl,
      websiteLabel: t.websiteLabel
    }))
  }));

  return {
    categories,
    allTools,
    uniqueToolsCount: allTools.length,
    getToolSiteIcon,
    getRandomTools,
    toolsData
  };
}

module.exports = {
  loadCatalog
};

