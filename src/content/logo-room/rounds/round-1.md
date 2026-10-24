---
label: Round 1
name: Set update
state: open
opened: 2026-10-24
title: 'The set update: the app, the hub and Community, two redraws, the colours unified'
summary: 'The first pass over the set: the app, the hub and Community, two redraws, one colour token per product.'
picks:
  - mark: mobile
    candidate: c
    why: 'The app is ThingsBoard in your pocket: it wears the platform’s logo, not a colour of its own, so Cloud’s and On-premises’ colours do not apply. It also gives up the green it shares with On-premises and TBMQ.'
  - mark: community
    candidate: b
    why: 'Community Edition wears the platform’s logomark in its CE navy, as Cloud wears it in its indigo; the old CE icon retires.'
  - mark: iot-hub
    candidate: a
    why: 'The hub is the icon the product itself uses; the store is retired. It stays on its White tile; a Dark tile is drawn (B) for the rare dark case, not recommended.'
reviews:
  - tbmq
  - trendz
brief:
  - topic: Mobile app
    points:
      - The platform’s logo on White, the mark in ink.
      - 'Beside other products: a smaller, alternative icon (D, to draw).'
      - 'Its own page: the app on a phone.'
  - topic: IoT Hub
    points:
      - The hub in amber on White.
      - 'On dark: the warmer amber #f59e0b, not the list’s #fbbf24.'
      - 'The footer: its Tint tile, in that amber.'
      - 'The Dark tile (B): rare cases only.'
  - topic: Community Edition
    points:
      - The standard logomark on CE navy, as Cloud on indigo.
      - Its navy needs a dark value that holds on Dark.
  - topic: Redraws (TBMQ, Trendz)
    points:
      - 'One grid: Mark’s art box, centred, at most 3:2.'
      - Two tones at most.
      - 'Reads at 16: no pale fills.'
      - Holds 3:1 on the White, Colour and Dark tiles.
      - Edge and IoT Gateway only if they then look off.
  - topic: Colours
    points:
      - 'One token per product, --color-product-*, light and dark.'
      - 'New: --color-product-cli (#7c5cf0, #b9a6ff) and --color-product-assistant (#0d7a5f, #4fd1a8).'
      - 'One value each: On-premises (#178649 or #00695c), Trendz (#1976d2 or #5555ff).'
      - 'Dark values for Edge, IoT Gateway, TBMQ, Trendz and IoT Hub.'
      - 'Clashes: Mobile app and On-premises (#178649), Mobile app and TBMQ in lists (#4ade80), the Assistant’s teal near Edge’s.'
set:
  community: colour
---
