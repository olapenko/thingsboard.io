# Visuals for blog posts — authoring guide (draft)

For the people who write release posts and shoot the product, and for whoever processes the
captures with the kit's pipelines. The components themselves are documented in `README.md`;
this is about what goes into them. Items marked **Decide** need a call before the guide is
final.

Three roles, so the guide is in three parts:

1. **Shooting** — the author (or whoever has the demo environment) captures screens and clips.
2. **Processing** — crops, rings, patches, the manifest; done by design or by the pipeline.
3. **Choosing** — which visual, where, with what text; the author and the editor together.

Then how to deliver sources, and a pre-publish checklist.

Where it should live once agreed: next to the blog authoring docs in the site repo (the
`edit-doc` skill for docs has the same role), linked from the post template. **Decide.**

---

## 1. Shooting

### 1.1 Set up the browser once

- **Chrome, light theme, English UI, on a retina (2x) display.** The kit shows light
  screenshots on both page themes, so one capture serves both. On Windows, set display scaling
  to 200 % and hide scrollbars (Windows draws 17px grey ones; macOS overlay scrollbars are
  invisible until you scroll). The 4.4 captures were 1x with Windows scrollbars, which is why
  they needed a lightbox.
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
- **No noise.** No notifications (clear the demo tenant's bell; the 99+ badge shows in one 4.4
  capture), no browser extensions' injected UI, no DevTools panel inside the capture, no
  cursor unless it is the subject of a clip, no hover states left on by accident, no tooltips
  unless the tooltip is the point.

### 1.2 Size and zoom

The article column is 828px wide. A full-width screenshot is scaled to that, so what matters
is how big the UI text ends up on the page, not how many pixels the file has. The rule:
**UI text in the post should render at 11px or larger.** ThingsBoard's body text is 14px, so a
full-width capture should be at most about 1050 CSS pixels wide, or it must be cropped.

| What you are showing | Viewport (CSS px) | Chrome zoom | Result in the column |
|---|---|---|---|
| A whole screen, full width | 1280 × 800 | 125 % | 1024px of UI scaled to 828: text ≈ 11px |
| A whole screen on a wide panel | 1280 × 800 | 125 % | about 10px; the lightbox has the rest |
| A dialog or a detail, cut out later | 1280 × 800 | 150–200 % | the crop is shown near 1:1, text 14px+ |
| Before/after pair | identical for both | identical | the slider needs the same scale and scroll position |

Check that the sidebar stays expanded at the zoom you pick; if the layout collapses, drop to
110 %. One window size and one zoom per post, so screens look like one product. 16:10
(1280 × 800) is the ratio for whole screens; dialogs are whatever they are; crops should land
between 3:2 and 16:10 and never taller than wide when they take the column.

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

- **One interaction per clip, 5–20 seconds, 30 fps, 2x**, the viewport only (full screen or
  app window, see 1.1). The pipeline scales to 1600px wide and strips audio; a clip over 2 MB
  after processing is shortened, not degraded.
- **Loop point.** Start and end on the same screen, hold still for about a second at both ends.
  A loop that jumps reads as a glitch.
- **The cursor is the narrator.** Move it slowly and in straight lines, pause before clicking,
  never circle or shake it to "point". Keep it out of the frame when it has nothing to do.
- **No typing character by character**: paste, or type a short term and let the result be the
  point (the Go to… search is the exception, where typing is the feature; keep it to a word).
- **No scrolling** unless the scroll is the feature; scroll jitter is the first thing a viewer
  notices.
- **Tools:** macOS ⌘⇧5 (choose *Record Selected Portion*, drag to the window) is enough; trim
  the ends in QuickTime (Edit → Trim) before delivering. Screen Studio or CleanShot add cursor
  smoothing and are fine but not required. Deliver the `.mov` as recorded; the pipeline does
  the rest (`README.md`, "Video pipeline").

---

## 2. Processing

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

A ring marks one element the reader has to find. Use it when the subject is a small part of a
large screen (a menu entry, a switch, a button in a toolbar) and the paragraph cannot point to
it by position alone.

- **One ring per image.** If two things need marking, that is two images or one crop.
- **Not on a crop that already isolates the subject**: a dialog on a panel is the subject; a
  bleed panel is the subject. The ring is for the needle, not the haystack.
- **Pill for pill-shaped controls** (`.ring--pill`), rectangle for everything else. The ring
  is drawn 8px outside the element with a wide glow so it reads as an annotation, not a focus
  state; do not tighten it.
- Never combine a ring with an arrow, a number, or bold text in the caption pointing at the
  same thing. Text in images is not done at all: captions and the paragraph do the explaining,
  which also keeps the image translatable and accessible.

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

There is no magnifier or "zoom box" in the kit. When a detail is too small to read, crop it
into a panel and let the paragraph say where it lives on the screen; the panel is the zoom.
If a real inset (the detail enlarged over the full screen) turns out to be needed, it is a kit
addition with its own rules, not a per-post composition. **Decide.**

---

## 3. Choosing the visual

### 3.1 Which component for what

| You want to show | Use | Not |
|---|---|---|
| A screen or a state | `.shot`, column width | a mock-up, a Figma frame |
| A small element on a big screen | `.shot` + one `.ring` | two rings, an arrow |
| A dialog or a detail | `.panel` (`--dark` when it needs weight, `--tall` for a short crop) | a full screen with the dialog lost in it |
| A whole screen captured without the browser frame | `.panel--wide` in a full-row block | the same screen unframed; it floats |
| A capture whose own background frames it | `.panel--bleed` | a shadow and a lightbox on top of it |
| An interaction (drag, search-as-you-type, navigation) | `.video`, on its own or on a panel | three screenshots of the steps |
| The same screen before and after a redesign | `.compare`, identical size and scroll position | two screenshots side by side |
| Parallel, text-only items (API additions) | `.grid.grid--tight` of `.card--icon`, two columns | cards for things that have a screenshot |
| A sequence where the order is the information | `.stepper` for 3–4 short steps, numbered `.card--muted` for longer ones | a bulleted list pretending to be steps |
| A data flow or a pipeline | `.schema`, one or two rows | a screenshot of a diagram |
| Values to compare (versions, limits, support) | a table | a paragraph of numbers |
| Features with a visual each, side by side | `.grid` of `.block`s, two columns | three columns of screenshots |
| The ask at the end | `.cta`, once | a CTA per section |

### 3.2 Do and don't

- **One visual per section**, after the paragraph that names what to look at. Two visuals back
  to back with no text between them read as a gallery, and galleries get skimmed.
- **An image for a state, a clip for a motion.** If a screenshot can carry the point, it does;
  a clip costs bytes and attention. One or two clips per post at most.
- **A comparison slider is for the same screen twice.** Same window size, same zoom, same
  scroll position, same data; otherwise the handle reveals differences that are not the point.
- **Pair text with visuals as tiles** when a section has several features: a short heading, one
  sentence, one visual per block, two columns. Not three; screenshots need the width.
- **Captions are optional and short.** When the text already sits beside the visual (a block
  with a heading) there is no caption. A standalone figure gets one line that says where to
  look, with no bold lead-in and no heading in it; what the feature *is* belongs in the
  paragraph.
- **Alt text on every image**: one sentence saying what the screen shows (*Add filter dialog
  with the And / Or switch*), not *screenshot of*. For a clip the caption carries this.
- **No chrome unless it carries meaning**: blocks have none; cards are bordered because the
  border groups a repeated unit; no fills.
- **Don't repeat a screen.** If the same dashboard appears in three sections, two of them need
  a different crop or no visual.
- **Don't ship a mock-up or a composite** (two screens pasted into one image). Where the 4.4
  post needed settings beside a map, it was a single composed capture, and it is the weakest
  image in the post.
- **Don't put text in images.** No labels, arrows or numbers baked into a screenshot.
- **Light theme only**, one tenant, one zoom, one window size per post.

### 3.3 The cover image

The post's `featuredImage` is the listing card and the social preview; its spec (size,
template, where the product shot goes on it) is not in this kit. The 4.3 post's cover is
`public/images/blog/<slug>/cover.webp` at 2560 × 1135 (a 2x 1280 × 567 card). **Decide:**
whether covers get a template in the kit or stay a design deliverable.

---

## 4. Delivering sources

What the pipeline needs, and the convention the 4.4 post settled on:

- **A Drive folder per post** with `images/` and `video/`. Originals only: PNG at the captured
  resolution, uncropped, unannotated, uncompressed; `.mov` or `.mp4` as recorded (trimmed at the
  ends is fine). Nothing pasted into the doc (Docs recompresses) and nothing sent in chat.
- **One file per visual, named for its slot**: lowercase, hyphens, `section-subject.png`:
  `agents-list.png`, `agents-install-dialog.png`, `dash-filter-dialog.png`. Pairs share a stem
  with a suffix: `ui-old.png` / `ui-new.png`, `sidebar-full.png` / `sidebar-compact.png`.
  (The 4.4 folder had `agent 1.png`, `Dash_3.png`, `WL.png`; the manifest maps them, but names
  that say what they are save a round of questions.)
- **A placeholder line in the Google Doc where the visual goes**, in square brackets, naming
  the file and the treatment: `[visual: agents-list.png — ring the Agents menu entry]`,
  `[clip: goto.mov — on a dark panel]`, `[compare: sidebar-full.png / sidebar-compact.png]`.
  Captions, if wanted, go on the same line. Reviewer comments in the doc are picked up with
  the copy.
- **Replacing a capture**: same file name, and say what changed in the doc comment or the
  folder, so the crop and the ring can be checked rather than redone.
- **What the author does not do**: crop, ring, patch, resize, convert, or compress. All of
  that is the manifest (`images.json`) and the pipeline, so it is reproducible and reviewable,
  and so the raw capture is there when a crop has to change.
- The processed set is committed with the post; raw stays in Drive.

---

## 5. Before publishing

- Every `<img>` has `width`, `height` and `alt`; every clip has a poster and `width`/`height`.
- No real data, no empty states, no error text, no browser chrome, attribution kept on maps.
- Patches are baked and the overlays removed; the lightbox opens the fixed file.
- One zoom and window size across the post; before/after pairs line up.
- Clips loop cleanly, are under 2 MB each, and there are no more than two.
- Captions short, no bold lead-ins; the paragraph before each visual says what to look at.
- Dark theme checked (panels, cards, diagram), phone width checked (grids stack, stepper
  vertical, sliders still draggable).
- CTA links resolve; the author byline is real.

---

## What the first outline did not cover, and where it landed

The outline this was drafted from had capture quality, aspect ratio, data, cropping and
annotation, component choice, and delivery. Added here: the browser-chrome-free capture route
(device mode, full screen, app window) so no resizer is needed; a size rule derived from text
legibility in the column rather than a fixed zoom; privacy and third-party attribution; alt
text and captions as accessibility, not decoration; recording rules for the loop point and the
cursor; the "no text in images, no composites" rules; a quantity rule (one visual per section,
two clips per post); the cover image as an open item; the placeholder convention in the doc;
and a pre-publish checklist. Zoom insets are named so the question is answered once.

Sources checked for the general rules: Google's developer documentation style guide on
images (use them sparingly, crop to what matters, alt text, no personal data), New Relic's
image-annotation guide (callouts clear of the element, almost never text in the image), and
Chrome's device mode documentation (custom device size, DPR, viewport capture).
