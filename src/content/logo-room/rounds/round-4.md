---
label: Round 4
name: Plan shades
state: open
opened: 2026-10-24
title: 'The License Portal: plans in shades'
summary: 'Builds on Round 3: each plan is told by a shade of its product’s tile, On-premises on White, Cloud on its Colour tile, Private Cloud on Dark tint.'
brief:
  - 'The License Portal sells the self-hosted ThingsBoard by plan: subscription (Pilot, Startup, Business), perpetual (Commercial) and free (Free, Development, Non-commercial). Each plan card needs a mark.'
  - 'On-premises: one mark for all its plans, the neutral platform mark on a White tile (Round 3’s A); the plan is told by its shade, a 155° gradient that deepens with the plan, pure white for the free ones.'
  - 'On a dark page the same ladder runs on the Dark tile, from flat near-black to a lit graphite, as the portal’s Commercial card already does.'
  - 'Colour coding is tried, not assumed: the ladder is drawn in graphite and in the brand indigo, side by side.'
  - 'The shade has to read at 48 in a plan card; at 24, in a list, the plan’s name carries it.'
  - 'Cloud and Private Cloud are one product in two versions, as the Cloud page says: shared infrastructure (Free to Business) or a dedicated, isolated cluster (Launch to Enterprise). They share Cloud’s mark, and never take the White tile, which would read as the platform.'
  - 'Their messages differ as the versions do: Cloud is the quickest start, for prototypes, MVPs and production up to a few thousand devices; Private Cloud is for enterprises, regulated industries and mission-critical fleets, with its own SLA and region. The tile says shared or dedicated: Cloud on its indigo Colour tile, lighter on the lower plans; Private Cloud on the Dark tint tile, indigo in the dark, deeper at every step. The shade says the plan.'
  - 'North America and Europe are the same plans in dollars and euros: a region is not a version and takes no mark.'
set:
  mobile: dark
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
