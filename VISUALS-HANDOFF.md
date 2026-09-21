# Homepage key visuals — handoff

The six illustrations from the homepage facelift, and nothing else. Cut from `main` so every file
here is an ADDITION: there is no page, no layout and no config in this branch, and merging it
cannot conflict with your own homepage work.

Taken from `launch-visuals-refine` at `afe28ddaf`.

## What you need besides these files

Almost nothing, if your build descends from this repo's `main`. Checked against it file by file:

- `astro-icon` ^1.1.5 with `@iconify-json/tabler` and `@iconify-json/simple-icons` — all present,
  and `icon()` is already in `astro.config.ts`. **Nothing to install.**
- The path aliases these files import through — `@root`, `@components`, `@data`, `@util` — are all
  in `tsconfig.json`. **Nothing to configure.**
- Every SCSS variable they reach for — `$color-brand`, the font sizes and weights,
  `$font-family-mono`, `media-down` — `_variables.scss` already had.

**The one exception, and the only file here that is not a pure addition:** `_variables.scss` gains
four mixins it was missing — `visually-hidden`, `type-section`, `type-subsection`, `type-body`.
They are appended in a marked block at the end of the file, so the diff is 49 added lines and
nothing moved or removed; it should merge without a fight even if you have edited that file.

Only `visually-hidden` is used by a component (three of them). The three `type-*` mixins are used
solely by the two reference stylesheets below, so if you are not taking those, you can drop all
three.

If your build already defines any of the four, **delete the duplicate from the appended block
rather than renaming it** — two members of the same name arriving through `@use … as *` is a Sass
error, not a shadow.

If your build is NOT from this `main`, those are the things to check first.

Two names that look like they belong in `_variables.scss` and do not: `$stage-wash` is declared
inside `PlatformClear`, and the `hatch` mixin inside `TwinCorridor`. Both travel with their
component.

## The files

| | |
| --- | --- |
| `components/Landing/ConnectHub.astro` | protocols arriving at one platform |
| `components/Landing/SolutionFlow.astro` + `SolutionAppShell.astro` | the solution rail |
| `components/Landing/TwinCorridor.astro` + `TwinUnit.astro` | physical world → digital twin |
| `components/Landing/NormalizeSeries.astro` | normalising incoming series |
| `components/Landing/ScaleDuo.astro` | scale, two modes |
| `components/Landing/PlatformClear.astro` | the platform overview (the centred section) |
| `data/*-visual.ts`, `data/solution-flow.ts` | the copy, kept out of the components on purpose |
| `util/sparkline.ts` | shared spark-path maths |
| `assets/images/landings/draft/thingsboard-mark.svg` | inlined by three of them |
| `styles/_home-rows.scss`, `styles/_home-intro.scss` | REFERENCE ONLY — see below |

`SolutionAppShell` and `TwinUnit` are not visuals in their own right; they are parts their parents
import. They are here because leaving them out breaks the build rather than the picture.

## How they are called

The props are the ones the homepage ships:

```astro
<ConnectHub arms="five" />
<SolutionFlow />
<TwinCorridor zone />
<NormalizeSeries motion="pulse" />
<ScaleDuo animate hue="field" />
<PlatformClear />
```

## READ THIS BEFORE YOU DEBUG ANYTHING

**Each visual needs a block parent with a real width.** Every one of them wraps itself in an
element with `container-type: inline-size`, which zeroes that element's max-content contribution.
Put one straight into a flex or grid parent that sizes to its content and **the whole drawing
collapses to nothing — silently, with no error and no warning in the console.** This is the single
most likely way to lose an afternoon here.

**A global `svg { max-width: 100% }` reset will break the arrows.** An SVG whose viewBox is wider
than its track gets scaled down without reporting anything, and every arrowhead lands short of
where it should. If your build has that reset — many do — the SVG parts need `max-width: none` and
an explicit width.

**Fonts are the layout's, not the component's.** These are drawn against Ubuntu. On a page that
loads something else, the type metrics move and the compositions were tuned to the pixel.

## The two stylesheets are reference, not required

`_home-rows.scss` and `_home-intro.scss` are the PAGE's side of the contract — they decide how wide
a visual's box is and where it sits. You will almost certainly write your own. They are here
because they record the widths these were designed and judged at:

- in an alternating row: **525px** of media column, bleeding to 560
- the centred section: a 1000px container, with the visual bleeding 60px each side to **1080px**
- on a 375px phone: **367px**

A visual handed a width outside that range will still draw — it just will not be the drawing that
was reviewed.

## How they work, in one paragraph

Nothing is sized in pixels. Each visual measures the width of its container and derives a "design
unit" from it, then expresses every number in that unit, so the composition scales as one drawing
instead of reflowing. It uses CSS container queries, never viewport media queries — a visual does
not know what the viewport is, only how much room it was handed. `PlatformClear` additionally
switches to a different arrangement below a 768px container: two columns instead of four, with its
own unit basis. That is why these are HTML and CSS rather than exported SVG files; a viewBox scales
linearly and cannot hold a type floor or re-lay-out.

## Deliberately not here

- `FeatureBlockSection.astro`, the alternating row — it is shared with the PE and Edge product
  pages, so it is yours to take only if you want that row component too.
- `PlatformRaised.astro` and `PlatformLoop.astro` — earlier cuts of the platform visual, kept in
  the full branch for comparison. `PlatformClear` is the one that ships.
- The sandbox at `/internal/launch-visuals/`, which renders each visual standalone with phone
  frames at the real widths. Worth looking at on the full branch to check an import worked.

The method, the gotchas and the open questions are written up at
`src/components/Landing/CLAUDE.md` on `launch-visuals-refine`.
