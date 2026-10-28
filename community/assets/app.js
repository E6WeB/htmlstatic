(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const api = '/community/api';
  const state = { user:null, categories:[], category:'', search:'', topics:[], activeTopic:null, reportTarget:null };
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateText = value => { try { return new Date(value).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}); } catch { return ''; } };
  const isTrue = v => v === true || v === 1 || v === '1' || v === 't' || v === 'true';
  const shortText = (s,n=190) => { const v=String(s??''); return v.length>n?v.slice(0,n).trim()+'…':v; };
  let toastTimer;
  function toast(message){ const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),3000); }
  async function request(action, options={}) {
    const url = new URL(api, location.href); url.searchParams.set('action',action); if(options.params) Object.entries(options.params).forEach(([k,v])=>{if(v!==''&&v!=null)url.searchParams.set(k,v)});
    const response = await fetch(url,{credentials:'include',headers:{'Content-Type':'application/json',...(options.headers||{})},...(options.method?{method:options.method}:{}),...(options.body?{body:JSON.stringify(options.body)}:{})});
    let data={}; try {data=await response.json()} catch {}
    if(!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
    return data;
  }
  function accountView(){ const el=$('#account'); if(!state.user){el.innerHTML='<a class="button button-quiet" href="/community/oauth?action=login">Sign in with GitHub</a>';return;} const avatar=state.user.avatar?`<img class="avatar" src="${escapeHtml(state.user.avatar)}" alt="">`:''; el.innerHTML=`<div class="account-user">${avatar}<span>Signed in as <strong>${escapeHtml(state.user.login)}</strong></span></div><a class="button button-quiet" href="/community/oauth?action=logout">Sign out</a>`; if(state.user.admin){$('#admin-panel').hidden=false; loadReports().catch(e=>toast(e.message));} }
  function renderCategories(){ const nav=$('#categories'); nav.innerHTML=`<a href="#" class="category-link ${state.category===''?'active':''}" data-category="">All discussions</a>`+state.categories.map(c=>`<a href="#" class="category-link ${state.category===c.slug?'active':''}" data-category="${escapeHtml(c.slug)}">${escapeHtml(c.name)}<small>${escapeHtml(c.description)}</small></a>`).join(''); const select=$('#topic-category'); select.innerHTML=state.categories.map(c=>`<option value="${escapeHtml(c.slug)}">${escapeHtml(c.name)}</option>`).join(''); }
  async function loadTopics(){ const list=$('#topic-list'); list.innerHTML='<div class="empty-state">Loading discussions…</div>'; try{const data=await request('topics',{params:{category:state.category,q:state.search}});state.topics=data.topics||[];renderTopics();}catch(e){list.innerHTML=`<div class="empty-state">${escapeHtml(e.message)}</div>`;} }
  function renderTopics(){ $('#list-heading').textContent=state.category?(state.categories.find(c=>c.slug===state.category)?.name||'Discussions'):'Latest discussions'; $('#topic-count').textContent=`${state.topics.length} ${state.topics.length===1?'topic':'topics'}`; const list=$('#topic-list'); if(!state.topics.length){list.innerHTML='<div class="empty-state">No discussions found. Start one and be the first to share.</div>';return;} list.innerHTML=state.topics.map(t=>`<article class="topic-card"><div class="topic-stats"><strong>${Number(t.score)||0}</strong> votes<br>${Number(t.reply_count)||0} replies</div><div><a class="topic-title" href="#topic-${t.id}" data-open-topic="${t.id}">${escapeHtml(t.title)}</a><p class="topic-excerpt">${escapeHtml(shortText(t.body))}</p><div class="topic-meta"><span class="category-pill">${escapeHtml(t.category_name)}</span><span>by ${escapeHtml(t.display_name||t.login)}</span><span>${dateText(t.updated_at)}</span></div></div></article>`).join(''); }
  async function openTopic(id){ try{const data=await request('topic',{params:{id}});state.activeTopic=data.topic;renderTopicDetail(data.topic,data.replies||[]);$('#topic-dialog').showModal();}catch(e){toast(e.message);} }
  function voteControls(kind,id,score,myVote){ return `<div class="detail-actions"><button class="vote-button ${Number(myVote)===1?'selected':''}" data-vote-kind="${kind}" data-vote-id="${id}" data-vote-value="1" aria-label="Upvote">Upvote</button><button class="vote-button ${Number(myVote)===-1?'selected':''}" data-vote-kind="${kind}" data-vote-id="${id}" data-vote-value="-1" aria-label="Downvote">Downvote</button><span class="muted">${Number(score)||0} net votes</span><button class="text-button" data-report-kind="${kind}" data-report-id="${id}">Report</button>${state.user?.admin?`<button class="text-button" data-hide-kind="${kind}" data-hide-id="${id}" data-hide-value="${kind==='topic' && isTrue(state.activeTopic?.is_hidden)?'false':'true'}">${kind==='topic' && isTrue(state.activeTopic?.is_hidden)?'Unhide':'Hide'}</button>`:''}</div>`; }
  function renderTopicDetail(t,replies){ const root=$('#topic-detail'); root.innerHTML=`<div class="dialog-heading"><div class="detail-header"><p class="eyebrow">${escapeHtml(t.category_name)}</p><h2>${escapeHtml(t.title)}</h2><div class="topic-meta"><span>Posted by ${escapeHtml(t.display_name||t.login)}</span><span>${dateText(t.created_at)}</span></div></div><button type="button" class="close-button" data-close="topic-dialog" aria-label="Close">×</button></div><div class="detail-body">${escapeHtml(t.body)}</div>${voteControls('topic',t.id,t.score,t.my_vote)}<h3 class="reply-heading">Replies (${replies.length})</h3><div class="replies">${replies.length?replies.map(r=>`<article class="reply"><div class="topic-meta"><strong>${escapeHtml(r.display_name||r.login)}</strong><span>${dateText(r.created_at)}</span>${isTrue(r.is_hidden)?'<span class="category-pill">Hidden</span>':''}</div><div class="reply-body">${escapeHtml(r.body)}</div>${voteControls('reply',r.id,r.score,r.my_vote).replace(/data-hide-kind="reply" data-hide-id="(\d+)" data-hide-value="true"/g,'data-hide-kind="reply" data-hide-id="$1" data-hide-value="true"')}</article>`).join(''):'<p class="muted">No replies yet. Start the conversation.</p>'}</div>${state.user?`<form id="reply-form" class="reply-form"><label for="reply-body">Add a reply</label><textarea id="reply-body" maxlength="10000" minlength="2" required placeholder="Share a helpful reply…"></textarea><p id="reply-message" class="form-message" role="status"></p><div><button class="button" type="submit">Post reply</button></div></form>`:'<p class="muted">Sign in with GitHub to reply or vote.</p>'}`; }
  async function loadReports(){ if(!state.user?.admin)return; const box=$('#reports-list'); box.innerHTML='<p class="muted">Loading reports…</p>'; try{const data=await request('admin_reports');if(!data.reports.length){box.innerHTML='<p class="muted">No pending reports. You are all caught up.</p>';return;}box.innerHTML=data.reports.map(r=>`<article class="report-card"><div class="topic-meta"><strong>Report #${r.id}</strong><span>by ${escapeHtml(r.reporter_login)}</span><span>${dateText(r.created_at)}</span></div><p><strong>${r.topic_id?'Topic: '+escapeHtml(r.topic_title||'Untitled'):'Reply on topic #'+escapeHtml(r.reply_id)}</strong></p>${r.reply_body?`<p>${escapeHtml(shortText(r.reply_body,300))}</p>`:''}<p>${escapeHtml(r.reason)}</p><div class="report-actions">${r.topic_id?`<button class="button button-quiet" data-hide-kind="topic" data-hide-id="${r.topic_id}" data-hide-value="true">Hide topic</button>`:''}${r.reply_id?`<button class="button button-quiet" data-hide-kind="reply" data-hide-id="${r.reply_id}" data-hide-value="true">Hide reply</button>`:''}<button class="button" data-review-report="${r.id}" data-review-status="resolved">Mark reviewed</button><button class="button button-quiet" data-review-report="${r.id}" data-review-status="dismissed">Dismiss</button></div></article>`).join('');}catch(e){box.innerHTML=`<p class="muted">${escapeHtml(e.message)}</p>`;} }
  async function refreshTopic(){ if(state.activeTopic) await openTopic(state.activeTopic.id); }
  document.addEventListener('click',async e=>{
    const cat=e.target.closest('[data-category]'); if(cat){e.preventDefault();state.category=cat.dataset.category;renderCategories();loadTopics();return;}
    const open=e.target.closest('[data-open-topic]'); if(open){e.preventDefault();openTopic(open.dataset.openTopic);return;}
    const close=e.target.closest('[data-close]');if(close){$('#'+close.dataset.close).close();return;}
    const vote=e.target.closest('[data-vote-kind]');if(vote){if(!state.user){toast('Sign in with GitHub to vote.');return;}try{await request('vote',{method:'POST',body:{kind:vote.dataset.voteKind,id:Number(vote.dataset.voteId),value:Number(vote.dataset.voteValue)}});await loadTopics();if(state.activeTopic)await refreshTopic();}catch(err){toast(err.message);}return;}
    const report=e.target.closest('[data-report-kind]');if(report){if(!state.user){toast('Sign in with GitHub to report content.');return;}state.reportTarget={kind:report.dataset.reportKind,id:Number(report.dataset.reportId)};$('#report-reason').value='';$('#report-message').textContent='';$('#report-dialog').showModal();return;}
    const hide=e.target.closest('[data-hide-kind]');if(hide){if(!state.user?.admin)return;try{await request('moderate',{method:'POST',body:{kind:hide.dataset.hideKind,id:Number(hide.dataset.hideId),hidden:hide.dataset.hideValue==='true'}});toast(hide.dataset.hideValue==='true'?'Content hidden.':'Content restored.');await loadTopics();if(state.activeTopic)await refreshTopic();loadReports();}catch(err){toast(err.message);}return;}
    const review=e.target.closest('[data-review-report]');if(review){try{await request('review_report',{method:'POST',body:{id:Number(review.dataset.reviewReport),status:review.dataset.reviewStatus}});toast('Report updated.');loadReports();}catch(err){toast(err.message);}return;}
  });
  const newTopicBtn = $('#new-topic');
  if (newTopicBtn) {
    newTopicBtn.addEventListener('click', () => {
      if (!state.user) {
        toast('Sign in with GitHub to start a discussion.');
        return;
      }
      $('#compose-message').textContent = '';
      $('#compose-form').reset();
      $('#compose-dialog').showModal();
    });
  }
  $('#compose-form').addEventListener('submit', async e => {
    e.preventDefault();
    const button = e.submitter;
    button.disabled = true;
    $('#compose-message').textContent = 'Publishing…';
    try {
      const data = await request('create_topic', {
        method: 'POST',
        body: {
          title: $('#topic-title').value,
          category: $('#topic-category').value,
          body: $('#topic-body').value
        }
      });
      $('#compose-dialog').close();
      toast('Discussion published.');
      state.category = '';
      state.search = '';
      const s = $('#search');
      if (s) { s.value = ''; updateClearBtn(); }
      renderCategories();
      await loadTopics();
      openTopic(data.id);
    } catch (err) {
      $('#compose-message').textContent = err.message;
    } finally {
      button.disabled = false;
    }
  });
  $('#topic-dialog').addEventListener('submit', async e => {
    if (e.target.id !== 'reply-form') return;
    e.preventDefault();
    const button = e.submitter;
    button.disabled = true;
    $('#reply-message').textContent = 'Posting…';
    try {
      await request('reply', {
        method: 'POST',
        body: {
          topic_id: Number(state.activeTopic.id),
          body: $('#reply-body').value
        }
      });
      toast('Reply posted.');
      await refreshTopic();
      await loadTopics();
    } catch (err) {
      $('#reply-message').textContent = err.message;
    } finally {
      button.disabled = false;
    }
  });
  $('#report-form').addEventListener('submit', async e => {
    e.preventDefault();
    const button = e.submitter;
    button.disabled = true;
    $('#report-message').textContent = 'Sending…';
    try {
      await request('report', {
        method: 'POST',
        body: {
          ...state.reportTarget,
          reason: $('#report-reason').value
        }
      });
      $('#report-dialog').close();
      toast('Report sent to the moderators.');
    } catch (err) {
      $('#report-message').textContent = err.message;
    } finally {
      button.disabled = false;
    }
  });
  let searchTimer;
  const searchEl = $('#search');
  const searchClearBtn = $('#search-clear');
  function updateClearBtn() {
    if (searchClearBtn) searchClearBtn.style.display = (searchEl && searchEl.value) ? 'inline-flex' : 'none';
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
    searchEl.addEventListener('keydown', e => {
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
  const refreshBtn = $('#refresh-reports');
  if (refreshBtn) refreshBtn.addEventListener('click', () => loadReports());
  async function init() {
    try {
      const data = await request('bootstrap');
      state.user = data.user;
      state.categories = data.categories || [];
      renderCategories();
      accountView();
      await loadTopics();
    } catch (e) {
      $('#topic-list').innerHTML = `<div class="empty-state">Could not connect to the forum API. Check the Wasmer deployment and database setup.<br><small>${escapeHtml(e.message)}</small></div>`;
    }
  }
  init();
})();
