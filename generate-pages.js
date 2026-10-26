/**
 * Unified HTML Site Generator
 * Generates standalone, zero-dependency HTML pages using pure native system typography:
 * - index.html (Home)
 * - archive.html (Master Archive with wider 320px sidebar)
 * - submit.html (Submit a Tool)
 * - contribute.html (Contributing Guide)
 * - thankyou.html (Thank You & Credits)
 * - tools/<category>/<tool>.html (Dedicated page for all 94 tools!)
 *
 * All pages feature:
 * - Pure system-style font stack (no Google Fonts)
 * - Light theme default with segmented [ ☀️ Light | 🌙 Dark ] switcher
 * - Proper original navigation menu (Home | Archive | Submit | GitHub)
 * - Floating Back to Top button
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
  arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
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
  info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  home: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  chevronRight: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  archive: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>`,
  plusCircle: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
  gitPullRequest: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>`,
  heart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  globe: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
};

// Category Icons
const CATEGORY_ICONS = {
  'ai-content-creation': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  'ai-models': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`,
  'analytics-privacy': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  'authentication-users': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  'booking-scheduling': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  'comments-community': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  'contact-forms': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  'content-management': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  'css-components': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  'database-storage': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
  'development-tools': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  'hosting-deployment': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
  'images-optimization': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  'interactive-scripts': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  'live-chat': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
  'maps-geolocation': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`,
  'media-players': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`,
  'monitoring-errors': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  'newsletters-email': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
  'payments-ecommerce': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
  'search': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  'security-spam-protection': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  'static-site-generators': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  'surveys-feedback': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`,
  'typography-fonts': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`
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
    let rawMd = '';
    if (fs.existsSync(path.join(ROOT_DIR, rawPath))) {
      rawMd = fs.readFileSync(path.join(ROOT_DIR, rawPath), 'utf8');
      const quoteMatch = rawMd.match(/>\s*([^\n\r]+)/);
      if (quoteMatch) tagline = quoteMatch[1].trim();
      const overviewMatch = rawMd.match(/##\s+Overview\s*\n+([\s\S]*?)(?=\n+---|\n+##|$)/);
      if (overviewMatch) overview = overviewMatch[1].trim().replace(/\n+/g, ' ');
    }

    const badges = parseBadges(badgeHtml);
    const primaryBadge = badges[0] || 'Free';

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
    --container-max: 1440px;
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
    padding: 0.35rem 0.75rem;
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

  /* Mini Hero Section */
  .mini-hero {
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border-color);
    padding: 2.25rem 0 2rem;
    margin-bottom: 2.5rem;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  }

  .mini-hero-inner {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  /* Breadcrumbs inside Mini Hero */
  .mini-hero-breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.85rem;
    color: var(--text-subtle);
    flex-wrap: wrap;
    margin-bottom: 0.25rem;
  }

  .mini-hero-breadcrumbs a {
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.15s ease;
  }

  .mini-hero-breadcrumbs a:hover {
    color: var(--accent);
  }

  .mini-hero-breadcrumbs .crumb-sep {
    display: inline-flex;
    align-items: center;
    color: var(--text-subtle);
    opacity: 0.6;
  }

  .mini-hero-breadcrumbs .crumb-current {
    color: var(--text-main);
    font-weight: 600;
  }

  .mini-hero-badge-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.15rem;
  }

  .mini-hero-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .mini-hero-header-main {
    flex: 1 1 500px;
  }

  .mini-hero-title-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .mini-hero-icon-box {
    width: 2.75rem;
    height: 2.75rem;
    background: var(--accent-light);
    color: var(--accent);
    border: 1px solid rgba(37, 99, 235, 0.18);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(37, 99, 235, 0.08);
  }

  .mini-hero-title {
    font-size: clamp(1.85rem, 3.5vw, 2.35rem);
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.025em;
    line-height: 1.2;
    margin: 0;
  }

  .mini-hero-subtext {
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 820px;
    margin: 0;
  }

  .mini-hero-actions {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    flex-wrap: wrap;
    align-self: flex-start;
  }

  .mini-hero-extra {
    margin-top: 0.25rem;
  }

  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-subtle);
    padding: 1.5rem 0 0.5rem;
    flex-wrap: wrap;
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
  .markdown-body h2 { font-size: 1.45rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem; }
  .markdown-body h3 { font-size: 1.2rem; }
  .markdown-body p { margin-bottom: 1.2rem; color: var(--text-main); line-height: 1.7; }
  .markdown-body ul, .markdown-body ol { margin-bottom: 1.25rem; padding-left: 1.75rem; }
  .markdown-body li { margin-bottom: 0.4rem; color: var(--text-main); line-height: 1.6; }
  .markdown-body hr { border: none; border-top: 1px solid var(--border-color); margin: 2rem 0; }
  .markdown-body pre {
    background: var(--bg-muted);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1rem 1.25rem;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  .markdown-body code {
    font-family: var(--font-mono);
    font-size: 0.875em;
    background: var(--bg-muted);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    border: 1px solid var(--border-color);
  }
  .markdown-body pre code {
    background: transparent;
    padding: 0;
    border: none;
  }
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

  /* Archive Layout Styles (sidebar scrolls with page) */
  .archive-layout {
    display: grid;
    grid-template-columns: 440px 1fr;
    gap: 2.5rem;
    align-items: start;
  }

  .archive-sidebar {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1rem;
    box-shadow: var(--shadow-card);
  }

  .archive-cat-link {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-muted);
    padding: 0.45rem 0.55rem;
    border-radius: var(--radius-sm);
    transition: all 0.15s ease;
    text-decoration: none;
  }

  .archive-cat-link:hover {
    color: var(--accent);
    background: var(--accent-light);
    transform: translateX(2px);
  }

  .archive-cat-icon {
    display: flex;
    align-items: center;
    color: var(--accent);
    width: 1.25rem;
    flex-shrink: 0;
  }

  .archive-cat-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .archive-cat-count {
    font-size: 0.725rem;
    font-weight: 700;
    color: var(--text-subtle);
    background: var(--bg-muted);
    padding: 0.1rem 0.45rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    flex-shrink: 0;
  }

  @media (max-width: 1040px) {
    .archive-layout {
      grid-template-columns: 1fr;
    }
  }

  /* Tool Page 2-Column Layout (Content + Right Sidebar) */
  .tool-page-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 2.25rem;
    align-items: start;
    padding: 0 0 3.5rem;
  }

  .tool-page-main {
    min-width: 0;
  }

  .tool-page-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: sticky;
    top: 5.5rem;
  }

  .sidebar-widget {
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.35rem 1.25rem;
    box-shadow: var(--shadow-card);
  }

  .sidebar-widget-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }

  .sidebar-widget-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-main);
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0;
  }

  .sidebar-tip-item {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    margin-bottom: 0.85rem;
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-muted);
  }

  .sidebar-tip-item:last-child {
    margin-bottom: 0;
  }

  .sidebar-tip-icon {
    color: var(--accent);
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-top: 0.15rem;
  }

  .sidebar-tool-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.6rem;
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    text-decoration: none;
    transition: all 0.18s ease;
  }

  .sidebar-tool-card:hover {
    background: var(--bg-muted);
    border-color: var(--border-hover);
    transform: translateX(2px);
  }

  .sidebar-tool-icon {
    width: 2.1rem;
    height: 2.1rem;
    background: var(--accent-light);
    color: var(--accent);
    border: 1px solid rgba(37, 99, 235, 0.15);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sidebar-tool-info {
    flex: 1;
    min-width: 0;
  }

  .sidebar-tool-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-main);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.35rem;
  }

  .sidebar-tool-desc {
    font-size: 0.775rem;
    color: var(--text-subtle);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 0.1rem;
  }

  @media (max-width: 1040px) {
    .tool-page-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .tool-page-sidebar {
      position: static;
    }
  }

  @media (max-width: 900px) {
    .submit-layout {
      grid-template-columns: 1fr !important;
      margin-bottom: 3.5rem !important;
    }
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

  @media (max-width: 640px) {
    .mini-hero {
      padding: 1.75rem 0 1.5rem;
      margin-bottom: 1.75rem;
    }
    .mini-hero-title-row {
      gap: 0.65rem;
    }
    .mini-hero-icon-box {
      width: 2.25rem;
      height: 2.25rem;
    }
    .mini-hero-title {
      font-size: 1.5rem;
    }
    .mini-hero-subtext {
      font-size: 0.95rem;
    }
  }
`;

function renderBreadcrumbs(crumbs, rootPath = '') {
  if (!crumbs || crumbs.length === 0) return '';
  return `
    <nav class="mini-hero-breadcrumbs" aria-label="Breadcrumbs">
      ${crumbs.map((crumb, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === crumbs.length - 1;
        const homeIconHtml = isFirst ? `<span style="display:inline-flex;align-items:center;">${ICONS.home}</span> ` : '';
        if (isLast) {
          return `<span class="crumb-current" aria-current="page">${escapeHtml(crumb.label)}</span>`;
        }
        return `
          <a href="${crumb.url}">${homeIconHtml}<span>${escapeHtml(crumb.label)}</span></a>
          <span class="crumb-sep" aria-hidden="true">${ICONS.chevronRight}</span>
        `;
      }).join('')}
    </nav>
  `;
}

function renderMiniHero(miniHero, rootPath = '') {
  if (!miniHero) return '';

  const breadcrumbsHtml = renderBreadcrumbs(miniHero.breadcrumbs, rootPath);
  const iconHtml = miniHero.icon ? `<div class="mini-hero-icon-box" aria-hidden="true">${miniHero.icon}</div>` : '';
  const badgeRowHtml = miniHero.badgeRow ? `<div class="mini-hero-badge-row">${miniHero.badgeRow}</div>` : '';
  const actionsHtml = miniHero.actions ? `<div class="mini-hero-actions">${miniHero.actions}</div>` : '';
  const extraHtml = miniHero.extraHtml ? `<div class="mini-hero-extra">${miniHero.extraHtml}</div>` : '';

  return `
  <!-- Mini Hero Section -->
  <section class="mini-hero">
    <div class="container mini-hero-inner">
      ${breadcrumbsHtml}
      ${badgeRowHtml}
      <div class="mini-hero-header">
        <div class="mini-hero-header-main">
          <div class="mini-hero-title-row">
            ${iconHtml}
            <h1 class="mini-hero-title">${miniHero.title}</h1>
          </div>
          ${miniHero.subtext ? `<p class="mini-hero-subtext">${miniHero.subtext}</p>` : ''}
        </div>
        ${actionsHtml}
      </div>
      ${extraHtml}
    </div>
  </section>
  `;
}

// Shared Layout Wrapper supporting depth rootPath
function renderLayout({
  title,
  description,
  currentNav = '',
  content,
  miniHero = null,
  breadcrumbs = [],
  rootPath = ''
}) {
  const cleanDescription = description || 'StaticStack - A community-curated collection of tools, services, and resources for static websites with zero backend servers.';
  const pageTitle = title.includes('StaticStack') ? title : `${title} | StaticStack`;

  const miniHeroHtml = miniHero ? renderMiniHero(miniHero, rootPath) : '';
  const breadcrumbFallbackHtml = (!miniHero && breadcrumbs.length > 0) ? `
    <nav class="breadcrumbs" aria-label="Breadcrumbs">
      ${breadcrumbs.map((b, i) => i === breadcrumbs.length - 1 ? `<span>${escapeHtml(b.label)}</span>` : `<a href="${b.url}">${escapeHtml(b.label)}</a><span>/</span>`).join('')}
    </nav>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(cleanDescription)}">
  <meta name="theme-color" content="#2563eb">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 2 7 12 12 22 7 12 2'/><polyline points='2 17 12 22 22 17'/><polyline points='2 12 12 17 22 12'/></svg>">

  <!-- OpenGraph & Social Cards -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="StaticStack">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(cleanDescription)}">
  <meta property="og:image" content="https://staticstack.app/src/img/og-image.webp">
  <meta property="og:image:type" content="image/webp">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="675">
  <meta property="og:image:alt" content="StaticStack - The Curated Static Website Toolkit">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(cleanDescription)}">
  <meta name="twitter:image" content="https://staticstack.app/src/img/og-image.webp">

  <style>
    ${BASE_CSS}
  </style>
</head>
<body>

  <!-- Site Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="${rootPath}index.html" class="brand">
        <span class="brand-icon">${ICONS.logo}</span>
        <span>StaticStack</span>
        <span class="brand-badge">Toolkit</span>
      </a>

      <!-- Original Clean Nav Menu -->
      <nav class="nav-drawer">
        <ul id="nav-links" class="nav-links">
          <li><a href="${rootPath}index.html" class="nav-link ${currentNav === 'home' ? 'active' : ''}">Home</a></li>
          <li><a href="${rootPath}archive.html" class="nav-link ${currentNav === 'archive' ? 'active' : ''}">Archive</a></li>
          <li><a href="${rootPath}submit.html" class="nav-link ${currentNav === 'submit' ? 'active' : ''}">Submit</a></li>
          <li><a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="nav-link" style="display:flex;align-items:center;gap:0.35rem;">${ICONS.github} GitHub</a></li>
        </ul>
      </nav>
    </div>
  </header>

  ${miniHeroHtml}

  <main class="site-main container">
    ${breadcrumbFallbackHtml}
    ${content}
  </main>

  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-inner">
        <div>
          <a href="${rootPath}index.html" class="brand" style="margin-bottom: 0.75rem;">
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
            <li><a href="${rootPath}index.html">Home</a></li>
            <li><a href="${rootPath}archive.html">Master Archive</a></li>
            <li><a href="${rootPath}submit.html">Submit a Tool</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Community &amp; Project</h4>
          <ul class="footer-links">
            <li><a href="${rootPath}contribute.html">Contributing Guide</a></li>
            <li><a href="${rootPath}thankyou.html">Thank You &amp; Credits</a></li>
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
      <div style="display:flex; align-items:center; background:var(--bg-surface); border:2px solid var(--border-color); border-radius:var(--radius-full); padding:0.35rem 0.5rem 0.35rem 1.15rem; box-shadow:0 10px 25px -5px rgba(0,0,0,0.08); gap:0.5rem;">
        <span style="color:var(--accent); display:flex; align-items:center;">${ICONS.search}</span>
        <input type="text" id="hero-search-input" style="flex:1; border:none; background:transparent; outline:none; font-size:1.05rem; font-family:inherit; color:var(--text-main); padding:0.45rem 0.25rem;" placeholder="Search 94+ static tools, APIs, forms, auth..." autocomplete="off">
        <span style="background:var(--bg-muted); border:1px solid var(--border-color); padding:0.15rem 0.5rem; border-radius:4px; font-size:0.75rem; font-family:var(--font-mono); color:var(--text-subtle);">/</span>
        <button type="button" onclick="submitHeroSearch()" class="btn btn-primary btn-sm" style="border-radius:var(--radius-full); padding:0.45rem 1rem; font-size:0.85rem;">
          Search
        </button>
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

    <div id="category-cards-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(270px, 1fr)); gap:1.25rem;">
      ${categories.map(cat => {
        const icon = CATEGORY_ICONS[cat.slug] || ICONS.zap;
        const searchTerms = (cat.title + ' ' + cat.description + ' ' + cat.tools.map(t => t.name).join(' ')).toLowerCase();
        return `
        <a href="archive.html#${cat.slug}" class="category-card" data-search="${escapeHtml(searchTerms)}" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; display:flex; flex-direction:column; color:var(--text-main); box-shadow:var(--shadow-card); transition:all 0.2s ease;">
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

      <div id="home-no-categories" style="display:none; grid-column:1/-1; text-align:center; padding:3rem 1.5rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg);">
        <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:0.5rem;">No matching categories on home page</h3>
        <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.25rem;">Try searching the Master Archive directly for all 94 tools, APIs, and services.</p>
        <button type="button" onclick="submitHeroSearch()" class="btn btn-primary">Search in Master Archive</button>
      </div>
    </div>
  </section>

  <script>
    const heroSearchInput = document.getElementById('hero-search-input');

    function searchHomeCategories(query) {
      const q = query.trim().toLowerCase();
      const qWords = q.split(/\\s+/).filter(Boolean);
      const categoryCards = document.querySelectorAll('.category-card');
      let visibleCount = 0;
      categoryCards.forEach(card => {
        const text = card.getAttribute('data-search') || card.textContent.toLowerCase();
        const matches = qWords.length === 0 || qWords.every(w => text.includes(w));
        if (matches) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      const noResults = document.getElementById('home-no-categories');
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    function submitHeroSearch() {
      const val = heroSearchInput ? heroSearchInput.value.trim() : '';
      if (val) {
        window.location.href = 'archive.html?q=' + encodeURIComponent(val);
      } else {
        window.location.href = 'archive.html';
      }
    }

    if (heroSearchInput) {
      heroSearchInput.addEventListener('input', e => {
        searchHomeCategories(e.target.value);
      });
      heroSearchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          submitHeroSearch();
        }
      });
    }

    function quickSearchTag(tag) {
      window.location.href = 'archive.html?q=' + encodeURIComponent(tag);
    }

    document.addEventListener('keydown', e => {
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== heroSearchInput) {
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
// 2. Generate archive.html (Master Archive Page with Wider 320px Sidebar)
// ==========================================================================
console.log('📚 Generating Archive Page with wider sidebar (archive.html)...');

const archiveContent = `
  <!-- Archive Layout -->
  <div class="archive-layout" style="padding-bottom: 4rem;">
    <!-- Sidebar Category Links (scrolls with page) -->
    <aside class="archive-sidebar">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem; padding:0 0.5rem;">
        <span style="font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-subtle);">Categories (25)</span>
        <a href="javascript:void(0)" onclick="resetArchiveFilters()" style="font-size:0.75rem; color:var(--accent); font-weight:600; text-decoration:none;">Show All</a>
      </div>
      <ul id="archive-sidebar-list" style="list-style:none; display:flex; flex-direction:column; gap:0.25rem;">
        ${categories.map(c => `
          <li>
            <a href="#${c.slug}" class="archive-cat-link" title="${escapeHtml(c.title)}">
              <span class="archive-cat-icon">${CATEGORY_ICONS[c.slug] || ICONS.zap}</span>
              <span class="archive-cat-name">${escapeHtml(c.title)}</span>
              <span class="archive-cat-count">${c.tools.length}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </aside>

    <!-- Category Sections & Tool Tables -->
    <div>
      <div id="archive-no-results" style="display:none; text-align:center; padding:3.5rem 2rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); margin-bottom:3rem; box-shadow:var(--shadow-card);">
        <div style="font-size:1.35rem; font-weight:700; margin-bottom:0.5rem;">No tools found</div>
        <p style="color:var(--text-muted); font-size:1rem; margin-bottom:1.5rem;">No tools match your current filter or search criteria.</p>
        <button class="btn btn-primary" onclick="resetArchiveFilters()">Reset Filters &amp; Show All 94 Tools</button>
      </div>

      ${categories.map(cat => {
        const icon = CATEGORY_ICONS[cat.slug] || ICONS.zap;
        return `
        <section id="${cat.slug}" class="archive-cat-section" style="margin-bottom:3.5rem; scroll-margin-top:6rem;">
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
                  <th style="padding:0.75rem 1rem; width:22%;">Tool</th>
                  <th style="padding:0.75rem 1rem; width:45%;">Description</th>
                  <th style="padding:0.75rem 1rem; width:18%;">Pricing</th>
                  <th style="padding:0.75rem 1rem; width:15%;">Link</th>
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
                  <tr class="archive-row" data-badge="${escapeHtml(pBadge)}" data-search="${escapeHtml((tool.name + ' ' + tool.description + ' ' + cat.title + ' ' + tool.slug + ' ' + (tool.websiteLabel || '') + ' ' + tool.badges.join(' ')).toLowerCase())}" style="border-bottom:1px solid var(--border-color);">
                    <td style="padding:0.85rem 1rem; font-weight:700;">
                      <a href="tools/${tool.categorySlug}/${tool.slug}.html" title="View documentation and guide for ${escapeHtml(tool.name)}">${escapeHtml(tool.name)}</a>
                    </td>
                    <td style="padding:0.85rem 1rem; color:var(--text-muted); line-height:1.5;">${escapeHtml(tool.description)}</td>
                    <td style="padding:0.85rem 1rem;">
                      <span class="badge ${badgeClass}">${escapeHtml(tool.primaryBadge)}</span>
                    </td>
                    <td style="padding:0.85rem 1rem;">
                      <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="display:inline-flex; align-items:center; gap:0.35rem;" title="Visit ${escapeHtml(tool.name)} official website">
                        Link ${ICONS.external}
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
    const archiveSections = document.querySelectorAll('.archive-cat-section');
    const archiveSearchInput = document.getElementById('archive-search-input');
    const archiveClearBtn = document.getElementById('archive-search-clear');
    const archiveCountEl = document.getElementById('archive-results-count');
    const archiveNoResultsEl = document.getElementById('archive-no-results');

    let currentFilter = 'all';
    let currentSearch = '';

    function applyArchiveFilter() {
      let count = 0;
      const q = currentSearch.trim().toLowerCase();
      const qWords = q.split(/\\s+/).filter(Boolean);

      if (archiveClearBtn) {
        archiveClearBtn.style.display = q ? 'inline-flex' : 'none';
      }

      archiveSections.forEach(section => {
        let secMatches = 0;
        const rows = section.querySelectorAll('.archive-row');
        rows.forEach(row => {
          const badge = row.getAttribute('data-badge') || '';
          const searchTxt = row.getAttribute('data-search') || '';

          const matchFilter = currentFilter === 'all' || badge.includes(currentFilter.replace('-', ' '));
          const matchSearch = qWords.length === 0 || qWords.every(w => searchTxt.includes(w));

          if (matchFilter && matchSearch) {
            row.style.display = '';
            secMatches++;
            count++;
          } else {
            row.style.display = 'none';
          }
        });

        // Hide category section if 0 matches
        section.style.display = secMatches > 0 ? '' : 'none';

        // Update sidebar item opacity without hiding it completely
        const secId = section.getAttribute('id');
        const sideLink = document.querySelector('.archive-cat-link[href="#' + secId + '"]');
        if (sideLink) {
          sideLink.style.opacity = secMatches > 0 ? '1' : '0.45';
        }
      });

      if (archiveNoResultsEl) {
        archiveNoResultsEl.style.display = count === 0 ? 'block' : 'none';
      }

      if (archiveCountEl) {
        if (q) {
          archiveCountEl.innerHTML = 'Showing ' + count + ' of 94 tools matching &ldquo;<strong>' + q.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</strong>&rdquo; &bull; <a href="javascript:void(0)" onclick="clearArchiveSearch()" style="color:var(--accent); font-weight:600; text-decoration:underline;">Show all 94 tools</a>';
        } else if (currentFilter !== 'all') {
          archiveCountEl.innerHTML = 'Showing ' + count + ' ' + currentFilter + ' tools &bull; <a href="javascript:void(0)" onclick="resetArchiveFilters()" style="color:var(--accent); font-weight:600; text-decoration:underline;">Show all 94 tools</a>';
        } else {
          archiveCountEl.textContent = 'Showing all 94 tools across 25 categories';
        }
      }
    }

    function clearArchiveSearch() {
      if (archiveSearchInput) archiveSearchInput.value = '';
      currentSearch = '';
      try {
        if (window.history && window.history.replaceState && window.location.protocol !== 'file:') {
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({path: cleanUrl}, '', cleanUrl);
        }
      } catch (err) {
        // Safe failover for file protocol or restricted contexts
      }
      applyArchiveFilter();
    }

    function resetArchiveFilters() {
      currentFilter = 'all';
      archiveFilters.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
      clearArchiveSearch();
    }

    archiveFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        archiveFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        applyArchiveFilter();
      });
    });

    if (archiveSearchInput) {
      archiveSearchInput.addEventListener('input', e => {
        currentSearch = e.target.value;
        applyArchiveFilter();
      });

      // Handle ?q= query param
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('q');
      if (queryParam) {
        archiveSearchInput.value = queryParam;
        currentSearch = queryParam;
        applyArchiveFilter();

        // Scroll to the first matching category section smoothly
        setTimeout(() => {
          const firstVisible = document.querySelector('.archive-cat-section:not([style*="display: none"])');
          if (firstVisible) {
            firstVisible.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }

    // Sidebar Category Click: clear search or filter so that all tools in the category are pulled up immediately!
    document.querySelectorAll('.archive-cat-link').forEach(link => {
      link.addEventListener('click', () => {
        if (currentSearch || currentFilter !== 'all') {
          currentFilter = 'all';
          archiveFilters.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
          clearArchiveSearch();
        }
      });
    });

    document.addEventListener('keydown', e => {
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== archiveSearchInput) {
        e.preventDefault();
        if (archiveSearchInput) archiveSearchInput.focus();
      }
    });
  </script>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'archive.html'), renderLayout({
  title: 'Master Archive - 94+ Tools for Static Websites',
  description: 'Explore the complete directory of 94 curated tools across 25 static website categories with our expanded navigation sidebar.',
  currentNav: 'archive',
  miniHero: {
    breadcrumbs: [
      { label: 'Home', url: 'index.html' },
      { label: 'Archive', url: 'archive.html' }
    ],
    icon: ICONS.archive,
    title: 'Master Directory',
    subtext: 'Complete catalog of all 94 tools across 25 categories for static websites. Filter by pricing or jump directly to any category section.',
    extraHtml: `
      <!-- Archive Search & Filter Controls -->
      <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-top:1.25rem;">
        <div style="flex:1 1 300px; position:relative; max-width:480px;">
          <input type="text" id="archive-search-input" style="width:100%; padding:0.6rem 2.2rem 0.6rem 2.5rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-full); font-size:0.925rem; color:var(--text-main); font-family:inherit; outline:none;" placeholder="Filter all 94 tools by name, description, keyword...">
          <span style="position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:var(--text-subtle); display:flex;">${ICONS.search}</span>
          <button id="archive-search-clear" onclick="clearArchiveSearch()" style="position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-subtle); display:none; align-items:center; justify-content:center; padding:2px;" title="Clear search" aria-label="Clear search">
            ${ICONS.close}
          </button>
        </div>

        <!-- Filter Buttons -->
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn btn-sm btn-secondary archive-filter active" data-filter="all">All Tools (94)</button>
          <button class="btn btn-sm btn-secondary archive-filter" data-filter="open-source">Open Source</button>
          <button class="btn btn-sm btn-secondary archive-filter" data-filter="free">Free</button>
          <button class="btn btn-sm btn-secondary archive-filter" data-filter="freemium">Freemium</button>
          <button class="btn btn-sm btn-secondary archive-filter" data-filter="paid">Paid</button>
        </div>
      </div>
      <div id="archive-results-count" style="font-size:0.85rem; color:var(--text-subtle); margin-top:0.75rem;">Showing all 94 tools across 25 categories</div>
    `
  },
  content: archiveContent
}));

// ==========================================================================
// 3. Generate submit.html (Tool Submission Page)
// ==========================================================================
console.log('✉️ Generating Submit Page (submit.html)...');

const submitContent = `
  <div class="submit-layout" style="display:grid; grid-template-columns: 3fr 2fr; gap:2.5rem; align-items:start; margin-bottom: 5.5rem;">
    <!-- Form Card -->
    <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2.25rem; box-shadow:var(--shadow-card); margin-bottom: 2rem;">
      <h2 style="font-size:1.35rem; font-weight:700; margin-bottom:0.5rem;">Propose a Tool or Service</h2>
      <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">
        Fill out the details below. Clicking <strong>"Continue to GitHub"</strong> will securely pre-fill an issue template on our official repository.
      </p>

      <form id="submission-form" onsubmit="handleFormSubmit(event)" style="margin-bottom: 1rem;">
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
  miniHero: {
    breadcrumbs: [
      { label: 'Home', url: 'index.html' },
      { label: 'Submit a Tool', url: 'submit.html' }
    ],
    icon: ICONS.plusCircle,
    title: 'Submit a Tool',
    subtext: 'StaticStack is 100% community-curated and maintained on GitHub. Submissions are processed through <strong>GitHub Issues</strong> to ensure transparency, security, and spam prevention.'
  },
  content: submitContent
}));

// ==========================================================================
// 4. Generate contribute.html (Contributing Guide Page)
// ==========================================================================
console.log('🤝 Generating Contribute Page (contribute.html)...');

const contributingMd = fs.readFileSync(path.join(ROOT_DIR, 'CONTRIBUTING.md'), 'utf8');
const renderedContributing = marked.parse(contributingMd);

const contributeContent = `
  <div class="markdown-body">
    ${renderedContributing}
  </div>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'contribute.html'), renderLayout({
  title: 'Contributing Guide - Static Website Toolkit',
  description: 'Learn how to contribute new tools, report updates, and submit pull requests to the Static Website Toolkit.',
  currentNav: '',
  miniHero: {
    breadcrumbs: [
      { label: 'Home', url: 'index.html' },
      { label: 'Contributing Guide', url: 'contribute.html' }
    ],
    icon: ICONS.gitPullRequest,
    title: 'Contributing Guide',
    subtext: 'Thank you for helping keep the Static Website Toolkit accurate, comprehensive, and valuable! Learn how to propose tools, improve docs, or open pull requests.',
    actions: `
      <a href="submit.html" class="btn btn-primary btn-sm">Use Web Submit Form →</a>
      <a href="https://github.com/E6WeB/htmlstatic/issues" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
        GitHub Issues ${ICONS.external}
      </a>
      <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
        ${ICONS.github} View Repository
      </a>
    `
  },
  content: contributeContent
}));

// ==========================================================================
// 5. Generate thankyou.html (Thank You & Credits Page)
// ==========================================================================
console.log('💖 Generating Thank You Page (thankyou.html)...');

const thankYouMd = fs.readFileSync(path.join(ROOT_DIR, 'THANKYOU.md'), 'utf8');
const renderedThankYou = marked.parse(thankYouMd);

const thankYouContent = `
  <div class="markdown-body">
    ${renderedThankYou}
  </div>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'thankyou.html'), renderLayout({
  title: 'Thank You & Credits - Static Website Toolkit',
  description: 'Special thanks to the contributors, maintainers, and community behind Static Website Toolkit.',
  currentNav: '',
  miniHero: {
    breadcrumbs: [
      { label: 'Home', url: 'index.html' },
      { label: 'Thank You & Credits', url: 'thankyou.html' }
    ],
    icon: ICONS.heart,
    title: 'Thank You & Credits',
    subtext: 'Recognizing the community, contributors, and tool creators who make modern static websites exceptional.',
    actions: `
      <a href="https://github.com/E6WeB/htmlstatic" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
        ${ICONS.github} GitHub Repository ${ICONS.external}
      </a>
    `
  },
  content: thankYouContent
}));

// ==========================================================================
// 6. Generate Dedicated HTML Pages for ALL 94 Tools!
// ==========================================================================
// Helper to select deterministic diverse random tools for sidebar
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

console.log(`🔧 Generating Dedicated HTML Pages for all ${allTools.length} tools...`);
allTools.forEach(tool => {
  let cleanMd = tool.rawMd || `# ${tool.name}\n\n> ${tool.description}\n\n- **Website**: ${tool.websiteUrl}`;
  // Strip trailing markdown navigation links
  cleanMd = cleanMd.replace(/\n+---\s*\n+\[.*?Back to[\s\S]*$/i, '').trimEnd();

  // Render markdown with relative link rewriting
  let parsedHtml = marked.parse(cleanMd);
  parsedHtml = parsedHtml
    .replace(/href="(?:\.\.\/)+README\.md#([^"]+)"/g, 'href="../../archive.html#$1"')
    .replace(/href="(?:\.\.\/)+README\.md"/g, 'href="../../archive.html"')
    .replace(/href="(?:\.\.\/)+([a-z0-9\-]+)\/([a-z0-9\-]+)\.md"/g, 'href="../../tools/$1/$2.html"')
    .replace(/href="([a-z0-9\-]+)\.md"/g, 'href="../../tools/' + tool.categorySlug + '/$1.html"');

  let badgeClass = 'badge-freemium';
  let badgeIcon = ICONS.star;
  const pBadge = tool.primaryBadge.toLowerCase();
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

  const randomTools = getRandomTools(tool.slug, 4);
  const randomToolsHtml = randomTools.map(rt => {
    let rtBadgeClass = 'badge-freemium';
    const rtPBadge = rt.primaryBadge.toLowerCase();
    if (rtPBadge.includes('open source')) {
      rtBadgeClass = 'badge-open-source';
    } else if (rtPBadge.includes('free')) {
      rtBadgeClass = 'badge-free';
    } else if (rtPBadge.includes('paid')) {
      rtBadgeClass = 'badge-paid';
    }

    return `
      <a href="../../tools/${rt.categorySlug}/${rt.slug}.html" class="sidebar-tool-card">
        <span class="sidebar-tool-icon">
          ${CATEGORY_ICONS[rt.categorySlug] || ICONS.zap}
        </span>
        <div class="sidebar-tool-info">
          <div class="sidebar-tool-name">
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(rt.name)}</span>
            <span class="badge ${rtBadgeClass}" style="font-size:0.65rem; padding:0.1rem 0.4rem;">${escapeHtml(rt.primaryBadge)}</span>
          </div>
          <div class="sidebar-tool-desc">${escapeHtml(rt.tagline || rt.description)}</div>
        </div>
      </a>
    `;
  }).join('');

  const renderedToolHtml = renderLayout({
    title: `${tool.name} - ${tool.categoryTitle}`,
    description: `${tool.name}: ${tool.description}. Guide, integration examples, and features for static websites.`,
    currentNav: 'archive',
    miniHero: {
      breadcrumbs: [
        { label: 'Home', url: '../../index.html' },
        { label: 'Archive', url: '../../archive.html' },
        { label: tool.categoryTitle, url: `../../archive.html#${tool.categorySlug}` },
        { label: tool.name, url: '#' }
      ],
      badgeRow: `
        <span class="badge ${badgeClass}">${badgeIcon} ${escapeHtml(tool.primaryBadge)}</span>
        <a href="../../archive.html#${tool.categorySlug}" class="badge badge-freemium" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem;">
          <span style="display:inline-flex; align-items:center;">${CATEGORY_ICONS[tool.categorySlug] || ICONS.zap}</span>
          ${escapeHtml(tool.categoryTitle)}
        </a>
      `,
      icon: CATEGORY_ICONS[tool.categorySlug] || ICONS.zap,
      title: escapeHtml(tool.name),
      subtext: escapeHtml(tool.tagline || tool.description),
      actions: `
        <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.95rem; padding:0.6rem 1.15rem;">
          Visit ${escapeHtml(tool.name)} ${ICONS.external}
        </a>
      `,
      extraHtml: `
        <div style="display:flex; align-items:center; gap:1.5rem; font-size:0.875rem; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:1rem; margin-top:0.5rem; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <span style="color:var(--text-subtle); display:inline-flex;">${ICONS.globe}</span>
            <strong>Official Website:</strong>
            <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.websiteLabel)} ${ICONS.external}</a>
          </div>
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <span style="color:var(--text-subtle); display:inline-flex;">${ICONS.tag}</span>
            <strong>Category:</strong>
            <a href="../../archive.html#${tool.categorySlug}">${escapeHtml(tool.categoryTitle)}</a>
          </div>
          <div style="margin-left:auto;">
            <a href="https://github.com/E6WeB/htmlstatic/blob/main/${tool.relPath}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
              ${ICONS.github} Edit Markdown Guide
            </a>
          </div>
        </div>
      `
    },
    rootPath: '../../',
    content: `
      <div class="tool-page-layout">
        <!-- Main Documentation & Discussion -->
        <div class="tool-page-main">
          <article style="padding: 0 0 2rem;">
            <!-- Rendered Documentation -->
            <div class="markdown-body">
              ${parsedHtml}
            </div>

            <!-- Discussion via Giscus -->
            <section class="tool-comments-section" style="margin-bottom:2.5rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-card);">
              <div style="margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--border-color);">
                <div style="display:flex; align-items:center; gap:0.55rem;">
                  <span style="color:var(--accent); display:inline-flex; align-items:center;">${CATEGORY_ICONS['comments-community']}</span>
                  <h3 style="font-size:1.25rem; font-weight:700; margin:0; color:var(--text-main);">Discussion</h3>
                </div>
                <p style="font-size:0.875rem; color:var(--text-muted); margin:0.35rem 0 0 0;">Ask questions, share integration tips, or leave feedback.</p>
              </div>
              <div class="giscus"></div>
              <script src="https://giscus.app/client.js"
                      data-repo="E6WeB/static-comment"
                      data-repo-id="R_kgDOVYc0DQ"
                      data-category="General"
                      data-category-id="DIC_kwDOVYc0Dc4DJsXu"
                      data-mapping="pathname"
                      data-strict="0"
                      data-reactions-enabled="0"
                      data-emit-metadata="0"
                      data-input-position="bottom"
                      data-theme="light"
                      data-lang="en"
                      crossorigin="anonymous"
                      async>
              </script>
            </section>

            <!-- Bottom Navigation -->
            <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap; padding-top:2rem; border-top:1px solid var(--border-color);">
              <a href="../../archive.html#${tool.categorySlug}" class="btn btn-secondary">
                ${ICONS.arrowLeft} Back to ${escapeHtml(tool.categoryTitle)}
              </a>
              <a href="../../archive.html" class="btn btn-secondary">
                Browse Full Archive
              </a>
              <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                Visit Official Site ${ICONS.external}
              </a>
            </div>
          </article>
        </div>

        <!-- Right Sidebar -->
        <aside class="tool-page-sidebar">
          <!-- Static Site Hints & Tips Card -->
          <div class="sidebar-widget">
            <div class="sidebar-widget-header">
              <span style="color:var(--accent); display:inline-flex; align-items:center;">${ICONS.sparkles}</span>
              <h4 class="sidebar-widget-title">Static Site Hints &amp; Tips</h4>
            </div>
            <div class="sidebar-widget-body">
              <div class="sidebar-tip-item">
                <span class="sidebar-tip-icon">${ICONS.check}</span>
                <div>
                  <strong style="color:var(--text-main); font-size:0.825rem; display:block;">Zero Backend Required</strong>
                  All tools here integrate directly into HTML/CSS/JS without hosting server runtimes or databases.
                </div>
              </div>
              <div class="sidebar-tip-item">
                <span class="sidebar-tip-icon">${ICONS.zap}</span>
                <div>
                  <strong style="color:var(--text-main); font-size:0.825rem; display:block;">Async Performance</strong>
                  Always use <code>async</code> or <code>defer</code> on widget scripts to keep page load times fast.
                </div>
              </div>
              <div class="sidebar-tip-item">
                <span class="sidebar-tip-icon">${ICONS.shield}</span>
                <div>
                  <strong style="color:var(--text-main); font-size:0.825rem; display:block;">API Key Security</strong>
                  Never commit secret tokens to static repositories. Use public client keys or edge proxies.
                </div>
              </div>
              <div class="sidebar-tip-item">
                <span class="sidebar-tip-icon">${ICONS.globe}</span>
                <div>
                  <strong style="color:var(--text-main); font-size:0.825rem; display:block;">Host Anywhere</strong>
                  Compatible with GitHub Pages, Cloudflare Pages, Netlify, Vercel, and Wasmer Edge.
                </div>
              </div>
            </div>
          </div>

          <!-- Discover Random Tools Card -->
          <div class="sidebar-widget">
            <div class="sidebar-widget-header" style="justify-content:space-between;">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="color:var(--accent); display:inline-flex; align-items:center;">${ICONS.star}</span>
                <h4 class="sidebar-widget-title">Discover Random Tools</h4>
              </div>
              <a href="../../archive.html" style="font-size:0.75rem; color:var(--accent); font-weight:600; text-decoration:none;">View All &rarr;</a>
            </div>
            <div class="sidebar-widget-body" style="display:flex; flex-direction:column; gap:0.4rem;">
              ${randomToolsHtml}
            </div>
          </div>

          <!-- Submit Alternative Card -->
          <div class="sidebar-widget" style="background:var(--bg-muted); border-style:dashed;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
              <span style="color:var(--accent); display:inline-flex;">${ICONS.plusCircle}</span>
              <strong style="font-size:0.875rem; color:var(--text-main);">Know a Great Tool?</strong>
            </div>
            <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin-bottom:0.85rem;">
              StaticStack is community curated. Share your favorite static web service or tool with the community.
            </p>
            <a href="../../submit.html" class="btn btn-secondary" style="width:100%; font-size:0.825rem; padding:0.5rem 0.75rem;">
              Submit a Tool &rarr;
            </a>
          </div>
        </aside>
      </div>
    `
  });

  // Write tool page: tools/<category>/<tool>.html and tools/<category>/<tool>/index.html
  const toolCatDir = path.join(ROOT_DIR, 'tools', tool.categorySlug);
  ensureDir(toolCatDir);
  fs.writeFileSync(path.join(toolCatDir, `${tool.slug}.html`), renderedToolHtml);

  const toolSubDir = path.join(toolCatDir, tool.slug);
  ensureDir(toolSubDir);
  fs.writeFileSync(path.join(toolSubDir, 'index.html'), renderedToolHtml);

  // Also write into the category directory directly: e.g. payments-ecommerce/reflow.html and payments-ecommerce/reflow/index.html
  const directCatDir = path.join(ROOT_DIR, tool.folder);
  ensureDir(directCatDir);
  fs.writeFileSync(path.join(directCatDir, `${tool.slug}.html`), renderedToolHtml);

  const directSubDir = path.join(directCatDir, tool.slug);
  ensureDir(directSubDir);
  fs.writeFileSync(path.join(directSubDir, 'index.html'), renderedToolHtml);

  // Mirror to public/
  const pubToolCatDir = path.join(PUBLIC_DIR, 'tools', tool.categorySlug);
  ensureDir(pubToolCatDir);
  fs.writeFileSync(path.join(pubToolCatDir, `${tool.slug}.html`), renderedToolHtml);

  const pubToolSubDir = path.join(pubToolCatDir, tool.slug);
  ensureDir(pubToolSubDir);
  fs.writeFileSync(path.join(pubToolSubDir, 'index.html'), renderedToolHtml);

  const pubDirectCatDir = path.join(PUBLIC_DIR, tool.folder);
  ensureDir(pubDirectCatDir);
  fs.writeFileSync(path.join(pubDirectCatDir, `${tool.slug}.html`), renderedToolHtml);

  const pubDirectSubDir = path.join(pubDirectCatDir, tool.slug);
  ensureDir(pubDirectSubDir);
  fs.writeFileSync(path.join(pubDirectSubDir, 'index.html'), renderedToolHtml);
});

// ==========================================================================
// 7. Synchronize Aliases in Root & Mirror to public/
// ==========================================================================
fs.copyFileSync(path.join(ROOT_DIR, 'contribute.html'), path.join(ROOT_DIR, 'contributing.html'));
fs.copyFileSync(path.join(ROOT_DIR, 'thankyou.html'), path.join(ROOT_DIR, 'thank-you.html'));

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

// Sync src/img assets to public/
ensureDir(path.join(PUBLIC_DIR, 'src', 'img'));
if (fs.existsSync(path.join(ROOT_DIR, 'src', 'img', 'og-image.webp'))) {
  fs.copyFileSync(path.join(ROOT_DIR, 'src', 'img', 'og-image.webp'), path.join(PUBLIC_DIR, 'src', 'img', 'og-image.webp'));
  if (fs.existsSync(path.join(ROOT_DIR, 'src', 'img', 'opengraph.webp'))) {
    fs.copyFileSync(path.join(ROOT_DIR, 'src', 'img', 'opengraph.webp'), path.join(PUBLIC_DIR, 'src', 'img', 'opengraph.webp'));
  }
  if (fs.existsSync(path.join(ROOT_DIR, 'src', 'img', 'og.webp'))) {
    fs.copyFileSync(path.join(ROOT_DIR, 'src', 'img', 'og.webp'), path.join(PUBLIC_DIR, 'src', 'img', 'og.webp'));
  }
}

console.log(`🎉 Complete! Generated all main pages with wider 320px archive sidebar + dedicated HTML pages for all ${allTools.length} tools!`);
