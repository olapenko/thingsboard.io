# Blog visual kit

A small set of content components for release posts and other visual blog articles, plus the
asset pipelines that feed them. It was built for the ThingsBoard 4.4 post and is meant to be
reused and grown post by post.

```
prototypes/blog-kit/
├── kit.css                  the components (standalone CSS, scoped by class)
├── kit.js                   loading, lightbox, slider and video behaviour (progressive, optional)
├── GUIDE.md                 draft authoring guide: shooting, cropping, choosing a visual, delivering sources
├── tools/
│   ├── prepare-images.py    crop and patch screenshots from images.json, write width/height into the pages
│   ├── pngcrop.py           dependency-free PNG cropper and fill used by the above
│   ├── prepare-videos.py    run prepare-video.sh for every clip in videos.json, write width/height into the pages
│   ├── prepare-video.sh     ffmpeg pipeline for one looped clip (crop, trim, scale, H.264 + VP9 + poster)
│   ├── build-guide.py       renders GUIDE.md to examples/guide.html
│   └── build-prototype.py   assembles the three pages and their media into one folder for the shared artifact
└── examples/
    ├── thingsboard-4-4/     the 4.4 release post as a static page (reference implementation)
    │   ├── images.json      crops and patches for its screenshots
    │   └── videos.json      crops and trims for its clips
    ├── kit-demo.html        the Components page: every component once, light and dark (+ kit-demo/videos.json for its clips)
    └── guide.html           the guide as a page, generated; linked from the demo

Sources (raw captures, recordings, the sources zip) are git-ignored; the manifests, the
processed images and a post's encoded clips are committed, so a post renders from a clean
checkout. The demo's clips are ignored (they are large and only illustrative);
`prepare-videos.py` regenerates any clip from its manifest.
```

Open either example by serving this folder (`python3 -m http.server`, then
`/examples/thingsboard-4-4/` or `/examples/kit-demo.html`). The examples carry a copy of
the blog page shell (header, post frame, share row, footer) inline so they look like the live
site; that shell is **not** part of the kit — the site already has it.

## What to integrate

`kit.css` and `kit.js` are the deliverable. Everything in them is scoped by class and depends
only on tokens the site already defines (`--color-*`, `--spacing-*`, `--radius-*`,
Starlight's `--sl-color-*`). The natural home is `src/components/Blog/`, one Astro component
per pattern, with `kit.css` split along the section comments:

| Pattern | Astro component | Markup contract |
|---|---|---|
| `.shot` + `.ring` / `.patch` | `BlogShot.astro` | the media frame: `<div class="shot"><img …><div class="ring" style="left:…%;top:…%;width:…%;height:…%"></div></div>`, or `<div class="shot"><video …></video></div>` for a looped clip (a `video` prop on the component) |
| `.panel` | `BlogPanel.astro` | wraps one `.shot`, still or clip; `--dark`, `--tall`, `--wide` (a whole screen with a small margin, in a full-row block); `--bleed` holds a bare `<img>` edge to edge, no shadow, no lightbox |
| `.compare` | extend `UseCase/ImageComparison.astro` | already on the site; `kit.js` has the same drag logic plus the tags and the `--vertical` axis switch (added on request, see below), which the site component would gain |
| `.grid` + `.block` / `.card` | `BlogGrid.astro` | `--3`, `--tight`; child `.wide` spans; `.sub` for the small heading |
| `.stepper` | `BlogSteps.astro` | `<ol class="stepper"><li><span class="sub">…</span><p>…</p></li>` — horizontal, numbered by CSS counter; stacks on phones |
| `.schema` | `BlogSchema.astro` (under review) | boxes + arrows, see below |
| `.cta` | existing `BlogCTA.astro` | the kit version is a restyle of it, with its own hover and focus states (the template only underlines links on hover) |
| `.btn` (review) | existing `BlogButton.astro` | the CTA's button on its own in the text; `--primary`, `--outline` |
| `.note` (review) | existing `BlogNote.astro` | `<div class="note"><span class="note__label">Tip</span><p>…</p></div>`; `--warn` in the notice colour; replaces bold "Tip:" paragraphs and the blockquote-as-note |
| `.quote` (review) | new | `<blockquote class="quote"><p>…</p><cite>…</cite></blockquote>`, the register of a quotation, not a note |
| `.feature` (review) | new | one row of text beside any kit visual, `--flip` alternates sides; the inline-styled feature rows of two posts |
| `.table-wrap` (review) | new, or a template rule | scroll wrapper for the template's tables; `--compare` on the table makes the first column the row header |
| `.stepper--vertical` (review) | `BlogSteps.astro` | the rail at every width, each step with a paragraph and a visual; the "Step N" headings of the how-to posts |
| `.qa` (review) | new | `<dl class="qa"><dt>…</dt><dd><p>…</p></dd>` for the interview posts |
| `.glance` (review) | new | what's in this release, as links to its sections, after the intro |

**Keeping it light.** `kit.css` is about 230 lines (about 280 with the review block) and `kit.js` about 110, with no
dependencies. When splitting into Astro components, keep it that way: one `<style is:global>`
per component containing only its section (slotted markdown keeps the parent scope hash, which
is why the existing Blog components are global too), the two dark blocks collapsed to one
`[data-theme='dark']` block since the site always sets the attribute, and the four `kit.js`
behaviours as four small `<script>`s, each loading only on pages that use the component.
Nothing in the kit needs a framework, a build step or a runtime dependency.

The `.blog-content` rules in the site's blog template still apply inside the components
(paragraph size, link colour); the kit only overrides what it must (`:is(.block, .card) p`).

## Design rules the kit encodes

- Screenshots are **real product screens**, never mock-ups: 6px rounding (the same radius the blog
  gives inline images), a soft layered shadow, no border or hairline.
- A screenshot is served **at its natural pixel size** and scaled down by CSS, never up. A 2x
  capture is the best case (sharp on retina after scaling); a 1x capture at least a third wider
  than its slot is acceptable and opens at its real size in the lightbox (`GUIDE.md`, 1.1).
- **Annotations are overlays, not UI.** `.ring` is drawn 8px outside the element it marks with a
  wide, soft glow so it cannot be mistaken for a focus state; `.patch` paints over a region with
  the UI's own white (used to hide a red "nothing configured" line). Both are positioned in
  percent of the image box, so they survive any rendered size. The patch is a review-time
  tool: once a post is final, the same rectangle goes into the post's `images.json` as a
  `patch` entry and the pipeline bakes it into the asset (so the lightbox and any 2x file carry
  the fix too), and the overlay is removed.
- A capture whose own background already frames it (a search box over the app wallpaper, as
  in the demo's Bleed example) goes in a `.panel--bleed`: the image is the panel, edge to edge,
  nothing else.
- A **whole screen captured without the browser frame** (a DevTools capture, a full-screen
  recording) has no frame of its own; it goes on a `.panel--wide` in a full-row block and the
  panel frames it. A window capture that frames itself takes the column on its own. A clip is
  placed the same two ways, since it is a `.shot` too.
- Dialogs are **cut out of their screenshot** and placed on a `.panel` gradient. Light panels are
  pale blue-to-teal and the default; `.panel--dark` is the product teal (#00695c) into steel
  blue and is the **highlight**: when a section has several panels, at most one is dark, the
  one that matters most. A post full of dark panels has no highlight left.
- **Captions are optional.** When the text already sits beside the visual (a `.grid` block with
  a `.sub` heading), there is no caption. Figures that stand alone keep a short `<figcaption>`
  with no bold lead-in.
- **No chrome unless it carries meaning.** `.block` is text + visual with nothing around it;
  `.card` (bordered, no fill) is for the API-style icon cards and the numbered steps, where the border
  groups a repeated unit.
- **Diagrams follow the docs.** See the next section.

## Loading and the lightbox

Screenshots are the heaviest thing on the page and they arrive after the layout. The kit
handles that in three steps, and the first two need no JavaScript:

1. **Every `<img>` carries its natural `width` and `height`.** The browser reserves the box and
   its aspect ratio before the file arrives, so nothing shifts when it lands, and the `.ring` and
   `.patch` overlays, which are placed in percent of that box, are right from the first paint.
   `prepare-images.py` writes the attributes; a hand-written image without them is a bug.
2. **The wrapper shows its own surface until then.** `.shot` and `.compare` have a
   light background, so a pending image reads as a quiet placeholder rather than a hole. Below
   the fold, images are `loading="lazy"` and `decoding="async"`; the first screenshot of a post
   is eager because it is usually the largest paint.
3. **With `kit.js`, images fade in** (`.is-loaded`, 350 ms, none under reduced motion). The
   class `kit-js` on `<html>` gates the hidden state, so without the script nothing is hidden.
   A failed image is marked loaded too, so its alt text shows instead of an empty box.

**Lightbox.** A 1x capture is shown downscaled in the column; the lightbox lets a reader see
the real pixels. `kit.js` opens any `.shot` image at its natural size in an
overlay, or at `data-full="…"` when a larger file exists (the way to serve a 2x original
without paying for it inline). `data-no-lightbox` opts out at any scope: on an image, on a
wrapper (a figure, a grid, a panel), on `.blog-content` for a whole post, or on `<html>` to
switch the lightbox off for the page; the zoom cursor follows the same rule. The overlay uses the blog template's own markup and classes (`.blog-lightbox`,
`.blog-lightbox__close`), so on the site this is not a second lightbox: the template already
opens every `.blog-content img` the same way. The integration choice is to keep the template's
and add the `data-no-lightbox` / `data-full` handling to it, or to replace it with the kit's;
either way there is one. The docs' PhotoSwipe gallery stays what it is, image pairs only.
Opening an HTML diagram the same way is the roadmap item under "The diagram component".

## Dark mode

Every colour is a token, and every dark value is declared twice:

```css
@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { … } }   /* no theme set */
:root[data-theme='dark'] { … }                                                  /* explicit */
```

On thingsboard.io the Starlight theme script always sets `data-theme`, so the second block is
the one that fires; the first keeps a standalone page (or an artifact) right when nothing sets
it. When the components are moved into Astro, the `prefers-color-scheme` blocks can go.

The layers, top to bottom, and what each reads from:

| Layer | Light | Dark |
|---|---|---|
| Page | `--color-bg` | `--color-bg` |
| `.panel` | `#e9f1fb → #e4f3ef` | `#1c2733 → #1a2a28` |
| `.panel--dark` | teal → steel blue | same (deliberately fixed) |
| `.shot` shadow | `--shadow-shot` (blue-black, light) | heavier, pure black |
| `.ring` | `--accent-ring` #2a7dec | #78b4f5 |
| `.card` | `--color-bg-surface` + `--color-border` | same tokens |
| `.schema` families | SVG light palette | SVG dark palette |

Two things are intentionally the same in both themes: `.patch` is white because it paints over
a light screenshot, and `.compare` tags and handle use fixed dark/white because they sit on a
screenshot too.

## The diagram component and the docs palette

The docs draw their diagrams as Figma exports in `src/assets/schemas/` — 105 light/dark SVG
pairs with a consistent visual language: tinted boxes with a 1px stroke, a square icon tile in
the family's dark shade, bold labels, short arrows (about 24 units beside a 43-unit box,
1.5 wide, rounded chevron, 3 units off each box, coloured like the box they leave), and on
multilayer diagrams a dotted grid behind everything (35 of the 105 use it).

`.schema` reproduces that language in HTML for the simple case a blog post needs: one or two
rows of boxes and arrows, themed by tokens, text selectable, no export round-trip.

**Palette audit.** The SVGs use seven colour families consistently. Three already exist as
site tokens, four do not:

| Family | Light fill / stroke / tile | Dark fill / stroke / tile | Site token |
|---|---|---|---|
| blue | `#cfd4fc` / `#3d50f5` / `#3d50f5` | `#17264f` / `#3369ff` / `#b3c7ff` | `--sl-color-accent(-low/-high)` |
| grey | `#edeef3` / `#555962` / `#555962` | `#353841` / `#888c96` / `#888c96` | `--sl-color-gray-1..5` |
| teal | `#d6e7e5` / `#00695c` / `#00695c` | `#1d3739` / `#3fd9d1` / `#a4eeea` | `--color-light-blue(-low/-high)` |
| purple | `#edd1fa` / `#bb3df5` / `#660891` | `#40224e` / `#bd53ee` / `#ebccfa` | none |
| yellow | `#fceac5` / `#f5bb3d` / `#73520d` | `#4e4022` / `#eebd53` / `#f9e8c3` | none |
| green | `#defbd0` / `#4fdf0c` / `#28650b` | `#304e22` / `#84ee53` / `#bdf6a2` | none |
| pink | `#f9c3d6` / `#f53d7d` / `#8a0f3a` | `#4e2232` / `#ee5389` / `#f9c3d6` | none |
| grid dots | `#c1c3c8` at 50 % | `#353841` at 50 % | `--sl-color-gray-2` / `gray-5` |

`kit.css` wires the three tokenised families to the site tokens with the SVG hex as fallback,
and hardcodes the other four. Recommended follow-up, outside this kit: add
`--schema-{purple,yellow,green,pink}-{fill,stroke,tile}` to `src/styles/_variables.scss`
(light and dark) and point the kit at them, so the SVG exports and the HTML component read
from one place, and a lint can check new Figma exports against the list.

**Status: under review.** The component ships for the simple case only, and the direction is
still open. The Figma export round-trip is a burden, so the intent is to move toward HTML as
the source for diagrams, which also makes them responsive. What that needs, in order:

1. **Now — simple rows.** `.schema` as it is: one or two linear rows, boxes and arrows, seven
   families, optional dotted grid. Good enough for a release post and for anything a pipeline
   or a before/after can express.
2. **Next — layered diagrams in HTML.** A grid variant where rows are CSS grid tracks, boxes
   can span and group (a labelled group box around several nodes), and edges are limited to
   straight horizontal or vertical arrows between neighbours. That covers most of the 35
   gridded docs diagrams without free-form edges. Rows wrap on phones instead of scaling down.
3. **With it — a lightbox for complex ones.** The blog already opens images in an overlay;
   the docs' ImageGallery does the same for image pairs. HTML diagrams need the same affordance
   on small screens: clone the diagram's DOM into the overlay and scale it to fit, with the
   same close and keyboard handling. One implementation should serve images and HTML alike.
4. **Later — one source for both targets.** Free-form diagrams (many edges, spatial layout)
   stay in Figma until there is a diagram source that renders to both HTML and SVG. A small
   JSON description (nodes, families, groups, edges) rendered by one script is the realistic
   route; it is also what would let the docs stop exporting from Figma. Not started.

Until then, the rule is by complexity: linear or layered-with-straight-edges in HTML
(`.schema`, later its grid variant); spatial or many-edged from Figma as a light/dark SVG
pair. `.schema-wrap--grid` adds the docs' dotted grid behind an HTML diagram when it has
more than one row or sits next to an exported SVG; plain `.schema-wrap` is the default.

Markup:

```html
<div class="schema-wrap">                       <!-- add schema-wrap--grid for the dotted bg -->
  <div class="schema" role="img" aria-label="Device → Integration Executor → Rule Engine">
    <div class="sbox sbox--grey"><span class="stile">[svg]</span>Device</div>
    <svg class="sarrow sarrow--grey" viewBox="0 0 26 12"><path d="M1 6h23M19.5 1.5 24 6l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div class="sbox sbox--purple"><span class="stile">[svg]</span>Integration Executor</div>
    …
  </div>
</div>
```

Families: `grey blue teal purple yellow green pink`, on both `.sbox--` and `.sarrow--`. The
arrow takes the family of the box it leaves. `.stile--48` is the same tile at card-icon size,
so icon cards and diagrams share one palette.

## Image pipeline

Originals arrive as one zip per post (`GUIDE.md`, "Delivering sources") and stay out of
git. Per post there is an `images.json` manifest next to the page; `raw` is that zip, read in
place with members matched by file name, or a folder of originals:

```json
{ "html": "index.html", "raw": "thingsboard-4-4-sources.zip", "out": "images",
  "images": [
    { "raw": "agent 1.png", "out": "agents-list.png" },
    { "raw": "dash_2.png",  "out": "dash-filter.png", "crop": [30, 29, 696, 537], "note": "dialog only" }
  ] }
```

`tools/prepare-images.py examples/<post>/images.json` crops each original (`crop` is left, top,
width, height in source pixels), writes it to `out`, and sets `width`/`height` on every `<img>`
that references it, adding the attributes when a hand-written tag lacks them. `html` can be a
list of pages when more than one shows the same files (the demo reuses the 4.4 screenshots), so
their sizes cannot drift. The processed images are committed, so a page renders without the
originals; rerun after replacing one or changing a crop.

`patch` is a list of rectangles painted before the crop, each `[left, top, width, height]` in
source pixels with an optional `"#rrggbb"` fifth item; without it the rectangle takes the colour
of its own top-left pixel, which is the surface around what it hides as long as the rectangle
has a margin. It is the baked-in form of the page's `.patch` overlay: overlay while the post is
in review, manifest entry once it settles. To convert, take the overlay's percentages of the
output image, multiply by its size, and add the crop offset:

```json
{ "raw": "dash_2.png", "out": "dash-filter.png", "crop": [30, 29, 696, 537], "patch": [[278, 266, 200, 31]] }
```

Cropping guidance (the rules are in `GUIDE.md`, 2.1): crop at natural boundaries and never
through an element; take a dialog two pixels inside its edge so no backdrop survives the
rounding; drop any stroke or contrast line that lands on the crop edge; keep enough of the
surrounding UI that the screen is recognisable.

On the real site these PNGs go through Astro's image pipeline like any other blog image
(WebP, 2x `srcset`); the prototype serves PNG only because it has no build.

## Video pipeline

Short looped screen recordings replace screenshots where a feature is an interaction (a
search-as-you-type, a drag; `GUIDE.md`, 3.2). Like the images, clips are driven by a manifest
next to the page, `videos.json`, so a crop or a trim is recorded and reproducible rather than
typed once:

```json
{ "html": "index.html", "raw": "video/raw", "out": "video",
  "videos": [ { "raw": "search.mov", "out": "search", "trim": "0-12.5", "note": "cut before the cursor leaves the frame" },
              { "raw": "window.mov", "out": "window", "crop": "1390:886:108:74", "note": "the app window only" } ] }
```

`tools/prepare-videos.py examples/<post>/videos.json` runs the encoder below for each entry
(`crop` as `w:h:x:y`, `trim` as `start-end` seconds, `maxWidth` default 1600; `raw` is a folder
or the sources zip) and writes the clip's size to the `<video>` that carries its poster. The
encoder is one shell script, usable on its own:

```
tools/prepare-video.sh clip.mov examples/<post>/video/name [max-width] [crop] [trim]
```

What it does, and why:

1. **Crop** (optional, `w:h:x:y`, or `-` to skip) to the app window: a macOS recording with the
   desktop wallpaper around it should lose the wallpaper here, not in the post. **Trim**
   (optional, `start-end` in seconds, either side open) drops a slow start or a cursor dash at
   the end, so the raw recording stays untouched.
2. **Scale** to at most 1600px wide (2x the column), even dimensions, **30 fps**, `yuv420p` so
   Safari plays it.
3. **Strip audio** (`-an`): a looped UI clip never has sound, and a muted autoplay is the only
   kind browsers allow.
4. **H.264** `crf 26`, `preset slow`, `+faststart` so playback starts before the download ends.
5. **VP9 WebM** as a second source; usually smaller, listed first so capable browsers pick it.
6. **Poster** from the first frame, WebP when the local ffmpeg has it, JPEG otherwise; the page
   is complete before the video loads and `prefers-reduced-motion` users see only this.

Results for the sample clip: source 1.57 MB → MP4 1.24 MB, WebM 1.17 MB, poster 146 KB (the source was
already a 640 kbps H.264, so the gain here is in stripping audio and in the poster; a raw
QuickTime capture shrinks 5–10x). Budget: keep a clip under 2 MB and 20 s; if it does not fit,
shorten or crop before lowering quality.

Recording guidance: capture at 2x the area you want shown, no cursor wandering, no
notifications, and **end on the frame you started on** so the loop is seamless.

Markup:

```html
<figure>
  <div class="shot">
    <video autoplay muted loop playsinline preload="metadata" poster="video/name.jpg" width="1600" height="1008">
      <source src="video/name.webm" type="video/webm">
      <source src="video/name.mp4" type="video/mp4">
    </video>
  </div>
  <figcaption>…</figcaption>
</figure>
```

A clip is a `.shot` whose child is a `<video>`, so it is placed like a screenshot: on its own it
takes the column (a window recording that frames itself); inside a `.panel` it gets the panel's margin and gradient, which
is how a recording with no browser bar gets a frame: `--wide` for a whole screen, the default
width for a region the size of a dialog.

`kit.js` pauses the clip when it scrolls out of view and, under `prefers-reduced-motion`,
removes autoplay and shows a play button over the poster. A post's encoded clips are
committed with it, like its images (a 14 s dialog-sized clip is about 400 KB in three files); raw
recordings and the demo's clips are ignored, and `prepare-videos.py` regenerates any clip
from its manifest.

## The prototype artifact

`tools/build-prototype.py <out-dir>` assembles the 4.4 page, the demo and the guide with
`kit.css`, `kit.js` and all media into one flat folder, adds a "Prototype" strip linking the
three, and rewrites the relative paths. That folder is what gets published as the shared
artifact; anyone with the branch can rebuild it.

## Authoring guide

`GUIDE.md` is the draft of the guide for the people who write posts and shoot the product:
browser setup and capture size, data hygiene, video recording, cropping and annotation rules,
which component fits which content, and how to deliver source files for the pipeline. It is
written to be moved into the site's contributor docs once agreed. `tools/build-guide.py`
renders it to `examples/guide.html` (no dependencies; rerun after editing) so it reads next
to the demo and ships in the prototype artifact.

## What the blog uses today, and what the kit answers with

A survey of the 51 posts (`src/content/blog`) and the template (`src/pages/blog/[...slug].astro`,
`src/components/Blog/`) found, beyond what the kit already covers:

| In the posts | How many | Today | Kit |
|---|---|---|---|
| Notes and tips | 13 posts as bold "Tip:" paragraphs, 1 with `BlogNote`/`BlogCallout` | three ways, one of them a 4 %-tint blockquote | `.note`, `.note--warn` |
| Quotes (pull, customer, partner) | 7 posts | the template's blockquote, which looks like a note | `.quote` |
| Text beside image rows | 2 posts | raw `<div style>` grids, gradients and 12px radii inline | `.feature`, `.feature--flip`; `.grid` of blocks for the two-column ones |
| Tables | 2 posts, plus one shipped as a screenshot | styled by the template, no scroll wrapper, break the column on phones | `.table-wrap`, `.table--compare` |
| "Step N" sequences | 5 posts as `###` headings, 13 with numbered lists | headings | `.stepper` (short) and `.stepper--vertical` (with visuals) |
| Interviews | 2 posts | bold "Q:" paragraphs | `.qa` |
| Release-post structure | 9 posts | intro, one `##` per feature, "Final thoughts"; nothing lists what is in the release | `.glance` after the intro, `.cta` at the end |
| A single button in the text | 1 post | `BlogButton`, inline-styled with hover handlers | `.btn` |
| Image captions | 1 `<figure>`, 1 plain paragraph, 0 of the template's italic rule | three ways, mostly none | the kit's `<figure>` + `<figcaption>`, or a block heading beside the visual |
| Two images side by side | 1 post | inline flex | `.grid` of two `.shot`s |
| YouTube | 2 posts | `YouTubeVideo` with consent | keep; a `.shot` with a `<video>` is for self-hosted loops only |
| Code blocks | 5 posts | Expressive Code | nothing to add |
| Downloads | 2 posts | `<a download>` | nothing to add; a link |

Also found, for the editor rather than the kit: the bold lead-in in list items uses three
separators (`**X**:`, `**X:**`, `**X** —`); emoji headings and UTM-tagged docs links appear in
one release post only; the lightbox binds every `.blog-content img`, including the YouTube
poster and decorative images, which `data-no-lightbox` would fix once it is in the template.

The review rows above are in `kit.css` under "FOR REVIEW" and in the demo under the same
heading; none is used in a post. Keep, drop or merge them before they are integrated.

## Adding a component

Keep the kit small. Before adding a pattern, check whether `.grid` + `.block` with one of the
existing visuals covers it. When something new is needed: one section comment in `kit.css`
that names the pattern and its markup, tokens for every colour with the two dark blocks, a
demo in `examples/kit-demo.html`, and a row in the table above.

**Added on request, with a reservation.** `.compare--vertical` turns the divider horizontal
(drag up and down): six lines of CSS and an axis switch in `kit.js`. The product's screens are
laid out in columns (sidebar, content, settings pane), so the default divider dragged sideways
cuts between regions and compares like with like; a horizontal one cuts through every widget
in a row and compares nothing cleanly. It is there for the one case it fits, a toolbar or a
header row that changed; two different screens side by side remain a `.grid` of two blocks.
