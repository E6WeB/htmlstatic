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
        `<a href="/community/" class="category-link ${state.category === '' ? 'active' : ''}" data-category="">All discussions</a>` +
        state.categories
          .map(
            (c) =>
              `<a href="/community/?channel=${encodeURIComponent(c.slug)}" class="category-link ${state.category === c.slug ? 'active' : ''} ${c.slug === 'announcements' ? 'category-link-announcements' : ''}" data-category="${escapeHtml(c.slug)}">${escapeHtml(c.name)}<small>${escapeHtml(c.description)}</small></a>`
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

  function canEditTopic(t) {
    if (!t || !state.user) return false;
    if (Boolean(state.user.admin)) return true;
    const isOwner = Boolean(
      (state.user.uid && t.author_id && String(state.user.uid) === String(t.author_id)) ||
      (state.user.login && t.login && state.user.login.toLowerCase() === t.login.toLowerCase())
    );
    return Boolean(isOwner && !isTrue(t.is_locked));
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
        const isLocked = isTrue(t.is_locked);

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
              ${
                isLocked
                  ? `<span class="badge badge-locked" title="Locked Discussion">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Locked
                    </span>`
                  : ''
              }
              <a class="topic-title" href="/community/topic?id=${t.id}">${escapeHtml(t.title)}</a>
            </div>
            <p class="topic-excerpt">${escapeHtml(shortText(t.body, 140))}</p>
            <div class="topic-meta">
              <span>by <strong>${escapeHtml(t.display_name || t.login)}</strong></span>
              <span class="meta-dot" aria-hidden="true">•</span>
              <span>${dateText(t.created_at)}</span>
              ${
                canEditTopic(t)
                  ? `<a href="/community/topic?id=${t.id}#edit" class="text-button op-card-edit-btn" style="color:var(--accent);font-size:0.8rem;font-weight:600;margin-left:0.5rem;text-decoration:none;" title="Edit this discussion">Edit</a>`
                  : ''
              }
              ${
                state.user?.admin
                  ? `<button class="text-button admin-pin-btn" data-pin-topic="${t.id}" data-pinned="${isPinned ? 'true' : 'false'}" style="color:var(--accent);font-size:0.8rem;font-weight:600;margin-left:0.5rem;cursor:pointer;" title="${isPinned ? 'Unpin this discussion' : 'Pin to top'}">${isPinned ? 'Unpin' : 'Pin'}</button>
                     <button class="text-button admin-lock-btn" data-lock-topic="${t.id}" data-locked="${isLocked ? 'true' : 'false'}" style="color:#d97706;font-size:0.8rem;font-weight:600;margin-left:0.5rem;cursor:pointer;" title="${isLocked ? 'Unlock discussion' : 'Lock discussion'}">${isLocked ? 'Unlock' : 'Lock'}</button>
                     <button class="text-button admin-delete-btn" data-delete-topic="${t.id}" style="color:#ef4444;font-size:0.8rem;font-weight:600;margin-left:0.5rem;cursor:pointer;" title="Delete this discussion as admin">Delete</button>`
                  : ''
              }
            </div>
          </div>
          <div class="topic-col-category">
            <a href="/community/?channel=${t.category_slug}" data-category="${t.category_slug}" class="topic-category-link" title="Filter by ${escapeHtml(t.category_name)}">${escapeHtml(t.category_name)}</a>
          </div>
          <div class="topic-col-votes">
            <span class="stat-number stat-votes-num">${Number(t.score) || 0}</span>
          </div>
          <div class="topic-col-replies">
            <span class="stat-number stat-replies-num">${Number(t.reply_count) || 0}</span>
          </div>
          <div class="topic-col-last-post">
            <a class="last-post-title" href="/community/topic?id=${t.id}" title="${escapeHtml(lastTitle)}">${escapeHtml(lastTitle)}</a>
            <div class="last-post-byline">
              <span class="last-post-author">by <strong>${escapeHtml(lastUser)}</strong></span>
              <a href="/community/topic?id=${t.id}" class="last-post-jump" aria-label="Jump to discussion" title="View discussion">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </div>
            <time class="last-post-time" datetime="${escapeHtml(lastTime)}">${formatDateTime(lastTime)}</time>
          </div>
          <div class="topic-card-mobile-meta">
            <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
              <a href="/community/?channel=${t.category_slug}" data-category="${t.category_slug}" class="topic-category-link">${escapeHtml(t.category_name)}</a>
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

  async function loadTopicThread(id) {
    const loadingEl = $('#thread-loading');
    const errorEl = $('#thread-error');
    const contentEl = $('#thread-content');
    if (!contentEl) return;

    if (loadingEl) loadingEl.style.display = 'block';
    if (errorEl) errorEl.style.display = 'none';
    contentEl.style.display = 'none';

    try {
      const data = await request('topic', { params: { id } });
      const t = data.topic;
      const replies = data.replies || [];
      state.activeTopic = t;

      // Update document titles & metadata
      document.title = `${t.title} - StaticStack Community`;
      const metaDesc = $('meta[name="description"]');
      if (metaDesc) metaDesc.content = shortText(t.body, 160);
      const ogTitle = $('#og-title');
      if (ogTitle) ogTitle.content = `${t.title} - StaticStack Community`;
      const twTitle = $('#tw-title');
      if (twTitle) twTitle.content = `${t.title} - StaticStack Community`;

      // Highlight the channel in Discussion Channels widget
      state.category = t.category_slug || '';
      renderCategories();

      // Update breadcrumbs
      const crumbCat = $('#crumb-category');
      if (crumbCat) {
        crumbCat.innerHTML = `<a href="/community/?channel=${escapeHtml(t.category_slug)}" style="color:inherit;text-decoration:none;">${escapeHtml(t.category_name)}</a>`;
      }
      const crumbTitle = $('#crumb-title');
      if (crumbTitle) crumbTitle.textContent = shortText(t.title, 40);

      // Hero
      const heroTitle = $('#thread-title');
      if (heroTitle) heroTitle.textContent = t.title;

      const heroBadges = $('#hero-badge-wrap');
      if (heroBadges) {
        const isPinned = isTrue(t.is_pinned);
        const isLocked = isTrue(t.is_locked);
        heroBadges.innerHTML = `
          <a href="/community/?channel=${escapeHtml(t.category_slug)}" class="topic-category-link">${escapeHtml(t.category_name)}</a>
          ${isPinned ? '<span class="badge badge-pinned"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M16 3l1 1-3 3 5 5-2 2-5-5-3 3-1-1 4-4-5-5 2-2 5 5 2-2z"/><line x1="12" y1="12" x2="4" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg> Pinned Announcement</span>' : ''}
          ${isLocked ? '<span class="badge badge-locked"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Locked</span>' : ''}
        `;
      }

      const heroMeta = $('#thread-hero-meta');
      if (heroMeta) {
        heroMeta.innerHTML = `Posted by <strong>${escapeHtml(t.display_name || t.login)}</strong> on ${formatDateTime(t.created_at)} • <strong>${replies.length}</strong> ${replies.length === 1 ? 'reply' : 'replies'} • <strong>${Number(t.score) || 0}</strong> net votes`;
      }

      // Sidebar Overview Widget
      const sbChannel = $('#sb-channel');
      if (sbChannel) {
        sbChannel.innerHTML = `<a href="/community/?channel=${escapeHtml(t.category_slug)}" class="topic-category-link">${escapeHtml(t.category_name)}</a>`;
      }
      const sbAuthor = $('#sb-author');
      if (sbAuthor) sbAuthor.textContent = t.display_name || t.login;
      const sbDate = $('#sb-date');
      if (sbDate) sbDate.textContent = formatDateTime(t.created_at);
      const sbReplies = $('#sb-replies');
      if (sbReplies) sbReplies.textContent = replies.length;
      const sbScore = $('#sb-score');
      if (sbScore) sbScore.textContent = Number(t.score) || 0;
      const sbStatus = $('#sb-status');
      if (sbStatus) {
        const isLocked = isTrue(t.is_locked);
        sbStatus.innerHTML = isLocked
          ? '<span style="color:#d97706;display:inline-flex;align-items:center;gap:0.3rem;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Locked</span>'
          : '<span style="color:#10b981;display:inline-flex;align-items:center;gap:0.3rem;"><span style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block;"></span> Open</span>';
      }

      // Render Original Post (OP)
      const opAvatar = $('#op-avatar');
      if (opAvatar) {
        opAvatar.src = t.avatar_url || `https://github.com/${escapeHtml(t.login)}.png?size=80`;
      }
      const opAuthorName = $('#op-author-name');
      if (opAuthorName) opAuthorName.textContent = t.display_name || t.login;
      const opAuthorHandle = $('#op-author-handle');
      if (opAuthorHandle) opAuthorHandle.textContent = `@${t.login}`;
      const opRole = $('#op-role-badge');
      if (opRole) {
        const isAdmin = Boolean(t.login && t.login.toLowerCase() === 'e6web');
        opRole.innerHTML = isAdmin
          ? '<span class="badge-admin">Admin</span>'
          : '<span class="badge-op">Author</span>';
      }
      const opTime = $('#op-time');
      if (opTime) {
        opTime.textContent = formatDateTime(t.created_at);
      }
      const editedLabel = $('#op-edited-label');
      if (editedLabel) {
        const wasEdited = t.updated_at && (new Date(t.updated_at).getTime() - new Date(t.created_at).getTime() > 2000);
        editedLabel.style.display = wasEdited ? 'inline' : 'none';
        if (wasEdited) {
          editedLabel.title = `Last edited ${formatDateTime(t.updated_at)}`;
        }
      }
      const opCategoryPill = $('#op-category-pill');
      if (opCategoryPill) {
        opCategoryPill.innerHTML = `<a href="/community/?channel=${escapeHtml(t.category_slug)}" class="topic-category-link">${escapeHtml(t.category_name)}</a>`;
      }
      const opBody = $('#op-body');
      if (opBody) {
        opBody.textContent = t.body;
      }
      const opActions = $('#op-actions');
      if (opActions) {
        opActions.innerHTML = voteControls('topic', t.id, t.score, t.my_vote);
      }

      // Render Replies
      const repliesCountNum = $('#replies-count-num');
      if (repliesCountNum) repliesCountNum.textContent = replies.length;

      const repliesList = $('#thread-replies-list');
      if (repliesList) {
        if (!replies.length) {
          repliesList.innerHTML = `<div class="empty-state" style="padding:2.5rem 1.5rem;">No replies yet. Be the first to share an answer or thoughts!</div>`;
        } else {
          repliesList.innerHTML = replies.map((r, index) => {
            const isOP = r.author_id === t.author_id;
            const isAdmin = Boolean(r.login && r.login.toLowerCase() === 'e6web');
            const avatar = r.avatar_url || `https://github.com/${escapeHtml(r.login)}.png?size=80`;
            return `
              <article class="thread-reply-card ${isTrue(r.is_hidden) ? 'reply-hidden' : ''}" id="reply-${r.id}">
                <div class="thread-author-row" style="margin-bottom:0.75rem;padding-bottom:0.65rem;">
                  <div class="thread-author-info">
                    <img class="thread-avatar" style="width:36px;height:36px;" src="${avatar}" alt="${escapeHtml(r.display_name || r.login)}">
                    <div>
                      <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;">
                        <strong style="color:var(--text-main);font-size:0.9rem;">${escapeHtml(r.display_name || r.login)}</strong>
                        <span style="color:var(--text-subtle);font-size:0.75rem;">@${escapeHtml(r.login)}</span>
                        ${isAdmin ? '<span class="badge-admin">Admin</span>' : (isOP ? '<span class="badge-op">Author</span>' : '')}
                        ${isTrue(r.is_hidden) ? '<span class="badge badge-paid">Hidden</span>' : ''}
                      </div>
                      <time class="muted" style="font-size:0.72rem;display:block;margin-top:2px;">${formatDateTime(r.created_at)}</time>
                    </div>
                  </div>
                  <span style="font-size:0.75rem;font-weight:700;color:var(--text-subtle);">#${index + 1}</span>
                </div>
                <div class="reply-body" style="font-size:0.95rem;line-height:1.65;margin:0.5rem 0 0.85rem;">${escapeHtml(r.body)}</div>
                ${voteControls('reply', r.id, r.score, r.my_vote)}
              </article>
            `;
          }).join('');
        }
      }

      updateReplyComposerState();

      if (loadingEl) loadingEl.style.display = 'none';
      contentEl.style.display = 'block';

      if (window.location.hash === '#edit' && canEditTopic(t)) {
        setTimeout(() => openTopicEditor(), 60);
      }
    } catch (err) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'block';
    }
  }

  function updateReplyComposerState() {
    const authPrompt = $('#reply-auth-prompt');
    const form = $('#thread-reply-form');
    const lockedPrompt = $('#reply-locked-prompt');
    const userLabel = $('#replying-user-label');
    if (!authPrompt || !form) return;

    const isLocked = isTrue(state.activeTopic?.is_locked);
    const isAdmin = Boolean(state.user?.admin);

    if (isLocked && !isAdmin) {
      if (lockedPrompt) lockedPrompt.style.display = 'block';
      authPrompt.style.display = 'none';
      form.style.display = 'none';
      return;
    }

    if (lockedPrompt) lockedPrompt.style.display = 'none';

    if (state.user) {
      authPrompt.style.display = 'none';
      form.style.display = 'grid';
      if (userLabel) {
        userLabel.innerHTML = `Replying as <strong>${escapeHtml(state.user.name || state.user.login)}</strong>${
          isLocked ? ' <span class="badge badge-locked" style="margin-left:0.5rem;">Locked (Admin override)</span>' : ''
        }`;
      }
    } else {
      authPrompt.style.display = 'block';
      form.style.display = 'none';
    }
  }

  async function openTopic(id) {
    if (Boolean($('#thread-main'))) {
      await loadTopicThread(id);
      return;
    }
    window.location.href = `/community/topic?id=${id}`;
  }

  function voteControls(kind, id, score, myVote) {
    const isTopic = kind === 'topic';
    const isTopicPinned = isTopic && isTrue(state.activeTopic?.is_pinned);
    const isTopicLocked = isTopic && isTrue(state.activeTopic?.is_locked);
    const isTopicHidden = isTopic && isTrue(state.activeTopic?.is_hidden);
    const canEdit = isTopic && canEditTopic(state.activeTopic);
    const scoreVal = Number(score) || 0;
    const scoreClass = scoreVal > 0 ? 'score-positive' : (scoreVal < 0 ? 'score-negative' : '');

    return `
      <div class="detail-actions">
        <!-- Vote Cluster: Upvote Icon, Net Score Icon + Count, Downvote Icon -->
        <div class="vote-cluster" role="group" aria-label="Vote">
          <button class="vote-btn vote-btn-up ${Number(myVote) === 1 ? 'selected' : ''}" data-vote-kind="${kind}" data-vote-id="${id}" data-vote-value="1" aria-label="Upvote" title="Upvote">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          <span class="vote-score-display ${scoreClass}" title="${scoreVal} net votes" aria-label="${scoreVal} net votes">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="vote-metric-icon">
              <path d="M12 2l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 14.24l-4.8 2.52.92-5.34-3.88-3.78 5.36-.78L12 2z"/>
            </svg>
            <span class="score-val">${scoreVal}</span>
          </span>
          <button class="vote-btn vote-btn-down ${Number(myVote) === -1 ? 'selected' : ''}" data-vote-kind="${kind}" data-vote-id="${id}" data-vote-value="-1" aria-label="Downvote" title="Downvote">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        <!-- Report Icon Button -->
        <button class="action-btn report-icon-btn" data-report-kind="${kind}" data-report-id="${id}" aria-label="Report content" title="Report">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
          </svg>
        </button>

        <!-- Edit Discussion Button (for author or admin) -->
        ${
          canEdit
            ? `<button class="action-btn op-edit-btn" data-edit-topic="${id}" title="Edit Discussion" aria-label="Edit Discussion">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span>Edit</span>
              </button>`
            : ''
        }

        <!-- Admin Controls -->
        ${
          state.user?.admin
            ? `
              ${
                isTopic
                  ? `<button class="action-btn admin-pin-btn ${isTopicPinned ? 'is-active' : ''}" data-pin-topic="${id}" data-pinned="${isTopicPinned ? 'true' : 'false'}" title="${isTopicPinned ? 'Unpin Discussion' : 'Pin to Top'}" aria-label="${isTopicPinned ? 'Unpin' : 'Pin'}">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M16 3l1 1-3 3 5 5-2 2-5-5-3 3-1-1 4-4-5-5 2-2 5 5 2-2z"/>
                        <line x1="12" y1="12" x2="4" y2="20"/>
                      </svg>
                      <span>${isTopicPinned ? 'Unpin' : 'Pin'}</span>
                    </button>
                    <button class="action-btn admin-lock-btn ${isTopicLocked ? 'is-locked' : ''}" data-lock-topic="${id}" data-locked="${isTopicLocked ? 'true' : 'false'}" title="${isTopicLocked ? 'Unlock Discussion (allow replies)' : 'Lock Discussion (disable replies)'}" aria-label="${isTopicLocked ? 'Unlock' : 'Lock'}">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        ${
                          isTopicLocked
                            ? '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>'
                            : '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>'
                        }
                      </svg>
                      <span>${isTopicLocked ? 'Unlock' : 'Lock'}</span>
                    </button>`
                  : ''
              }
              <button class="action-btn admin-hide-btn" data-hide-kind="${kind}" data-hide-id="${id}" data-hide-value="${isTopicHidden ? 'false' : 'true'}" title="${isTopicHidden ? 'Unhide content' : 'Hide from public'}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  ${
                    isTopicHidden
                      ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>'
                      : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
                  }
                </svg>
                <span>${isTopicHidden ? 'Unhide' : 'Hide'}</span>
              </button>
              <button class="action-btn admin-delete-btn" data-delete-${kind}="${id}" style="color:#ef4444;" title="Permanently delete as admin" aria-label="Delete">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Delete</span>
              </button>
            `
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
      const selectedCategory = cat.dataset.category || '';
      const isThreadPage = Boolean($('#thread-main'));

      if (isThreadPage) {
        // We are on a topic page (/community/topic?id=...)
        // Navigate to the community listing filtered by this channel
        const targetUrl = selectedCategory
          ? `/community/?channel=${encodeURIComponent(selectedCategory)}`
          : '/community/';
        window.location.href = targetUrl;
        return;
      }

      // We are on the community index (/community/)
      e.preventDefault();
      state.category = selectedCategory;
      const newUrl = selectedCategory
        ? `/community/?channel=${encodeURIComponent(selectedCategory)}`
        : '/community/';
      if (window.history && window.history.pushState) {
        window.history.pushState({ category: selectedCategory }, '', newUrl);
      }
      renderCategories();
      loadTopics();
      return;
    }

    const open = e.target.closest('[data-open-topic]');
    if (open) {
      // Let standard link navigation to /community/topic?id=... take over
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

    const editBtn = e.target.closest('[data-edit-topic]');
    if (editBtn) {
      const topicId = editBtn.dataset.editTopic;
      const isThreadPage = Boolean($('#thread-main'));
      if (isThreadPage) {
        openTopicEditor();
      } else {
        window.location.href = `/community/topic?id=${topicId}#edit`;
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

    const lockBtn = e.target.closest('[data-lock-topic]');
    if (lockBtn) {
      if (!state.user?.admin) return;
      const topicId = Number(lockBtn.dataset.lockTopic);
      const currentlyLocked = lockBtn.dataset.locked === 'true';
      try {
        const res = await request('lock_topic', {
          method: 'POST',
          body: { id: topicId, locked: !currentlyLocked }
        });
        toast(res.is_locked ? 'Discussion locked (replies disabled).' : 'Discussion unlocked.');
        await loadTopics();
        if (state.activeTopic && state.activeTopic.id == topicId) {
          state.activeTopic.is_locked = res.is_locked;
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
        window.location.href = `/community/topic?id=${data.id}`;
      } catch (err) {
        if (msgEl) msgEl.textContent = err.message;
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  // Thread page dedicated reply form submission
  const threadReplyForm = $('#thread-reply-form');
  if (threadReplyForm) {
    threadReplyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = $('#reply-body-input');
      const msg = $('#reply-error-msg');
      const btn = $('#submit-reply-btn');
      if (!input || !state.activeTopic) return;
      const body = input.value.trim();
      if (body.length < 2) {
        if (msg) msg.textContent = 'Reply must be at least 2 characters.';
        return;
      }
      if (btn) btn.disabled = true;
      if (msg) msg.textContent = 'Publishing reply…';
      try {
        await request('reply', {
          method: 'POST',
          body: {
            topic_id: Number(state.activeTopic.id),
            body
          }
        });
        toast('Reply published!');
        input.value = '';
        if (msg) msg.textContent = '';
        await loadTopicThread(state.activeTopic.id);
      } catch (err) {
        if (msg) msg.textContent = err.message;
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }

  // Topic In-Place Editor Functions & Listeners
  function openTopicEditor() {
    const viewMode = $('#op-view-mode');
    const editForm = $('#op-edit-form');
    if (!viewMode || !editForm || !state.activeTopic) return;

    const titleInput = $('#op-edit-title');
    const catSelect = $('#op-edit-category');
    const bodyInput = $('#op-edit-body');
    const errEl = $('#op-edit-error');

    if (titleInput) titleInput.value = state.activeTopic.title || '';
    if (bodyInput) bodyInput.value = state.activeTopic.body || '';
    if (errEl) errEl.textContent = '';

    if (catSelect && state.categories) {
      const currentSlug = state.activeTopic.category_slug;
      catSelect.innerHTML = state.categories
        .filter((c) => c.slug !== 'announcements' || Boolean(state.user?.admin))
        .map((c) => `<option value="${escapeHtml(c.slug)}" ${c.slug === currentSlug ? 'selected' : ''}>${escapeHtml(c.name)}</option>`)
        .join('');
    }

    viewMode.style.display = 'none';
    editForm.style.display = 'block';
    if (window.location.hash !== '#edit') {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search + '#edit');
      } catch (e) {}
    }
    if (titleInput) {
      titleInput.focus();
    }
  }

  function closeTopicEditor() {
    const viewMode = $('#op-view-mode');
    const editForm = $('#op-edit-form');
    if (viewMode) viewMode.style.display = 'block';
    if (editForm) editForm.style.display = 'none';
    const errEl = $('#op-edit-error');
    if (errEl) errEl.textContent = '';
    if (window.location.hash === '#edit') {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {}
    }
  }

  const opEditForm = $('#op-edit-form');
  if (opEditForm) {
    opEditForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!state.activeTopic) return;

      const titleInput = $('#op-edit-title');
      const catSelect = $('#op-edit-category');
      const bodyInput = $('#op-edit-body');
      const errEl = $('#op-edit-error');
      const saveBtn = $('#op-edit-save-btn');

      const title = titleInput ? titleInput.value.trim() : '';
      const category = catSelect ? catSelect.value : '';
      const body = bodyInput ? bodyInput.value.trim() : '';

      if (errEl) errEl.textContent = '';

      if (title.length < 5 || title.length > 180) {
        if (errEl) errEl.textContent = 'Title must be between 5 and 180 characters.';
        return;
      }
      if (body.length < 10 || body.length > 20000) {
        if (errEl) errEl.textContent = 'Discussion body must be between 10 and 20,000 characters.';
        return;
      }

      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
            <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          <span>Saving…</span>
        `;
      }

      try {
        const res = await request('edit_topic', {
          method: 'POST',
          body: {
            id: Number(state.activeTopic.id),
            title,
            category,
            body
          }
        });

        // Update local state
        state.activeTopic.title = res.title || title;
        state.activeTopic.body = res.body || body;
        if (res.category_slug) state.activeTopic.category_slug = res.category_slug;
        if (res.category_name) state.activeTopic.category_name = res.category_name;
        state.activeTopic.updated_at = res.updated_at || new Date().toISOString();

        // Update DOM elements on page
        const threadTitleHeading = $('#thread-title-heading');
        if (threadTitleHeading) threadTitleHeading.textContent = state.activeTopic.title;
        document.title = `${state.activeTopic.title} — StaticStack Community`;

        const opBody = $('#op-body');
        if (opBody) opBody.textContent = state.activeTopic.body;

        const opCategoryPill = $('#op-category-pill');
        if (opCategoryPill) {
          opCategoryPill.innerHTML = `<a href="/community/?channel=${escapeHtml(state.activeTopic.category_slug)}" class="topic-category-link">${escapeHtml(state.activeTopic.category_name)}</a>`;
        }

        const editedLabel = $('#op-edited-label');
        if (editedLabel) {
          editedLabel.style.display = 'inline';
          editedLabel.title = `Last edited ${formatDateTime(state.activeTopic.updated_at)}`;
        }

        closeTopicEditor();
        toast('Discussion updated successfully!');
      } catch (err) {
        if (errEl) errEl.textContent = err.message || 'Failed to update discussion.';
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Save Changes</span>
          `;
        }
      }
    });
  }

  const opEditCancelBtn = $('#op-edit-cancel-btn');
  if (opEditCancelBtn) {
    opEditCancelBtn.addEventListener('click', () => {
      closeTopicEditor();
    });
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#edit' && state.activeTopic && canEditTopic(state.activeTopic)) {
      openTopicEditor();
    }
  });

  // Thread page share button
  const shareThreadBtn = $('#share-thread-btn');
  if (shareThreadBtn) {
    shareThreadBtn.addEventListener('click', async () => {
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: state.activeTopic ? state.activeTopic.title : document.title,
            url: url
          });
          return;
        } catch {}
      }
      try {
        await navigator.clipboard.writeText(url);
        const textSpan = $('#share-btn-text');
        if (textSpan) {
          const original = textSpan.textContent;
          textSpan.textContent = 'Copied Link!';
          setTimeout(() => { textSpan.textContent = original; }, 2500);
        }
        toast('Link copied to clipboard!');
      } catch {
        toast('Could not copy link.');
      }
    });
  }

  // Modal Reply form submission (for fallback)
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
      const isThreadPage = Boolean($('#thread-main'));
      if (isThreadPage) {
        updateReplyComposerState();
        if (state.activeTopic) {
          await loadTopicThread(state.activeTopic.id);
        }
      } else {
        await loadTopics();
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

  function renderForumStats() {
    if (!state.stats) return;
    const s = state.stats;
    const channelsEl = $('#stat-channels-count');
    if (channelsEl && s.channels !== undefined) channelsEl.textContent = s.channels;
    const topicsEl = $('#stat-topics-count');
    if (topicsEl && s.topics !== undefined) topicsEl.textContent = s.topics;
    const repliesEl = $('#stat-replies-count');
    if (repliesEl && s.replies !== undefined) repliesEl.textContent = s.replies;
    const membersEl = $('#stat-members-count');
    if (membersEl && s.members !== undefined) membersEl.textContent = s.members;

    const newestEl = $('#stat-newest-member');
    if (newestEl && s.newest_member_name) {
      newestEl.innerHTML = `<span style="color:var(--text-main);font-weight:600;">${escapeHtml(s.newest_member_name)}</span>${
        s.newest_member_login ? ` <span class="muted" style="font-size:12px;">(@${escapeHtml(s.newest_member_login)})</span>` : ''
      }`;
    }

    const latestEl = $('#stat-latest-post');
    if (latestEl && s.latest_topic_title) {
      latestEl.textContent = s.latest_topic_title;
      latestEl.href = `/community/topic?id=${s.latest_topic_id}`;
      latestEl.title = s.latest_topic_title;
    }
  }

  // Application bootstrap
  async function init() {
    try {
      const data = await request('bootstrap');
      state.user = data.user;
      state.categories = data.categories || [];
      state.stats = data.stats || null;
      renderCategories();
      accountView();
      renderForumStats();

      const isThreadPage = Boolean($('#thread-main'));
      if (isThreadPage) {
        const urlParams = new URLSearchParams(window.location.search);
        let threadId = urlParams.get('id');
        if (!threadId && window.location.pathname.startsWith('/community/topic/')) {
          const parts = window.location.pathname.split('/community/topic/')[1].split('/');
          threadId = parts[0];
        }
        if (threadId) {
          await loadTopicThread(threadId);
        } else {
          const loadingEl = $('#thread-loading');
          const errorEl = $('#thread-error');
          if (loadingEl) loadingEl.style.display = 'none';
          if (errorEl) errorEl.style.display = 'block';
        }
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const channelParam = urlParams.get('channel') || urlParams.get('category');
        const hashParam = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
        const initialCategory = channelParam || hashParam;
        if (initialCategory && state.categories.some((c) => c.slug === initialCategory)) {
          state.category = initialCategory;
          renderCategories();
        }
        await loadTopics();
        if (state.user?.admin) loadReports();
      }
    } catch (e) {
      const list = $('#topic-list');
      if (list) {
        list.innerHTML = `<div class="empty-state">Could not connect to the forum API. Check the Wasmer deployment and database setup.<br><small>${escapeHtml(e.message)}</small></div>`;
      }
      const loadingEl = $('#thread-loading');
      const errorEl = $('#thread-error');
      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'block';
    }
  }

  window.addEventListener('popstate', () => {
    if (Boolean($('#thread-main'))) return;
    const urlParams = new URLSearchParams(window.location.search);
    const channelParam = urlParams.get('channel') || urlParams.get('category');
    const hashParam = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    state.category = channelParam || hashParam || '';
    renderCategories();
    loadTopics();
  });

  init();
})();
