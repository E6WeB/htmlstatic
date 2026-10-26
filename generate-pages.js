/**
 * Unified HTML Site Generator
 * Generates standalone, zero-dependency HTML pages using pure native system typography:
 * - index.html (Home)
 * - archive.html (Master Archive)
 * - submit.html (Submit a Tool)
 * - contribute.html (Contributing Guide)
 * - thankyou.html (Thank You & Credits)
 *
 * All pages feature:
 * - Pure system-style font stack (no Google Fonts)
 * - Light theme default with segmented [ ☀️ Light | 🌙 Dark ] switcher
 * - Proper original navigation menu (Home | Archive | Submit | GitHub)
 * - Floating Back to Top button
 * - In-page modals and client-side instant search
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

marked.setOptions({
  gfm: true,
  breaks: false
});

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Icons
const ICONS = {
  logo: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  external: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  arrowUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
  sun: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  github: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>`,
  check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  star: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  tag: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  branch: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`,
  book: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  sparkles: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
};

// Category Icons
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
  'static-site-generators': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  'surveys-feedback': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`,
  'typography-fonts': `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`
};

function parseBadges(badgeHtml) {
  const badges = [];
  const regex = /alt="([^"]+)"/g;
  let match;
  while ((match = regex.exec(badgeHtml)) !== null) {
    badges.push(match[1].trim());
  }
  if (badges.length === 0) badges.push('Free');
  return badges;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Parse README
const readmeContent = fs.readFileSync(path.join(ROOT_DIR, 'README.md'), 'utf8');
const sections = readmeContent.split(/\n(?=##\s+)/);
const categories = [];
const allTools = [];

for (const section of sections) {
  const headerMatch = section.match(/^##\s+([^\n\r]+)/);
  if (!headerMatch) continue;
  const title = headerMatch[1].trim();

  if (['Table of Contents', 'How to Contribute', 'Submission Guidelines', 'Help Grow the Collection', 'Community & Discussion', 'License'].includes(title)) {
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
    const folder = parts[0];
    const file = parts[1] || '';
    const toolSlug = file.replace(/\.md$/, '');

    let tagline = toolDesc;
    let overview = '';
    if (fs.existsSync(path.join(ROOT_DIR, rawPath))) {
      const mdContent = fs.readFileSync(path.join(ROOT_DIR, rawPath), 'utf8');
      const quoteMatch = mdContent.match(/>\s*([^\n\r]+)/);
      if (quoteMatch) tagline = quoteMatch[1].trim();
      const overviewMatch = mdContent.match(/##\s+Overview\s*\n+([\s\S]*?)(?=\n+---|\n+##|$)/);
      if (overviewMatch) overview = overviewMatch[1].trim().replace(/\n+/g, ' ');
    }

    const badges = parseBadges(badgeHtml);
    const primaryBadge = badges[0] || 'Free';

    const toolObj = {
      name: toolName,
      slug: toolSlug,
      relPath: rawPath,
      folder: folder,
      categoryTitle: title,
      description: toolDesc,
      tagline: tagline,
      overview: overview,
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

console.log(`Parsed ${categories.length} categories and ${allTools.length} tools.`);

// ==========================================================================
// Base CSS using Native System Font Stack (NO Google Fonts)
// ==========================================================================
const BASE_CSS = `
  :root {
    /* Native System Font Stacks */
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

    /* Light Theme Palette (DEFAULT) */
    --bg-body: #f8fafc;
    --bg-surface: #ffffff;
    --bg-surface-elevated: #ffffff;
    --bg-muted: #f1f5f9;
    --bg-glass: rgba(255, 255, 255, 0.88);
    --border-color: #e2e8f0;
    --border-hover: #cbd5e1;
    --border-focus: #2563eb;
    --text-main: #0f172a;
    --text-muted: #475569;
    --text-subtle: #64748b;

    --accent: #2563eb;
    --accent-hover: #1d4ed8;
    --accent-light: #eff6ff;
    --accent-gradient: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);

    /* Badges */
    --badge-open-source-bg: #dcfce7;
    --badge-open-source-text: #166534;
    --badge-free-bg: #dcfce7;
    --badge-free-text: #15803d;
    --badge-freemium-bg: #dbeafe;
    --badge-freemium-text: #1e40af;
    --badge-paid-bg: #fef3c7;
    --badge-paid-text: #92400e;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
    --shadow-card: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
    --shadow-card-hover: 0 12px 24px -6px rgba(15, 23, 42, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.06);

    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-full: 9999px;
    --container-max: 1240px;
  }

  [data-theme="dark"] {
    --bg-body: #0b0f19;
    --bg-surface: #111827;
    --bg-surface-elevated: #1a2234;
    --bg-muted: #1e293b;
    --bg-glass: rgba(17, 24, 39, 0.88);
    --border-color: #1f293d;
    --border-hover: #334155;
    --border-focus: #60a5fa;
    --text-main: #f9fafb;
    --text-muted: #94a3b8;
    --text-subtle: #64748b;

    --accent: #3b82f6;
    --accent-hover: #60a5fa;
    --accent-light: rgba(59, 130, 246, 0.12);
    --accent-gradient: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);

    --badge-open-source-bg: rgba(34, 197, 94, 0.15);
    --badge-open-source-text: #4ade80;
    --badge-free-bg: rgba(34, 197, 94, 0.15);
    --badge-free-text: #4ade80;
    --badge-freemium-bg: rgba(59, 130, 246, 0.15);
    --badge-freemium-text: #93c5fd;
    --badge-paid-bg: rgba(245, 158, 11, 0.15);
    --badge-paid-text: #fcd34d;

    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6);
    --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.4);
    --shadow-card-hover: 0 14px 28px -6px rgba(0, 0, 0, 0.7);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-family: var(--font-sans);
    color: var(--text-main);
    background-color: var(--bg-body);
    line-height: 1.6;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
  }

  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-body);
    color: var(--text-main);
    transition: background-color 0.25s ease, color 0.25s ease;
  }

  a {
    color: var(--accent);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  a:hover {
    color: var(--accent-hover);
  }

  .container {
    width: 100%;
    max-width: var(--container-max);
    margin-left: auto;
    margin-right: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    font-size: 0.925rem;
    font-weight: 600;
    padding: 0.6rem 1.15rem;
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: pointer;
    text-decoration: none;
    font-family: inherit;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: var(--accent-gradient);
    color: #ffffff !important;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.25);
  }

  .btn-primary:hover {
    opacity: 0.95;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.35);
  }

  .btn-secondary {
    background-color: var(--bg-surface);
    color: var(--text-main) !important;
    border-color: var(--border-color);
  }

  .btn-secondary:hover {
    background-color: var(--bg-muted);
    border-color: var(--border-hover);
    transform: translateY(-1px);
  }

  .btn-sm {
    padding: 0.4rem 0.75rem;
    font-size: 0.825rem;
  }

  /* Header */
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: var(--bg-glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border-color);
    transition: all 0.25s ease;
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4.25rem;
    gap: 1.5rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--text-main);
    text-decoration: none;
    letter-spacing: -0.02em;
  }

  .brand-icon {
    width: 2.25rem;
    height: 2.25rem;
    background: var(--accent-gradient);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  }

  .brand-badge {
    font-size: 0.75rem;
    background: var(--accent-light);
    color: var(--accent);
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-full);
    font-weight: 600;
    margin-left: 0.25rem;
    border: 1px solid var(--border-color);
  }

  .nav-links {
    display: flex;
    align-items: center;
    list-style: none;
    gap: 0.5rem;
  }

  .nav-link {
    color: var(--text-muted);
    font-size: 0.925rem;
    font-weight: 500;
    padding: 0.45rem 0.8rem;
    border-radius: var(--radius-sm);
    transition: all 0.15s ease;
  }

  .nav-link:hover {
    color: var(--accent);
    background-color: var(--accent-light);
  }

  .nav-link.active {
    color: var(--accent);
    background-color: var(--accent-light);
    font-weight: 700;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  /* Segmented Theme Switcher */
  .theme-segmented-switch {
    display: inline-flex;
    align-items: center;
    background: var(--bg-muted);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    padding: 3px;
    gap: 2px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .theme-seg-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-full);
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-muted);
    font-size: 0.8rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .theme-seg-btn:hover {
    color: var(--text-main);
  }

  .theme-seg-btn.active {
    background: var(--bg-surface);
    color: var(--text-main);
    border-color: var(--border-color);
    box-shadow: var(--shadow-sm);
  }

  .theme-seg-btn .seg-icon {
    display: flex;
    align-items: center;
  }

  /* Floating Back to Top Button */
  .back-to-top-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 99;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.65rem 1.05rem;
    background: var(--bg-surface);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    opacity: 0;
    pointer-events: none;
    transform: translateY(16px);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .back-to-top-btn.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .back-to-top-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 12px 28px rgba(37, 99, 235, 0.25);
    transform: translateY(-3px);
  }

  .back-to-top-btn .btt-icon {
    display: flex;
    align-items: center;
    transition: transform 0.2s ease;
  }

  .back-to-top-btn:hover .btt-icon {
    transform: translateY(-2px);
  }

  /* Breadcrumbs */
  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-subtle);
    padding: 1.5rem 0 0.5rem;
  }

  .breadcrumbs a {
    color: var(--text-muted);
  }

  .breadcrumbs a:hover {
    color: var(--accent);
  }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-full);
    white-space: nowrap;
  }

  .badge-open-source {
    background: var(--badge-open-source-bg);
    color: var(--badge-open-source-text);
  }

  .badge-free {
    background: var(--badge-free-bg);
    color: var(--badge-free-text);
  }

  .badge-freemium {
    background: var(--badge-freemium-bg);
    color: var(--badge-freemium-text);
  }

  .badge-paid {
    background: var(--badge-paid-bg);
    color: var(--badge-paid-text);
  }

  /* Footer */
  .site-footer {
    background: var(--bg-surface);
    border-top: 1px solid var(--border-color);
    padding: 4rem 0 2rem;
    margin-top: auto;
  }

  .footer-inner {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 3rem;
  }

  .footer-desc {
    color: var(--text-muted);
    font-size: 0.925rem;
    margin-top: 0.85rem;
    max-width: 420px;
    line-height: 1.6;
  }

  .footer-col h4 {
    font-size: 0.95rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-main);
  }

  .footer-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .footer-links a {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .footer-links a:hover {
    color: var(--accent);
  }

  .footer-bottom {
    border-top: 1px solid var(--border-color);
    padding-top: 2rem;
    text-align: center;
    color: var(--text-subtle);
    font-size: 0.85rem;
  }

  /* Markdown Body Rendering */
  .markdown-body {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 2.5rem;
    margin-bottom: 3rem;
    box-shadow: var(--shadow-card);
  }

  .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
    color: var(--text-main);
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    font-weight: 700;
  }

  .markdown-body h1 { font-size: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-top: 0; }
  .markdown-body h2 { font-size: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem; }
  .markdown-body h3 { font-size: 1.25rem; }
  .markdown-body p { margin-bottom: 1.2rem; color: var(--text-main); line-height: 1.7; }
  .markdown-body ul, .markdown-body ol { margin-bottom: 1.25rem; padding-left: 1.75rem; }
  .markdown-body li { margin-bottom: 0.4rem; color: var(--text-main); line-height: 1.6; }
  .markdown-body hr { border: none; border-top: 1px solid var(--border-color); margin: 2rem 0; }
  .markdown-body blockquote {
    border-left: 4px solid var(--accent);
    padding: 0.75rem 1.25rem;
    background: var(--accent-light);
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    margin-bottom: 1.5rem;
  }
  .markdown-body table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
  }
  .markdown-body th, .markdown-body td {
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    text-align: left;
  }
  .markdown-body th {
    background: var(--bg-muted);
    font-weight: 700;
  }

  @media (max-width: 860px) {
    .nav-links {
      gap: 0.25rem;
    }
    .footer-inner {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .back-to-top-btn {
      bottom: 1.25rem;
      right: 1.25rem;
      padding: 0.6rem 0.85rem;
    }
  }
`;

// Shared Layout Wrapper
function renderLayout({
  title,
  description,
  currentNav = '',
  content,
  breadcrumbs = []
}) {
  const cleanDescription = description || 'StaticStack - A community-curated collection of tools, services, and resources for static websites with zero backend servers.';
  const pageTitle = title.includes('StaticStack') ? title : `${title} | StaticStack`;

  const breadcrumbHtml = breadcrumbs.length > 0 ? `
    <nav class="breadcrumbs" aria-label="Breadcrumbs">
      ${breadcrumbs.map((b, i) => i === breadcrumbs.length - 1 ? `<span>${escapeHtml(b.label)}</span>` : `<a href="${b.url}">${escapeHtml(b.label)}</a><span>/</span>`).join('')}
    </nav>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(cleanDescription)}">
  <meta name="theme-color" content="#2563eb">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 2 7 12 12 22 7 12 2'/><polyline points='2 17 12 22 22 17'/><polyline points='2 12 12 17 22 12'/></svg>">
  <style>
    ${BASE_CSS}
  </style>
</head>
<body>

  <!-- Site Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="brand">
        <span class="brand-icon">${ICONS.logo}</span>
        <span>StaticStack</span>
        <span class="brand-badge">Toolkit</span>
      </a>

      <!-- Original Clean Nav Menu -->
      <nav class="nav-drawer">
        <ul id="nav-links" class="nav-links">
          <li><a href="index.html" class="nav-link ${currentNav === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="archive.html" class="nav-link ${currentNav === 'archive' ? 'active' : ''}">Archive</a></li>
          <li><a href="submit.html" class="nav-link ${currentNav === 'submit' ? 'active' : ''}">Submit</a></li>
          <li><a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="nav-link" style="display:flex;align-items:center;gap:0.35rem;">${ICONS.github} GitHub</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <!-- Segmented Theme Switcher (Default Light) -->
        <div class="theme-segmented-switch" role="radiogroup" aria-label="Color Theme">
          <button class="theme-seg-btn active" data-theme-val="light" aria-label="Light Mode" title="Light Mode">
            <span class="seg-icon">${ICONS.sun}</span>
            <span>Light</span>
          </button>
          <button class="theme-seg-btn" data-theme-val="dark" aria-label="Dark Mode" title="Dark Mode">
            <span class="seg-icon">${ICONS.moon}</span>
            <span>Dark</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="site-main container">
    ${breadcrumbHtml}
    ${content}
  </main>

  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <div>
          <a href="index.html" class="brand" style="margin-bottom: 0.75rem;">
            <span class="brand-icon">${ICONS.logo}</span>
            <span>StaticStack</span>
          </a>
          <p class="footer-desc">
            A community-curated collection of tools, services, and resources for building, hosting, and improving static websites with HTML, CSS, and JavaScript—zero backend servers required.
          </p>
        </div>

        <div class="footer-col">
          <h4>Navigation</h4>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="archive.html">Master Archive</a></li>
            <li><a href="submit.html">Submit a Tool</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Community &amp; Project</h4>
          <ul class="footer-links">
            <li><a href="contribute.html">Contributing Guide</a></li>
            <li><a href="thankyou.html">Thank You &amp; Credits</a></li>
            <li><a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
            <li><a href="https://github.com/E6WeB/htmlstatic/issues" target="_blank" rel="noopener noreferrer">Submit an Issue</a></li>
            <li><a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 1.0 Public Domain</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; <span id="year">2026</span> StaticStack. Built with Native System Typography. Zero backend servers required.</p>
      </div>
    </div>
  </footer>

  <!-- Floating Back to Top Button -->
  <button id="back-to-top" class="back-to-top-btn" aria-label="Back to top" title="Back to top" onclick="scrollToTop()">
    <span class="btt-icon">${ICONS.arrowUp}</span>
    <span>Back to Top</span>
  </button>

  <script>
    // Theme Management (DEFAULT LIGHT)
    const themeSegButtons = document.querySelectorAll('.theme-seg-btn');
    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('swt-theme', theme);
      themeSegButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme-val') === theme);
      });
    }

    const savedTheme = localStorage.getItem('swt-theme') || 'light';
    setTheme(savedTheme);

    themeSegButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTheme(btn.getAttribute('data-theme-val'));
      });
    });

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Floating Back to Top
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  </script>
</body>
</html>
`;
}

// ==========================================================================
// 1. Generate index.html (Home Page)
// ==========================================================================
console.log('🏠 Generating Home Page (index.html)...');

const homeContent = `
  <section class="hero" style="text-align:center; padding: 4rem 0 3rem;">
    <div style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.35rem 0.9rem; background:var(--accent-light); color:var(--accent); border:1px solid var(--border-color); border-radius:var(--radius-full); font-size:0.85rem; font-weight:600; margin-bottom:1.5rem;">
      ${ICONS.sparkles} 100% Jamstack • Zero Backend Servers Required
    </div>
    <h1 style="font-size:clamp(2.2rem, 5vw, 3.5rem); font-weight:800; line-height:1.15; letter-spacing:-0.03em; margin-bottom:1.25rem;">
      Empower Static Websites with <span style="background:var(--accent-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Zero Backend Servers</span>
    </h1>
    <p style="font-size:clamp(1.05rem, 2vw, 1.25rem); color:var(--text-muted); max-width:740px; margin:0 auto 2rem; line-height:1.6;">
      You don't need WordPress, a monolithic CMS, or expensive cloud servers. Discover 94+ curated tools, services, and APIs for building modern static sites with HTML, CSS, and JavaScript.
    </p>

    <!-- Command Hero Search Hub -->
    <div style="max-width:660px; margin:0 auto 2.5rem;">
      <div style="display:flex; align-items:center; background:var(--bg-surface); border:2px solid var(--border-color); border-radius:var(--radius-full); padding:0.4rem 0.75rem 0.4rem 1.25rem; box-shadow:0 10px 25px -5px rgba(0,0,0,0.08);">
        <span style="color:var(--accent); display:flex; align-items:center; margin-right:0.5rem;">${ICONS.search}</span>
        <input type="text" id="hero-search-input" style="flex:1; border:none; background:transparent; outline:none; font-size:1.05rem; font-family:inherit; color:var(--text-main); padding:0.45rem 0.5rem;" placeholder="Search 94+ static tools, APIs, forms, auth..." autocomplete="off">
        <span style="background:var(--bg-muted); border:1px solid var(--border-color); padding:0.15rem 0.5rem; border-radius:4px; font-size:0.75rem; font-family:var(--font-mono); color:var(--text-subtle);">/</span>
      </div>
      <div style="display:flex; align-items:center; justify-content:center; gap:0.45rem; flex-wrap:wrap; margin-top:1rem; font-size:0.825rem;">
        <span style="color:var(--text-subtle); font-weight:500;">Popular:</span>
        <button class="btn-sm btn-secondary" onclick="quickSearchTag('Reflow')" style="padding:0.2rem 0.65rem; border-radius:var(--radius-full); font-size:0.775rem;">Reflow</button>
        <button class="btn-sm btn-secondary" onclick="quickSearchTag('Clerk')" style="padding:0.2rem 0.65rem; border-radius:var(--radius-full); font-size:0.775rem;">Clerk</button>
        <button class="btn-sm btn-secondary" onclick="quickSearchTag('Pagefind')" style="padding:0.2rem 0.65rem; border-radius:var(--radius-full); font-size:0.775rem;">Pagefind</button>
        <button class="btn-sm btn-secondary" onclick="quickSearchTag('Astro')" style="padding:0.2rem 0.65rem; border-radius:var(--radius-full); font-size:0.775rem;">Astro</button>
        <button class="btn-sm btn-secondary" onclick="quickSearchTag('Formspree')" style="padding:0.2rem 0.65rem; border-radius:var(--radius-full); font-size:0.775rem;">Formspree</button>
        <button class="btn-sm btn-secondary" onclick="quickSearchTag('Pico CSS')" style="padding:0.2rem 0.65rem; border-radius:var(--radius-full); font-size:0.775rem;">Pico CSS</button>
        <button class="btn-sm btn-secondary" onclick="quickSearchTag('Supabase')" style="padding:0.2rem 0.65rem; border-radius:var(--radius-full); font-size:0.775rem;">Supabase</button>
      </div>
    </div>

    <div style="display:flex; align-items:center; justify-content:center; gap:1rem; flex-wrap:wrap; margin-bottom:3.5rem;">
      <a href="archive.html" class="btn btn-primary">
        Browse Master Archive ${ICONS.arrowRight}
      </a>
      <a href="#categories" class="btn btn-secondary">
        Browse 25 Categories
      </a>
      <a href="submit.html" class="btn btn-secondary">
        Submit a Tool
      </a>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1.25rem; max-width:960px; margin:0 auto; padding:1.75rem 2rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); box-shadow:var(--shadow-card);">
      <div>
        <div style="font-size:2rem; font-weight:800; color:var(--accent); margin-bottom:0.25rem;">25</div>
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">Curated Categories</div>
      </div>
      <div>
        <div style="font-size:2rem; font-weight:800; color:var(--accent); margin-bottom:0.25rem;">94</div>
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">Hand-Picked Tools</div>
      </div>
      <div>
        <div style="font-size:2rem; font-weight:800; color:var(--accent); margin-bottom:0.25rem;">0%</div>
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">Server Maintenance</div>
      </div>
      <div>
        <div style="font-size:2rem; font-weight:800; color:var(--accent); margin-bottom:0.25rem;">100%</div>
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:500;">Free &amp; Open Source</div>
      </div>
    </div>
  </section>

  <!-- Categories Grid -->
  <section id="categories" style="padding: 3rem 0;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:2rem; gap:1rem; flex-wrap:wrap;">
      <div>
        <h2 style="font-size:1.85rem; font-weight:800; margin-bottom:0.35rem;">Explore by Category</h2>
        <p style="color:var(--text-muted); font-size:1rem;">Jump to any category or view all tools in the master archive.</p>
      </div>
      <a href="archive.html" class="btn btn-secondary" style="font-size:0.85rem;">View Full Archive →</a>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(270px, 1fr)); gap:1.25rem;">
      ${categories.map(cat => {
        const icon = CATEGORY_ICONS[cat.slug] || ICONS.zap;
        return `
        <a href="archive.html#${cat.slug}" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; display:flex; flex-direction:column; color:var(--text-main); box-shadow:var(--shadow-card); transition:all 0.2s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div style="width:2.5rem; height:2.5rem; border-radius:var(--radius-md); background:var(--accent-light); color:var(--accent); display:flex; align-items:center; justify-content:center;">${icon}</div>
            <span style="font-size:0.75rem; font-weight:700; padding:0.2rem 0.6rem; background:var(--bg-muted); color:var(--text-muted); border-radius:var(--radius-full); border:1px solid var(--border-color);">${cat.tools.length} Tools</span>
          </div>
          <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">${escapeHtml(cat.title)}</h3>
          <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.5; flex-grow:1; margin-bottom:1rem;">${escapeHtml(cat.description)}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; font-weight:600; color:var(--accent); padding-top:0.75rem; border-top:1px solid var(--border-color);">
            <span>Browse Section</span>
            <span>${ICONS.arrowRight}</span>
          </div>
        </a>
        `;
      }).join('')}
    </div>
  </section>

  <!-- Featured / Quick Search Results Container -->
  <section id="search-section" style="padding: 2rem 0 4rem;">
    <div id="catalog-controls" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:2rem; box-shadow:var(--shadow-card);">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
        <div style="flex:1 1 300px; position:relative;">
          <input type="text" id="tool-search" style="width:100%; padding:0.6rem 2rem 0.6rem 2.5rem; background:var(--bg-body); border:1px solid var(--border-color); border-radius:var(--radius-full); font-size:0.925rem; color:var(--text-main); font-family:inherit; outline:none;" placeholder="Filter tools below by name, category, or keyword...">
          <span style="position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:var(--text-subtle); display:flex;">${ICONS.search}</span>
        </div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn btn-sm btn-secondary filter-btn active" data-filter="all">All (94)</button>
          <button class="btn btn-sm btn-secondary filter-btn" data-filter="open-source">Open Source</button>
          <button class="btn btn-sm btn-secondary filter-btn" data-filter="free">Free</button>
          <button class="btn btn-sm btn-secondary filter-btn" data-filter="freemium">Freemium</button>
          <button class="btn btn-sm btn-secondary filter-btn" data-filter="paid">Paid</button>
        </div>
        <select id="category-filter-select" style="padding:0.5rem 0.85rem; background:var(--bg-body); border:1px solid var(--border-color); color:var(--text-main); border-radius:var(--radius-md); font-family:inherit; font-size:0.85rem;">
          <option value="all">All Categories</option>
          ${categories.map(c => `<option value="${c.slug}">${escapeHtml(c.title)} (${c.tools.length})</option>`).join('')}
        </select>
      </div>
      <div id="results-count" style="font-size:0.85rem; color:var(--text-subtle); margin-top:0.75rem;">Showing 94 of 94 tools</div>
    </div>

    <div id="tools-container" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
      ${allTools.map(t => {
        let badgeClass = 'badge-freemium';
        let badgeIcon = ICONS.star;
        const pBadge = t.primaryBadge.toLowerCase();
        if (pBadge.includes('open source')) {
          badgeClass = 'badge-open-source';
          badgeIcon = ICONS.branch;
        } else if (pBadge.includes('free')) {
          badgeClass = 'badge-free';
          badgeIcon = ICONS.check;
        } else if (pBadge.includes('paid')) {
          badgeClass = 'badge-paid';
          badgeIcon = ICONS.tag;
        }

        return `
        <div class="tool-card"
             onclick="openToolModal('${escapeHtml(t.slug)}')"
             style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; display:flex; flex-direction:column; box-shadow:var(--shadow-card); cursor:pointer; transition:all 0.2s ease;"
             data-name="${escapeHtml(t.name.toLowerCase())}"
             data-category="${escapeHtml(t.folder)}"
             data-badge="${escapeHtml(pBadge)}"
             data-desc="${escapeHtml(t.description.toLowerCase())}"
             data-slug="${escapeHtml(t.slug)}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.6rem; gap:0.5rem;">
            <h3 style="font-size:1.2rem; font-weight:700; margin:0;">${escapeHtml(t.name)}</h3>
            <span class="badge ${badgeClass}">${badgeIcon} ${escapeHtml(t.primaryBadge)}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-subtle); font-weight:600; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.65rem;">${escapeHtml(t.categoryTitle)}</div>
          <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.55; margin-bottom:1.25rem; flex-grow:1;">${escapeHtml(t.description)}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1px solid var(--border-color); gap:0.5rem;">
            <a href="${escapeHtml(t.websiteUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" onclick="event.stopPropagation()">
              Visit Site ${ICONS.external}
            </a>
            <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openToolModal('${escapeHtml(t.slug)}')">
              ${ICONS.info} Details
            </button>
          </div>
        </div>
        `;
      }).join('')}
    </div>
  </section>

  <!-- Quick View Modal -->
  <div id="tool-modal-backdrop" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px); z-index:1000; display:none; align-items:center; justify-content:center; padding:1.5rem;" onclick="handleBackdropClick(event)">
    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); width:100%; max-width:600px; max-height:85vh; overflow-y:auto; padding:2rem; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); position:relative;">
      <button onclick="closeToolModal()" style="position:absolute; top:1.25rem; right:1.25rem; background:var(--bg-muted); border:1px solid var(--border-color); color:var(--text-muted); width:2rem; height:2rem; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; cursor:pointer;" aria-label="Close dialog">${ICONS.close}</button>
      <div id="modal-content"></div>
    </div>
  </div>

  <script>
    const TOOLS_DATA = ${JSON.stringify(allTools)};

    const heroSearchInput = document.getElementById('hero-search-input');
    const catalogSearchInput = document.getElementById('tool-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categorySelect = document.getElementById('category-filter-select');
    const toolCards = document.querySelectorAll('.tool-card');
    const resultsCountEl = document.getElementById('results-count');

    let currentFilter = 'all';
    let currentCategory = 'all';
    let searchQuery = '';

    function applyFilters() {
      let count = 0;
      const q = searchQuery.trim().toLowerCase();
      toolCards.forEach(c => {
        const name = c.getAttribute('data-name');
        const cat = c.getAttribute('data-category');
        const badge = c.getAttribute('data-badge');
        const desc = c.getAttribute('data-desc');

        const matchSearch = !q || name.includes(q) || desc.includes(q) || cat.includes(q);
        const matchBadge = currentFilter === 'all' || badge.includes(currentFilter.replace('-', ' '));
        const matchCat = currentCategory === 'all' || cat === currentCategory;

        if (matchSearch && matchBadge && matchCat) {
          c.style.display = 'flex';
          count++;
        } else {
          c.style.display = 'none';
        }
      });
      if (resultsCountEl) resultsCountEl.textContent = \`Showing \${count} of \${toolCards.length} tools\`;
    }

    function syncSearch(query, scroll = false) {
      searchQuery = query;
      if (heroSearchInput && heroSearchInput.value !== query) heroSearchInput.value = query;
      if (catalogSearchInput && catalogSearchInput.value !== query) catalogSearchInput.value = query;
      applyFilters();
      if (scroll) {
        document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (heroSearchInput) {
      heroSearchInput.addEventListener('input', e => syncSearch(e.target.value, false));
    }
    if (catalogSearchInput) {
      catalogSearchInput.addEventListener('input', e => syncSearch(e.target.value, false));
    }

    function quickSearchTag(tag) {
      syncSearch(tag, true);
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        applyFilters();
      });
    });

    if (categorySelect) {
      categorySelect.addEventListener('change', e => {
        currentCategory = e.target.value;
        applyFilters();
      });
    }

    // Modal
    const modalBackdrop = document.getElementById('tool-modal-backdrop');
    const modalContent = document.getElementById('modal-content');

    function openToolModal(slug) {
      const tool = TOOLS_DATA.find(t => t.slug === slug);
      if (!tool || !modalContent) return;

      modalContent.innerHTML = \`
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.4rem;">
          \${tool.categoryTitle}
        </div>
        <h2 style="font-size:1.75rem; margin-bottom:0.75rem;">\${tool.name}</h2>
        <div style="margin-bottom:1.25rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
          \${tool.badges.map(b => \`<span class="badge badge-freemium">\${b}</span>\`).join('')}
        </div>
        <p style="font-size:1.05rem; line-height:1.6; margin-bottom:1.25rem; color:var(--text-main);">
          \${tool.tagline || tool.description}
        </p>
        \${tool.overview ? \`
          <div style="background:var(--bg-muted); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1rem 1.25rem; margin-bottom:1.5rem; font-size:0.9rem; line-height:1.6; color:var(--text-muted);">
            <div style="font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">Overview:</div>
            \${tool.overview}
          </div>
        \` : ''}
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:1.5rem;">
          <a href="\${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            Visit Website ${ICONS.external}
          </a>
          <a href="\${tool.relPath}" class="btn btn-secondary">
            ${ICONS.book} Markdown Guide
          </a>
        </div>
      \`;
      modalBackdrop.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeToolModal() {
      if (!modalBackdrop) return;
      modalBackdrop.style.display = 'none';
      document.body.style.overflow = '';
    }

    function handleBackdropClick(e) {
      if (e.target === modalBackdrop) closeToolModal();
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeToolModal();
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== heroSearchInput && document.activeElement !== catalogSearchInput) {
        e.preventDefault();
        if (heroSearchInput) heroSearchInput.focus();
      }
    });
  </script>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), renderLayout({
  title: 'StaticStack - Modern Tools & APIs for Static Websites',
  description: 'Curated directory of 94+ tools, services, and APIs for building high-performance static websites with HTML, CSS, and JavaScript—zero backend servers required.',
  currentNav: 'home',
  content: homeContent
}));

// ==========================================================================
// 2. Generate archive.html (Master Archive Page)
// ==========================================================================
console.log('📚 Generating Archive Page (archive.html)...');

const archiveContent = `
  <div style="padding: 2.5rem 0 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2.5rem;">
    <h1 style="font-size:2.25rem; font-weight:800; margin-bottom:0.5rem;">Master Directory Archive</h1>
    <p style="font-size:1.15rem; color:var(--text-muted); max-width:760px; line-height:1.6;">
      Complete catalog of all 94 tools across 25 categories for static websites. Filter by pricing or jump directly to any category section.
    </p>

    <!-- Filter Buttons -->
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:1.5rem;">
      <button class="btn btn-sm btn-secondary archive-filter active" data-filter="all">All Tools (94)</button>
      <button class="btn btn-sm btn-secondary archive-filter" data-filter="open-source">Open Source</button>
      <button class="btn btn-sm btn-secondary archive-filter" data-filter="free">Free</button>
      <button class="btn btn-sm btn-secondary archive-filter" data-filter="freemium">Freemium</button>
      <button class="btn btn-sm btn-secondary archive-filter" data-filter="paid">Paid</button>
    </div>
  </div>

  <div style="display:grid; grid-template-columns: 240px 1fr; gap:2.5rem; align-items:start;">
    <!-- Sticky Sidebar Category Links -->
    <aside style="position:sticky; top:5.5rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.25rem; max-height:calc(100vh - 7rem); overflow-y:auto;">
      <div style="font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--text-subtle); margin-bottom:0.75rem;">Categories</div>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:0.35rem;">
        ${categories.map(c => `
          <li>
            <a href="#${c.slug}" style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; color:var(--text-muted); padding:0.3rem 0.5rem; border-radius:var(--radius-sm);">
              <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(c.title)}</span>
              <span style="font-size:0.75rem; color:var(--text-subtle);">${c.tools.length}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </aside>

    <!-- Category Sections & Tool Tables -->
    <div>
      ${categories.map(cat => {
        const icon = CATEGORY_ICONS[cat.slug] || ICONS.zap;
        return `
        <section id="${cat.slug}" style="margin-bottom:3.5rem; scroll-margin-top:6rem;">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.75rem;">
            <div style="color:var(--accent);">${icon}</div>
            <h2 style="font-size:1.6rem; font-weight:800; margin:0;">${escapeHtml(cat.title)}</h2>
            <span style="font-size:0.8rem; background:var(--accent-light); color:var(--accent); padding:0.15rem 0.55rem; border-radius:var(--radius-full); font-weight:700;">${cat.tools.length} tools</span>
          </div>
          <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.55; margin-bottom:1.25rem;">${escapeHtml(cat.description)}</p>

          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-card);">
            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;">
              <thead>
                <tr style="background:var(--bg-muted); border-bottom:1px solid var(--border-color);">
                  <th style="padding:0.75rem 1rem; width:20%;">Tool</th>
                  <th style="padding:0.75rem 1rem; width:45%;">Description</th>
                  <th style="padding:0.75rem 1rem; width:20%;">Pricing</th>
                  <th style="padding:0.75rem 1rem; width:15%;">Website</th>
                </tr>
              </thead>
              <tbody>
                ${cat.tools.map(tool => {
                  const pBadge = tool.primaryBadge.toLowerCase();
                  let badgeClass = 'badge-freemium';
                  if (pBadge.includes('open source')) badgeClass = 'badge-open-source';
                  else if (pBadge.includes('free')) badgeClass = 'badge-free';
                  else if (pBadge.includes('paid')) badgeClass = 'badge-paid';

                  return `
                  <tr class="archive-row" data-badge="${escapeHtml(pBadge)}" style="border-bottom:1px solid var(--border-color);">
                    <td style="padding:0.85rem 1rem; font-weight:700;">
                      <a href="${tool.relPath}">${escapeHtml(tool.name)}</a>
                    </td>
                    <td style="padding:0.85rem 1rem; color:var(--text-muted); line-height:1.5;">${escapeHtml(tool.description)}</td>
                    <td style="padding:0.85rem 1rem;">
                      <span class="badge ${badgeClass}">${escapeHtml(tool.primaryBadge)}</span>
                    </td>
                    <td style="padding:0.85rem 1rem;">
                      <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:0.25rem;">
                        ${escapeHtml(tool.websiteLabel)} ${ICONS.external}
                      </a>
                    </td>
                  </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </section>
        `;
      }).join('')}
    </div>
  </div>

  <script>
    const archiveFilters = document.querySelectorAll('.archive-filter');
    const archiveRows = document.querySelectorAll('.archive-row');

    archiveFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        archiveFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        archiveRows.forEach(row => {
          const badge = row.getAttribute('data-badge');
          if (filter === 'all' || badge.includes(filter.replace('-', ' '))) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  </script>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'archive.html'), renderLayout({
  title: 'Master Archive - 94+ Tools for Static Websites',
  description: 'Explore the complete directory of 94 curated tools across 25 static website categories.',
  currentNav: 'archive',
  breadcrumbs: [{ label: 'Home', url: 'index.html' }, { label: 'Archive', url: 'archive.html' }],
  content: archiveContent
}));

// ==========================================================================
// 3. Generate submit.html (Tool Submission Page)
// ==========================================================================
console.log('✉️ Generating Submit Page (submit.html)...');

const submitContent = `
  <div style="padding: 2.5rem 0 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2.5rem;">
    <h1 style="font-size:2.25rem; font-weight:800; margin-bottom:0.5rem;">Submit a Tool</h1>
    <p style="font-size:1.15rem; color:var(--text-muted); max-width:760px; line-height:1.6;">
      StaticStack is 100% community-curated and maintained on GitHub. Submissions are processed through <strong>GitHub Issues</strong> to ensure transparency, security, and spam prevention.
    </p>
  </div>

  <div style="display:grid; grid-template-columns: 3fr 2fr; gap:2.5rem; align-items:start;">
    <!-- Form Card -->
    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-card);">
      <h2 style="font-size:1.35rem; font-weight:700; margin-bottom:0.5rem;">Propose a Tool or Service</h2>
      <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">
        Fill out the details below. Clicking <strong>"Continue to GitHub"</strong> will securely pre-fill an issue template on our official repository.
      </p>

      <form id="submission-form" onsubmit="handleFormSubmit(event)">
        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="tool-name">Tool or Service Name *</label>
          <input type="text" id="tool-name" required placeholder="e.g. Bootstrap Studio, Pagefind, Reflow" style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main);">
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="website-url">Official HTTPS Website URL *</label>
          <input type="url" id="website-url" required placeholder="https://example.com/" style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main);">
          <span style="font-size:0.75rem; color:var(--text-subtle); display:block; margin-top:0.25rem;">Must be an official HTTPS link with zero affiliate or referral codes.</span>
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="tool-category">Suggested Category *</label>
          <select id="tool-category" required style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main);">
            <option value="" disabled selected>-- Select a Toolkit Category --</option>
            ${categories.map(c => `<option value="${escapeHtml(c.title)}">${escapeHtml(c.title)}</option>`).join('')}
          </select>
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="pricing-model">Pricing / License Model *</label>
          <select id="pricing-model" required style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main);">
            <option value="" disabled selected>-- Select Pricing Model --</option>
            <option value="Open Source">Open Source (Public source code)</option>
            <option value="Free">Completely Free (100% free with zero payment requirements)</option>
            <option value="Freemium">Freemium (Generous free tier with optional paid plans)</option>
            <option value="Paid">Commercial / Paid Only</option>
          </select>
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="tool-description">Short Description *</label>
          <textarea id="tool-description" required rows="3" placeholder="Brief 1-2 sentence description explaining what the tool does..." style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main); line-height:1.5;"></textarea>
        </div>

        <div style="margin-bottom:1.75rem;">
          <label style="display:block; font-size:0.875rem; font-weight:600; margin-bottom:0.4rem;" for="static-value">How does it help Static Websites? *</label>
          <textarea id="static-value" required rows="2" placeholder="Explain how developers integrate it with static HTML/JS without running backend servers..." style="width:100%; padding:0.65rem 0.85rem; border:1px solid var(--border-color); border-radius:var(--radius-md); font-family:inherit; font-size:0.95rem; background:var(--bg-body); color:var(--text-main); line-height:1.5;"></textarea>
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%;">
          Continue to GitHub Issue Template ${ICONS.arrowRight}
        </button>
      </form>
    </div>

    <!-- Right Column: Criteria -->
    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-card);">
      <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">Inclusion Guidelines</h3>
      <ul style="padding-left:1.25rem; font-size:0.9rem; line-height:1.7; color:var(--text-muted); display:flex; flex-direction:column; gap:0.5rem;">
        <li><strong>Relevant to Static Frontends</strong>: Must enhance HTML, CSS, and JS sites without requiring a traditional backend server.</li>
        <li><strong>Zero Affiliate Links</strong>: Direct official links only. Referrals or promotional campaign parameters are rejected.</li>
        <li><strong>Working &amp; Maintained</strong>: Tools must be actively developed and reliable. Discontinued or broken tools will not be accepted.</li>
        <li><strong>Quality Over Quantity</strong>: We aim to provide the best tools in each category rather than an unfiltered directory.</li>
      </ul>

      <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--border-color);">
        <h4 style="font-size:1rem; font-weight:700; margin-bottom:0.5rem;">Prefer opening a Pull Request?</h4>
        <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.6; margin-bottom:1rem;">
          You can edit <code>README.md</code> directly and submit a PR with your proposed addition.
        </p>
        <a href="contribute.html" class="btn btn-secondary btn-sm">Read Contributing Guide →</a>
      </div>
    </div>
  </div>

  <script>
    function handleFormSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('tool-name').value.trim();
      const url = document.getElementById('website-url').value.trim();
      const category = document.getElementById('tool-category').value;
      const pricing = document.getElementById('pricing-model').value;
      const desc = document.getElementById('tool-description').value.trim();
      const value = document.getElementById('static-value').value.trim();

      const issueTitle = encodeURIComponent(\`Add tool: \${name}\`);
      const body = encodeURIComponent(
        \`### Tool Name\\n\${name}\\n\\n\` +
        \`### Official Website URL\\n\${url}\\n\\n\` +
        \`### Category\\n\${category}\\n\\n\` +
        \`### Pricing / License\\n\${pricing}\\n\\n\` +
        \`### Description\\n\${desc}\\n\\n\` +
        \`### How It Integrates with Static Websites\\n\${value}\\n\\n\` +
        \`### Checklist\\n- [x] I confirmed this link is the official website with zero affiliate parameters.\\n- [x] The tool is actively maintained and supports static web frontends.\`
      );

      const targetUrl = \`https://github.com/E6WeB/htmlstatic/issues/new?title=\${issueTitle}&body=\${body}\`;
      window.open(targetUrl, '_blank');
    }
  </script>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'submit.html'), renderLayout({
  title: 'Submit a Tool - StaticStack',
  description: 'Propose a new static website tool, API, or service to include in the StaticStack directory.',
  currentNav: 'submit',
  breadcrumbs: [{ label: 'Home', url: 'index.html' }, { label: 'Submit a Tool', url: 'submit.html' }],
  content: submitContent
}));

// ==========================================================================
// 4. Generate contribute.html (Contributing Guide Page)
// ==========================================================================
console.log('🤝 Generating Contribute Page (contribute.html)...');

const contributingMd = fs.readFileSync(path.join(ROOT_DIR, 'CONTRIBUTING.md'), 'utf8');
const renderedContributing = marked.parse(contributingMd);

const contributeContent = `
  <div style="padding: 2.5rem 0 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2.5rem;">
    <h1 style="font-size:2.25rem; font-weight:800; margin-bottom:0.5rem;">Contributing Guide</h1>
    <p style="font-size:1.15rem; color:var(--text-muted); max-width:760px; line-height:1.6;">
      Thank you for helping keep the Static Website Toolkit accurate, comprehensive, and valuable! Learn how to propose tools, improve docs, or open pull requests.
    </p>
    <div style="display:flex; gap:0.75rem; margin-top:1.25rem; flex-wrap:wrap;">
      <a href="submit.html" class="btn btn-primary btn-sm">Use Web Submit Form →</a>
      <a href="https://github.com/E6WeB/htmlstatic/issues" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
        GitHub Issues ${ICONS.external}
      </a>
      <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
        ${ICONS.github} View Repository
      </a>
    </div>
  </div>

  <div class="markdown-body">
    ${renderedContributing}
  </div>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'contribute.html'), renderLayout({
  title: 'Contributing Guide - Static Website Toolkit',
  description: 'Learn how to contribute new tools, report updates, and submit pull requests to the Static Website Toolkit.',
  currentNav: '',
  breadcrumbs: [{ label: 'Home', url: 'index.html' }, { label: 'Contributing', url: 'contribute.html' }],
  content: contributeContent
}));

// ==========================================================================
// 5. Generate thankyou.html (Thank You & Credits Page)
// ==========================================================================
console.log('💖 Generating Thank You Page (thankyou.html)...');

const thankYouMd = fs.readFileSync(path.join(ROOT_DIR, 'THANKYOU.md'), 'utf8');
const renderedThankYou = marked.parse(thankYouMd);

const thankYouContent = `
  <div style="padding: 2.5rem 0 1.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2.5rem;">
    <h1 style="font-size:2.25rem; font-weight:800; margin-bottom:0.5rem;">Thank You &amp; Credits 💖</h1>
    <p style="font-size:1.15rem; color:var(--text-muted); max-width:760px; line-height:1.6;">
      Recognizing the community, contributors, and tool creators who make modern static websites exceptional.
    </p>
  </div>

  <div class="markdown-body">
    ${renderedThankYou}
  </div>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'thankyou.html'), renderLayout({
  title: 'Thank You & Credits - Static Website Toolkit',
  description: 'Special thanks to the contributors, maintainers, and community behind Static Website Toolkit.',
  currentNav: '',
  breadcrumbs: [{ label: 'Home', url: 'index.html' }, { label: 'Thank You', url: 'thankyou.html' }],
  content: thankYouContent
}));

// ==========================================================================
// 6. Synchronize Alias Files & Mirror to public/
// ==========================================================================
// Also write contributing.html and thank-you.html aliases in root
fs.copyFileSync(path.join(ROOT_DIR, 'contribute.html'), path.join(ROOT_DIR, 'contributing.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'thankyou.html'), path.join(ROOT_DIR, 'thank-you.html'));

// Directory-based routes in root (so /archive/, /submit/, etc. work if hosted on static servers)
ensureDir(path.join(ROOT_DIR, 'archive'));
ensureDir(path.join(ROOT_DIR, 'submit'));
ensureDir(path.join(ROOT_DIR, 'contribute'));
ensureDir(path.join(ROOT_DIR, 'contributing'));
ensureDir(path.join(ROOT_DIR, 'thankyou'));
ensureDir(path.join(ROOT_DIR, 'thank-you'));

fs.copyFileSync(path.join(ROOT_DIR, 'archive.html'), path.join(ROOT_DIR, 'archive', 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'submit.html'), path.join(ROOT_DIR, 'submit', 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'contribute.html'), path.join(ROOT_DIR, 'contribute', 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'contribute.html'), path.join(ROOT_DIR, 'contributing', 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'thankyou.html'), path.join(ROOT_DIR, 'thankyou', 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'thankyou.html'), path.join(ROOT_DIR, 'thank-you', 'index.html'));

// Mirror to public/
ensureDir(PUBLIC_DIR);
ensureDir(path.join(PUBLIC_DIR, 'archive'));
ensureDir(path.join(PUBLIC_DIR, 'submit'));
ensureDir(path.join(PUBLIC_DIR, 'contribute'));
ensureDir(path.join(PUBLIC_DIR, 'contributing'));
ensureDir(path.join(PUBLIC_DIR, 'thankyou'));
ensureDir(path.join(PUBLIC_DIR, 'thank-you'));

fs.copyFileSync(path.join(ROOT_DIR, 'index.html'), path.join(PUBLIC_DIR, 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'archive.html'), path.join(PUBLIC_DIR, 'archive.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'archive.html'), path.join(PUBLIC_DIR, 'archive', 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'submit.html'), path.join(PUBLIC_DIR, 'submit.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'submit.html'), path.join(PUBLIC_DIR, 'submit', 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'contribute.html'), path.join(PUBLIC_DIR, 'contribute.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'contribute.html'), path.join(PUBLIC_DIR, 'contribute', 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'contributing.html'), path.join(PUBLIC_DIR, 'contributing.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'contribute.html'), path.join(PUBLIC_DIR, 'contributing', 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'thankyou.html'), path.join(PUBLIC_DIR, 'thankyou.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'thankyou.html'), path.join(PUBLIC_DIR, 'thankyou', 'index.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'thank-you.html'), path.join(PUBLIC_DIR, 'thank-you.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'thankyou.html'), path.join(PUBLIC_DIR, 'thank-you', 'index.html'));

console.log('🎉 All 5 pages successfully generated with system typography, original nav menu, and default light theme!');
