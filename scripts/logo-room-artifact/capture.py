"""The Logo Room as a claude.ai artifact: its four pages from the dev server, working.

Overview, Bench, Spec and Files become index.html, bench.html, spec.html and files.html in site/.
Their dev styles move to shared css/<hash>.css files and Ubuntu comes from Google Fonts. The room's
scripts come along, bundled as room.js (bundle.mjs), with the Tabler icons for the new-mark picker
beside them; the lab's scripts and chrome stay behind. shell.js carries the room's address between
pages (an artifact link keeps no query), shell.css hides the lab around the room.

Usage (the room's dev server, tb-site-logos, on 4355):
    python3 -I scripts/logo-room-artifact/capture.py
"""

import hashlib
import html
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from datetime import date

BASE = 'http://localhost:4355'
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(HERE, 'site')
FONTS = (
    'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,400'
    '&family=Ubuntu+Mono:wght@400;700&display=swap'
)
# The room's pages: where the dev server has them, the file each becomes, its tab title.
PAGES = [
    ('/internal/design-system/logos/', 'index.html', 'Logo Room'),
    ('/internal/design-system/logos/bench/', 'bench.html', 'Bench · Logo Room'),
    ('/internal/design-system/logos/spec/', 'spec.html', 'Spec · Logo Room'),
    ('/internal/design-system/logo-files/', 'files.html', 'Files · Logo Room'),
]
LOCAL = {path: file for path, file, _ in PAGES}
EXT = {'image/svg+xml': 'svg', 'image/png': 'png', 'image/webp': 'webp', 'image/jpeg': 'jpg', 'font/woff2': 'woff2'}

git = lambda *args: subprocess.check_output(['git', *args], cwd=ROOT, text=True).strip()
REF = f"{git('rev-parse', '--abbrev-ref', 'HEAD')} · {git('describe', '--always', '--dirty')}"
TODAY = date.today().strftime('%-d %b %Y')

os.makedirs(os.path.join(OUT, 'css'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'assets'), exist_ok=True)
assets: dict[str, str] = {}


def fetch(url: str) -> tuple[bytes, str]:
    with urllib.request.urlopen(BASE + url) as r:
        return r.read(), r.headers.get('content-type', '').split(';')[0].strip()


def asset(url: str) -> str:
    url = html.unescape(url)
    if url not in assets:
        body, ctype = fetch(url)
        ext = EXT.get(ctype) or os.path.splitext(urllib.parse.urlparse(url).path)[1].lstrip('.') or 'bin'
        name = f'assets/{hashlib.sha1(body).hexdigest()[:12]}.{ext}'
        with open(os.path.join(OUT, name), 'wb') as f:
            f.write(body)
        assets[url] = name
    return assets[url]


def version(name: str) -> str:
    """A file's content hash, for its ?v=: a viewer never keeps an older copy."""
    with open(os.path.join(OUT, name), 'rb') as f:
        return hashlib.sha1(f.read()).hexdigest()[:8]


def css_of(page: str) -> str:
    css = '\n'.join(re.findall(r'<style[^>]*>(.*?)</style>', page, re.S))
    css = re.sub(r'@font-face\s*\{[^}]*@fontsource[^}]*\}', '', css)
    css = re.sub(r'^export default "[^"]*";?\s*$', '', css, flags=re.M)

    def url_sub(m: re.Match) -> str:
        raw = m.group(1).strip('\'"')
        if raw.startswith('/') and not raw.startswith('//'):
            return f'url("../{asset(raw)}")'
        return m.group(0)

    css = re.sub(r'url\(([^)]+)\)', url_sub, css)
    # The viewer sets data-theme on the page's root; the site's theme selectors answer to their own name.
    return css.replace('[data-theme', '[data-tb-theme')


def link_sub(m: re.Match) -> str:
    attr, href = m.group(1), html.unescape(m.group(2))
    if not href.startswith('/') or href.startswith('//'):
        return m.group(0)
    parsed = urllib.parse.urlparse(href)
    path = parsed.path if parsed.path.endswith('/') else parsed.path + '/'
    if path in LOCAL:
        target = LOCAL[path] + (f'?{parsed.query}' if parsed.query else '') + (f'#{parsed.fragment}' if parsed.fragment else '')
        return f'{attr}="{html.escape(target, quote=True)}"'
    # The lab's other pages are not in the snapshot: the link stays as text.
    if path.startswith('/internal/'):
        return f'data-lab-{attr}="{html.escape(href, quote=True)}"'
    return f'{attr}="https://thingsboard.io{html.escape(href, quote=True)}" target="_blank" rel="noopener"'


# The scripts first: the room's bundle and the icon picker's set.
subprocess.check_call(['node', os.path.join(HERE, 'bundle.mjs'), OUT])
icons, _ = fetch('/internal/design-system/tabler-icons.json')
with open(os.path.join(OUT, 'tabler-icons.json'), 'wb') as f:
    f.write(icons)
for name in ('shell.js', 'shell.css'):
    with open(os.path.join(HERE, name), 'rb') as src, open(os.path.join(OUT, name), 'wb') as dst:
        dst.write(src.read())

bundles: set[str] = set()
for path, file, title in PAGES:
    body, ctype = fetch(path)
    if ctype != 'text/html':
        sys.exit(f'{path}: {ctype}, not a page')
    page = body.decode()

    css = css_of(page)
    key = hashlib.sha1(css.encode()).hexdigest()[:10]
    if key not in bundles:
        with open(os.path.join(OUT, 'css', f'{key}.css'), 'w') as f:
            f.write(css)
        bundles.add(key)

    doc = re.sub(r'<style[^>]*>.*?</style>', '', page, flags=re.S)
    # Every script goes but the records' JSON, which the room reads.
    doc = re.sub(r'<script(?![^>]*type="application/json")[^>]*>.*?</script>', '', doc, flags=re.S)
    doc = re.sub(r'<link[^>]*rel="(?:stylesheet|preconnect|modulepreload)"[^>]*>', '', doc)
    # Save to repo writes through the dev server, which a snapshot has not got.
    doc = re.sub(r'<button[^>]*\sdata-save[^>]*>.*?</button>', '', doc, flags=re.S)
    doc = re.sub(r'<html([^>]*?)\sdata-theme="[^"]*"', r'<html\1 data-tb-theme="light"', doc)
    doc = re.sub(r'<title>.*?</title>', f'<title>{html.escape(title)}</title>', doc, count=1, flags=re.S)
    doc = re.sub(r'(<(?:img|source)[^>]*\s(?:src|srcset)=")(/[^"]+)', lambda m: m.group(1) + asset(m.group(2)), doc)
    doc = re.sub(r'(<use[^>]*\shref=")(/[^"#]+)', lambda m: m.group(1) + asset(m.group(2)), doc)
    doc = re.sub(r'(?<=\s)(href)="([^"]*)"', link_sub, doc)

    head = (
        f'<link rel="stylesheet" href="{FONTS}">\n'
        f'<link rel="stylesheet" href="css/{key}.css">\n'
        f'<link rel="stylesheet" href="shell.css?v={version("shell.css")}">\n'
        f'<script src="shell.js?v={version("shell.js")}"></script>\n'
    )
    doc = doc.replace('</head>', head + '</head>', 1)
    tail = (
        f'<p class="lr-tag">Logo Room · {html.escape(REF)} · {TODAY}</p>\n'
        f'<script type="module" src="room.js?v={version("room.js")}"></script>\n'
    )
    doc = doc.replace('</body>', tail + '</body>', 1)
    with open(os.path.join(OUT, file), 'w') as f:
        f.write(doc)
    print(f'{file}: {len(doc) // 1024} KB')

print(len(PAGES), 'pages,', len(bundles), 'css bundles,', len(assets), 'assets ·', REF)
