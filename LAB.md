# The lab

`lab` is `handoff` plus the sandbox: the pages under `/internal/` where the site's pieces are
judged one at a time, plus whatever a review needs that must never ship. It takes `handoff` in
and is never merged back. What a review decides is rebuilt as a `feat/` branch off `handoff`.

## The branches

| Branch | What it is | Moves by |
| --- | --- | --- |
| `main` | A read-only mirror of the live site (upstream `thingsboard/thingsboard.io`). Never commit. | `gh repo sync olapenko/thingsboard.io --source thingsboard/thingsboard.io --branch main`, then `git fetch` |
| `handoff` | The deliverable: `main` plus the redesign, one commit per layer, shippable code only — no `/internal` pages, no sandbox hooks in shipped components. | `feat/<topic>` branches cut from it, merged back by PR with a rebase merge |
| `lab` | `handoff` plus this sandbox. | Fast-forwarded to `handoff` after every merge (`git fetch origin handoff:lab`), then its own commits |
| `feat/<topic>` | One layer for `handoff`. Lowercase; deleted when merged. | PR into `handoff` |
| `exp/<topic>` | An experiment for the sandbox. | PR into `lab`, or dropped |

Delivery to the real repo is `main..handoff`, one PR or patch per layer, in order. An upstream
sync is `main` ← upstream, then `main` → `handoff`, then `handoff` → `lab`.

## The layers so far

| # | Layer | PR | What it carries |
| --- | --- | --- | --- |
| 1 | Fonts and tokens | #10 | Ubuntu site-wide (docs included) with the system stack as fallback; the 600→700 weight alias; the redesign's additive colour tokens in `_theme.scss`. |
| 2 | Docs chrome | #11 | The docs bar's search as a labelled field with ⌘K and `/`; the theme switch out of the bar into `ThemeChoice` in the docs footer and the Menu drawer. |
| 3 | UI kit | #12 | `src/components/ui/` (Button, Link, Mark, Chip, Tabs, Segmented, Field, Card, Band, Dialog), the type-role ladder, the accent and focus tokens. Read `src/components/ui/README.md` first. |
| 4 | Footer | #13 | `Landing/FooterMap`, opt-in per page with `footer="map"` on `BaseLayout`; the Appearance row for theme-following pages. |
| 5 | Site chrome | #14 | `CookieNotice` as the indigo bar in place of `CookieBanner`; the chat in the site's look with our own launcher. |
| 6 | Contact us + Thanks | #15 | The two pages on the kit with the topic picker and device slider; FE's `SectionHeader` + `PageIntro`; main's header renamed `HomeSectionHeader` for the product pages. |

Next, in order: the remaining pages, each as `feat/page-<name>` — Installations, Cloud and
On-premises, Home last. Each brings its sections, data and visuals; each takes
`footer="map"`. Then `FE-handoff` is renamed `facelift-archive` and kept as a frozen reference.

Open, for a review: whether the bar takes FE-handoff's responsive logo (160px from 1281, 215 from
1600; `main` keeps a 180×60 box) and shows the GitHub star count below 1500; legal's sign-off on
the cookie notice's short sentence.

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

The homepage areas FE-handoff had — Homepages (the running orders), Components (its sections),
Flows (sign-up, sign-in) — and the Type and UI library pages return with the Home layer. Their old
addresses land on the hub until then (`[...legacy].astro`).

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
