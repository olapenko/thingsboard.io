# The lab

`lab` is `handoff` plus the sandbox: the pages under `/internal/` where the site's pieces are
judged one at a time, plus whatever a review needs that must never ship. It takes `handoff` in
and is never merged back. What a review decides is rebuilt as a `feat/` branch off `handoff`.

## The branches

| Branch | What it is | Moves by |
| --- | --- | --- |
| `main` | A read-only mirror of the live site (upstream `thingsboard/thingsboard.io`). Never commit. | `gh repo sync olapenko/thingsboard.io --source thingsboard/thingsboard.io --branch main`, then `git fetch` |
| `handoff` | The deliverable: `main` plus the redesign, one commit per layer, shippable code only — no `/internal` pages, no sandbox hooks in shipped components. | `feat/<topic>` branches cut from it, merged back by PR with a rebase merge |
| `lab` | `handoff` plus this sandbox. | Merges `handoff` after every layer (`git merge handoff` in the lab worktree), then its own commits |
| `feat/<topic>` | One layer for `handoff`. Lowercase; deleted when merged. | PR into `handoff` |
| `exp/<topic>` | An experiment for the sandbox. | PR into `lab`, or dropped |

Delivery to the real repo is `main..handoff`, one PR or patch per layer, in order. An upstream
sync is `main` ← upstream, then `main` → `handoff`, then `handoff` → `lab`: `scripts/sync-upstream.sh`
does the three in their worktrees and stops on the first conflict; `--push` pushes them after.

## The layers so far

| # | Layer | PR | What it carries |
| --- | --- | --- | --- |
| 1 | Fonts and tokens | #10 | Ubuntu site-wide (docs included) with the system stack as fallback; the 600→700 weight alias; the redesign's additive colour tokens in `_theme.scss`. |
| 2 | Docs chrome | #11 | The docs bar's search as a labelled field with ⌘K and `/`; the theme switch out of the bar into `ThemeChoice` in the docs footer and the Menu drawer. |
| 3 | UI kit | #12 | `src/components/ui/` (Button, Link, Mark, Chip, Tabs, Segmented, Field, Card, Band, Dialog), the type-role ladder, the accent and focus tokens. Read `src/components/ui/README.md` first. |
| 4 | Footer | #13 | `Landing/FooterMap`, opt-in per page with `footer="map"` on `BaseLayout`; the Appearance row for theme-following pages. |
| 5 | Site chrome | #14 | `CookieNotice` as the indigo bar in place of `CookieBanner`; the chat in the site's look with our own launcher. |
| 6 | Contact us + Thanks | #15 | The two pages on the kit with the topic picker and device slider; FE's `SectionHeader` + `PageIntro`; main's header renamed `HomeSectionHeader` for the product pages. |
| 7 | Installations | #16 | The hub as one section per product with `RegionChoice` and `InstallOptions`; choose-region on the region rows; `cloud-regions` gains the pickers' names. |
| 8 | Cloud + On-premises | #17 | The product pages on the kit: FE's `Hero` (main's → `HomeHero`), `Bookend`, `ProductMatrix`, FE's `BenefitGrid`/`ChoiceBand`/`ProductFaq`; `page-inset()`. |
| 9 | Home | #18 | The redesigned homepage: FE's sections, data and visuals; main's homepage sections removed; `BaseLayout` preload variants; `ImageComparison` id. |

Every page layer has landed, and on 5 Oct the chrome stack did too: `handoff` is `main` plus
twenty-four linear commits — the nine page layers and the fifteen below, one commit per PR.

| PR | Layer | What it carries |
| --- | --- | --- |
| #30 | Lint | The three unused values upstream's CI stopped on; ESLint clean across `src`. |
| #31 | Chat focus | Focus stays where the reader put it while the YourGPT widget boots closed. |
| #32 | Dev deps | Embla pre-bundled at dev-server start, as PhotoSwipe is. |
| #19 | Nav data | Blog into Company. |
| #20 | The bar | Two looks (marketing · docs), two states; over a dark hero it stays dark until the page turns light. |
| #21 | Search | One control at two sizes; the dialog as its own layer; the result feed in the site's face. |
| #24 | The menu | Seven items (Products · Solutions · Services · Docs · Company · IoT Hub · Pricing); one panel on one column grid; the phone sheet. |
| #25 | Footers | `SiteFooter` at `map` or `docs`; four columns in the menu's order on the platform panel's grid. |
| #27 | Cookie consent | Main's card on the kit; Save preferences the dialog's primary; the launcher steps aside on a phone. |
| #29 | Partners | `/partners/`, linked once from the footers and closing the menu's Partners list. |
| #23 | Pricing | The page on the kit with its calculators. |
| #28 | FAQ links | A copy link on every answer; an address that names one opens it. |
| #22 | Home | Order C ships at `/`. |
| #26 | Agent terminal | The composer's caret back on the prompt's line. |
| #33 | Old footer | Main's `Landing/Footer` retired; every `BaseLayout` page closes on the map. |
 `FE-handoff` is now
`facelift-archive`, a frozen reference; `ui-reconcile` stays frozen too, as the source of the pricing
drafts the sandbox has yet to take (its kit, Type and UI inventory pages are the Design system now).
The running orders are back (`/internal/homepages/` and the island's switch on every homepage). What remains on `lab`: the rest of the homepage sandbox
(each section at `/internal/sections/<id>/`, the sign-up and sign-in flows, the pricing drafts), to be
rebuilt on this branch's `_Workbench` from the archive's `_VisualPage` / `_Variant` pages now that
their components are on `handoff`.

## The other branches

| Branch | What it holds | Do |
| --- | --- | --- |
| `facelift-archive` | The whole facelift as it grew, 491 commits of sandbox and shipped code mixed. | Read only. Copy from it; never merge it. |
| `ui-reconcile` | The kit's birthplace: the kit page, the pricing drafts, the reconciled pages before they were rebuilt here. | Read only until the sandbox has taken the pricing drafts; the kit, Type and UI pages are taken (the Design system). |
| `dark-mode` | A WIP on the archive's base: the Appearance row (since rebuilt), PromoBanner dark tokens, IoT Hub hero and Cookie policy dark fixes. | Port the fixes to `handoff` as a `feat/` if dark pages are revisited; then delete. |
| `header-search` | The docs-search sandbox on the archive's base (search itself shipped via docs chrome). | Rebuild `/internal/flows/main-menu/` as a Chrome direction on `lab` if wanted; then delete. |

The cookie card speaks upstream's words, so the short sentence that waited on legal is gone. The
responsive logo and the GitHub star count moved into the chrome plan below (layer 11).

## The chrome plan

Decided 4 Oct: the bar, the open menu and the footers become one kit-built set, judged on this
branch's Chrome workbench and shipped to `handoff` as `feat/` layers in the order below. The theme
follows the system; its switch stays out of the bar and out of the phone sheet, a quiet row in the
footer only. Blog moves into Company. Search is a field where the row has room and, where it does
not, an icon in a stroked box the size of the Sign in button — the same control at two sizes, never
a label. Two menu models are built and compared. Footers ship as `map` where a page asks for it and
`docs` for the docs; the legacy pages take `map` when they move, not a compact density of their own. The docs footer goes full-bleed, richer
than today and lighter than the main one.

**Seeing a candidate everywhere on lab.** A layer merged into `lab` is on every page of the site at once:
the bar and the footers are one component each, so layers 10 and 11 need no switch. The switch is for
the layers that bring alternatives (13, the two menu models): `starlight/Header.astro` and
`starlight/Footer.astro` are the switchboards every page goes through, and `lab`'s footer copy already
mounts the island on every page. `lab` carries its own copies that read a `chrome`
cookie the island sets (`current` · `candidate`), so the whole site on this branch runs a candidate
bar or footer while `handoff` keeps the shipping one, and a merge from `handoff` only ever meets
those two files.

| # | Layer | Branch | What it carries |
| --- | --- | --- | --- |
| 10 | Nav data | `feat/nav-blog-company` → #19 | Blog as a Company item, off the top row. On `lab`. |
| 11 | The bar | `feat/site-bar` → #20 | On `lab`, site-wide. The archive's header work, none of which reached `handoff` (its bar is `main`'s, byte for byte): the star widget in the bar's own geometry, giving way at 1300 (1a6cee78e); the drawer as a readable menu, chevrons on the items that expand, one left edge (fa3356f71); Close staying where Menu was under 560 (e44c5b1e4); the outlined cloud in the region menu and the stars in the open drawer (cc7a13701); the Products badges on the two platforms (8b2e4e72f); hover on the brand primary and AA shades for Edge and Trendz (adee819cb); underline on the items that navigate (48079b799); `_marketing-bar.scss` as the one home of the bar's rules, the homepage's copy gone. Then the seven `header-config` variants fold into two looks (marketing · docs) and two states (top · scrolled), transparency a page prop; the theme icon leaves every look; the responsive logo (160 from 1281, 215 from 1600) decided here. |
| 12 | Search | `feat/site-search` → #21, stacked on #20 | On `lab`, site-wide; the header workbench has a Search direction and a Search Closed/Open state. `SiteSearch`: one dialog, rendered once by the bar, opened by every trigger and the keys. The trigger is one control at two sizes, chosen by the room beside the nav: the labelled field with its keys from 1480 (measured: 50px a side), the icon in a stroked 40px box like Sign in below. The dialog on the kit: the Dialog's panel, the Field around Google's input, the primary for its submit, title rows on the type ladder, Escape and the backdrop and a close button, Tab wrapping, focus return; not a `<dialog>`, since Google's autocomplete at the body root would sit under the top layer. |
| 13 | The open menu | `feat/site-menu` → #24, stacked on #21 | Ships the **one panel** (decided 5 Oct): `SiteMenu` replaces `Landing/Navigation` everywhere. From 1281 the row opens one surface under the bar holding the open section, no rail and no heading (since 5 Oct); below, the sheet is the same design at a phone's width — the row as a list, a section as its own view with its name and a row back, no search field (the bar's control is a tap away). One `SiteMenuBody` per section on every surface, from `menu-model`. `dropdowns` is kept as the alternative (`BaseLayout` `menu`), judged on the header workbench's Dropdowns tab; lab's menu switch is gone. |
| 14 | Footers | `feat/site-footer` → #25, stacked on #24 | On `lab`. One `SiteFooter` on `footer-map.ts` with a density: `map` (today's `FooterMap`), `docs` (below); no third density; main's `Landing/Footer` retired in #33 (5 Oct). One `FooterBase` row under all of them: copyright, legal, Cookie settings, the Appearance row, the badges. Social icons from `FOOTER_SOCIAL` only; `SocialNetworks.astro` and `footerNavItems` go. `BaseLayout`'s `footer` prop becomes the density, with a default per layout. |
| 15 | Docs footer | with 14 (#25) | On `lab`. The `docs` density: full-bleed under the sidebar, not in the article column. The highlights row (`FOOTER_HIGHLIGHTS`, with icons), one short column set (Get started, Docs, Use cases, Blog, Contact), the base row. Social icons cut to what the workbench keeps. Lighter than `map`: no platform grid, no newsletter. |
| 16 | Cookie consent | `feat/cookie-consent-kit` → #27, stacked on #25 | On `lab`. Upstream's consent (#704) unchanged — Accept all and Reject all as equals, a switch per category, `tb_consent`, Consent Mode v2 — as main's card on the kit (bottom-left, upstream's words), with the preferences in `ui/Dialog` and Save preferences its primary; `CookieNotice` goes. The cookie workbench shows it in demo mode. |

Since 5 Oct the one panel is the site's menu (layer 13). Its colour is one token set on `nav.sm`,
reassigned per ground — the dark theme, the docs bar's sidebar ground, the bar over a dark hero —
and the products' marks carry their own colours in their files. The row packs beside the wordmark;
a page item is underlined in the ink, the open section by one accent line that glides along the row;
the chevrons say an item opens a section and no longer turn. The panel has no rail and no heading:
the open section stands under the row's first item, on one column grid (236 wide, 24 apart; Docs'
monospace 260). The search dialog carries Google's attribution under its field.

Also since 5 Oct: Use Cases and Customers are Solutions (ten use cases, SCADA, five case studies by
name, each list closed by its own "All …" link) and Partners is a group in Company; Products and Docs
close on a bar of promotions, Services on Talk to an expert. A page has one name and one home in the
menu and the footer, in the same order. Main's footer is retired (#33); lab keeps it as
`internal/_LegacyFooter.astro` for the `live` reference order and the footer workbench's `site`
stage, which lab's `starlight/Footer.astro` picks by address.

**The move into `handoff` (5 Oct).** Each PR landed as one layer commit, as layers 1–9 did: a
stacked branch carries its parent's commits, so a layer is its own range (`feat/site-bar..feat/
site-search`), cherry-picked and committed with the layer's message, in the order of the table above.
Checked first: type-check, ESLint, `build:fast`, `lint:linkcheck:nobuild` (no link issues) and
`lint:landmarks` (one `<main>` on 4588 pages). Each PR branch was pointed at its layer commit, every
PR retargeted to `handoff`, and `handoff` fast-forwarded (`dcfa7715b..05312bc46`), so GitHub marked
#19–#33 merged. `lab` merged it; it differs from `handoff` only by the sandbox. A new layer is a
`feat/` branch off `handoff` again.

Open on this plan: which social icons the docs footer
keeps; whether Pricing stays a button beside Menu on the docs bar.

Also on `lab` since 4 Oct, outside the chrome: `/` renders running order **C** (#22), and `/pricing/`
is the `ui-reconcile` draft made real, with the shipped page's calculators and licence flow grafted
back (#23). Both are stacked PRs into `handoff` like the chrome layers.

**Landed in `handoff` on 6 Oct:** #34 CSS weight (`b74f2c71a`) and #35 chrome round 2 (`8f1f35a0f`), one layer commit each, as the move did; lab's homepages preview passes `references={HOME_REFERENCES}` since #34.

**`exp/menu-split` (6 Oct): the menu by the room.** Measured first: below 1281 every width got the
phone's sheet — at 768×1024 seven rows in 406 of 920px, every section a screen away, a 1280 laptop
on the phone layer — and 1281 dated from the nine-item row. Now three
surfaces. **The row from 1200** (`$menu-row-from`; fits from 1093 with the seven items, the GitHub
mark and the search box), the panel's start clamped so Solutions' four columns fit under 1266
(`alignOne`); the search field stays at 1281. **The split sheet** from 720 on a screen 540 tall
(`$menu-split-from`, `$menu-split-min-height`, `MENU_SPLIT_QUERY`): the list a sidebar that never
leaves, the section beside it cross-fading, opened on the section the page is in (`inSection`), no
step back, Escape and a swipe close. **The phone's views** below, unchanged. GitHub stays in the bar
from 720 (was 1120): with its count beside Menu, the mark alone from 1200 to 1340, gone on a phone.
Judged on the header workbench's The menu tab (1440 · 1230 · 1024×768 · 768×1024 ·
375); `handoff` on its own server is the before. If kept, rebuilt as a `feat/` branch off `handoff`
from this branch's diff (the stage's opener and the workbench copy stay on `lab`).

**Chrome round 2 (`feat/menu-logos`, 5 Oct), notes for the FE review.** The menu's case studies by
logo (`customer-logo/`, Super Bock's made from its study's artwork), 25 menu icons re-cropped to their
ink (sprite regenerated), the products' badges in Products and Docs (`data/product-badges`, a new
32 step in `ui/Mark`; the menu repeats Mark's dark wash values for the dark theme and the over-hero
panel — `badges-on-dark` — because those grounds carry no `data-surface`), the map on four equal
tracks, the footer newsletter on upstream's `bindMailerLiteForm` (#710) with its thanks and error,
the docs footer's "Get help", the phone promo bar. **CRM work, outside this repo:** the contact form's
`devices` field (new with the redesign) reaches Formspree but has no CRM field yet — marked in
`ContactForm.astro`.

## Parked: not shipping, kept to look up

**The docs hub at `/docs/`** — NOT SHIPPING (owner, 5 Oct). Kept on branch `feat/docs-hub` (4 commits on
`feat/menu-logos`) and merged into `lab`, so `/docs/` on lab shows it; `handoff` keeps the Community
Edition introduction there. The chrome layer's commit message names the branch. To pick it up: rebase
`feat/docs-hub` onto `handoff` (its only shared file with the chrome is `data/menu-featured.ts`, the
Docs bar), then open it as its own PR. Known gap if it ships: in the docs' dark theme its wash badges
need the menu's dark values (`badges-on-dark` in `SiteMenu.astro`), since docs pages set no
`data-surface`.

- *What it does.* `/docs/` stops being the Community Edition introduction and becomes the hub, built
  as the other docs pages are: the hero with Getting Started and Why ThingsBoard?, the products by
  the Docs menu's own groups with the footer's badges, drawn as
  LinkCards (`DocsHubProducts`), a quiet "Running Community Edition? Its docs ›" line under
  ThingsBoard, and the intro's ListCards (Learn, Reference, What's new, Need help?). The Docs menu's bar becomes Getting started and **All documentation ›** (the hub); the
  CLI leaves it. No "Start here" of first stops: the page's job is the choice.
- *Why `/docs/` and not a new address.* It is the one Community page indexed as itself
  (`selfCanonical`, #341): old links, `/sitemap` and search already send "ThingsBoard docs" there.
  A hub at `/docs/overview/` would start with no inbound links and leave them on a retired edition.
- *What it costs.*
  - Code: 8 files, +265 / −48 — `components/DocsHub/DocsHubProducts.astro`, `data/docs-hub.ts`,
    `docs/index.mdx` rewritten, `DocHero` (air under a simple hero with buttons), the CE sidebar's Getting Started tab and the CE-vs-PE page's link
    (both to `/docs/getting-started/`), the hub's social card (`product-meta.ts`), the Docs menu's bar.
  - Search: same URL, same self-canonical, no redirect; the title and description change
    ("Introduction" → "ThingsBoard documentation"), so expect a re-crawl and some churn on queries
    that matched the Community intro. The Community intro has no address of its own afterwards;
    its content was a hand copy of the shared intro `/docs/pe/` keeps.
  - Upkeep: the products follow the Docs menu, and a name the footer's map lacks fails the build;
    the page's other 17 links are written in `docs/index.mdx`, as other docs pages keep theirs.
  - Not yet verified (needs a full build): the social card (`build:fast` skips OG), link check on
    the hub's 24 links, `lint:landmarks`.
- *If it ships, follow-ups.* Point the footer's Docs "Documentation ›" and the docs header's "Docs"
  wordmark (`SiteTitle`, now `/docs/pe/`) at the hub; decide whether IoT Hub's docs join the hub and
  the Docs menu (neither lists them).

## Running it

```bash
pnpm install --frozen-lockfile
pnpm exec astro dev
```

Then `/internal/`. Every internal page is `noindex`. The real pages are the reference; the island
at the bottom-left of every internal page links them (Home, Docs, Cloud, On-premises, Installations,
Contact us, Pricing) and the areas.

## The areas

**Chrome** (`/internal/chrome/`) — the frame every page shares, one workbench page per part:
Header, Footer, Cookie notice, Chat. Every variation the site supports is a tab; the one in use
comes first with its check. On the header and footer pages each tab is the REAL page in frames at
the widths where the chrome changes shape — 1440 (the search field fits), 1300 (the icon only),
1024 (the nav folds into Menu) — and on a 375 phone, drawn at one scale per set so the room in the
bar is what is compared. The controls above the tabs set the state every frame is judged in: the
theme, the bar at the top or scrolled into its solid state, the Menu drawer closed or open. The
cookie and chat pages draw the component in a stage window instead; the real thing, at a real
width, is in every header and footer frame.

**Design system** (`/internal/design-system/`) — what the redesigned pages are built from, four pages
in the order it builds up, registered in `_design.ts`. **Foundations**: the accent schemes and their
contrast, the grounds and the focus ring, elevation, radius, spacing, icons and motion. **Type**: the
`type-*` ladder drawn through its own mixins, the older mixins with how many files still include each
(read from `src/` as the page renders), and one redesigned page read live in a frame against it.
**Components**: every `ui/` component, live, then `SectionHeader` and `RegionChoice`. **Inventory**:
every button, link, mark, label, card and image link on the redesigned pages (`HARVEST_PAGES`: the
homepage in every order, Cloud, On-premises, Pricing, Installations, Contact us, Thank you), folded into
variants by shape, each tagged with its component file and whether that is the kit. Every number on
them is measured from what rendered. The kit page's address lands on Components, and its old
`#colour`-style anchors are sent on to Foundations.

**Homepages** (`/internal/homepages/`) — every running order in `data/home-compositions.ts`, side by
side with what each changes against the reference, and each as the real homepage at
`/internal/homepages/<id>/`. On any homepage the island grows the switch: the orders as a pill (the
shipping one first, with its check), `[` and `]` to step between them keeping your place, `O` to box
and number the sections. The homepage mounts the island at its `TEMP-INTERNAL-NAV` marker on `lab`
only; `handoff` keeps the marker and nothing else.

The other homepage areas FE-handoff had — Components (its sections), Flows (sign-up, sign-in) — are
still to be rebuilt. Their old addresses land on the hub until then (`[...legacy].astro`), which also
sends the old library addresses to the Design system. The ecosystem cards page (`library/cards`) was
the homepage's ecosystem section in a gallery, so it returns with the sections if at all.

## How it is built

```
src/pages/internal/
  index.astro              the hub: one tile per area
  _areas.ts                the areas and their pages; _AreaBar and _InternalNav read it
  _chrome.ts               the chrome parts; the Chrome area, its tiles and the old-address map read it
  _chrome-state.ts         the shared state (theme · scrolled · drawer) in localStorage, and its query form
  _Workbench.astro         a part's page: brief, controls, the directions as tabs (#tab=<slug>)
  _Direction.astro         one variation: heading, note, where it is set, the content
  _Frames.astro            a real route in frames at given widths, one scale per set, loaded on open
  _StateControls.astro     the pressed-button groups that write the shared state
  _Tiles.astro             an overview grid
  _AreaBar.astro           the sticky top bar: the area's pages as tabs or a picker
  _InternalNav.astro       the floating island: Home, the Pages menu, the areas
  _CookieStage.astro       a window of page with the notice pinned to its foot (homepage or docs behind it)
  _ChatStage.astro         a slice of page with the real chat mounted into it
  _before/CookieBanner.astro  the banner CookieNotice replaced, kept for the "Before" tab
  homepages/
    index.astro            the running orders side by side, each against the reference
    [id].astro             one order: the homepage itself, handed another `composition`
  chrome/
    index.astro · header.astro · footer.astro · cookie-notice.astro · chat.astro
    _FooterStage.astro     FooterMap layouts no route renders yet, under a stand-in closing band
    stage/_StageState.astro   puts a stage page in the state its query asks for
    stage/header/[variant].astro   a real page under one header variant (docs, or BaseLayout + headerVariant)
    stage/footer/[variant].astro   a real page ending in one footer (site · map · docs)
  _design.ts               the Design system's pages and the pages Type and Inventory read; the area reads it
  design-system/
    index.astro            the overview: one tile per page
    foundations.astro · type.astro · components.astro · inventory.astro
    _kit.scss              the specimen pages' shared sheet (frame, section, stages, captions)
    _kit-measure.ts        the measured captions: data-m, data-var, data-ratios
  [...legacy].astro        old addresses → new
src/layouts/PlaygroundLayout.astro   the bare shell internal pages render in (tokens, fonts, bar, island)
```

**Add a chrome direction:** a `<Direction>` in the part's page, with `<Frames route=…>` for a real
page or a stage component for a drawn one. **Add a header or footer variant** to the stage route's
`getStaticPaths` and give it a direction. **Add a part:** an entry in `_chrome.ts` and a page in
`chrome/`; the overview, the top bar and the redirects follow.

**Stage state** rides on the query: `?theme=dark`, `?scrolled=1`, `?drawer=1`, `?scroll=bottom`.
`_StageState` applies it on the stage page through the real mechanisms — the theme through
`starlight-theme` in storage, the scroll through the bar's own scroll script, the drawer through
its own button.

## Gotchas met while building this

- `main` runs Astro 7 where FE-handoff ran Astro 6. A regex literal with `<` in a component's
  frontmatter (`/</g`) makes Astro 7's compiler read it as a tag and miss the `---` fence: hundreds
  of type errors in a file with nothing wrong. Use `replaceAll`. `astro check` catches it.
- `getStaticPaths` runs on its own, before the rest of the frontmatter: a module-level constant it
  reads is not defined yet. Keep its data inside it.
- A route file whose name starts with `_` is not a route.
- Astro 7's compiler (`@astrojs/compiler-rs`) writes no `data-astro-source-file` in dev, which the
  archive's UI inventory read for `file:line`. The Inventory reads the component file from the dev
  server's `<style data-vite-dev-id>` tags instead (scope class → file, `ui-` class → kit file): the
  file, not the line, and only under `astro dev`.
- TypeScript reads `el.matches('summary')` as a type guard and narrows `el` to `never` after it in an
  `else` chain; compare `el.localName` instead.
- Starlight 0.42 keeps its token sheet at `dist/style/props.css`; `PlaygroundLayout` imports it by
  relative path because the package does not export it.
- A frame in a hidden tab never intersects anything: the workbench loads a tab's frames when the
  tab opens, and only the open tab's frames by scroll.
