/**
 * Verified pricing tiers, free allowances, and key limits for Paid & Freemium tools.
 * Keyed by tool slug (matching filename without .md).
 */
const TOOL_PRICING = {
  // === Paid Tools (7; muse-ai has custom pricing in its markdown) ===
  'grok-xai': {
    freeTier: 'No free production tier; limited free web/X access only',
    paidFrom: 'API from $1.00–$2.00 / 1M input & $2.00–$6.00 / 1M output tokens; SuperGrok $30/mo (X tiers from $8/mo)',
    limits: 'Pay-as-you-go API token billing; higher context/reasoning models priced per 1M tokens'
  },
  'outseta': {
    freeTier: 'No free tier (7-day free trial)',
    paidFrom: 'Start $47/mo ($37/mo billed annually)',
    limits: 'Up to 1,000 CRM contacts + 2% transaction fee on Start; Scale $97/mo yrly (1% fee), Pro $197/mo yrly'
  },
  'bootstrap-studio': {
    freeTier: 'No free tier (live browser demo available)',
    paidFrom: 'Lifetime license $59 one-time (Standard license with 1 yr updates)',
    limits: 'Lifetime includes permanent updates, 5 hosting slots, and Smart Forms'
  },
  'brickstatic': {
    freeTier: 'No free tier',
    paidFrom: 'Paid WordPress-to-static license (individual or bundle; promotional pricing varies)',
    limits: 'Covers unlimited static site exports on licensed Bricks/WordPress installs'
  },
  'getboosh': {
    freeTier: 'No free tier',
    paidFrom: 'BooshSEO / BooshDESIGN £24.99/yr; FEWD Studio £9.99/mo (£79.99/yr); GenCSS £49.99 one-time',
    limits: 'Desktop web tools licensed per product or annual/one-time bundle'
  },
  'sitereal': {
    freeTier: '7-day free trial only',
    paidFrom: '€69/yr or ~€99 launch / €199 regular Lifetime license (50% student discount)',
    limits: 'License covers up to 3 machines'
  },
  'logrocket': {
    freeTier: '$0/mo (1,000 sessions/mo, 1-month retention, 3 seats)',
    paidFrom: 'Core ~$69–$83/mo (~10K sessions/mo); Pro ~$292–$350+/mo (14-day trial)',
    limits: 'Session volume, data retention, and error/performance replay quotas scale by tier'
  },

  // === Freemium Tools (64) ===
  'chatgpt': {
    freeTier: '$0/mo (standard ChatGPT web access with usage caps)',
    paidFrom: 'Go $8/mo, Plus $20/mo, Pro $100–$500/mo; API pay-as-you-go from $0.05–$2.50 / 1M input tokens',
    limits: 'Free tier caps flagship model messages, file uploads, and image generation'
  },
  'chatgpt-openai': {
    freeTier: '$0/mo consumer access; API requires prepaid credits (pay-as-you-go)',
    paidFrom: 'API: GPT-4o-mini $0.15/$0.60, GPT-5-nano $0.05/$0.40, GPT-4o $2.50/$10.00 per 1M in/out tokens',
    limits: 'Token rate limits (RPM/TPM) scale by usage tier; ChatGPT Plus $20/mo'
  },
  'claude': {
    freeTier: '$0/mo (limited daily messages on Claude web/mobile)',
    paidFrom: 'Pro $20/mo, Max $100/mo; API pay-as-you-go from $0.10 / 1M input tokens',
    limits: 'Session message caps reset every few hours on Free; 5x+ higher usage on Pro/Max'
  },
  'claude-anthropic': {
    freeTier: '$0/mo web access; API uses prepaid pay-as-you-go credits',
    paidFrom: 'API: Haiku 5.5 $0.10/$0.50, Sonnet 5.5 $2.00/$10.00, Opus 5.5 $4.00/$20.00 per 1M in/out tokens',
    limits: 'Tiered RPM/TPM rate limits; prompt caching and batch API discounts available'
  },
  'google-gemini': {
    freeTier: '$0/mo (Gemini web app + rate-limited Free API tier in AI Studio)',
    paidFrom: 'Google AI Pro ~$19.99/mo; API pay-as-you-go from ~$0.25–$0.30 / 1M input tokens',
    limits: 'Free API tier is rate-limited and prompts may be used for product improvement'
  },
  'google-gemini-model': {
    freeTier: '$0/mo Free API tier (rate-limited RPM/TPM/RPD)',
    paidFrom: 'API: Flash-Lite ~$0.25–$0.30/$1.50–$2.50, Flash ~$0.75/$3.75, Pro ~$2.00/$10–$12 per 1M in/out tokens',
    limits: 'Higher context (>200K tokens) billed at higher per-token rates; paid tier excludes prompts from training'
  },
  'perplexity': {
    freeTier: '$0/mo (unlimited quick searches, 3 Pro searches/day)',
    paidFrom: 'Pro $20/mo ($200/yr); Education Pro $10/mo; Max $200/mo',
    limits: 'Free tier caps daily Pro/file-upload searches; API billed per request & token'
  },
  'recraft': {
    freeTier: '$0/mo (limited daily credits, public gallery, non-commercial use)',
    paidFrom: 'Basic $12/mo ($10/mo billed annually, 1,000 credits/mo); Pro from $20/mo; Teams from $22/seat/mo',
    limits: 'Free outputs are public and non-commercial; paid plans grant full commercial rights & private generations'
  },
  'cohere-command': {
    freeTier: '$0/mo Trial API key (20 req/min, 1,000 calls/mo, non-commercial)',
    paidFrom: 'Production API: Command R7B ~$0.0375/$0.15, Command R ~$0.15/$0.60, Command R+/A ~$0.80–$2.50 in per 1M tokens',
    limits: 'Trial keys cannot be used in commercial production'
  },
  'imgmov': {
    freeTier: 'Free watermarked previews + free browser Last Frame Extractor',
    paidFrom: 'Starter $9.99/mo, Pro ~$29/mo, or non-expiring credit packs from $4.99',
    limits: 'Free video/motion renders include watermarks and lower resolution caps'
  },
  'statcounter': {
    freeTier: '$0/mo Basic (tracks most recent 500 pageviews + 30-day paid trial)',
    paidFrom: 'Premium from $9/mo (100K+ pageviews, no ads, API access)',
    limits: 'Free tier logs only the last 500 pageviews'
  },
  'clerk': {
    freeTier: '$0/mo (50,000 Monthly Retained Users, unlimited apps, 100 orgs)',
    paidFrom: 'Pro from $20–$25/mo (removes Clerk branding, adds MFA & domain allow/deny lists)',
    limits: 'Free includes up to 50K MRUs and basic social/email auth'
  },
  'calendly': {
    freeTier: '$0/mo (1 active event type, 1 calendar connection, unlimited bookings)',
    paidFrom: 'Standard ~$10–$12/seat/mo; Teams ~$16–$20/seat/mo',
    limits: 'Free tier restricts you to 1 event type and Calendly branding'
  },
  'fireshot': {
    freeTier: '$0/mo FireShot Lite (visible area, selection, or full-page capture to PNG/JPEG/single-page PDF)',
    paidFrom: 'FireShot Pro ~$39.95/yr or Lifetime license ~$60–$99.95',
    limits: 'Lite shows upgrade prompts and locks annotation editor, multi-page PDFs, and batch capture'
  },
  'disqus': {
    freeTier: '$0/mo Basic (unlimited pageviews, ad-supported)',
    paidFrom: 'Plus ~$11–$12/mo (ad-free under 50K–100K views); Pro ~$105–$115/mo',
    limits: 'Free tier displays ads unless site qualifies for non-commercial ad-free exemptions'
  },
  'basin': {
    freeTier: '$0/mo (50 submissions/mo, 1 form, 30-day retention, 100 MB storage)',
    paidFrom: 'Starter $15/mo ($12.50/mo billed annually at $150/yr for 250 submissions/mo & 3 forms)',
    limits: 'Free plan limited to 1 form and 50 submissions/mo'
  },
  'craftforms': {
    freeTier: '$0/mo forever (unlimited forms & responses)',
    paidFrom: 'Pro ~$9/mo (custom domains, branding removal, analytics)',
    limits: 'Free tier includes CraftForms branding and standard notifications'
  },
  'formspree': {
    freeTier: '$0/mo (50 submissions/mo, unlimited forms, 30-day archive, 2 team emails)',
    paidFrom: 'Personal $15/mo ($10/mo billed annually at $120/yr for 200 submissions/mo)',
    limits: 'Free tier excludes file uploads and caps submissions at 50/mo'
  },
  'splitform': {
    freeTier: '$0/mo (500 total lifetime submissions, unlimited forms, email alerts, honeypot)',
    paidFrom: 'Pro from $5/mo (5,000/mo) or $49/yr (15,000/mo)',
    limits: 'Free tier caps at 500 lifetime submissions'
  },
  'web3forms': {
    freeTier: '$0/mo (250 submissions/mo, unlimited forms & access keys, 30-day history, CSV export)',
    paidFrom: 'Pro $12/mo billed annually ($149/yr for 10,000/mo); $49/yr student/non-profit plan',
    limits: 'Free tier caps at 250 submissions/mo and excludes file uploads'
  },
  'phantom-studio': {
    freeTier: '30-day risk-free trial / free preview',
    paidFrom: 'One-time Lifetime license (no recurring SaaS subscription)',
    limits: 'Single-purchase desktop/studio license'
  },
  'stacki': {
    freeTier: '100% Free & Open Source (MIT-licensed desktop visual builder for Astro)',
    paidFrom: 'None (no paid tiers or SaaS fees)',
    limits: 'Runs locally on your machine against your own Git/Astro repo'
  },
  'firebase-firestore': {
    freeTier: '$0/mo Spark (1 GiB storage, 50K reads/day, 20K writes/day, 20K deletes/day, 10 GiB/mo egress)',
    paidFrom: 'Blaze pay-as-you-go above free daily quotas',
    limits: 'Daily read/write/delete quotas reset every 24h on Spark'
  },
  'jsonbin': {
    freeTier: '$0/mo (~100 bins, ~1,000 daily API requests)',
    paidFrom: 'Starter/Pro ~$9.99–$19.99/mo',
    limits: 'Free tier caps total bins and daily request rate'
  },
  'cursor': {
    freeTier: '$0/mo Hobby (limited AI agent requests & tab completions)',
    paidFrom: 'Plus/Pro ~$8–$20/mo; higher tiers $30–$200+/mo; Teams ~$40/user/mo',
    limits: 'Fast premium model requests capped on Hobby'
  },
  'cloudflare-pages': {
    freeTier: '$0/mo (unlimited bandwidth/requests, 500 builds/mo, 30 projects, 5 custom domains/project, 100K Workers req/day)',
    paidFrom: 'Pro $20/domain/mo (5,000 builds/mo, 50 projects, unlimited domains); Workers Paid $5/mo',
    limits: '1 concurrent build and 500 builds/mo on Free'
  },
  'deno-deploy': {
    freeTier: '$0/mo (1M requests/mo, 100 GB bandwidth, 50ms CPU/req, 1 GiB KV, 5 members, 20 deployments)',
    paidFrom: 'Pro from $20/mo',
    limits: 'Free plan caps CPU time per request and monthly invocations'
  },
  'firebase-hosting': {
    freeTier: '$0/mo Spark (1 GB storage, 10 GB/mo data transfer, custom domains & SSL)',
    paidFrom: 'Blaze pay-as-you-go above free storage/transfer quotas',
    limits: '10 GB/mo bandwidth cap on Spark'
  },
  'fleek': {
    freeTier: '$0/mo Free tier (basic static/edge deployments & custom domains)',
    paidFrom: 'Paid tiers from ~$20/mo',
    limits: 'Bandwidth, build minutes, and edge compute quotas scale by plan'
  },
  'netlify': {
    freeTier: '$0/mo (300 credits/mo ~15 GB bandwidth or ~20 prod deploys, 1 member, commercial use allowed)',
    paidFrom: 'Pro from $20/mo (unlimited seats, 3,000+ credits/mo)',
    limits: 'Monthly credit pool covers bandwidth, builds, and compute'
  },
  'render': {
    freeTier: '$0/mo (5 GB bandwidth, 500 build mins; static sites free; web services sleep after 15m)',
    paidFrom: 'Pro Workspace $25/mo + compute (services from $7/mo, Postgres from $6/mo)',
    limits: 'Free Postgres expires after 30 days; free web services spin down on idle'
  },
  'stormkit': {
    freeTier: '$0/mo Self-hosted (unlimited on own infra)',
    paidFrom: 'Managed/Premium from $20/mo',
    limits: 'Managed tier meters deployments, seats, and bandwidth'
  },
  'surge': {
    freeTier: '$0/mo (unlimited static projects, custom domains, free SSL via CLI)',
    paidFrom: 'Surge Pro $30/mo (password protection, custom redirects, unlimited publishing)',
    limits: 'Free tier lacks password protection and custom redirect rules'
  },
  'vercel': {
    freeTier: '$0/mo Hobby (non-commercial only, 100 GB transfer, 1M function invocations, 4h Active CPU, 1 GB Blob)',
    paidFrom: 'Pro $20/seat/mo (commercial use, includes $20 credit, 1 TB transfer)',
    limits: 'Hobby plan is strictly non-commercial and single-seat'
  },
  'wasmer': {
    freeTier: '$0/mo Hobby (1 app, 100K visits/mo, 1 GB storage, 150 GB bandwidth, 100 MB DB, 6h CPU/mo)',
    paidFrom: 'Pro from $10/mo',
    limits: 'Hobby limited to 1 app and 6h CPU/mo'
  },
  'cruip': {
    freeTier: '$0/mo selection of free Tailwind CSS templates (e.g., Simple Light)',
    paidFrom: 'Individual templates $49–$129 one-time; All-Access Bundle ~$79–$89 one-time',
    limits: 'Free templates have limited variety; paid bundle includes 20+ templates & Figma files'
  },
  'themewagon': {
    freeTier: '$0/mo (1,600+ free Bootstrap/Tailwind/React templates; commercial use allowed)',
    paidFrom: 'Premium templates priced individually by Standard, Multisite, or Extended license',
    limits: 'Some free templates require footer attribution; cannot resell raw templates'
  },
  'pic2svg': {
    freeTier: '$0/mo (free previews & small free trace allowance, e.g., 12 free traces on sign-in)',
    paidFrom: 'Pro $79/yr',
    limits: 'Batch ZIP downloads and CAD/vector formats (PDF, EPS, AI, DXF) require Pro'
  },
  'site-shot': {
    freeTier: '$0/mo (100 API screenshot captures/mo, no credit card required)',
    paidFrom: 'X-Lite $5/mo (2,000 captures/mo); Lite $15/mo (10,000/mo); Optimal $50/mo',
    limits: 'Free tier capped at 100/mo from default/US locations without scheduled captures'
  },
  'tinypng': {
    freeTier: '$0/mo (500 API compressions per calendar month; free web drag-and-drop)',
    paidFrom: 'Pay-as-you-go $0.009/image (501–10K), $0.002/image (10K+); prepaid packs from $9 (1,000 credits)',
    limits: 'Web UI caps batch size/file size; API free tier resets at 500/mo'
  },
  'unsplash': {
    freeTier: '$0/mo (free stock photos; API Demo mode 50 req/hr, Production 5,000 req/hr)',
    paidFrom: 'Unsplash+ ~$7–$10+/mo (unlimited exclusive assets + legal warranty, no attribution required)',
    limits: 'API starts at 50 req/hr until approved for Production (5,000 req/hr)'
  },
  'umami': {
    freeTier: '$0/mo Cloud Hobby (100K events/mo, 1 website, 6-mo retention) or 100% Free Self-Hosted (MIT)',
    paidFrom: 'Cloud Pro $20/mo (1M events/mo, 20 websites, 10 seats, 2-yr retention, API access)',
    limits: 'Cloud Hobby excludes API access and caps at 1 site / 100K events/mo'
  },
  'creattie': {
    freeTier: '$0/mo (1,500+ free Lottie/static items)',
    paidFrom: 'Pro ~$19.99/mo (~600 animated icons & 50 illustrations/mo) or ~$4.99 single-item purchases',
    limits: 'Free tier restricts library access and customization downloads'
  },
  'iconking': {
    freeTier: '$0/mo (free Lottie/SVG library + editor/converters + 3 free AI animation tries)',
    paidFrom: 'AI Pro $16.67/mo billed annually ($200/yr, 800 AI credits/mo + Premium Library)',
    limits: 'AI generation costs 25–45 credits; free library downloads consume 0 credits'
  },
  'icons8-animated-icons': {
    freeTier: '$0/mo (free animated Lottie/GIF icons with mandatory visible attribution link)',
    paidFrom: 'AI & Graphics ~$19–$24/mo (removes attribution, ~100 icons/mo); Unlimited ~$159–$199/mo',
    limits: 'Free downloads require attribution link and limit format/resolution options'
  },
  'iconscout-lottie': {
    freeTier: '$0/mo (subset of free Lottie/SVG assets + Daily Freebies; attribution required)',
    paidFrom: 'Individual plans ~$9.99–$15/mo (unlimited downloads, no attribution)',
    limits: 'Free tier requires attribution; Student Developer Pack unlocks select pro perks'
  },
  'jitter': {
    freeTier: '$0/mo (unlimited drafts, 3 active workspace files, 720p @ 30fps exports, Lottie/GIF/video)',
    paidFrom: 'Pro $19/editor/mo ($15/mo billed annually; 1080p @ 60fps, watermark-free, WebM/ProRes)',
    limits: 'Free tier caps active files at 3 and export resolution at 720p 30fps'
  },
  'lordicon': {
    freeTier: '$0/mo (~9,700+ free animated icons, 1 collection, attribution required)',
    paidFrom: 'PRO $16/mo ($96/yr = $8/mo; 38,300+ icons, no attribution); PRO API from $149/mo',
    limits: 'Free tier requires visible attribution and limits to 1 collection'
  },
  'lottiefiles': {
    freeTier: '$0/mo Starter (free public community animations under Lottie Simple License)',
    paidFrom: 'Individual/Pro ~$19.99/user/mo billed annually; Team ~$24.99/user/mo',
    limits: 'Private files, CDN hosting, and commercial client workflows require paid Individual/Team plans'
  },
  'lottielab': {
    freeTier: '$0/mo Starter (unlimited files/folders, Figma import, core keyframe & SVG/Lottie tools)',
    paidFrom: 'Pro $18/editor/mo ($12/editor/mo billed annually; watermark-free, 4K, CDN hosting)',
    limits: 'Free exports may include watermarks; team libraries & CDN require Pro'
  },
  'motionelements': {
    freeTier: 'Free account to browse & download occasional free samples; no permanent free subscription',
    paidFrom: 'Pay-per-item ~$1–$30+ each; Pro Unlimited ~$16.50/mo ($198/yr + 1,000 AI coins/mo)',
    limits: 'Daily download/bandwidth caps apply to prevent scraping on Pro'
  },
  'crisp': {
    freeTier: '$0/mo (2 seats, website chat widget, shared inbox, mobile apps)',
    paidFrom: 'Mini $45/mo per workspace (4 seats, triggers, $5 AI credits); Essentials $95/mo (10 seats, CRM)',
    limits: 'Free tier excludes CRM, automations, and AI/Hugo credits'
  },
  'mapbox-gl-js': {
    freeTier: '$0/mo (50,000 web map loads/mo free)',
    paidFrom: 'Pay-as-you-go ~$5.00 per 1,000 map loads (50K–100K), scaling down to $3–$4/1,000 at higher volume',
    limits: 'Each Map initialization counts as 1 load (session capped at 12h); Geocoding/Directions metered separately'
  },
  'brevo': {
    freeTier: '$0/mo (300 emails/day, up to 100K contacts, Brevo branding)',
    paidFrom: 'Starter $9/mo (~$8.08/mo annually; 5,000 emails/mo, no daily cap)',
    limits: 'Free tier caps daily sends at 300/day and includes Brevo logo'
  },
  'buttondown': {
    freeTier: '$0/mo (up to 100 subscribers, Markdown editor, custom sending domain, API)',
    paidFrom: 'Paid tiers from $9/mo (>100 subscribers); modular feature add-ons from $9–$79/mo; 0% revenue cut',
    limits: 'Free tier caps at 100 subscribers; paid subscriptions/analytics/automations are add-ons'
  },
  'emailit': {
    freeTier: '$0/mo (3,000 credits/mo, 100 emails/day before first purchase, 3 sending domains)',
    paidFrom: 'PAYG $2 per 10K extra credits (lifts cap to 5,000/day); Pro $25/mo ($20/mo annually, 100K credits/mo)',
    limits: 'Campaign emails cost 2 credits/send; transactional sends cost 1 credit'
  },
  'smtp2go': {
    freeTier: '$0/mo (1,000 emails/mo, max 200/day, 5-day reporting, 2 users, 1 webhook)',
    paidFrom: 'Starter $15/mo ($150/yr; 10,000 emails/mo, overage ~$1.20/1,000, 30-day history)',
    limits: 'Free tier caps at 200 emails/day and 25/hr until sender domain is verified'
  },
  'paymentform': {
    freeTier: '$0/mo (unlimited forms/submissions/transactions, 0% platform fee, custom domain, ~2 GB storage)',
    paidFrom: 'Pro ~$5–$9/mo (0% platform fee, removes branding, advanced analytics & team access)',
    limits: 'Standard Stripe/PayPal gateway processing fees still apply'
  },
  'reflow': {
    freeTier: '$0/mo (up to 100 products, 100 registered users, Stripe/PayPal, 0% Reflow fee)',
    paidFrom: 'Pro $9.99/mo (1,000 products, 10,000 users, digital downloads, subscriptions, API/webhooks, 5 seats)',
    limits: 'Free tier caps at 100 products and 100 users; digital downloads & subscriptions require Pro'
  },
  'algolia': {
    freeTier: '$0/mo Build (10,000 search requests/mo, 50,000 records, 5,000 crawls/mo, max 10 indices)',
    paidFrom: 'Grow pay-as-you-go ($0 base with 10K searches & 100K records; ~$0.50/1K extra searches, ~$0.40/1K records)',
    limits: 'Build plan caps 1 GB index size and 10 KB per record; no overage billing on Build'
  },
  'google-recaptcha': {
    freeTier: '$0/mo Essentials (up to 10,000 assessments/mo per org without billing enabled)',
    paidFrom: 'Standard: $8 flat (10,001–100,000 assessments/mo), then $1.00 per 1,000 assessments',
    limits: 'Exceeding 10K assessments without billing returns 429 quota errors'
  },
  'hcaptcha': {
    freeTier: '$0/mo Basic (up to 10,000 requests/mo, standard visual challenge)',
    paidFrom: 'Pro $139/mo ($99/mo annually; 100K evaluations/mo, 99.9% passive mode, $0.99/1K extra)',
    limits: 'Free tier shows visual challenges and excludes passive/invisible mode & custom themes'
  },
  'sleekplan': {
    freeTier: '$0/mo Indie (1 admin, unlimited feedback items/subscribers, 1,000 announcement views/mo, 500 emails/mo)',
    paidFrom: 'Starter $13/mo billed annually (3 seats, Roadmap, CSAT/NPS, API/webhooks, SSO, 10K views/mo)',
    limits: 'Free tier excludes Roadmap, API/webhooks, SSO, and AI credits'
  },
  'tally': {
    freeTier: '$0/mo forever (unlimited forms & submissions, Stripe payments, conditional logic, 10 MB/file uploads)',
    paidFrom: 'Pro $29/mo ($24/mo or $290/yr; removes Tally branding, custom domains, partial submissions, custom CSS)',
    limits: 'Free tier includes "Made with Tally" badge and 10 MB per-file upload cap (~50K/mo fair-use policy)'
  }
};

module.exports = { TOOL_PRICING };

