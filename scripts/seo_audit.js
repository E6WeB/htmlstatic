/**
 * Comprehensive Automated SEO Auditor for StaticStack
 * Audits every HTML file, sitemap.xml, robots.txt, and structured data.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to recursively find all HTML files
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'brain') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html') && !file.includes('_temp')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getHtmlFiles(ROOT_DIR);
console.log(`Found ${htmlFiles.length} HTML files to audit.\n`);

const results = {
  totalPages: htmlFiles.length,
  missingTitle: [],
  duplicateTitles: {},
  shortTitles: [],
  longTitles: [],
  missingDesc: [],
  shortDesc: [],
  longDesc: [],
  missingCanonical: [],
  missingH1: [],
  multipleH1: [],
  missingViewport: [],
  missingOgImage: [],
  imagesWithoutAlt: [],
  jsonLdErrors: [],
  sitemapIssues: [],
  robotsIssues: []
};

// 1. Audit robots.txt
const robotsPath = path.join(ROOT_DIR, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  results.robotsIssues.push('robots.txt is missing.');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes('User-agent:')) results.robotsIssues.push('robots.txt missing User-agent directive.');
  if (!robots.includes('Sitemap:')) results.robotsIssues.push('robots.txt missing Sitemap directive.');
}

// 2. Audit sitemap.xml
const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
let sitemapUrls = new Set();
if (!fs.existsSync(sitemapPath)) {
  results.sitemapIssues.push('sitemap.xml is missing.');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  locMatches.forEach(url => sitemapUrls.add(url));
  if (locMatches.length === 0) results.sitemapIssues.push('sitemap.xml contains 0 URLs.');
}

// Track title occurrences for duplicate detection
const titleMap = {};

// 3. Inspect every HTML page
htmlFiles.forEach(filePath => {
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  // Skip verification token files
  if (relPath.startsWith('google') && relPath.endsWith('.html')) return;

  const content = fs.readFileSync(filePath, 'utf8');

  // Title
  const titleMatch = content.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    results.missingTitle.push(relPath);
  } else {
    const title = titleMatch[1].trim();
    titleMap[title] = (titleMap[title] || 0) + 1;
    if (title.length < 20) results.shortTitles.push({ page: relPath, title, len: title.length });
    if (title.length > 70) results.longTitles.push({ page: relPath, title, len: title.length });
  }

  // Meta Description
  const metaDescTag = content.match(/<meta\b[^>]*?\bname=["']description["'][^>]*>/i);
  const metaDescAttr = metaDescTag ? metaDescTag[0].match(/content=["']([^"']*)["']/i) : null;
  if (!metaDescAttr || !metaDescAttr[1].trim()) {
    results.missingDesc.push(relPath);
  } else {
    const desc = metaDescAttr[1].trim();
    if (desc.length < 50 && relPath !== '404.html') results.shortDesc.push({ page: relPath, desc, len: desc.length });
    if (desc.length > 175) results.longDesc.push({ page: relPath, desc, len: desc.length });
  }

  // Viewport
  if (!content.includes('name="viewport"')) {
    results.missingViewport.push(relPath);
  }

  // Canonical
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  if (!canonicalMatch && relPath !== '404.html') {
    results.missingCanonical.push(relPath);
  }

  // Open Graph Image
  const ogImgMatch = content.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
  if (!ogImgMatch && relPath !== '404.html') {
    results.missingOgImage.push(relPath);
  }

  // H1 Tag Count
  const h1Matches = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1Matches.length === 0) {
    results.missingH1.push(relPath);
  } else if (h1Matches.length > 1) {
    results.multipleH1.push({ page: relPath, count: h1Matches.length });
  }

  // Images without alt
  const imgMatches = [...content.matchAll(/<img\b([^"'>]*(?:"[^"]*"|'[^']*')*?)>/gi)];
  imgMatches.forEach(img => {
    const tag = img[0];
    if (!tag.includes('alt=') || (tag.includes('alt=""') && !tag.includes('aria-hidden="true"'))) {
      if (!tag.includes('aria-hidden="true"')) {
        results.imagesWithoutAlt.push({ page: relPath, img: tag.slice(0, 80) });
      }
    }
  });

  // JSON-LD validation
  const jsonLdMatches = [...content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  jsonLdMatches.forEach((scriptMatch, idx) => {
    const jsonStr = scriptMatch[1].trim();
    try {
      JSON.parse(jsonStr);
    } catch (err) {
      results.jsonLdErrors.push({ page: relPath, error: err.message });
    }
  });
});

// Identify duplicate titles
Object.entries(titleMap).forEach(([title, count]) => {
  if (count > 1) {
    results.duplicateTitles[title] = count;
  }
});

console.log('=== STATICSTACK SEO AUDIT SUMMARY ===');
console.log(`Total HTML Pages Audited: ${results.totalPages}`);
console.log(`Total Sitemap URLs: ${sitemapUrls.size}`);
console.log(`Missing Titles: ${results.missingTitle.length}`);
console.log(`Duplicate Titles: ${Object.keys(results.duplicateTitles).length}`);
console.log(`Missing Meta Descriptions: ${results.missingDesc.length}`);
console.log(`Short Meta Descriptions (<50 chars): ${results.shortDesc.length}`);
console.log(`Long Meta Descriptions (>175 chars): ${results.longDesc.length}`);
console.log(`Missing Canonical Tags: ${results.missingCanonical.length}`);
console.log(`Missing H1 Tags: ${results.missingH1.length}`);
console.log(`Multiple H1 Tags: ${results.multipleH1.length}`);
console.log(`Missing Viewport Meta: ${results.missingViewport.length}`);
console.log(`Missing OG Image: ${results.missingOgImage.length}`);
console.log(`Images Missing Alt: ${results.imagesWithoutAlt.length}`);
console.log(`Malformed JSON-LD Scripts: ${results.jsonLdErrors.length}`);
console.log(`Robots.txt Issues: ${results.robotsIssues.length}`);
console.log(`Sitemap Issues: ${results.sitemapIssues.length}`);

// Output details
fs.writeFileSync(path.join(ROOT_DIR, 'scripts', 'seo_audit_results.json'), JSON.stringify(results, null, 2));
console.log('\nDetailed results written to scripts/seo_audit_results.json');
