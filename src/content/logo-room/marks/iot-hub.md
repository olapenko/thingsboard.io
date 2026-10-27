---
order: 100
label: IoT Hub
group: Ecosystem
about: 'The free marketplace of device profiles, widgets, dashboards and rule chains, installed in a click. Its mark is the hub the product itself uses: a centre joined to the nodes around it.'
signature: white
colourRole: Glyph on the white tile
colours:
  first:
    light: 'var(--color-product-iot-hub)'
    dark: '#fbbf24'
treatments:
  white: designed
  colour: exploring
  tint: shipped
  glyph: designed
guideline:
  symbol:
    - A centre joined to the nodes around it
  light: White tile, the hub in amber
  dark: 'White tile, pure white; in the footer, the Tint tile with the hub in the warmer amber #f59e0b'
  small: 'The glyph, in amber; on dark, #f59e0b'
  dont:
    - 'Put the hub in the list’s yellow #fbbf24 on dark: it reads as another colour'
    - 'Reach for the Dark tile by default: it is for the rare dark case'
candidates:
  - id: current
    status: shipped
    note: White tile, the store
  - id: a
    status: designed
    note: White tile, the hub the product uses
    material: white
  - id: b
    status: exploring
    note: 'Dark tile, the hub in warmer amber: rare cases only'
    material: dark
actions:
  - kind: build
    what: 'the hub on the pages that still draw the store: the footer and the homepage card'
  - kind: build
    what: 'the footer’s IoT Hub tint in the warmer amber #f59e0b, once Round 1 is decided'
---
