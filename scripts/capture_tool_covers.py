import os
import sys
import shutil
import json
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
TOOLS_DIR = os.path.join(ROOT_DIR, 'tools')
DATA_PATH = os.path.join(ROOT_DIR, 'asset', 'json', 'tools-data.json')


def detect_chrome_path():
    if sys.platform == 'darwin':
        mac_path = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        if os.path.exists(mac_path):
            return mac_path
    elif sys.platform.startswith('win'):
        for p in [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe")
        ]:
            if os.path.exists(p):
                return p
    for bin_name in ('google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome'):
        found = shutil.which(bin_name)
        if found:
            return found
    return r"C:\Program Files\Google\Chrome\Application\chrome.exe"


CHROME_PATH = detect_chrome_path()
SCRATCH_DIR = os.path.join(SCRIPT_DIR, 'asset', 'img', 'scratch')
os.makedirs(SCRATCH_DIR, exist_ok=True)

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

# Load tools from tools-data.json
with open(DATA_PATH, 'r', encoding='utf-8') as f:
    categories = json.load(f)

all_tools = []
for cat in categories:
    cat_slug = cat.get('slug')
    for tool in cat.get('tools', []):
        all_tools.append({
            'name': tool.get('name'),
            'slug': tool.get('slug'),
            'categorySlug': cat_slug,
            'websiteUrl': tool.get('websiteUrl')
        })

print(f"Total tools in catalog: {len(all_tools)}")

def capture_tool(tool):
    name = tool['name']
    slug = tool['slug']
    cat = tool['categorySlug']
    url = tool['websiteUrl']

    if not url:
        return (slug, False, "No websiteUrl provided")

    dest_dir = os.path.join(TOOLS_DIR, cat)
    dest_path = os.path.join(dest_dir, f"{slug}-cover.webp")

    if os.path.exists(dest_path):
        return (slug, True, "Already exists")

    temp_png = os.path.join(SCRATCH_DIR, f"temp_{slug}_{os.getpid()}_{int(time.time()*1000)}.png")

    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--user-agent={USER_AGENT}",
        "--window-size=1440,810",
        "--virtual-time-budget=4000",
        f"--screenshot={temp_png}",
        url
    ]

    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=20)
        if not os.path.exists(temp_png) or os.path.getsize(temp_png) == 0:
            return (slug, False, f"Chrome produced empty screenshot for {url}")

        # Open and resize to standard 16:9 landscape 1280x720
        with Image.open(temp_png) as im:
            # Convert RGBA to RGB if saving WebP or keep RGB
            if im.mode in ('RGBA', 'LA'):
                # Clean white background for transparency
                bg = Image.new('RGB', im.size, (255, 255, 255))
                bg.paste(im, mask=im.split()[-1])
                im_resized = bg.resize((1280, 720), Image.Resampling.LANCZOS)
            else:
                im_rgb = im.convert('RGB')
                im_resized = im_rgb.resize((1280, 720), Image.Resampling.LANCZOS)

            im_resized.save(dest_path, 'WEBP', quality=82)

        size_kb = os.path.getsize(dest_path) // 1024
        return (slug, True, f"Captured ({size_kb} KB)")

    except subprocess.TimeoutExpired:
        return (slug, False, f"Timeout capturing {url}")
    except Exception as e:
        return (slug, False, str(e))
    finally:
        if os.path.exists(temp_png):
            try:
                os.remove(temp_png)
            except Exception:
                pass

def main():
    # Filter tools that need capturing
    to_capture = []
    for t in all_tools:
        dest_path = os.path.join(TOOLS_DIR, t['categorySlug'], f"{t['slug']}-cover.webp")
        if not os.path.exists(dest_path):
            to_capture.append(t)

    print(f"Tools needing covers: {len(to_capture)} / {len(all_tools)}")
    if not to_capture:
        print("All tools already have covers! Running generate-pages.js...")
        subprocess.run(["node", "generate-pages.js"], cwd=SCRIPT_DIR)
        return

    success_count = 0
    fail_count = 0
    failed_tools = []

    # 3 concurrent worker threads to balance CPU and network
    max_workers = 3
    print(f"Starting capture with {max_workers} concurrent workers...")

    start_time = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_tool = {executor.submit(capture_tool, tool): tool for tool in to_capture}
        completed = 0
        total = len(to_capture)

        for future in as_completed(future_to_tool):
            completed += 1
            tool = future_to_tool[future]
            try:
                slug, success, msg = future.result()
                if success:
                    success_count += 1
                    print(f"[{completed}/{total}] [OK] {tool['name']}: {msg}")
                else:
                    fail_count += 1
                    failed_tools.append((tool['name'], tool['websiteUrl'], msg))
                    print(f"[{completed}/{total}] [FAILED] {tool['name']}: {msg}")
            except Exception as exc:
                fail_count += 1
                failed_tools.append((tool['name'], tool['websiteUrl'], str(exc)))
                print(f"[{completed}/{total}] [ERROR] {tool['name']} generated an exception: {exc}")

    elapsed = int(time.time() - start_time)
    print("\n" + "="*50)
    print(f"Finished in {elapsed}s.")
    print(f"Successful: {success_count}")
    print(f"Failed: {fail_count}")
    if failed_tools:
        print("\nFailed tools summary:")
        for name, url, err in failed_tools:
            print(f"  - {name} ({url}): {err}")
    print("="*50)

    # Clean up scratch dir
    try:
        os.rmdir(SCRATCH_DIR)
    except Exception:
        pass

    # Regenerate all HTML pages with the new covers
    print("\nRegenerating HTML pages with node generate-pages.js...")
    subprocess.run(["node", "generate-pages.js"], cwd=SCRIPT_DIR)
    print("Done!")

if __name__ == '__main__':
    main()
