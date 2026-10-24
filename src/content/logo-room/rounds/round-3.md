---
label: Round 3
name: Plan shades
state: open
opened: 2026-10-24
title: 'The License Portal: plans in shades'
summary: 'Builds on Round 2: each plan told by the shade of its product’s tile.'
brief:
  - topic: The plans
    points:
      - 'On-premises: free (Free, Development, Non-commercial), subscription (Pilot, Startup, Business), perpetual (Commercial).'
      - 'Cloud, shared: Free to Business. Private Cloud, dedicated: Launch to Enterprise.'
      - 'North America and Europe: the same plans, no mark of their own.'
  - topic: On-premises
    points:
      - One mark for every plan, the neutral platform mark on White (Round 2’s A).
      - 'The shade tells the plan: a 155° light that deepens with it; free plans pure white.'
      - 'On dark: the same ladder on the Dark tile.'
  - topic: Cloud and Private Cloud
    points:
      - 'Cloud: its indigo Colour tile, lighter on the lower plans.'
      - 'Private Cloud: the Dark tint tile, deeper at every step.'
      - Never the White tile.
  - topic: To prove
    points:
      - The ladder in graphite and in indigo, side by side.
      - 'It reads at 48 in a plan card; at 24 the plan’s name carries it.'
set:
  onprem: white
scope:
  - group: On-premises · free
    plans:
      - name: Free
        shade: 0
      - name: Non-commercial
        shade: 0
      - name: Development
        shade: 1
  - group: On-premises · subscription
    plans:
      - name: Pilot
        shade: 2
      - name: Startup
        shade: 3
      - name: Business
        shade: 4
  - group: On-premises · perpetual
    note: As deep as Business; the portal’s dark card tells it apart.
    plans:
      - name: Commercial
        shade: 4
  - group: Cloud · shared
    note: Same plans in North America and Europe.
    tile: colour
    mark: cloud
    plans:
      - name: Free
        shade: 0
      - name: Prototype
        shade: 1
      - name: Pilot
        shade: 2
      - name: Startup
        shade: 3
      - name: Business
        shade: 4
  - group: Private Cloud · dedicated
    note: Cloud’s mark on a dedicated cluster; Enterprise is custom.
    tile: darktint
    mark: cloud
    plans:
      - name: Launch
        shade: 1
      - name: Growth
        shade: 2
      - name: Scale
        shade: 3
      - name: Enterprise
        shade: 4
---
