---
order: 110
label: AI core
group: AI
kind: AI
about: 'The AI across the platform, as the AI section’s badge: the assistants and the CLI under one mark. Sparkles on a tile whose colour follows the page’s sections.'
signature: colour
colourRole: Tile fill at rest, then the page’s section colours
colours:
  first:
    light: 'var(--color-brand)'
treatments:
  colour: shipped
  glyph: exploring
exception:
  what: 'Animated: its colour cycles the page’s section colours'
  fallback: The indigo Colour tile, for reduced motion, print and the favicon
guideline:
  symbol:
    - Sparkles
  light: Colour tile; its colour follows the page’s sections
  dark: Colour tile; its colour follows the page’s sections
  small: The glyph, in indigo
  dont:
    - 'Animate it where motion is reduced, in print or as a favicon: use the still indigo tile'
actions:
  - kind: decide
    what: 'the chat launcher: the help mark it draws now, or the AI core'
---
