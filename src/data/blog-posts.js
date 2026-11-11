/**
 * StaticStack Blog Articles Registry
 * Stores metadata, categorization, and related tool links for all blog posts.
 */

const BLOG_POSTS = [
  {
    slug: '25-best-free-tools-for-building-static-html-websites',
    title: '25 Best Free Tools for Building Static HTML Websites',
    description: 'The ultimate curated guide to the 25 best free tools, services, and libraries for building fast, secure static HTML websites in 2026.',
    excerpt: 'From static site generators and zero-cost edge hosting to serverless forms, client-side search, and drop-in comments—explore the 25 best free tools for static web development.',
    category: 'Development Tools',
    categorySlug: 'development-tools',
    date: '2026-03-18',
    dateFormatted: 'March 18, 2026',
    readTime: '11 min read',
    author: 'StaticStack Editorial',
    authorRole: 'Static Web Architecture',
    tags: [
      'static-site',
      'html',
      'free-tools',
      'jamstack',
      'web-development',
      'hosting',
      'astro',
      'pagefind'
    ],
    featuredToolSlugs: [
      'astro',
      'cloudflare-pages',
      'web3forms',
      'giscus',
      'pagefind',
      'pico-css',
      'lucide-icons',
      'squoosh'
    ],
    toc: [
      { id: 'ssgs', title: '1. Static Site Generators (SSGs)' },
      { id: 'hosting', title: '2. Free Global Edge Hosting & CDNs' },
      { id: 'forms', title: '3. Serverless Contact Forms' },
      { id: 'search', title: '4. Client-Side Search Engines' },
      { id: 'comments', title: '5. Serverless Comments & Community' },
      { id: 'css', title: '6. Minimalist CSS Frameworks & Icons' },
      { id: 'media', title: '7. Media & Image Optimization' },
      { id: 'analytics', title: '8. Privacy-Friendly Analytics' },
      { id: 'seo', title: '9. Static SEO & Auditing' }
    ]
  },
  {
    slug: 'how-to-build-a-website-without-wordpress',
    title: 'How to Build a Website Without WordPress',
    description: 'Learn how to build, host, and manage high-performance websites without WordPress, PHP, or fragile plugins. Complete architecture blueprint for static HTML.',
    excerpt: 'Tired of WordPress plugin updates, database crashes, and slow load times? Here is the step-by-step blueprint to build, host, and manage a fast, secure website without WordPress.',
    category: 'Tutorials',
    categorySlug: 'tutorials',
    date: '2026-03-17',
    dateFormatted: 'March 17, 2026',
    readTime: '9 min read',
    author: 'StaticStack Editorial',
    authorRole: 'Static Web Architecture',
    tags: [
      'wordpress-alternative',
      'static-html',
      'jamstack',
      'headless-cms',
      'astro',
      'decap-cms',
      'tutorials'
    ],
    featuredToolSlugs: [
      'astro',
      'decap-cms',
      'pages-cms',
      'cloudflare-pages',
      'web3forms',
      'giscus'
    ],
    toc: [
      { id: 'why-leave-wp', title: 'Why Leave WordPress Behind' },
      { id: 'the-static-stack', title: 'The Modern Non-WordPress Stack' },
      { id: 'step-1-templating', title: 'Step 1: Choose Your HTML Foundation' },
      { id: 'step-2-cms', title: 'Step 2: Add a Git-Based Headless CMS' },
      { id: 'step-3-hosting', title: 'Step 3: Deploy to Free Edge Hosting' },
      { id: 'step-4-forms', title: 'Step 4: Contact Forms Without Plugins' },
      { id: 'migration-checklist', title: 'WP to Static Migration Checklist' }
    ]
  },
  {
    slug: 'best-free-hosting-services-for-static-html-websites',
    title: 'Best Free Hosting Services for Static HTML Websites',
    description: 'Detailed 2026 comparison of the best free hosting providers for static websites: Cloudflare Pages, Vercel, Netlify, GitHub Pages, Render, and Wasmer.',
    excerpt: 'Compare the top free hosting platforms for static HTML sites. We analyze bandwidth allowances, build times, custom domains, edge performance, and deploy previews.',
    category: 'Hosting & Deployment',
    categorySlug: 'hosting-deployment',
    date: '2026-03-16',
    dateFormatted: 'March 16, 2026',
    readTime: '8 min read',
    author: 'StaticStack Editorial',
    authorRole: 'Static Web Architecture',
    tags: [
      'hosting',
      'static-html',
      'cloudflare-pages',
      'vercel',
      'netlify',
      'github-pages',
      'free-hosting',
      'cdn'
    ],
    featuredToolSlugs: [
      'cloudflare-pages',
      'vercel',
      'netlify',
      'github-pages',
      'render',
      'wasmer'
    ],
    toc: [
      { id: 'comparison-matrix', title: 'Free Hosting Comparison Matrix' },
      { id: 'cloudflare-pages', title: '1. Cloudflare Pages (Winner)' },
      { id: 'vercel', title: '2. Vercel (Developer Experience)' },
      { id: 'netlify', title: '3. Netlify (Jamstack Pioneer)' },
      { id: 'github-pages', title: '4. GitHub Pages (Simplest)' },
      { id: 'render', title: '5. Render (Hybrid Cloud)' },
      { id: 'how-to-choose', title: 'Which Free Host Should You Choose?' }
    ]
  },
  {
    slug: 'how-to-add-contact-forms-to-static-websites',
    title: 'How to Add Contact Forms to Static Websites',
    description: 'A complete, modern guide to capturing form submissions on static HTML, SSG, and Jamstack websites without backend servers, databases, or PHP.',
    excerpt: 'Static websites can easily handle contact forms, file uploads, and spam protection. Learn how modern serverless form backends make contact forms simple, fast, and completely secure.',
    category: 'Contact Forms',
    categorySlug: 'contact-forms',
    date: '2026-03-15',
    dateFormatted: 'March 15, 2026',
    readTime: '8 min read',
    author: 'StaticStack Editorial',
    authorRole: 'Static Web Architecture',
    tags: [
      'contact-forms',
      'html',
      'vanilla-js',
      'serverless',
      'web3forms',
      'formspree',
      'cloudflare-turnstile',
      'jamstack'
    ],
    featuredToolSlugs: [
      'web3forms',
      'formspree',
      'basin',
      'splitform',
      'cloudflare-turnstile'
    ],
    toc: [
      { id: 'why-static-forms', title: 'Why Static Forms Are Better' },
      { id: 'how-they-work', title: 'How Static Form Handlers Work' },
      { id: 'method-1-pure-html', title: 'Method 1: Zero-JS Pure HTML Form' },
      { id: 'method-2-ajax-fetch', title: 'Method 2: Asynchronous AJAX / Fetch' },
      { id: 'spam-protection', title: 'Stopping Spam (Turnstile & Honeypot)' },
      { id: 'top-form-backends', title: 'The Best Form Backends Compared' },
      { id: 'step-by-step-example', title: 'Complete Production-Ready Code' },
      { id: 'best-practices', title: 'Best Practices & Accessibility' }
    ]
  },
  {
    slug: 'best-open-source-javascript-libraries-for-websites',
    title: 'Best Open Source JavaScript Libraries for Websites',
    description: 'The best open-source, lightweight Vanilla JavaScript libraries for adding carousels, lightbox galleries, animations, and interactive maps to static HTML sites.',
    excerpt: 'Enhance your static HTML websites without heavy frameworks like React or Vue. Discover the best zero-dependency, open-source Vanilla JavaScript libraries.',
    category: 'Interactive Scripts',
    categorySlug: 'interactive-scripts',
    date: '2026-03-14',
    dateFormatted: 'March 14, 2026',
    readTime: '7 min read',
    author: 'StaticStack Editorial',
    authorRole: 'Static Web Architecture',
    tags: [
      'javascript',
      'vanilla-js',
      'open-source',
      'swiper',
      'photoswipe',
      'aos',
      'leaflet',
      'interactive-scripts'
    ],
    featuredToolSlugs: [
      'swiper',
      'photoswipe',
      'aos',
      'leaflet',
      'plyr',
      'wavesurfer'
    ],
    toc: [
      { id: 'swiper', title: '1. Swiper: Touch Sliders' },
      { id: 'photoswipe', title: '2. PhotoSwipe: Image Lightbox' },
      { id: 'aos', title: '3. AOS: Scroll Animations' },
      { id: 'leaflet', title: '4. Leaflet: Interactive Maps' },
      { id: 'wavesurfer', title: '5. WaveSurfer: Audio Waveforms' },
      { id: 'plyr', title: '6. Plyr: Media Players' },
      { id: 'best-practices', title: 'Vanilla JS Best Practices' }
    ]
  },
  {
    slug: 'how-to-add-comments-to-a-static-html-blog',
    title: 'How to Add Comments to a Static HTML Blog',
    description: 'A practical step-by-step guide to adding serverless comments to static HTML and Jamstack blogs using Giscus, Utterances, and GitHub Discussions.',
    excerpt: "Static blogs don't need a database to host lively reader discussions. Learn how to embed lightweight, privacy-friendly comments with zero server maintenance.",
    category: 'Comments & Community',
    categorySlug: 'comments-community',
    date: '2026-03-13',
    dateFormatted: 'March 13, 2026',
    readTime: '7 min read',
    author: 'StaticStack Editorial',
    authorRole: 'Static Web Architecture',
    tags: [
      'static-blog',
      'comments',
      'giscus',
      'utterances',
      'github-discussions',
      'disqus-alternative',
      'jamstack'
    ],
    featuredToolSlugs: [
      'giscus',
      'utterances',
      'flarum',
      'github-discussions',
      'disqus'
    ],
    toc: [
      { id: 'why-avoid-disqus', title: 'Why Traditional Plugins Fail' },
      { id: 'the-best-options', title: 'Top Static Comment Options' },
      { id: 'step-by-step-giscus', title: 'Step-by-Step Giscus Tutorial' },
      { id: 'styling-tips', title: 'Styling & Dark Mode Integration' },
      { id: 'faq', title: 'Frequently Asked Questions' }
    ]
  },
  {
    slug: 'how-to-add-search-functionality-to-a-static-website',
    title: 'How to Add Search Functionality to a Static Website',
    description: 'Complete guide to implementing fast, client-side full-text search on static websites using Pagefind, Algolia, and JSON index search.',
    excerpt: 'Learn how to add lightning-fast, zero-server search to static HTML websites. We cover Pagefind, Algolia, and custom client-side indexing with real code examples.',
    category: 'Search',
    categorySlug: 'search',
    date: '2026-03-12',
    dateFormatted: 'March 12, 2026',
    readTime: '8 min read',
    author: 'StaticStack Editorial',
    authorRole: 'Static Web Architecture',
    tags: [
      'static-search',
      'pagefind',
      'algolia',
      'client-side-search',
      'full-text-search',
      'jamstack',
      'javascript'
    ],
    featuredToolSlugs: [
      'pagefind',
      'algolia',
      'astro',
      'eleventy',
      'hugo'
    ],
    toc: [
      { id: 'how-it-works', title: 'How Static Search Works' },
      { id: 'top-search-tools', title: 'Top Static Search Solutions' },
      { id: 'pagefind-tutorial', title: 'Pagefind Step-by-Step Tutorial' },
      { id: 'custom-json-search', title: 'Vanilla JS JSON Search Method' },
      { id: 'best-practices', title: 'Static Search Best Practices' }
    ]
  },
  {
    slug: 'how-to-build-a-website-without-a-database-or-backend',
    title: 'How to Build a Website Without a Database or Backend',
    description: 'The complete blueprint for building dynamic-feeling static websites with zero databases, zero server maintenance, and serverless micro-APIs.',
    excerpt: "Think static sites can't handle user logins, forms, payments, or dynamic storage? Discover the complete blueprint to build modern web apps without a backend server.",
    category: 'Tutorials',
    categorySlug: 'tutorials',
    date: '2026-03-10',
    dateFormatted: 'March 10, 2026',
    readTime: '10 min read',
    author: 'StaticStack Editorial',
    authorRole: 'Static Web Architecture',
    tags: [
      'serverless',
      'no-database',
      'jamstack',
      'static-website',
      'clerk',
      'stripe',
      'supabase',
      'architecture'
    ],
    featuredToolSlugs: [
      'clerk',
      'supabase',
      'jsonbin',
      'stripe-payment-links',
      'lemon-squeezy',
      'web3forms'
    ],
    toc: [
      { id: 'the-architecture', title: 'Static Core + Edge APIs' },
      { id: 'authentication', title: '1. User Auth Without a Database' },
      { id: 'payments', title: '2. Ecommerce Without a Server' },
      { id: 'database', title: '3. Storing Dynamic Data' },
      { id: 'forms-leads', title: '4. Inquiries & Lead Capture' },
      { id: 'benefits', title: 'Benefits of the Serverless Stack' }
    ]
  }
];

function getAllBlogPosts() {
  return BLOG_POSTS;
}

function getBlogPostBySlug(slug) {
  return BLOG_POSTS.find(p => p.slug === slug);
}

module.exports = {
  BLOG_POSTS,
  getAllBlogPosts,
  getBlogPostBySlug
};
