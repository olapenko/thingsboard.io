"""
Snapshot marketing pages from a running dev server into one self-contained, inert bundle.

The output is a directory of plain files — one `.html` per page in `PAGES` (`index.html` first) and
the assets they reference under `a/ f/ j/ v/` — that renders with no server, no network and no build
step. It exists so a branch can be shown to someone who cannot run it: publish the directory anywhere
static and the pages behave, including their motion, and link to one another.

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
import html
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
# the network-reaching scripts, so the number is baked in over the button's shipped fallback, in the
# button's own `22.4k` form.
# It is a point-in-time value; re-read it from the live site when it drifts enough to notice.
GH_COUNT = '22.5k'

if os.path.isdir(OUT):
    shutil.rmtree(OUT)
for d in ('a', 'f', 'j', 'v'):
    os.makedirs(f'{OUT}/{d}', exist_ok=True)

# route, output file, switcher label, `.astro` entry relative to src/, switcher group. The groups are
# what the switcher divides with a hairline: the homepage orders, the product pages, pricing, contact.
PAGES = [
    ('/', 'index.html', 'Home', 'pages/index.astro', 'home'),
    ('/internal/homepages/c/', 'home-c.html', 'Home C', 'pages/internal/homepages/[id].astro', 'home'),
    ('/products/paas/', 'cloud.html', 'Cloud', 'pages/products/paas/index.astro', 'product'),
    ('/products/thingsboard-pe/', 'onprem.html', 'On-premises', 'pages/products/thingsboard-pe/index.astro', 'product'),
    ('/installations/', 'installations.html', 'Installations', 'pages/installations/index.astro', 'product'),
    ('/internal/pages/pricing/', 'pricing.html', 'Pricing', 'pages/internal/pages/pricing.astro', 'pricing'),
    ('/internal/pages/pricing-long/', 'pricing-long.html', 'Pricing, long', 'pages/internal/pages/pricing-long.astro', 'pricing'),
    ('/contact-us/', 'contact.html', 'Contact us', 'pages/contact-us.astro', 'contact'),
    ('/contact-us-thanks/', 'contact-thanks.html', 'Thank you', 'pages/contact-us-thanks.astro', 'contact'),
]

# The links that stay live: a link to a page the bundle carries goes to its copy, query and hash kept,
# and every other link is neutered. `/pricing/` is main's page, which the draft stands in for here.
LOCAL = {route: f for route, f, *_ in PAGES}
LOCAL['/pricing/'] = 'pricing.html'

# ── the module list, walked rather than written ──────────────────────────────────────────────────
# Chrome and instrumentation stay out: the header/nav/footer behave as chrome for a page that cannot
# navigate, and the GitHub button reaches for the network from a snapshot whose count is baked in.
# `_InternalNav` is the sandbox pill, stripped from the markup below; the cookie banner and the UTM
# tracker are instrumentation that reaches for the network from a page that should be inert.
DROP = {'GitHubButton', 'HeaderContent', 'HeaderScrollWatch', 'Navigation', 'Footer',
        '_InternalNav', 'CookieBanner', 'CookieNotice', 'UtmTracker'}
IMPORT_RE = re.compile(r'''import\s+[\w{},*\s]+\s+from\s+['"]([^'"]+)['"]''')


# The import aliases, read from tsconfig's `paths` rather than listed here: a hand-kept list lacked
# `@root/`, which is how the Home C page imports the homepage, and the page shipped with no modules.
ALIASES = {m.group(1): f'{REPO}/{m.group(2)}' for m in re.finditer(
    r'"(@[\w-]+/)\*"\s*:\s*\[\s*"([^"*]+)\*"', open(f'{REPO}/tsconfig.json', encoding='utf-8').read())}
assert '@components/' in ALIASES, 'tsconfig paths not found'


def resolve(spec, importer):
    alias = next((a for a in ALIASES if spec.startswith(a)), None)
    if alias:
        p = ALIASES[alias] + spec[len(alias):]
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


def has_module(m):
    # `is:inline` scripts are emitted into the page as-is and have no module URL to fetch — asking
    # the dev server for one is a 500. They are handled in the markup instead: `KEEP_INLINE` lets
    # through the few a page needs, and the rest are dropped and listed.
    return (os.path.basename(m) not in DROP
            and re.search(r'^<script(?![^>]*is:inline)', open(f'{ROOT_SRC}/{m}.astro', encoding='utf-8').read(), re.M))


# PER PAGE, not pooled: each page loads the modules of its own import graph only. Pooled, every page
# ran every page's script, and two pages that drive the same markup undo each other — the pricing
# drafts' toggles each flipped twice per click and stayed put.
PAGE_MODULES = {f: sorted(m for m in walk(f'{ROOT_SRC}/{entry}') if has_module(m)) for _, f, _, entry, _ in PAGES}
MODULES = sorted(set().union(*PAGE_MODULES.values()))

# A module's file is its basename, unless two share one — the Cloud and On-premises pages' scripts are
# both `index` — when it is its path. Sharing one name, the second overwrote the first, and both pages
# ran it.
_base = [os.path.basename(m) for m in MODULES]
MODULE_FILE = {m: (os.path.basename(m) if _base.count(os.path.basename(m)) == 1 else m.replace('/', '-')) + '.js'
               for m in MODULES}
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


def grab(path, as_module, name=None):
    url = f'{SRC}/src/{path}.astro?astro&type=script&index=0&lang.ts' if as_module else f'{SRC}/src/{path}.ts'
    with urllib.request.urlopen(url, timeout=40) as r:
        js = r.read().decode('utf-8')
    js = re.sub(r'\n?//# sourceMappingURL=.*$', '\n', js, flags=re.S)
    js = re.sub(r'(from\s*")/src/(?:[\w./-]*/)?([\w.-]+)\.ts(")', r'\1./\2.js\3', js)
    name = name or os.path.basename(path) + '.js'
    # The contact form posts to Formspree, which would put a reviewer's test message in the team's
    # inbox. Its action becomes the bundled thank-you page, and `SUBMIT_JS` below turns the submit
    # into a plain navigation there, so the form validates and thanks exactly as it does live.
    if 'formspree.io' in js:
        js, n = re.subn(r'''(["'])https://formspree\.io/[^"']*\1''', '"contact-thanks.html"', js)
        assert n and 'formspree.io' not in js, f'{name}: Formspree action not rewritten'
    open(f'{OUT}/j/{name}', 'w', encoding='utf-8').write(js)
    pending.extend(re.findall(r'from\s*"\./([\w.-]+)\.js"', js))
    return name


for m in MODULES:
    grab(m, True, MODULE_FILE[m])

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

# The CDN's videos, by name. The hero's own footage is same-origin (`/videos/…`, named by the cover's
# `data-video-webm`) and goes through `fetch` with the rest of the assets.
VIDEOS = {
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
# captured as it is. A hairline divides the groups; where the row is wider than the screen it scrolls
# sideways with the current page brought into view. It rides above the cookie notice while that is
# up, since both live at the foot of the screen.
def switcher(current):
    links, group = [], None
    for _, f, label, _, g in PAGES:
        if group is not None and g != group:
            links.append('<span class="tb-snap-nav__sep" aria-hidden="true"></span>')
        group = g
        links.append(f'<a href="{f}" class="tb-snap-nav__a{" is-on" if f == current else ""}"'
                     f'{" aria-current=page" if f == current else ""}>{label}</a>')
    css = ('.tb-snap-nav{position:fixed;left:50%;bottom:var(--tb-snap-lift,18px);transform:translateX(-50%);'
           'z-index:2147483647;display:flex;align-items:center;gap:4px;padding:4px;border-radius:100px;'
           'max-width:calc(100vw - 32px);box-sizing:border-box;overflow-x:auto;scrollbar-width:none;'
           'background:rgba(15,16,26,.86);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);'
           'box-shadow:0 8px 28px rgba(0,0,0,.28);font-family:Ubuntu,sans-serif;transition:bottom .2s ease}'
           '.tb-snap-nav::-webkit-scrollbar{display:none}'
           '.tb-snap-nav__a{display:block;flex:none;padding:7px 14px;border-radius:100px;font-size:13px;'
           'font-weight:500;line-height:1;white-space:nowrap;color:rgba(255,255,255,.72);text-decoration:none}'
           '.tb-snap-nav__a:hover{color:#fff;background:rgba(255,255,255,.12)}'
           '.tb-snap-nav__a.is-on{color:#fff;background:#3d50f5}'
           '.tb-snap-nav__sep{flex:none;width:1px;height:16px;margin:0 2px;background:rgba(255,255,255,.18)}')
    js = ('(()=>{const nav=document.currentScript.previousElementSibling;'
          'const on=nav.querySelector(".is-on");if(on)nav.scrollLeft=on.offsetLeft-(nav.clientWidth-on.offsetWidth)/2;'
          'const cn=document.querySelector("[data-cn]");if(!cn)return;'
          'const lift=()=>nav.style.setProperty("--tb-snap-lift",'
          '(cn.hidden?18:cn.getBoundingClientRect().height+12)+"px");'
          'lift();new MutationObserver(lift).observe(cn,{attributes:true,attributeFilter:["hidden"]});'
          'new ResizeObserver(lift).observe(cn)})()')
    return (f'<style>{css}</style><nav class="tb-snap-nav" aria-label="Snapshot pages">{"".join(links)}</nav>'
            f'<script>{js}</script>')


# The inline scripts that come along, each read and found to touch only the page, the URL and storage:
# the header's own; the cookie notice showing itself until accepted; the thank-you page reading what
# the form kept for it; the contact page's intro taking the topic from the URL; the pricing drafts'
# pre-paint, which picks the product, region and billing that the CSS shows panels by (without it,
# every product's panels show at once); and the hero's copy measure, which the split hero's panel is
# laid out from. Everything else inline is dropped, and listed by `build` so a new one is seen.
# The notice's cookie becomes localStorage — an artifact is framed on another site, where a cookie
# may be refused — so accepting it once holds across the bundle's pages, as on the live site.
KEEP_INLINE = ('header.header', 'cookie-notice-dismissed', 'data-thanks', 'INTENTS', 'prepaint',
               '--hero-copy-rest')
DROPPED_INLINE = {}
COOKIE_READ = "!new RegExp('(?:^|; )' + COOKIE + '=true(?:;|$)').test(document.cookie)"
COOKIE_WRITE = "document.cookie = COOKIE + '=true; max-age=31536000; path=/; SameSite=Lax'"
STORE_READ = "!(function () { try { return localStorage.getItem(COOKIE) === 'true'; } catch (_) { return false; } })()"
STORE_WRITE = "(function () { try { localStorage.setItem(COOKIE, 'true'); } catch (_) {} })()"

# After each form's own submit handler (they listen on the form, this on the window, so it runs
# second): no submit leaves the page. One the contact form let through goes to the thank-you page, as
# it does live; any other — the footer's newsletter, which posts to MailerLite — goes nowhere. Their
# external actions are blanked as well, so even a submit that slips past this one cannot reach out.
SUBMIT_JS = ("addEventListener('submit',e=>{if(e.defaultPrevented)return;e.preventDefault();"
             "if(e.target.id==='ContactUs')location.href='contact-thanks.html'})")


def strip_element(s, opener):
    """Remove every element whose start tag matches `opener`, nested children and all. The island is
    a <div> of <div>s, which no single regex can close at the right tag."""
    while (m := re.search(opener, s)):
        tag = re.match(r'<(\w+)', m.group(0)).group(1)
        depth, i = 0, m.start()
        for t in re.finditer(rf'<(/?){tag}\b[^>]*>', s[m.start():]):
            depth += -1 if t.group(1) else 1
            if depth == 0:
                i = m.start() + t.end()
                break
        assert i > m.start(), f'unclosed <{tag}> matched by {opener}'
        s = s[:m.start()] + s[i:]
    return s


def build(path, outfile, label):
    with urllib.request.urlopen(SRC + path, timeout=120) as r:
        s = r.read().decode('utf-8')
    start = len(s)

    def keep_script(tag, body):
        if 'application/json' in tag:
            return True
        if ' src=' in tag:
            return False
        if any(k in body for k in KEEP_INLINE):
            return True
        sig = re.sub(r'\s+', ' ', body).strip()[:90]
        if sig:
            DROPPED_INLINE.setdefault(sig, set()).add(outfile)
        return False

    s = re.sub(r'<script(\b[^>]*)>(.*?)</script>',
               lambda m: m.group(0) if keep_script(m.group(1), m.group(2)) else '', s, flags=re.S | re.I)
    s = re.sub(r'<script\b[^>]*/>', '', s, flags=re.I)
    if 'cookie-notice-dismissed' in s:
        assert COOKIE_READ in s and COOKIE_WRITE in s, f'{outfile}: the cookie notice script changed shape'
        s = s.replace(COOKIE_READ, STORE_READ).replace(COOKIE_WRITE, STORE_WRITE)
    if '<form' in s:
        s = re.sub(r'(<form\b[^>]*?\saction=)"https?://[^"]*"', r'\1"#"', s, flags=re.I)
        s = s.replace('</body>', f'<script>{SUBMIT_JS}</script></body>', 1)
    s = s.replace('</body>', ''.join(f'<script type="module" src="j/{MODULE_FILE[m]}"></script>'
                                     for m in PAGE_MODULES[outfile]) + '</body>', 1)

    # The chat launcher's <template>. On every page but the homepage, Astro emits the page's styles
    # INSIDE it (it is the first component rendered in <head>), where they never apply: the dev
    # server hides that by injecting the same CSS again from its HMR modules, which the bundle drops.
    # So the template goes — the chat cannot run in a snapshot — and the styles it held stay, in its
    # place.
    def unwrap_launcher(m):
        return ''.join(re.findall(r'<style\b.*?</style>|<link\b[^>]*>', m.group(1), flags=re.S | re.I))

    s = re.sub(r'<template id="chat-launcher-template"[^>]*>(.*?)</template>', unwrap_launcher, s,
               count=1, flags=re.S)
    s = re.sub(r'<astro-dev-toolbar\b.*?</astro-dev-toolbar>', '', s, flags=re.S | re.I)
    # GTM's no-JS fallback: a tracking iframe, and a request out of a page that should make none.
    s = re.sub(r'<noscript>\s*<iframe[^>]*googletagmanager\.com.*?</noscript>', '', s, flags=re.S | re.I)
    # The review island, its root a <div data-internal-nav> since the Pages menu (it was a <nav>).
    s = strip_element(s, r'<(?:div|nav)\b[^>]*\sdata-internal-nav\b[^>]*>')
    assert 'id="internal-nav"' not in s, f'{outfile}: the review island survived'
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
    s = re.sub(r'(<(?:div|span) class="gh-count[^"]*">)[^<]*', r'\g<1>' + GH_COUNT, s)
    s = re.sub(r'class="gh-button([^"]*)"', r'class="gh-button\1 is-loaded"', s)

    # Links off, THEN the switcher in — the other order would run it through this too. A link to a
    # bundled page goes to its copy; an in-page anchor stays as it is (the docked steps bar of Home C
    # navigates by them); everything else goes nowhere.
    def relink(m):
        attrs, href = m.group(1), html.unescape(m.group(2))
        if href.startswith('#'):
            return m.group(0)
        u = urllib.parse.urlsplit(href)
        local = LOCAL.get(u.path) if not u.netloc or u.netloc in ('thingsboard.io', 'localhost') else None
        if not local:
            return f'<a{attrs} href="#"'
        tail = (f'?{u.query}' if u.query else '') + (f'#{u.fragment}' if u.fragment else '')
        return f'<a{attrs} href="{html.escape(local + tail)}"'

    s = re.sub(r'<a\b([^>]*?)\shref="([^"]*)"', relink, s, flags=re.I)
    s = s.replace('</body>', switcher(outfile) + '</body>', 1)

    def rewrite_attr(m):
        head, url = m.group(1), m.group(2)
        base = url.split('#')[0]
        local = fetch(base)
        return f'{head}"{local}{url[len(base):]}"' if local else m.group(0)

    s = re.sub(r'\b((?:src|poster|data-video-webm)=)"(/[^"]*)"', rewrite_attr, s)
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


for path, outfile, label, _, _ in PAGES:
    build(path, outfile, label)

# Nothing in the bundle may still reach out: an external resource left in a page is a hole once the
# artifact's CSP blocks it, and a live endpoint left in a script is a page that is not inert.
for f in sorted(os.listdir(OUT)):
    if f.endswith('.html'):
        body = open(f'{OUT}/{f}', encoding='utf-8').read()
        for m in re.finditer(r'(?:\b(?:src|poster)=|srcset=|url\()["\']?(https?://[^"\')\s]+)', body):
            fails.append((f'{f}: {m.group(1)[:60]}', 'external resource'))
        for m in re.finditer(r'<form\b[^>]*\saction="(https?://[^"]+)"', body, re.I):
            fails.append((f'{f}: {m.group(1)[:60]}', 'form posts off the page'))
for f in sorted(os.listdir(f'{OUT}/j')):
    if 'formspree.io' in open(f'{OUT}/j/{f}', encoding='utf-8').read():
        fails.append((f'j/{f}', 'still posts to Formspree'))

print(f'inline    {len(DROPPED_INLINE)} distinct inline scripts dropped:')
for sig, pages in sorted(DROPPED_INLINE.items(), key=lambda kv: -len(kv[1])):
    print(f'          {len(pages)}p  {sig}')
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
