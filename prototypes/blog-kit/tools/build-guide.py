#!/usr/bin/env python3
"""Render GUIDE.md to examples/guide.html, so the guide reads next to the demo and ships in
the prototype artifact. No dependencies. Rerun after editing GUIDE.md:

    tools/build-guide.py

The Markdown subset the guide uses: # to #### headings, paragraphs, "- " and "1. " lists
with two-space continuation lines, | tables |, --- rules, **bold**, *italic*, `code` and
[text](url). The page shell (tokens, type, the top bar, the theme toggle, the contents block)
is lifted from kit-demo.html at build time so the two pages stay in step; the contents block
under the heading lists the guide's own sections.
"""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC, DEMO, OUT = ROOT / 'GUIDE.md', ROOT / 'examples' / 'kit-demo.html', ROOT / 'examples' / 'guide.html'

GUIDE_CSS = """
	/* guide prose, on top of the demo shell */
	.guide h1 { font-size: 2rem; line-height: 1.2; margin: 0 0 16px; }
	.guide h2 { font-size: 1.5rem; line-height: 1.3; margin: 48px 0 12px; padding-top: 40px; border-top: 1px solid var(--color-border); scroll-margin-top: 64px; }
	.guide h3 { font-size: 1.125rem; line-height: 1.3; margin: 28px 0 8px; scroll-margin-top: 64px; }
	.guide .lede { margin: 0; }
	.guide .badge--decide { vertical-align: 1px; margin: 0 2px 0 0; color: var(--color-notice); border-color: color-mix(in srgb, var(--color-notice) 45%, transparent); }
	.guide .page-head { margin-bottom: 20px; }
	.guide .kit-nav { margin-bottom: 32px; }
	.guide h4 { font-size: .9375rem; line-height: 1.3; margin: 20px 0 6px; color: var(--color-text); }
	.guide p { color: var(--color-text-secondary); line-height: 1.8; margin: 0 0 20px; }
	.guide ul, .guide ol { color: var(--color-text-secondary); line-height: 1.7; margin: 0 0 20px; padding-left: 22px; }
	.guide li { margin: 0 0 8px; }
	.guide li::marker { color: var(--color-text-muted); }
	.guide strong { color: var(--color-text); }
	.guide code { font-family: var(--font-mono); background: var(--color-bg-light); border-radius: 4px; padding: .15rem .4rem; font-size: .875em; }
	.guide table { width: 100%; border-collapse: collapse; margin: 0 0 24px; font-size: .9375rem; line-height: 1.5; }
	.guide th, .guide td { text-align: left; vertical-align: top; padding: 8px 10px 8px 0; border-bottom: 1px solid var(--color-border); }
	.guide th { color: var(--color-text); font-weight: 600; }
	.guide td { color: var(--color-text-secondary); }
	.guide hr { display: none; }   /* section rules are drawn by h2 */
	.guide .lede { color: var(--color-text-muted); font-size: .875rem; margin: 0 0 32px; }
	.guide .lede a { color: var(--color-primary); text-decoration: none; }
	.guide .lede a:hover { text-decoration: underline; }
"""


def inline(s: str) -> str:
    s = html.escape(s, quote=False)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)
    s = re.sub(r'<strong>Decide(:?)</strong>', r'<span class="badge badge--decide">Decide</span>\1', s)   # open decisions as badges
    return s


def slug(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', re.sub(r'[`*]', '', text).lower()).strip('-')


def render(md: str) -> str:
    out: list[str] = []
    buf: list[str] = []
    lines = md.split('\n')
    i = 0

    def flush() -> None:
        if buf:
            out.append('<p>' + inline(' '.join(x.strip() for x in buf)) + '</p>')
            buf.clear()

    while i < len(lines):
        ln = lines[i]
        if not ln.strip():
            flush(); i += 1; continue
        m = re.match(r'(#{1,4}) (.*)', ln)
        if m:
            flush()
            lvl, text = len(m.group(1)), m.group(2)
            out.append(f'<h{lvl} id="{slug(text)}">{inline(text)}</h{lvl}>')
            i += 1; continue
        if ln.strip() == '---':
            flush(); out.append('<hr />'); i += 1; continue
        if ln.startswith('|'):
            flush()
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')]); i += 1
            head, body = rows[0], rows[2:]   # rows[1] is the |---| separator
            out.append('<table><thead><tr>' + ''.join(f'<th>{inline(c)}</th>' for c in head) + '</tr></thead><tbody>'
                       + ''.join('<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in r) + '</tr>' for r in body) + '</tbody></table>')
            continue
        m = re.match(r'([-*]|\d+\.) (.*)', ln)
        if m:
            flush()
            ordered = m.group(1)[0].isdigit()
            items: list[list[str]] = []
            while i < len(lines):
                m2 = re.match(r'([-*]|\d+\.) (.*)', lines[i])
                if m2:
                    items.append([m2.group(2)]); i += 1
                elif lines[i].startswith('  ') and items:
                    items[-1].append(lines[i].strip()); i += 1
                else:
                    break
            tag = 'ol' if ordered else 'ul'
            out.append(f'<{tag}>' + ''.join('<li>' + inline(' '.join(it)) + '</li>' for it in items) + f'</{tag}>')
            continue
        buf.append(ln); i += 1
    flush()
    return '\n'.join(out)


def side_nav(body: str) -> str:
    """A .kit-nav like the demo's: one group per h2, its h3s as links (the h2 itself when it has none)."""
    groups: list[str] = []
    for h2 in re.finditer(r'<h2 id="([^"]+)">(.*?)</h2>(.*?)(?=<h2 |\Z)', body, re.S):
        hid, label, rest = h2.group(1), re.sub('<[^>]+>', '', h2.group(2)), h2.group(3)
        label = re.sub(r'^\d+\. ', '', label).split(' (')[0]   # short group label
        h3s = re.findall(r'<h3 id="([^"]+)">(.*?)</h3>', rest)
        def plain(t: str) -> str:
            return re.sub(r'^\d+\.\d+ ', '', re.sub('<[^>]+>', '', t))
        links = ''.join(f'<a href="#{i}">{plain(t)}</a>' for i, t in h3s) or f'<a href="#{hid}">{label}</a>'
        groups.append(f'<span class="group" data-label="{html.escape(label, quote=True)}"><span class="links">{links}</span></span>')
    return '<nav class="kit-nav" aria-label="Sections">' + ''.join(groups) + '</nav>'


def main() -> None:
    demo = DEMO.read_text()
    style = re.search(r'<style>.*?</style>', demo, re.S).group(0)
    bar = re.search(r'<header class="kit-bar">.*?</header>', demo, re.S).group(0)
    bar = bar.replace('<a href="kit-demo.html" aria-current="page">', '<a href="kit-demo.html">').replace('<a href="guide.html">', '<a href="guide.html" aria-current="page">')
    script = re.search(r'<script>\n\t\(function \(\) \{\n\t\tvar root.*?</script>', demo, re.S).group(0)
    body = render(SRC.read_text())
    # the first heading becomes the page title; a line under it says where the guide lives
    title = re.search(r'<h1[^>]*>(.*?)</h1>', body).group(1)
    h1 = re.search(r'<h1[^>]*>.*?</h1>', body).group(0)
    body = body.replace(h1, '<header class="page-head">' + h1.replace('</h1>', ' <span class="badge">draft</span></h1>') + '\n<p class="lede">Source: GUIDE.md on the kit branch, rendered by tools/build-guide.py. Items marked Decide need a call before the guide is final.</p></header>\n' + side_nav(body) + '\n<div class="guide-body">', 1) + '\n</div>'
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{re.sub('<[^>]+>', '', title)} · Blog visual kit</title>
{style.replace('</style>', GUIDE_CSS + '</style>')}
</head>
<body>
{bar}
<div class="page">
<main class="guide">
{body}
</main>
</div>
{script}
</body>
</html>
"""
    OUT.write_text(page)
    print(f'wrote {OUT.relative_to(ROOT)} ({len(page) // 1024} KB)')


if __name__ == '__main__':
    main()
