/**
 * StaticStack - High-Performance Client-Side Search Engine
 * Zero backend required. Fast instant autocomplete, global Command+K modal,
 * and dedicated card search with smart relevance scoring.
 */

(function () {
  'use strict';

  let searchIndex = null;
  let isLoading = false;
  const loadListeners = [];

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Preload / fetch search-data.json with memoization
  function getSearchIndex(callback) {
    if (searchIndex) {
      if (callback) callback(searchIndex);
      return;
    }
    if (callback) loadListeners.push(callback);
    if (isLoading) return;

    isLoading = true;
    fetch('/asset/json/search-data.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load search-data.json: ' + r.status);
        return r.json();
      })
      .then(data => {
        searchIndex = data;
        isLoading = false;
        while (loadListeners.length > 0) {
          const fn = loadListeners.shift();
          try { fn(searchIndex); } catch (e) { console.error(e); }
        }
      })
      .catch(err => {
        isLoading = false;
        console.error('StaticStack search index load error:', err);
      });
  }

  // Break a search query into clean normalized tokens
  function tokenize(str) {
    if (!str) return [];
    return str
      .toLowerCase()
      .trim()
      .split(/[\s\-_\/]+/)
      .filter(Boolean);
  }

  // Check if a word matches a token (prefix or plural match, NOT arbitrary substring)
  function wordMatchesToken(word, token) {
    if (!word || !token) return false;
    const w = word.toLowerCase();
    const t = token.toLowerCase();
    if (w === t) return true;
    // Handle simple plurals: 'forms' matches 'form', 'form' matches 'forms'
    if (w === t + 's' || w === t + 'es' || w + 's' === t) return true;
    // Word starts with token (e.g. 'formspree', 'formcarry', 'formkeep' matches 'form')
    if (w.startsWith(t)) return true;
    return false;
  }

  // Highlight matched search tokens in text
  function highlightMatches(text, tokens) {
    if (!text) return '';
    if (!tokens || tokens.length === 0) return escapeHtml(text);

    const safeTokens = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
    if (safeTokens.length === 0) return escapeHtml(text);

    // Regex matches words starting with or matching any token
    const pattern = new RegExp('\\b(' + safeTokens.join('|') + ')[a-z0-9]*', 'gi');
    let lastIndex = 0;
    let result = '';
    const raw = String(text);

    let match;
    while ((match = pattern.exec(raw)) !== null) {
      result += escapeHtml(raw.slice(lastIndex, match.index));
      result += '<mark class="search-highlight">' + escapeHtml(match[0]) + '</mark>';
      lastIndex = pattern.lastIndex;
    }
    result += escapeHtml(raw.slice(lastIndex));
    return result;
  }

  // Smart score a tool item: AND logic for tokens, word-boundary matching
  function scoreTool(item, tokens) {
    if (!tokens || tokens.length === 0) return 0;
    let score = 0;

    const title = (item.title || '').toLowerCase();
    const slug = (item.slug || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const tags = Array.isArray(item.tags) ? item.tags.map(t => t.toLowerCase()) : [];

    const titleWords = title.split(/[\s\-_]+/);
    const catWords = cat.split(/[\s\-_&]+/);
    const descWords = desc.replace(/[^\w\s-]/g, ' ').split(/\s+/);

    for (const token of tokens) {
      let tokenScore = 0;

      // 1. Exact title or slug match
      if (title === token || slug === token) {
        tokenScore += 120;
      } else if (title.startsWith(token)) {
        tokenScore += 70;
      } else if (titleWords.some(w => wordMatchesToken(w, token))) {
        tokenScore += 50;
      }

      // 2. Category match
      if (cat === token) {
        tokenScore += 50;
      } else if (catWords.some(w => wordMatchesToken(w, token))) {
        tokenScore += 35;
      }

      // 3. Tags match
      if (tags.some(t => wordMatchesToken(t, token) || t.split('-').some(part => wordMatchesToken(part, token)))) {
        tokenScore += 40;
      }

      // 4. Description whole/prefix word match (NOT inner substring!)
      if (descWords.some(w => wordMatchesToken(w, token))) {
        tokenScore += 20;
      }

      // If token failed to match anywhere, reject item (AND logic)
      if (tokenScore === 0) {
        return 0;
      }

      score += tokenScore;
    }

    return score;
  }

  // Smart score a category item
  function scoreCategory(cat, tokens) {
    if (!tokens || tokens.length === 0) return 0;
    let score = 0;

    const title = (cat.title || '').toLowerCase();
    const slug = (cat.slug || '').toLowerCase();
    const desc = (cat.description || '').toLowerCase();

    const titleWords = title.split(/[\s\-_&]+/);
    const descWords = desc.replace(/[^\w\s-]/g, ' ').split(/\s+/);

    for (const token of tokens) {
      let tokenScore = 0;

      if (title === token || slug === token) {
        tokenScore += 100;
      } else if (title.startsWith(token)) {
        tokenScore += 60;
      } else if (titleWords.some(w => wordMatchesToken(w, token))) {
        tokenScore += 45;
      }

      if (descWords.some(w => wordMatchesToken(w, token))) {
        tokenScore += 15;
      }

      if (tokenScore === 0) return 0;
      score += tokenScore;
    }

    return score;
  }

  // Execute search over the index
  function performSearch(query) {
    if (!searchIndex) return { categories: [], tools: [], total: 0 };
    const tokens = tokenize(query);
    if (tokens.length === 0) return { categories: [], tools: [], total: 0 };

    const matchingCats = [];
    const matchingTools = [];

    for (const item of searchIndex) {
      if (item.category === 'Category') {
        const s = scoreCategory(item, tokens);
        if (s > 0) matchingCats.push({ ...item, score: s });
      } else if (item.category === 'Community') {
        // Skip community or treat specially
      } else {
        const s = scoreTool(item, tokens);
        if (s > 0) matchingTools.push({ ...item, score: s });
      }
    }

    matchingCats.sort((a, b) => b.score - a.score);
    matchingTools.sort((a, b) => b.score - a.score);

    return {
      categories: matchingCats,
      tools: matchingTools,
      total: matchingCats.length + matchingTools.length
    };
  }

  // ==========================================================================
  // 1. Homepage Hero Search with Instant Autocomplete Dropdown
  // ==========================================================================
  function initHeroAutocomplete() {
    const input = document.getElementById('hero-search-input');
    const dropdown = document.getElementById('hero-search-dropdown');
    if (!input || !dropdown) return;

    let selectedIndex = -1;
    let currentResults = [];

    // Preload search index on hover/focus
    input.addEventListener('focus', () => getSearchIndex());
    input.parentElement.addEventListener('mouseenter', () => getSearchIndex());

    function renderDropdown(query) {
      const tokens = tokenize(query);
      if (tokens.length === 0) {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        currentResults = [];
        selectedIndex = -1;
        return;
      }

      getSearchIndex(index => {
        const { categories, tools, total } = performSearch(query);

        if (total === 0) {
          dropdown.innerHTML = `
            <div class="search-drop-empty">
              <span>No tools found for &ldquo;<strong>${escapeHtml(query)}</strong>&rdquo;</span>
              <p style="margin:0.35rem 0 0; font-size:0.8rem; color:var(--text-subtle);">Press Enter to view search options or explore the <a href="/archive">archive</a>.</p>
            </div>`;
          dropdown.style.display = 'block';
          currentResults = [];
          selectedIndex = -1;
          return;
        }

        currentResults = [];
        let html = '';

        // Category matches section (up to 2)
        if (categories.length > 0) {
          html += `<div class="search-drop-section-label">Categories</div>`;
          categories.slice(0, 2).forEach(cat => {
            const idx = currentResults.length;
            currentResults.push({ type: 'category', url: cat.url });
            html += `
              <a href="${cat.url}" class="search-drop-item search-drop-cat" data-index="${idx}">
                <div class="search-drop-cat-ico">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div class="search-drop-info">
                  <div class="search-drop-title">${highlightMatches(cat.title, tokens)} <span class="search-drop-cat-pill">${cat.toolsCount || ''} tools</span></div>
                  <div class="search-drop-sub">Curated category hub &bull; Explore collection</div>
                </div>
                <span class="search-drop-action">Explore &rarr;</span>
              </a>`;
          });
        }

        // Tool matches section (up to 6)
        if (tools.length > 0) {
          html += `<div class="search-drop-section-label">Tools (${tools.length})</div>`;
          tools.slice(0, 6).forEach(tool => {
            const idx = currentResults.length;
            currentResults.push({ type: 'tool', url: tool.url });
            const badgeClass = (tool.primaryBadge || '').toLowerCase().includes('open source') ? 'badge-open-source' :
                              (tool.primaryBadge || '').toLowerCase().includes('free') ? 'badge-free' : 'badge-freemium';
            const iconHtml = tool.icon
              ? `<img src="${tool.icon}" width="22" height="22" alt="" class="search-drop-tool-icon" onerror="this.style.display='none';">`
              : `<span class="search-drop-tool-icon-fallback">⚡</span>`;

            html += `
              <a href="${tool.url}" class="search-drop-item search-drop-tool" data-index="${idx}">
                <div class="search-drop-tool-icon-wrap">${iconHtml}</div>
                <div class="search-drop-info">
                  <div class="search-drop-title">
                    <span>${highlightMatches(tool.title, tokens)}</span>
                    <span class="badge ${badgeClass}" style="font-size:0.65rem; padding:0.1rem 0.4rem; margin-left:0.4rem;">${escapeHtml(tool.primaryBadge || 'Free')}</span>
                    <span class="search-drop-cat-name">&bull; ${escapeHtml(tool.category)}</span>
                  </div>
                  <div class="search-drop-sub">${highlightMatches(tool.description, tokens)}</div>
                </div>
                <span class="search-drop-action">View &rarr;</span>
              </a>`;
          });
        }

        // Dropdown Footer
        const viewAllUrl = '/search?q=' + encodeURIComponent(query);
        html += `
          <div class="search-drop-footer">
            <span>Showing top matches</span>
            <a href="${viewAllUrl}" class="search-drop-all-btn">View all ${total} results on dedicated Search page &rarr;</a>
          </div>`;

        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        selectedIndex = -1;
      });
    }

    input.addEventListener('input', e => {
      renderDropdown(e.target.value);
    });

    input.addEventListener('keydown', e => {
      if (dropdown.style.display !== 'block' || currentResults.length === 0) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = input.value.trim();
          window.location.href = val ? '/search?q=' + encodeURIComponent(val) : '/search';
        }
        return;
      }

      const items = dropdown.querySelectorAll('.search-drop-item');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateSelected(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateSelected(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          items[selectedIndex].click();
        } else {
          const val = input.value.trim();
          window.location.href = val ? '/search?q=' + encodeURIComponent(val) : '/search';
        }
      } else if (e.key === 'Escape') {
        dropdown.style.display = 'none';
      }
    });

    function updateSelected(items) {
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('is-active');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('is-active');
        }
      });
    }

    // Close on click outside
    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

  // Global helper for homepage Search button
  window.submitHeroSearch = function () {
    const input = document.getElementById('hero-search-input');
    const val = input ? input.value.trim() : '';
    window.location.href = val ? '/search?q=' + encodeURIComponent(val) : '/search';
  };

  window.quickSearchTag = function (tag) {
    window.location.href = '/search?q=' + encodeURIComponent(tag);
  };

  // ==========================================================================
  // 2. Global Search Modal (Command+K / "/")
  // ==========================================================================
  function initGlobalSearchModal() {
    const modal = document.getElementById('global-search-modal');
    const input = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('global-search-results');
    const clearBtn = document.getElementById('global-search-clear');
    const viewAllBtn = document.getElementById('global-search-view-all');
    if (!modal || !input || !resultsContainer) return;

    let selectedIndex = -1;
    let currentResults = [];

    window.openGlobalSearch = function (initialQuery) {
      modal.style.display = 'flex';
      document.body.classList.add('search-modal-open');
      getSearchIndex();
      if (typeof initialQuery === 'string') {
        input.value = initialQuery;
      }
      setTimeout(() => {
        input.focus();
        if (input.value) {
          renderModalResults(input.value);
        } else {
          renderEmptyModalState();
        }
      }, 50);
    };

    window.closeGlobalSearch = function () {
      modal.style.display = 'none';
      document.body.classList.remove('search-modal-open');
      input.value = '';
      resultsContainer.innerHTML = '';
      selectedIndex = -1;
    };

    modal.addEventListener('click', e => {
      if (e.target === modal) closeGlobalSearch();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        renderEmptyModalState();
        input.focus();
      });
    }

    function renderEmptyModalState() {
      if (clearBtn) clearBtn.style.display = 'none';
      if (viewAllBtn) viewAllBtn.style.display = 'none';
      resultsContainer.innerHTML = `
        <div class="search-modal-suggestions">
          <div class="search-modal-sug-title">Popular searches</div>
          <div class="search-modal-tags">
            <button type="button" class="search-modal-tag" onclick="selectModalTag('forms')">Forms</button>
            <button type="button" class="search-modal-tag" onclick="selectModalTag('auth')">Authentication</button>
            <button type="button" class="search-modal-tag" onclick="selectModalTag('database')">Database &amp; Storage</button>
            <button type="button" class="search-modal-tag" onclick="selectModalTag('cms')">Headless CMS</button>
            <button type="button" class="search-modal-tag" onclick="selectModalTag('hosting')">Static Hosting</button>
            <button type="button" class="search-modal-tag" onclick="selectModalTag('analytics')">Privacy Analytics</button>
            <button type="button" class="search-modal-tag" onclick="selectModalTag('search')">Client-side Search</button>
            <button type="button" class="search-modal-tag" onclick="selectModalTag('comments')">Comments</button>
          </div>
          <div class="search-modal-quick-links" style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--border-color); display:flex; gap:1rem; justify-content:center; font-size:0.85rem;">
            <a href="/archive" style="color:var(--accent); font-weight:600; text-decoration:none;">Browse Master Archive &rarr;</a>
            <a href="/search" style="color:var(--text-muted); font-weight:500; text-decoration:none;">Full Search Page</a>
          </div>
        </div>`;
      currentResults = [];
      selectedIndex = -1;
    }

    window.selectModalTag = function (tag) {
      input.value = tag;
      renderModalResults(tag);
      input.focus();
    };

    function renderModalResults(query) {
      const tokens = tokenize(query);
      if (clearBtn) clearBtn.style.display = query ? 'inline-flex' : 'none';

      if (tokens.length === 0) {
        renderEmptyModalState();
        return;
      }

      getSearchIndex(() => {
        const { categories, tools, total } = performSearch(query);

        if (viewAllBtn) {
          viewAllBtn.style.display = 'inline-block';
          viewAllBtn.href = '/search?q=' + encodeURIComponent(query);
          viewAllBtn.textContent = `View all ${total} results on Search page \u2192`;
        }

        if (total === 0) {
          resultsContainer.innerHTML = `
            <div class="search-modal-empty">
              <div style="font-size:1.15rem; font-weight:700; margin-bottom:0.35rem;">No tools found</div>
              <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">We couldn't find any tools matching &ldquo;<strong>${escapeHtml(query)}</strong>&rdquo;.</p>
              <div style="font-size:0.85rem; color:var(--text-subtle);">Try broader terms like &ldquo;forms&rdquo;, &ldquo;auth&rdquo;, &ldquo;cms&rdquo;, &ldquo;database&rdquo; or browse the <a href="/archive" style="color:var(--accent); text-decoration:underline;">archive</a>.</div>
            </div>`;
          currentResults = [];
          selectedIndex = -1;
          return;
        }

        currentResults = [];
        let html = '';

        if (categories.length > 0) {
          html += `<div class="search-modal-section-title">Matching Categories (${categories.length})</div>`;
          categories.slice(0, 3).forEach(cat => {
            const idx = currentResults.length;
            currentResults.push({ type: 'category', url: cat.url });
            html += `
              <a href="${cat.url}" class="search-modal-item search-modal-cat-item" data-index="${idx}">
                <div class="search-modal-cat-ico">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div class="search-modal-info">
                  <div class="search-modal-title">${highlightMatches(cat.title, tokens)} <span class="search-modal-pill">${cat.toolsCount || ''} tools</span></div>
                  <div class="search-modal-desc">${highlightMatches(cat.description, tokens)}</div>
                </div>
                <span class="search-modal-badge-hint">Category &rarr;</span>
              </a>`;
          });
        }

        if (tools.length > 0) {
          html += `<div class="search-modal-section-title">Matching Tools (${tools.length})</div>`;
          tools.slice(0, 10).forEach(tool => {
            const idx = currentResults.length;
            currentResults.push({ type: 'tool', url: tool.url });
            const badgeClass = (tool.primaryBadge || '').toLowerCase().includes('open source') ? 'badge-open-source' :
                              (tool.primaryBadge || '').toLowerCase().includes('free') ? 'badge-free' : 'badge-freemium';
            const iconHtml = tool.icon
              ? `<img src="${tool.icon}" width="22" height="22" alt="" class="search-modal-tool-icon" onerror="this.style.display='none';">`
              : `<span class="search-drop-tool-icon-fallback">⚡</span>`;

            html += `
              <a href="${tool.url}" class="search-modal-item search-modal-tool-item" data-index="${idx}">
                <div class="search-modal-tool-icon-wrap">${iconHtml}</div>
                <div class="search-modal-info">
                  <div class="search-modal-title">
                    <span>${highlightMatches(tool.title, tokens)}</span>
                    <span class="badge ${badgeClass}" style="font-size:0.65rem; padding:0.1rem 0.4rem; margin-left:0.4rem;">${escapeHtml(tool.primaryBadge || 'Free')}</span>
                    <span class="search-modal-cat-tag">&bull; ${escapeHtml(tool.category)}</span>
                  </div>
                  <div class="search-modal-desc">${highlightMatches(tool.description, tokens)}</div>
                </div>
                <span class="search-modal-key-hint">&crarr;</span>
              </a>`;
          });
        }

        resultsContainer.innerHTML = html;
        selectedIndex = -1;
      });
    }

    input.addEventListener('input', e => {
      renderModalResults(e.target.value);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeGlobalSearch();
        return;
      }

      const items = resultsContainer.querySelectorAll('.search-modal-item');
      if (items.length === 0) {
        if (e.key === 'Enter' && input.value.trim()) {
          window.location.href = '/search?q=' + encodeURIComponent(input.value.trim());
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        updateModalSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateModalSelection(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          items[selectedIndex].click();
        } else {
          window.location.href = '/search?q=' + encodeURIComponent(input.value.trim());
        }
      }
    });

    function updateModalSelection(items) {
      items.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('is-active');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('is-active');
        }
      });
    }

    // Keyboard shortcut listeners: "/" or "Cmd+K" / "Ctrl+K"
    document.addEventListener('keydown', e => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && !isInput) {
        e.preventDefault();
        openGlobalSearch();
      }
    });
  }

  // ==========================================================================
  // 3. Dedicated Search Page Controller (/search?q=...)
  // ==========================================================================
  function initSearchPage() {
    const input = document.getElementById('search-page-input');
    const resultsGrid = document.getElementById('search-page-results');
    const counterEl = document.getElementById('search-page-counter');
    const spotlightEl = document.getElementById('search-cat-spotlight');
    const filterPills = document.querySelectorAll('.search-pricing-filter');
    const clearBtn = document.getElementById('search-page-clear');
    if (!input || !resultsGrid) return;

    let currentPricingFilter = 'all';

    function renderSearchPage() {
      const query = input.value.trim();
      const tokens = tokenize(query);

      if (clearBtn) {
        clearBtn.style.display = query ? 'inline-flex' : 'none';
      }

      // Update URL query param without full page reload
      try {
        if (window.history && window.history.replaceState && window.location.protocol !== 'file:') {
          const newUrl = query
            ? '/search?q=' + encodeURIComponent(query)
            : '/search';
          window.history.replaceState({ path: newUrl }, '', newUrl);
        }
      } catch (e) {}

      getSearchIndex(() => {
        const { categories, tools, total } = performSearch(query);

        // Filter tools by pricing
        const filteredTools = tools.filter(tool => {
          if (currentPricingFilter === 'all') return true;
          const badges = (tool.badges || [tool.primaryBadge || '']).map(b => b.toLowerCase());
          const primary = (tool.primaryBadge || '').toLowerCase();
          if (currentPricingFilter === 'open-source') {
            return badges.some(b => b.includes('open source')) || primary.includes('open source');
          }
          if (currentPricingFilter === 'free') {
            return badges.some(b => b === 'free' || b.includes('free tier')) || primary === 'free';
          }
          if (currentPricingFilter === 'freemium') {
            return badges.some(b => b.includes('freemium')) || primary.includes('freemium');
          }
          if (currentPricingFilter === 'paid') {
            return badges.some(b => b.includes('paid') || b.includes('commercial')) || primary.includes('paid');
          }
          return true;
        });

        // 1. Category Spotlight Banner
        if (spotlightEl) {
          if (categories.length > 0 && query) {
            const topCat = categories[0];
            spotlightEl.innerHTML = `
              <div class="search-cat-banner">
                <div class="search-cat-banner-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div class="search-cat-banner-content">
                  <div class="search-cat-banner-subtitle">Category Collection</div>
                  <h3 class="search-cat-banner-title">${highlightMatches(topCat.title, tokens)}</h3>
                  <p class="search-cat-banner-desc">${highlightMatches(topCat.description, tokens)}</p>
                </div>
                <a href="${topCat.url}" class="btn btn-primary search-cat-banner-btn">
                  Explore Hub (${topCat.toolsCount || ''} Tools) &rarr;
                </a>
              </div>`;
            spotlightEl.style.display = 'block';
          } else {
            spotlightEl.style.display = 'none';
            spotlightEl.innerHTML = '';
          }
        }

        // 2. Result Count
        if (counterEl) {
          if (query) {
            counterEl.innerHTML = `Showing <strong>${filteredTools.length}</strong> ${filteredTools.length === 1 ? 'tool' : 'tools'} matching &ldquo;<strong>${escapeHtml(query)}</strong>&rdquo; ${categories.length > 0 ? `across ${categories.length} category ${categories.length === 1 ? 'hub' : 'hubs'}` : ''}`;
          } else {
            counterEl.innerHTML = `Showing all <strong>${filteredTools.length}</strong> tools`;
          }
        }

        // 3. Tools Grid
        if (filteredTools.length === 0) {
          resultsGrid.innerHTML = `
            <div class="search-empty-state">
              <div class="search-empty-icon">🔍</div>
              <h3 class="search-empty-title">No tools found</h3>
              <p class="search-empty-desc">We couldn't find any tools matching &ldquo;<strong>${escapeHtml(query)}</strong>&rdquo; with the selected filters.</p>
              <div class="search-empty-actions">
                <button type="button" class="btn btn-primary" onclick="window.clearSearchPageQuery()">Clear Search &amp; Filters</button>
                <a href="/archive" class="btn btn-secondary">Browse Master Archive &rarr;</a>
              </div>
              <div style="margin-top:2rem; font-size:0.9rem; color:var(--text-muted);">
                <span style="font-weight:600; color:var(--text-main); margin-right:0.5rem;">Try:</span>
                <a href="javascript:void(0)" onclick="window.setSearchPageQuery('forms')" class="search-tag-pill">#forms</a>
                <a href="javascript:void(0)" onclick="window.setSearchPageQuery('auth')" class="search-tag-pill">#auth</a>
                <a href="javascript:void(0)" onclick="window.setSearchPageQuery('cms')" class="search-tag-pill">#cms</a>
                <a href="javascript:void(0)" onclick="window.setSearchPageQuery('database')" class="search-tag-pill">#database</a>
                <a href="javascript:void(0)" onclick="window.setSearchPageQuery('hosting')" class="search-tag-pill">#hosting</a>
                <a href="javascript:void(0)" onclick="window.setSearchPageQuery('analytics')" class="search-tag-pill">#analytics</a>
              </div>
            </div>`;
          return;
        }

        resultsGrid.innerHTML = filteredTools.map(tool => {
          const badgeClass = (tool.primaryBadge || '').toLowerCase().includes('open source') ? 'badge-open-source' :
                            (tool.primaryBadge || '').toLowerCase().includes('free') ? 'badge-free' : 'badge-freemium';
          const iconHtml = tool.icon
            ? `<img src="${tool.icon}" width="28" height="28" alt="" class="search-card-icon" onerror="this.style.display='none';">`
            : `<span class="search-card-icon-fallback">⚡</span>`;

          const tagsHtml = (tool.tags && tool.tags.length > 0)
            ? `<div class="search-card-tags">
                ${tool.tags.slice(0, 3).map(t => `<span class="search-card-tag" onclick="window.setSearchPageQuery('${escapeHtml(t)}')">#${escapeHtml(t)}</span>`).join('')}
              </div>`
            : '';

          return `
            <div class="search-tool-card">
              <div class="search-card-head">
                <div class="search-card-title-group">
                  <div class="search-card-icon-box">${iconHtml}</div>
                  <div>
                    <h3 class="search-card-name"><a href="${tool.url}">${highlightMatches(tool.title, tokens)}</a></h3>
                    <a href="/category/${tool.categorySlug}/" class="search-card-cat-link">${escapeHtml(tool.category)}</a>
                  </div>
                </div>
                <span class="badge ${badgeClass}">${escapeHtml(tool.primaryBadge || 'Free')}</span>
              </div>
              <p class="search-card-desc">${highlightMatches(tool.description, tokens)}</p>
              ${tagsHtml}
              <div class="search-card-actions">
                <a href="${tool.url}" class="btn btn-secondary btn-sm search-card-details-btn">
                  Explore Tool &rarr;
                </a>
                ${tool.websiteUrl ? `
                  <a href="${tool.websiteUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-ghost search-card-ext-btn" title="Visit official website">
                    Website <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>` : ''}
              </div>
            </div>`;
        }).join('');
      });
    }

    input.addEventListener('input', () => {
      renderSearchPage();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        renderSearchPage();
        input.focus();
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentPricingFilter = pill.getAttribute('data-filter') || 'all';
        renderSearchPage();
      });
    });

    window.clearSearchPageQuery = function () {
      input.value = '';
      currentPricingFilter = 'all';
      filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'all'));
      renderSearchPage();
      input.focus();
    };

    window.setSearchPageQuery = function (q) {
      input.value = q;
      renderSearchPage();
      input.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Initialize with ?q= query param
    const urlParams = new URLSearchParams(window.location.search);
    const initialQ = urlParams.get('q');
    if (initialQ) {
      input.value = initialQ;
    }
    renderSearchPage();
  }

  // ==========================================================================
  // 4. Archive Page Redirect for ?q= Query Params
  // ==========================================================================
  function checkArchiveRedirect() {
    if (window.location.pathname.includes('/archive')) {
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('q');
      if (queryParam) {
        // Automatically transfer to dedicated search page
        window.location.replace('/search?q=' + encodeURIComponent(queryParam));
      }
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    checkArchiveRedirect();
    initHeroAutocomplete();
    initGlobalSearchModal();
    initSearchPage();
  }

})();

