/**
 * StaticStack — First-Party GitHub-Authenticated Tool Comments
 * Uses the same /community/oauth session cookie as Community Forum & My Static Stack.
 */
(function () {
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  }

  function initToolComments() {
    var app = document.getElementById('tool-comments-app');
    if (!app) return;
    var slug = app.getAttribute('data-tool-slug');
    if (!slug) return;

    function loadAndRender() {
      fetch('/community/api?action=tool_comments&slug=' + encodeURIComponent(slug), {
        credentials: 'same-origin'
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var user = data.user || null;
          var comments = data.comments || [];

          var listHtml = '';
          if (!comments.length) {
            listHtml = '<p style="color:var(--text-muted); font-size:0.9rem; margin:0 0 1.25rem;">No comments yet. Be the first to share a tip or ask a question!</p>';
          } else {
            listHtml = '<div class="tool-comments-list">' + comments.map(function (c) {
              var avatar = c.avatar_url || ('https://github.com/' + encodeURIComponent(c.login) + '.png?size=64');
              var canDelete = user && (Number(user.id) === Number(c.user_id) || user.admin);
              return (
                '<article class="tool-comment-card" data-comment-id="' + c.id + '">' +
                  '<div class="tool-comment-head">' +
                    '<div class="tool-comment-author">' +
                      '<img src="' + escapeHtml(avatar) + '" alt="@' + escapeHtml(c.login) + '" class="tool-comment-avatar" width="30" height="30" loading="lazy">' +
                      '<div>' +
                        '<strong>' + escapeHtml(c.display_name || c.login) + '</strong> ' +
                        '<span style="color:var(--text-muted); font-size:0.8rem;">@' + escapeHtml(c.login) + '</span>' +
                        (c.is_admin ? ' <span class="badge badge-free" style="font-size:0.65rem; padding:0.1rem 0.4rem;">Admin</span>' : '') +
                      '</div>' +
                    '</div>' +
                    '<div style="display:flex; align-items:center; gap:0.5rem;">' +
                      '<time style="color:var(--text-muted); font-size:0.78rem;">' + escapeHtml(formatDate(c.created_at)) + '</time>' +
                      (canDelete ? '<button type="button" class="btn btn-secondary btn-sm" data-comment-delete="' + c.id + '" style="font-size:0.72rem; padding:0.2rem 0.5rem;">Delete</button>' : '') +
                    '</div>' +
                  '</div>' +
                  '<div class="tool-comment-body">' + escapeHtml(c.body).replace(/\n/g, '<br>') + '</div>' +
                '</article>'
              );
            }).join('') + '</div>';
          }

          var returnPath = encodeURIComponent(window.location.pathname + window.location.search);
          var composerHtml = '';
          if (user) {
            composerHtml =
              '<form id="tool-comment-form" class="tool-comment-form">' +
                '<div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.45rem;">Commenting as <strong>@' + escapeHtml(user.login) + '</strong></div>' +
                '<textarea id="tool-comment-input" rows="3" required minlength="2" maxlength="3000" placeholder="Share a tip, review, or question about this tool…"></textarea>' +
                '<div style="display:flex; align-items:center; justify-content:space-between; margin-top:0.6rem; gap:0.75rem;">' +
                  '<span id="tool-comment-status" style="font-size:0.82rem; color:#dc2626;"></span>' +
                  '<button type="submit" class="btn btn-primary btn-sm" id="tool-comment-submit">Post Comment</button>' +
                '</div>' +
              '</form>';
          } else {
            composerHtml =
              '<div class="tool-comment-auth">' +
                '<p style="margin:0 0 0.75rem; color:var(--text-muted); font-size:0.9rem;">Sign in once with GitHub to comment on tools, join community topics, and save bookmarks.</p>' +
                '<a href="/community/oauth?action=login&redirect=' + returnPath + '" class="btn btn-primary btn-sm" id="tool-comment-login-btn">Sign in with GitHub</a>' +
              '</div>';
          }

          app.innerHTML = listHtml + composerHtml;
        })
        .catch(function () {
          app.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem; margin:0;">Comments are temporarily unavailable.</p>';
        });
    }

    app.addEventListener('submit', function (ev) {
      var form = ev.target.closest('#tool-comment-form');
      if (!form) return;
      ev.preventDefault();

      var input = document.getElementById('tool-comment-input');
      var btn = document.getElementById('tool-comment-submit');
      var status = document.getElementById('tool-comment-status');
      var body = input ? input.value.trim() : '';
      if (body.length < 2) return;

      if (btn) btn.disabled = true;
      if (status) status.textContent = '';

      fetch('/community/api?action=tool_comment_add', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: slug, body: body })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res.ok) {
            if (status) status.textContent = res.error || 'Could not post comment.';
            if (btn) btn.disabled = false;
            return;
          }
          loadAndRender();
        })
        .catch(function () {
          if (status) status.textContent = 'Network error. Please try again.';
          if (btn) btn.disabled = false;
        });
    });

    app.addEventListener('click', function (ev) {
      var delBtn = ev.target.closest('[data-comment-delete]');
      if (!delBtn) return;
      var id = Number(delBtn.getAttribute('data-comment-delete'));
      delBtn.disabled = true;
      fetch('/community/api?action=tool_comment_delete', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      })
        .then(function (r) { return r.json(); })
        .then(function () { loadAndRender(); })
        .catch(function () { delBtn.disabled = false; });
    });

    window.addEventListener('message', function (ev) {
      if (ev.data && ev.data.type === 'staticstack-oauth-success') {
        loadAndRender();
      }
    });

    loadAndRender();
  }

  document.addEventListener('DOMContentLoaded', initToolComments);
})();

