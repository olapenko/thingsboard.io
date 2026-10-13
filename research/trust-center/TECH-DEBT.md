# Trust Center: tech debt

Things the Trust Center does on its own that belong in the shared kit, or that should be settled
before it merges.

## Cards on white: a line instead of a shadow (14 Oct 2026)

**What:** on the Trust Center's white ground, cards (`ui/Card`, `ui/LinkCard`) have a 1px border (the
kit's outline, the ink at 12%, as the bordered chip has) and no shadow. A link card lifts on hover: the border fades and the card takes
the kit's shadow (`--elev-tile` with `--elev-tile-hover`), dropping back to the border when pressed.
Cards on a tinted band (`.tc-band`) keep the kit's shadow.

**Where:** an override at the end of `src/components/TrustCenter/trust-center.scss` ("Cards on
white"), scoped to `.tc-page`. The rest of the site still uses `surface()` from
`src/styles/_surface.scss`: a shadow at rest, a deeper one on hover.

**Why it's debt:** the Trust Center's cards now differ from the product pages', homepage's and every
other page's. Either the site adopts the line (move the rule into `surface()` / `Card.astro`, then
delete the override) or the Trust Center goes back to the kit (delete the override).

**Not covered:** the forms' cards (`FormPage`, contact and vulnerability report) sit on the pricing
wave, not on white, and keep the kit's shadow; so does the bookend under every page.

**Also worth fixing then:** `--color-border` (#ebebeb) is lighter than `--color-border-light`
(#e0e1e2), the reverse of what their names say.
