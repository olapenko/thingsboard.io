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

Each output image's natural size is written to the width/height attributes of every <img>
that references it (added when a hand-written tag has none), so the page reserves the right
box before the file loads; CSS scales the image down to the column. `html` may be a list of
pages when several show the same files, so their sizes cannot drift apart.

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
from htmlsize import set_size  # noqa: E402



def main(manifest_path: str) -> int:
    mpath = Path(manifest_path).resolve()
    base = mpath.parent
    m = json.loads(mpath.read_text())
    pages = {base / p: (base / p).read_text() for p in ([m['html']] if isinstance(m['html'], str) else m['html'])}
    raw = base / m['raw']
    out_dir = base / m['out']
    out_dir.mkdir(parents=True, exist_ok=True)

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
        refs = 0
        for path, html in pages.items():
            pages[path], n = set_size(html, 'img', e['out'], w, h)
            refs += n
        print(f'{e["out"]:24s} {w}x{h} {dst.stat().st_size // 1024:5d} KB' + ('' if refs else '   (not referenced in any page)'))
    for path, html in pages.items():
        path.write_text(html)
    total = sum((out_dir / e['out']).stat().st_size for e in m['images'])
    print(f'{len(m["images"])} images, {total / 1024 / 1024:.1f} MB before the site\'s optimisation')
    return 0


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
