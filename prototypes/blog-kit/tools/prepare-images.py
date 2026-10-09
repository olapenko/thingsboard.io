#!/usr/bin/env python3
"""Prepare blog screenshots from a manifest and patch their sizes into the page.

    tools/prepare-images.py examples/<post>/images.json

The manifest lives next to the post and names the html, the raw sources, the output
folder and one entry per image. `raw` is a folder of originals or, the default handover,
the post's sources zip read in place (members are matched by file name, whatever folder
they sit in inside the zip; nothing is unpacked):

    { "html": "index.html", "raw": "sources.zip", "out": "images",
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

Raw originals (the zip or the folder) are not committed; the processed images are,
so a page renders without rerunning this. Rerun after a new zip or a changed crop.

Cropping uses pngcrop.py (pure Python): macOS `sips --cropOffset` ignores its offset.
"""
from __future__ import annotations

import json
import re
import sys
import zipfile
from pathlib import Path, PurePosixPath

sys.path.insert(0, str(Path(__file__).resolve().parent))
import pngcrop  # noqa: E402


def main(manifest_path: str) -> int:
    mpath = Path(manifest_path).resolve()
    base = mpath.parent
    m = json.loads(mpath.read_text())
    html_path = base / m['html']
    raw = base / m['raw']
    out_dir = base / m['out']
    out_dir.mkdir(parents=True, exist_ok=True)
    html = html_path.read_text()

    if raw.suffix == '.zip':
        zf = zipfile.ZipFile(raw)
        members = {PurePosixPath(n).name: n for n in zf.namelist()
                   if not n.endswith('/') and not n.startswith('__MACOSX') and not PurePosixPath(n).name.startswith('.')}
        read_raw = lambda name: zf.read(members[name])
        have = members.keys()
    else:
        read_raw = lambda name: (raw / name).read_bytes()
        have = {p.name for p in raw.iterdir()} if raw.is_dir() else set()
    missing = [e['raw'] for e in m['images'] if e['raw'] not in have]
    if missing:
        print('missing in', raw, ':', ', '.join(missing))
        return 1

    for e in m['images']:
        data, dst = read_raw(e['raw']), out_dir / e['out']
        if 'crop' in e or 'patch' in e:
            w, h, bpp, rows = pngcrop.read(data)
            for rect in e.get('patch', []):
                pngcrop.fill(rows, bpp, *rect)
            if 'crop' in e:
                w, h, rows = pngcrop.cut(rows, bpp, *e['crop'])
            dst.write_bytes(pngcrop.write(w, h, bpp, rows))
        else:
            dst.write_bytes(data)
            w, h, _, _ = pngcrop.read(data)
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
