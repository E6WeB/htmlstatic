/**
 * Static Website Toolkit - Static Site Generator for Wasmer Edge
 * Reads Markdown source and compiles a complete, responsive static website into public/
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: false
});

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Ensure output directories exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Clean and prepare public directory
ensureDir(PUBLIC_DIR);
ensureDir(path.join(PUBLIC_DIR, 'css'));
ensureDir(path.join(PUBLIC_DIR, 'js'));
ensureDir(path.join(PUBLIC_DIR, 'archive'));
ensureDir(path.join(PUBLIC_DIR, 'submit'));
ensureDir(path.join(PUBLIC_DIR, 'contact'));
ensureDir(path.join(PUBLIC_DIR, 'contributing'));
ensureDir(path.join(PUBLIC_DIR, 'thank-you'));
ensureDir(path.join(PUBLIC_DIR, 'categories'));
ensureDir(path.join(PUBLIC_DIR, 'tools'));

// Copy static assets (CSS, JS)
fs.copyFileSync(path.join(SRC_DIR, 'css', 'style.css'), path.join(PUBLIC_DIR, 'css', 'style.css'));
fs.copyFileSync(path.join(SRC_DIR, 'js', 'main.js'), path.join(PUBLIC_DIR, 'js', 'main.js'));
fs.writeFileSync(path.join(PUBLIC_DIR, 'CNAME'), 'staticstack.app\n');

// ==========================================================================
// Flat Vector SVG Icons Library
// ==========================================================================
const ICONS = {
  logo: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  external: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 2px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
  menu: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  dollar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  plug: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a6 6 0 0 1-12 0V8z"></path></svg>`,
  book: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  branch: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`,
  star: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  tag: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  heart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
};

// Category Icon Mapping
const CATEGORY_ICONS = {
  'ai-content-creation': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  'ai-models': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`,
  'analytics-privacy': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  'authentication-users': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  'booking-scheduling': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  'comments-community': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  'contact-forms': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  'content-management': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  'css-components': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  'database-storage': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
  'development-tools': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  'hosting-deployment': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
  'images-optimization': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  'interactive-scripts': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  'live-chat': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
  'maps-geolocation': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`,
  'media-players': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`,
  'monitoring-errors': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  'newsletters-email': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
  'payments-ecommerce': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
  'search': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  'security-spam-protection': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  'static-site-generators': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>`,
  'surveys-feedback': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`,
  'typography-fonts': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`
};

function getCategoryIcon(slug) {
  return CATEGORY_ICONS[slug] || ICONS.zap;
}

// Helper: parse badge HTML and attach flat SVG icons
function parseBadges(badgeHtml) {
  const badges = [];
  const regex = /alt="([^"]+)"/g;
  let match;
  while ((match = regex.exec(badgeHtml)) !== null) {
    const type = match[1].trim();
    let badgeClass = 'badge-freemium';
    let icon = ICONS.star;

    if (type.toLowerCase().includes('open source')) {
      badgeClass = 'badge-open-source';
      icon = ICONS.branch;
    } else if (type.toLowerCase().includes('free')) {
      badgeClass = 'badge-free';
      icon = ICONS.check;
    } else if (type.toLowerCase().includes('paid')) {
      badgeClass = 'badge-paid';
      icon = ICONS.tag;
    }

    badges.push({ name: type, class: badgeClass, icon: icon });
  }
  if (badges.length === 0) {
    badges.push({ name: 'Free', class: 'badge-free', icon: ICONS.check });
  }
  return badges;
}

// 1. Parse README.md to extract all categories and tools
console.log('📖 Parsing README.md...');
const readmeContent = fs.readFileSync(path.join(ROOT_DIR, 'README.md'), 'utf8');

const sections = readmeContent.split(/\n(?=##\s+)/);
const categories = [];
const allTools = [];

for (const section of sections) {
  const headerMatch = section.match(/^##\s+([^\n\r]+)/);
  if (!headerMatch) continue;
  const title = headerMatch[1].trim();

  // Skip meta sections
  if (['Table of Contents', 'How to Contribute', 'Submission Guidelines', 'Help Grow the Collection', 'Community & Discussion', 'License'].includes(title)) {
    continue;
  }

  // Check if section contains a table
  if (!section.includes('<table') || !section.includes('<tbody>')) {
    continue;
  }

  // Extract description
  const descMatch = section.match(/##[^\n]+\n+([\s\S]*?)(?=<table)/);
  const description = descMatch ? descMatch[1].trim() : '';

  // Extract tools from <tbody>
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

    const badges = parseBadges(badgeHtml);

    const toolObj = {
      name: toolName,
      slug: toolSlug,
      relPath: rawPath,
      folder: folder,
      description: toolDesc,
      badges: badges,
      websiteUrl: websiteUrl,
      websiteLabel: websiteLabel,
      categoryTitle: title,
      categorySlug: folder
    };

    tools.push(toolObj);
    allTools.push(toolObj);
  }

  if (tools.length > 0) {
    const catSlug = tools[0].folder;
    categories.push({
      title: title,
      slug: catSlug,
      description: description,
      tools: tools
    });
  }
}

console.log(`✅ Parsed ${categories.length} categories and ${allTools.length} tools.`);

// ==========================================================================
// Master Layout Template with Super SEO & Mobile Hamburger Menu
// ==========================================================================
function renderLayout({
  title,
  description,
  canonicalPath = '/',
  ogType = 'website',
  schemaJson = null,
  content,
  currentNav = '',
  breadcrumbs = []
}) {
  const canonicalUrl = `https://staticstack.app${canonicalPath}`;
  const cleanDescription = description || 'StaticStack - A community-curated collection of tools, services, and resources for static websites with zero backend servers.';
  const pageTitle = title.includes('StaticStack') ? title : `${title} | StaticStack`;

  const breadcrumbHtml = breadcrumbs.length > 0 ? `
    <nav class="breadcrumbs" aria-label="Breadcrumbs">
      ${breadcrumbs.map((b, i) => i === breadcrumbs.length - 1 ? `<span>${escapeHtml(b.label)}</span>` : `<a href="${b.url}">${escapeHtml(b.label)}</a><span>/</span>`).join('')}
    </nav>
  ` : '';

  // Breadcrumbs Schema
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": b.label,
      "item": b.url.startsWith('http') ? b.url : `https://staticstack.app${b.url}`
    }))
  } : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(cleanDescription)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="theme-color" content="#2563eb">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph / Facebook -->
  <meta property="og:site_name" content="StaticStack">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:image" content="https://staticstack.app/src/img/og-image.webp">
  <meta property="og:image:type" content="image/webp">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="675">
  <meta property="og:locale" content="en_US">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(cleanDescription)}">
  <meta name="twitter:image" content="https://staticstack.app/src/img/og-image.webp">

  <!-- Stylesheet & Favicon -->
  <link rel="stylesheet" href="/css/style.css">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 2 7 12 12 22 7 12 2'/><polyline points='2 17 12 22 22 17'/><polyline points='2 12 12 17 22 12'/></svg>">

  <!-- Structured Data (JSON-LD) -->
  ${schemaJson ? `<script type="application/ld+json">${JSON.stringify(schemaJson)}</script>` : ''}
  ${breadcrumbSchema ? `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>` : ''}
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand">
        <span class="brand-icon">${ICONS.logo}</span>
        <span>StaticStack</span>
        <span style="font-size: 0.75rem; background: var(--accent-light); color: var(--accent); padding: 0.15rem 0.5rem; border-radius: var(--radius-full); font-weight: 600; margin-left: 0.2rem;">.app</span>
      </a>

      <!-- Desktop Nav & Mobile Menu Drawer -->
      <nav id="nav-drawer" class="nav-drawer">
        <ul id="nav-links" class="nav-links">
          <li><a href="/" class="nav-link ${currentNav === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="/archive/" class="nav-link ${currentNav === 'archive' ? 'active' : ''}">Archive</a></li>
          <li><a href="/submit/" class="nav-link ${currentNav === 'submit' ? 'active' : ''}">Submit</a></li>
          <li><a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="nav-link">GitHub ${ICONS.external}</a></li>
        </ul>

        <!-- Mobile Menu Tools (Search & Theme Switcher below header-inner) -->
        <div class="mobile-menu-tools">
          <button class="search-trigger mobile-search-btn" aria-label="Open search">
            <span style="display:flex;align-items:center;gap:0.5rem;">${ICONS.search} Search Directory...</span>
            <span class="search-shortcut">/</span>
          </button>
          <button class="theme-toggle-btn mobile-theme-btn" aria-label="Toggle theme">
            <span class="theme-icon">${ICONS.moon}</span>
            <span class="theme-label">Dark Mode</span>
          </button>
        </div>
      </nav>

      <!-- Desktop Header Actions (Hidden on mobile) -->
      <div class="header-actions">
        <button class="search-trigger" aria-label="Open search">
          <span style="display:flex;align-items:center;gap:0.35rem;">${ICONS.search} Search</span>
          <span class="search-shortcut">/</span>
        </button>
        <button id="theme-toggle" class="theme-btn theme-toggle-btn" aria-label="Toggle theme">
          <span class="theme-icon">${ICONS.moon}</span>
        </button>
      </div>

      <!-- Mobile Hamburger / Close Button -->
      <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-drawer">
        <span class="menu-icon-open" style="display:flex;align-items:center;">${ICONS.menu}</span>
        <span class="menu-icon-close" style="display:none;align-items:center;">${ICONS.close}</span>
      </button>
    </div>
  </header>

  <main class="site-main">
    <div class="container">
      ${breadcrumbHtml}
      ${content}
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="/" class="brand" style="margin-bottom: 0.75rem;">
            <span class="brand-icon">${ICONS.logo}</span>
            <span>StaticStack</span>
            <span style="font-size: 0.75rem; background: var(--accent-light); color: var(--accent); padding: 0.15rem 0.5rem; border-radius: var(--radius-full); font-weight: 600; margin-left: 0.2rem;">.app</span>
          </a>
          <p>A community-curated collection of tools, services, and resources for building, hosting, and enhancing static websites with HTML, CSS, and JavaScript—zero backend servers required.</p>
        </div>
        <div class="footer-links">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/archive/">Master Archive</a></li>
            <li><a href="/submit/">Submit a Tool</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Community & Project</h4>
          <ul>
            <li><a href="/contributing/">Contributing Guide</a></li>
            <li><a href="/thank-you/">Thank You & Credits</a></li>
            <li><a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer">GitHub Repository ${ICONS.external}</a></li>
            <li><a href="https://github.com/E6WeB/htmlstatic/issues" target="_blank" rel="noopener noreferrer">Submit an Issue ${ICONS.external}</a></li>
            <li><a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 1.0 Public Domain</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span id="copyright-year">2026</span> StaticStack. Built with native system typography &amp; Vanilla CSS. Deployed on <a href="https://wasmer.io/" target="_blank" rel="noopener noreferrer">Wasmer Edge</a> at <a href="https://staticstack.app">staticstack.app</a>.</p>
      </div>
    </div>
  </footer>

  <!-- Search Modal -->
  <div id="search-modal" class="search-modal" role="dialog" aria-modal="true" aria-label="Search Tools">
    <div class="search-box">
      <div class="search-input-wrapper">
        <span style="display:flex;align-items:center;color:var(--text-muted)">${ICONS.search}</span>
        <input type="text" id="search-input" class="search-input" placeholder="Search ${allTools.length}+ tools, categories, or keywords..." autocomplete="off">
        <button id="search-close" style="background:none;border:none;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;">${ICONS.close}</button>
      </div>
      <div id="search-results" class="search-results"></div>
    </div>
  </div>

  <script src="/js/main.js" defer></script>
</body>
</html>`;
}

// ==========================================================================
// 2. Generate Homepage (public/index.html)
// ==========================================================================
console.log('🏠 Generating Homepage...');

const categoryCardsHtml = categories.map(cat => `
  <a href="/categories/${cat.slug}/" class="category-card">
    <div class="category-card-top">
      <span class="category-badge">${cat.tools.length} Tools</span>
      <span class="category-card-arrow" aria-hidden="true">→</span>
    </div>
    <h3 class="category-title">${escapeHtml(cat.title)}</h3>
    <p class="category-desc">${escapeHtml(cat.description)}</p>
    <div class="category-footer">
      <span>Explore Category</span>
      <span class="category-listings">${cat.tools.length} listings</span>
    </div>
  </a>
`).join('');

const featuredToolsList = [
  'reflow', 'bootstrap-studio', 'antigravity-ide', 'cursor', 
  'cloudflare-pages', 'astro', 'lucide-icons', 'clerk'
];

const featuredTools = allTools.filter(t => featuredToolsList.includes(t.slug));

const featuredCardsHtml = featuredTools.map(tool => `
  <div class="tool-card">
    <div class="tool-card-header">
      <h4 class="tool-card-title"><a href="/tools/${tool.categorySlug}/${tool.slug}/">${escapeHtml(tool.name)}</a></h4>
      <div>${tool.badges.map(b => `<span class="badge ${b.class}">${b.icon} ${escapeHtml(b.name)}</span>`).join(' ')}</div>
    </div>
    <p class="tool-card-desc">${escapeHtml(tool.description)}</p>
    <div class="tool-card-actions">
      <a href="/categories/${tool.categorySlug}/" style="font-size: 0.85rem; color: var(--text-muted);">in ${escapeHtml(tool.categoryTitle)}</a>
      <a href="/tools/${tool.categorySlug}/${tool.slug}/" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; display:inline-flex; align-items:center; gap:0.25rem;">Overview ${ICONS.arrowRight}</a>
    </div>
  </div>
`).join('');

const homeContent = `
  <section class="hero">
    <div class="hero-badge" style="display:inline-flex; align-items:center; gap:0.4rem;">
      ${ICONS.zap} 100% Jamstack & Static Web Architecture
    </div>
    <h1 class="hero-title">Empowering Static Websites with <span class="gradient-text">Zero Backend Servers</span></h1>
    <p class="hero-subtitle">You don't need WordPress, a monolithic CMS, or a dedicated database to build an exceptional website. Explore ${allTools.length}+ curated tools, services, and APIs for HTML, CSS, and JavaScript.</p>
    
    <div class="hero-buttons">
      <a href="/archive/" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:0.4rem;">
        ${ICONS.book} Browse Master Archive
      </a>
      <a href="#categories" class="btn btn-secondary">Explore 25 Categories</a>
      <a href="/submit/" class="btn btn-secondary">Submit a Tool</a>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">25</div>
        <div class="stat-label">Curated Categories</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${allTools.length}+</div>
        <div class="stat-label">Hand-Picked Tools</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">0%</div>
        <div class="stat-label">Backend Maintenance</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">100%</div>
        <div class="stat-label">Free & Open Source Index</div>
      </div>
    </div>
  </section>

  <!-- Categories Grid -->
  <section id="categories" class="section">
    <div class="section-header">
      <div>
        <h2 class="section-title">Explore by Category</h2>
        <p class="section-subtitle">Each category features a dedicated post with in-depth breakdowns, tool comparisons, and static site integration examples.</p>
      </div>
    </div>
    <div class="category-grid">
      ${categoryCardsHtml}
    </div>
  </section>

  <!-- Why Static Architecture Section -->
  <section class="section">
    <div class="why-static-box">
      <div style="text-align: center; max-width: 650px; margin: 0 auto 3rem;">
        <h2 style="font-size: 2rem; margin-bottom: 0.75rem;">Why Static Architecture?</h2>
        <p style="color: var(--text-muted); font-size: 1.05rem;">Modern static frontends combined with serverless APIs deliver unbeatable speed, ironclad security, and near-zero infrastructure costs.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">${ICONS.zap}</div>
          <h3 class="feature-title">Instant Global Speed</h3>
          <p class="feature-desc">Pre-rendered HTML files served directly from edge CDNs load instantaneously with perfect Core Web Vitals and zero database wait time.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">${ICONS.shield}</div>
          <h3 class="feature-title">Ironclad Security</h3>
          <p class="feature-desc">No live PHP interpreters, SQL injection targets, or vulnerable CMS plugins. Your public surface is immutable, read-only static code.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">${ICONS.dollar}</div>
          <h3 class="feature-title">Near-Zero Hosting Cost</h3>
          <p class="feature-desc">Host landing pages, blogs, and complex apps for free or pennies on platforms like Wasmer Edge, Cloudflare Pages, or GitHub Pages.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">${ICONS.plug}</div>
          <h3 class="feature-title">Plug-and-Play Dynamics</h3>
          <p class="feature-desc">Add shopping carts (Reflow), user authentication (Clerk), search (Pagefind), and contact forms with lightweight client-side scripts.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Tools Grid -->
  <section class="section">
    <div class="section-header">
      <div>
        <h2 class="section-title">Popular & Featured Tools</h2>
        <p class="section-subtitle">Essential tools frequently used across static website workflows.</p>
      </div>
      <a href="/archive/" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:0.25rem;">View Full Directory ${ICONS.arrowRight}</a>
    </div>
    <div class="tool-cards-grid">
      ${featuredCardsHtml}
    </div>
  </section>
`;

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://staticstack.app/#website",
      "url": "https://staticstack.app/",
      "name": "StaticStack",
      "description": "Curated directory of tools, APIs, and resources for static websites with zero backend servers.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://staticstack.app/archive/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://staticstack.app/#organization",
      "name": "StaticStack",
      "url": "https://staticstack.app/",
      "logo": "https://staticstack.app/src/img/og-image.webp"
    }
  ]
};

fs.writeFileSync(
  path.join(PUBLIC_DIR, 'index.html'),
  renderLayout({
    title: 'StaticStack - Modern Tools, Services & APIs for Static Websites',
    description: `Curated directory of ${allTools.length}+ tools, services, and APIs for building high-performance static websites with HTML, CSS, and JavaScript—zero backend servers required.`,
    canonicalPath: '/',
    ogType: 'website',
    schemaJson: homeSchema,
    content: homeContent,
    currentNav: 'home'
  })
);

// ==========================================================================
// 3. Generate Archive Page with Widened Sidebar (public/archive/index.html)
// ==========================================================================
console.log('📚 Generating Archive Page...');

const sidebarLinksHtml = categories.map(cat => `
  <li>
    <a href="#${cat.slug}" class="toc-link">
      <span>${escapeHtml(cat.title)}</span>
      <span style="font-size: 0.75rem; color: var(--text-subtle);">${cat.tools.length}</span>
    </a>
  </li>
`).join('');

const mobileCatChipsHtml = `
  <div class="mobile-cat-chips">
    ${categories.map(c => `
      <a href="#${c.slug}" class="mobile-chip">
        ${getCategoryIcon(c.slug)}
        <span>${escapeHtml(c.title)}</span>
      </a>
    `).join('')}
  </div>
`;

const archiveSectionsHtml = categories.map(cat => {
  const tableRows = cat.tools.map(tool => `
    <tr data-pricing="${escapeHtml(tool.badges.map(b => b.name).join(' '))}">
      <td style="font-weight: 600;"><a href="/tools/${tool.categorySlug}/${tool.slug}/">${escapeHtml(tool.name)}</a></td>
      <td style="color: var(--text-muted);">${escapeHtml(tool.description)}</td>
      <td>
        <div style="display:flex;gap:0.35rem;flex-wrap:wrap;">
          ${tool.badges.map(b => `<span class="badge ${b.class}">${b.icon} ${escapeHtml(b.name)}</span>`).join('')}
        </div>
      </td>
      <td>
        <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;">
          ${escapeHtml(tool.websiteLabel)} ${ICONS.external}
        </a>
      </td>
      <td>
        <a href="/tools/${tool.categorySlug}/${tool.slug}/" class="btn btn-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;">
          Details
        </a>
      </td>
    </tr>
  `).join('');

  const archiveCards = cat.tools.map(tool => `
    <div class="tool-card archive-tool-card" data-pricing="${escapeHtml(tool.badges.map(b => b.name).join(' '))}">
      <div class="tool-card-header">
        <h3 class="tool-card-title"><a href="/tools/${tool.categorySlug}/${tool.slug}/">${escapeHtml(tool.name)}</a></h3>
        <div style="display:flex;gap:0.35rem;flex-wrap:wrap;">
          ${tool.badges.map(b => `<span class="badge ${b.class}">${b.icon} ${escapeHtml(b.name)}</span>`).join('')}
        </div>
      </div>
      <p class="tool-card-desc">${escapeHtml(tool.description)}</p>
      <div class="tool-card-actions">
        <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; display:inline-flex; align-items:center;">
          ${escapeHtml(tool.websiteLabel)} ${ICONS.external}
        </a>
        <a href="/tools/${tool.categorySlug}/${tool.slug}/" class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.85rem; display:inline-flex; align-items:center; gap:0.25rem;">
          Details ${ICONS.arrowRight}
        </a>
      </div>
    </div>
  `).join('');

  return `
    <section id="${cat.slug}" class="category-section">
      <div class="category-section-header">
        <div>
          <div style="display:flex;align-items:center;gap:0.6rem;">
            <div style="color:var(--accent);">${getCategoryIcon(cat.slug)}</div>
            <h2 style="font-size: 1.45rem; margin:0;">${escapeHtml(cat.title)}</h2>
          </div>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.4rem;">${escapeHtml(cat.description)}</p>
        </div>
        <a href="/categories/${cat.slug}/" class="category-post-link" style="display:inline-flex;align-items:center;gap:0.25rem;">
          View Category Guide (${cat.tools.length} Tools) ${ICONS.arrowRight}
        </a>
      </div>

      <div class="table-wrapper archive-view-table">
        <table class="archive-table">
          <thead>
            <tr>
              <th width="20%">Tool</th>
              <th width="40%">Description</th>
              <th width="18%">Pricing</th>
              <th width="14%">Website</th>
              <th width="8%">Action</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>

      <div class="archive-cards-grid archive-view-cards" style="display:none;">
        ${archiveCards}
      </div>
    </section>
  `;
}).join('');

const archiveContent = `
  <div style="padding: 2.5rem 0 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2rem;">
    <h1>Master Archive &amp; Directory</h1>
    <p style="font-size: 1.15rem; color: var(--text-muted); margin-bottom: 1.5rem;">
      The complete hierarchical index of all 25 categories and ${allTools.length} curated tools in the Static Website Toolkit.
    </p>

    <!-- Controls Row: Filter Pills + View Switcher -->
    <div class="archive-controls-row">
      <div class="archive-filter-group">
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-right: 0.35rem;">Filter by Pricing:</span>
        <button class="btn btn-primary archive-filter-btn" data-filter="all" style="padding: 0.35rem 0.85rem; font-size: 0.85rem;">All (${allTools.length})</button>
        <button class="btn btn-secondary archive-filter-btn" data-filter="open source" style="padding: 0.35rem 0.85rem; font-size: 0.85rem;">${ICONS.branch} Open Source</button>
        <button class="btn btn-secondary archive-filter-btn" data-filter="free" style="padding: 0.35rem 0.85rem; font-size: 0.85rem;">${ICONS.check} Free</button>
        <button class="btn btn-secondary archive-filter-btn" data-filter="freemium" style="padding: 0.35rem 0.85rem; font-size: 0.85rem;">${ICONS.star} Freemium</button>
        <button class="btn btn-secondary archive-filter-btn" data-filter="paid" style="padding: 0.35rem 0.85rem; font-size: 0.85rem;">${ICONS.tag} Paid</button>
      </div>

      <div class="archive-view-switch" role="group" aria-label="Directory Layout View">
        <button id="view-mode-table" class="view-toggle-btn active" title="Switch to Table View">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          <span>Table</span>
        </button>
        <button id="view-mode-cards" class="view-toggle-btn" title="Switch to Card View">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Cards</span>
        </button>
      </div>
    </div>
  </div>

  ${mobileCatChipsHtml}

  <div class="archive-layout">
    <aside class="archive-sidebar">
      <div style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--text-subtle); margin-bottom: 0.75rem; letter-spacing: 0.05em;">
        Categories (${categories.length})
      </div>
      <ul class="toc-nav">
        ${sidebarLinksHtml}
      </ul>
    </aside>

    <div class="archive-content">
      ${archiveSectionsHtml}
    </div>
  </div>
`;

const archiveSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Master Archive & Directory | StaticStack",
  "description": `Browse the complete collection of ${allTools.length} curated tools across ${categories.length} categories for static websites.`,
  "url": "https://staticstack.app/archive/"
};

fs.writeFileSync(
  path.join(PUBLIC_DIR, 'archive', 'index.html'),
  renderLayout({
    title: 'Master Archive & Directory',
    description: `Complete searchable directory of ${allTools.length} tools across 25 categories for static websites and Jamstack development.`,
    canonicalPath: '/archive/',
    schemaJson: archiveSchema,
    content: archiveContent,
    currentNav: 'archive',
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Archive', url: '/archive/' }
    ]
  })
);

// ==========================================================================
// 4. Generate Category Post-like Pages (public/categories/<cat-slug>/index.html)
// ==========================================================================
console.log('📝 Generating Category Post-like Pages...');

categories.forEach((cat, index) => {
  const catDir = path.join(PUBLIC_DIR, 'categories', cat.slug);
  ensureDir(catDir);

  const prevCat = index > 0 ? categories[index - 1] : null;
  const nextCat = index < categories.length - 1 ? categories[index + 1] : null;

  const toolCardsHtml = cat.tools.map(tool => `
    <div class="tool-card">
      <div class="tool-card-header">
        <h3 class="tool-card-title"><a href="/tools/${tool.categorySlug}/${tool.slug}/">${escapeHtml(tool.name)}</a></h3>
        <div>${tool.badges.map(b => `<span class="badge ${b.class}">${b.icon} ${escapeHtml(b.name)}</span>`).join(' ')}</div>
      </div>
      <p class="tool-card-desc">${escapeHtml(tool.description)}</p>
      <div class="tool-card-actions">
        <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; display:inline-flex; align-items:center;">
          ${escapeHtml(tool.websiteLabel)} ${ICONS.external}
        </a>
        <a href="/tools/${tool.categorySlug}/${tool.slug}/" class="btn btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.85rem; display:inline-flex; align-items:center; gap:0.25rem;">
          Read Overview ${ICONS.arrowRight}
        </a>
      </div>
    </div>
  `).join('');

  const toolTableRows = cat.tools.map(tool => `
    <tr>
      <td style="font-weight: 600;"><a href="/tools/${tool.categorySlug}/${tool.slug}/">${escapeHtml(tool.name)}</a></td>
      <td style="color: var(--text-muted);">${escapeHtml(tool.description)}</td>
      <td>${tool.badges.map(b => `<span class="badge ${b.class}">${b.icon} ${escapeHtml(b.name)}</span>`).join(' ')}</td>
      <td><a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;">${escapeHtml(tool.websiteLabel)} ${ICONS.external}</a></td>
    </tr>
  `).join('');

  const categoryPostContent = `
    <article class="category-post">
      <header class="category-post-hero">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem;">
          <div class="feature-icon" style="margin-bottom:0;">${getCategoryIcon(cat.slug)}</div>
          <div class="hero-badge" style="margin-bottom:0;">Category Guide</div>
        </div>
        <h1 class="category-post-title">${escapeHtml(cat.title)}</h1>
        <div class="category-post-meta">
          <span>${ICONS.book} ${cat.tools.length} Curated Tools</span>
          <span>•</span>
          <span>${ICONS.zap} Zero Backend Architecture</span>
          <span>•</span>
          <a href="/archive/#${cat.slug}" style="color:var(--accent);display:inline-flex;align-items:center;gap:0.25rem;">View in Archive ${ICONS.arrowRight}</a>
        </div>
        <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 800px; line-height: 1.6;">
          ${escapeHtml(cat.description)}
        </p>
      </header>

      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.4rem; margin-bottom: 1rem;">Summary & Quick Comparison</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th width="25%">Tool</th>
                <th width="45%">Description</th>
                <th width="15%">Pricing</th>
                <th width="15%">Website</th>
              </tr>
            </thead>
            <tbody>
              ${toolTableRows}
            </tbody>
          </table>
        </div>
      </div>

      <div style="margin-bottom: 3.5rem;">
        <h2 style="font-size: 1.4rem; margin-bottom: 0.5rem;">Tool Reviews & Overviews</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Detailed information on each tool in ${escapeHtml(cat.title)}.</p>
        <div class="tool-cards-grid" style="margin-top: 0;">
          ${toolCardsHtml}
        </div>
      </div>

      <!-- Prev / Next Navigation -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding: 2rem 0; border-top: 1px solid var(--border-color); margin-top: 3rem;">
        ${prevCat ? `
          <a href="/categories/${prevCat.slug}/" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.35rem;">
            ${ICONS.arrowLeft} Previous: ${escapeHtml(prevCat.title)}
          </a>
        ` : '<div></div>'}
        
        <a href="/archive/" class="btn btn-secondary">All Categories</a>

        ${nextCat ? `
          <a href="/categories/${nextCat.slug}/" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.35rem;">
            Next: ${escapeHtml(nextCat.title)} ${ICONS.arrowRight}
          </a>
        ` : '<div></div>'}
      </div>
    </article>
  `;

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${cat.title} - StaticStack Guide`,
    "description": cat.description,
    "url": `https://staticstack.app/categories/${cat.slug}/`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": cat.tools.map((t, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": t.name,
        "url": `https://staticstack.app/tools/${t.categorySlug}/${t.slug}/`
      }))
    }
  };

  fs.writeFileSync(
    path.join(catDir, 'index.html'),
    renderLayout({
      title: `${cat.title} - Static Website Tools & Guide`,
      description: `Comprehensive guide to ${cat.tools.length} curated tools in ${cat.title} for static HTML, CSS, and JS web development.`,
      canonicalPath: `/categories/${cat.slug}/`,
      schemaJson: categorySchema,
      content: categoryPostContent,
      breadcrumbs: [
        { label: 'Home', url: '/' },
        { label: 'Archive', url: '/archive/' },
        { label: cat.title, url: `/categories/${cat.slug}/` }
      ]
    })
  );
});

// ==========================================================================
// 5. Generate Individual Tool Pages (public/tools/<cat-slug>/<tool-slug>/index.html)
// ==========================================================================
console.log('🔧 Generating Individual Tool Overview Pages...');

allTools.forEach(tool => {
  const toolDir = path.join(PUBLIC_DIR, 'tools', tool.categorySlug, tool.slug);
  ensureDir(toolDir);

  const legacyCatDir = path.join(PUBLIC_DIR, tool.folder);
  ensureDir(legacyCatDir);

  const mdFilePath = path.join(ROOT_DIR, tool.relPath);
  let rawMd = '';
  if (fs.existsSync(mdFilePath)) {
    rawMd = fs.readFileSync(mdFilePath, 'utf8');
  } else {
    rawMd = `# ${tool.name}\n\n> ${tool.description}\n\n- **Website**: ${tool.websiteUrl}`;
  }

  // Strip trailing legacy footer navigation and horizontal rule if present
  rawMd = rawMd.replace(/\n+---\s*\n+\[.*?Back to[\s\S]*$/i, '').trimEnd();

  // Convert markdown to HTML
  let parsedHtml = marked(rawMd);

  // Rewriting internal links so they work on the static site
  parsedHtml = parsedHtml
    .replace(/href="(?:\.\.\/)+README\.md#([^"]+)"/g, 'href="/categories/$1/"')
    .replace(/href="(?:\.\.\/)+README\.md"/g, 'href="/archive/"')
    .replace(/href="(?:\.\.\/)+([a-z0-9\-]+)\/([a-z0-9\-]+)\.md"/g, 'href="/tools/$1/$2/"')
    .replace(/href="([a-z0-9\-]+)\.md"/g, 'href="/tools/' + tool.categorySlug + '/$1/"');

  const toolPageContent = `
    <article class="tool-detail-page">
      <div class="tool-detail-hero">
        <div class="tool-title-row">
          <h1>${escapeHtml(tool.name)}</h1>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            ${tool.badges.map(b => `<span class="badge ${b.class}">${b.icon} ${escapeHtml(b.name)}</span>`).join(' ')}
            <a href="/categories/${tool.categorySlug}/" class="badge badge-freemium" style="text-decoration: none; display:inline-flex; align-items:center; gap:0.3rem;">
              ${getCategoryIcon(tool.categorySlug)}
              <span>Category: ${escapeHtml(tool.categoryTitle)}</span>
            </a>
          </div>
        </div>
        
        <p class="tool-quote">${escapeHtml(tool.description)}</p>

        <div class="tool-meta-bar">
          <div><strong>Official Website:</strong> <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;">${escapeHtml(tool.websiteLabel)} ${ICONS.external}</a></div>
          <div><strong>Category:</strong> <a href="/categories/${tool.categorySlug}/">${escapeHtml(tool.categoryTitle)}</a></div>
          <div style="margin-left: auto;">
            <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.4rem 0.9rem; font-size: 0.85rem; display:inline-flex; align-items:center; gap:0.35rem;">
              Visit ${escapeHtml(tool.name)} ${ICONS.external}
            </a>
          </div>
        </div>
      </div>

      <div class="markdown-body">
        ${parsedHtml}
      </div>

      <div style="margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <a href="/categories/${tool.categorySlug}/" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:0.35rem;">
          ${ICONS.arrowLeft} Back to ${escapeHtml(tool.categoryTitle)}
        </a>
        <a href="/archive/" class="btn btn-secondary">Browse Full Archive</a>
        <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:0.35rem;">
          Visit ${escapeHtml(tool.name)} ${ICONS.external}
        </a>
      </div>
    </article>
  `;

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "applicationCategory": tool.categoryTitle,
    "operatingSystem": "Web",
    "url": tool.websiteUrl,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const renderedHtml = renderLayout({
    title: `${tool.name} - ${tool.categoryTitle}`,
    description: `${tool.name}: ${tool.description}. Guide, features, and static site integration overview.`,
    canonicalPath: `/tools/${tool.categorySlug}/${tool.slug}/`,
    ogType: 'article',
    schemaJson: toolSchema,
    content: toolPageContent,
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Archive', url: '/archive/' },
      { label: tool.categoryTitle, url: `/categories/${tool.categorySlug}/` },
      { label: tool.name, url: `/tools/${tool.categorySlug}/${tool.slug}/` }
    ]
  });

  fs.writeFileSync(path.join(toolDir, 'index.html'), renderedHtml);

  // Also write legacy fallback redirect / alias
  const legacyToolDir = path.join(legacyCatDir, tool.slug);
  ensureDir(legacyToolDir);
  fs.writeFileSync(
    path.join(legacyToolDir, 'index.html'),
    `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/tools/${tool.categorySlug}/${tool.slug}/"><link rel="canonical" href="https://staticstack.app/tools/${tool.categorySlug}/${tool.slug}/"></head><body><script>window.location.href="/tools/${tool.categorySlug}/${tool.slug}/";</script></body></html>`
  );
});

// ==========================================================================
// 6. Generate Tool Submission Page (public/submit/index.html)
// ==========================================================================
console.log('✉️ Generating Tool Submission Page...');

const categorySelectOptions = categories.map(cat => `
  <option value="${escapeHtml(cat.title)}">${escapeHtml(cat.title)}</option>
`).join('');

const submitContent = `
  <div style="padding: 2.5rem 0 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2.5rem;">
    <h1>Submit a Tool</h1>
    <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 760px; line-height: 1.6;">
      StaticStack is 100% community-curated and maintained on GitHub. Submissions are processed directly through <strong>GitHub Issues</strong> to ensure transparency, security, and spam prevention.
    </p>
  </div>

  <div class="contact-container">
    <!-- Left Column: Pre-fill Issue Form -->
    <div>
      <div class="contact-card">
        <h2 style="font-size: 1.35rem; margin-bottom: 0.5rem; display:flex;align-items:center;gap:0.5rem;">
          ${ICONS.branch} Propose a New Tool or Service
        </h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
          Fill out the details below. When you click <strong>"Continue to GitHub"</strong>, we will securely pre-fill an issue template on our official repository for you to review and submit.
        </p>

        <form id="github-submission-form">
          <div class="form-group">
            <label for="issue-tool-name" class="form-label">Tool or Service Name *</label>
            <input type="text" id="issue-tool-name" class="form-input" placeholder="e.g. Bootstrap Studio, Pagefind, Reflow" required>
          </div>

          <div class="form-group">
            <label for="issue-website-url" class="form-label">Official HTTPS Website URL *</label>
            <input type="url" id="issue-website-url" class="form-input" placeholder="https://example.com/" required>
            <span class="form-hint">Must be an official HTTPS link with zero affiliate or tracking codes.</span>
          </div>

          <div class="form-group">
            <label for="issue-category" class="form-label">Suggested Category *</label>
            <select id="issue-category" class="form-input" required>
              <option value="" disabled selected>-- Select a Toolkit Category --</option>
              ${categorySelectOptions}
              <option value="New Category Suggestion">Suggest a New Category</option>
            </select>
          </div>

          <div class="form-group">
            <label for="issue-description" class="form-label">Short Description (One Objective Sentence) *</label>
            <textarea id="issue-description" class="form-textarea" placeholder="Explain what the tool does and how it helps static websites..." required></textarea>
            <span class="form-hint">Keep it objective and free of marketing buzzwords (avoid 'the best', '#1', etc.).</span>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.75rem; font-size: 1rem; display:flex; align-items:center; gap:0.5rem;">
            Continue to GitHub Issues ${ICONS.arrowRight}
          </button>
        </form>
      </div>
    </div>

    <!-- Right Column: GitHub Repository Info & Community -->
    <div>
      <div class="contact-card" style="margin-bottom: 1.75rem;">
        <h3 style="font-size: 1.15rem; margin-bottom: 0.75rem;">GitHub Repository Issues</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem;">
          Prefer opening the issue directly on GitHub or want to report a broken link, update a pricing tier, or suggest an architectural enhancement?
        </p>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <a href="https://github.com/E6WeB/htmlstatic/issues" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem;">
            Go to GitHub Issues (E6WeB/htmlstatic/issues) ${ICONS.external}
          </a>
          <a href="https://github.com/E6WeB/htmlstatic/issues/new/choose" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem;">
            Choose an Issue Template ${ICONS.external}
          </a>
        </div>
      </div>

      <div class="contact-card" style="margin-bottom: 1.75rem;">
        <h3 style="font-size: 1.15rem; margin-bottom: 0.75rem;">Submission Guidelines</h3>
        <ul style="padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">
          <li style="margin-bottom: 0.5rem;"><strong>Relevance:</strong> Tool must directly benefit static HTML, CSS, and JS websites or Jamstack architectures.</li>
          <li style="margin-bottom: 0.5rem;"><strong>Zero Advertising:</strong> No affiliate links, referral parameters, or sponsored promotions allowed.</li>
          <li style="margin-bottom: 0.5rem;"><strong>Objective Description:</strong> Write a concise sentence explaining what it does, not marketing hype.</li>
          <li><strong>No Duplicates:</strong> Please search the <a href="/archive/">Master Archive</a> before submitting.</li>
        </ul>
      </div>

      <div class="contact-card">
        <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;">Join the Community</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Discuss static website architecture, tools, and best practices in our Facebook Group:
        </p>
        <a href="https://www.facebook.com/groups/dynamicwebsites" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width: 100%; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem;">
          Dynamic Websites Facebook Group ${ICONS.external}
        </a>
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('github-submission-form');
      if (!form) return;

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const toolName = document.getElementById('issue-tool-name').value.trim();
        const websiteUrl = document.getElementById('issue-website-url').value.trim();
        const category = document.getElementById('issue-category').value;
        const description = document.getElementById('issue-description').value.trim();

        const baseUrl = 'https://github.com/E6WeB/htmlstatic/issues/new';
        const params = new URLSearchParams({
          template: 'submit-tool.yml',
          title: '[Submission]: ' + toolName,
          tool_name: toolName,
          website_url: websiteUrl,
          category: category,
          description: description
        });

        window.open(baseUrl + '?' + params.toString(), '_blank', 'noopener,noreferrer');
      });
    });
  </script>
`;

fs.writeFileSync(
  path.join(PUBLIC_DIR, 'submit', 'index.html'),
  renderLayout({
    title: 'Submit a Tool | StaticStack',
    description: 'Submit a curated tool, service, or API for static websites via GitHub Issues.',
    canonicalPath: '/submit/',
    content: submitContent,
    currentNav: 'submit',
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Submit', url: '/submit/' }
    ]
  })
);

// Redirect legacy /contact/ to /submit/
fs.writeFileSync(
  path.join(PUBLIC_DIR, 'contact', 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting to /submit/...</title>
  <link rel="canonical" href="https://staticstack.app/submit/">
  <meta http-equiv="refresh" content="0; url=/submit/">
  <script>window.location.replace('/submit/');</script>
</head>
<body>
  <p>Page moved to <a href="/submit/">/submit/</a>.</p>
</body>
</html>`
);

// ==========================================================================
// 7. Generate Contributing Page (public/contributing/index.html)
// ==========================================================================
console.log('🤝 Generating Contributing Page...');

let rawContributingMd = '';
const contributingPath = path.join(ROOT_DIR, 'CONTRIBUTING.md');
if (fs.existsSync(contributingPath)) {
  rawContributingMd = fs.readFileSync(contributingPath, 'utf8');
} else {
  rawContributingMd = '# Contributing to StaticStack\n\nContributions are welcome!';
}

let parsedContributingHtml = marked(rawContributingMd);

const contributingContent = `
  <div style="padding: 2.5rem 0 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2.5rem;">
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;">
      <span class="hero-badge" style="margin-bottom:0;">Community Collaboration</span>
    </div>
    <h1>Contributing to StaticStack</h1>
    <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 800px; line-height: 1.6;">
      Thank you for helping keep StaticStack accurate, comprehensive, and valuable! Learn how to submit new tools, suggest categories, report changes, or open pull requests.
    </p>
    <div style="display:flex;gap:1rem;margin-top:1.5rem;flex-wrap:wrap;">
      <a href="https://github.com/E6WeB/htmlstatic/issues/new/choose" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:inline-flex;align-items:center;gap:0.4rem;">
        Submit an Issue on GitHub ${ICONS.external}
      </a>
      <a href="/submit/" class="btn btn-secondary">
        Use Web Submission Form
      </a>
      <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.4rem;">
        Fork Repository ${ICONS.external}
      </a>
    </div>
  </div>

  <div class="markdown-body">
    ${parsedContributingHtml}
  </div>
`;

fs.writeFileSync(
  path.join(PUBLIC_DIR, 'contributing', 'index.html'),
  renderLayout({
    title: 'Contributing Guide - How to Add Tools & Resources',
    description: 'Learn how to contribute to StaticStack. Guidelines for proposing new static web tools, submitting pull requests, and maintaining data accuracy.',
    canonicalPath: '/contributing/',
    content: contributingContent,
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Contributing Guide', url: '/contributing/' }
    ]
  })
);

// ==========================================================================
// 8. Generate Thank You & Credits Page (public/thank-you/index.html)
// ==========================================================================
console.log('❤️ Generating Thank You & Credits Page...');

const thankYouContent = `
  <div style="padding: 2.5rem 0 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2.5rem;">
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;">
      <span class="hero-badge" style="margin-bottom:0;color:#ef4444;background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.25);">
        ${ICONS.heart} Community Gratitude
      </span>
    </div>
    <h1>Thank You & Credits</h1>
    <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 800px; line-height: 1.6;">
      StaticStack is made possible by the passionate engineers, open-source maintainers, and community advocates who build the tools and infrastructure powering the modern static web.
    </p>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:3.5rem;">
    <div class="contact-card">
      <div class="feature-icon" style="color:var(--accent);">${ICONS.star}</div>
      <h2 style="font-size: 1.3rem; margin-bottom: 0.75rem;">Open Source Maintainers & Creators</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
        To the authors and teams behind the <strong>${allTools.length}+ featured tools</strong>: from frameworks like Astro and 11ty, to search engines like Pagefind, authentication SDKs like Clerk, icon sets like Lucide, and payment gateways like Reflow. Your hard work makes serverless and static web development a reality.
      </p>
      <a href="/archive/" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.35rem;">
        Explore All ${allTools.length} Tools ${ICONS.arrowRight}
      </a>
    </div>

    <div class="contact-card">
      <div class="feature-icon" style="color:#22c55e;">${ICONS.branch}</div>
      <h2 style="font-size: 1.3rem; margin-bottom: 0.75rem;">Community Contributors</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
        Special thanks to everyone who has submitted tools, reported broken URLs, refined descriptions, or contributed suggestions through GitHub Issues and Pull Requests at <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer">E6WeB/htmlstatic</a>.
      </p>
      <a href="/contributing/" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.35rem;">
        View Contributing Guide ${ICONS.arrowRight}
      </a>
    </div>

    <div class="contact-card">
      <div class="feature-icon" style="color:#3b82f6;">${ICONS.zap}</div>
      <h2 style="font-size: 1.3rem; margin-bottom: 0.75rem;">Edge Hosting by Wasmer</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
        StaticStack is compiled into static HTML and distributed globally via <strong>Wasmer Edge</strong> (<a href="https://wasmer.io" target="_blank" rel="noopener noreferrer">wasmer.io</a>). Thanks to WebAssembly and edge routing, our pages load instantaneously across the world.
      </p>
      <a href="https://wasmer.io" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.35rem;">
        Visit Wasmer.io ${ICONS.external}
      </a>
    </div>

    <div class="contact-card">
      <div class="feature-icon" style="color:#a855f7;">${ICONS.book}</div>
      <h2 style="font-size: 1.3rem; margin-bottom: 0.75rem;">Creative Commons & Open Data</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
        This entire collection is dedicated to the public domain under the <strong>Creative Commons CC0 1.0 Universal</strong> license. You are free to copy, modify, and build upon this directory without restriction.
      </p>
      <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.35rem;">
        Read CC0 1.0 Dedication ${ICONS.external}
      </a>
    </div>
  </div>

  <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:2.5rem;text-align:center;">
    <h3 style="font-size:1.4rem;margin-bottom:0.75rem;">Want to Add Your Tool or Contribute?</h3>
    <p style="color:var(--text-muted);max-width:600px;margin:0 auto 1.5rem;line-height:1.6;">
      StaticStack is open for community contributions. If you built or use a tool that belongs in this directory, we'd love to feature it!
    </p>
    <div style="display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;">
      <a href="/submit/" class="btn btn-primary" style="display:inline-flex;align-items:center;gap:0.4rem;">
        Submit a Tool ${ICONS.arrowRight}
      </a>
      <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.4rem;">
        Visit GitHub Repo ${ICONS.external}
      </a>
    </div>
  </div>
`;

fs.writeFileSync(
  path.join(PUBLIC_DIR, 'thank-you', 'index.html'),
  renderLayout({
    title: 'Thank You & Credits - Community & Open Source Recognition',
    description: 'Acknowledging the open-source creators, tool authors, community contributors, and Wasmer Edge hosting powering StaticStack.',
    canonicalPath: '/thank-you/',
    content: thankYouContent,
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: 'Thank You & Credits', url: '/thank-you/' }
    ]
  })
);

// Generate 404 Not Found Page
const notFoundContent = `
  <div style="text-align:center;padding:5rem 1rem 4rem;max-width:600px;margin:0 auto;">
    <div style="font-size:5rem;font-weight:900;line-height:1;margin-bottom:1rem;background:linear-gradient(135deg, var(--accent), #06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
      404
    </div>
    <h1 style="font-size:2rem;margin-bottom:1rem;color:var(--text-main);">Page Not Found</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin-bottom:2rem;">
      The page or directory you are looking for does not exist or may have moved.
    </p>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
      <a href="/" class="btn btn-primary" style="display:inline-flex;align-items:center;gap:0.4rem;">
        Back to Home ${ICONS.arrowRight}
      </a>
      <a href="/archive/" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.4rem;">
        Explore Directory
      </a>
    </div>
  </div>
`;

fs.writeFileSync(
  path.join(PUBLIC_DIR, '404.html'),
  renderLayout({
    title: '404 - Page Not Found | StaticStack',
    description: 'The requested page could not be found on StaticStack.',
    canonicalPath: '/404.html',
    content: notFoundContent,
    breadcrumbs: [
      { label: 'Home', url: '/' },
      { label: '404 Not Found', url: '/404.html' }
    ]
  })
);

// ==========================================================================
// 9. Generate XML Sitemap & Robots.txt for Super SEO
// ==========================================================================
console.log('🗺️ Generating XML Sitemap & Robots.txt...');

const today = new Date().toISOString().split('T')[0];

const sitemapUrls = [
  { loc: 'https://staticstack.app/', priority: '1.0', changefreq: 'daily' },
  { loc: 'https://staticstack.app/archive/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://staticstack.app/submit/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://staticstack.app/contributing/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://staticstack.app/thank-you/', priority: '0.7', changefreq: 'monthly' }
];

// Add all 25 category pages
categories.forEach(cat => {
  sitemapUrls.push({
    loc: `https://staticstack.app/categories/${cat.slug}/`,
    priority: '0.85',
    changefreq: 'weekly'
  });
});

// Add all tools
allTools.forEach(tool => {
  sitemapUrls.push({
    loc: `https://staticstack.app/tools/${tool.categorySlug}/${tool.slug}/`,
    priority: '0.75',
    changefreq: 'weekly'
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml);

const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://staticstack.app/sitemap.xml
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt);

// ==========================================================================
// 10. Generate Search Index (public/search-data.json)
// ==========================================================================
console.log('🔍 Generating Search Index JSON...');

const searchIndex = [];

// Add categories to search index
categories.forEach(cat => {
  searchIndex.push({
    title: cat.title,
    description: cat.description,
    category: 'Category',
    url: `/categories/${cat.slug}/`
  });
});

// Add tools to search index
allTools.forEach(tool => {
  searchIndex.push({
    title: tool.name,
    description: tool.description,
    category: tool.categoryTitle,
    url: `/tools/${tool.categorySlug}/${tool.slug}/`
  });
});

fs.writeFileSync(
  path.join(PUBLIC_DIR, 'search-data.json'),
  JSON.stringify(searchIndex, null, 2)
);

console.log(`🎉 Static site successfully generated in public/ directory! (${allTools.length} tools, ${categories.length} categories, ${sitemapUrls.length} sitemap URLs)`);

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
