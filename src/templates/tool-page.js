// ==========================================================================
// Tool Detail Page Template (`tools/<category>/<slug>.html`)
// ==========================================================================

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { ICONS, CATEGORY_ICONS, escapeHtml } = require('../data/icons');
const { renderSidebarDonationWidget } = require('./sidebar-donation');

let linkHealthCache = null;
function getLinkHealthMap(rootDir) {
  if (linkHealthCache) return linkHealthCache;
  const healthPath = path.join(rootDir, 'asset', 'json', 'link-health.json');
  try {
    if (fs.existsSync(healthPath)) {
      linkHealthCache = JSON.parse(fs.readFileSync(healthPath, 'utf8'));
    }
  } catch {}
  if (!linkHealthCache) linkHealthCache = {};
  return linkHealthCache;
}

function renderToolPage({
  tool,
  rootDir,
  renderLayout,
  getRandomTools,
  getToolSiteIcon,
  cachedViewsMap,
  cachedLikesMap
}) {
  const toolKey = `htmlstatic-${tool.categorySlug}-${tool.slug}`;
  const initialViews = (cachedViewsMap && cachedViewsMap[toolKey] !== undefined)
    ? Number(cachedViewsMap[toolKey])
    : 0;
  const toolSlugPath = `/tools/${tool.categorySlug}/${tool.slug}`;
  const initialLikes = (cachedLikesMap && cachedLikesMap[toolSlugPath] !== undefined)
    ? Number(cachedLikesMap[toolSlugPath])
    : 0;
  let cleanMd = tool.rawMd || `# ${tool.name}\n\n> ${tool.description}\n\n- **Website**: ${tool.websiteUrl}`;
  // Strip trailing markdown navigation links
  cleanMd = cleanMd.replace(/\n+---\s*\n+\[.*?Back to[\s\S]*$/i, '').trimEnd();
  // Strip tags from markdown body so they render in dedicated interactive section above Discussion
  cleanMd = cleanMd.replace(/\n\s*(?:[-*]|\d+\.)\s*\*\*(?:Tags|Keywords|Tags\s*[\/&]\s*Keywords)\*\*:[^\n\r]+/gi, '');
  cleanMd = cleanMd.replace(/\n+---\s*\n+##\s+(?:Tags|Keywords|Tags\s*[\/&]\s*Keywords)\b[\s\S]*?(?=\n+---|\n+##|$)/gi, '');

  // Render markdown with relative link rewriting
  let parsedHtml = marked.parse(cleanMd);
  parsedHtml = parsedHtml
    .replace(/href="(?:\.\.\/)+README\.md#([^"]+)"/g, 'href="../../archive#$1"')
    .replace(/href="(?:\.\.\/)+README\.md"/g, 'href="../../archive"')
    .replace(/href="(?:\.\.\/)+(?:tools\/)?([a-z0-9\-]+)\/([a-z0-9\-]+)\.md"/g, 'href="../../tools/$1/$2"')
    .replace(/href="([a-z0-9\-]+)\.md"/g, 'href="../../tools/' + tool.categorySlug + '/$1"');

  // Inject Option 1: Minimal Glowing Status Dot next to Official Website link
  const healthMap = getLinkHealthMap(rootDir);
  const health = healthMap[tool.slug] || { status: 'online', code: 200, checked_at: new Date().toISOString().split('T')[0] };
  const isOnline = health.status !== 'offline';
  const statusTitle = isOnline
    ? `Website verified: Live (HTTP ${health.code || 200}) • Checked ${health.checked_at || 'recently'}`
    : `Website status warning: Unreachable (${health.error || health.code || 'Offline'}) • Checked ${health.checked_at || 'recently'}`;
  const dotClass = isOnline ? 'status-online' : 'status-offline';
  const statusDotHtml = `<span class="link-status-dot ${dotClass}" title="${escapeHtml(statusTitle)}" aria-label="${escapeHtml(statusTitle)}"></span>`;

  parsedHtml = parsedHtml.replace(
    /(<li>\s*<strong>Official Website<\/strong>:\s*<a\s+[^>]*>[^<]+<\/a>)(\s*<\/li>)/i,
    `$1 ${statusDotHtml}$2`
  );

  const coverRelativeName = `${tool.slug}-cover.webp`;
  const coverDiskPath = path.join(rootDir, 'tools', tool.categorySlug, coverRelativeName);
  let coverImageHtml = '';
  const hasEmbeddedVideo = cleanMd.includes('video-container') || cleanMd.includes('<iframe');
  if (fs.existsSync(coverDiskPath) && !hasEmbeddedVideo) {
    coverImageHtml = `
          <div class="tool-cover-banner" style="margin-bottom:1.5rem; border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--border-color); box-shadow:var(--shadow-card); background:var(--bg-surface);">
            <img src="${coverRelativeName}" 
                 alt="${escapeHtml(tool.name)} Screenshot Preview" 
                 width="1280" 
                 height="720" 
                 loading="eager" 
                 fetchpriority="high" 
                 decoding="async" 
                 style="width:100%; height:auto; aspect-ratio:16/9; object-fit:cover; display:block;">
          </div>
    `;
  }

  const randomTools = getRandomTools(tool.slug, 4);
  const randomToolsHtml = randomTools.map(rt => {
    let rtBadgeClass = 'badge-freemium';
    const rtPBadge = rt.primaryBadge.toLowerCase();
    if (rtPBadge.includes('open source')) {
      rtBadgeClass = 'badge-open-source';
    } else if (rtPBadge.includes('freemium')) {
      rtBadgeClass = 'badge-freemium';
    } else if (rtPBadge.includes('free')) {
      rtBadgeClass = 'badge-free';
    } else if (rtPBadge.includes('paid')) {
      rtBadgeClass = 'badge-paid';
    }

    return `
      <a href="../../tools/${rt.categorySlug}/${rt.slug}" class="sidebar-tool-card">
        <span class="sidebar-tool-icon" style="display:inline-flex; align-items:center; justify-content:center;">
          ${getToolSiteIcon(rt, 20)}
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

  let toolTagsHtml = '';
  if (tool.tags && tool.tags.length > 0) {
    const pills = tool.tags.map(t => {
      const cleanTag = escapeHtml(t);
      return `<a href="/search?q=${encodeURIComponent(t)}" class="tool-tag-pill" title="Search tools tagged #${cleanTag}">#${cleanTag}</a>`;
    }).join('');

    toolTagsHtml = `
            <!-- Tool Tags / Keywords (Above Discussion) -->
            <div class="tool-tags-section">
              <span class="tool-tags-label">${ICONS.tag} Tags</span>
              <div class="tool-tags-list">
                ${pills}
              </div>
            </div>
    `;
  }

  let toolTitle = `${tool.name} - ${tool.categoryTitle} | StaticStack`;
  if (toolTitle.length > 60) {
    toolTitle = `${tool.name} - Static Web Tool & Guide | StaticStack`;
  }
  if (toolTitle.length > 60) {
    toolTitle = `${tool.name} - Static Website Tool | StaticStack`;
  }
  if (toolTitle.length > 60) {
    toolTitle = `${tool.name} | StaticStack`;
  }

  let toolDesc = `${tool.name}: ${tool.description}. Guide, integration examples, and features for static websites.`;
  if (toolDesc.length > 160) {
    toolDesc = `${tool.name}: ${tool.description}. Static website integration guide and features.`;
  }
  if (toolDesc.length > 160) {
    toolDesc = `${tool.name}: ${tool.description}.`;
  }
  if (toolDesc.length > 160) {
    toolDesc = toolDesc.slice(0, 157).replace(/\s+\S*$/, '') + '...';
  }

  const toolKeywordsList = Array.from(new Set([
    tool.name,
    tool.categoryTitle,
    ...(tool.tags || []).map(t => t.replace(/-/g, ' ')),
    ...(tool.tags || []),
    `${tool.name} static website`,
    `${tool.name} alternative`,
    `${tool.name} integration`,
    'static site tool',
    'jamstack',
    'zero backend'
  ]));
  const toolKeywordsStr = toolKeywordsList.join(', ');
  const isFreeOffer = /free|open source|freemium/i.test(tool.primaryBadge || '');
  const toolCanonical = `https://www.staticstack.app/tools/${tool.categorySlug}/${tool.slug}`;
  const toolOgImg = coverImageHtml
    ? `https://www.staticstack.app/tools/${tool.categorySlug}/${coverRelativeName}`
    : 'https://www.staticstack.app/asset/img/og-image.webp';

  const toolJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url: toolCanonical,
        sameAs: tool.websiteUrl,
        image: toolOgImg,
        applicationCategory: tool.categoryTitle,
        operatingSystem: 'Web, Static HTML, Jamstack',
        keywords: toolKeywordsStr,
        offers: {
          '@type': 'Offer',
          price: isFreeOffer ? '0' : undefined,
          priceCurrency: isFreeOffer ? 'USD' : undefined,
          category: tool.primaryBadge || 'Free'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.staticstack.app/' },
          { '@type': 'ListItem', position: 2, name: 'Archive', item: 'https://www.staticstack.app/archive' },
          { '@type': 'ListItem', position: 3, name: tool.categoryTitle, item: `https://www.staticstack.app/category/${tool.categorySlug}/` },
          { '@type': 'ListItem', position: 4, name: tool.name, item: toolCanonical }
        ]
      }
    ]
  };

  return renderLayout({
    title: toolTitle,
    description: toolDesc,
    keywords: toolKeywordsStr,
    jsonLd: toolJsonLd,
    currentNav: 'archive',
    canonicalUrl: toolCanonical,
    ...(coverImageHtml ? {
      ogImage: toolOgImg,
      ogImageWidth: 1280,
      ogImageHeight: 720
    } : {}),
    miniHero: {
      breadcrumbs: [
        { label: 'Home', url: '../../' },
        { label: 'Archive', url: '../../archive' },
        { label: tool.categoryTitle, url: `../../category/${tool.categorySlug}/` },
        { label: tool.name, url: '#' }
      ],
      badgeRow: `
        ${(tool.badges && tool.badges.length > 0 ? tool.badges : [tool.primaryBadge]).map(b => {
          const lb = (b || '').toLowerCase();
          let bClass = 'badge-freemium';
          let bIcon = ICONS.star;
          if (lb.includes('open source')) {
            bClass = 'badge-open-source';
            bIcon = ICONS.branch;
          } else if (lb.includes('beta')) {
            bClass = 'badge-beta';
            bIcon = ICONS.zap;
          } else if (lb.includes('freemium')) {
            bClass = 'badge-freemium';
            bIcon = ICONS.star;
          } else if (lb.includes('free')) {
            bClass = 'badge-free';
            bIcon = ICONS.check;
          } else if (lb.includes('paid')) {
            bClass = 'badge-paid';
            bIcon = ICONS.tag;
          }
          return `<span class="badge ${bClass}">${bIcon} ${escapeHtml(b)}</span>`;
        }).join('\n        ')}
        <a href="../../category/${tool.categorySlug}/" class="badge badge-freemium" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem;" title="Explore all ${escapeHtml(tool.categoryTitle)} tools">
          <span style="display:inline-flex; align-items:center;">${CATEGORY_ICONS[tool.categorySlug] || ICONS.zap}</span>
          ${escapeHtml(tool.categoryTitle)}
        </a>
      `,
      icon: getToolSiteIcon(tool, 26),
      title: escapeHtml(tool.name),
      subtext: escapeHtml(tool.tagline || tool.description),
      actions: `
        <button type="button" class="iine-button" data-icon="thumbs_up" data-slug="/tools/${tool.categorySlug}/${tool.slug}" aria-label="Upvote ${escapeHtml(tool.name)}" title="Send appreciation for ${escapeHtml(tool.name)}">
          <span class="icon">${ICONS.thumbsUp}</span>
          <span class="counter">${initialLikes}</span>
        </button>
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
            <a href="../../archive#${tool.categorySlug}">${escapeHtml(tool.categoryTitle)}</a>
          </div>
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <span style="color:var(--text-subtle); display:inline-flex;">${ICONS.eye}</span>
            <strong>Views:</strong>
            <span id="tool-view-count" class="tool-view-count" data-key="${toolKey}" style="font-weight:600; color:var(--text-main); font-variant-numeric:tabular-nums;">${initialViews.toLocaleString()}</span>
          </div>
          <div class="mini-hero-extra-edit" style="margin-left:auto;">
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
          ${coverImageHtml}
          <article style="padding: 0 0 2rem;">
            <!-- Rendered Documentation -->
            <div class="markdown-body">
              ${parsedHtml}
            </div>

            ${toolTagsHtml}

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

            <!-- Tool View Counter: Only counts new unique visitors -->
            <script>
              (function() {
                const countEl = document.getElementById('tool-view-count');
                if (!countEl) return;
                const key = countEl.getAttribute('data-key');
                if (!key) return;

                const viewedKey = 'hs_viewed_' + key;
                let alreadyViewed = false;
                try {
                  alreadyViewed = !!localStorage.getItem(viewedKey) || (document.cookie.indexOf(viewedKey + '=1') !== -1);
                } catch (e) {}

                // If this is a new viewer, mark immediately in localStorage & cookie so reloads never double-count
                if (!alreadyViewed) {
                  try {
                    localStorage.setItem(viewedKey, '1');
                    document.cookie = viewedKey + '=1; path=/; max-age=315360000; SameSite=Lax';
                  } catch (e) {}
                }

                function updateDisplay(val) {
                  const num = Number(val);
                  if (!isNaN(num) && num >= 0) {
                    countEl.textContent = num.toLocaleString();
                  }
                }

                // Call StaticStack API (hit=1 ONLY if this is a brand new user viewing for the first time)
                const apiParam = alreadyViewed ? '&hit=0' : '&hit=1';
                fetch('/community/api?action=tool-view&key=' + encodeURIComponent(key) + apiParam)
                  .then(function(res) {
                    if (!res.ok) throw new Error('API error');
                    return res.json();
                  })
                  .then(function(data) {
                    if (data && data.value !== undefined) {
                      updateDisplay(data.value);
                    }
                  })
                  .catch(function() {
                    // Fallback to local views cache if community API is unreachable
                    fetch('/asset/json/tool-views-cache.json')
                      .then(function(res) { return res.ok ? res.json() : null; })
                      .then(function(data) {
                        if (data && data[key] !== undefined) {
                          updateDisplay(data[key]);
                        } else if (countEl.textContent === '--') {
                          countEl.textContent = '0';
                        }
                      })
                      .catch(function() {
                        if (countEl.textContent === '--') {
                          countEl.textContent = '0';
                        }
                      });
                  });
              })();
            </script>

            <!-- Bottom Navigation -->
            <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap; padding-top:2rem; border-top:1px solid var(--border-color);">
              <a href="../../archive#${tool.categorySlug}" class="btn btn-secondary">
                ${ICONS.arrowLeft} Back to ${escapeHtml(tool.categoryTitle)}
              </a>
              <a href="../../archive" class="btn btn-secondary">
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
                <span class="sidebar-tip-icon">${ICONS.tag}</span>
                <div>
                  <strong style="color:var(--text-main); font-size:0.825rem; display:block;">Pricing &amp; License Structure</strong>
                  <div style="font-size:0.8rem; line-height:1.45; margin-top:0.35rem; display:flex; flex-direction:column; gap:0.35rem;">
                    <div><span class="badge badge-free" style="font-size:0.65rem; padding:0.1rem 0.35rem; margin-right:0.3rem;">Free</span> 100% free with no payment required.</div>
                    <div><span class="badge badge-freemium" style="font-size:0.65rem; padding:0.1rem 0.35rem; margin-right:0.3rem;">Freemium</span> Free tier exists with paid plans/credits.</div>
                    <div><span class="badge badge-paid" style="font-size:0.65rem; padding:0.1rem 0.35rem; margin-right:0.3rem;">Paid</span> Commercial only; no permanent free tier.</div>
                    <div><span class="badge badge-open-source" style="font-size:0.65rem; padding:0.1rem 0.35rem; margin-right:0.3rem;">Open Source</span> Public code with verified license (MIT, Apache, etc.).</div>
                    <div><span class="badge badge-free" style="font-size:0.65rem; padding:0.1rem 0.35rem; margin-right:0.3rem;">Free / Open Source</span> Free platform with open-source foundation.</div>
                  </div>
                </div>
              </div>
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
              <a href="../../archive" style="font-size:0.75rem; color:var(--accent); font-weight:600; text-decoration:none;">View All &rarr;</a>
            </div>
            <div class="sidebar-widget-body" style="display:flex; flex-direction:column; gap:0.4rem;">
              ${randomToolsHtml}
            </div>
          </div>

          ${renderSidebarDonationWidget()}

          <!-- Submit Alternative Card -->
          <div class="sidebar-widget" style="background:var(--bg-muted); border-style:dashed;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
              <span style="color:var(--accent); display:inline-flex;">${ICONS.plusCircle}</span>
              <strong style="font-size:0.875rem; color:var(--text-main);">Know a Great Tool?</strong>
            </div>
            <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin-bottom:0.85rem;">
              StaticStack is community curated. Share your favorite static web service or tool with the community.
            </p>
            <a href="../../submit" class="btn btn-secondary" style="width:100%; font-size:0.825rem; padding:0.5rem 0.75rem;">
              Submit a Tool &rarr;
            </a>
          </div>

          <!-- Facebook Community Group Card -->
          <div class="sidebar-widget">
            <div class="sidebar-widget-header">
              <span style="color:#1877f2; display:inline-flex; align-items:center;">${ICONS.facebook}</span>
              <h4 class="sidebar-widget-title">Facebook Community</h4>
            </div>
            <p style="font-size:0.825rem; color:var(--text-muted); line-height:1.5; margin-bottom:0.9rem;">
              Connect with fellow static site developers, discuss tools, and share projects in the Dynamic Websites and official StaticStack Facebook Groups.
            </p>
            <a href="https://www.facebook.com/groups/dynamicwebsites" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width:100%; font-size:0.85rem; padding:0.55rem 0.85rem; display:inline-flex; align-items:center; justify-content:center; gap:0.5rem;">
              <span style="color:#1877f2; display:inline-flex;">${ICONS.facebook}</span>
              <span>Dynamic Websites Group</span>
              ${ICONS.external}
            </a>
            <a href="https://www.facebook.com/groups/staticshark" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="width:100%; font-size:0.85rem; padding:0.55rem 0.85rem; display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; margin-top:0.5rem;">
              <span style="color:#1877f2; display:inline-flex;">${ICONS.facebook}</span>
              <span>StaticStack Official Group</span>
              ${ICONS.external}
            </a>
          </div>
        </aside>
      </div>
    `
  });
}

module.exports = {
  renderToolPage
};

