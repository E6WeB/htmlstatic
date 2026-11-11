"""
Generate 1200x630 cover.webp images for all blog articles.
Uses Chrome headless screenshot + Pillow WebP compression.
"""

import os
import sys
import base64
import subprocess
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
ASSET_IMG_DIR = os.path.join(ROOT_DIR, 'asset', 'img')

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

# Base64 logo
logo_path = os.path.join(ASSET_IMG_DIR, 'logo.png')
logo_b64 = ""
if os.path.exists(logo_path):
    with open(logo_path, 'rb') as f:
        logo_b64 = base64.b64encode(f.read()).decode('utf-8')

ARTICLES = [
    {
        'slug': 'why-people-are-leaving-wordpress-for-static-html',
        'category': 'Migration & Architecture',
        'eyebrow': 'The Great CMS Shift',
        'title': 'Why People Are Leaving WordPress for <span class="accent-text">Static HTML</span>',
        'desc': 'Discover why developers and agencies are abandoning bloated plugins, slow databases, and security patches for unhackable static HTML.',
        'pills': ['Zero Security Holes', '100/100 Lighthouse', 'Zero Hosting Costs', 'Git Versioning']
    },
    {
        'slug': 'how-to-add-contact-forms-to-static-websites',
        'category': 'Contact Forms',
        'eyebrow': 'Zero Backend Forms & Spam Prevention',
        'title': 'How to Add Contact Forms to <span class="accent-text">Static Websites</span>',
        'desc': 'Complete guide to capturing form submissions on static HTML and Jamstack sites without databases, servers, or PHP.',
        'pills': ['Web3Forms', 'Formspree', 'Basin', 'Cloudflare Turnstile', 'AJAX & HTML']
    },
    {
        'slug': '25-best-free-tools-for-building-static-html-websites',
        'category': 'Curated Directory',
        'eyebrow': 'Essential Web Developer Toolkit',
        'title': '25 Best Free Tools for Building <span class="accent-text">Static HTML Websites</span>',
        'desc': 'The definitive free toolkit for static sites: SSGs, free CDN hosting, headless CMSs, forms, comments, and modern Vanilla JS.',
        'pills': ['Astro & 11ty', 'Cloudflare Pages', 'Decap CMS', 'Pagefind', 'Pico CSS']
    },
    {
        'slug': 'how-to-build-a-website-without-wordpress',
        'category': 'Migration & Architecture',
        'eyebrow': 'Break Free from Bloated CMSs',
        'title': 'How to Build a Website <span class="accent-text">Without WordPress</span>',
        'desc': 'Replace slow PHP, security vulnerabilities, and database maintenance with blisteringly fast pre-rendered static HTML.',
        'pills': ['Decoupled Architecture', 'Zero Plugins', 'Git-Based CMS', '100/100 Lighthouse']
    },
    {
        'slug': 'best-free-hosting-services-for-static-html-websites',
        'category': 'Hosting & Deployment',
        'eyebrow': 'Global Edge Networks Compared',
        'title': 'Best Free Hosting Services for <span class="accent-text">Static HTML Websites</span>',
        'desc': 'Detailed comparison of Cloudflare Pages, Vercel, Netlify, GitHub Pages, and Render: bandwidth, speed, and build limits.',
        'pills': ['Cloudflare Pages', 'Vercel', 'Netlify', 'GitHub Pages', 'Unlimited Bandwidth']
    },
    {
        'slug': 'best-open-source-javascript-libraries-for-websites',
        'category': 'Interactive Scripts',
        'eyebrow': 'Lightweight Vanilla JS Tools',
        'title': 'Best Open Source <span class="accent-text">JavaScript Libraries</span> for Websites',
        'desc': 'Supercharge static HTML sites with zero-framework, dependency-free interactive libraries for sliders, lightboxes, and maps.',
        'pills': ['Swiper', 'PhotoSwipe', 'AOS Animations', 'Leaflet Maps', 'WaveSurfer']
    },
    {
        'slug': 'how-to-add-comments-to-a-static-html-blog',
        'category': 'Community & Comments',
        'eyebrow': 'Serverless Discussion Widgets',
        'title': 'How to Add Comments to a <span class="accent-text">Static HTML Blog</span>',
        'desc': 'Enable rich reader discussions without database bloat or tracking scripts using Giscus, Utterances, and GitHub Discussions.',
        'pills': ['Giscus', 'GitHub Discussions', 'Utterances', 'Zero Tracking', 'Markdown Support']
    },
    {
        'slug': 'how-to-add-search-functionality-to-a-static-website',
        'category': 'Client-Side Search',
        'eyebrow': 'Lightning-Fast Static Indexing',
        'title': 'How to Add Search Functionality to a <span class="accent-text">Static Website</span>',
        'desc': 'Build sub-50ms instant client-side search without server queries using Pagefind, Algolia, and lightweight JSON search.',
        'pills': ['Pagefind', 'Sub-50ms Search', 'Zero Backend', 'Full-Text Indexing']
    },
    {
        'slug': 'how-to-build-a-website-without-a-database-or-backend',
        'category': 'Serverless Architecture',
        'eyebrow': 'The Complete Jamstack Blueprint',
        'title': 'How to Build a Website <span class="accent-text">Without a Database or Backend</span>',
        'desc': 'Power dynamic web apps, authentication, payments, and storage purely with static HTML and modern serverless micro-APIs.',
        'pills': ['Clerk Auth', 'Stripe Links', 'Firebase & Supabase', 'JSON Storage']
    }
]

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #090d16;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 56px 68px;
      position: relative;
    }}
    /* Glowing radial background accents */
    .glow-1 {{
      position: absolute;
      width: 700px;
      height: 700px;
      top: -240px;
      right: -180px;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, rgba(99, 102, 241, 0.12) 40%, transparent 70%);
      pointer-events: none;
    }}
    .glow-2 {{
      position: absolute;
      width: 500px;
      height: 500px;
      bottom: -200px;
      left: -100px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 65%);
      pointer-events: none;
    }}
    /* Subtle dot grid pattern */
    .grid-pattern {{
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 28px 28px;
      opacity: 0.6;
      pointer-events: none;
    }}
    .header {{
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}
    .brand {{
      display: flex;
      align-items: center;
      gap: 14px;
    }}
    .brand-logo {{
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
    }}
    .brand-logo svg {{
      width: 24px;
      height: 24px;
      stroke: #ffffff;
      fill: none;
      stroke-width: 2.2;
    }}
    .brand-title {{
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
    }}
    .brand-badge {{
      font-size: 14px;
      font-weight: 700;
      color: #60a5fa;
      background: rgba(37, 99, 235, 0.18);
      border: 1px solid rgba(96, 165, 250, 0.3);
      padding: 3px 9px;
      border-radius: 6px;
      margin-left: 2px;
    }}
    .category-badge {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      padding: 8px 18px;
      border-radius: 9999px;
      font-size: 15px;
      font-weight: 700;
      color: #93c5fd;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }}
    .main {{
      position: relative;
      z-index: 10;
      margin-top: 10px;
      margin-bottom: 20px;
    }}
    .eyebrow {{
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #38bdf8;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .eyebrow::before {{
      content: "";
      width: 20px;
      height: 2px;
      background: #38bdf8;
      display: inline-block;
    }}
    .title {{
      font-size: 50px;
      font-weight: 800;
      line-height: 1.14;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-bottom: 18px;
      max-width: 1040px;
    }}
    .accent-text {{
      background: linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}
    .desc {{
      font-size: 21px;
      line-height: 1.5;
      color: #94a3b8;
      max-width: 980px;
      font-weight: 400;
    }}
    .footer {{
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 22px;
    }}
    .pills {{
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }}
    .pill {{
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
      padding: 7px 16px;
      font-size: 14px;
      font-weight: 600;
      color: #cbd5e1;
    }}
    .url {{
      font-size: 19px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: -0.01em;
    }}
  </style>
</head>
<body>
  <div class="glow-1"></div>
  <div class="glow-2"></div>
  <div class="grid-pattern"></div>

  <div class="header">
    <div class="brand">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
      </div>
      <div>
        <span class="brand-title">StaticStack</span>
        <span class="brand-badge">.app</span>
      </div>
    </div>
    <div class="category-badge">{category}</div>
  </div>

  <div class="main">
    <div class="eyebrow">{eyebrow}</div>
    <h1 class="title">{title}</h1>
    <p class="desc">{desc}</p>
  </div>

  <div class="footer">
    <div class="pills">
      {pills_html}
    </div>
    <div class="url">staticstack.app/blog</div>
  </div>
</body>
</html>
"""

def generate_covers():
    temp_html = os.path.join(ROOT_DIR, '_temp_blog_cover.html')
    temp_png = os.path.join(ROOT_DIR, '_temp_blog_cover.png')

    for art in ARTICLES:
        slug = art['slug']
        out_dir = os.path.join(ROOT_DIR, 'blog', slug)
        os.makedirs(out_dir, exist_ok=True)
        out_webp = os.path.join(out_dir, 'cover.webp')

        print(f"Generating cover for: {slug}...")

        pills_html = "".join([f'<span class="pill">{p}</span>' for p in art['pills']])
        html_rendered = HTML_TEMPLATE.format(
            category=art['category'],
            eyebrow=art['eyebrow'],
            title=art['title'],
            desc=art['desc'],
            pills_html=pills_html
        )

        with open(temp_html, 'w', encoding='utf-8') as f:
            f.write(html_rendered)

        cmd = [
            CHROME_PATH,
            "--headless",
            "--hide-scrollbars",
            "--window-size=1200,630",
            f"--screenshot={temp_png}",
            f"file:///{temp_html.replace(os.sep, '/')}"
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error running Chrome: {res.stderr}")
            continue

        if os.path.exists(temp_png):
            im = Image.open(temp_png)
            im.save(out_webp, 'WEBP', quality=85, method=6)
            size_kb = round(os.path.getsize(out_webp) / 1024, 1)
            print(f"  -> Saved {out_webp} ({size_kb} KB)")

    # Cleanup temp files
    if os.path.exists(temp_html):
        os.remove(temp_html)
    if os.path.exists(temp_png):
        os.remove(temp_png)

if __name__ == '__main__':
    generate_covers()

