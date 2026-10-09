#!/usr/bin/env python3
"""Print Tabler icons as inline SVG for the kit's tiles and cards.

    tools/tabler.py key lock cpu            # one <svg> per line
    tools/tabler.py --list bolt             # names containing "bolt"

Tabler is the site's icon set (the `@iconify-json/tabler` package the site depends on); the
kit's card tiles and diagram boxes use it so icons match the rest of thingsboard.io. The
output is the icon's own body (stroke 2, round caps, 24 × 24 box) wrapped in an <svg> that
inherits currentColor, ready to paste inside <span class="stile">.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import os

HERE = Path(__file__).resolve().parent
REL = Path('node_modules') / '@iconify-json' / 'tabler' / 'icons.json'


def candidates() -> list[Path]:
    env = os.environ.get('TABLER_ICONS')
    out = [Path(env)] if env else []
    root = HERE.parents[2]                                   # the site repo (prototypes/blog-kit/tools → repo)
    out += [root / REL, HERE.parents[1] / REL]
    out += sorted(p / REL for p in root.parent.glob('thingsboard.io*') if (p / REL).exists())   # a sibling checkout or worktree
    return out


def load() -> dict:
    for c in candidates():
        if c.exists():
            return json.loads(c.read_text())['icons']
    sys.exit('Tabler icon data not found: run pnpm install in the site repo (it depends on @iconify-json/tabler), '
             'or point TABLER_ICONS at icons.json')


def svg(name: str, icons: dict | None = None) -> str:
    icons = icons or load()
    if name not in icons:
        raise KeyError(f'no Tabler icon named {name!r}')
    return f'<svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]["body"]}</svg>'


if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(2)
    data = load()
    if args[0] == '--list':
        print('\n'.join(n for n in sorted(data) if all(a in n for a in args[1:])))
    else:
        for n in args:
            print(svg(n, data))
