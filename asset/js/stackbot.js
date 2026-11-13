/* StaticStack StackBot - Standalone Embed v1.0
   Drop on staticstack.app - fetches /tools.xml from SAME domain (no CORS issue)
   No API key needed for static mode. See README for AI mode.
*/
(function(){
  if(window.__stackBotLoaded) return; window.__stackBotLoaded = true;
  const TOOLS_XML_URL = '/tools.xml';
  const SITE = 'https://www.staticstack.app';
  let TOOLS = [];
  let DATA_SOURCE = 'loading';
  let LAST_SYNCED = null;

  // Embedded fallback - only used if /tools.xml fetch fails. ChatGPT link FIXED here.
  const FALLBACK = [
    {name:'ChatGPT', category:'AI & Content Creation', desc:'Conversational AI model for drafting blog posts, website copy, and HTML/markdown content', url:'/tools/ai-content-creation/chatgpt'},
    {name:'Claude', category:'AI & Content Creation', desc:'Advanced AI assistant with large context windows for writing long-form articles and documentation', url:'/tools/ai-content-creation/claude'},
    {name:'Formspree', category:'Contact Forms', desc:'Form submissions and email notifications', url:'/tools/contact-forms/formspree'},
    {name:'Basin', category:'Contact Forms', desc:'Hosted form backend for static websites', url:'/tools/contact-forms/basin'},
    {name:'Web3Forms', category:'Contact Forms', desc:'Contact form backend for static websites, HTML, and Jamstack', url:'/tools/contact-forms/web3forms'},
    {name:'Netlify', category:'Hosting & Deployment', desc:'Static hosting with deployment automation and additional services', url:'/tools/hosting-deployment/netlify'},
    {name:'Vercel', category:'Hosting & Deployment', desc:'Deploy static websites and frontend applications', url:'/tools/hosting-deployment/vercel'},
    {name:'Cloudflare Pages', category:'Hosting & Deployment', desc:'Deploy static sites with Git integration and edge services', url:'/tools/hosting-deployment/cloudflare-pages'},
    {name:'GitHub Pages', category:'Hosting & Deployment', desc:'Host websites directly from GitHub repositories', url:'/tools/hosting-deployment/github-pages'},
    {name:'Astro', category:'Static Site Generators', desc:'Content-driven static web framework that ships zero JS by default', url:'/tools/static-site-generators/astro'},
    {name:'Eleventy (11ty)', category:'Static Site Generators', desc:'Simple, flexible static generator converting templates to fast HTML', url:'/tools/static-site-generators/eleventy'},
    {name:'Hugo', category:'Static Site Generators', desc:'Extremely fast static site generator rendering pages in milliseconds', url:'/tools/static-site-generators/hugo'},
    {name:'Plausible', category:'Analytics & Privacy', desc:'Privacy-focused website analytics', url:'/tools/analytics-privacy/plausible'},
    {name:'Umami', category:'Analytics & Privacy', desc:'Open-source website analytics', url:'/tools/analytics-privacy/umami'},
    {name:'Giscus', category:'Comments & Community', desc:'GitHub Discussions-powered comments', url:'/tools/comments-community/giscus'},
    {name:'Utterances', category:'Comments & Community', desc:'Lightweight commenting powered by GitHub issues', url:'/tools/comments-community/utterances'},
    {name:'Decap CMS', category:'Content Management', desc:'Open-source content management for Git-based websites', url:'/tools/content-management/decap-cms'},
    {name:'Pagefind', category:'Search', desc:'Static search indexing designed for static websites', url:'/tools/search/pagefind'},
    {name:'Algolia', category:'Search', desc:'Hosted search service with frontend integrations', url:'/tools/search/algolia'},
    {name:'Clerk', category:'Authentication & User Management', desc:'User management and auth with drop-in UI and vanilla JS SDK', url:'/tools/authentication-users/clerk'},
    {name:'Supabase', category:'Database & Backend-as-a-Service', desc:'Open-source Firebase alternative with real-time Postgres and REST APIs', url:'/tools/database-storage/supabase'},
    {name:'Stripe Payment Links', category:'Payments & E-commerce', desc:'Accept payments through hosted checkout links', url:'/tools/payments-ecommerce/stripe-payment-links'},
    {name:'Buttondown', category:'Newsletters & Email', desc:'Newsletter publishing and subscriber management', url:'/tools/newsletters-email/buttondown'},
    {name:'Cloudflare Turnstile', category:'Security & Spam Protection', desc:'Privacy-friendly CAPTCHA alternative', url:'/tools/security-spam-protection/cloudflare-turnstile'},
  ];

  const SYNONYMS = {
    'form':'Contact Forms','forms':'Contact Forms','contact':'Contact Forms',
    'hosting':'Hosting & Deployment','deploy':'Hosting & Deployment','host':'Hosting & Deployment','publish':'Hosting & Deployment',
    'cms':'Content Management','content':'Content Management',
    'comment':'Comments & Community','comments':'Comments & Community','forum':'Comments & Community',
    'analytics':'Analytics & Privacy','tracking':'Analytics & Privacy','stats':'Analytics & Privacy',
    'auth':'Authentication & User Management','login':'Authentication & User Management','member':'Authentication & User Management',
    'booking':'Booking & Scheduling','calendar':'Booking & Scheduling','schedule':'Booking & Scheduling',
    'search':'Search','ecommerce':'Payments & E-commerce','sell':'Payments & E-commerce','payment':'Payments & E-commerce','checkout':'Payments & E-commerce','shop':'Payments & E-commerce',
    'email':'Newsletters & Email','newsletter':'Newsletters & Email','subscribe':'Newsletters & Email',
    'ai':'AI & Content Creation','writing':'AI & Content Creation','model':'AI Models','llm':'AI Models',
    'ssg':'Static Site Generators','generator':'Static Site Generators',
    'image':'Images & Optimization','images':'Images & Optimization','compress':'Images & Optimization','photo':'Images & Optimization',
    'map':'Interactive Maps & Geolocation','maps':'Interactive Maps & Geolocation',
    'animation':'Interactive Scripts & Animation','slider':'Interactive Scripts & Animation','gallery':'Interactive Scripts & Animation',
    'chat':'Live Chat & Support','live chat':'Live Chat & Support',
    'video':'Media & Video Players','player':'Media & Video Players','audio':'Media & Video Players',
    'monitor':'Monitoring & Error Tracking','error':'Monitoring & Error Tracking','bug':'Monitoring & Error Tracking',
    'spam':'Security & Spam Protection','captcha':'Security & Spam Protection','security':'Security & Spam Protection',
    'survey':'Surveys & Feedback','feedback':'Surveys & Feedback','poll':'Surveys & Feedback',
    'tutorial':'Tutorials','learn':'Tutorials','guide':'Tutorials',
    'font':'Typography & Web Fonts','fonts':'Typography & Web Fonts','typography':'Typography & Web Fonts',
    'database':'Database & Backend-as-a-Service','backend':'Database & Backend-as-a-Service','db':'Database & Backend-as-a-Service',
    'css':'CSS & UI Component Libraries','icon':'CSS & UI Component Libraries','framework':'CSS & UI Component Libraries',
    'template':'HTML Templates','templates':'HTML Templates','theme':'HTML Templates','themes':'HTML Templates',
    'code':'Development Tools','editor':'Development Tools','dev':'Development Tools',
    'extension':'Browser Extensions',
  };

  async function loadTools(){
    try{
      const res = await fetch(TOOLS_XML_URL, {headers:{'Accept':'application/xml,text/xml'}});
      if(!res.ok) throw new Error('HTTP '+res.status);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text,'text/xml');
      const parsed = [];

      // Parse structured <tool> nodes from /tools.xml
      const toolNodes = Array.from(doc.querySelectorAll('tool'));
      if (toolNodes.length > 0) {
        toolNodes.forEach(t => {
          const name = (t.querySelector('title')?.textContent || '').trim();
          const category = (t.querySelector('category')?.textContent || '').trim();
          const rawUrl = (t.querySelector('url')?.textContent || '').trim();
          const desc = (t.querySelector('description')?.textContent || '').replace(/\s+/g, ' ').trim();
          if (!name || !rawUrl.includes('/tools/')) return;
          parsed.push({
            name,
            category: category || 'Static Tool',
            desc: desc || 'View this tool on StaticStack.',
            url: rawUrl.replace(SITE, '')
          });
        });
      } else {
        // Fallback parser for sitemap-style <url><loc>
        const urls = Array.from(doc.querySelectorAll('url'));
        urls.forEach(u=>{
          const loc = (u.querySelector('loc')?.textContent||'').trim();
          if(!loc.includes('/tools/')) return;
          const parts = loc.split('/tools/')[1].split('/');
          const categorySlug = parts[0]||'';
          const slug = parts[1]||'';
          const name = slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
          parsed.push({name, category: categorySlug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()), desc:'View this tool on StaticStack.', url: loc.replace(SITE,'')});
        });
      }

      if(parsed.length>10){ TOOLS=parsed; DATA_SOURCE='Live tools.xml'; LAST_SYNCED=new Date(); }
      else throw new Error('too few');
    }catch(e){
      TOOLS=FALLBACK; DATA_SOURCE='Embedded fallback (tools.xml fetch failed)'; LAST_SYNCED=new Date();
    }
    updateStatus();
  }

  function search(q){
    q=q.toLowerCase().trim();
    if(!q) return [];
    if(q.includes('jamstack')) return [{_jamstack:true}];
    if(q.includes('what is staticstack')||q==='what is staticstack') return [{_about:true}];
    // direct name match first
    const direct = TOOLS.filter(t=>t.name.toLowerCase()===q || t.name.toLowerCase().includes(q));
    if(direct.length) return direct.slice(0,5);
    // synonym -> category
    for(const k in SYNONYMS){ if(q.includes(k)){ const cat=SYNONYMS[k]; const inCat=TOOLS.filter(t=>t.category.toLowerCase().includes(cat.toLowerCase().split(' ')[0]) || t.category===cat); if(inCat.length) return inCat.slice(0,5); } }
    // keyword in desc/name/category
    const words=q.split(/\s+/);
    const scored=TOOLS.map(t=>{let s=0; const hay=(t.name+' '+t.category+' '+t.desc).toLowerCase(); words.forEach(w=>{ if(w.length>2 && hay.includes(w)) s++; }); return {t,s};}).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
    return scored.slice(0,5).map(x=>x.t);
  }

  const ONLINE_STATUS_HTML = `Online: StackBot <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="vertical-align:middle;"><circle cx="12" cy="12" r="10" fill="#dcfce7"/><circle cx="12" cy="12" r="6" fill="#16a34a"/></svg>`;

  function updateStatus(){ const el=document.getElementById('stackbot-status'); if(el) el.innerHTML = ONLINE_STATUS_HTML; }

  function render(){
    const wrap=document.createElement('div'); wrap.id='stackbot-root';
    const existingBtn = document.getElementById('stackbot-btn');
    wrap.innerHTML=
      (existingBtn ? '' : '<button id="stackbot-btn" aria-label="Open StackBot chat"><span class="stackbot-icon"></span><span class="rail-tooltip">Ask StackBot</span></button>') +
      `<div id="stackbot-panel" hidden>
        <div class="stackbot-header">
          <div class="stackbot-header-brand">
            <span class="stackbot-bot-avatar" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3v4" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round"/>
                <circle cx="12" cy="2.5" r="1.6" fill="#2563eb"/>
                <rect x="2" y="11" width="2" height="5" rx="1" fill="#60a5fa"/>
                <rect x="20" y="11" width="2" height="5" rx="1" fill="#60a5fa"/>
                <rect x="4" y="7" width="16" height="13" rx="4" fill="#2563eb"/>
                <circle cx="9" cy="12.5" r="1.5" fill="#ffffff"/>
                <circle cx="15" cy="12.5" r="1.5" fill="#ffffff"/>
                <rect x="9" y="16" width="6" height="1.6" rx="0.8" fill="#93c5fd"/>
              </svg>
            </span>
            <div><strong>StackBot</strong></div>
          </div>
          <button id="stackbot-close" aria-label="Close StackBot">×</button>
        </div>
        <div class="stackbot-sub">
          <span id="stackbot-status" style="display:inline-flex;align-items:center;gap:5px;font-weight:500;color:#0f172a;">${ONLINE_STATUS_HTML}</span>
          <button type="button" id="stackbot-back-btn" class="stackbot-back-btn" hidden>← Quick Links</button>
        </div>

        <!-- Initial Quick Links View -->
        <div id="stackbot-home-view" class="stackbot-home-view">
          <p class="stackbot-home-intro">Where would you like to go today?</p>
          <div class="stackbot-links-list">
            <a href="/archive" class="stackbot-nav-card">
              <span class="stackbot-nav-ico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </span>
              <span class="stackbot-nav-text">
                <strong>Master Archive</strong>
                <span>Browse all 139+ tools &amp; categories</span>
              </span>
              <span class="stackbot-nav-arrow">→</span>
            </a>

            <a href="/community" class="stackbot-nav-card">
              <span class="stackbot-nav-ico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </span>
              <span class="stackbot-nav-text">
                <strong>Community Forum</strong>
                <span>Join discussions &amp; share your builds</span>
              </span>
              <span class="stackbot-nav-arrow">→</span>
            </a>

            <a href="/contact" class="stackbot-nav-card">
              <span class="stackbot-nav-ico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              <span class="stackbot-nav-text">
                <strong>Contact &amp; Connect</strong>
                <span>Reach out or join our Facebook group</span>
              </span>
              <span class="stackbot-nav-arrow">→</span>
            </a>

            <a href="/stack/" class="stackbot-nav-card">
              <span class="stackbot-nav-ico">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </span>
              <span class="stackbot-nav-text">
                <strong>My Static Stack</strong>
                <span>View &amp; manage your saved tool bookmarks</span>
              </span>
              <span class="stackbot-nav-arrow">→</span>
            </a>

            <button type="button" id="stackbot-start-chat" class="stackbot-ask-cta">
              <span class="stackbot-ask-cta-left">
                <span class="stackbot-ask-cta-ico">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </span>
                <span class="stackbot-ask-cta-text">
                  <strong>Ask StackBot</strong>
                  <span>Chat to find the right tool for your site</span>
                </span>
              </span>
              <span class="stackbot-ask-cta-arrow">→</span>
            </button>
          </div>
        </div>

        <!-- Chat View (Opens when clicking Ask StackBot) -->
        <div id="stackbot-chat-view" class="stackbot-chat-view" hidden>
          <div id="stackbot-messages"></div>
          <form id="stackbot-form"><input id="stackbot-input" placeholder="Ask for a tool… e.g. I need a form" autocomplete="off"/><button type="submit">Send</button></form>
        </div>

        <div class="stackbot-footer">©2026 StackBot V.01</div>
      </div>`;
    document.body.appendChild(wrap);
    const btn=document.getElementById('stackbot-btn'),
          panel=document.getElementById('stackbot-panel'),
          homeView=document.getElementById('stackbot-home-view'),
          chatView=document.getElementById('stackbot-chat-view'),
          startChatBtn=document.getElementById('stackbot-start-chat'),
          backBtn=document.getElementById('stackbot-back-btn');

    function showChatView(){
      homeView.hidden = true;
      chatView.hidden = false;
      backBtn.hidden = false;
      if(!wrap.dataset.welcomed){
        wrap.dataset.welcomed='1';
        addBot("Hi! I'm StackBot. Ask me for a tool — e.g. 'I need a contact form' or 'best hosting for a static site'.");
      }
      const inp=document.getElementById('stackbot-input');
      if(inp) setTimeout(()=>inp.focus(), 50);
    }

    function showHomeView(){
      chatView.hidden = true;
      homeView.hidden = false;
      backBtn.hidden = true;
    }

    let toolsLoaded = false;
    function ensureToolsLoaded(){
      if(toolsLoaded) return;
      toolsLoaded = true;
      loadTools();
    }

    function toggleBot(forceOpen){
      panel.hidden = typeof forceOpen === 'boolean' ? !forceOpen : !panel.hidden;
      if(!panel.hidden) ensureToolsLoaded();
    }

    window.openStackBot = function(){ toggleBot(true); };
    if(btn) btn.onclick=()=>toggleBot();
    if(startChatBtn) startChatBtn.onclick=()=>{ ensureToolsLoaded(); showChatView(); };
    if(backBtn) backBtn.onclick=showHomeView;
    document.getElementById('stackbot-close').onclick=()=>panel.hidden=true;
    document.getElementById('stackbot-form').onsubmit=e=>{e.preventDefault(); ensureToolsLoaded(); const inp=document.getElementById('stackbot-input'); if(inp.value.trim()) ask(inp.value.trim()); inp.value='';};
  }
  function addBot(html){ const m=document.getElementById('stackbot-messages'); const d=document.createElement('div'); d.className='msg bot'; d.innerHTML=html; m.appendChild(d); m.scrollTop=m.scrollHeight; }
  function addUser(t){ const m=document.getElementById('stackbot-messages'); const d=document.createElement('div'); d.className='msg user'; d.textContent=t; m.appendChild(d); m.scrollTop=m.scrollHeight; }
  function ask(q){
    addUser(q);
    const res=search(q);
    if(!res.length){ addBot(`I don't have that in the directory yet. Try: forms, hosting, CMS, comments, analytics, search, or <a href="/archive" target="_blank">View Master Archive →</a>`); return; }
    if(res[0]._jamstack){ addBot(`<b>Jamstack</b> = pre-rendered HTML/CSS/JS + APIs, no server needed. Fast, secure, cheap. That's the whole StaticStack philosophy — 100% Jamstack, 0% server maintenance.`); return; }
    if(res[0]._about){
      const tCount = TOOLS.length || 144;
      const cCount = (new Set(TOOLS.map(t=>t.category).filter(Boolean)).size) || 29;
      addBot(`<b>StaticStack</b> is a curated directory of ${tCount}+ hand-picked tools for static sites across ${cCount} categories. Free & open source, community votes, forum with GitHub OAuth.`);
      return;
    }
    let html=`<b>Found ${res.length} tool${res.length>1?'s':''}:</b><br/>`;
    res.forEach(t=>{ html+=`<div class="tool-card"><b><a href="${t.url}" target="_blank" rel="noopener">${t.name}</a></b> <span>• ${t.category}</span><p>${t.desc}</p><a href="${t.url}" target="_blank" rel="noopener">View Tool →</a></div>`; });
    addBot(html);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render); else render();
})();

