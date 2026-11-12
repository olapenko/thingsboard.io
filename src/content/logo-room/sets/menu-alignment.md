---
name: Menu alignment
status: proposed
basedOn: shipped
opened: 2026-11-11
title: 'The whole family as the rebuilt site menu lists it: tiles at 40, tints lit from above, a 75% fill'
summary: 'A proposed set: the family as the rebuilt site menu lists it. Tiles at 40, gradient tints, a 75% fill, the menu’s names and order. The shipped set is untouched.'
brief:
  - topic: What this set is
    points:
      - 'A proposed set: the whole family as the rebuilt site menu lists it, scraped from feat/menu-structure at d0b888b1f (11 Nov 2026): its tiles, its glyph files, its names and its order.'
      - 'Based on the shipped set, which it leaves untouched. Each tile it draws itself comes from the files in sets/menu-alignment/; a mark it does not redraw is in as it ships.'
      - 'Two departures from the menu: a 75% fill, and the CLI’s colours sliding once in 5s.'
  - topic: Fill
    points:
      - 'A fill is the set’s, not a tile’s: 75% is the base, on every tile, whatever its artwork.'
      - 'Two rules over it: a wide glyph (TBMQ) at 81, and the CLI at its own 65.6.'
      - 'The menu draws the logomark at 70 and a product’s glyph at 72; the shipped set has them at 59 and 70.'
  - topic: The list tile
    points:
      - '40 in the menu and the footer, where the shipped lists draw 32; the radius stays 32% of the tile.'
      - 'A row is 56 high: the name at 15 medium, one line of description at 13.'
      - 'A tile is opaque: a hovered row never shows through it.'
  - topic: The Tint tile
    points:
      - 'A gradient of the product’s list colour, lit from above, in place of the flat 12%.'
      - 'On light: 6% at the top to 20% at the foot, on white. On dark: 22% at the top to 8%.'
      - 'A product’s glyph keeps its artwork’s own two tones on both grounds.'
  - topic: The Colour tile
    points:
      - 'ThingsBoard on #178649 and ThingsBoard Cloud on #3d50f5, with the sheen the shipped tiles have.'
      - 'The logomark at the set’s 75% (30 of 40). The menu draws 70% and marks it a stand-in; the shipped lists draw 62.5%.'
  - topic: ThingsBoard CLI
    points:
      - 'Its own glyph: a terminal window cropped to its outline, 65.6% of the tile (21 of 32).'
      - 'Its tile: the AI mark’s colours as one long slanted gradient, sliding once in 5s, where the menu takes 12s; 16% strong on light, 28% on dark.'
      - 'The glyph in the text’s ink: #17181c on light, white on dark. At rest under reduced motion.'
      - 'The menu marks it a stand-in until the design team’s logo proposal.'
  - topic: Mobile Application
    points:
      - 'The platform’s logomark in graphite #4a5068 on a pale tile, #f8f9fd at the top to #e3e7f5 at the foot.'
      - 'On dark: a glass tile, the logomark white.'
      - 'The menu marks it a stand-in until the app has an icon of its own.'
  - topic: Names and order
    points:
      - 'IoT platform: ThingsBoard (On-premises IoT Platform), ThingsBoard Cloud (Platform-as-a-Service).'
      - 'Product ecosystem: ThingsBoard CLI, Edge, IoT Gateway, Mobile Application, Trendz Analytics, TBMQ.'
      - 'The room keeps the CLI in its AI group; the menu lists it first in the ecosystem.'
  - topic: IoT Hub
    points:
      - 'In the set on its White tile, the hub in amber at the set’s fill. The menu and the footer give it no tile: a plain link in the top row.'
      - 'Its symbol is the hub wherever the menu branch draws it: the docs’ product selector, the social cards and the homepage card. The store is retired there.'
      - 'Open: that homepage card draws the hub in the orange #e8590c; its record has amber.'
  - topic: Platform
    points:
      - 'In the set as it ships: the logomark in ink on the White tile, at the set’s fill. The menu has no row for it.'
  - topic: AI core and AI Assistant
    points:
      - 'In the set as they ship: the AI core on its indigo Colour tile, the AI Assistant on its White tile.'
      - 'The menu has no row for them; the set’s fill takes their icons to 75% from 59%.'
  - topic: Community Edition
    points:
      - 'In the set as an additional mark: the logomark on CE navy, as Cloud wears it on indigo.'
      - 'Legacy: kept on record, not drawn on the live website. The menu has no row for it.'
fill:
  base: 75
  wide: 81
tiles:
  community:
    name: Community Edition
    tile: colour
    art: thingsboard
    status: legacy
    change: 'Kept on record in CE navy, the logomark at the set’s 75%. Legacy: not for the live website'
  onprem:
    name: ThingsBoard
    tile: colour
    art: thingsboard
    hue: '#178649'
    change: 'The menu’s name for it; the logomark at 75%, where the lists ship 62.5%'
  cloud:
    name: ThingsBoard Cloud
    tile: colour
    art: thingsboard
    hue: '#3d50f5'
    change: 'The menu’s name for it; the logomark at 75%, where the lists ship 62.5%'
  cli:
    name: ThingsBoard CLI
    tile: waves
    scale: 65.6
    change: 'New in lists: a terminal window in the text’s ink on a tile of the AI mark’s colours'
  edge:
    tile: tint
    hue: '#2dd4bf'
    change: 'The Tint tile as a gradient lit from above, where the lists ship a flat 12%'
  iot-gateway:
    tile: tint
    hue: '#a78bfa'
    change: 'The Tint tile as a gradient lit from above, where the lists ship a flat 12%'
  mobile:
    name: Mobile Application
    tile: glass
    art: thingsboard
    ink: '#4a5068'
    change: 'The platform’s logomark in graphite on an app icon’s pale tile, where the lists ship a green Tint tile'
  trendz:
    name: Trendz Analytics
    tile: tint
    hue: '#60a5fa'
    change: 'The menu’s name for it; the Tint tile as a gradient lit from above'
  tbmq:
    tile: tint
    hue: '#4ade80'
    change: 'The Tint tile as a gradient lit from above; last in the ecosystem'
order:
  - platform
  - onprem
  - cloud
  - community
  - cli
  - edge
  - iot-gateway
  - mobile
  - trendz
  - tbmq
---
