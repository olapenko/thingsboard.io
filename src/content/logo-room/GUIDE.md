How ThingsBoard's product marks are built, for anyone designing a new one, a person or an agent. Read
it before drawing a new mark, a new direction for the set, or a subset of one (a product's plans, say).
The Logo Room's About page shows this file; the records beside it say what is decided for each mark.

### One system

Every mark is an app icon: artwork centred on a rounded tile, Mark's 32% squircle.

- **Tiles.** White (pure or shaded), Colour, Tint and Dark, plus the Glyph, the artwork alone in one
  ink. Build with the tile `src/components/ui/Mark.astro` draws: no new shapes, no extra shadows or
  outlines. Its light, lift and hairline are the only materials.
- **Sizes.** One scale: 88 · 72 · 48 · 40 · 32 · 24 · 16. Every mark reads as a glyph at 24, and at 16
  where its record says so.
- **Colours.** A product's colour is a theme token, `--color-product-*` in `src/styles/_theme.scss`,
  with a light and a dark value; components read the token, not a hex. A few products still carry a
  hex or another token name; Round 1 moves them over.
- **Checks.** 3:1 or better for a mark on its tile and a tile on its ground, on light and on dark.

### Platform

The ThingsBoard mark itself: a chip with a bolt at its centre, an orbit with a node at each end.

- **The platform** sits on a White tile, the mark in ink; white on dark.
- **A platform product** (Cloud, On-premises, Community) is the same mark knocked out in white on a
  Colour tile, in the product's colour.
- Never put a product on the White tile: it would read as the platform.
- **Private Cloud**, as Round 2 proposes, is Cloud's dedicated version, not a product of its own: Cloud's
  mark on the Dark tint tile.
- **The Mobile app**, as Round 1 proposes, wears the platform's logo too. Beside the other products it
  takes a smaller, alternative icon; on its own page it shows the app on a phone.

### Ecosystem

The products around the platform: Mobile app, Edge, IoT Gateway, TBMQ, Trendz, IoT Hub.

- **A White tile, the artwork in its own colours.** The artwork often carries the chip, joined to what
  the product does: lines out to devices, a bridge, a ring between brackets, chart bars, a hub.
- **The accent colour sits beside the tile** (a card's glow, a list's tint), not over the artwork. On
  dark the tile turns pure white; the Glyph is in the accent.
- Never recolour the artwork on the White tile. Avoid pale fills that vanish at 16.

### AI

The AI across the platform, and the products made for it.

- **The AI core** is sparkles on a Colour tile in the brand indigo. On the homepage it cycles through
  the sections' colours; a still indigo tile stands in for reduced motion, print and favicons.
- **AI products** take a plain line glyph for what they are: the CLI's terminal prompt on a violet
  Colour tile, the AI Assistant's chat bubble with a face on a White tile, in teal.
- The AI core is the AI's one colour mark. Nothing else takes its sparkle.

### Designing something new

Drawings differ from group to group; this guide covers only what each group shares: its tile, its
treatments and its colour.

1. **Join a group, or start one.** In a group, keep its tile, treatment and colour rule, and change
   one thing: its symbol or its colour, never both. A new group sets its own rules before its second
   member. In code it is the record's `group`; a new one goes into the schema
   (`src/models/logo-room.ts`), into `GROUPS` in the room, and into this guide.
2. **For a subset, vary one thing.** One mark with one variable, not a mark each, as Round 3 tells a
   product's plans apart by the shade of its tile. In code it is the round's `scope`.
3. **Build from the components.** The Mark tile, the `--color-product-*` tokens, the type scale. A
   colour new to the set is proposed in `palette.md` with a name, a light and a dark value, and passes
   the checks; the Studio's palette adds one and Copy as patch writes it. A mark has two tones at
   most, each with a light and a dark value: its colour, and a second tone for two-tone artwork. A
   second tone's token is the product's plus `-secondary`, with `of` naming the mark; never a third.
   A mark's sheet adds either tone to the palette when it has no product token yet.
4. **Record it.** A new mark is `marks/<id>.md`, its artwork `marks/<id>/mark.svg` (with a viewBox)
   and its `colours`; the Studio's Add drafts all three. `colours.first` is the tile's fill or the accent
   beside its White tile, `colours.second` the second tone; each takes a `light` value (a hex or a
   token) and a `dark` one where its token has none, or it needs another. Two-tone artwork paints its
   second tone `var(--lc-tone-2, currentColor)`. Add draws a Tabler
   icon in two over its filled twin, and takes an SVG's two colours as the first and the second. It
   does not offer a symbol another mark carries. A candidate's drawing is
   `marks/<id>/<candidate>.svg`; until the file is in, the candidate is `toDraw`. The room draws either
   with no code. A new name or taking a mark out is proposed in its record (`proposed.label`,
   `proposed.remove`) and decided in review. A change to several marks is a round,
   `rounds/round-<n>.md`, with routes when it weighs directions and a palette when it proposes colours.
5. **Check it.** Run `pnpm lint:logoroom`, then see it on every ground in the Studio.
