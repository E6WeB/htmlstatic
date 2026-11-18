function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getSitemapXml(ctx) {
  const { blogPosts, categories } = ctx;
  const today = new Date().toISOString().split('T')[0];

  const sitemapUrls = [
    { loc: 'https://www.staticstack.app/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://www.staticstack.app/search', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://www.staticstack.app/archive', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://www.staticstack.app/stack/', priority: '0.8', changefreq: 'weekly' },
    { loc: 'https://www.staticstack.app/blog', priority: '0.85', changefreq: 'weekly' },
    { loc: 'https://www.staticstack.app/submit', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://www.staticstack.app/community', priority: '0.85', changefreq: 'weekly' },
    { loc: 'https://www.staticstack.app/contribute', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://www.staticstack.app/thankyou', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://www.staticstack.app/contact', priority: '0.7', changefreq: 'monthly' }
  ];

  blogPosts.forEach(post => {
    sitemapUrls.push({
      loc: `https://www.staticstack.app/blog/${post.slug}/`,
      priority: '0.8',
      changefreq: 'monthly'
    });
  });

  categories.forEach(cat => {
    sitemapUrls.push({
      loc: `https://www.staticstack.app/category/${cat.slug}/`,
      priority: '0.85',
      changefreq: 'weekly'
    });
  });

  categories.forEach(cat => {
    cat.tools.forEach(tool => {
      sitemapUrls.push({
        loc: `https://www.staticstack.app/tools/${cat.slug}/${tool.slug}`,
        priority: '0.8',
        changefreq: 'monthly'
      });
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

function getToolsXml(ctx) {
  const { ROOT_DIR, fs, path, allTools } = ctx;
  const today = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<tools>
${allTools.map(tool => {
  const coverRelativeName = `${tool.slug}-cover.webp`;
  const coverDiskPath = path.join(ROOT_DIR, 'tools', tool.categorySlug, coverRelativeName);
  const imageTag = fs.existsSync(coverDiskPath)
    ? `\n    <image>https://www.staticstack.app/tools/${tool.categorySlug}/${coverRelativeName}</image>`
    : '';
  return `  <tool>
    <title>${escapeXml(tool.name)}</title>
    <category>${escapeXml(tool.categoryTitle)}</category>
    <url>https://www.staticstack.app/tools/${tool.categorySlug}/${tool.slug}</url>${imageTag}
    <description>
      ${escapeXml(tool.description)}
    </description>
    <lastmod>${today}</lastmod>
  </tool>`;
}).join('\n')}
</tools>
`;
}

function getRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /stats
Disallow: /stats/

Sitemap: https://www.staticstack.app/sitemap.xml
`;
}

function getFeedXml(ctx) {
  const { blogPosts, allTools } = ctx;

  const rssBlogItems = [...blogPosts]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .map(post => {
      const pubDate = post.date ? new Date(`${post.date}T12:00:00Z`).toUTCString() : new Date().toUTCString();
      const link = `https://www.staticstack.app/blog/${post.slug}/`;
      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${pubDate}</pubDate>
    <category>${escapeXml(post.category || 'Blog')}</category>
    <description>${escapeXml(post.description || post.excerpt || '')}</description>
  </item>`;
    });

  const rssToolItems = allTools.slice(0, 25).map(tool => {
    const link = `https://www.staticstack.app/tools/${tool.categorySlug}/${tool.slug}`;
    return `  <item>
    <title>${escapeXml(tool.name)} — ${escapeXml(tool.categoryTitle)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <category>${escapeXml(tool.categoryTitle)}</category>
    <description>${escapeXml(tool.description || '')}</description>
  </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>StaticStack — Tools, APIs &amp; Tutorials for Static Websites</title>
  <link>https://www.staticstack.app/</link>
  <atom:link href="https://www.staticstack.app/feed.xml" rel="self" type="application/rss+xml"/>
  <description>Curated tools, serverless APIs, and step-by-step guides for building modern static HTML websites with zero backend bloat.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${[...rssBlogItems, ...rssToolItems].join('\n')}
</channel>
</rss>
`;
}

function getLlmsData(ctx) {
  const { categories, allTools, blogPosts, generateLlmsFiles } = ctx;
  return generateLlmsFiles({
    categories,
    allTools,
    blogPosts,
    baseUrl: 'https://www.staticstack.app'
  });
}

function getSearchIndexJson(ctx) {
  const { ROOT_DIR, fs, path, categories, allTools } = ctx;
  const searchIndex = [];

  searchIndex.push({
    title: 'Community & Discussions',
    description: 'Connect with static site developers, ask questions, share projects, and join our GitHub and Facebook discussions.',
    category: 'Community',
    url: '/community'
  });

  categories.forEach(cat => {
    searchIndex.push({
      title: cat.title,
      slug: cat.slug,
      description: cat.description,
      category: 'Category',
      toolsCount: cat.tools.length,
      url: `/category/${cat.slug}/`
    });
  });

  allTools.forEach(tool => {
    const localIconDisk = path.join(ROOT_DIR, 'tools', tool.categorySlug, `${tool.slug}-icon.webp`);
    let resolvedIcon = `/tools/${tool.categorySlug}/${tool.slug}-icon.webp`;
    if (!fs.existsSync(localIconDisk) && tool.websiteUrl) {
      try {
        const host = new URL(tool.websiteUrl).hostname;
        if (host) resolvedIcon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
      } catch (e) {}
    }
    searchIndex.push({
      title: tool.name,
      slug: tool.slug,
      description: tool.description,
      tagline: tool.tagline || tool.description,
      category: tool.categoryTitle,
      categorySlug: tool.categorySlug,
      tags: tool.tags || [],
      badges: tool.badges || [tool.primaryBadge],
      primaryBadge: tool.primaryBadge,
      url: `/tools/${tool.categorySlug}/${tool.slug}`,
      icon: resolvedIcon,
      websiteUrl: tool.websiteUrl
    });
  });

  return JSON.stringify(searchIndex);
}

module.exports = {
  getSitemapXml,
  getToolsXml,
  getRobotsTxt,
  getFeedXml,
  getLlmsData,
  getSearchIndexJson
};

