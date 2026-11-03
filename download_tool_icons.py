from concurrent.futures import ThreadPoolExecutor, as_completed
import io
import json
import os
import urllib.parse
import urllib.request
from PIL import Image, ImageDraw, ImageFont

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TOOLS_DATA_PATH = os.path.join(SCRIPT_DIR, 'asset', 'json', 'tools-data.json')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}


def get_domain(url):
    if not url:
        return ''
    try:
        parsed = urllib.parse.urlparse(url)
        host = parsed.netloc or ''
        return host.removeprefix('www.')
    except Exception:
        return ''


def create_fallback_icon(name, size=64):
    initial = (name or 'T')[0].upper()
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle(
        [(2, 2), (size - 3, size - 3)],
        radius=14,
        fill=(17, 24, 39, 255),
        outline=(55, 65, 81, 255),
        width=3
    )
    try:
        font = ImageFont.truetype('arialbd.ttf', int(size * 0.52))
    except Exception:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), initial, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (size - tw) / 2 - bbox[0]
    ty = (size - th) / 2 - bbox[1]
    draw.text((tx, ty), initial, fill=(255, 255, 255, 255), font=font)
    return img


def fetch_icon_image(domain):
    if not domain:
        return None
    urls = [
        f'https://icons.duckduckgo.com/ip3/{domain}.ico',
        f'https://www.google.com/s2/favicons?domain={domain}&sz=64'
    ]
    for url in urls:
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = resp.read()
                if not data or len(data) < 64:
                    continue
                im = Image.open(io.BytesIO(data))
                # If ICO has multiple sizes, pick largest frame
                if getattr(im, 'n_frames', 1) > 1:
                    best_frame = 0
                    best_area = 0
                    for idx in range(im.n_frames):
                        im.seek(idx)
                        w, h = im.size
                        if w * h > best_area:
                            best_area = w * h
                            best_frame = idx
                    im.seek(best_frame)
                im = im.convert('RGBA')
                if im.size[0] > 64 or im.size[1] > 64:
                    im = im.resize((64, 64), Image.Resampling.LANCZOS)
                return im
        except Exception:
            continue
    return None


def process_tool(cat_slug, tool):
    slug = tool['slug']
    name = tool['name']
    domain = get_domain(tool.get('websiteUrl', ''))
    out_dir = os.path.join(SCRIPT_DIR, 'tools', cat_slug)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f'{slug}-icon.webp')

    im = fetch_icon_image(domain)
    is_dl = im is not None
    if not is_dl:
        im = create_fallback_icon(name, 64)

    im.save(out_path, 'WEBP', quality=88, method=6)
    return is_dl, os.path.getsize(out_path)


def main():
    with open(TOOLS_DATA_PATH, 'r', encoding='utf-8') as f:
        categories = json.load(f)

    tasks = []
    for cat in categories:
        cat_slug = cat['slug']
        for tool in cat.get('tools', []):
            tasks.append((cat_slug, tool))

    downloaded = 0
    fallback_used = 0
    total_bytes = 0

    with ThreadPoolExecutor(max_workers=16) as pool:
        futures = [pool.submit(process_tool, cs, t) for cs, t in tasks]
        for fut in as_completed(futures):
            is_dl, sz = fut.result()
            if is_dl:
                downloaded += 1
            else:
                fallback_used += 1
            total_bytes += sz

    print(
        f'Saved {downloaded + fallback_used} tool icons '
        f'({downloaded} downloaded, {fallback_used} fallback) — '
        f'Total size: {total_bytes:,} bytes ({total_bytes / 1024:.1f} KB)'
    )


if __name__ == '__main__':
    main()
