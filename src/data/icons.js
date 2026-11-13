// ==========================================================================
// Icons, Category SVGs, and Shared Parsing/Formatting Helpers
// ==========================================================================

const ICONS = {
  logo: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  external: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
  arrowUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
  sun: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  close: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  menu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
  github: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>`,
  check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  star: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  tag: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  branch: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`,
  book: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  bookOpen: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
  mail: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`,
  sparkles: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  home: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  chevronRight: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  archive: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>`,
  plusCircle: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
  plus: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  compass: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,
  moreHorizontal: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle><circle cx="5" cy="12" r="1.5"></circle></svg>`,
  gitPullRequest: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>`,
  bookmark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`,
  heart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  globe: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  thumbsUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`,
  facebook: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
  comments: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  chatBubbles: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3.5C5.36 3.5 2 6.19 2 9.5c0 1.88 1.08 3.56 2.78 4.66L3.8 17.2l3.48-1.46c.7.17 1.45.26 2.22.26 4.14 0 7.5-2.69 7.5-6s-3.36-6.5-7.5-6.5z"></path><circle cx="6.5" cy="9.5" r="0.9"></circle><circle cx="9.5" cy="9.5" r="0.9"></circle><circle cx="12.5" cy="9.5" r="0.9"></circle><path d="M16.9 10.6c2.42.73 4.1 2.47 4.1 4.5 0 1.48-.88 2.8-2.25 3.65l.75 2.45-2.72-1.15c-.68.16-1.4.25-2.15.25-2.63 0-4.9-1.15-5.85-2.8"></path></svg>`,
  messageSquare: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  grid: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  lightbulb: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>`,
  helpCircle: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  rocket: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 9v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>`,
  megaphone: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>`,
  poll: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>`,
  lifeBuoy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>`,
  eye: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  smile: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`
};

const CATEGORY_ICONS = {
  'ai-content-creation': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  'ai-models': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`,
  'analytics-privacy': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  'authentication-users': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  'booking-scheduling': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  'browser-extensions': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>`,
  'comments-community': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  'contact-forms': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  'content-management': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  'css-components': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  'database-storage': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
  'development-tools': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  'hosting-deployment': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
  'html-templates': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
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
  'typography-fonts': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
  'tutorials': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
  'inactive': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`
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

function getDomainFromUrl(url) {
  try {
    if (!url) return '';
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch (e) {
    return '';
  }
}

function getBlackWhiteFallbackSvg(name, size = 18) {
  const initial = encodeURIComponent((name || 'T').charAt(0).toUpperCase());
  return `data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27${size}%27 height=%27${size}%27 viewBox=%270 0 24 24%27%3E%3Crect width=%2724%27 height=%2724%27 rx=%275%27 fill=%27%23111827%27 stroke=%27%23374151%27 stroke-width=%271.5%27/%3E%3Ctext x=%2750%25%27 y=%2752%25%27 dominant-baseline=%27central%27 text-anchor=%27middle%27 font-family=%27system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif%27 font-size=%2712%27 font-weight=%27700%27 fill=%27%23ffffff%27%3E${initial}%3C/text%3E%3C/svg%3E`;
}

const CATEGORY_TRENDING_KEYWORDS = {
  'ai-content-creation': ['ai-copywriting', 'seo-content', 'markdown-generator', 'generative-ai', 'blog-automation', 'static-site-content'],
  'ai-models': ['llm-api', 'ai-agents', 'rag', 'open-weights', 'prompt-engineering', 'function-calling', 'edge-ai'],
  'analytics-privacy': ['cookieless-analytics', 'gdpr-compliant', 'google-analytics-alternative', 'privacy-first', 'lightweight-script', 'web-metrics'],
  'authentication-users': ['passkeys', 'oauth-login', 'jwt-auth', 'passwordless', 'user-management', 'jamstack-auth', 'zero-backend'],
  'booking-scheduling': ['appointment-booking', 'calendar-embed', 'meeting-scheduler', 'no-code-widget', 'static-html-embed'],
  'browser-extensions': ['web-dev-extension', 'page-capture', 'productivity-tool', 'chrome-extension', 'developer-workflow'],
  'comments-community': ['static-blog-comments', 'disqus-alternative', 'github-comments', 'no-database', 'community-widget', 'jamstack-forum'],
  'contact-forms': ['serverless-forms', 'static-html-form', 'form-backend', 'email-notifications', 'no-backend-forms', 'jamstack-forms'],
  'content-management': ['git-based-cms', 'headless-cms', 'markdown-cms', 'wordpress-alternative', 'static-site-cms', 'visual-editor'],
  'css-components': ['ui-components', 'classless-css', 'lightweight-css', 'web-components', 'responsive-design', 'tailwind-alternative'],
  'database-storage': ['serverless-database', 'baas', 'rest-api', 'realtime-db', 'edge-storage', 'firebase-alternative'],
  'development-tools': ['ai-coding-agent', 'vibe-coding', 'code-editor', 'web-performance', 'core-web-vitals', 'static-web-dev'],
  'hosting-deployment': ['free-static-hosting', 'edge-cdn', 'git-deploy', 'jamstack-hosting', 'serverless-deploy', 'custom-domain'],
  'html-templates': ['html5-templates', 'free-website-templates', 'bootstrap-templates', 'responsive-html-css', 'landing-page-templates', 'static-site-themes'],
  'images-optimization': ['webp-converter', 'svg-vectorizer', 'image-compression', 'core-web-vitals', 'fast-page-load', 'asset-optimization'],
  'maps-geolocation': ['interactive-maps', 'webgl-maps', 'google-maps-alternative', 'geojson', 'store-locator', 'vector-tiles'],
  'interactive-scripts': ['vanilla-js', 'scroll-animations', 'touch-slider', 'lightbox-gallery', 'zero-dependencies', 'micro-interactions'],
  'live-chat': ['customer-support-widget', 'live-chat-embed', 'helpdesk-widget', 'visitor-messaging', 'no-backend-chat'],
  'media-players': ['html5-video-player', 'hls-streaming', 'audio-waveform', 'podcast-player', 'custom-media-player'],
  'monitoring-errors': ['error-tracking', 'session-replay', 'frontend-observability', 'bug-reporting', 'rum-monitoring'],
  'newsletters-email': ['newsletter-embed', 'transactional-email', 'email-api', 'subscriber-growth', 'mailchimp-alternative'],
  'payments-ecommerce': ['static-ecommerce', 'digital-downloads', 'stripe-checkout', 'no-backend-store', 'sell-digital-products', 'payment-links'],
  'search': ['static-site-search', 'client-side-search', 'instant-search', 'wasm-search', 'zero-server-search', 'documentation-search'],
  'security-spam-protection': ['bot-protection', 'captcha-alternative', 'form-spam-filter', 'privacy-captcha', 'zero-friction-security'],
  'static-site-generators': ['ssg', 'jamstack', 'markdown-to-html', 'zero-js', 'fast-static-sites', 'blog-generator'],
  'surveys-feedback': ['feedback-widget', 'embeddable-surveys', 'product-roadmap', 'changelog-widget', 'typeform-alternative'],
  'tutorials': ['static-web-tutorials', 'astro-guides', 'jamstack-course', 'web-dev-walkthroughs', 'zero-backend-guides'],
  'typography-fonts': ['self-hosted-fonts', 'gdpr-fonts', 'google-fonts-alternative', 'variable-fonts', 'web-typography', 'zero-layout-shift']
};

const TOOL_TRENDING_KEYWORDS = {
  'chatgpt': ['chatgpt', 'openai', 'ai-copywriting', 'markdown-writer', 'seo-blog-posts', 'html-generator', 'content-automation', 'gpt-4o'],
  'claude': ['claude-ai', 'anthropic', 'long-context-ai', 'technical-writing', 'code-generation', 'markdown-docs', 'ai-copywriter', 'claude-sonnet'],
  'google-gemini': ['google-gemini', 'multimodal-ai', 'ai-research', 'content-drafting', 'structured-json', 'seo-writing', 'gemini-pro'],
  'imgmov': ['ai-video-generator', 'product-video-ai', 'image-to-video', 'ecommerce-visuals', 'ai-marketing-assets', 'commercial-ai-art'],
  'perplexity': ['perplexity-ai', 'ai-search-engine', 'cited-research', 'fact-checking', 'seo-research', 'content-discovery', 'answer-engine'],
  'recraft': ['ai-svg-generator', 'vector-ai', 'icon-generator', '3d-illustrations', 'brand-graphics', 'scalable-vectors', 'web-illustrations'],
  'chatgpt-openai': ['openai-api', 'gpt-4o', 'o1-reasoning', 'llm-api', 'structured-outputs', 'function-calling', 'ai-embeddings'],
  'claude-anthropic': ['anthropic-api', 'claude-3-7-sonnet', 'ai-coding-model', '200k-context', 'agentic-workflows', 'tool-use-api', 'llm'],
  'cohere-command': ['cohere-api', 'command-r', 'enterprise-rag', 'semantic-search', 'rerank-api', 'vector-embeddings', 'cited-llm'],
  'deepseek': ['deepseek-r1', 'deepseek-v3', 'open-weights-llm', 'reasoning-model', 'ai-coding', 'low-cost-llm', 'mit-license-ai'],
  'google-gemini-model': ['gemini-api', '2m-context-window', 'multimodal-llm', 'gemini-flash', 'vertex-ai', 'long-context-rag', 'audio-video-ai'],
  'grok-xai': ['grok-api', 'xai', 'realtime-knowledge', 'reasoning-llm', 'coding-assistant', 'frontier-model', 'openai-compatible'],
  'meta-llama': ['llama-3', 'meta-ai', 'open-source-llm', 'local-ai', 'ollama', 'self-hosted-llm', 'open-weights'],
  'microsoft-phi': ['phi-3', 'small-language-model', 'slm', 'webgpu-ai', 'browser-llm', 'on-device-ai', 'onnx-runtime'],
  'mistral-ai': ['mistral-large', 'codestral', 'open-weights-ai', 'fast-inference', 'european-ai', 'code-completion-llm', 'function-calling'],
  'qwen': ['qwen-2-5', 'qwen-coder', 'open-source-llm', 'coding-llm', 'multilingual-ai', 'local-llm', 'apache-2-ai'],
  'countapi': ['hit-counter', 'view-tracker', 'page-views-api', 'no-signup-api', 'visitor-counter', 'static-site-metrics', 'free-counter'],
  'goatcounter': ['goatcounter', 'open-source-analytics', 'cookieless-tracking', 'gdpr-analytics', 'lightweight-analytics', 'no-banner-analytics'],
  'plausible': ['plausible-analytics', 'google-analytics-alternative', 'privacy-analytics', 'cookieless', 'gdpr-compliant', '1kb-script', 'eu-hosted'],
  'statcounter': ['statcounter', 'realtime-visitor-tracking', 'hit-counter', 'visitor-paths', 'web-stats', 'classic-analytics'],
  'umami': ['umami-analytics', 'self-hosted-analytics', 'open-source-ga-alternative', 'cookieless-metrics', 'privacy-tracking', 'vercel-analytics'],
  'clerk': ['clerk-auth', 'drop-in-auth', 'passkey-login', 'social-oauth', 'user-profiles', 'javascript-auth-sdk', 'auth0-alternative'],
  'outseta': ['outseta', 'membership-platform', 'saas-starter', 'stripe-subscriptions', 'auth-and-crm', 'gated-content', 'memberstack-alternative'],
  'supabase-auth': ['supabase-auth', 'open-source-auth', 'magic-links', 'oauth-providers', 'jwt-authentication', 'row-level-security', 'firebase-auth-alternative'],
  'cal-com': ['cal-com', 'open-source-calendly', 'scheduling-embed', 'booking-widget', 'self-hosted-calendar', 'meeting-links'],
  'calendly': ['calendly', 'appointment-scheduling', 'popup-booking-widget', 'calendar-integration', 'consultation-booking', 'inline-embed'],
  'fireshot': ['fireshot', 'full-page-screenshot', 'webpage-to-pdf', 'browser-capture', 'annotate-screenshots', 'visual-qa'],
  'send-url': ['share-url-extension', 'email-link-button', 'quick-share', 'browser-utility', 'clean-url-sharing'],
  'disqus': ['disqus-comments', 'blog-comment-widget', 'social-comments', 'moderation-tools', 'embedded-discussions'],
  'flarum': ['flarum-forum', 'open-source-forum', 'discourse-alternative', 'lightweight-community', 'embeddable-discussions'],
  'github-discussions': ['github-discussions', 'open-source-community', 'developer-qna', 'repo-forum', 'zero-cost-community'],
  'giscus': ['giscus', 'github-discussions-comments', 'static-blog-comments', 'open-source-comments', 'no-tracking-comments', 'markdown-comments'],
  'iine': ['like-button-widget', 'clap-button', 'appreciation-counter', 'privacy-first-likes', 'no-login-upvotes', 'tiny-js-widget'],
  'utterances': ['utterances', 'github-issues-comments', 'lightweight-blog-comments', 'open-source-widget', 'markdown-discussions'],
  'basin': ['basin-forms', 'static-form-backend', 'ajax-contact-form', 'spam-filtering', 'webhook-forms', 'custom-redirects'],
  'craftforms': ['craftforms', 'payment-forms', 'booking-form-builder', 'quote-calculator-form', 'stripe-forms', 'embeddable-forms'],
  'formspree': ['formspree', 'html-form-backend', 'contact-form-api', 'serverless-email-forms', 'ajax-submissions', 'static-site-forms'],
  'splitform': ['splitform', 'static-contact-form', 'form-endpoint', 'email-forwarding-form', 'no-backend-contact'],
  'craftpages': ['craftpages', 'offline-html-cms', 'desktop-site-builder', 'plain-html-editor', 'zero-lock-in-cms', 'static-page-manager'],
  'decap-cms': ['decap-cms', 'netlify-cms', 'git-backed-cms', 'markdown-editor', 'open-source-headless-cms', 'astro-hugo-cms'],
  'pages-cms': ['pages-cms', 'github-cms', 'markdown-frontmatter-editor', 'collaborative-git-cms', 'nextjs-astro-cms'],
  'bulma': ['bulma-css', 'flexbox-framework', 'pure-css-components', 'no-js-css', 'modular-sass', 'bootstrap-alternative'],
  'lucide-icons': ['lucide-icons', 'feather-icons-fork', 'svg-icon-library', 'tree-shakable-icons', 'clean-vector-icons'],
  'pico-css': ['pico-css', 'classless-css', 'semantic-html-styling', 'dark-mode-css', 'minimal-css-framework', 'zero-classes'],
  'shoelace': ['shoelace-ui', 'web-components', 'custom-elements', 'framework-agnostic-ui', 'accessible-components', 'shadow-dom'],
  'firebase-firestore': ['firestore', 'nosql-cloud-db', 'realtime-listeners', 'client-side-database', 'serverless-storage', 'google-firebase'],
  'jsonbin': ['jsonbin', 'json-storage-api', 'rest-json-store', 'mock-backend', 'serverless-key-value', 'prototype-db'],
  'supabase': ['supabase', 'open-source-firebase', 'postgres-rest-api', 'realtime-subscriptions', 'edge-functions', 'pgvector'],
  'antigravity-cli': ['antigravity-cli', 'agy-cli', 'terminal-coding-agent', 'ai-workflow-automation', 'slash-commands', 'agentic-cli'],
  'antigravity-ide': ['antigravity-ide', 'ai-pair-programming', 'agentic-ide', 'browser-automation-ide', 'multi-agent-coding', 'google-deepmind'],
  'bootstrap-studio': ['bootstrap-studio', 'drag-and-drop-html', 'visual-bootstrap-builder', 'clean-html-export', 'desktop-web-builder'],
  'brickstatic': ['brickstatic', 'wordpress-to-static-html', 'bricks-builder-export', 'headless-wordpress', 'github-pages-wordpress'],
  'cursor': ['cursor-ide', 'ai-code-editor', 'cursor-composer', 'vibe-coding', 'vscode-fork-ai', 'multi-file-ai-edits'],
  'designcraft': ['designcraft', 'open-source-indesign', 'rust-desktop-publishing', 'page-layout-tool', 'pdf-typesetting', 'knuth-plass'],
  'effectcraft': ['effectcraft', 'open-source-after-effects', 'lottie-animation-export', 'rust-motion-graphics', 'web-animations', 'vfx-compositor'],
  'emdash': ['emdash', 'parallel-coding-agents', 'agentic-orchestration', 'git-worktree-agents', 'autonomous-coding', 'ai-dev-environment'],
  'eslint': ['eslint', 'javascript-linter', 'static-code-analysis', 'code-quality', 'ecmascript-rules', 'bug-prevention'],
  'figcraft': ['figcraft', 'open-source-figma', 'rust-ui-design', 'auto-layout-tool', 'offline-vector-design', 'wireframing'],
  'github-desktop': ['github-desktop', 'visual-git-client', 'git-gui', 'branch-management', 'no-cli-git', 'pull-requests'],
  'google-lighthouse': ['google-lighthouse', 'core-web-vitals', 'pagespeed-audit', 'seo-checker', 'accessibility-audit', 'lcp-cls-inp'],
  'opencode': ['opencode', 'open-source-claude-code', 'terminal-ai-agent', 'tui-coding-assistant', 'multi-provider-llm', 'local-coding-agent'],
  'pdfcraft': ['pdfcraft', 'open-source-acrobat', 'offline-pdf-editor', 'merge-split-pdf', 'rust-pdf-tool', 'privacy-pdf-utility'],
  'photocraft': ['photocraft', 'open-source-photoshop', 'psd-editor', 'rust-image-editor', 'layer-mask-editor', 'offline-photo-editing'],
  'prettier': ['prettier', 'opinionated-code-formatter', 'auto-format-html-css-js', 'clean-code-style', 'editor-save-format'],
  'sitereal': ['sitereal', 'visual-astro-builder', 'webflow-for-astro', 'git-synced-visual-editor', 'tailwind-visual-builder', 'zero-lock-in'],
  'staticseo': ['staticseo', 'static-html-seo', 'open-graph-generator', 'json-ld-schema-builder', 'xml-sitemap-generator', 'meta-tag-automation', 'zero-js-seo'],
  'visual-studio-code': ['vscode', 'microsoft-code-editor', 'web-dev-extensions', 'live-server', 'intellisense', 'git-integration'],
  'wordcraft': ['wordcraft', 'open-source-word-processor', 'docx-editor', 'rust-document-editor', 'clean-pdf-export', 'offline-writing'],
  'zed': ['zed-editor', 'rust-code-editor', 'gpu-accelerated-ide', 'multiplayer-coding', 'ultra-fast-editor', 'ai-inline-assist'],
  'cloudflare-pages': ['cloudflare-pages', 'unlimited-bandwidth-hosting', 'edge-static-hosting', 'cloudflare-workers', 'git-auto-deploy', 'fast-global-cdn'],
  'codeberg-pages': ['codeberg-pages', 'eu-nonprofit-hosting', 'open-source-git-hosting', 'github-pages-alternative', 'privacy-static-host'],
  'deno-deploy': ['deno-deploy', 'v8-isolates-edge', 'serverless-typescript', 'global-edge-hosting', 'zero-cold-start'],
  'firebase-hosting': ['firebase-hosting', 'google-cloud-cdn', 'single-command-deploy', 'free-ssl-hosting', 'preview-channels'],
  'fleek': ['fleek-hosting', 'ipfs-web-hosting', 'decentralized-cdn', 'edge-static-deploy', 'censorship-resistant-web'],
  'github-pages': ['github-pages', 'gh-pages', 'free-repo-hosting', 'jekyll-hosting', 'custom-domain-ssl', 'git-push-deploy'],
  'gitlab-pages': ['gitlab-pages', 'gitlab-ci-cd-hosting', 'free-static-hosting', 'custom-domains', 'devops-static-deploy'],
  'kinsta': ['kinsta-static-hosting', 'cloudflare-edge-hosting', 'free-static-site-host', 'git-based-deployment', 'fast-cdn-hosting'],
  'netlify': ['netlify', 'jamstack-pioneer', 'deploy-previews', 'netlify-forms', 'edge-functions', 'instant-rollbacks'],
  'render': ['render-static-sites', 'free-global-cdn', 'heroku-alternative', 'auto-git-deploys', 'zero-downtime-hosting'],
  'stormkit': ['stormkit', 'self-hostable-netlify', 'jamstack-deployment', 'staged-rollouts', 'preview-environments'],
  'surge': ['surge-sh', 'cli-static-publishing', 'single-command-deploy', 'frontend-staging', 'quick-html-host'],
  'vercel': ['vercel', 'frontend-cloud', 'nextjs-astro-hosting', 'preview-deployments', 'vercel-edge-network', 'zero-config-deploy'],
  'wasmer': ['wasmer-edge', 'webassembly-cloud', 'winterjs', 'wasm-hosting', 'ultra-fast-edge-server', 'static-and-edge-apps'],
  'free-css': ['free-css', 'html-templates', 'css-templates', 'free-website-templates', 'static-html-themes', 'responsive-templates'],
  'html5-up': ['html5-up', 'html5-templates', 'responsive-html-templates', 'creative-commons-templates', 'portfolio-templates', 'landing-page-html'],
  'start-bootstrap': ['start-bootstrap', 'bootstrap-templates', 'open-source-html-templates', 'admin-dashboard-template', 'landing-page-theme', 'mit-license-templates'],
  'templatemo': ['templatemo', 'free-html5-templates', 'bootstrap-html-themes', 'responsive-website-templates', 'one-page-templates', 'portfolio-html'],
  'tooplate': ['tooplate', 'free-html-templates', 'responsive-css-templates', 'html5-themes', 'landing-page-templates', 'static-html-starter'],
  'file-converter': ['file-converter', 'windows-right-click-convert', 'batch-webp-converter', 'open-source-media-converter', 'offline-image-compression'],
  'pic2svg': ['pic2svg', 'png-to-svg', 'jpg-to-vector', 'browser-image-vectorizer', 'free-svg-tracer', 'logo-vectorizer'],
  'site-shot': ['site-shot', 'website-screenshot-api', 'url-to-image-png', 'automated-og-images', 'webpage-thumbnail-generator'],
  'squoosh': ['squoosh-app', 'google-image-compressor', 'avif-webp-converter', 'browser-wasm-compression', 'visual-size-comparison'],
  'svg-repo': ['svg-repo', '500k-free-svgs', 'cc0-vector-icons', 'commercial-use-icons', 'in-browser-svg-color-editor'],
  'tinypng': ['tinypng', 'tinyjpg', 'smart-lossy-compression', 'shrink-png-webp-avif', 'faster-page-speed'],
  'unsplash': ['unsplash', 'royalty-free-photos', 'hd-stock-images', 'commercial-free-photography', 'hero-background-images'],
  'leaflet': ['leaflet-js', 'open-source-maps', 'openstreetmap-js', 'lightweight-mobile-maps', 'custom-map-markers', 'geojson-layers'],
  'mapbox-gl-js': ['mapbox-gl-js', 'webgl-vector-maps', '3d-terrain-maps', 'custom-map-studio', 'smooth-interactive-maps'],
  'aos': ['aos-js', 'animate-on-scroll', 'scroll-reveal-css', 'data-aos-attributes', 'lightweight-scroll-effects'],
  'photoswipe': ['photoswipe', 'javascript-lightbox', 'touch-zoom-gallery', 'responsive-photo-modal', 'zero-dependency-gallery'],
  'swiper': ['swiper-js', 'mobile-touch-carousel', 'hardware-accelerated-slider', '3d-coverflow-slider', 'vanilla-js-carousel'],
  'crisp': ['crisp-chat', 'free-live-chat-widget', 'shared-inbox', 'magicbrowse-cobrowsing', 'chatbot-knowledge-base'],
  'tawk-to': ['tawk-to', '100-percent-free-live-chat', 'unlimited-chat-agents', 'real-time-visitor-monitoring', 'support-ticketing'],
  'mux-player': ['mux-player', 'hls-video-web-component', 'adaptive-bitrate-streaming', 'timeline-hover-previews', 'video-api'],
  'plyr': ['plyr-io', 'accessible-html5-player', 'custom-youtube-vimeo-player', 'stylable-css-video-player', 'audio-video-controls'],
  'wavesurfer': ['wavesurfer-js', 'audio-waveform-visualizer', 'web-audio-canvas', 'podcast-waveform-player', 'interactive-audio-scrubbing'],
  'logrocket': ['logrocket', 'frontend-session-replay', 'network-console-recorder', 'ux-issue-reproduction', 'performance-telemetry'],
  'sentry': ['sentry-io', 'javascript-error-tracking', 'source-map-stack-traces', 'crash-reporting', 'release-health-monitoring'],
  'brevo': ['brevo', 'sendinblue', 'free-transactional-email', 'newsletter-signup-forms', 'smtp-email-marketing'],
  'buttondown': ['buttondown-email', 'markdown-newsletter', 'minimalist-email-list', 'rss-to-email-automation', 'indie-newsletter-tool'],
  'emailit': ['emailit', 'developer-email-api', 'rest-smtp-sending', 'serverless-transactional-email', 'pay-as-you-go-email'],
  'smtp2go': ['smtp2go', 'transactional-email-api', 'smtp-relay', 'email-deliverability', 'serverless-email', 'dkim-spf-automation', 'email-notifications'],
  'lemon-squeezy': ['lemon-squeezy', 'merchant-of-record', 'global-vat-tax-compliance', 'sell-saas-and-downloads', 'overlay-checkout-embed'],
  'payhip': ['payhip', 'sell-ebooks-courses', 'no-monthly-fee-ecommerce', 'embed-buy-button', 'instant-digital-delivery'],
  'paymentform': ['paymentform', 'stripe-checkout-builder', 'no-code-payment-links', 'event-tickets-donations', 'hosted-pay-forms'],
  'reflow': ['reflow-hq', 'static-site-shopping-cart', 'html-data-attribute-store', 'stripe-paypal-static-cart', 'jamstack-ecommerce'],
  'stripe-payment-links': ['stripe-payment-links', 'stripe-buy-button', 'no-code-stripe-checkout', 'apple-google-pay-links', 'recurring-subscriptions'],
  'algolia': ['algolia-search', 'instantsearch-js', 'docsearch', 'typo-tolerant-search', 'millisecond-search-api'],
  'pagefind': ['pagefind', 'rust-wasm-static-search', 'zero-bandwidth-search-index', 'astro-hugo-11ty-search', 'offline-static-search'],
  'cloudflare-turnstile': ['cloudflare-turnstile', 'invisible-captcha-alternative', 'no-puzzle-bot-protection', 'privacy-first-verification', 'free-recaptcha-replacement'],
  'google-recaptcha': ['google-recaptcha', 'recaptcha-v3-score', 'automated-bot-defense', 'form-abuse-protection'],
  'hcaptcha': ['hcaptcha', 'privacy-focused-captcha', 'gdpr-bot-mitigation', 'recaptcha-drop-in-replacement'],
  'astro': ['astro-build', 'islands-architecture', 'zero-js-by-default', 'mdx-content-collections', 'fastest-static-framework'],
  'eleventy': ['eleventy', '11ty', 'zero-client-js-ssg', 'liquid-nunjucks-markdown', 'fast-node-ssg'],
  'gatsby': ['gatsby-js', 'react-graphql-ssg', 'static-image-optimization', 'headless-cms-react'],
  'hugo': ['gohugo', 'fastest-go-ssg', 'millisecond-markdown-builds', 'single-binary-ssg', 'multilingual-static-sites'],
  'jekyll': ['jekyll-rb', 'github-pages-native-ssg', 'liquid-templates', 'markdown-blog-engine'],
  'nextjs': ['nextjs-static-export', 'react-static-site-generation', 'output-export', 'app-router-ssg'],
  'pelican': ['pelican-ssg', 'python-static-generator', 'jinja2-templates', 'restructuredtext-markdown'],
  'zola': ['getzola', 'rust-single-binary-ssg', 'tera-templates', 'built-in-sass-search', 'zero-dependency-ssg'],
  'sleekplan': ['sleekplan', 'in-app-feedback-board', 'public-product-roadmap', 'changelog-popup-widget', 'feature-voting'],
  'tally': ['tally-so', 'notion-style-form-builder', 'unlimited-free-forms', 'conditional-logic-surveys', 'typeform-free-alternative'],
  'coldcompile': ['cold-compile', 'astro-video-tutorials', 'emdash-cms-guides', 'breakdance-static-workflows', 'modern-static-architecture'],
  'bunny-fonts': ['bunny-fonts', 'gdpr-google-fonts-replacement', 'zero-logging-font-cdn', 'eu-privacy-web-fonts'],
  'fontsource': ['fontsource', 'npm-self-hosted-fonts', 'local-woff2-fonts', 'zero-external-dns-fonts', 'offline-google-fonts'],
  'google-fonts': ['google-fonts', 'free-open-source-typefaces', 'variable-web-fonts', 'material-symbols-icons', 'global-font-cdn']
};

function extractToolTags(rawMd, folder, toolSlug, primaryBadge, toolName) {
  const tagsSet = new Set();
  if (rawMd) {
    const bulletMatch = rawMd.match(/(?:[-*]|\d+\.)\s*\*\*(?:Tags|Keywords|Tags\s*[\/&]\s*Keywords)\*\*:\s*([^\n\r]+)/i);
    if (bulletMatch) {
      bulletMatch[1]
        .replace(/[`\[\]]/g, '')
        .split(/[,，]/)
        .map(t => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean)
        .forEach(t => tagsSet.add(t));
    }

    const sectionMatch = rawMd.match(/##\s+(?:Tags|Keywords|Tags\s*[\/&]\s*Keywords)\s*\n+([\s\S]*?)(?=\n+---|\n+##|$)/i);
    if (sectionMatch) {
      sectionMatch[1]
        .replace(/[`\[\]\*\-]/g, ' ')
        .split(/[,，\n]/)
        .map(t => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(t => t.length > 1 && !t.startsWith('http'))
        .forEach(t => tagsSet.add(t));
    }
  }

  if (TOOL_TRENDING_KEYWORDS[toolSlug]) {
    TOOL_TRENDING_KEYWORDS[toolSlug].forEach(t => tagsSet.add(t));
  }
  if (CATEGORY_TRENDING_KEYWORDS[folder]) {
    CATEGORY_TRENDING_KEYWORDS[folder].forEach(t => tagsSet.add(t));
  }

  if (primaryBadge) {
    const b = primaryBadge.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (b) tagsSet.add(b);
  }
  tagsSet.add('static-web');
  tagsSet.add('jamstack');

  return Array.from(tagsSet).slice(0, 10);
}

function renderStackSaveBtn(toolSlug, toolName) {
  const safeSlug = escapeHtml(toolSlug);
  const safeName = escapeHtml(toolName || toolSlug);
  return `<button type="button" class="stack-save-btn" data-stack-save="${safeSlug}" data-tooltip="Save to Stack" aria-label="Save ${safeName} to Stack" aria-pressed="false">${ICONS.bookmark}</button>`;
}

module.exports = {
  ICONS,
  CATEGORY_ICONS,
  parseBadges,
  escapeHtml,
  getDomainFromUrl,
  getBlackWhiteFallbackSvg,
  extractToolTags,
  renderStackSaveBtn
};

