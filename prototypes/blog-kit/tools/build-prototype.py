#!/usr/bin/env python3
"""Assemble the prototype for sharing: the 4.4 page, the demo and the guide, with kit.css,
kit.js and every image and clip, in one flat folder. The demo and the guide carry the kit's
top bar already; the post page gets the same bar (markup and CSS lifted from the demo).

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

PAGES = [('index.html', 'Post preview'), ('demo.html', 'Components'), ('guide.html', 'Guide')]


def rewrite_links(page: str) -> str:
    """The examples link each other relative to examples/; the flat folder has three files."""
    return page.replace('href="thingsboard-4-4/"', 'href="index.html"').replace('href="kit-demo.html"', 'href="demo.html"')


def bar_for_post(demo: str) -> tuple[str, str]:
    """The demo's top bar (markup + its CSS block) with the post link current, for index.html."""
    css = re.search(r'/\* kit-bar:.*?/\* /kit-bar \*/', demo, re.S).group(0)
    bar = re.search(r'<header class="kit-bar">.*?</header>', demo, re.S).group(0)
    bar = bar.replace('<a href="kit-demo.html" aria-current="page">', '<a href="kit-demo.html">').replace('<a href="thingsboard-4-4/">', '<a href="thingsboard-4-4/" aria-current="page">')
    return css, rewrite_links(bar)


THEME_JS = """<script>
	(function () {
		var root = document.documentElement, btn = document.getElementById('kit-theme');
		try { var saved = localStorage.getItem('kit-theme'); if (saved) root.dataset.theme = saved; } catch (e) {}
		if (!btn) return;
		btn.addEventListener('click', function () {
			var dark = root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
			root.dataset.theme = dark ? 'light' : 'dark';
			try { localStorage.setItem('kit-theme', root.dataset.theme); } catch (e) {}
		});
	})();
</script>
"""


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

    # the post: keep its inline shell styles, add the kit link, the shared top bar and its
    # CSS; the shell's own sticky header moves down by the bar's height
    demo = (EX / 'kit-demo.html').read_text()
    bar_css, bar = bar_for_post(demo)
    h = (EX / 'thingsboard-4-4' / 'index.html').read_text()
    style = re.search(r'<style>.*?</style>', h, re.S).group(0)
    body = re.search(r'<body>(.*)</body>', h, re.S).group(1)
    page = ('<title>ThingsBoard 4.4 Blog Prototype</title>\n<link rel="stylesheet" href="kit.css" />\n' + style + '\n'
            + '<style>\n' + bar_css + '\n\t.header { top: 48px !important; }\n</style>\n' + bar + THEME_JS + body)
    page = page.replace('<script src="../../kit.js"></script>', '<script src="kit.js"></script>')
    page = page.replace('Reference page for the blog visual kit (see ../../README.md). Copy follows the draft; captions, author and date are placeholders.',
                        'Reference page for the blog visual kit. Copy follows the draft; captions, author and date are placeholders. <a href="demo.html">Open the kit demo &rarr;</a>')
    assert '../' not in page, 'a relative path survived in index.html'
    (pub / 'index.html').write_text(page)

    d = (demo.replace('href="../kit.css"', 'href="kit.css"').replace('src="../kit.js"', 'src="kit.js"')
          .replace('thingsboard-4-4/images/', 'images/').replace('thingsboard-4-4/video/', 'video/').replace('kit-demo/video/', 'video/'))
    d = rewrite_links(d)
    assert '../' not in d and 'kit-bar' in d
    (pub / 'demo.html').write_text(d)

    g = rewrite_links((EX / 'guide.html').read_text())
    assert '../' not in g and 'kit-bar' in g and 'kit-demo.html' not in g
    (pub / 'guide.html').write_text(g)
    print('built', sorted(os.listdir(pub)))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    main(sys.argv[1])
