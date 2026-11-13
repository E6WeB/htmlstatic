"""
Lossy/lossless WebP optimizer for StaticStack.
Re-encodes .webp assets at quality=80 (method=6), caps oversized icons (96px)
and covers (1200px wide), and only replaces a file when the output is smaller.
"""
import io
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TARGET_DIRS = ['tools', 'asset', 'blog', 'archive', 'submit', 'badge']


def optimize_webp_files():
    total_before = 0
    total_after = 0
    updated_count = 0
    scanned_count = 0

    for rel_dir in TARGET_DIRS:
        base = ROOT / rel_dir
        if not base.exists():
            continue
        for path in base.rglob('*.webp'):
            scanned_count += 1
            orig_bytes = path.read_bytes()
            orig_size = len(orig_bytes)
            total_before += orig_size

            try:
                with Image.open(io.BytesIO(orig_bytes)) as im:
                    if getattr(im, 'is_animated', False):
                        total_after += orig_size
                        continue

                    w, h = im.size
                    name = path.name.lower()
                    if name.endswith('-icon.webp') and max(w, h) > 96:
                        im.thumbnail((96, 96), Image.Resampling.LANCZOS)
                    elif (name.endswith('-cover.webp') or name.startswith('og-')) and w > 1200:
                        new_h = max(1, round(h * (1200 / w)))
                        im = im.resize((1200, new_h), Image.Resampling.LANCZOS)

                    buf = io.BytesIO()
                    im.save(buf, format='WEBP', quality=80, method=6)
                    new_bytes = buf.getvalue()
            except Exception as exc:
                print(f'Skip {path}: {exc}')
                total_after += orig_size
                continue

            if len(new_bytes) < orig_size:
                path.write_bytes(new_bytes)
                total_after += len(new_bytes)
                updated_count += 1
            else:
                total_after += orig_size

    saved = total_before - total_after
    print(
        f'Scanned {scanned_count} .webp files, optimized {updated_count}. '
        f'Before: {total_before / (1024 * 1024):.2f} MB -> '
        f'After: {total_after / (1024 * 1024):.2f} MB '
        f'(Saved {saved / (1024 * 1024):.2f} MB)'
    )


if __name__ == '__main__':
    optimize_webp_files()

