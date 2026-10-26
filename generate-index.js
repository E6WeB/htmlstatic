/**
 * Generator for root index.html
 * Creates a standalone, zero-dependency, rich static HTML file
 * featuring all 25 categories and 94 tools with instant search,
 * filtering, dark/light theme, and quick-view modals.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const readmeContent = fs.readFileSync(path.join(ROOT_DIR, 'README.md'), 'utf8');

// SVG Icons
const ICONS = {
  logo: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  external: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
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

// Category SVG Icons
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

    // Read markdown file if it exists for overview
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

// Build HTML
const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Static Website Toolkit - Modern Tools &amp; APIs for Static Sites</title>
  <meta name="description" content="A community-curated collection of 94+ tools, services, and APIs for building, hosting, and improving static websites with HTML, CSS, and JavaScript—zero backend servers required.">
  <meta name="keywords" content="static website, jamstack, html, css, javascript, static tools, serverless, web development">
  <meta name="theme-color" content="#2563eb">
  <meta property="og:title" content="Static Website Toolkit - 94+ Tools for Modern Static Sites">
  <meta property="og:description" content="Discover 94 curated tools across 25 categories for building high-performance static websites with HTML, CSS, and JS.">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 2 7 12 12 22 7 12 2'/><polyline points='2 17 12 22 22 17'/><polyline points='2 12 12 17 22 12'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <style>
    /* ==========================================================================
       CSS Design System - Light & Dark Modes
       ========================================================================== */
    :root {
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;

      /* Light Theme Palette */
      --bg-body: #f8fafc;
      --bg-surface: #ffffff;
      --bg-surface-elevated: #ffffff;
      --bg-muted: #f1f5f9;
      --bg-glass: rgba(255, 255, 255, 0.85);
      --border-color: #e2e8f0;
      --border-hover: #cbd5e1;
      --border-focus: #3b82f6;
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
      --bg-glass: rgba(17, 24, 39, 0.85);
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
      gap: 1rem;
    }

    .nav-link {
      color: var(--text-muted);
      font-size: 0.925rem;
      font-weight: 500;
      padding: 0.4rem 0.65rem;
      border-radius: var(--radius-sm);
      transition: all 0.15s ease;
    }

    .nav-link:hover {
      color: var(--accent);
      background-color: var(--accent-light);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .theme-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .theme-btn:hover {
      background-color: var(--bg-muted);
      border-color: var(--border-focus);
      color: var(--accent);
    }

    /* Hero Section */
    .hero {
      padding: 4.5rem 0 3.5rem;
      text-align: center;
      position: relative;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.9rem;
      background: var(--accent-light);
      color: var(--accent);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .hero-title {
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 1.25rem;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }

    .gradient-text {
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: clamp(1.05rem, 2vw, 1.25rem);
      color: var(--text-muted);
      max-width: 740px;
      margin: 0 auto 2.25rem;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 3.5rem;
    }

    .stats-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      max-width: 960px;
      margin: 0 auto;
      padding: 1.75rem 2rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-card);
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Filter & Search Bar */
    .control-panel {
      position: sticky;
      top: 4.25rem;
      z-index: 90;
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 0;
      margin-bottom: 2.5rem;
      transition: all 0.25s ease;
    }

    .control-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-wrapper {
      position: relative;
      flex: 1 1 320px;
      max-width: 480px;
    }

    .search-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-subtle);
      pointer-events: none;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: 0.65rem 2.5rem 0.65rem 2.6rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      font-size: 0.925rem;
      color: var(--text-main);
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px var(--accent-light);
    }

    .search-clear {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-subtle);
      cursor: pointer;
      padding: 0.25rem;
      display: none;
      align-items: center;
    }

    .search-clear:hover {
      color: var(--text-main);
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.45rem 0.85rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      border-radius: var(--radius-full);
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .filter-btn:hover {
      background: var(--bg-muted);
      color: var(--text-main);
    }

    .filter-btn.active {
      background: var(--accent);
      color: #ffffff;
      border-color: var(--accent);
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
    }

    .category-select {
      padding: 0.5rem 1rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      font-weight: 500;
      font-family: inherit;
      outline: none;
      cursor: pointer;
    }

    .category-select:focus {
      border-color: var(--border-focus);
    }

    .results-count {
      font-size: 0.85rem;
      color: var(--text-subtle);
      font-weight: 500;
      width: 100%;
      margin-top: 0.25rem;
    }

    /* Section Headers */
    .section {
      padding: 3rem 0;
    }

    .section-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 2rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .section-title {
      font-size: 1.85rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 0.35rem;
    }

    .section-subtitle {
      color: var(--text-muted);
      font-size: 1rem;
      max-width: 650px;
    }

    /* Category Grid */
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 1.25rem;
    }

    .category-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: var(--text-main);
      box-shadow: var(--shadow-card);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-card-hover);
      border-color: var(--accent-hover);
    }

    .category-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .cat-icon-wrapper {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: var(--radius-md);
      background: var(--accent-light);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }

    .category-card:hover .cat-icon-wrapper {
      transform: scale(1.08);
    }

    .category-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      background: var(--bg-muted);
      color: var(--text-muted);
      border-radius: var(--radius-full);
      border: 1px solid var(--border-color);
    }

    .category-card-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text-main);
    }

    .category-card-desc {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.5;
      flex-grow: 1;
      margin-bottom: 1.25rem;
    }

    .category-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--accent);
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color);
    }

    /* Tools Grid */
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .tool-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-card);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    .tool-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-card-hover);
      border-color: var(--accent-hover);
    }

    .tool-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 0.65rem;
      gap: 0.75rem;
    }

    .tool-card-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

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

    .tool-category-tag {
      font-size: 0.75rem;
      color: var(--text-subtle);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.65rem;
    }

    .tool-card-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.55;
      margin-bottom: 1.5rem;
      flex-grow: 1;
    }

    .tool-card-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.65rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .modal-backdrop.active {
      display: flex;
      opacity: 1;
    }

    .modal-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 600px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      transform: scale(0.96);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-backdrop.active .modal-card {
      transform: scale(1);
    }

    .modal-close {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      background: var(--bg-muted);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .modal-close:hover {
      color: var(--text-main);
      border-color: var(--border-focus);
    }

    /* Why Static Section */
    .why-static-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 3rem 2rem;
      box-shadow: var(--shadow-card);
    }

    .why-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.75rem;
      margin-top: 2.5rem;
    }

    .why-feature-card {
      display: flex;
      flex-direction: column;
    }

    .why-icon {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: var(--radius-md);
      background: var(--accent-light);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .why-feature-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .why-feature-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.55;
    }

    /* Contribute Callout */
    .contribute-box {
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 3rem 2rem;
      text-align: center;
      margin: 3rem 0;
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

    /* Mobile Nav Drawer */
    .mobile-menu-btn {
      display: none;
      background: none;
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 0.4rem;
      border-radius: var(--radius-md);
      cursor: pointer;
    }

    @media (max-width: 860px) {
      .nav-links {
        display: none;
      }
      .mobile-menu-btn {
        display: flex;
      }
      .stats-bar {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
      .footer-inner {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  </style>
</head>
<body>

  <!-- Site Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="#" class="brand">
        <span class="brand-icon">${ICONS.logo}</span>
        <span>StaticStack</span>
        <span class="brand-badge">Toolkit</span>
      </a>

      <nav class="nav-links">
        <li><a href="#categories" class="nav-link">Categories</a></li>
        <li><a href="#catalog" class="nav-link">All 94 Tools</a></li>
        <li><a href="#why-static" class="nav-link">Why Static?</a></li>
        <li><a href="#contribute" class="nav-link">Submit a Tool</a></li>
        <li><a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="nav-link" style="display:flex;align-items:center;gap:0.35rem;">${ICONS.github} GitHub</a></li>
      </nav>

      <div class="header-actions">
        <button id="theme-toggle" class="theme-btn" aria-label="Toggle theme">
          <span id="theme-icon">${ICONS.sun}</span>
        </button>
      </div>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="hero container">
      <div class="hero-badge">
        ${ICONS.sparkles} 100% Jamstack • Zero Backend Servers Required
      </div>
      <h1 class="hero-title">
        Empower Static Websites with <span class="gradient-text">Zero Backend Servers</span>
      </h1>
      <p class="hero-subtitle">
        You don't need WordPress, a monolithic CMS, or expensive cloud servers. Discover 94+ curated tools, services, and APIs for building modern static sites with HTML, CSS, and JavaScript.
      </p>

      <div class="hero-actions">
        <a href="#catalog" class="btn btn-primary">
          Explore All 94 Tools ${ICONS.arrowRight}
        </a>
        <a href="#categories" class="btn btn-secondary">
          Browse 25 Categories
        </a>
        <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
          ${ICONS.github} GitHub Repository
        </a>
      </div>

      <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-value">25</div>
          <div class="stat-label">Curated Categories</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">94</div>
          <div class="stat-label">Hand-Picked Tools</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">0%</div>
          <div class="stat-label">Server Maintenance</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">100%</div>
          <div class="stat-label">Free &amp; Open Source</div>
        </div>
      </div>
    </section>

    <!-- Categories Grid Section -->
    <section id="categories" class="section container">
      <div class="section-header">
        <div>
          <h2 class="section-title">Explore by Category</h2>
          <p class="section-subtitle">Jump to any of the 25 static website categories or click to filter tools instantly.</p>
        </div>
      </div>

      <div class="category-grid">
        ${categories.map(cat => {
          const icon = CATEGORY_ICONS[cat.slug] || ICONS.zap;
          return `
          <div class="category-card" onclick="filterByCategory('${cat.slug}')" role="button" tabindex="0" aria-label="Filter by ${escapeHtml(cat.title)}">
            <div class="category-card-top">
              <div class="cat-icon-wrapper">${icon}</div>
              <span class="category-badge">${cat.tools.length} Tools</span>
            </div>
            <h3 class="category-card-title">${escapeHtml(cat.title)}</h3>
            <p class="category-card-desc">${escapeHtml(cat.description)}</p>
            <div class="category-card-footer">
              <span>View Tools</span>
              <span>${ICONS.arrowRight}</span>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- Interactive Search and Filter Bar -->
    <div id="catalog-controls" class="control-panel">
      <div class="container control-inner">
        <div class="search-wrapper">
          <span class="search-icon">${ICONS.search}</span>
          <input type="text" id="tool-search" class="search-input" placeholder="Search 94+ tools by name, category, or features... (Press / to focus)" autocomplete="off">
          <button id="search-clear-btn" class="search-clear" aria-label="Clear search">${ICONS.close}</button>
        </div>

        <div class="filter-group">
          <button class="filter-btn active" data-filter="all">All (94)</button>
          <button class="filter-btn" data-filter="open-source">Open Source</button>
          <button class="filter-btn" data-filter="free">Free</button>
          <button class="filter-btn" data-filter="freemium">Freemium</button>
          <button class="filter-btn" data-filter="paid">Paid</button>
        </div>

        <select id="category-filter-select" class="category-select" aria-label="Filter by category">
          <option value="all">All 25 Categories</option>
          ${categories.map(c => `<option value="${c.slug}">${escapeHtml(c.title)} (${c.tools.length})</option>`).join('')}
        </select>

        <div id="results-count" class="results-count">Showing 94 of 94 tools</div>
      </div>
    </div>

    <!-- Master Catalog Section -->
    <section id="catalog" class="section container">
      <div class="section-header">
        <div>
          <h2 class="section-title">Master Tools Directory</h2>
          <p class="section-subtitle">Click any tool to view its integration details or visit the official website.</p>
        </div>
      </div>

      <div id="tools-container" class="tools-grid">
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
               style="cursor: pointer;"
               data-name="${escapeHtml(t.name.toLowerCase())}"
               data-category="${escapeHtml(t.folder)}"
               data-badge="${escapeHtml(pBadge)}"
               data-desc="${escapeHtml(t.description.toLowerCase())}"
               data-slug="${escapeHtml(t.slug)}">
            <div class="tool-card-header">
              <h3 class="tool-card-title">${escapeHtml(t.name)}</h3>
              <span class="badge ${badgeClass}">${badgeIcon} ${escapeHtml(t.primaryBadge)}</span>
            </div>
            <div class="tool-category-tag">${escapeHtml(t.categoryTitle)}</div>
            <p class="tool-card-desc">${escapeHtml(t.description)}</p>
            <div class="tool-card-actions">
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

      <div id="no-results" style="display:none; text-align:center; padding: 4rem 1rem;">
        <h3 style="font-size:1.5rem; margin-bottom:0.5rem;">No tools found</h3>
        <p style="color:var(--text-muted); margin-bottom:1.5rem;">No tools match your current search or filter criteria.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    </section>

    <!-- Why Static Section -->
    <section id="why-static" class="section container">
      <div class="why-static-box">
        <div style="text-align: center; max-width: 650px; margin: 0 auto;">
          <h2 style="font-size: 2rem; margin-bottom: 0.75rem;">Why Static Architecture?</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem;">
            Modern static frontends combined with serverless APIs deliver unbeatable speed, ironclad security, and near-zero hosting costs.
          </p>
        </div>

        <div class="why-features">
          <div class="why-feature-card">
            <div class="why-icon">${ICONS.zap}</div>
            <h3 class="why-feature-title">Instant Global Speed</h3>
            <p class="why-feature-desc">Pre-rendered HTML files served directly from edge CDNs load in milliseconds with perfect Core Web Vitals and zero database wait time.</p>
          </div>
          <div class="why-feature-card">
            <div class="why-icon">${ICONS.shield}</div>
            <h3 class="why-feature-title">Ironclad Security</h3>
            <p class="why-feature-desc">No live PHP interpreters, SQL injection targets, or vulnerable CMS plugins. Your public surface is immutable, read-only static code.</p>
          </div>
          <div class="why-feature-card">
            <div class="why-icon">${ICONS.check}</div>
            <h3 class="why-feature-title">Near-Zero Hosting Cost</h3>
            <p class="why-feature-desc">Host landing pages, blogs, and complex apps for free or pennies on platforms like GitHub Pages, Cloudflare Pages, Netlify, or Vercel.</p>
          </div>
          <div class="why-feature-card">
            <div class="why-icon">${ICONS.sparkles}</div>
            <h3 class="why-feature-title">Plug-and-Play Dynamics</h3>
            <p class="why-feature-desc">Add shopping carts (Reflow), user authentication (Clerk), search (Pagefind), and contact forms with lightweight client-side scripts.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contribute Callout -->
    <section id="contribute" class="container">
      <div class="contribute-box">
        <h2 style="font-size: 2rem; margin-bottom: 0.75rem;">Know a Great Static Tool?</h2>
        <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 600px; margin: 0 auto 1.75rem;">
          This directory is 100% open-source and community-driven. Submit a new tool or suggest improvements directly through GitHub Issues.
        </p>
        <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <a href="https://github.com/E6WeB/htmlstatic/issues/new/choose" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            Submit a Tool via GitHub ${ICONS.external}
          </a>
          <a href="CONTRIBUTING.md" class="btn btn-secondary">
            ${ICONS.book} Read Contributing Guide
          </a>
        </div>
      </div>
    </section>
  </main>

  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <div>
          <a href="#" class="brand" style="margin-bottom: 0.75rem;">
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
            <li><a href="#categories">Browse Categories</a></li>
            <li><a href="#catalog">Master Directory</a></li>
            <li><a href="#why-static">Why Static Architecture</a></li>
            <li><a href="#contribute">Submit a Tool</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Community &amp; Legal</h4>
          <ul class="footer-links">
            <li><a href="CONTRIBUTING.md">How to Contribute</a></li>
            <li><a href="THANKYOU.md">Acknowledgements</a></li>
            <li><a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
            <li><a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 1.0 Public Domain</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; <span id="year">2026</span> Static Website Toolkit. Built with Vanilla HTML, CSS &amp; JavaScript. Zero backend servers required.</p>
      </div>
    </div>
  </footer>

  <!-- Quick View Modal -->
  <div id="tool-modal-backdrop" class="modal-backdrop" onclick="handleBackdropClick(event)">
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close" onclick="closeToolModal()" aria-label="Close dialog">${ICONS.close}</button>
      <div id="modal-content">
        <!-- Injected via JavaScript -->
      </div>
    </div>
  </div>

  <!-- Embedded Client Logic & Data -->
  <script>
    const TOOLS_DATA = ${JSON.stringify(allTools)};

    // Dark / Light Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const sunSvg = \`${ICONS.sun}\`;
    const moonSvg = \`${ICONS.moon}\`;

    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('swt-theme', theme);
      if (themeIcon) {
        themeIcon.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
      }
    }

    const savedTheme = localStorage.getItem('swt-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        setTheme(cur === 'dark' ? 'light' : 'dark');
      });
    }

    // Dynamic Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Search and Filtering
    const searchInput = document.getElementById('tool-search');
    const clearBtn = document.getElementById('search-clear-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categorySelect = document.getElementById('category-filter-select');
    const toolCards = document.querySelectorAll('.tool-card');
    const resultsCountEl = document.getElementById('results-count');
    const noResultsEl = document.getElementById('no-results');

    let currentFilter = 'all';
    let currentCategory = 'all';
    let searchQuery = '';

    function applyFilters() {
      let visibleCount = 0;
      const q = searchQuery.trim().toLowerCase();

      toolCards.forEach(card => {
        const name = card.getAttribute('data-name');
        const cat = card.getAttribute('data-category');
        const badge = card.getAttribute('data-badge');
        const desc = card.getAttribute('data-desc');

        // Check search match
        const matchesSearch = !q || name.includes(q) || desc.includes(q) || cat.includes(q);

        // Check badge filter
        let matchesBadge = true;
        if (currentFilter !== 'all') {
          matchesBadge = badge.includes(currentFilter.replace('-', ' '));
        }

        // Check category filter
        let matchesCat = true;
        if (currentCategory !== 'all') {
          matchesCat = cat === currentCategory;
        }

        if (matchesSearch && matchesBadge && matchesCat) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (resultsCountEl) {
        resultsCountEl.textContent = \`Showing \${visibleCount} of \${toolCards.length} tools\`;
      }
      if (noResultsEl) {
        noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearBtn) clearBtn.style.display = searchQuery ? 'flex' : 'none';
        applyFilters();
      });

      // Shortcut '/' or 'Ctrl+K'
      document.addEventListener('keydown', (e) => {
        if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInput) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        applyFilters();
        searchInput.focus();
      });
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
      categorySelect.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        applyFilters();
      });
    }

    function filterByCategory(slug) {
      currentCategory = slug;
      if (categorySelect) categorySelect.value = slug;
      applyFilters();
      const catalogEl = document.getElementById('catalog-controls');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function resetFilters() {
      searchQuery = '';
      currentFilter = 'all';
      currentCategory = 'all';
      if (searchInput) {
        searchInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
      }
      if (categorySelect) categorySelect.value = 'all';
      filterBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
      });
      applyFilters();
    }

    // Modal Functions
    const modalBackdrop = document.getElementById('tool-modal-backdrop');
    const modalContent = document.getElementById('modal-content');

    function openToolModal(slug) {
      const tool = TOOLS_DATA.find(t => t.slug === slug);
      if (!tool || !modalContent) return;

      modalContent.innerHTML = \`
        <div style="font-size:0.8rem; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.4rem;">
          \${tool.categoryTitle}
        </div>
        <h2 id="modal-title" style="font-size:1.75rem; margin-bottom:0.75rem;">\${tool.name}</h2>
        <div style="margin-bottom:1.25rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
          \${tool.badges.map(b => \`<span class="badge badge-freemium">\${b}</span>\`).join('')}
        </div>
        <p style="font-size:1.05rem; line-height:1.6; margin-bottom:1.25rem; color:var(--text-main);">
          \${tool.tagline || tool.description}
        </p>
        \${tool.overview ? \`
          <div style="background:var(--bg-muted); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1rem 1.25rem; margin-bottom:1.5rem; font-size:0.9rem; line-height:1.6; color:var(--text-muted);">
            <div style="font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">Overview &amp; Integration:</div>
            \${tool.overview}
          </div>
        \` : ''}
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-top:1.5rem;">
          <a href="\${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            Visit Official Website ${ICONS.external}
          </a>
          <a href="\${tool.relPath}" class="btn btn-secondary">
            ${ICONS.book} View GitHub Markdown Guide
          </a>
        </div>
      \`;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeToolModal() {
      if (!modalBackdrop) return;
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    function handleBackdropClick(e) {
      if (e.target === modalBackdrop) {
        closeToolModal();
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeToolModal();
      }
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), html);
console.log('Successfully generated root index.html!');
