/**
 * Generators for AI-ready /llms.txt and /llms-full.txt files
 * following the llmstxt.org Markdown specification.
 */

const DEFAULT_BASE_URL = 'https://www.staticstack.app';

/**
 * Normalize whitespace so multi-line descriptions stay single-line in Markdown lists.
 */
function cleanText(value) {
  if (!value) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

/**
 * Generate both /llms.txt (concise directory index) and /llms-full.txt (complete catalog).
 */
function generateLlmsFiles({ categories, allTools, blogPosts, baseUrl = DEFAULT_BASE_URL }) {
  const cleanBase = baseUrl.replace(/\/+$/, '');

  const llmsLines = [
    '# StaticStack',
    '',
    `> A curated directory of ${allTools.length} tools, APIs, and services across ${categories.length} categories, plus ${blogPosts.length} engineering guides for building fast, zero-bloat static websites.`,
    '',
    'StaticStack helps developers replace heavy monolithic backends with composable static-first tooling (SSGs, edge hosting, serverless forms, static search, auth, CMS, and privacy-respecting utilities).',
    '',
    '## Core Pages',
    '',
    `- [Home](${cleanBase}/): Main StaticStack directory and category explorer.`,
    `- [Search](${cleanBase}/search): Client-side instant search across all ${allTools.length} tools and ${categories.length} categories.`,
    `- [Archive](${cleanBase}/archive): Complete alphabetical & category archive of static web tools.`,
    `- [Blog](${cleanBase}/blog): In-depth guides on static site architecture, migration, and performance.`,
    `- [Community](${cleanBase}/community): Developer discussions, project showcases, and Q&A.`,
    `- [Submit a Tool](${cleanBase}/submit): Suggest a static-friendly tool or service for inclusion.`,
    `- [Contribute](${cleanBase}/contribute): How to contribute to StaticStack on GitHub.`,
    '',
    `## Categories (${categories.length})`,
    ''
  ];

  categories.forEach(cat => {
    const desc = cleanText(cat.description);
    llmsLines.push(
      `- [${cat.title}](${cleanBase}/category/${cat.slug}/): ${desc} (${cat.tools.length} tools)`
    );
  });

  llmsLines.push('', `## Blog Guides (${blogPosts.length})`, '');

  blogPosts.forEach(post => {
    const desc = cleanText(post.description || post.excerpt);
    llmsLines.push(`- [${post.title}](${cleanBase}/blog/${post.slug}/): ${desc}`);
  });

  llmsLines.push(
    '',
    '## Full Reference',
    '',
    `- [Complete StaticStack Catalog](${cleanBase}/llms-full.txt): Full Markdown reference of all ${allTools.length} tools, official URLs, tags, badges, and ${blogPosts.length} blog guides.`,
    `- [XML Sitemap](${cleanBase}/sitemap.xml): Canonical URL index.`,
    ''
  );

  const fullLines = [
    '# StaticStack — Complete Tool & Guide Catalog',
    '',
    `> Complete machine-readable Markdown catalog of ${allTools.length} static web tools across ${categories.length} categories and ${blogPosts.length} blog guides.`,
    '',
    `Canonical Site: ${cleanBase}/`,
    `Concise Index: ${cleanBase}/llms.txt`,
    '',
    `## Blog Guides (${blogPosts.length})`,
    ''
  ];

  blogPosts.forEach(post => {
    const summary = cleanText(post.description || post.excerpt);
    const tags = Array.isArray(post.tags) && post.tags.length ? post.tags.join(', ') : '';
    fullLines.push(`### ${post.title}`);
    fullLines.push(`- URL: ${cleanBase}/blog/${post.slug}/`);
    if (post.date) fullLines.push(`- Published: ${post.date}${post.readTime ? ` (${post.readTime})` : ''}`);
    if (post.category) fullLines.push(`- Category: ${post.category}`);
    if (summary) fullLines.push(`- Summary: ${summary}`);
    if (tags) fullLines.push(`- Tags: ${tags}`);
    fullLines.push('');
  });

  fullLines.push(`## Tool Directory by Category (${categories.length} Categories, ${allTools.length} Tools)`, '');

  categories.forEach(cat => {
    const catDesc = cleanText(cat.description);
    fullLines.push(`### ${cat.title} (${cat.tools.length} tools)`);
    fullLines.push(`Category Page: ${cleanBase}/category/${cat.slug}/`);
    if (catDesc) fullLines.push(`${catDesc}`);
    fullLines.push('');

    cat.tools.forEach(tool => {
      const desc = cleanText(tool.tagline || tool.description);
      const badges = (Array.isArray(tool.badges) && tool.badges.length
        ? tool.badges
        : [tool.primaryBadge]
      ).filter(Boolean);
      const tags = Array.isArray(tool.tags) ? tool.tags.filter(Boolean) : [];

      fullLines.push(`- **${tool.name}**${desc ? ` — ${desc}` : ''}`);
      fullLines.push(`  - StaticStack Page: ${cleanBase}/tools/${cat.slug}/${tool.slug}`);
      if (tool.websiteUrl) fullLines.push(`  - Official Website: ${tool.websiteUrl}`);
      if (badges.length) fullLines.push(`  - Badges: ${badges.join(', ')}`);
      if (tags.length) fullLines.push(`  - Tags: ${tags.join(', ')}`);
    });

    fullLines.push('');
  });

  return {
    llmsTxt: llmsLines.join('\n'),
    llmsFullTxt: fullLines.join('\n')
  };
}

module.exports = {
  generateLlmsFiles
};

