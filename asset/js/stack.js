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

  function fetchStackState() {
    return fetch('/community/api?action=stack', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : { user: null, bookmarks: [] }; })
      .then(function (data) {
        currentUser = data.user || null;
        savedSlugs = new Set(
          (data.bookmarks || []).map(function (b) { return b.tool_slug; })
        );
        updateButtons();
        return data;
      })
      .catch(function () {
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

    fetch('/asset/json/search-data.json')
      .then(function (r) { return r.json(); })
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
          var iconHtml = tool.icon
            ? '<img src="' + escapeHtml(tool.icon) + '" alt="" width="20" height="20" style="border-radius:4px; object-fit:contain;" loading="lazy">'
            : '';

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
              '<td>' +
                '<div class="stack-share-cell">' +
                  '<a href="' + escapeHtml(tool.url) + '" style="font-size:0.85rem; color:var(--accent); text-decoration:none;">' + escapeHtml(shareUrl) + '</a>' +
                  '<button type="button" class="btn btn-secondary btn-sm" data-stack-copy="' + escapeHtml(shareUrl) + '">Copy</button>' +
                '</div>' +
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
                    '<th>Share</th>' +
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
          setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1500);
        });
      }
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    var needsStack = document.querySelector('[data-stack-save]') || document.getElementById('stack-page-app');
    if (!needsStack) return;
    fetchStackState().then(function () {
      renderStackPage();
    });
  });
})();

