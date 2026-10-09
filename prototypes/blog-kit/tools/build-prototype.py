#!/usr/bin/env python3
"""Assemble the prototype for sharing: the 4.4 page, the demo and the guide, with kit.css,
kit.js and every image and clip, in one flat folder with a "Prototype" strip linking the three.

    tools/build-prototype.py <out-dir>

The examples reference the kit and each other with relative paths (../../kit.css,
thingsboard-4-4/images/…); this rewrites them to the flat layout and asserts none survive. The
folder is what gets published as the shared artifact (index.html = the post, demo.html,
guide.html). Nothing here is part of the kit itself.
"""
from __future__ import annotations

import os
import re
import shutil
import sys
from pathlib import Path

KIT = Path(__file__).resolve().parent.parent
EX = KIT / 'examples'

NAV_CSS = """<style>
	.proto-nav { position: sticky; top: 0; z-index: 60; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 18px; padding: 8px max(20px, calc((100% - 1200px) / 2 + 20px)); background: #0f161d; color: #c9ced6; font: 500 13px/1.4 ui-sans-serif, system-ui, 'Segoe UI', Roboto, sans-serif; }
	.proto-nav strong { color: #fff; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; font-size: 11px; margin-right: 6px; }
	.proto-nav a { color: #c9ced6; text-decoration: none; padding: 2px 0; border-bottom: 1px solid transparent; }
	.proto-nav a:hover { color: #fff; }
	.proto-nav a[aria-current] { color: #fff; border-bottom-color: #78b4f5; }
	{extra}
</style>
"""
PAGES = [('index.html', 'The 4.4 post'), ('demo.html', 'Kit demo'), ('guide.html', 'Guide')]
CUR = ' aria-current="page"'


def nav(current: str, extra_css: str) -> str:
    links = ''.join(f'<a href="{h}"{CUR if h == current else ""}>{t}</a>' for h, t in PAGES)
    return NAV_CSS.replace('{extra}', extra_css) + f'<nav class="proto-nav" aria-label="Prototype"><strong>Prototype</strong>{links}</nav>\n'


def copy_tree(src: Path, dst: Path) -> None:
    dst.mkdir(parents=True, exist_ok=True)
    for f in src.iterdir():
        if f.is_file():
            shutil.copy(f, dst / f.name)


def main(out: str) -> None:
    pub = Path(out).resolve()
    pub.mkdir(parents=True, exist_ok=True)
    for f in ('kit.css', 'kit.js'):
        shutil.copy(KIT / f, pub / f)
    copy_tree(EX / 'thingsboard-4-4' / 'images', pub / 'images')
    for folder in (EX / 'thingsboard-4-4' / 'video', EX / 'kit-demo' / 'video'):
        if folder.is_dir():
            copy_tree(folder, pub / 'video')

    # the post: keep its inline shell styles, drop in the kit link and the strip; the shell's
    # sticky header moves down by the strip's height
    h = (EX / 'thingsboard-4-4' / 'index.html').read_text()
    style = re.search(r'<style>.*?</style>', h, re.S).group(0)
    body = re.search(r'<body>(.*)</body>', h, re.S).group(1)
    page = ('<title>ThingsBoard 4.4 Blog Prototype</title>\n<link rel="stylesheet" href="kit.css" />\n' + style + '\n'
            + nav('index.html', '.header { top: var(--proto-nav-h, 36px) !important; }') + body)
    page = page.replace('<script src="../../kit.js"></script>', '<script src="kit.js"></script>')
    page = page.replace('Reference page for the blog visual kit (see ../../README.md). Copy follows the draft; captions, author and date are placeholders.',
                        'Reference page for the blog visual kit. Copy follows the draft; captions, author and date are placeholders. <a href="demo.html">Open the kit demo &rarr;</a>')
    assert '../' not in page, 'a relative path survived in index.html'
    (pub / 'index.html').write_text(page)

    d = (EX / 'kit-demo.html').read_text()
    d = (d.replace('href="../kit.css"', 'href="kit.css"').replace('src="../kit.js"', 'src="kit.js"')
          .replace('thingsboard-4-4/images/', 'images/').replace('thingsboard-4-4/video/', 'video/').replace('kit-demo/video/', 'video/'))
    d = d.replace('</head>\n<body>\n', '</head>\n<body>\n' + nav('demo.html', '.kit-nav { top: 36px; } .blog-content section, .review-head { scroll-margin-top: 92px; }'))
    assert '../' not in d and 'proto-nav' in d
    (pub / 'demo.html').write_text(d)

    g = (EX / 'guide.html').read_text()
    g = g.replace('href="kit-demo.html"', 'href="demo.html"').replace('href="thingsboard-4-4/"', 'href="index.html"')
    g = g.replace('</head>\n<body>\n', '</head>\n<body>\n' + nav('guide.html', '.toggle { top: 48px; }'))
    assert '../' not in g and 'proto-nav' in g and 'kit-demo.html' not in g
    (pub / 'guide.html').write_text(g)
    print('built', sorted(os.listdir(pub)))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    main(sys.argv[1])
