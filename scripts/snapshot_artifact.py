"""
Snapshot marketing pages from a running dev server into one self-contained, inert bundle.

The output is a directory of plain files — `index.html`, `cloud.html`, `onprem.html` and the assets
they reference under `a/ f/ j/ v/` — that renders with no server, no network and no build step. It
exists so a branch can be shown to someone who cannot run it: publish the directory anywhere static
and the page behaves, including its motion.

A browser's own "save page" does not produce this. The dev server serves styles, fonts and component
scripts from `/@fs/` and `/node_modules/` paths that exist only while it is running, and the imagery
comes from `img.thingsboard.io` / `video.thingsboard.io`, so a saved page arrives with no styling, no
motion and holes where the media was. Everything here is the work of pulling those four categories
into the bundle and rewriting the markup to point at the copies.

THE MODULE LIST IS DERIVED, NOT TYPED. This is the part that matters for keeping the script alive.
Astro's dev server bundles component scripts behind `/@id/astro:scripts/page.js`, so the page never
says which components it needs. Earlier versions named them in a hand-kept list, and that list was
the thing that rotted: a visual added to a page shipped as dead markup until someone remembered to
add it, and two of its dependencies 404'd unnoticed for weeks. The import graph already holds the
answer, so walk it from each page's `.astro` entry, keep every component carrying a client
`<script>`, drop the chrome, and the list maintains itself. Do not go back to a literal list.

Usage:
    python3 scripts/snapshot_artifact.py --out /tmp/snap [--src http://localhost:4321]
"""
import argparse
import os
import re
import shutil
import sys
import urllib.parse
import urllib.request

# Both roots come from this file's own location, so the script snapshots the checkout it is committed
# in — including a git worktree, which has its own `node_modules` and its own edits to `src/`.
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_SRC = f'{REPO}/src'
FONTSRC = f'{REPO}/node_modules/@fontsource'

parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
parser.add_argument('--src', default='http://localhost:4321', help='origin of the running dev server')
# Required rather than defaulted: this writes a ~12 MB tree, and a default would sooner or later
# drop it inside the repo.
parser.add_argument('--out', required=True, help='directory to write the bundle into (recreated)')
args = parser.parse_args()

SRC = args.src.rstrip('/')
OUT = args.out

# The star count the GitHub button fetches at runtime. That fetch is stripped along with the rest of
# the network-reaching scripts, so the number is baked in instead of left as the `&nbsp;` placeholder.
# It is a point-in-time value; re-read it from the live site when it drifts enough to notice.
GH_COUNT = '22,469'

if os.path.isdir(OUT):
    shutil.rmtree(OUT)
for d in ('a', 'f', 'j', 'v'):
    os.makedirs(f'{OUT}/{d}', exist_ok=True)

# route, output file, switcher label, `.astro` entry relative to src/
PAGES = [
    ('/', 'index.html', 'Home', 'pages/index.astro'),
    ('/products/paas/', 'cloud.html', 'Cloud', 'pages/products/paas/index.astro'),
    ('/products/thingsboard-pe/', 'onprem.html', 'On-premises', 'pages/products/thingsboard-pe/index.astro'),
]

# ── the module list, walked rather than written ──────────────────────────────────────────────────
# Chrome and instrumentation stay out: the header/nav/footer behave as chrome for a page that cannot
# navigate, and the GitHub button reaches for the network from a snapshot whose count is baked in.
# `_InternalNav` is the sandbox pill, stripped from the markup below; the cookie banner and the UTM
# tracker are instrumentation that reaches for the network from a page that should be inert.
DROP = {'GitHubButton', 'HeaderContent', 'HeaderScrollWatch', 'Navigation', 'Footer',
        '_InternalNav', 'CookieBanner', 'UtmTracker'}
IMPORT_RE = re.compile(r'''import\s+[\w{},*\s]+\s+from\s+['"]([^'"]+)['"]''')


def resolve(spec, importer):
    if spec.startswith('@components/'):
        p = f'{ROOT_SRC}/components/{spec[len("@components/"):]}'
    elif spec.startswith('@layouts/'):
        p = f'{ROOT_SRC}/layouts/{spec[len("@layouts/"):]}'
    elif spec.startswith('@data/'):
        p = f'{ROOT_SRC}/data/{spec[len("@data/"):]}'
    elif spec.startswith('.'):
        p = os.path.normpath(os.path.join(os.path.dirname(importer), spec))
    else:
        return None
    return p if os.path.isfile(p) else None


def walk(entry):
    """Every .astro file reachable from `entry`, as paths relative to src/."""
    seen, stack = set(), [entry]
    while stack:
        cur = stack.pop()
        if cur in seen or not os.path.isfile(cur):
            continue
        seen.add(cur)
        try:
            body = open(cur, encoding='utf-8').read()
        except Exception:
            continue
        for spec in IMPORT_RE.findall(body):
            nxt = resolve(spec, cur)
            if nxt and nxt.endswith('.astro'):
                stack.append(nxt)
    return {os.path.relpath(p, ROOT_SRC)[:-len('.astro')] for p in seen if p.endswith('.astro')}


reachable = set()
for _, _, _, entry in PAGES:
    reachable |= walk(f'{ROOT_SRC}/{entry}')

MODULES = sorted(
    m for m in reachable
    if os.path.basename(m) not in DROP
    # `is:inline` scripts are emitted into the page as-is and have no module URL to fetch — asking
    # the dev server for one is a 500. They are also, on this site, exactly the instrumentation the
    # DROP list names, so skipping them costs no behaviour.
    and re.search(r'^<script(?![^>]*is:inline)', open(f'{ROOT_SRC}/{m}.astro', encoding='utf-8').read(), re.M)
)
print(f'modules   {len(MODULES)} derived from the import graph of {len(PAGES)} pages')

# ── shared pools ─────────────────────────────────────────────────────────────────────────────────
# One cache across all pages: they share a header, a footer, the Ubuntu faces, the nav sprite and
# most of their imagery, so every page after the first costs little but its own screenshots.
seen, fails = {}, []
SKIP = ('/node_modules/', '/@fs/', '/@vite/', '/@id/')


def fetch(url):
    if url.startswith(SKIP):
        return None
    if url in seen:
        return seen[url]
    full = url if url.startswith('http') else SRC + url
    try:
        with urllib.request.urlopen(full, timeout=60) as r:
            body, ctype = r.read(), r.headers.get('Content-Type', '').split(';')[0]
    except Exception as e:
        fails.append((url[:70], str(e)[:40]))
        seen[url] = None
        return None
    ext = {'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/svg+xml': 'svg',
           'image/gif': 'gif', 'image/avif': 'avif'}.get(ctype)
    if not ext:
        ext = (urllib.parse.urlparse(url).path.rsplit('.', 1) + ['bin'])[1].lower()[:5]
    name = f'a/{len(seen):03d}.{ext}'
    open(f'{OUT}/{name}', 'wb').write(body)
    seen[url] = name
    return name


# A grabbed module's own imports are rewritten to sit beside it (`./sparkline.js`), which only works
# if that file is there too. An earlier build named those leaves by hand and they rotted the same way
# the module list did — `ai-visual` and `faq-tabs` were both missing, so two components 404'd on
# load. Instead: after writing each module, read back what it asks for and fetch anything not yet
# present, repeating until the graph closes. The source is found by basename under src/, which is
# what the rewrite has already reduced the specifier to.
TS_BY_NAME = {os.path.splitext(f)[0]: os.path.relpath(os.path.join(dp, f), ROOT_SRC)[:-3]
              for dp, _, fs in os.walk(ROOT_SRC) for f in fs if f.endswith('.ts')}
pending = []


def grab(path, as_module):
    url = f'{SRC}/src/{path}.astro?astro&type=script&index=0&lang.ts' if as_module else f'{SRC}/src/{path}.ts'
    with urllib.request.urlopen(url, timeout=40) as r:
        js = r.read().decode('utf-8')
    js = re.sub(r'\n?//# sourceMappingURL=.*$', '\n', js, flags=re.S)
    js = re.sub(r'(from\s*")/src/(?:[\w./-]*/)?([\w.-]+)\.ts(")', r'\1./\2.js\3', js)
    name = os.path.basename(path) + '.js'
    open(f'{OUT}/j/{name}', 'w', encoding='utf-8').write(js)
    pending.extend(re.findall(r'from\s*"\./([\w.-]+)\.js"', js))
    return name


SCRIPT_TAGS = ''.join(f'<script type="module" src="j/{grab(m, True)}"></script>' for m in MODULES)

resolved_deps = set()
while pending:
    dep = pending.pop()
    if dep in resolved_deps or os.path.isfile(f'{OUT}/j/{dep}.js'):
        continue
    resolved_deps.add(dep)
    src_path = TS_BY_NAME.get(dep)
    if not src_path:
        fails.append((f'dep {dep}', 'no .ts under src/'))
        continue
    grab(src_path, False)
print(f'deps      {len(os.listdir(OUT + "/j")) - len(MODULES)} fetched to close the graph')

VIDEOS = {
    'https://video.thingsboard.io/tb-cover2.webm': 'v/cover.webm',
    'https://video.thingsboard.io/mobile/pe/mobile-actions.webm': 'v/phone.webm',
    'https://video.thingsboard.io/mobile/pe/mobile-actions.mp4': 'v/phone.mp4',
}
for url, local in VIDEOS.items():
    with urllib.request.urlopen(url, timeout=300) as r:
        open(f'{OUT}/{local}', 'wb').write(r.read())

FACES = [
    ('Ubuntu', 300, 'normal', f'{FONTSRC}/ubuntu/files/ubuntu-latin-300-normal.woff2'),
    ('Ubuntu', 400, 'normal', f'{FONTSRC}/ubuntu/files/ubuntu-latin-400-normal.woff2'),
    ('Ubuntu', 400, 'italic', f'{FONTSRC}/ubuntu/files/ubuntu-latin-400-italic.woff2'),
    ('Ubuntu', 500, 'normal', f'{FONTSRC}/ubuntu/files/ubuntu-latin-500-normal.woff2'),
    ('Ubuntu', 700, 'normal', f'{FONTSRC}/ubuntu/files/ubuntu-latin-700-normal.woff2'),
    ('Ubuntu Mono', 400, 'normal', f'{FONTSRC}/ubuntu-mono/files/ubuntu-mono-latin-400-normal.woff2'),
    ('Ubuntu Mono', 700, 'normal', f'{FONTSRC}/ubuntu-mono/files/ubuntu-mono-latin-700-normal.woff2'),
]
faces = []
for fam, wt, style, path in FACES:
    name = os.path.basename(path)
    shutil.copy(path, f'{OUT}/f/{name}')
    faces.append(f"@font-face{{font-family:'{fam}';font-style:{style};font-weight:{wt};"
                 f"font-display:swap;src:url('f/{name}') format('woff2')}}")
FACE_CSS = ''.join(faces)

ROOT_CSS = ('html{background:#fff;color-scheme:light}'
            'body{background:#fff;color:#353841;margin:0;padding:0;font-size:16px;line-height:24px;'
            'font-family:Ubuntu,ui-sans-serif,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,'
            '"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}')


# The switcher. Fixed, bottom-centre, out of the header's way — the header is the page's own and is
# captured as it is. It is the only live link in the bundle; everything else is neutered below.
def switcher(current):
    links = ''.join(
        f'<a href="{f}" class="tb-snap-nav__a{" is-on" if f == current else ""}">{label}</a>'
        for _, f, label, _ in PAGES)
    css = ('.tb-snap-nav{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:2147483647;'
           'display:flex;gap:4px;padding:4px;border-radius:100px;background:rgba(15,16,26,.86);'
           '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);'
           'box-shadow:0 8px 28px rgba(0,0,0,.28);font-family:Ubuntu,sans-serif}'
           '.tb-snap-nav__a{display:block;padding:7px 15px;border-radius:100px;font-size:13px;'
           'font-weight:500;line-height:1;color:rgba(255,255,255,.72);text-decoration:none}'
           '.tb-snap-nav__a:hover{color:#fff;background:rgba(255,255,255,.12)}'
           '.tb-snap-nav__a.is-on{color:#fff;background:#3d50f5}')
    return f'<style>{css}</style><nav class="tb-snap-nav">{links}</nav>'


KEEP_INLINE = ('header.header',)


def build(path, outfile, label):
    with urllib.request.urlopen(SRC + path, timeout=120) as r:
        s = r.read().decode('utf-8')
    start = len(s)

    def keep_script(tag, body):
        if 'application/json' in tag:
            return True
        if ' src=' in tag:
            return False
        return any(k in body for k in KEEP_INLINE)

    s = re.sub(r'<script(\b[^>]*)>(.*?)</script>',
               lambda m: m.group(0) if keep_script(m.group(1), m.group(2)) else '', s, flags=re.S | re.I)
    s = re.sub(r'<script\b[^>]*/>', '', s, flags=re.I)
    s = s.replace('</body>', SCRIPT_TAGS + '</body>', 1)

    s = re.sub(r'<astro-dev-toolbar\b.*?</astro-dev-toolbar>', '', s, flags=re.S | re.I)
    s = re.sub(r'<nav[^>]*data-internal-nav.*?</nav>', '', s, flags=re.S | re.I)
    s = re.sub(r'<link[^>]*rel="stylesheet"[^>]*node_modules[^>]*>', '', s, flags=re.I)
    s = re.sub(r'<link[^>]*rel="sitemap"[^>]*>', '', s, flags=re.I)
    s = re.sub(r'\sdata-astro-source-(?:file|loc)="[^"]*"', '', s)
    s = re.sub(r'<link[^>]*rel="(?:module)?preload"[^>]*>', '', s, flags=re.I)
    s = re.sub(r'<link[^>]*/(?:node_modules|@fs|@vite|@id)/[^>]*>', '', s, flags=re.I)

    for url, local in VIDEOS.items():
        s = s.replace(url, local)
    s = re.sub(r'\sdata-video-mp4="[^"]*"', '', s)

    s = re.sub(r'@font-face\s*\{[^}]*?node_modules[^}]*?\}', '', s, flags=re.S)
    s = s.replace('</head>', f'<style>{FACE_CSS}</style></head>', 1)
    s = s.replace('</body>', f'<style>{ROOT_CSS}</style></body>', 1)
    s = s.replace('data-theme="dark"', 'data-theme="light"', 1)

    # `.gh-count` is a <span> since GitHubButton was rebuilt around the Octicon mark — the old
    # pattern named <div> and silently left the count as the `&nbsp;` placeholder.
    s = re.sub(r'(<(?:div|span) class="gh-count[^"]*">)(?:&nbsp;|\s)*', r'\g<1>' + GH_COUNT, s)
    s = re.sub(r'class="gh-button([^"]*)"', r'class="gh-button\1 is-loaded"', s)

    # Links off, THEN the switcher in — the other order would neuter it too.
    s = re.sub(r'<a\b([^>]*?)\shref="[^"]*"', r'<a\1 href="#"', s, flags=re.I)
    s = s.replace('</body>', switcher(outfile) + '</body>', 1)

    def rewrite_attr(m):
        head, url = m.group(1), m.group(2)
        base = url.split('#')[0]
        local = fetch(base)
        return f'{head}"{local}{url[len(base):]}"' if local else m.group(0)

    s = re.sub(r'\b((?:src|poster)=)"(/[^"]*)"', rewrite_attr, s)
    s = re.sub(r'(<(?:link|use)\b[^>]*?\s(?:xlink:)?href=)"(/[^"]*)"', rewrite_attr, s, flags=re.I)
    s = re.sub(r'\b((?:src|poster)=)"(https://img\.thingsboard\.io/[^"]*)"', rewrite_attr, s)

    def rewrite_srcset(m):
        out = []
        for part in m.group(1).split(','):
            p = part.strip()
            if not p:
                continue
            bits = p.split()
            if bits[0].startswith(('data:', 'http')):
                out.append(p)
                continue
            out.append(' '.join([fetch(bits[0]) or bits[0]] + bits[1:]))
        return 'srcset="' + ', '.join(out) + '"'

    s = re.sub(r'srcset="([^"]*)"', rewrite_srcset, s)

    def rewrite_css_url(m):
        q, url = m.group(1), m.group(2)
        if url.startswith(('data:', 'http', '#')) or not url.startswith('/'):
            return m.group(0)
        local = fetch(url.split('#')[0])
        return f'url({q}{local}{q})' if local else m.group(0)

    s = re.sub(r'url\((["\']?)(/[^)"\']+)\1\)', rewrite_css_url, s)

    open(f'{OUT}/{outfile}', 'w', encoding='utf-8').write(s)
    print(f'{label:<12} {start:>9,} -> {len(s):>9,} chars   {outfile}')


for path, outfile, label, _ in PAGES:
    build(path, outfile, label)

total = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(OUT) for f in fs)
print(f'assets    {len([v for v in seen.values() if v])} files shared across the {len(PAGES)} pages')
print(f'video     {sum(os.path.getsize(f"{OUT}/{v}") for v in VIDEOS.values()) / 1048576:.2f} MB')
print(f'total     {total / 1048576:.2f} MB')

# A missed asset is a hole in the page, and a silent list of them is exactly the rot the derived
# module list exists to prevent. Fail loudly instead.
if fails:
    print(f'\nFAILED    {len(fails)} resources could not be fetched:', file=sys.stderr)
    for url, err in fails:
        print(f'          {url}  ({err})', file=sys.stderr)
    sys.exit(1)
