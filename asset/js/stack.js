/**
 * StaticStack — GitHub-Authenticated "My Static Stack" Bookmark Manager
 * Syncs bookmarks to PostgreSQL via /community/api?action=stack*
 */
(function () {
  var savedSlugs = new Set();
  var currentUser = null;
  var pendingSlugAfterAuth = null;

  function updateButtons() {
    var btns = document.querySelectorAll('[data-stack-save]');
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      var slug = btn.getAttribute('data-stack-save');
      var isSaved = savedSlugs.has(slug);
      btn.classList.toggle('is-saved', isSaved);
      btn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
      btn.setAttribute('data-tooltip', isSaved ? 'Saved to Stack' : 'Save to Stack');
    }
  }

  function updateRailAuth() {
    var btn = document.getElementById('rail-auth-btn');
    if (!btn) return;

    var returnPath = encodeURIComponent(window.location.pathname + window.location.search);
    if (currentUser && currentUser.login) {
      var avatarSrc = 'https://github.com/' + encodeURIComponent(currentUser.login) + '.png?size=64';
      btn.setAttribute('href', '/community/oauth?action=logout&redirect=' + returnPath);
      btn.setAttribute('aria-label', 'Logout (@' + currentUser.login + ')');
      btn.innerHTML =
        '<img src="' + avatarSrc + '" alt="@' + escapeHtml(currentUser.login) + '" class="rail-auth-avatar">' +
        '<span class="rail-tooltip" id="rail-auth-tooltip">Logout</span>';
    } else {
      btn.setAttribute('href', '/community/oauth?action=login&redirect=' + returnPath);
      btn.setAttribute('aria-label', 'Login');
      btn.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>' +
          '<polyline points="10 17 15 12 10 7"></polyline>' +
          '<line x1="15" y1="12" x2="3" y2="12"></line>' +
        '</svg>' +
        '<span class="rail-tooltip" id="rail-auth-tooltip">Login</span>';
    }
  }

  function fetchStackState() {
    return fetch('/community/api?action=stack', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : { user: null, bookmarks: [] }; })
      .then(function (data) {
        currentUser = data.user || null;
        savedSlugs = new Set(
          (data.bookmarks || []).map(function (b) { return b.tool_slug; })
        );
        updateButtons();
        updateRailAuth();
        return data;
      })
      .catch(function () {
        updateRailAuth();
        return { user: null, bookmarks: [] };
      });
  }

  function toggleTool(slug, mode) {
    return fetch('/community/api?action=stack_toggle', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_slug: slug, mode: mode || 'toggle' })
    })
      .then(function (r) {
        if (r.status === 401) {
          throw new Error('AUTH_REQUIRED');
        }
        return r.json();
      })
      .then(function (data) {
        if (data && data.bookmarks) {
          savedSlugs = new Set(data.bookmarks.map(function (b) { return b.tool_slug; }));
          updateButtons();
        }
        return data;
      });
  }

  function openGitHubLogin(slugToSaveAfter) {
    pendingSlugAfterAuth = slugToSaveAfter || null;
    var redirectPath = window.location.pathname + window.location.search;
    var loginUrl = '/community/oauth?action=login&redirect=' + encodeURIComponent(redirectPath);
    var popup = window.open(loginUrl, 'staticstack-oauth', 'width=600,height=720');
    if (!popup || popup.closed) {
      window.location.href = loginUrl;
    }
  }

  window.addEventListener('message', function (ev) {
    if (!ev.data || ev.data.type !== 'staticstack-oauth-success') return;
    fetchStackState().then(function () {
      if (pendingSlugAfterAuth) {
        var slug = pendingSlugAfterAuth;
        pendingSlugAfterAuth = null;
        toggleTool(slug, 'add').then(function () {
          renderStackPage();
        }).catch(function () {});
      } else {
        renderStackPage();
      }
    });
  });

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest('[data-stack-save]');
    if (!btn) return;
    ev.preventDefault();
    ev.stopPropagation();

    var slug = btn.getAttribute('data-stack-save');
    if (!slug) return;

    if (!currentUser) {
      openGitHubLogin(slug);
      return;
    }

    toggleTool(slug, 'toggle').catch(function (err) {
      if (err && err.message === 'AUTH_REQUIRED') {
        openGitHubLogin(slug);
      }
    });
  });

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderStackPage() {
    var app = document.getElementById('stack-page-app');
    if (!app) return;

    if (!currentUser) {
      var loginHref = '/community/oauth?action=login&redirect=' + encodeURIComponent('/stack/');
      app.innerHTML =
        '<div class="stack-page-card" style="text-align:center; padding:2.5rem 1.5rem;">' +
          '<h2 style="margin:0 0 0.5rem;">Sign in with GitHub to view your Static Stack</h2>' +
          '<p style="color:var(--text-muted); max-width:480px; margin:0 auto 1.25rem;">' +
            'Bookmarks are tied to your GitHub account to prevent spam and keep your saved tools synced across devices.' +
          '</p>' +
          '<a href="' + loginHref + '" class="btn btn-primary" id="stack-login-btn">Sign in with GitHub</a>' +
        '</div>';
      return;
    }

    if (!window.__staticstackSearchDataPromise) {
      window.__staticstackSearchDataPromise = fetch('/asset/json/search-data.json')
        .then(function (r) {
          if (!r.ok) throw new Error('Failed to load search-data.json: ' + r.status);
          return r.json();
        });
    }
    window.__staticstackSearchDataPromise
      .then(function (indexItems) {
        var toolBySlug = {};
        for (var i = 0; i < indexItems.length; i++) {
          var item = indexItems[i];
          if (item.slug && item.categorySlug) {
            toolBySlug[item.slug] = item;
          }
        }

        var savedList = Array.from(savedSlugs)
          .map(function (slug) { return toolBySlug[slug]; })
          .filter(Boolean);

        var headerBar =
          '<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.25rem;">' +
            '<div style="font-size:0.9rem; color:var(--text-muted);">Signed in as <strong>@' + escapeHtml(currentUser.login) + '</strong> &middot; ' + savedList.length + ' saved tool' + (savedList.length === 1 ? '' : 's') + '</div>' +
            '<a href="/archive" class="btn btn-secondary btn-sm">Browse All Tools</a>' +
          '</div>';

        if (!savedList.length) {
          app.innerHTML =
            '<div class="stack-page-card">' +
              headerBar +
              '<p style="color:var(--text-muted); margin:0.5rem 0 0;">Your stack is empty. Click the bookmark icon on any tool to save it here.</p>' +
            '</div>';
          return;
        }

        var rowsHtml = savedList.map(function (tool) {
          var shareUrl = window.location.origin + tool.url;
          var catUrl = '/category/' + encodeURIComponent(tool.categorySlug) + '/';
          var fallbackDomain = '';
          if (tool.websiteUrl) {
            try { fallbackDomain = new URL(tool.websiteUrl).hostname; } catch (e) {}
          }
          var fallbackFavicon = fallbackDomain
            ? 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(fallbackDomain) + '&sz=64'
            : '';
          var initialLetter = escapeHtml((tool.title || '?').charAt(0).toUpperCase());
          var fallbackBadge = '<span class="stack-icon-fallback" style="display:none; width:20px; height:20px; border-radius:4px; background:var(--accent-light, #eff6ff); color:var(--accent, #2563eb); font-size:0.72rem; font-weight:700; align-items:center; justify-content:center; flex-shrink:0;">' + initialLetter + '</span>';
          var iconSrc = tool.icon || fallbackFavicon;
          var iconHtml = iconSrc
            ? '<img src="' + escapeHtml(iconSrc) + '" data-fallback="' + escapeHtml(fallbackFavicon) + '" alt="" width="20" height="20" style="border-radius:4px; object-fit:contain; flex-shrink:0;" loading="lazy" onerror="var fb=this.getAttribute(\'data-fallback\'); if(fb && this.src!==fb){this.src=fb; this.removeAttribute(\'data-fallback\');} else {this.style.display=\'none\'; if(this.nextElementSibling) this.nextElementSibling.style.display=\'inline-flex\';}">' + fallbackBadge
            : fallbackBadge.replace('display:none;', 'display:inline-flex;');

          return (
            '<tr data-stack-row="' + escapeHtml(tool.slug) + '">' +
              '<td><a href="' + catUrl + '" style="color:var(--text-muted); text-decoration:none; font-weight:500;">' + escapeHtml(tool.category) + '</a></td>' +
              '<td>' +
                '<a href="' + escapeHtml(tool.url) + '" class="stack-tool-link">' +
                  iconHtml +
                  '<span>' + escapeHtml(tool.title) + '</span>' +
                '</a>' +
              '</td>' +
              '<td>' +
                '<button type="button" class="btn btn-secondary btn-sm" data-stack-delete="' + escapeHtml(tool.slug) + '">Delete</button>' +
              '</td>' +
              '<td style="text-align:right;">' +
                '<button type="button" class="btn btn-secondary btn-sm" data-stack-copy="' + escapeHtml(shareUrl) + '">Copy Link</button>' +
              '</td>' +
            '</tr>'
          );
        }).join('');

        app.innerHTML =
          '<div class="stack-page-card">' +
            headerBar +
            '<div class="stack-table-wrap">' +
              '<table class="stack-table">' +
                '<thead>' +
                  '<tr>' +
                    '<th>Category</th>' +
                    '<th>Tool</th>' +
                    '<th>Delete</th>' +
                    '<th style="text-align:right;">Share</th>' +
                  '</tr>' +
                '</thead>' +
                '<tbody>' + rowsHtml + '</tbody>' +
              '</table>' +
            '</div>' +
          '</div>';
      });
  }

  document.addEventListener('click', function (ev) {
    var delBtn = ev.target.closest('[data-stack-delete]');
    if (delBtn) {
      var slug = delBtn.getAttribute('data-stack-delete');
      delBtn.disabled = true;
      toggleTool(slug, 'remove').then(function () {
        renderStackPage();
      }).catch(function () {
        delBtn.disabled = false;
      });
      return;
    }

    var copyBtn = ev.target.closest('[data-stack-copy]');
    if (copyBtn) {
      var url = copyBtn.getAttribute('data-stack-copy');
      if (navigator.clipboard && url) {
        navigator.clipboard.writeText(url).then(function () {
          copyBtn.textContent = 'Copied!';
          setTimeout(function () { copyBtn.textContent = 'Copy Link'; }, 1500);
        });
      }
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    var needsStack = document.querySelector('[data-stack-save]') || document.getElementById('stack-page-app') || document.getElementById('rail-auth-btn');
    if (!needsStack) return;
    fetchStackState().then(function () {
      renderStackPage();
    });
  });
})();

