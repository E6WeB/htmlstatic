/**
 * StaticStack Blog Articles Registry
 * Stores metadata, categorization, and related tool links for all blog posts.
 */

const BLOG_POSTS = [
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

