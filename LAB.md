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

Every page layer has landed; `handoff` is `main` plus nine linear commits. `FE-handoff` is now
`facelift-archive`, a frozen reference; `ui-reconcile` stays frozen too, as the source of the kit page
and the pricing drafts the sandbox has yet to take. The running orders are back (`/internal/homepages/`
and the island's switch on every homepage). What remains on `lab`: the rest of the homepage sandbox
(each section at `/internal/sections/<id>/`, the sign-up and sign-in flows, the pricing drafts), to be
rebuilt on this branch's `_Workbench` from the archive's `_VisualPage` / `_Variant` pages now that
their components are on `handoff`.

## The other branches

| Branch | What it holds | Do |
| --- | --- | --- |
| `facelift-archive` | The whole facelift as it grew, 491 commits of sandbox and shipped code mixed. | Read only. Copy from it; never merge it. |
| `ui-reconcile` | The kit's birthplace: the kit page, the pricing drafts, the reconciled pages before they were rebuilt here. | Read only until the sandbox has taken the kit page and the pricing drafts. |
| `dark-mode` | A WIP on the archive's base: the Appearance row (since rebuilt), PromoBanner dark tokens, IoT Hub hero and Cookie policy dark fixes. | Port the fixes to `handoff` as a `feat/` if dark pages are revisited; then delete. |
| `header-search` | The docs-search sandbox on the archive's base (search itself shipped via docs chrome). | Rebuild `/internal/flows/main-menu/` as a Chrome direction on `lab` if wanted; then delete. |

Open, for a review: legal's sign-off on the cookie notice's short sentence. The responsive logo and
the GitHub star count moved into the chrome plan below (layer 11).

## The chrome plan

Decided 4 Oct: the bar, the open menu and the footers become one kit-built set, judged on this
branch's Chrome workbench and shipped to `handoff` as `feat/` layers in the order below. The theme
follows the system; its switch stays out of the bar and out of the phone sheet, a quiet row in the
footer only. Blog moves into Company. Search is a field where the row has room and, where it does
not, an icon in a stroked box the size of the Sign in button — the same control at two sizes, never
a label. Two menu models are built and compared. Footers ship as `map` where a page asks for it and
`docs` for the docs; the legacy pages' compact footer waits. The docs footer goes full-bleed, richer
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
| 12 | Search | `feat/site-search` | `SiteSearch` from `header-search` (9c2d24e40): one dialog shared by every trigger. The trigger is one control at two sizes, chosen by the room beside the nav: the labelled field with its keys, or the icon in a stroked 40px box like Sign in. The dialog redrawn on the kit: Field, the result rows on the type ladder, the dark ground, focus return. The `field` · `icon` · `live` frames from `header-search`'s `_MenuStage` return as directions on `/internal/chrome/header/`. |
| 13 | The open menu | `feat/site-menu` | `Navigation` + `HeaderContent` (1,800 lines) split into `SiteBar`, `SiteMenu`, `SiteMenuPanel`, rendered from the data once, popover and `:has()` for open and close, the hover, focus and swipe logic in one place. Two candidates on the workbench, both on the kit's Link, Mark and Card: **Dropdowns**, the per-item panels redrawn (columns from the data, the Products badges, a featured slot); **Panel**, one surface with a section rail on the left and the section's columns on the right. The phone sheet is shared: accordion sections, the search field at the top, Sign in · Try for free pinned at the foot, no theme row. The review picks one, or keeps Dropdowns on docs and Panel on marketing. |
| 14 | Footers | `feat/site-footer` | One `SiteFooter` on `footer-map.ts` with a density: `map` (today's `FooterMap`), `docs` (below), later `site` for the legacy pages. One `FooterBase` row under all of them: copyright, legal, Cookie settings, the Appearance row, the badges. Social icons from `FOOTER_SOCIAL` only; `SocialNetworks.astro` and `footerNavItems` go. `BaseLayout`'s `footer` prop becomes the density, with a default per layout. |
| 15 | Docs footer | with 14 | The `docs` density: full-bleed under the sidebar, not in the article column. The highlights row (`FOOTER_HIGHLIGHTS`, with icons), one short column set (Get started, Docs, Use cases, Blog, Contact), the base row. Social icons cut to what the workbench keeps. Lighter than `map`: no platform grid, no newsletter. |

Open on this plan: the GitHub count's threshold (the archive hides it below 1300); which social icons
the docs footer keeps; whether Pricing stays a button beside Menu on the docs bar.

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

**Design system** (`/internal/design-system/`) — the kit, live, with its numbers measured from what
rendered.

**Homepages** (`/internal/homepages/`) — every running order in `data/home-compositions.ts`, side by
side with what each changes against the reference, and each as the real homepage at
`/internal/homepages/<id>/`. On any homepage the island grows the switch: the orders as a pill (the
shipping one first, with its check), `[` and `]` to step between them keeping your place, `O` to box
and number the sections. The homepage mounts the island at its `TEMP-INTERNAL-NAV` marker on `lab`
only; `handoff` keeps the marker and nothing else.

The other homepage areas FE-handoff had — Components (its sections), Flows (sign-up, sign-in) — and
the Type and UI library pages are still to be rebuilt. Their old addresses land on the hub until then
(`[...legacy].astro`).

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
  design-system/index.astro
  library/kit.astro
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
- Starlight 0.42 keeps its token sheet at `dist/style/props.css`; `PlaygroundLayout` imports it by
  relative path because the package does not export it.
- A frame in a hidden tab never intersects anything: the workbench loads a tab's frames when the
  tab opens, and only the open tab's frames by scroll.
