/**
 * StaticStack Community Forum - Frontend Client Engine
 */
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const api = '/community/api';
  const state = {
    user: null,
    categories: [],
    category: '',
    search: '',
    topics: [],
    activeTopic: null,
    reportTarget: null
  };

  const escapeHtml = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));

  // Default Community Date & Time Format: MM.DD.YY - H:MM am (e.g. 11.28.26 - 9:26 am)
  const formatDateTime = (value) => {
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return '';
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yy = String(d.getFullYear()).slice(-2);
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${mm}.${dd}.${yy} - ${hours}:${minutes} ${ampm}`;
    } catch {
      return '';
    }
  };

  const dateText = (value) => formatDateTime(value);
  const dateTimeText = (value) => formatDateTime(value);

  const isTrue = (v) => v === true || v === 1 || v === '1' || v === 't' || v === 'true';

  const shortText = (s, n = 190) => {
    const v = String(s ?? '');
    return v.length > n ? v.slice(0, n).trim() + '…' : v;
  };

  let toastTimer;
  function toast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
  }

  async function request(action, options = {}) {
    const url = new URL(api, location.href);
    url.searchParams.set('action', action);
    if (options.params) {
      Object.entries(options.params).forEach(([k, v]) => {
        if (v !== '' && v != null) url.searchParams.set(k, v);
      });
    }
    const response = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...(options.method ? { method: options.method } : {}),
      ...(options.body ? { body: JSON.stringify(options.body) } : {})
    });
    let data = {};
    try {
      data = await response.json();
    } catch {}
    if (!response.ok) {
      throw new Error(data.error || `Request failed (${response.status}).`);
    }
    return data;
  }

  function accountView() {
    const el = $('#account');
    if (!el) return;
    if (!state.user) {
      el.innerHTML = '<a class="button button-quiet" href="/community/oauth?action=login">Sign in with GitHub</a>';
      return;
    }
    const displayName = escapeHtml(state.user.name || state.user.login || 'User');
    const avatar = state.user.avatar
      ? `<img class="avatar" src="${escapeHtml(state.user.avatar)}" alt="${displayName}">`
      : `<span class="avatar-fallback">${displayName.charAt(0).toUpperCase()}</span>`;
    el.innerHTML = `
      <a class="account-user" href="/community/oauth?action=logout" title="Signed in as ${displayName} (click to sign out)" onclick="return confirm('Sign out of StaticStack Community?');">
        ${avatar}
        <span class="account-name">${displayName}</span>
      </a>
    `;
    if (state.user.admin) {
      loadReports().catch((e) => toast(e.message));
    } else {
      const adminPanel = $('#admin-panel');
      if (adminPanel) adminPanel.hidden = true;
    }
  }

  function renderCategories() {
    const nav = $('#categories');
    if (nav) {
      nav.innerHTML =
        `<a href="#" class="category-link ${state.category === '' ? 'active' : ''}" data-category="">All discussions</a>` +
        state.categories
          .map(
            (c) =>
              `<a href="#" class="category-link ${state.category === c.slug ? 'active' : ''} ${c.slug === 'announcements' ? 'category-link-announcements' : ''}" data-category="${escapeHtml(c.slug)}">${escapeHtml(c.name)}<small>${escapeHtml(c.description)}</small></a>`
          )
          .join('');
    }
    const select = $('#topic-category');
    if (select) {
      select.innerHTML = state.categories
        .map((c) => {
          const isAdminOnly = c.slug === 'announcements' && !state.user?.admin;
          return `<option value="${escapeHtml(c.slug)}" ${isAdminOnly ? 'disabled' : ''}>${escapeHtml(c.name)}${isAdminOnly ? ' (Admin only)' : ''}</option>`;
        })
        .join('');
    }
  }

  async function loadTopics() {
    const list = $('#topic-list');
    if (!list) return;
    list.innerHTML = '<div class="empty-state">Loading discussions…</div>';
    try {
      const data = await request('topics', { params: { category: state.category, q: state.search } });
      state.topics = data.topics || [];
      renderTopics();
    } catch (e) {
      list.innerHTML = `<div class="empty-state">${escapeHtml(e.message)}</div>`;
    }
  }

  function renderTopics() {
    const heading = $('#list-heading');
    if (heading) {
      heading.textContent = state.category
        ? (state.categories.find((c) => c.slug === state.category)?.name || 'Discussions')
        : 'Latest discussions';
    }
    const countBadge = $('#topic-count');
    if (countBadge) {
      countBadge.textContent = `${state.topics.length} ${state.topics.length === 1 ? 'topic' : 'topics'}`;
    }
    const list = $('#topic-list');
    if (!list) return;
    if (!state.topics.length) {
      list.innerHTML = '<div class="empty-state">No discussions found. Start one and be the first to share.</div>';
      return;
    }
    list.innerHTML = state.topics
      .map((t) => {
        const hasReplies = Number(t.reply_count) > 0;
        const lastUser = hasReplies && t.last_reply_user ? t.last_reply_user : (t.display_name || t.login);
        const lastTime = hasReplies && t.last_reply_at ? t.last_reply_at : t.created_at;
        const lastPrefix = hasReplies ? 'Re: ' : '';
        const lastTitle = `${lastPrefix}${t.title}`;
        const isPinned = isTrue(t.is_pinned);

        return `
        <article class="topic-card ${isPinned ? 'topic-card-pinned' : ''}">
          <div class="topic-col-main">
            <div class="topic-title-row">
              ${
                isPinned
                  ? `<span class="badge badge-pinned" title="Pinned Announcement">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M16 3l1 1-3 3 5 5-2 2-5-5-3 3-1-1 4-4-5-5 2-2 5 5 2-2z"/>
                        <line x1="12" y1="12" x2="4" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                      </svg>
                      Pinned
                    </span>`
                  : ''
              }
              <a class="topic-title" href="#topic-${t.id}" data-open-topic="${t.id}">${escapeHtml(t.title)}</a>
            </div>
            <p class="topic-excerpt">${escapeHtml(shortText(t.body))}</p>
            <div class="topic-meta">
              <span>by <strong>${escapeHtml(t.display_name || t.login)}</strong></span>
              <span class="meta-dot" aria-hidden="true">•</span>
              <span>${dateText(t.created_at)}</span>
              ${
                state.user?.admin
                  ? `<button class="text-button admin-pin-btn" data-pin-topic="${t.id}" data-pinned="${isPinned ? 'true' : 'false'}" style="color:var(--accent);font-size:0.8rem;font-weight:600;margin-left:0.5rem;cursor:pointer;" title="${isPinned ? 'Unpin this discussion' : 'Pin to top of discussions'}">${isPinned ? 'Unpin' : 'Pin to Top'}</button>
                     <button class="text-button admin-delete-btn" data-delete-topic="${t.id}" style="color:#ef4444;font-size:0.8rem;font-weight:600;margin-left:0.5rem;cursor:pointer;" title="Delete this discussion as admin">Delete</button>`
                  : ''
              }
            </div>
          </div>
          <div class="topic-col-category">
            <a href="#${t.category_slug}" data-category="${t.category_slug}" class="topic-category-link" title="Filter by ${escapeHtml(t.category_name)}">${escapeHtml(t.category_name)}</a>
          </div>
          <div class="topic-col-votes">
            <span class="stat-number stat-votes-num">${Number(t.score) || 0}</span>
          </div>
          <div class="topic-col-replies">
            <span class="stat-number stat-replies-num">${Number(t.reply_count) || 0}</span>
          </div>
          <div class="topic-col-last-post">
            <a class="last-post-title" href="#topic-${t.id}" data-open-topic="${t.id}" title="${escapeHtml(lastTitle)}">${escapeHtml(lastTitle)}</a>
            <div class="last-post-byline">
              <span class="last-post-author">by <strong>${escapeHtml(lastUser)}</strong></span>
              <a href="#topic-${t.id}" data-open-topic="${t.id}" class="last-post-jump" aria-label="Jump to last post" title="View discussion">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </div>
            <time class="last-post-time" datetime="${escapeHtml(lastTime)}">${formatDateTime(lastTime)}</time>
          </div>
          <div class="topic-card-mobile-meta">
            <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
              <a href="#${t.category_slug}" data-category="${t.category_slug}" class="topic-category-link">${escapeHtml(t.category_name)}</a>
              <div class="topic-card-mobile-stats">
                <span class="mobile-stat-text"><strong>${Number(t.score) || 0}</strong> votes</span>
                <span class="mobile-stat-dot">•</span>
                <span class="mobile-stat-text"><strong>${Number(t.reply_count) || 0}</strong> replies</span>
              </div>
            </div>
            <div class="mobile-last-post">
              <span>Last post: <strong>${escapeHtml(lastUser)}</strong> • ${formatDateTime(lastTime)}</span>
            </div>
          </div>
        </article>
      `;
      })
      .join('');
  }

  async function openTopic(id) {
    try {
      const data = await request('topic', { params: { id } });
      state.activeTopic = data.topic;
      renderTopicDetail(data.topic, data.replies || []);
      const dialog = $('#topic-dialog');
      if (dialog) dialog.showModal();
    } catch (e) {
      toast(e.message);
    }
  }

  function voteControls(kind, id, score, myVote) {
    const isTopicPinned = kind === 'topic' && isTrue(state.activeTopic?.is_pinned);
    return `
      <div class="detail-actions">
        <button class="vote-button ${Number(myVote) === 1 ? 'selected' : ''}" data-vote-kind="${kind}" data-vote-id="${id}" data-vote-value="1" aria-label="Upvote">Upvote</button>
        <button class="vote-button ${Number(myVote) === -1 ? 'selected' : ''}" data-vote-kind="${kind}" data-vote-id="${id}" data-vote-value="-1" aria-label="Downvote">Downvote</button>
        <span class="muted">${Number(score) || 0} net votes</span>
        <button class="text-button" data-report-kind="${kind}" data-report-id="${id}">Report</button>
        ${
          state.user?.admin
            ? `${kind === 'topic' ? `<button class="text-button admin-pin-btn" data-pin-topic="${id}" data-pinned="${isTopicPinned ? 'true' : 'false'}" style="color:var(--accent);font-weight:600;cursor:pointer;">${isTopicPinned ? 'Unpin' : 'Pin to Top'}</button>` : ''}
              <button class="text-button" data-hide-kind="${kind}" data-hide-id="${id}" data-hide-value="${
                kind === 'topic' && isTrue(state.activeTopic?.is_hidden) ? 'false' : 'true'
              }">${kind === 'topic' && isTrue(state.activeTopic?.is_hidden) ? 'Unhide' : 'Hide'}</button>
              <button class="text-button admin-delete-btn" data-delete-${kind}="${id}" style="color:#ef4444;font-weight:600;cursor:pointer;" title="Permanently delete as admin">Delete</button>`
            : ''
        }
      </div>
    `;
  }

  function renderTopicDetail(t, replies) {
    const root = $('#topic-detail');
    if (!root) return;
    const isPinned = isTrue(t.is_pinned);
    root.innerHTML = `
      <div class="dialog-heading">
        <div class="detail-header">
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.25rem;">
            <p class="eyebrow" style="margin:0;">${escapeHtml(t.category_name)}</p>
            ${
              isPinned
                ? `<span class="badge badge-pinned" title="Pinned Announcement">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 3l1 1-3 3 5 5-2 2-5-5-3 3-1-1 4-4-5-5 2-2 5 5 2-2z"/>
                      <line x1="12" y1="12" x2="4" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                    Pinned Announcement
                  </span>`
                : ''
            }
          </div>
          <h2>${escapeHtml(t.title)}</h2>
          <div class="topic-meta">
            <span>Posted by ${escapeHtml(t.display_name || t.login)}</span>
            <span>${dateText(t.created_at)}</span>
          </div>
        </div>
        <button type="button" class="close-button" data-close="topic-dialog" aria-label="Close">×</button>
      </div>
      <div class="detail-body">${escapeHtml(t.body)}</div>
      ${voteControls('topic', t.id, t.score, t.my_vote)}
      <h3 class="reply-heading">Replies (${replies.length})</h3>
      <div class="replies">
        ${
          replies.length
            ? replies
                .map(
                  (r) => `
              <article class="reply">
                <div class="topic-meta">
                  <strong>${escapeHtml(r.display_name || r.login)}</strong>
                  <span>${dateText(r.created_at)}</span>
                  ${isTrue(r.is_hidden) ? '<span class="badge badge-paid">Hidden</span>' : ''}
                </div>
                <div class="reply-body">${escapeHtml(r.body)}</div>
                ${voteControls('reply', r.id, r.score, r.my_vote)}
              </article>
            `
                )
                .join('')
            : '<p class="muted">No replies yet. Start the conversation.</p>'
        }
      </div>
      ${
        state.user
          ? `
        <form id="reply-form" class="reply-form">
          <label for="reply-body">Add a reply</label>
          <textarea id="reply-body" maxlength="10000" minlength="2" required placeholder="Share a helpful reply…"></textarea>
          <p id="reply-message" class="form-message" role="status"></p>
          <div><button class="button" type="submit">Post reply</button></div>
        </form>
      `
          : '<p class="muted"><a href="/community/oauth?action=login">Sign in with GitHub</a> to reply or vote.</p>'
      }
    `;
  }

  async function loadReports() {
    const adminPanel = $('#admin-panel');
    if (!state.user?.admin) {
      if (adminPanel) adminPanel.hidden = true;
      return;
    }
    const box = $('#reports-list');
    if (!box) return;
    try {
      const data = await request('admin_reports');
      if (!data.reports || !data.reports.length) {
        if (adminPanel) adminPanel.hidden = true;
        box.innerHTML = '';
        return;
      }
      if (adminPanel) adminPanel.hidden = false;
      box.innerHTML = data.reports
        .map(
          (r) => `
        <article class="report-card">
          <div class="topic-meta">
            <strong>Report #${r.id}</strong>
            <span>by ${escapeHtml(r.reporter_login)}</span>
            <span>${dateText(r.created_at)}</span>
          </div>
          <p><strong>${r.topic_id ? 'Topic: ' + escapeHtml(r.topic_title || 'Untitled') : 'Reply on topic #' + escapeHtml(r.reply_id)}</strong></p>
          ${r.reply_body ? `<p>${escapeHtml(shortText(r.reply_body, 300))}</p>` : ''}
          <p>${escapeHtml(r.reason)}</p>
          <div class="report-actions">
            ${r.topic_id ? `<button class="button button-quiet" data-hide-kind="topic" data-hide-id="${r.topic_id}" data-hide-value="true">Hide topic</button>` : ''}
            ${r.topic_id ? `<button class="button" data-delete-topic="${r.topic_id}" style="background:#ef4444;color:#fff;border-color:#ef4444;">Delete topic</button>` : ''}
            ${r.reply_id ? `<button class="button button-quiet" data-hide-kind="reply" data-hide-id="${r.reply_id}" data-hide-value="true">Hide reply</button>` : ''}
            ${r.reply_id ? `<button class="button" data-delete-reply="${r.reply_id}" style="background:#ef4444;color:#fff;border-color:#ef4444;">Delete reply</button>` : ''}
            <button class="button" data-review-report="${r.id}" data-review-status="resolved">Mark reviewed</button>
            <button class="button button-quiet" data-review-report="${r.id}" data-review-status="dismissed">Dismiss</button>
          </div>
        </article>
      `
        )
        .join('');
    } catch (e) {
      if (adminPanel) adminPanel.hidden = true;
      box.innerHTML = `<p class="muted">${escapeHtml(e.message)}</p>`;
    }
  }

  async function refreshTopic() {
    if (state.activeTopic) await openTopic(state.activeTopic.id);
  }

  // Global delegated click handler
  document.addEventListener('click', async (e) => {
    const cat = e.target.closest('[data-category]');
    if (cat) {
      e.preventDefault();
      state.category = cat.dataset.category;
      renderCategories();
      loadTopics();
      return;
    }

    const open = e.target.closest('[data-open-topic]');
    if (open) {
      e.preventDefault();
      openTopic(open.dataset.openTopic);
      return;
    }

    const close = e.target.closest('[data-close]');
    if (close) {
      const dialog = $('#' + close.dataset.close);
      if (dialog) dialog.close();
      return;
    }

    // Close native dialog on backdrop click
    if (e.target && e.target.nodeName === 'DIALOG') {
      const rect = e.target.getBoundingClientRect();
      const clickedInside = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!clickedInside) {
        e.target.close();
        return;
      }
    }

    const vote = e.target.closest('[data-vote-kind]');
    if (vote) {
      if (!state.user) {
        toast('Sign in with GitHub to vote.');
        return;
      }
      try {
        await request('vote', {
          method: 'POST',
          body: {
            kind: vote.dataset.voteKind,
            id: Number(vote.dataset.voteId),
            value: Number(vote.dataset.voteValue)
          }
        });
        await loadTopics();
        if (state.activeTopic) await refreshTopic();
      } catch (err) {
        toast(err.message);
      }
      return;
    }

    const report = e.target.closest('[data-report-kind]');
    if (report) {
      if (!state.user) {
        toast('Sign in with GitHub to report content.');
        return;
      }
      state.reportTarget = {
        kind: report.dataset.reportKind,
        id: Number(report.dataset.reportId)
      };
      const rReason = $('#report-reason');
      if (rReason) rReason.value = '';
      const rMsg = $('#report-message');
      if (rMsg) rMsg.textContent = '';
      const rDialog = $('#report-dialog');
      if (rDialog) rDialog.showModal();
      return;
    }

    const hide = e.target.closest('[data-hide-kind]');
    if (hide) {
      if (!state.user?.admin) return;
      try {
        await request('moderate', {
          method: 'POST',
          body: {
            kind: hide.dataset.hideKind,
            id: Number(hide.dataset.hideId),
            hidden: hide.dataset.hideValue === 'true'
          }
        });
        toast(hide.dataset.hideValue === 'true' ? 'Content hidden.' : 'Content restored.');
        await loadTopics();
        if (state.activeTopic) await refreshTopic();
        loadReports();
      } catch (err) {
        toast(err.message);
      }
      return;
    }

    const review = e.target.closest('[data-review-report]');
    if (review) {
      try {
        await request('review_report', {
          method: 'POST',
          body: {
            id: Number(review.dataset.reviewReport),
            status: review.dataset.reviewStatus
          }
        });
        toast('Report updated.');
        loadReports();
      } catch (err) {
        toast(err.message);
      }
      return;
    }

    const delTopic = e.target.closest('[data-delete-topic]');
    if (delTopic) {
      if (!state.user?.admin) return;
      const topicId = Number(delTopic.dataset.deleteTopic);
      if (!confirm('Are you sure you want to permanently delete this discussion? All replies and votes will also be deleted.')) {
        return;
      }
      try {
        await request('delete_topic', {
          method: 'POST',
          body: { id: topicId }
        });
        toast('Discussion permanently deleted.');
        const dialog = $('#topic-dialog');
        if (dialog && dialog.open) dialog.close();
        await loadTopics();
        if (state.user?.admin) loadReports();
      } catch (err) {
        toast(err.message);
      }
      return;
    }

    const delReply = e.target.closest('[data-delete-reply]');
    if (delReply) {
      if (!state.user?.admin) return;
      const replyId = Number(delReply.dataset.deleteReply);
      if (!confirm('Are you sure you want to permanently delete this reply?')) {
        return;
      }
      try {
        await request('delete_reply', {
          method: 'POST',
          body: { id: replyId }
        });
        toast('Reply permanently deleted.');
        await refreshTopic();
        if (state.user?.admin) loadReports();
      } catch (err) {
        toast(err.message);
      }
      return;
    }

    const pinBtn = e.target.closest('[data-pin-topic]');
    if (pinBtn) {
      if (!state.user?.admin) return;
      const topicId = Number(pinBtn.dataset.pinTopic);
      const currentlyPinned = pinBtn.dataset.pinned === 'true';
      try {
        const res = await request('pin_topic', {
          method: 'POST',
          body: { id: topicId, pinned: !currentlyPinned }
        });
        toast(res.is_pinned ? 'Discussion pinned to top.' : 'Discussion unpinned.');
        await loadTopics();
        if (state.activeTopic && state.activeTopic.id == topicId) {
          state.activeTopic.is_pinned = res.is_pinned;
          await refreshTopic();
        }
      } catch (err) {
        toast(err.message);
      }
      return;
    }
  });

  // Start discussion button & modal
  const newTopicBtn = $('#new-topic');
  if (newTopicBtn) {
    newTopicBtn.addEventListener('click', () => {
      if (!state.user) {
        const aModal = $('#auth-modal');
        if (aModal && typeof aModal.showModal === 'function') {
          aModal.showModal();
        } else {
          openAuthPopup();
        }
        return;
      }
      const cMsg = $('#compose-message');
      if (cMsg) cMsg.textContent = '';
      const cForm = $('#compose-form');
      if (cForm) cForm.reset();
      const pinWrap = $('#compose-pinned-wrap');
      const pinCheck = $('#topic-pinned');
      if (pinWrap) pinWrap.style.display = state.user?.admin ? 'flex' : 'none';
      if (pinCheck) {
        const catEl = $('#topic-category');
        pinCheck.checked = Boolean(catEl && catEl.value === 'announcements');
      }
      const cDialog = $('#compose-dialog');
      if (cDialog) cDialog.showModal();
    });
  }

  const topicCatSelect = $('#topic-category');
  if (topicCatSelect) {
    topicCatSelect.addEventListener('change', () => {
      const pinCheck = $('#topic-pinned');
      if (pinCheck && state.user?.admin) {
        if (topicCatSelect.value === 'announcements') {
          pinCheck.checked = true;
        }
      }
    });
  }

  const composeForm = $('#compose-form');
  if (composeForm) {
    composeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.submitter;
      if (button) button.disabled = true;
      const msgEl = $('#compose-message');
      if (msgEl) msgEl.textContent = 'Publishing…';
      try {
        const titleEl = $('#topic-title');
        const catEl = $('#topic-category');
        const bodyEl = $('#topic-body');
        const pinCheck = $('#topic-pinned');
        const data = await request('create_topic', {
          method: 'POST',
          body: {
            title: titleEl ? titleEl.value : '',
            category: catEl ? catEl.value : '',
            body: bodyEl ? bodyEl.value : '',
            pinned: Boolean(pinCheck && pinCheck.checked)
          }
        });
        const cDialog = $('#compose-dialog');
        if (cDialog) cDialog.close();
        toast('Discussion published.');
        state.category = '';
        state.search = '';
        const s = $('#search');
        if (s) {
          s.value = '';
          updateClearBtn();
        }
        renderCategories();
        await loadTopics();
        openTopic(data.id);
      } catch (err) {
        if (msgEl) msgEl.textContent = err.message;
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  // Reply form submission
  const topicDialog = $('#topic-dialog');
  if (topicDialog) {
    topicDialog.addEventListener('submit', async (e) => {
      if (e.target.id !== 'reply-form') return;
      e.preventDefault();
      const button = e.submitter;
      if (button) button.disabled = true;
      const msgEl = $('#reply-message');
      if (msgEl) msgEl.textContent = 'Posting…';
      try {
        const replyBodyEl = $('#reply-body');
        await request('reply', {
          method: 'POST',
          body: {
            topic_id: Number(state.activeTopic.id),
            body: replyBodyEl ? replyBodyEl.value : ''
          }
        });
        toast('Reply posted.');
        await refreshTopic();
        await loadTopics();
      } catch (err) {
        if (msgEl) msgEl.textContent = err.message;
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  // Report submission
  const reportForm = $('#report-form');
  if (reportForm) {
    reportForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.submitter;
      if (button) button.disabled = true;
      const msgEl = $('#report-message');
      if (msgEl) msgEl.textContent = 'Sending…';
      try {
        const rReasonEl = $('#report-reason');
        await request('report', {
          method: 'POST',
          body: {
            ...state.reportTarget,
            reason: rReasonEl ? rReasonEl.value : ''
          }
        });
        const rDialog = $('#report-dialog');
        if (rDialog) rDialog.close();
        toast('Report sent to the moderators.');
        if (state.user?.admin) loadReports();
      } catch (err) {
        if (msgEl) msgEl.textContent = err.message;
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  // Search input and debounce
  let searchTimer;
  const searchEl = $('#search');
  const searchClearBtn = $('#search-clear');

  function updateClearBtn() {
    if (searchClearBtn) {
      searchClearBtn.style.display = searchEl && searchEl.value ? 'inline-flex' : 'none';
    }
  }

  if (searchEl) {
    searchEl.addEventListener('input', () => {
      updateClearBtn();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.search = searchEl.value.trim();
        loadTopics();
      }, 250);
    });

    searchEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchEl.value = '';
        updateClearBtn();
        state.search = '';
        loadTopics();
      }
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchEl) {
        searchEl.value = '';
        searchEl.focus();
      }
      updateClearBtn();
      state.search = '';
      loadTopics();
    });
  }

  // Admin refresh
  const refreshBtn = $('#refresh-reports');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadReports());
  }

  // Centered OAuth Popup modal window
  function openAuthPopup(url = '/community/oauth?action=login') {
    const width = 600;
    const height = 720;

    // Dual-screen / multi-monitor aware centering
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    const w = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const h = window.innerHeight || document.documentElement.clientHeight || screen.height;

    const left = Math.max(0, Math.round(dualScreenLeft + (w - width) / 2));
    const top = Math.max(0, Math.round(dualScreenTop + (h - height) / 2));

    const popup = window.open(
      url,
      'staticstack_oauth_popup',
      `scrollbars=yes,width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // Browser popup blocker engaged, fallback to standard navigation
      window.location.href = url;
      return null;
    }

    if (popup.focus) {
      popup.focus();
    }

    // Polling fallback to check if popup closed or completed
    let pollCount = 0;
    const pollTimer = setInterval(async () => {
      pollCount++;
      if (pollCount > 300) {
        clearInterval(pollTimer);
        return;
      }
      if (popup.closed) {
        clearInterval(pollTimer);
        // Check if user session updated
        try {
          const data = await request('bootstrap');
          if (data.user && (!state.user || state.user.login !== data.user.login)) {
            handleAuthSuccess(data);
          }
        } catch {}
      }
    }, 1000);

    return popup;
  }

  async function handleAuthSuccess(bootstrapData) {
    try {
      const data = bootstrapData || await request('bootstrap');
      state.user = data.user;
      state.categories = data.categories || state.categories;
      accountView();
      const aModal = $('#auth-modal');
      if (aModal && aModal.open) aModal.close();

      renderCategories();
      await loadTopics();
      if (state.activeTopic) {
        renderTopic(state.activeTopic);
      }
      if (data.user) {
        toast(`Signed in as ${data.user.name || data.user.login}`);
      }
    } catch (e) {
      console.error('Failed to sync authentication state:', e);
    }
  }

  // Cross-window postMessage listener from popup
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'staticstack-oauth-success') {
      handleAuthSuccess();
    }
  });

  // Global click interception for GitHub sign-in links
  document.addEventListener('click', (e) => {
    // If clicking inside the auth modal login button, trigger the popup and close the modal
    const modalLoginBtn = e.target.closest('#auth-modal-login-btn');
    if (modalLoginBtn) {
      e.preventDefault();
      const aModal = $('#auth-modal');
      if (aModal) aModal.close();
      openAuthPopup(modalLoginBtn.href);
      return;
    }

    const authLink = e.target.closest('a[href*="/community/oauth?action=login"]');
    if (authLink) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      const aModal = $('#auth-modal');
      if (aModal && typeof aModal.showModal === 'function') {
        aModal.showModal();
      } else {
        openAuthPopup(authLink.href);
      }
    }
  });

  // Application bootstrap
  async function init() {
    try {
      const data = await request('bootstrap');
      state.user = data.user;
      state.categories = data.categories || [];
      renderCategories();
      accountView();
      await loadTopics();
    } catch (e) {
      const list = $('#topic-list');
      if (list) {
        list.innerHTML = `<div class="empty-state">Could not connect to the forum API. Check the Wasmer deployment and database setup.<br><small>${escapeHtml(e.message)}</small></div>`;
      }
    }
  }

  init();
})();
