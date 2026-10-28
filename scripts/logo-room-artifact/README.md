# Logo Room artifact

The Logo Room (`/internal/design-system/logos/` on the lab) published on its own, working, as a private
claude.ai artifact: https://claude.ai/artifact/LSxxpGErXUNFPoVC5noQTG. Share it from the page's Share menu;
until then only its owner can open it.

It shows `exp/logo-review` as last captured (28 Oct 2026, 236787fd7): the renamed pages (Guidelines, Studio, About), the
groups guide, the palette with its colour editor, each mark's colours on light and dark cards with their tokens (dark values derived in OKLCH) and a Propose a token dialog, briefs by topic, sets of your own, the Files
side menu, renaming, removing and adding marks as proposals (a new mark previewed as the room draws it, in one colour or two), and the room's mark in About's hero. The tag in the bottom-left corner of every page names the branch, the commit and the capture date.

## What is in it

| File | From | What it is |
| --- | --- | --- |
| `index.html` | `/internal/design-system/logos/` | Overview: the set, the showcase, the open rounds |
| `guidelines.html` | `/internal/design-system/logos/guidelines/` | Assets, Map, Colour, Materials |
| `studio.html` | `/internal/design-system/logos/studio/` | Canvas (with the palette), Rounds, Ideas, Actions |
| `files.html` | `/internal/design-system/logo-files/` | Every logo file, with the legacy sets |
| `about.html` | `/internal/design-system/logos/about/` | The room, how to take part, the agent prompt, groups, maintainers, vocabulary |
| `room.js` | `bundle.mjs` | The room's scripts (`_LogoRoom.astro`, `_RoomTabs.astro`, `_RoomToc.astro`, `_PageHero.astro`, About, Files), bundled |
| `tabler-icons.json` | the dev server | Every Tabler icon, for the new mark's picker |
| `shell.js`, `shell.css` | this folder | The artifact's own glue (below) |
| `css/`, `assets/` | the dev server | The pages' styles, and the nav sprite |

Everything the lab page does works, except Save to repo: the set picker, grounds, sizes, sheets,
proposed statuses, colour tries, notes, added colours and secondaries, sets of your own, renames and removals, draft marks, the new mark (Tabler, the set's forms, an uploaded SVG), the
rounds, and Copy as patch.

## How it differs from the lab

- **No lab around it.** `shell.css` hides the lab's area bar and Pages island; the room's own bar is
  the top of the page, and every sticky offset and scroll margin that counted the lab's 48px bar loses it.
  A new sticky element under the bars needs its offset there too.
- **Its address travels in session storage.** An artifact's links keep a plain `#anchor` but never a
  query, and the room keeps its set in the query (`?m=…`, `?mark=…`, `?start=…`). `shell.js` takes the
  query off a link to another page of the room, keeps it in `sessionStorage`, and the next page puts
  it back before the room reads it. So the room's tabs carry the set, and an Overview round opens the
  Studio on that round.
- **No Save to repo.** It writes through the dev server; the capture removes the button. Copy as patch
  still produces a diff of the records that `git apply` takes.
- **Each viewer keeps their own Studio.** Notes, proposed statuses, colour tries, added colours and saved sets live in the viewer's
  browser for this artifact (`localStorage`), apart from the lab's and from everyone else's. To hand
  them over, a viewer uses Copy as patch (or Export JSON) and sends the result.
- **Copy link copies the page's frame address**, which only works on the machine that copied it. To
  share a set, send the artifact's link and the set's name in the Studio, or a patch.
- **Desktop first.** The room is laid out for review on a desktop, as in the lab; at phone width it
  fits without sideways scrolling but is cramped.

## Refresh

With the room's dev server (`tb-site-logos`, port 4355) running on the worktree to capture:

1. Decide what the snapshot should show: the dev server serves the working tree, uncommitted work
   included. The corner tag says `-dirty` when it is not a clean commit.
2. `python3 -I scripts/logo-room-artifact/capture.py` writes `site/` (git-ignored), afresh each time. It runs
   `bundle.mjs`, fetches the five pages and the icon set, and versions `room.js`, `shell.js` and
   `shell.css` by their content so viewers never keep an old copy.
3. Check it: `logo-room-artifact` in the main folder's `.claude/launch.json` serves `site/` on 4362.
   Open `index.html`, follow a round to the Studio, open a sheet, try a colour, open the new mark's Tabler
   tab, and Copy as patch.
4. Publish `site/index.html` to the artifact's URL with every other file in `site/` as `files` (root
   `site/`), and `null` for each published file `site/` no longer has (a stylesheet's name is its hash,
   so a style change renames it). The Artifact tool reads files only under the session's folder or its scratchpad, so copy
   `site/` there first when the session runs from the main checkout.

## When the room changes

- A new page of the room goes in `PAGES` in `capture.py`, with the file it becomes.
- `bundle.mjs` bundles each component's one plain `<script>` block. A component that gains a script,
  or a script that starts importing something new, needs nothing more as long as the import resolves
  through the repo's path aliases.
- `bundle.mjs` fails if the icon picker stops fetching `/internal/design-system/tabler-icons.json`;
  point it at the new path.
- Lab links that the snapshot has no page for stay as text (`data-lab-href`); other site links open
  https://thingsboard.io in a new tab.
