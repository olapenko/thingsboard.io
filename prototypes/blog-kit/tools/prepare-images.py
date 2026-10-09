#!/usr/bin/env python3
"""Prepare blog screenshots from a manifest and patch their sizes into the page.

    tools/prepare-images.py examples/<post>/images.json

The manifest lives next to the post and names the html, the raw folder, the output
folder and one entry per image:

    { "html": "index.html", "raw": "images/raw", "out": "images",
      "images": [ { "raw": "agent 1.png", "out": "agents-list.png" },
                  { "raw": "dash_2.png", "out": "dash-filter.png",
                    "crop": [30, 29, 696, 537], "note": "dialog only" } ] }

`crop` is (left, top, width, height) in source pixels. `patch` is a list of rectangles to
paint before cropping, each [left, top, width, height] in source pixels with an optional
"#rrggbb" fifth item (default: the colour of the pixel at the rectangle's top-left corner,
i.e. the surface around what it hides). It is the baked-in form of the page's `.patch`
overlay: use the overlay while a post is in review, move it here when it settles, so the
lightbox and any 2x file carry the fix too.

Each output image's natural size is written to the width/height attributes of the <img>
that references it, so the page reserves the right box before the file loads; CSS scales
the image down to the column, which is how a 1x screenshot wider than the column still
renders sharp on retina.

Raw originals are not committed (they come from the shared Drive folder); the
processed images are, so a page renders without rerunning this. Rerun after swapping
an original or changing a crop.

Cropping uses pngcrop.py (pure Python): macOS `sips --cropOffset` ignores its offset.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import pngcrop  # noqa: E402


def main(manifest_path: str) -> int:
    mpath = Path(manifest_path).resolve()
    base = mpath.parent
    m = json.loads(mpath.read_text())
    html_path = base / m['html']
    raw_dir = base / m['raw']
    out_dir = base / m['out']
    out_dir.mkdir(parents=True, exist_ok=True)
    html = html_path.read_text()

    missing = [e['raw'] for e in m['images'] if not (raw_dir / e['raw']).exists()]
    if missing:
        print('missing in', raw_dir, ':', ', '.join(missing))
        return 1

    for e in m['images']:
        src, dst = raw_dir / e['raw'], out_dir / e['out']
        if 'crop' in e or 'patch' in e:
            w, h, bpp, rows = pngcrop.read(src.read_bytes())
            for rect in e.get('patch', []):
                pngcrop.fill(rows, bpp, *rect)
            if 'crop' in e:
                w, h, rows = pngcrop.cut(rows, bpp, *e['crop'])
            dst.write_bytes(pngcrop.write(w, h, bpp, rows))
        else:
            dst.write_bytes(src.read_bytes())
            w, h, _, _ = pngcrop.read(dst.read_bytes())
        html, n = re.subn(
            rf'(src="[^"]*/{re.escape(e["out"])}"[^>]*?)width="[^"]*" height="[^"]*"',
            rf'\1width="{w}" height="{h}"', html)
        print(f'{e["out"]:24s} {w}x{h}' + ('' if n else '   (not referenced in the page)'))
    html_path.write_text(html)
    return 0


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
