# Authoring guide

For the people who write release posts and shoot the product, and for whoever processes the
captures with the kit's pipelines. The components themselves are documented in `README.md`;
this is about what goes into them. Items marked **Decide** need a call before the guide is
final.

Three roles, so the guide is in three parts:

1. **Shooting** — the author (or whoever has the demo environment) captures screens and clips.
2. **Processing** — crops, rings, patches, the manifest; done by design or by the pipeline.
3. **Choosing** — which visual, where, with what text; the author and the editor together.

Then how to deliver sources, and a pre-publish checklist.

## The short version

For the author who shoots once a release. The rest of the guide is for whoever processes.

- Chrome, light theme, English, the demo tenant with real-looking data, no empty states, no
  notifications, nothing real (emails, keys, customers).
- Viewport 1280 × 800, DPR 2 if you can (DevTools device mode gives it on any monitor), zoom
  150 % with the compact sidebar, 125 % only when the full sidebar must be in frame, higher
  for a dialog you will have cut out. Never the browser chrome.
- Shoot whole screens and whole dialogs; do not crop, ring, patch or resize. The pipeline does
  that from the originals.
- A clip only when the motion is the point: one interaction, 5–20 s, slow cursor, start and
  end on the same screen, as recorded.
- Deliver one zip, `<post>-sources.zip`, with `images/`, `video/` and a `visuals.md` (template:
  `examples/visuals.template.md`) that says what each capture shows and what matters in it,
  and the build it was shot on.

Typography in this guide: bold opens a rule, italic marks an inline highlight (a UI name, a
*Best / Acceptable / Not* label, a menu entry), code marks a file or a class. **Decide**
whether that convention carries into the contributor docs.

Where it should live once agreed: next to the blog authoring docs in the site repo (the
`edit-doc` skill for docs has the same role), linked from the post template. **Decide.**

---

## 1. Shooting

### 1.1 Set up the browser once

- **Chrome, light theme, English UI.** The kit shows light screenshots on both page themes,
  so one capture serves both. Hide scrollbars where the OS draws them (Windows draws 17px grey
  ones; macOS overlay scrollbars are invisible until you scroll).
- **Retina (2x) is the best case, not a requirement.** *Best:* a 2x capture, which stays sharp
  on a retina reader's screen after scaling to the column. For screenshots this does not need
  a retina display: DevTools device mode renders at the device pixel ratio you set, so DPR 2
  on any monitor gives a 2x file. Recordings follow the physical display, so a 1x monitor
  records 1x. *Acceptable:* a 1x capture at least a third wider than the slot it fills (a
  1280px capture for the 828px column), so it is scaled down and never up; it reads a little
  soft on retina and opens in the lightbox at its real size. A 1x capture cannot be made sharp
  later, so when in doubt capture larger.
- **Capture the viewport only, never the browser.** For screenshots the clean way is Chrome
  DevTools device mode: add a custom device with the width and height below and a device pixel
  ratio of 2, then *Capture screenshot* from the device toolbar's menu. It writes a PNG of
  exactly the viewport at 2x, with no browser bar, no cursor, the same size every time, and
  needs no extension. For recordings, which DevTools cannot do, remove the browser chrome
  instead: in Chrome on macOS, ⌃⌘F enters full screen and hides the tab strip and toolbar
  (keep the pointer away from the top edge or they slide back in), or open the app as a
  window with no address bar (chrome://apps → right-click → *Open as window*, or *Install
  page as app* from the ⋮ menu). ⌘⇧B hides the bookmarks bar on a normal window.
- **Window resizer extensions** are a convenience, not a need: device mode sets the exact size.
  If one is wanted, several unrelated extensions share the name "Window Resizer"; pick one
  that is open source and asks only for the windows permission, and check that in the store
  listing before installing. **Decide** whether to recommend one by name.
- **No noise.** No notification badges (clear the demo tenant's bell first), no browser
  extensions' injected UI, no DevTools panel inside the capture, no
  cursor unless it is the subject of a clip, no hover states left on by accident, no tooltips
  unless the tooltip is the point.

### 1.2 Size and zoom

The article column is 828px wide. A full-width screenshot is scaled to that, so legibility is
about how big the UI text ends up on the page, and sharpness is about how many pixels the file
has. Treat them separately: zoom sets the text size, the device pixel ratio sets the pixel
count. Capture at DPR 2 whenever you can (1.1), so a 1280 × 800 viewport yields a 2560 × 1600
file at every zoom below; that is what keeps the image sharp on retina and gives the lightbox
real pixels to show. Two numbers then pull against each other: rendered text size is 14px × zoom × 828 / capture width, and the laid-out
width is capture width / zoom. Text at 12px or more therefore means a layout of about 960
logical px or less, which is narrower than a whole screen with the full sidebar wants. So the
rule is a range, chosen by how much of the screen is in the frame:

| What you are showing | Viewport (CSS px) | Chrome zoom | Result in the column |
|---|---|---|---|
| A whole screen with the full sidebar in frame | 1280 × 800 | 125 % | the only zoom where the sidebar stays expanded; text ≈ 11px, the floor; the lightbox has the rest |
| A whole screen, compact sidebar (the default for dashboards and list pages) | 1280 × 800 | 150 % | the content area still fits; text ≈ 13.5px |
| The content area only, sidebar cropped out later | 1280 × 800 | 150–175 % | the crop is shown near full width; text 13–15px |
| A dialog or a detail, cut out later | 1280 × 800 | 175–200 % | the crop is shown near 1:1, text 14px+ |
| Before/after pair | identical for both | identical | the slider needs the same scale and scroll position |

*Best:* 150 % with the compact sidebar for anything that is not about the sidebar; the full
sidebar only when the sidebar is the subject. *Acceptable:* 125 % when the full sidebar has to
be in frame; the text sits at the 11px floor and the lightbox carries the detail. *Not:* below
125 % for a full-width capture, or a zoom at which the layout collapses (check that the page
still lays out as a desktop page; if it does not, drop a step). One viewport and one zoom per
kind of capture, so screens look like one product. 16:10 (1280 × 800) is the ratio for whole
screens; dialogs are whatever they are; crops should land between 3:2 and 16:10 and never
taller than wide when they take the column.

### 1.3 Data on the screen

- **Use the demo tenant with its realistic names**: *Smart office*, *Thermostat T1*, *Energy
  meter*, recent timestamps, populated widgets. Never `test`, `asd`, `qwerty`, `Device 1`,
  lorem ipsum, or an entity named after a colleague.
- **No empty states** (*No alarms found*, *No data*, dashed drop zones) unless the empty state
  is the subject. Fill the screen before shooting; a dashboard with data is the product, an
  empty one is a form.
- **No real anything.** No customer names, emails, phone numbers, IP addresses, API keys,
  tokens, license keys, or browser profile avatars. The demo user (`tenant@thingsboard.org`)
  is fine. If something real slipped in, re-shoot; patching is for a stray line, not for
  redaction.
- **No error states** unless the feature is about them: no red validation text, no toasts, no
  stale "unsaved changes". A realistic Critical alarm row is fine.
- **Keep third-party attribution in frame.** Map tiles (OpenFreeMap, OpenStreetMap) carry an
  attribution line in the widget corner; crop so it stays, and do not patch it.
- **Shoot the release build**, not a dev build: no debug badges, feature flags, or *NEW* tags
  that will not ship. **Decide:** whether *NEW* menu badges are wanted in release-post captures.

### 1.4 Recording a clip

- **One interaction per clip, 5–20 seconds, 30 fps**, 2x where the display allows (1.1), the
  viewport only (full screen or app window, see 1.1). The pipeline scales to 1600px wide and
  strips audio; a clip over 2 MB after processing is shortened, not degraded.
- **Loop point.** Start and end on the same screen, hold still for about a second at both ends.
  A loop that jumps reads as a glitch.
- **The cursor is the narrator.** Move it slowly and in straight lines, pause before clicking,
  never circle or shake it to "point". Keep it out of the frame when it has nothing to do.
- **No typing character by character**: paste, or type a short term and let the result be the
  point. When typing is the feature, keep it to a word.
- **No scrolling** unless the scroll is the feature; scroll jitter is the first thing a viewer
  notices.
- **Tools:** macOS ⌘⇧5 (choose *Record Selected Portion*, drag to the window) is enough.
  Screen Studio or CleanShot add cursor smoothing and are fine but not required. Deliver the
  `.mov` as recorded, slow start and all: the trim is a manifest entry, so the raw file stays
  whole and the cut can move (`README.md`, "Video pipeline").

---

## 2. Processing

### 2.0 Reading a delivery

Captures are not labelled by the author; the processor reads them. `tools/inspect-captures.py
<folder or zip>` prints, for each file, the pixel size, the likely device pixel ratio, whether a
dimmed backdrop surrounds the subject (a dialog on its page), whether a sidebar column sits on
the left and which kind, the text size the capture would reach in the column, same-size pairs
(a before/after candidate), and a suggested slot. It is a starting point for `images.json`,
read from pixels, and it is wrong sometimes: a composite or an unusual crop comes out as "look
at it". The `visuals.md` in the zip says what each capture shows and what matters in it; the
inspector says what it is.

### 2.1 Cropping

- **Crop at natural boundaries**: the edge of a dialog, a card, a widget, a panel. Never
  through a control, a label, or a stroke, and never so that a 1px line (a border, a dimmed
  backdrop) survives on the crop edge. Dialogs are cut two pixels inside their edge so no
  backdrop survives the rounding.
- **Keep enough context** that the screen is recognisable (a dialog's title bar, a widget's
  header), and drop what carries nothing (the sidebar when the subject is the content area, the
  top bar, scrollbars).
- **Never upscale.** The page scales down; a 1x capture that is too small for its slot gets a
  lightbox, not interpolation. No sharpening, no re-encoding before the pipeline.
- **Even dimensions** for anything that becomes a video; the encoder needs them.
- Where each crop goes is in 3.1; the crop is made for the slot, not the other way round.

### 2.2 Rings

A ring marks the one element the reader has to find. Use it when the subject is a small part
of a large screen (a menu entry, a switch, a button in a toolbar) and the paragraph cannot
point to it by position alone.

- **One ring per image.** If two things need marking, that is two images or one crop.
- **Not on a crop that already isolates the subject**: a dialog on a panel is the subject; a
  bleed panel is the subject. The ring is for the needle, not the haystack.
- **Pill for pill-shaped controls** (`.ring--pill`), rectangle for everything else. The ring
  is drawn 8px outside the element with a wide glow so it reads as an annotation, not a focus
  state; do not tighten it.
- Never combine a ring with an arrow, a number, or bold text in the caption pointing at the
  same thing. Text inside images is not done at all: the caption and the paragraph do the
  explaining, which also keeps the image translatable and accessible.

### 2.3 Patches

A patch paints over a region with the surface colour. It is a last resort: a stray validation
line, a tooltip that would not close, a badge that will not ship. Re-shooting with the right
data is always better.

- Never patch to change what the product does or to redact real data (re-shoot instead).
- Give the rectangle a margin around what it hides; the pipeline samples the surface colour
  from the rectangle's top-left corner.
- While a post is in review the patch is a `.patch` overlay in the page, so a reviewer can
  see it; once it settles, the same rectangle moves into `images.json` and is baked into the
  asset, so the lightbox shows the fix too (`README.md`, "Image pipeline").

### 2.4 Zoom insets

There is no magnifier in the kit. *Best:* crop the detail into a panel and let the paragraph
say where it lives on the screen; the panel is the zoom and works at every width. If a real
inset (a region of the shot magnified in its corner, with a ring on the source) turns out to
be needed, it is a kit addition with its own rules and a convincing example, not a per-post
composition. **Decide.**

---

## 3. Choosing the visual

### 3.1 Which component for what

| You want to show | Use | Not this | See it |
|---|---|---|---|
| A screen or a state | `.shot`, column width | a mock-up, a Figma frame | [Screenshot](examples/kit-demo.html#shot) |
| A small element on a big screen | `.shot` + one `.ring` | two rings, an arrow | [Screenshot](examples/kit-demo.html#shot) |
| A dialog or a detail | `.panel` (`--dark` for at most one per section) | a full screen with the dialog lost in it | [Panel](examples/kit-demo.html#panel) |
| A whole screen captured without the browser frame | `.panel--wide` in a full-row block | the same screen unframed; it floats | [Panel](examples/kit-demo.html#panel) |
| A capture whose own background frames it | `.panel--bleed` | a shadow and a lightbox on top of it | [Panel](examples/kit-demo.html#panel) |
| An interaction (drag, search-as-you-type, navigation) | a clip in a `.shot`, on its own or on a panel | three screenshots of the steps | [Looped clip](examples/kit-demo.html#video) |
| The same screen before and after a redesign | `.compare`, identical size and scroll position | two screenshots side by side | [Before and after](examples/kit-demo.html#compare) |
| Parallel, text-only items (API additions) | `.grid.grid--tight` of `.card--icon`, two columns | cards for things that have a screenshot | [Cards](examples/kit-demo.html#cards) |
| A sequence where the order is the information | `.stepper` for 3–4 short steps, numbered `.card--muted` for longer ones | a bulleted list pretending to be steps | [Steps](examples/kit-demo.html#steps) |
| A data flow or a pipeline | `.schema`, one or two rows | a screenshot of a diagram | [Diagram](examples/kit-demo.html#schema) |
| Values to compare (versions, limits, support) | a table | a paragraph of numbers | [Table](examples/kit-demo.html#table) |
| Features with a visual each, side by side | `.grid` of `.block`s, two columns | three columns of screenshots | [Layouts](examples/kit-demo.html#grid) |
| The ask at the end | `.cta`, once | a CTA per section | [Call to action](examples/kit-demo.html#cta) |

### 3.2 Screenshot, clip or slider

The default is a screenshot. A clip costs five to ten times the bytes, autoplays, and asks
for attention a still does not; it earns that only when the still cannot carry the point.

**A screenshot** when the feature is a state: a new page, a setting, a dialog, a result, a
chart, anything the reader needs to *read*. Text in a still is legible and stays put; in a
clip it is gone before the eye gets there. A still also prints, opens at full size in the
lightbox, and shows the same thing to everyone.

**A clip** when the feature is a motion, and the motion is the information:

- an interaction the reader will perform: a drag (resizing a panel, reordering widgets),
  search-as-you-type, switching a mode and watching the layout respond;
- a sequence of three or more states where what matters is that they follow each other,
  and three screenshots would make the reader reconstruct the motion;
- an animation or transition the product itself makes, when it is the feature;
- speed or smoothness, when that is the claim.

**A slider** when the same screen exists in two versions and the point is the difference:
before/after of a redesign, two modes of one layout. Same capture size and position for both.
The default divider is vertical and drags sideways; the horizontal one (`--vertical`) exists
for a toolbar or a header row that changed and is otherwise not the one to pick, since it cuts
through every widget in a row.

**Not a clip** when the motion is incidental (a dialog opening, a page loading), when the
clip would need narration to be understood (there is no audio), when the content changes
faster than it can be read, or when the clip would just pan across a still.

The test: pause the clip anywhere. If every frame is a screenshot you would have used, use
the screenshot. If the point lives between the frames, it is a clip. Either way, at most two
clips in a post, each with a poster so it degrades to a still.

Budget for the whole post: under 6 MB of media before the site's optimisation, which about
halves images and leaves clips alone. Both pipelines print their totals. Over budget, drop a
visual or shorten a clip; do not lower quality.

Never a GIF: large, 256 colours, no pause, no poster. The video pipeline produces a loop that
looks like a GIF and weighs a tenth of one.

### 3.3 Rules

Each rule states the best case first, then what is acceptable when the best is out of reach,
then what is not done.

#### Rhythm

- **One visual per section**, after the paragraph that says what to look at. *Acceptable:*
  two, as a pair of grid blocks with their own headings. *Not:* visuals back to back with no
  text between them; a gallery gets skimmed.
- **Every screen appears once.** *Acceptable:* the same screen twice when the second is a
  different crop with its own point. *Not:* the same dashboard in three sections.
- **At most two clips in a post**, and a slider only for a real pair (3.2). *Not:* a clip
  where a still would do, or a slider for two different screens.

#### Text beside the visual

- **A list of features is a grid of tiles**: a short heading, one sentence and a visual per
  block, two columns. *Acceptable:* text-only cards with an icon tile when there is nothing
  to show. *Not:* three columns of screenshots, or a visual with no sentence beside it saying
  why it is there.
- **The paragraph says what to look at; the caption, if any, says where.** *Acceptable:* no
  caption when a block heading sits beside the visual. *Not:* a caption that restates the
  paragraph, a bold lead-in, or a heading inside a caption.
- **Alt text on every image**: one sentence saying what the screen shows and, when there is
  a ring, what is marked. *Acceptable:* the caption's wording, when there is a caption.
  *Not:* "screenshot of", the feature name alone, or an empty alt on a content image.

#### Surfaces

- **A cut-out goes on a panel.** A dialog, a detail, or a whole screen or clip captured
  without a browser frame sits on a `.panel`; a window capture that frames itself takes the
  column bare. *Acceptable:* a bare shot for a small detail when the section already has two
  panels. *Not:* a dialog floating on the page with nothing but a shadow, or a panel around
  a full-width capture that did not need one.
- **Light panels, with one dark per section as the highlight.** *Acceptable:* no dark panel
  at all. *Not:* a section where every panel is dark; there is no highlight left.
- **No chrome beyond the panel**: blocks with nothing around them; cards only for a repeated
  unit the border groups. *Acceptable:* a bordered card grid for API-style items. *Not:*
  fills, a card around a shot, or a panel inside a card.

#### Captures

- **One tenant, one zoom, one window size, light theme** for every capture in a post.
  *Acceptable:* a higher zoom for a detail that is cut out and shown near 1:1. *Not:* 1x and
  2x captures of the same screen, or two themes in one post.
- **The real product screen, as captured.** *Not:* mock-ups, composites of two screens
  pasted together, or text, arrows and numbers baked into the image. When two things have to
  be seen together, that is a grid of two blocks, a before/after, or a clip that moves from
  one to the other.

### 3.4 The cover image

The post's `featuredImage` is the listing card and the social preview; its spec (size,
template, where the product shot goes on it) is not in this kit. The 4.3 post's cover is
`public/images/blog/<slug>/cover.webp` at 2560 × 1135 (a 2x 1280 × 567 card). **Decide:**
whether covers get a template in the kit or stay a design deliverable.

---

## 4. Delivering sources

What the pipeline needs:

- **One zip per post**, `<post-slug>-sources.zip`, with `images/` and `video/` inside.
  Originals only: PNG at the captured resolution, uncropped, unannotated, uncompressed;
  `.mov` or `.mp4` as recorded (trimmed at the ends is fine). A zip is one file, so any
  channel moves it intact, and the image pipeline reads it in place: `raw` in the post's
  `images.json` points at the zip and nothing is unpacked by hand. A shared folder is where
  an author collects captures, not how they are handed over: files cannot be pulled out of
  one as files without a download step each, and its *Download all* produces a zip anyway.
  *Acceptable:* the shared folder itself, when whoever processes the post has it mounted with
  Drive for desktop and points `raw` at the mounted path. *Not:* images pasted into a
  document (editors recompress them), or loose files in a chat thread.
- **One file per visual, named for its slot**: lowercase, hyphens, `section-subject.png`:
  `agents-list.png`, `agents-install-dialog.png`, `dash-filter-dialog.png`. Pairs share a stem
  with a suffix: `ui-old.png` / `ui-new.png`, `sidebar-full.png` / `sidebar-compact.png`. A
  name that says what the capture is saves a round of questions; a number does not.
- **A `visuals.md` in the zip, next to the copy.** Each slot in reading order, with the file,
  the treatment and the caption if wanted: `agents-list.png — ring the Agents menu entry`,
  `goto.mov — clip on a panel`, `sidebar-full.png / sidebar-compact.png — before/after`.
  *Acceptable:* the slots inline in the draft MDX on a branch, where the images will go, when
  the author works in the repo. *Not:* placeholder lines in a shared document; that was tried
  once and the copy and the files drift apart.
- **Replacing a capture**: a new zip with a date suffix (`…-sources-2026-10-09.zip`), the full
  set again under the same names, and a line in `visuals.md` saying what changed, so the crop
  and the ring can be checked rather than redone. Point `raw` at the new zip and rerun.
- **What the author does not do**: crop, ring, patch, resize, convert, or compress. All of
  that is the manifest (`images.json`) and the pipeline, so it is reproducible and reviewable,
  and so the raw capture is there when a crop has to change.
- **When the UI changes after the capture.** Release posts are shot on a release candidate,
  and screens change before the release. The visuals list names the build each delivery was
  shot on. Any screen whose layout, labels or colours changed after that build is re-shot
  before publishing; a screen that merely gained data behind it is not. The release manager
  decides which screens changed, the author re-shoots them with the same viewport and zoom, and
  the pipeline reruns on the new zip. *Not:* patching a changed label, or publishing a capture
  of a build the reader will never see.
- The processed set is committed with the post; the zip stays out of git, in the post's
  shared folder. **Decide** whether that folder is the default home for the zip or whether
  sources go somewhere versioned.

---

## 5. Before publishing

- Every `<img>` has `width`, `height` and `alt`; every clip has a poster and `width`/`height`.
- No real data, no empty states, no error text, no browser chrome, attribution kept on maps.
- Patches are baked and the overlays removed; the lightbox opens the fixed file.
- One zoom and window size across the post; before/after pairs line up.
- Clips loop cleanly, are under 2 MB each, and there are no more than two; the post's media is
  under 6 MB in total (the pipelines print it).
- Every screen is from the build the post describes; screens that changed after the capture
  were re-shot.
- Captions short, no bold lead-ins; the paragraph before each visual says what to look at.
- Dark theme checked (panels, cards, diagram), phone width checked (grids stack, stepper
  vertical, sliders still draggable).
- CTA links resolve; the author byline is real.

---

## Changelog

Drafts are dated here; the section goes when the guide is adopted into the contributor docs.

- **2026-10-09** — first draft, from an outline that had capture quality, aspect ratio, data,
  cropping and annotation, component choice and delivery. Added: the chrome-free capture route
  (device mode, full screen, app window); zoom and DPR as separate concerns, with the zoom rule
  as a range by framing; privacy and third-party attribution; alt text and captions as
  accessibility; a screenshot-versus-clip rule with a test; recording rules (loop point,
  cursor); no text in images, no composites; one visual per section, two clips per post; one
  zip per post with a visuals list inside, and a template for it; captures read by the
  inspector rather than labelled by the author; a re-shoot policy; a media budget; the dark
  panel as the highlight; retina as the best case; the short version; a pre-publish
  checklist. Open decisions carry a badge.

Sources checked for the general rules: Google's developer documentation style guide on images
(use them sparingly, crop to what matters, alt text, no personal data), New Relic's
image-annotation guide (callouts clear of the element, almost never text in the image), and
Chrome's device mode documentation (custom device size, DPR, viewport capture).
