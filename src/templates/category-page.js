// ==========================================================================
// Dedicated Category Landing Hub Template (`/category/<slug>/index.html`)
// ==========================================================================

const fs = require('fs');
const path = require('path');
const { ICONS, CATEGORY_ICONS, escapeHtml } = require('../data/icons');

/**
 * Curated FAQ generator for each category.
 * Provides 4 practical, developer-centric questions & answers for static websites.
 */
function getCategoryFaqs(category) {
  const catSlug = category.slug;
  const catTitle = category.title;

  const faqsBySlug = {
    'contact-forms': [
      {
        q: 'How do I handle contact form submissions on a static website?',
        a: 'Static websites do not run backend server code (like PHP or Node.js). Instead, you set your standard HTML <code>&lt;form action="..."&gt;</code> endpoint to a static form backend service (such as Formspree, Splitform, or Formcake), or submit form data via JavaScript <code>fetch()</code> to an API. The service handles notification emails, webhook dispatches, and submission spam filtering.'
      },
      {
        q: 'Can I collect form submissions without running a database?',
        a: 'Yes! Static form backends automatically store submissions in a cloud dashboard, send email alerts directly to your inbox, and can pipe submissions to Google Sheets, Slack, Discord, or Notion via webhooks—requiring zero database configuration on your part.'
      },
      {
        q: 'Are there generous free tiers for static contact forms?',
        a: 'Most static form providers offer permanent free plans (ranging from 50 to 250 free submissions per month), which is plenty for personal portfolios, agency showcase sites, and small business landing pages.'
      },
      {
        q: 'How do I stop spam on static forms without annoying CAPTCHAs?',
        a: 'Modern static form providers support transparent honeypot fields (hidden form inputs that bots fill out but human visitors never see) and AI spam analysis. This blocks bots reliably without forcing human visitors to solve difficult visual puzzles.'
      }
    ],
    'authentication-users': [
      {
        q: 'Can I have user login and member-only pages on a purely static website?',
        a: 'Yes. Static authentication services (like Outseta, Supabase Auth, or Auth0) embed lightweight client-side JavaScript into your static HTML pages. They manage user registration, session tokens, JWTs, and gated access controls entirely from the client and edge.'
      },
      {
        q: 'How do I protect private static content from unauthorized users?',
        a: 'You can protect content either through client-side routing guards (showing or hiding DOM elements based on authentication state) or through Edge Functions (such as Cloudflare Pages Functions or Netlify Edge Functions) that verify JWT cookies before returning private static assets.'
      },
      {
        q: 'Does static site user authentication support OAuth social logins?',
        a: 'Yes, modern static identity providers natively support Google, GitHub, Apple, and passwordless magic links out of the box with minimal JavaScript snippets.'
      },
      {
        q: 'How are sensitive customer passwords stored?',
        a: 'Static identity providers handle all hashing, salting, encryption, and SOC 2 / GDPR compliance on secure identity infrastructure, so your static repository never touches or stores raw credentials.'
      }
    ],
    'hosting-deployment': [
      {
        q: 'What makes static site hosting faster than traditional WordPress or VPS hosting?',
        a: 'Static web hosting distributes pre-compiled HTML, CSS, and media across global Content Delivery Networks (CDNs) with hundreds of edge points of presence. When a user requests a page, it is served directly from the nearest edge node in milliseconds, bypassing database queries and server-side page compilation.'
      },
      {
        q: 'Can I host my static website completely free?',
        a: 'Yes! Cloudflare Pages, GitHub Pages, Codeberg Pages, Netlify, and Vercel all offer generous free tiers that include free automated HTTPS certificates, continuous deployment from git, and unlimited or high-bandwidth allowances.'
      },
      {
        q: 'How does Continuous Deployment (CI/CD) work for static sites?',
        a: 'Whenever you push code changes to GitHub, GitLab, or Codeberg, your hosting platform detects the commit, runs your static build command (e.g. <code>npm run build</code>), and updates edge cache nodes worldwide within seconds.'
      },
      {
        q: 'Can I connect a custom domain name to free static hosting?',
        a: 'All modern static web hosts allow you to bind your custom domain (e.g. <code>example.com</code>) and automatically issue, configure, and renew free SSL/TLS certificates through Let\'s Encrypt or DigiCert.'
      }
    ],
    'content-management': [
      {
        q: 'What is a Headless or Git-based CMS for static sites?',
        a: 'A Git-based CMS (such as Decap CMS, Pages CMS, or TinaCMS) provides a friendly visual writing interface for non-technical editors while saving all articles and edits directly as Markdown, JSON, or YAML files inside your Git repository.'
      },
      {
        q: 'Do content editors need to know Git or Markdown to edit a static website?',
        a: 'No. Modern static site CMS solutions provide rich WYSIWYG editors, image uploaders, drag-and-drop components, and draft previews. The CMS converts the formatted content into clean Markdown files automatically behind the scenes.'
      },
      {
        q: 'What happens to the website when an editor publishes a blog post?',
        a: 'The CMS commits the new Markdown file directly to your repository branch. This automatically triggers your static site generator (Astro, Hugo, 11ty, etc.) to rebuild and deploy the new static page instantly via your host\'s CI/CD pipeline.'
      },
      {
        q: 'Is a Git-based CMS more secure than WordPress?',
        a: 'Significantly more secure. Because there is no central database or PHP runtime server to compromise, common vulnerabilities like SQL injection, database privilege escalation, and plugin exploits are structurally impossible.'
      }
    ],
    'analytics-privacy': [
      {
        q: 'How do privacy-focused analytics work without cookies or GDPR consent banners?',
        a: 'Privacy-first analytics tools (like Umami, Plausible, or CountAPI) generate one-way cryptographic hashes from IP addresses and user agents that reset daily. They measure page views, referrers, and device types without storing persistent cookies or collecting personally identifiable information (PII), exempting them from intrusive GDPR/CCPA cookie banners.'
      },
      {
        q: 'Do privacy analytics scripts slow down static web page loading speeds?',
        a: 'No. Traditional analytics like Google Analytics can weigh over 50 KB, whereas privacy alternatives like Umami or Plausible weigh under 2 KB, load asynchronously, and do not delay page rendering.'
      },
      {
        q: 'Can I self-host privacy analytics for my static sites?',
        a: 'Yes, tools like Umami are 100% open source and can be self-hosted for free on platforms like Railway, Supabase, or Wasmer Edge, giving you full data sovereignty.'
      },
      {
        q: 'Can I track custom events and button clicks on a static website?',
        a: 'Yes, simple HTML data attributes (e.g. <code>data-umami-event="Signup Button Click"</code>) or one-line JavaScript calls allow you to track button clicks, downloads, and form submissions with zero backend overhead.'
      }
    ],
    'comments-community': [
      {
        q: 'How do static websites display and store user comments without a server?',
        a: 'Static sites embed lightweight client-side comment widgets that connect directly to modern comment backends (such as Giscus, utterances, or Remark42). For example, Giscus leverages GitHub Discussions as its comment database, completely eliminating the need for private server infrastructure.'
      },
      {
        q: 'How is comment spam moderated on static sites?',
        a: 'When using GitHub-backed comment engines like Giscus, commenters authenticate with their existing GitHub profiles, dramatically deterring bot spam and malicious trolling. Traditional spam honeypots and moderation dashboards are also available.'
      },
      {
        q: 'Will comment widgets harm the SEO of my static blog?',
        a: 'Most comment widgets load asynchronously via an iframe or web component, ensuring your primary static content renders instantly. Many modern search engine crawlers (including Googlebot) execute client-side JavaScript and index comment conversations.'
      },
      {
        q: 'Can users write comments using Markdown and code formatting?',
        a: 'Yes! Most static comment engines feature full Markdown syntax support, syntax-highlighted code blocks, image embeds, and emoji reactions.'
      }
    ],
    'static-site-generators': [
      {
        q: 'What is a Static Site Generator (SSG)?',
        a: 'A Static Site Generator is a developer tool that ingests raw source files (like Markdown, templates, and components) during a build step and outputs a collection of pure static HTML, CSS, and JavaScript files ready to be served by any web server or CDN.'
      },
      {
        q: 'What are the main advantages of using an SSG over a traditional CMS?',
        a: 'Static websites built with SSGs boast near-instant load times, flawless security (no database to hack), near-zero hosting costs, and effortless version control using standard Git repositories.'
      },
      {
        q: 'Which SSG is best for my static web project?',
        a: 'For content-heavy blogs and docs, **Astro**, **Hugo**, and **Eleventy (11ty)** are industry leaders. For React or Vue component ecosystems, **Next.js** (static export mode) and **Nuxt** provide seamless developer experiences.'
      },
      {
        q: 'Can static websites built with an SSG have dynamic interactive features?',
        a: 'Absolutely! Modern static sites frequently integrate serverless APIs, client-side search, contact forms, user authentication, and interactive widgets (the Jamstack architecture) without sacrificing static speed.'
      }
    ]
  };

  if (faqsBySlug[catSlug]) {
    return faqsBySlug[catSlug];
  }

  // Polished contextual fallback for remaining categories
  return [
    {
      q: `How do I integrate ${catTitle.toLowerCase()} tools into a static website?`,
      a: `All tools featured in the ${catTitle} category are designed specifically for zero-backend architecture. You can integrate them directly into your static HTML pages using simple script tags, embed snippets, CDN assets, or client-side JavaScript fetch calls without configuring backend servers.`
    },
    {
      q: `Do ${catTitle.toLowerCase()} services require a dedicated database or backend?`,
      a: `No. The philosophy of StaticStack is zero backend bloat. Services in this category either run entirely client-side in the browser or manage their own scalable cloud APIs, leaving your static hosting environment completely serverless and hassle-free.`
    },
    {
      q: `Are free or open-source ${catTitle.toLowerCase()} options available?`,
      a: `Yes! StaticStack highlights open-source and free-tier options for every category. You can use the filter buttons above to instantly filter ${catTitle} tools by Open Source, Free, Freemium, or Paid pricing models.`
    },
    {
      q: `How do I keep API keys secure when using third-party static site services?`,
      a: `Most modern static web services provide public, read-only client API keys designed to be safely embedded into frontend HTML. For sensitive operations, you can route requests through edge workers (like Cloudflare Pages Functions) where secret keys remain safely hidden from the browser.`
    }
  ];
}

/**
 * Related categories mapping.
 * Suggests 4 relevant adjacent categories for continuous user exploration.
 */
function getRelatedCategories(currentSlug, allCategories) {
  const map = {
    'contact-forms': ['newsletters-email', 'authentication-users', 'surveys-feedback', 'security-spam-protection'],
    'authentication-users': ['database-storage', 'payments-ecommerce', 'contact-forms', 'security-spam-protection'],
    'hosting-deployment': ['static-site-generators', 'content-management', 'monitoring-errors', 'database-storage'],
    'content-management': ['static-site-generators', 'hosting-deployment', 'ai-content-creation', 'images-optimization'],
    'static-site-generators': ['hosting-deployment', 'content-management', 'css-components', 'interactive-scripts'],
    'analytics-privacy': ['monitoring-errors', 'search', 'security-spam-protection', 'hosting-deployment'],
    'comments-community': ['live-chat', 'authentication-users', 'contact-forms', 'surveys-feedback'],
    'ai-content-creation': ['ai-models', 'content-management', 'images-optimization', 'typography-fonts'],
    'ai-models': ['ai-content-creation', 'development-tools', 'database-storage', 'search'],
    'css-components': ['interactive-scripts', 'typography-fonts', 'static-site-generators', 'images-optimization'],
    'database-storage': ['authentication-users', 'hosting-deployment', 'payments-ecommerce', 'development-tools'],
    'development-tools': ['static-site-generators', 'hosting-deployment', 'css-components', 'monitoring-errors'],
    'images-optimization': ['media-players', 'css-components', 'hosting-deployment', 'content-management'],
    'interactive-scripts': ['css-components', 'maps-geolocation', 'media-players', 'development-tools'],
    'newsletters-email': ['contact-forms', 'authentication-users', 'surveys-feedback', 'analytics-privacy'],
    'payments-ecommerce': ['authentication-users', 'database-storage', 'contact-forms', 'security-spam-protection'],
    'search': ['analytics-privacy', 'static-site-generators', 'content-management', 'development-tools'],
    'security-spam-protection': ['contact-forms', 'authentication-users', 'analytics-privacy', 'hosting-deployment']
  };

  const targetSlugs = map[currentSlug] || [];
  const related = [];

  targetSlugs.forEach(s => {
    const found = allCategories.find(c => c.slug === s);
    if (found) related.push(found);
  });

  if (related.length < 4) {
    for (const c of allCategories) {
      if (c.slug !== currentSlug && !related.some(r => r.slug === c.slug)) {
        related.push(c);
        if (related.length >= 4) break;
      }
    }
  }

  return related.slice(0, 4);
}

/**
 * Select top 2 to 3 featured picks for this category.
 */
function getTopPicks(tools, categorySlug, cachedViewsMap, rootDir) {
  if (!tools || tools.length === 0) return [];

  // Sort candidate tools by views
  const sorted = [...tools].map(t => {
    const key = `htmlstatic-${t.categorySlug}-${t.slug}`;
    const views = Number(cachedViewsMap[key]) || 0;
    const coverPath = path.join(rootDir, 'tools', t.categorySlug, `${t.slug}-cover.webp`);
    const hasCover = fs.existsSync(coverPath);
    return {
      ...t,
      views,
      hasCover,
      coverUrl: `../../tools/${t.categorySlug}/${t.slug}-cover.webp`
    };
  }).sort((a, b) => b.views - a.views);

  const picks = [];

  // 1. Standout Choice (highest views or first tool)
  const bestOverall = sorted[0];
  if (bestOverall) {
    picks.push({
      tool: bestOverall,
      label: '★ Top Choice',
      pillClass: 'badge-free'
    });
  }

  // 2. Best Open Source Pick
  const openSourceTool = sorted.find(t => {
    if (t.slug === bestOverall.slug) return false;
    const badgesStr = [t.primaryBadge, ...(t.badges || [])].join(' ').toLowerCase();
    return badgesStr.includes('open source');
  });

  if (openSourceTool) {
    picks.push({
      tool: openSourceTool,
      label: '★ Open Source Pick',
      pillClass: 'badge-open-source'
    });
  } else if (sorted[1] && !picks.some(p => p.tool.slug === sorted[1].slug)) {
    picks.push({
      tool: sorted[1],
      label: '★ Popular Alternative',
      pillClass: 'badge-freemium'
    });
  }

  // 3. Best Free Tier / Standout 3rd Pick
  const freeTool = sorted.find(t => {
    if (picks.some(p => p.tool.slug === t.slug)) return false;
    const badgesStr = [t.primaryBadge, ...(t.badges || [])].join(' ').toLowerCase();
    return badgesStr.includes('free');
  });

  if (freeTool && picks.length < 3) {
    picks.push({
      tool: freeTool,
      label: '★ Free Tier Available',
      pillClass: 'badge-freemium'
    });
  } else if (sorted[2] && picks.length < 3 && !picks.some(p => p.tool.slug === sorted[2].slug)) {
    picks.push({
      tool: sorted[2],
      label: '★ Community Recommended',
      pillClass: 'badge-freemium'
    });
  }

  return picks;
}

/**
 * Main Category Page Renderer.
 */
function renderCategoryPage({
  category,
  allCategories,
  rootDir,
  renderLayout,
  getToolSiteIcon,
  cachedViewsMap = {}
}) {
  const tools = category.tools || [];
  const categoryIconSvg = CATEGORY_ICONS[category.slug] || ICONS.zap;

  // Counts for breakdown badges
  let openSourceCount = 0;
  let freeCount = 0;
  let freemiumCount = 0;
  let paidCount = 0;

  tools.forEach(t => {
    const badgeText = [t.primaryBadge, ...(t.badges || [])].join(' ').toLowerCase();
    if (badgeText.includes('open source')) openSourceCount++;
    if (badgeText.includes('free') && !badgeText.includes('freemium')) freeCount++;
    if (badgeText.includes('freemium')) freemiumCount++;
    if (badgeText.includes('paid')) paidCount++;
  });

  const faqs = getCategoryFaqs(category);
  const relatedCategories = getRelatedCategories(category.slug, allCategories);
  const topPicks = getTopPicks(tools, category.slug, cachedViewsMap, rootDir);

  const pageTitle = `${category.title} Tools & Services for Static Sites | StaticStack`;
  const pageDescription = `Discover ${tools.length} curated ${category.title} tools, services, and APIs for static websites with zero backend servers. Compare features, pricing, and live community stats.`;
  const canonicalUrl = `https://www.staticstack.app/category/${category.slug}/`;

  // Determine OG image (use top pick cover image if exists)
  let ogImage = 'https://www.staticstack.app/asset/img/og-archive.webp';
  if (topPicks.length > 0 && topPicks[0].tool.hasCover) {
    ogImage = `https://www.staticstack.app/tools/${topPicks[0].tool.categorySlug}/${topPicks[0].tool.slug}-cover.webp`;
  }

  // Rich JSON-LD Schemas (CollectionPage + BreadcrumbList + FAQPage)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${category.title} Tools & Services for Static Sites`,
        url: canonicalUrl,
        description: pageDescription,
        isPartOf: {
          '@type': 'WebSite',
          name: 'StaticStack',
          url: 'https://www.staticstack.app/'
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: tools.length,
          itemListElement: tools.map((t, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: t.name,
            url: `https://www.staticstack.app/tools/${t.categorySlug}/${t.slug}`
          }))
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.staticstack.app/' },
          { '@type': 'ListItem', position: 2, name: 'Archive', item: 'https://www.staticstack.app/archive' },
          { '@type': 'ListItem', position: 3, name: category.title, item: canonicalUrl }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.q.replace(/<[^>]*>/g, ''),
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a.replace(/<[^>]*>/g, '')
          }
        }))
      }
    ]
  };

  // Mini-Hero Header Configuration
  const miniHero = {
    breadcrumbs: [
      { label: 'Home', url: '../../' },
      { label: 'Archive', url: '../../archive' },
      { label: category.title, url: '#' }
    ],
    badgeRow: `
      <span class="badge badge-freemium">
        ${ICONS.compass} ${tools.length} Curated Tools
      </span>
      ${openSourceCount > 0 ? `<span class="badge badge-open-source">${ICONS.branch} ${openSourceCount} Open Source</span>` : ''}
      ${(freeCount + freemiumCount) > 0 ? `<span class="badge badge-free">${ICONS.check} Free Tiers Available</span>` : ''}
    `,
    icon: categoryIconSvg,
    title: escapeHtml(category.title),
    subtext: escapeHtml(category.description),
    actions: `
      <a href="../../submit" class="btn btn-primary" style="font-size:0.875rem; padding:0.55rem 1rem;">
        ${ICONS.plusCircle} Submit Tool
      </a>
      <a href="../../archive#${category.slug}" class="btn btn-secondary" style="font-size:0.875rem; padding:0.55rem 1rem;">
        ${ICONS.compass} View in Archive Table
      </a>
      <a href="../../community/" class="btn btn-secondary" style="font-size:0.875rem; padding:0.55rem 1rem;">
        ${ICONS.messageSquare} Community Discuss
      </a>
    `
  };

  // Top Picks Cards HTML
  const topPicksHtml = topPicks.map(p => {
    const t = p.tool;
    const key = `htmlstatic-${t.categorySlug}-${t.slug}`;
    const views = Number(cachedViewsMap[key]) || 0;

    let primaryBadgeClass = 'badge-freemium';
    const lb = (t.primaryBadge || '').toLowerCase();
    if (lb.includes('open source')) primaryBadgeClass = 'badge-open-source';
    else if (lb.includes('free')) primaryBadgeClass = 'badge-free';
    else if (lb.includes('paid')) primaryBadgeClass = 'badge-paid';

    const coverHtml = t.hasCover ? `
      <img src="${t.coverUrl}" alt="${escapeHtml(t.name)} preview" width="640" height="360" loading="lazy" decoding="async">
    ` : `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem; color:var(--accent);">
        <div style="width:48px; height:48px; border-radius:var(--radius-md); background:var(--accent-light); display:flex; align-items:center; justify-content:center;">
          ${getToolSiteIcon(t, 28)}
        </div>
        <span style="font-size:0.85rem; font-weight:600; color:var(--text-main);">${escapeHtml(t.name)}</span>
      </div>
    `;

    return `
      <div class="cat-hub-pick-card">
        <div class="cat-hub-pick-cover">
          ${coverHtml}
          <span class="cat-hub-pick-badge ${p.pillClass}">${p.label}</span>
        </div>
        <div class="cat-hub-pick-body">
          <div class="cat-hub-pick-header">
            <div class="cat-hub-pick-title-wrap">
              <span style="display:inline-flex; align-items:center;">${getToolSiteIcon(t, 22)}</span>
              <h3 class="cat-hub-pick-title">${escapeHtml(t.name)}</h3>
            </div>
            <span class="badge ${primaryBadgeClass}" style="font-size:0.7rem; padding:0.15rem 0.5rem;">${escapeHtml(t.primaryBadge)}</span>
          </div>
          <p class="cat-hub-pick-desc">${escapeHtml(t.tagline || t.description)}</p>
          <div class="cat-hub-pick-footer">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <span class="home-stat-pill" title="Total Views">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span class="cat-tool-views-num" data-key="${key}">${views}</span>
              </span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <a href="../../tools/${t.categorySlug}/${t.slug}" class="btn btn-secondary btn-sm" style="font-size:0.8rem; padding:0.4rem 0.75rem;">
                Guide &amp; Docs
              </a>
              <a href="${t.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-size:0.8rem; padding:0.4rem 0.75rem;">
                Visit Site &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // All Tools Cards Grid HTML
  const toolsCardsHtml = tools.map(t => {
    const key = `htmlstatic-${t.categorySlug}-${t.slug}`;
    const views = Number(cachedViewsMap[key]) || 0;

    const badgesList = (t.badges && t.badges.length > 0) ? t.badges : [t.primaryBadge];
    const badgesHtml = badgesList.map(b => {
      const lb = (b || '').toLowerCase();
      let bClass = 'badge-freemium';
      if (lb.includes('open source')) bClass = 'badge-open-source';
      else if (lb.includes('beta')) bClass = 'badge-beta';
      else if (lb.includes('freemium')) bClass = 'badge-freemium';
      else if (lb.includes('free')) bClass = 'badge-free';
      else if (lb.includes('paid')) bClass = 'badge-paid';
      return `<span class="badge ${bClass}" style="font-size:0.675rem; padding:0.12rem 0.45rem;">${escapeHtml(b)}</span>`;
    }).join(' ');

    const tagsList = (t.tags || []).slice(0, 3);
    const tagsHtml = tagsList.map(tag => `<span class="cat-hub-tag-pill">#${escapeHtml(tag)}</span>`).join('');

    const searchBlob = [
      t.name,
      t.slug,
      t.description,
      t.tagline || '',
      badgesList.join(' '),
      tagsList.join(' '),
      t.websiteLabel || ''
    ].join(' ').toLowerCase();

    return `
      <div class="cat-hub-card" data-tool-card data-search="${escapeHtml(searchBlob)}" data-pricing="${escapeHtml(badgesList.join(' ').toLowerCase())}">
        <div class="cat-hub-card-head">
          <div class="cat-hub-card-title-wrap">
            <span style="display:inline-flex; align-items:center;">${getToolSiteIcon(t, 20)}</span>
            <h3 class="cat-hub-card-title">
              <a href="../../tools/${t.categorySlug}/${t.slug}">${escapeHtml(t.name)}</a>
            </h3>
          </div>
          <div style="display:flex; gap:0.25rem; flex-wrap:wrap; justify-content:flex-end;">
            ${badgesHtml}
          </div>
        </div>
        <p class="cat-hub-card-desc">${escapeHtml(t.description)}</p>
        ${tagsHtml ? `<div class="cat-hub-card-tags">${tagsHtml}</div>` : ''}
        <div class="cat-hub-card-foot">
          <span class="home-stat-pill" title="Total Views">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span class="cat-tool-views-num" data-key="${key}">${views}</span>
          </span>
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <a href="../../tools/${t.categorySlug}/${t.slug}" class="btn btn-secondary btn-sm" style="font-size:0.775rem; padding:0.35rem 0.65rem;">
              Docs
            </a>
            <a href="${t.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size:0.775rem; padding:0.35rem 0.65rem;" title="Visit ${escapeHtml(t.name)} official website">
              Visit ${ICONS.external}
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // FAQs HTML
  const faqsHtml = faqs.map(faq => `
    <details class="cat-hub-faq-item">
      <summary class="cat-hub-faq-summary">
        <span>${faq.q}</span>
        <span class="cat-hub-faq-chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </span>
      </summary>
      <div class="cat-hub-faq-content">
        <p>${faq.a}</p>
      </div>
    </details>
  `).join('');

  // Related Categories Cards HTML
  const relatedCategoriesHtml = relatedCategories.map(rc => `
    <a href="../../category/${rc.slug}/" class="cat-hub-related-card" title="Explore ${escapeHtml(rc.title)}">
      <div class="cat-hub-related-icon">
        ${CATEGORY_ICONS[rc.slug] || ICONS.zap}
      </div>
      <div class="cat-hub-related-info">
        <span class="cat-hub-related-title">${escapeHtml(rc.title)}</span>
        <span class="cat-hub-related-count">${rc.tools.length} Tools &rarr;</span>
      </div>
    </a>
  `).join('');

  // Page Body Content
  const content = `
  <div class="cat-hub-layout">
    <div class="container">

      ${topPicks.length > 0 ? `
      <!-- Featured / Top Picks Section -->
      <section class="cat-hub-section" style="margin-top: 1.5rem;">
        <div class="cat-hub-section-head">
          <div class="cat-hub-section-title-wrap">
            <h2 class="cat-hub-section-title">
              <span style="color:var(--accent); display:inline-flex;">${ICONS.star}</span>
              Featured &amp; Top Picks
            </h2>
            <p class="cat-hub-section-desc">Highest-rated, open-source, and standout ${escapeHtml(category.title)} tools curated by the community.</p>
          </div>
          <a href="#all-tools" class="btn btn-secondary btn-sm" style="font-size:0.8rem;">Browse All ${tools.length} Tools &darr;</a>
        </div>
        <div class="cat-hub-picks-grid">
          ${topPicksHtml}
        </div>
      </section>
      ` : ''}

      <!-- Complete Directory Section with Live Filter -->
      <section class="cat-hub-section" id="all-tools">
        <div class="cat-hub-section-head">
          <div class="cat-hub-section-title-wrap">
            <h2 class="cat-hub-section-title">
              <span style="color:var(--accent); display:inline-flex;">${ICONS.grid}</span>
              All ${escapeHtml(category.title)} Tools (${tools.length})
            </h2>
            <p class="cat-hub-section-desc">Explore, search, and filter zero-backend services and developer APIs.</p>
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600;" id="cat-tool-counter">
            Showing all ${tools.length} tools
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="cat-hub-toolbar">
          <div class="cat-hub-search-wrap">
            <div class="search-box-pill search-box-pill-compact">
              <span class="search-icon">${ICONS.search}</span>
              <input type="text" id="cat-search-input" placeholder="Search ${escapeHtml(category.title)} by name, feature, or #tag..." autocomplete="off">
              <span class="search-kbd">/</span>
              <button type="button" id="cat-search-btn" class="btn btn-primary search-btn">Search</button>
            </div>
          </div>
          <div class="cat-hub-filter-pills">
            <button type="button" class="cat-hub-filter-pill active" data-pricing-filter="all">All (${tools.length})</button>
            ${openSourceCount > 0 ? `<button type="button" class="cat-hub-filter-pill" data-pricing-filter="open-source">Open Source (${openSourceCount})</button>` : ''}
            ${freeCount > 0 ? `<button type="button" class="cat-hub-filter-pill" data-pricing-filter="free">Free (${freeCount})</button>` : ''}
            ${freemiumCount > 0 ? `<button type="button" class="cat-hub-filter-pill" data-pricing-filter="freemium">Freemium (${freemiumCount})</button>` : ''}
            ${paidCount > 0 ? `<button type="button" class="cat-hub-filter-pill" data-pricing-filter="paid">Paid (${paidCount})</button>` : ''}
          </div>
        </div>

        <!-- Empty State for 0 Results -->
        <div id="cat-no-results" style="display:none; text-align:center; padding:3rem 1.5rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); margin-bottom:2rem; box-shadow:var(--shadow-card);">
          <div style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-main);">No matching tools found</div>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.25rem;">Try adjusting your keyword or reset filters to explore all tools in this category.</p>
          <button type="button" class="btn btn-primary btn-sm" id="cat-reset-btn">Reset Filters</button>
        </div>

        <!-- Grid of Tool Cards -->
        <div class="cat-hub-grid" id="cat-tools-grid">
          ${toolsCardsHtml}
        </div>
      </section>

      <!-- Category FAQ & Developer Guide Section -->
      <section class="cat-hub-section">
        <div class="cat-hub-section-head">
          <div class="cat-hub-section-title-wrap">
            <h2 class="cat-hub-section-title">
              <span style="color:var(--accent); display:inline-flex;">${ICONS.helpCircle}</span>
              ${escapeHtml(category.title)} Developer FAQ
            </h2>
            <p class="cat-hub-section-desc">Common architecture questions, security guidelines, and implementation tips for static websites.</p>
          </div>
        </div>
        <div class="cat-hub-faq-list">
          ${faqsHtml}
        </div>
      </section>

      <!-- Explore Related Categories Section -->
      <section class="cat-hub-section">
        <div class="cat-hub-section-head">
          <div class="cat-hub-section-title-wrap">
            <h2 class="cat-hub-section-title">
              <span style="color:var(--accent); display:inline-flex;">${ICONS.compass}</span>
              Explore Related Categories
            </h2>
            <p class="cat-hub-section-desc">Complementary tools and services to expand your static web architecture.</p>
          </div>
          <a href="../../archive" class="btn btn-secondary btn-sm" style="font-size:0.8rem;">View All 27 Categories &rarr;</a>
        </div>
        <div class="cat-hub-related-grid">
          ${relatedCategoriesHtml}
        </div>
      </section>

      <!-- Community Callout Card -->
      <section class="cat-hub-section" style="margin-bottom:0;">
        <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-card); display:flex; align-items:center; justify-content:space-between; gap:1.5rem; flex-wrap:wrap;">
          <div style="flex:1 1 320px;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
              <span style="color:var(--accent); display:inline-flex;">${ICONS.messageSquare}</span>
              <strong style="font-size:1.1rem; color:var(--text-main);">Have questions about ${escapeHtml(category.title)}?</strong>
            </div>
            <p style="font-size:0.875rem; color:var(--text-muted); line-height:1.55; margin:0;">
              Connect with fellow developers in the StaticStack Community. Share code snippets, ask implementation questions, and showcase your static projects.
            </p>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
            <a href="../../community/" class="btn btn-primary" style="font-size:0.875rem; padding:0.6rem 1.15rem;">
              Join Discussion &rarr;
            </a>
            <a href="../../submit" class="btn btn-secondary" style="font-size:0.875rem; padding:0.6rem 1.15rem;">
              Suggest a Tool
            </a>
          </div>
        </div>
      </section>

    </div>
  </div>

  <!-- Client-Side Real-Time Filter Script -->
  <script>
    (function() {
      const searchInput = document.getElementById('cat-search-input');
      const filterPills = document.querySelectorAll('[data-pricing-filter]');
      const toolCards = document.querySelectorAll('[data-tool-card]');
      const counterEl = document.getElementById('cat-tool-counter');
      const noResultsEl = document.getElementById('cat-no-results');
      const resetBtn = document.getElementById('cat-reset-btn');
      const totalTools = toolCards.length;

      let currentPricing = 'all';
      let currentQuery = '';

      function applyFilter() {
        let visibleCount = 0;
        const q = currentQuery.trim().toLowerCase();
        const terms = q.split(/\\s+/).filter(Boolean);

        toolCards.forEach(card => {
          const searchData = (card.getAttribute('data-search') || '').toLowerCase();
          const pricingData = (card.getAttribute('data-pricing') || '').toLowerCase();

          const matchesQuery = terms.length === 0 || terms.every(t => searchData.includes(t));
          let matchesPricing = true;
          if (currentPricing !== 'all') {
            const pricingTarget = currentPricing.replace('-', ' ');
            matchesPricing = pricingData.includes(pricingTarget);
          }

          if (matchesQuery && matchesPricing) {
            card.style.display = '';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (noResultsEl) {
          noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        if (counterEl) {
          if (q || currentPricing !== 'all') {
            counterEl.textContent = 'Showing ' + visibleCount + ' of ' + totalTools + ' tools';
          } else {
            counterEl.textContent = 'Showing all ' + totalTools + ' tools';
          }
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', e => {
          currentQuery = e.target.value;
          applyFilter();
        });
      }

      const searchBtn = document.getElementById('cat-search-btn');
      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          applyFilter();
          if (searchInput) searchInput.focus();
        });
      }

      document.addEventListener('keydown', e => {
        if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInput) {
          e.preventDefault();
          if (searchInput) searchInput.focus();
        }
      });

      filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
          filterPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentPricing = pill.getAttribute('data-pricing-filter') || 'all';
          applyFilter();
        });
      });

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          currentQuery = '';
          currentPricing = 'all';
          filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-pricing-filter') === 'all'));
          applyFilter();
        });
      }
    })();
  </script>
  `;

  return renderLayout({
    title: pageTitle,
    description: pageDescription,
    currentNav: 'archive',
    rootPath: '../../',
    canonicalUrl,
    ogImage,
    jsonLd,
    miniHero,
    content
  });
}

module.exports = {
  renderCategoryPage,
  getCategoryFaqs,
  getRelatedCategories,
  getTopPicks
};

