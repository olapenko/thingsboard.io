# Key visuals

The illustrations on the experimental homepage: `ConnectCloud`, `ConnectFlow`, `DigitalTwin`,
`NormalizeFlow`, `ScaleGrowth`, `SolutionFlow`, `DeployFork`, `WhiteLabelApp` and their candidates.
They are drawn in CSS and SVG, not exported as images, so they take the page's tokens and stay
sharp at any size.

Two pages render them, both internal and both `noindex`:

| Page | What it is |
| --- | --- |
| `/internal/home-preview/` | The homepage as proposed. The only place a visual is seen in context. |
| `/internal/launch-visuals/` | The sandbox. One tab per visual, each exhibit at a known width. |

The sandbox page is a frame only: the tab strip, the page-wide controls, and one `<Panel />` each.
Every visual's exhibits live in `src/pages/internal/_panels/_<id>.astro`, one file per visual, so
that two people — or two sessions — working on different visuals never edit the same file. Copy
comes from `src/pages/internal/_key-visuals.ts`, addressed by `kv('twin')` and never by index.

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

- **Astro's scoped-style HMR goes stale.** After editing SCSS, a reload is not enough — the browser
  keeps serving the old rules and you measure a change that never happened. Restart the dev server.
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
- **Ubuntu is loaded at 300 / 400 / 400-italic / 500 / 700, Ubuntu Mono at 400 / 700. There is no
  600.** `$font-weight-semibold` exists as a variable and the browser synthesises it — fine on a
  heading that snaps to 700, visibly wrong inside a paragraph. Use `$font-weight-medium`.

## Verifying

```bash
npx prettier --check <files>   # separate commands, and read each exit code
npx astro check
```

Run them as separate commands. A pipe (`… | tail -2`) swallows a non-zero exit and has already
caused unformatted code to be committed. A full build is `pnpm build:fast` — bare `astro build`
OOMs — and per the root CLAUDE.md, ask before running one.

Path aliases: `@root`, `@components`, `@layouts`, `@styles`, `@data`, `@util`, `@models`,
`@includes`. There is no `@assets`.

## Working on several visuals at once

Components never collide; the shared files do. Use one git worktree per visual, on its own branch,
and give each its own dev server — `.claude/launch.json` declares `tb-site` (4321), `tb-site-b`
(4322) and `tb-site-c` (4323), because two sessions sharing one server will restart it under each
other mid-measurement.

Still shared, so coordinate before touching them: `home-preview.astro`, `_key-visuals.ts`,
`FeatureBlockSection.astro` (which also reaches the PE and Edge product pages), `TwinUnit.astro`,
and `src/styles/_connect-terms.scss`.

## Retiring a stage

The sandbox has more exhibits than anyone can hold in their head. Each stage's caption has a ✕ that
marks it as no longer wanted: the stage greys out and the key goes into
`localStorage['launch-visuals:retire']` as `panel/position → caption`.

Marking is not deleting. To act on the list, read that key off the page and then, for each entry,
check that nothing outside the sandbox imports the component before removing it. **Deletion is its
own commit**, never mixed with design work, so a change of mind is one revert.
