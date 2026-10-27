/**
 * Static Website Toolkit - Core Client-Side Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSearch();
  initCodeCopy();
  initMobileMenu();
  initArchiveFilters();
  initArchiveViewSwitcher();
  initCopyrightYear();
});

/* ==========================================================================
   Theme Management (Light / Dark)
   ========================================================================== */
function initTheme() {
  const themeButtons = document.querySelectorAll('.theme-toggle-btn');
  if (!themeButtons.length) return;

  const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  const getSavedTheme = () => localStorage.getItem('swt-theme');
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeButtons.forEach(btn => {
      const iconEl = btn.querySelector('.theme-icon');
      if (iconEl) {
        iconEl.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
      } else {
        btn.innerHTML = theme === 'dark' ? sunSvg : moonSvg;
      }
      const labelEl = btn.querySelector('.theme-label');
      if (labelEl) {
        labelEl.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
      }
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  };

  const initialTheme = getSavedTheme() || getSystemTheme();
  applyTheme(initialTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('swt-theme', nextTheme);
      applyTheme(nextTheme);
    });
  });
}

/* ==========================================================================
   Instant Search Modal
   ========================================================================== */
function initSearch() {
  const modal = document.getElementById('search-modal');
  const openBtns = document.querySelectorAll('.search-trigger');
  const closeBtn = document.getElementById('search-close');
  const input = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');

  if (!modal || !input || !resultsContainer) return;

  let searchIndex = [];
  let isLoaded = false;

  const loadIndex = async () => {
    if (isLoaded) return;
    try {
      const res = await fetch('/asset/json/search-data.json');
      if (res.ok) {
        searchIndex = await res.json();
        isLoaded = true;
      }
    } catch (e) {
      console.warn('Could not load search index', e);
    }
  };

  const openModal = () => {
    modal.classList.add('active');
    loadIndex();
    setTimeout(() => input.focus(), 50);
  };

  const closeModal = () => {
    modal.classList.remove('active');
    input.value = '';
    resultsContainer.innerHTML = '';
  };

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
    // '/' or 'Ctrl+K' / 'Cmd+K' shortcut to open search
    if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openModal();
    }
  });

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      resultsContainer.innerHTML = '';
      return;
    }

    const matches = searchIndex.filter(item => {
      return item.title.toLowerCase().includes(query) ||
             item.description.toLowerCase().includes(query) ||
             (item.category && item.category.toLowerCase().includes(query));
    }).slice(0, 10);

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted)">No matching tools found.</div>';
      return;
    }

    resultsContainer.innerHTML = matches.map(item => `
      <a href="${item.url}" class="search-result-item">
        <div class="search-result-title">${escapeHtml(item.title)} <span style="font-size:0.75rem; color:var(--text-subtle); font-weight:normal">in ${escapeHtml(item.category || 'Tools')}</span></div>
        <div class="search-result-desc">${escapeHtml(item.description)}</div>
      </a>
    `).join('');
  });
}

/* ==========================================================================
   Code Block Copy to Clipboard
   ========================================================================== */
function initCodeCopy() {
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(pre => {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = 'Copied!';
        btn.style.color = '#4ade80';
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        btn.textContent = 'Failed';
      }
    });

    wrapper.appendChild(btn);
  });
}

/* ==========================================================================
   Mobile Menu Toggle with Hamburger / Close Icons
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navDrawer = document.getElementById('nav-drawer') || document.getElementById('nav-links');
  if (!menuBtn || !navDrawer) return;

  const openIcon = menuBtn.querySelector('.menu-icon-open');
  const closeIcon = menuBtn.querySelector('.menu-icon-close');

  const updateMenuState = (isOpen) => {
    if (isOpen) {
      navDrawer.classList.add('active');
      menuBtn.classList.add('active');
      menuBtn.setAttribute('aria-expanded', 'true');
      if (openIcon) openIcon.style.display = 'none';
      if (closeIcon) closeIcon.style.display = 'flex';
    } else {
      navDrawer.classList.remove('active');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      if (openIcon) openIcon.style.display = 'flex';
      if (closeIcon) closeIcon.style.display = 'none';
    }
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navDrawer.classList.contains('active');
    updateMenuState(!isOpen);
  });

  // Close menu when clicking any nav link
  navDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      updateMenuState(false);
    });
  });

  // Close menu when clicking mobile search trigger
  const mobileSearchBtn = navDrawer.querySelector('.mobile-search-btn');
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', () => {
      updateMenuState(false);
    });
  }

  // Close when clicking outside header
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navDrawer.contains(e.target) && navDrawer.classList.contains('active')) {
      updateMenuState(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
      updateMenuState(false);
    }
  });

  // Reset when window resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && navDrawer.classList.contains('active')) {
      updateMenuState(false);
    }
  });
}

/* ==========================================================================
   Dynamic Copyright Year
   ========================================================================== */
function initCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================================================
   Archive Pricing Filters
   ========================================================================== */
function initArchiveFilters() {
  const filterBtns = document.querySelectorAll('.archive-filter-btn');
  const tableRows = document.querySelectorAll('.archive-table tbody tr');
  const archiveCards = document.querySelectorAll('.archive-tool-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-secondary'));
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');

      const filter = btn.getAttribute('data-filter');

      const matchesFilter = (el) => {
        const pricingText = el.getAttribute('data-pricing') || '';
        return filter === 'all' || pricingText.toLowerCase().includes(filter.toLowerCase());
      };

      tableRows.forEach(row => {
        row.style.display = matchesFilter(row) ? '' : 'none';
      });

      archiveCards.forEach(card => {
        card.style.display = matchesFilter(card) ? '' : 'none';
      });
    });
  });
}

/* ==========================================================================
   Archive View Switcher (Table vs Cards)
   ========================================================================== */
function initArchiveViewSwitcher() {
  const tableBtn = document.getElementById('view-mode-table');
  const cardsBtn = document.getElementById('view-mode-cards');
  if (!tableBtn || !cardsBtn) return;

  const setView = (mode) => {
    const tableViews = document.querySelectorAll('.archive-view-table');
    const cardViews = document.querySelectorAll('.archive-view-cards');

    if (mode === 'cards') {
      tableViews.forEach(el => el.style.display = 'none');
      cardViews.forEach(el => el.style.display = 'grid');
      cardsBtn.classList.add('active');
      tableBtn.classList.remove('active');
      try {
        localStorage.setItem('archive-view-pref', 'cards');
      } catch (e) {}
    } else {
      tableViews.forEach(el => el.style.display = '');
      cardViews.forEach(el => el.style.display = 'none');
      tableBtn.classList.add('active');
      cardsBtn.classList.remove('active');
      try {
        localStorage.setItem('archive-view-pref', 'table');
      } catch (e) {}
    }
  };

  tableBtn.addEventListener('click', () => setView('table'));
  cardsBtn.addEventListener('click', () => setView('cards'));

  try {
    const saved = localStorage.getItem('archive-view-pref');
    if (saved === 'cards') {
      setView('cards');
    }
  } catch (e) {}
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
