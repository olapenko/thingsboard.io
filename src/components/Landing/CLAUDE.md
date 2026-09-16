# Key visuals

The illustrations on the experimental homepage: `ConnectCloud`, `ConnectFlow`, `DigitalTwin`,
`NormalizeSeries`, `ScaleGrowth`, `SolutionFlow`, `DeployFork`, `WhiteLabelApp` and their candidates.
They are drawn in CSS and SVG, not exported as images, so they take the page's tokens and stay
sharp at any size.

Two pages render them, both internal and both `noindex`:

| Page | What it is |
| --- | --- |
| `/internal/home-preview/` | The homepage as proposed. The only place a visual is seen in context. |
| `/internal/launch-visuals/` | The sandbox index. One card per visual. |
| `/internal/launch-visuals/<id>/` | One visual, its exhibits at known widths. |

**One route per visual**, each its own file:

```
_key-visuals.ts              the copy and the tab labels; addressed by kv('twin'), never by index
_VisualPage.astro            the shell every visual's page shares: the strip of links between
                             them, the retire control, and the stage chrome (is:global)
launch-visuals/index.astro   the index
launch-visuals/twin.astro    one visual's stages — <VisualPage visual="twin"> … </VisualPage>
```

Add a visual: an entry in `_key-visuals.ts` and a page in `launch-visuals/`. It appears on the
index and in every other page's strip with no further edit. Remove one: delete those two things.

This replaced a single 1346-line page holding all nine as tab panels. Opening it compiled and
rendered fifty-eight stages to look at six, and pulled the stylesheets of twenty components;
a visual's own page pulls four or five and its first compile is milliseconds rather than 2.5s.

## The design unit

Nothing in a visual is sized in pixels. Each one derives a unit from the width it is given and
expresses every number in that unit, so the whole composition scales as one drawing:

```scss
.thing {
  --thing-u: clamp(0.45px, calc(100cqw / 630), 1.15px);   // 630 = the native width
  --u: var(--thing-u);
}
@function u($n) { @return calc(#{$n} * var(--u)); }
```

`100cqw` needs a container, so the outermost wrapper is `.thing-fit { container-type: inline-size }`.
**Never a media query inside a visual.** A visual does not know what the viewport is; it knows how
much room it was handed, and the same component appears at four different widths on one page.

Geometry that has to line up — curve endpoints, arrow tips, column widths — is computed in the
frontmatter in design units and passed down as custom properties, so the drawing and the layout
cannot disagree. See `ConnectFlow.astro` and `TwinTree.astro`.

## R — the one number that predicts a phone

```
R = native width ÷ smallest type, both in design units
```

because the rendered size of that type is exactly `container ÷ R`. Nothing else survives the
division: not the font value, not the unit cap, not how carefully the thing is laid out.

A 375px phone gives a visual about a 367px column. So:

| R | smallest type on a phone |
| --- | --- |
| 52.5 (`DigitalTwin`, 630u / 12u) | 7.0px |
| 45 | 8.2px |
| 39 (`TwinTree`, 552u / 14u) | 9.4px |
| 28 (the compact family, 448u / 16u) | 13.1px |

Two consequences worth knowing before proposing anything:

- **Narrowing a visual buys nothing on its own.** If the type shrinks with the box, R is unchanged
  and the phone sees exactly what it saw before. The win only comes from narrowing the box while
  holding or raising the floor.
- **The floor is usually one or two elements**, not the whole design — an axis label, a caption, a
  connector name. Deleting those raises the floor for free; shrinking everything else does nothing.

## Rules of the work

**Never change a shipped visual to try an idea.** Add a candidate beside it — a new component, a
new panel stage — and leave the original rendering on the home preview. Several of these have been
through five or six rejected directions; the only reason that was survivable is that the page never
moved. `ConnectCloud` began this way and became the launch candidate; `TwinTree` began this way and
did not.

**Measure, don't assume.** Every claim about geometry, contrast or colour in this directory was
checked in the browser — curve endpoints via `getPointAtLength`, band centres via
`getBoundingClientRect`, weights via `document.fonts`, contrast by computing the ratio. Estimates of
text width have been wrong by 25u. The browser is the source of truth; the arithmetic is a proposal.

**Copy that carries meaning lives in `src/data/*-visual.ts`**, not in the component, so a component
can be redrawn without retyping the words and a marketing page can import the same strings.

## Gotchas, each of which has cost an hour

- **HMR works; a dead server looks exactly like stale HMR.** This file used to say that scoped-style
  HMR goes stale and the dev server must be restarted after every SCSS edit. Measured, that is
  false: changing a value in a component's scoped block, adding a brand-new selector to it, and
  editing the page's `is:global` block all reach the browser live, with no reload. What actually
  happened was that the dev server had died — the console showed `ERR_CONNECTION_REFUSED` and vite
  "Failed to reload" errors — and the stale styles got blamed on HMR. **Before blaming HMR, check
  the server is alive.** Restarting costs about 31 seconds and was, for a while, the single largest
  tax on the loop.
- **`astro check` does not compile SCSS.** It will pass over a stylesheet that cannot build. Only a
  real build or a page load proves the styles.
- **The global reset gives every `<svg>` `max-width: 100%`.** An SVG whose viewBox is wider than its
  grid track is silently scaled down — every arrow lands short and nothing reports an error. Any SVG
  that overflows its track needs `max-width: none` and an explicit width.
- **Pixels do not scale.** A `1px` border or hairline is the same size at every unit, so it breaks
  unit arithmetic — worst at phone scale, where the unit is smallest. `TwinUnit` carries 4px of
  border chrome; `TwinTree` documents the two ways to absorb it.
- **Astro scoped CSS compiles to `:where(.astro-hash)` — zero specificity.** Two equal selectors are
  decided by source order, so a rule declared later wins even if it looks more specific.
- **A scoped rule cannot reach markup in another component.** This is why the sandbox's stage chrome
  (`.stage`, `.probe`, `.page-ctl`, `.unit-row`) is in its `is:global` block: the markup is in
  `_panels/*.astro`.
- **`grid-template-columns: auto` takes max-content**, so `max-width: 100%` on a child never bites
  and the row escapes its box. Use `minmax(0, 1fr)`.
- **There is no Ubuntu 600 anywhere.** `$font-weight-semibold` exists as a variable and the browser
  synthesises the face — fine on a heading that snaps to 700, visibly wrong inside a paragraph. Use
  `$font-weight-medium`.
- **The two pages do not load the same faces**, which matters because the sandbox is where the
  decisions get made:

  | | Ubuntu | Ubuntu Mono |
  | --- | --- | --- |
  | `/internal/home-preview/` (BaseLayout → Starlight) | 300, 400, 400-italic, 500, 700 | 400, 700 |
  | `/internal/launch-visuals/` (`PlaygroundLayout`) | 300, 400, 500, 700 | **400 only** |

  So bold monospace — a chip, an axis label — is a real face on the home preview and a synthesised
  one in the sandbox. Check `document.fonts` on the page you are actually looking at.

## Verifying

```bash
npx prettier --check <files>   # separate commands, and read each exit code
npx astro check
```

Run them as separate commands. A pipe (`… | tail -2`) swallows a non-zero exit and has already
caused unformatted code to be committed. A full build is `pnpm build:fast` — bare `astro build`
OOMs — and per the root CLAUDE.md, ask before running one.

**`pnpm run dev -- --port 4322` does not work**: pnpm swallows the `--` and Astro falls back to
4321, then auto-increments if that is taken — which can land on the port you asked for and look
like success. `pnpm run dev --port 4322`, with no `--`, is correct. `.claude/launch.json` uses that
form for `tb-site-b` and `tb-site-c`.

**Astro never fails on a busy port, it moves.** Ask for 4323 while 4323–4325 are taken and it
starts on 4326 and says so in one line you did not read. So the server you are measuring may not
be the one you think, and a dev server that seems to ignore your edits is often a different
server. `lsof -nP -iTCP -sTCP:LISTEN | grep 43` lists them with pids. Note that these processes do
NOT match `pkill -f "astro dev"` — the command line is `node …/astro.js`, so that pkill silently
kills nothing and leaves the orphans holding their ports.

Measured costs, so the loop can be judged rather than guessed: dev server boot ~31s; first
compile of `/internal/launch-visuals/` 2.5s and of `/internal/home-preview/` 7.6s; afterwards
21ms and 59ms. Once it is up, it is fast — so keep it up.

Path aliases: `@root`, `@components`, `@layouts`, `@styles`, `@data`, `@util`, `@models`,
`@includes`. There is no `@assets`.

## The workflow

One visual goes through this loop, and it is the loop rather than any one step that has kept the
shipped page stable through several rejected directions:

1. **Draft as a new component**, named for its idea (`ConnectCloud`, `TwinTree`), never as an edit
   to the visual the home preview renders.
2. **Give it a canvas** — a `FeatureRow` in its panel, plus probes at 525px (the home row at 1440)
   and 335px (the phone). The candidate goes FIRST in the panel and the incumbent below it; put it
   second and the incumbent quietly stays the incumbent.
3. **Measure it in the browser**, and report the numbers rather than an impression.
4. **Judge it in the row**, not in isolation.
5. **Promote or retire.** Promoting means the home preview imports it. Retiring means the ✕ in its
   caption, and a deletion pass later.

Rejected work is committed, not discarded — with the reason in the message. `TwinTree` is on the
branch and is not used anywhere; the compact family was deleted only after it had been parked long
enough to be sure.

### Several visuals at once

Components never collide; the shared files do. One git worktree per visual, on its own branch, one
session per visual, and its own dev server — `.claude/launch.json` declares `tb-site` (4321),
`tb-site-b` (4322) and `tb-site-c` (4323), because two sessions sharing one server will restart it
under each other mid-measurement.

A session per visual is also about context: these sessions get long, and a compacted one has lost
the measurements it took two hours ago. Start fresh per visual and let this file carry the method.

Merge the branches back **one at a time** — each will have touched `_key-visuals.ts` and the two
one-line lists in `launch-visuals.astro`.

Shared, so coordinate before touching: `home-preview.astro`, `_key-visuals.ts`, `_VisualPage.astro`,
`FeatureBlockSection.astro` (which also reaches the PE and Edge product pages), `TwinUnit.astro`,
and `src/styles/_connect-terms.scss`. A visual's own page is not shared, which is the point.

## Retiring a stage

The sandbox has more exhibits than anyone can hold in their head. Each stage's caption has a ✕ that
marks it as no longer wanted: the stage greys out and the key goes into
`localStorage['launch-visuals:retire']` as `visual/position → caption`. The store is shared across
every visual's page, so the count and the copied list cover the whole sandbox wherever you are.

Marking is not deleting. To act on the list, read that key off the page and then, for each entry,
check that nothing outside the sandbox imports the component before removing it. **Deletion is its
own commit**, never mixed with design work, so a change of mind is one revert.
