#!/usr/bin/env python3
"""Encode every clip in a manifest with prepare-video.sh and write its size into the pages.

    tools/prepare-videos.py examples/<post>/videos.json

The manifest mirrors images.json: the pages, the raw sources (a folder or the sources zip),
the output folder and one entry per clip. A crop or a trim lives here, not in a shell history,
so a clip can be re-encoded the same way after a new recording or a changed cut:

    { "html": "index.html", "raw": "video/raw", "out": "video",
      "videos": [ { "raw": "Screen Recording 2026-10-09 at 15.02.23.mov", "out": "goto",
                    "trim": "0-13.8", "note": "cut before the cursor leaves the frame" },
                  { "raw": "clip.mov", "out": "iot-hub-screen", "crop": "1390:886:108:74" } ] }

Per entry: `crop` is "w:h:x:y" in source pixels, `trim` is "start-end" seconds (either side
open), `maxWidth` defaults to 1600. Each clip becomes out.mp4, out.webm and a poster
(out.webp or out.jpg, whichever this ffmpeg can write); width/height are set on every <video>
whose poster is that file, added when the tag has none. The encoded files are git-ignored;
rerun to regenerate them.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

TOOLS = Path(__file__).resolve().parent
ENCODER = TOOLS / 'prepare-video.sh'

sys.path.insert(0, str(TOOLS))
from htmlsize import set_size  # noqa: E402


def main(manifest_path: str) -> int:
    mpath = Path(manifest_path).resolve()
    base = mpath.parent
    m = json.loads(mpath.read_text())
    pages = {base / p: (base / p).read_text() for p in ([m['html']] if isinstance(m['html'], str) else m['html'])}
    raw = base / m['raw']
    out_dir = base / m['out']
    out_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        if raw.suffix == '.zip':
            zf = zipfile.ZipFile(raw)
            members = {PurePosixPath(n).name: n for n in zf.namelist()
                       if not n.endswith('/') and not n.startswith('__MACOSX') and not PurePosixPath(n).name.startswith('.')}

            def source(name: str) -> Path:
                target = Path(tmp) / name
                target.write_bytes(zf.read(members[name]))
                return target
            have = members.keys()
        else:
            def source(name: str) -> Path:
                return raw / name
            have = {p.name for p in raw.iterdir()} if raw.is_dir() else set()
        missing = [e['raw'] for e in m['videos'] if e['raw'] not in have]
        if missing:
            print('missing in', raw, ':', ', '.join(missing))
            return 1

        for e in m['videos']:
            out = out_dir / e['out']
            args = [str(ENCODER), str(source(e['raw'])), str(out), str(e.get('maxWidth', 1600)), e.get('crop') or '-', e.get('trim') or '']
            res = subprocess.run(['bash'] + args, capture_output=True, text=True)
            if res.returncode:
                print(res.stdout, res.stderr)
                return res.returncode
            dims = re.search(r'dimensions: (\d+)x(\d+)', res.stdout)
            w, h = int(dims.group(1)), int(dims.group(2))
            refs = 0
            for path, html in pages.items():
                for ext in ('webp', 'jpg'):
                    pages[path], n = set_size(html, 'video', f'{e["out"]}.{ext}', w, h)
                    html = pages[path]
                    refs += n
            sizes = ' '.join(line.split()[-2] + 'KB' for line in res.stdout.splitlines() if line.strip().endswith('KB'))
            print(f'{e["out"]:24s} {w}x{h}   {sizes}' + ('' if refs else '   (not referenced in any page)'))
    for path, html in pages.items():
        path.write_text(html)
    return 0


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
