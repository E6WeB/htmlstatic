import os
import subprocess
import base64
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ASSET_IMG_DIR = os.path.join(SCRIPT_DIR, 'asset', 'img')
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# Load logo as base64
logo_path = os.path.join(ASSET_IMG_DIR, 'logo.png')
with open(logo_path, 'rb') as f:
    logo_b64 = base64.b64encode(f.read()).decode('utf-8')

pages = [
    {
        'key': 'home',
        'badge': 'Static Website Toolkit',
        'eyebrow': 'Zero Backend Servers Required',
        'title': 'Empower Static Websites with <span class="gradient-text">Zero Backend</span>',
        'desc': 'Discover curated tools, services, and APIs for building modern static sites with HTML, CSS, and JavaScript. 100% serverless and maintenance-free.',
        'badges': [
            {'text': '100% Jamstack', 'highlight': True},
            {'text': 'HTML / CSS / JS'},
            {'text': '27 Categories'},
            {'text': 'Free & Open Source'}
        ],
        'output_filenames': ['og-home.webp', 'og-image.webp']
    },
    {
        'key': 'archive',
        'badge': 'Master Directory',
        'eyebrow': 'Curated Static Web Directory',
        'title': 'Explore the Complete <span class="gradient-text">Master Directory</span>',
        'desc': 'Browse our organized directory across 27 static web categories. Filter by open source, free, freemium, or commercial tools with instant search.',
        'badges': [
            {'text': '27 Categories', 'highlight': True},
            {'text': 'Filter by Pricing'},
            {'text': 'Zero Backend Tools'},
            {'text': 'Instant Search'}
        ],
        'output_filenames': ['og-archive.webp']
    },
    {
        'key': 'submit',
        'badge': 'Community Submissions',
        'eyebrow': 'Help Grow the Collection',
        'title': 'Submit Your Favorite <span class="gradient-text">Static Web Tool</span>',
        'desc': 'Know a great static web service, library, or API? Share your favorite tools with the community and help fellow developers build faster, cleaner static sites.',
        'badges': [
            {'text': 'Community Curated', 'highlight': True},
            {'text': 'Open Source'},
            {'text': 'Contribute on GitHub'},
            {'text': 'Zero Backend Required'}
        ],
        'output_filenames': ['og-submit.webp']
    },
    {
        'key': 'community',
        'badge': 'Community & Forum',
        'eyebrow': 'Discussions & Static Site Wisdom',
        'title': 'Join the Global <span class="gradient-text">StaticStack Community</span>',
        'desc': 'Connect with static site developers. Discuss tools, share your Jamstack projects in the showcase, ask integration questions, and exchange advice.',
        'badges': [
            {'text': 'Community Forum', 'highlight': True},
            {'text': 'GitHub Discussions'},
            {'text': 'Facebook Groups'},
            {'text': 'Dev Showcase'}
        ],
        'output_filenames': ['og-community.webp']
    }
]

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{
      width: 1200px;
      height: 675px;
      overflow: hidden;
      background-color: #f8fafc;
      background-image: 
        radial-gradient(circle at 18% 28%, rgba(6, 182, 212, 0.22) 0%, transparent 45%),
        radial-gradient(circle at 85% 75%, rgba(37, 99, 235, 0.18) 0%, transparent 45%),
        radial-gradient(rgba(148, 163, 184, 0.38) 1.5px, transparent 1.5px);
      background-size: 100% 100%, 100% 100%, 28px 28px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px 80px 70px;
      position: relative;
    }}

    .deco-ring {{
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(37, 99, 235, 0.12);
      pointer-events: none;
    }}
    .deco-ring-1 {{
      width: 500px;
      height: 500px;
      right: -100px;
      top: -100px;
    }}
    .deco-ring-2 {{
      width: 700px;
      height: 700px;
      right: -200px;
      top: -200px;
    }}

    .og-header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 2;
    }}
    .og-brand {{
      display: flex;
      align-items: center;
      gap: 18px;
    }}
    .og-brand img {{
      width: 64px;
      height: 64px;
      border-radius: 16px;
      box-shadow: 0 10px 25px -4px rgba(37, 99, 235, 0.38);
    }}
    .og-brand-text {{
      font-size: 34px;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: #0f172a;
    }}
    .og-header-badge {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(203, 213, 225, 0.85);
      backdrop-filter: blur(8px);
      padding: 9px 20px;
      border-radius: 9999px;
      font-size: 16px;
      font-weight: 700;
      color: #2563eb;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}

    .og-main {{
      z-index: 2;
      max-width: 1040px;
      margin: auto 0;
    }}
    .og-eyebrow {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 700;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 16px;
    }}
    .og-title {{
      font-size: 64px;
      font-weight: 850;
      line-height: 1.12;
      letter-spacing: -0.035em;
      color: #0f172a;
      margin-bottom: 20px;
    }}
    .og-title .gradient-text {{
      background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}
    .og-description {{
      font-size: 26px;
      line-height: 1.45;
      color: #475569;
      max-width: 960px;
      font-weight: 450;
    }}

    .og-footer {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 2;
      padding-top: 24px;
      border-top: 1px solid rgba(226, 232, 240, 0.9);
    }}
    .og-badges {{
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }}
    .og-pill {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #cbd5e1;
      border-radius: 9999px;
      padding: 9px 20px;
      font-size: 17px;
      font-weight: 600;
      color: #1e293b;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    }}
    .og-pill.highlight {{
      background: #eff6ff;
      border-color: #bfdbfe;
      color: #1d4ed8;
    }}
    .og-url {{
      font-size: 21px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: -0.01em;
    }}
  </style>
</head>
<body>
  <div class="deco-ring deco-ring-1"></div>
  <div class="deco-ring deco-ring-2"></div>

  <div class="og-header">
    <div class="og-brand">
      <img src="data:image/png;base64,{logo_b64}" alt="StaticStack Logo">
      <span class="og-brand-text">StaticStack</span>
    </div>
    <div class="og-header-badge">{badge}</div>
  </div>

  <div class="og-main">
    <div class="og-eyebrow">{eyebrow}</div>
    <h1 class="og-title">{title}</h1>
    <p class="og-description">{desc}</p>
  </div>

  <div class="og-footer">
    <div class="og-badges">
      {badges_html}
    </div>
    <div class="og-url">staticstack.app</div>
  </div>
</body>
</html>
"""

temp_html = os.path.join(ASSET_IMG_DIR, '_temp_og.html')
temp_png = os.path.join(ASSET_IMG_DIR, '_temp_og.png')

for page in pages:
    print(f"Generating OG image for {page['key']}...")
    badges_html = "".join([
        f'<span class="og-pill {"highlight" if b.get("highlight") else ""}">{b["text"]}</span>'
        for b in page['badges']
    ])
    
    html_content = html_template.format(
        logo_b64=logo_b64,
        badge=page['badge'],
        eyebrow=page['eyebrow'],
        title=page['title'],
        desc=page['desc'],
        badges_html=badges_html
    )
    
    with open(temp_html, 'w', encoding='utf-8') as f:
        f.write(html_content)
        
    cmd = [
        CHROME_PATH,
        "--headless",
        "--hide-scrollbars",
        "--window-size=1200,675",
        f"--screenshot={temp_png}",
        f"file:///{temp_html.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd, check=True)
    
    # Convert PNG to WebP with Pillow
    im = Image.open(temp_png)
    for out_name in page['output_filenames']:
        out_path = os.path.join(ASSET_IMG_DIR, out_name)
        im.save(out_path, 'WEBP', quality=95)
        print(f"  -> Saved {out_path} ({os.path.getsize(out_path)} bytes)")

# Cleanup temp files
if os.path.exists(temp_html):
    os.remove(temp_html)
if os.path.exists(temp_png):
    os.remove(temp_png)

print("All OG images generated successfully!")
