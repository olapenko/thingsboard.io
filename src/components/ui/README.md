# The UI kit

The components every marketing page is built from. Each file's header comment is its documentation;
the live reference is `/internal/library/kit/` (every component, variant, size and ground).

| Component | What it is |
| --- | --- |
| `Button`, `ButtonGroup` | primary · secondary · tertiary; xs 32 · sm 40 · md 44 · lg 48 · xl 56; a row that stacks by its own width |
| `Link` | standalone (label + chevron) or inline (always underlined); tones accent · ink · muted |
| `Mark` | the squircle tile: 36 · 40 · 48 · 64 · 72 · 80 · 88; one of `icon`, `logo`, `product` (`@data/marks`) |
| `Chip`, `ChipGroup` | link · toggle · tag |
| `Tabs`, `TabPanel` | segmented or list, one script (`@util/tabs`) |
| `Field` | label, control, hint, error, counter; an attached button in the `end` slot (`@util/form-validate`) |
| `Card`, `CardGrid`, `LinkCard` | tile · row · panel; surface · ghost · inverse; `href` makes the whole card the link |
| `Band` | a section's ground, padding step and measure; sets `data-surface` |
| `Dialog` | the modal shell on a native `<dialog>` (`@util/dialog`) |

Built on them, in `Landing/`: `SectionHeader`, `PageIntro`, `RegionChoice`, `InstallOptions`, `Bookend`.

## How colour and focus work

- **`data-accent`** (`brand` · `onprem` · `neutral`) on any ancestor sets the scheme: `--accent-fill`,
  `--accent-on-fill`, `--accent-ink`, `--accent-light` (`_theme.scss`). A component's `accent` prop
  takes a scheme or a one-off colour (a product's hue) for that component alone.
- **`data-surface`** (`light` · `dark`) says what a control sits on, and only an ancestor says it: no
  component takes it as a prop. A `Band` sets it from its ground, a `Card` and a `Dialog` set
  `light`. It picks each component's dark look and the focus ring: near-black `#17181c` on light,
  yellow `#ffd43b` on dark, 2px, keyboard only. **A white box you build by hand inside a dark ground
  must set `data-surface="light"`**: `on-dark` (`_surface.scss`) skips everything inside it, so the
  kit's light look comes back with no rule of its own.

## Rules

1. **No page CSS for what a component owns.** Size, colour, radius, states and focus are the
   component's. A class you pass is for placement (margins, grid). A rare exception sets one of the
   component's variables (`--btn-min-w: 200px`), never a new size.
2. **One of each.** Sizes are steps, never fluid; per breakpoint with `{ base, md, lg }`. Nothing in
   between: if a size is missing, add a step to the component, not a value to a page.
3. **Global, prefixed styles.** Each component's style is `is:global` with `ui-` classes, emitted only
   on pages that render it. Reach inside a kit component from a page with `:global(.ui-…)`.
4. **Markup the component cannot render** (a third-party form, HTML built in a script) uses the mixins:
   `ui-button()` in `_button.scss`, `surface()` and `on-dark` in `_surface.scss`, `shimmer` in
   `_effects.scss`.
5. **Behaviour passes through.** Tracking ids, `gtm_button`, `data-*` hooks go in `attrs` untouched;
   the two calls to action are `to="cloud-signup"` and `to="install-guide"` (`@data/cta-destinations`).
6. **Shared bits live once.** Screen-reader text is `<span class="ui-sr">` (`_theme.scss`, every
   route); a link off the site takes `EXTERNAL_ATTRS` and says `EXTERNAL_NOTE` (`@util/ui-kit`);
   `hidden` hides any kit component whatever its own `display`.
