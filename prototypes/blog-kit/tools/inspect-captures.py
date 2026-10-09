#!/usr/bin/env python3
"""Read a delivery of captures and say what each one is, so the manifest starts from facts
rather than from the author's description.

    tools/inspect-captures.py <folder | sources.zip> [--json]

For every PNG: pixel size and ratio, the likely device pixel ratio (from the width), whether a
dimmed backdrop surrounds the subject (a dialog shot on top of its page), whether a sidebar
column sits on the left (a whole screen with the full or the compact sidebar), and from those a
suggested slot: a whole screen in the column or on a wide panel, a dialog on a panel, a detail
crop, a pair candidate (two captures of the same size), or an image to look at by hand.
Everything is a heuristic from pixels, printed as a suggestion for whoever writes images.json;
nothing is written. Videos are listed with their size only (ffprobe when available).
"""
from __future__ import annotations

import json
import subprocess
import sys
import zipfile
from pathlib import Path, PurePosixPath

sys.path.insert(0, str(Path(__file__).resolve().parent))
import pngcrop  # noqa: E402

COLUMN = 828          # the article column, CSS px


def luminance(px: bytes) -> float:
    return 0.299 * px[0] + 0.587 * px[1] + 0.114 * px[2]


def inspect_png(name: str, data: bytes) -> dict:
    try:
        w, h, bpp, rows = pngcrop.read(data)
    except ValueError as e:
        return {'file': name, 'kind': 'unreadable', 'note': str(e)}

    def px(x: int, y: int) -> bytes:
        return bytes(rows[y][x * bpp : x * bpp + 3])

    def dim(c: bytes) -> bool:            # a dimmed backdrop: dark-ish grey, not a coloured surface
        return luminance(c) < 160 and max(c) - min(c) < 40

    # backdrop: most of the edge is dim while the middle is bright (a dialog shot on its page)
    edge_pts = [px(x, 2) for x in (w // 4, w // 2, 3 * w // 4)] + [px(x, h - 3) for x in (w // 4, w // 2, 3 * w // 4)] \
        + [px(2, y) for y in (h // 4, h // 2, 3 * h // 4)] + [px(w - 3, y) for y in (h // 4, h // 2, 3 * h // 4)]
    centre = [px(w // 2 + dx, h // 2 + dy) for dx in (-40, 0, 40) for dy in (-40, 0, 40)]
    backdrop = sum(map(dim, edge_pts)) >= 10 and sum(map(luminance, centre)) / len(centre) > 200

    # sidebar: ink per column (share of dark pixels) over the left third; a sidebar is ink,
    # then a quiet gap (its padding and border), then the content's ink again
    dpr = 2 if w >= 2000 else 1
    ys = range(h // 12, h, max(1, h // 160))
    def ink(x: int) -> float:
        return sum(1 for y in ys if luminance(px(x, y)) < 120) / len(ys)
    edge = None
    if not backdrop:
        seen_ink, quiet = False, 0
        for x in range(4, w // 3):
            v = ink(x)
            if v > 0.03:
                if quiet >= 6 * dpr and seen_ink:
                    edge = x - quiet
                    break
                seen_ink, quiet = True, 0
            else:
                quiet += 1
    dpr = 2 if w >= 2000 else 1
    css_w = w / dpr
    ratio = round(w / h, 2)
    sidebar = None
    if edge:
        e = edge / dpr
        sidebar = 'compact' if e < 90 else 'full' if e < 340 else None
    if backdrop:
        kind, slot = 'dialog on its page', 'cut the dialog out (crop 2px inside its edge) and put it on a .panel'
    elif sidebar and css_w >= 1100:
        kind, slot = f'whole screen, {sidebar} sidebar', 'a .shot in the column, or on a .panel--wide in a full-row block'
    elif css_w >= 1100 and 1.4 <= ratio <= 2.15:
        kind, slot = 'whole screen or content area', 'a .shot in the column; crop the sidebar out if it carries nothing'
    elif css_w < 700:
        kind, slot = 'detail or region', 'a .shot on a .panel at the default width'
    else:
        kind, slot = 'crop or composite', 'look at it; probably a .shot on a .panel--wide or a .block visual'
    legibility = round(14 * COLUMN / css_w, 1)
    return {'file': name, 'kind': kind, 'px': f'{w}x{h}', 'ratio': ratio, 'dpr': dpr, 'css_width': int(css_w),
            'text_in_column_px': legibility, 'backdrop': backdrop, 'sidebar': sidebar, 'suggest': slot}


def inspect_video(name: str, path: Path | None, size: int) -> dict:
    d = {'file': name, 'kind': 'clip', 'bytes': size}
    if path:
        try:
            out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'csv=p=0', str(path)],
                                 capture_output=True, text=True, timeout=20).stdout.split()
            if out:
                d['px'] = out[0].replace(',', 'x').rstrip('x')
                d['seconds'] = round(float(out[-1]), 1)
        except (OSError, ValueError, subprocess.SubprocessError):
            pass
    return d


def main(src: str, as_json: bool) -> int:
    p = Path(src)
    items: list[tuple[str, bytes | None, Path | None, int]] = []
    if p.suffix == '.zip':
        zf = zipfile.ZipFile(p)
        for n in zf.namelist():
            base = PurePosixPath(n).name
            if n.endswith('/') or n.startswith('__MACOSX') or base.startswith('.'):
                continue
            items.append((base, zf.read(n) if base.lower().endswith('.png') else None, None, zf.getinfo(n).file_size))
    else:
        for f in sorted(p.iterdir()):
            if f.is_file() and not f.name.startswith('.'):
                items.append((f.name, f.read_bytes() if f.suffix.lower() == '.png' else None, f, f.stat().st_size))
    report = []
    for name, data, path, size in items:
        if data is not None:
            report.append(inspect_png(name, data) | {'bytes': size})
        elif name.lower().endswith(('.mov', '.mp4', '.webm')):
            report.append(inspect_video(name, path, size))
        else:
            report.append({'file': name, 'kind': 'other', 'bytes': size})
    # pair candidates: two PNGs of the same size are usually a before/after
    sizes: dict[str, list[str]] = {}
    for r in report:
        if 'px' in r and r['kind'] != 'clip':
            sizes.setdefault(r['px'], []).append(r['file'])
    for r in report:
        if r.get('px') in sizes and len(sizes[r['px']]) > 1:
            r['pair_with'] = [f for f in sizes[r['px']] if f != r['file']]
    if as_json:
        print(json.dumps(report, indent=2))
        return 0
    for r in report:
        line = f"{r['file']:32s} {r['kind']:28s} {r.get('px', ''):10s} {r.get('bytes', 0) // 1024:5d} KB"
        if r['kind'] == 'clip' and 'seconds' in r:
            line += f"  {r['seconds']} s"
        if 'dpr' in r:
            line += f"  {r['dpr']}x  text in column ≈ {r['text_in_column_px']}px"
        print(line)
        if r.get('suggest'):
            print(f"{'':32s} → {r['suggest']}")
        if r.get('pair_with'):
            print(f"{'':32s} → same size as {', '.join(r['pair_with'])}: a before/after pair?")
    total = sum(r.get('bytes', 0) for r in report)
    print(f"\n{len(report)} files, {total / 1024 / 1024:.1f} MB raw")
    return 0


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if len(args) != 1:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(args[0], '--json' in sys.argv))
