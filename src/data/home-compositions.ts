/**
 * The homepage's running orders: which sections run between the hero and the closing CTA, in what
 * order, and with which options. `index.astro` renders the shipping one at `/`; every one of them
 * also renders at `/internal/homepages/<id>/`, and the internal island switches between them.
 *
 * DATA ONLY. A section here is an id and its options; `HomeSections.astro` maps the id to markup. So
 * a new running order is one entry below and nothing else, and a section that changes its markup
 * changes it in every order at once.
 *
 * THE HERO, THE LOGO STRIP AND THE CLOSING CTA ARE NOT SECTIONS HERE. Every order opens and closes
 * the same way, and those three stay in `index.astro` where the hero's own work happens. Only their
 * WORDS follow the order, through its `copy`.
 *
 * THE REFERENCE IS PINNED. `live` is the homepage as main ships it (it replaced `handoff`, the page as
 * it was before A, on 2026-09-29), and it states every option it depends on, even where that option
 * is a section's default: a default that moves must not move the reference with it.
 *
 * The rows (see `ROW_SECTIONS`) take their sides and their wash from where they fall, not from
 * here: `HomeSections` alternates them by their position among the rows, so reordering them cannot
 * leave two visuals on the same side.
 */

import { AI_COPY } from '@data/ai-visual';
import { CONNECT_COPY } from '@data/connect-visual';
import { DIGITAL_TWIN_COPY } from '@data/digital-twin-visual';
import { NORMALIZE_COPY } from '@data/normalize-visual';
import { PLATFORM_COPY, PLATFORM_STAGES } from '@data/platform-visual';
import { SCALE_COPY } from '@data/scale-visual';
import { SOLUTION_COPY } from '@data/solution-flow';
import { DASHBOARDS_BADGE } from '@data/home-dashboards';

export type HomeSectionId =
	| 'platform'
	| 'ai'
	| 'connect'
	| 'twin'
	| 'normalize'
	| 'solution'
	| 'scale'
	| 'dashboards'
	| 'trust'
	| 'products'
	| 'ecosystem'
	| 'features'
	| 'voices';

/** A section and its options. Only the sections that have options take any. */
export type HomeSection =
	| {
			id: 'platform';
			/**
			 * `build` — "Build, deploy, and scale IoT solutions", the heading the handoff shipped.
			 * `loop` — "Your equipment, your people, one platform between them", the platform row's own
			 * title. For any order where the AI section sits next to the loop: its heading also opens
			 * on "Build", and two in a row read as one heading said twice. It also drops a promise the
			 * page stops keeping once the Scale row leaves: "scale".
			 * `live` — "The IoT platform between your equipment and your customers", main's heading, with
			 * main's lede under it (`data/home-live.ts`).
			 */
			heading: 'build' | 'loop' | 'live';
			/**
			 * `loop` — `PlatformClear`: equipment and people either side of the platform, and the four
			 * runs between them. `steps` — `PlatformSteps`: the same three in one top-to-bottom flow,
			 * the four stages across the platform card, and those stages DOCKED under the header as a bar
			 * (`PlatformStepsBar`) for the rows that follow, lighting each one while its row is read.
			 * The bar takes over those rows' marks. It needs the four rows straight after the platform,
			 * in stage order, which is checked below.
			 */
			diagram: 'loop' | 'steps';
	  }
	| {
			id: 'ai';
			/**
			 * `wide` — `AiWide` (FE-handoff, 2026-09-26): a whole 600px window beside a column of copy that
			 * ends on its own call to action, so `cta` does not apply. Main ships this one. `toggle` —
			 * `AiSection`, as the handoff shipped it; it has no `copy: 'live'` words.
			 */
			layout: 'wide' | 'toggle';
			/**
			 * For `toggle` only. `block` — one call to action under the row, on the wash: a line, a button and a link, all
			 * following the switch (Cloud sign-up for the Assistant, the CLI guide for the agent). `route`
			 * — the same two actions, one at the end of each route's copy. `none` — no action, as the
			 * handoff shipped it.
			 */
			cta: 'block' | 'route' | 'none';
			/**
			 * `cycle` — the band's wash runs through the page's section colours, in step with the mark.
			 * `route` — the wash takes the showing route's hue, as the handoff shipped it.
			 */
			wash: 'cycle' | 'route';
	  }
	| {
			id: 'normalize';
			/**
			 * `pulse` — the Normalize drawing alone, as the handoff shipped it. `switch` — Normalize,
			 * Filter and Notify on one drawing skeleton, chosen by a switch over the row's media.
			 */
			media: 'pulse' | 'switch';
	  }
	| {
			id: 'features';
			/**
			 * `why` — "Why choose ThingsBoard" as the heading, as the handoff shipped it. `value` — the
			 * same words as an eyebrow, under a heading that says what the twelve tiles are worth.
			 * `live` — "ThingsBoard Features", main's heading, with no lede under it.
			 */
			heading: 'why' | 'value' | 'live';
	  }
	| {
			id: 'trust';
			/**
			 * `hidden` — the band names itself to the outline only, its three card titles carrying it, as
			 * A ships it. `visible` — "Safe to build on" over the cards (`TRUST_HEADING`, draft words).
			 */
			heading: 'hidden' | 'visible';
			/**
			 * `rise` — white into the bookends' indigo, the approach to the dark Products band, as A ships
			 * it. `fall` — turned over, indigo at the top, so the band starts on its own edge under the use
			 * cases' white.
			 */
			ground: 'rise' | 'fall';
	  }
	| { id: Exclude<HomeSectionId, 'platform' | 'ai' | 'normalize' | 'features' | 'trust'> };

export interface HomeSectionMeta {
	/** What the controls and the outline call it. Short: it sits in a pill over the section. */
	label: string;
	/**
	 * The id the section's element carries, and so its `/#anchor`. Stable across orders, so a link
	 * to a section lands on it in any of them, and the switch can keep your place.
	 */
	anchor: string;
	/** The section's own badge colour, for the overview and the outline. */
	hue: string;
}

export const HOME_SECTIONS: Record<HomeSectionId, HomeSectionMeta> = {
	platform: { label: 'Platform loop', anchor: 'intro', hue: PLATFORM_COPY.badge.color },
	ai: { label: 'AI', anchor: 'ai', hue: AI_COPY.badge.color },
	connect: { label: 'Connect', anchor: 'connect', hue: CONNECT_COPY.badge.color },
	twin: { label: 'Model', anchor: 'twin', hue: DIGITAL_TWIN_COPY.badge.color },
	normalize: { label: 'Turn data into action', anchor: 'normalize', hue: NORMALIZE_COPY.badge.color },
	solution: { label: 'Device to end-user', anchor: 'solution', hue: SOLUTION_COPY.badge.color },
	scale: { label: 'Scale', anchor: 'scale', hue: SCALE_COPY.badge.color },
	dashboards: { label: 'Use cases', anchor: 'dashboard_description', hue: DASHBOARDS_BADGE.color },
	trust: { label: 'Trust band', anchor: 'trust', hue: '#121425' },
	products: { label: 'Products', anchor: 'products', hue: '#3d50f5' },
	ecosystem: { label: 'Ecosystem', anchor: 'product-ecosystem', hue: '#007c7b' },
	features: { label: 'Why choose', anchor: 'bottom-features', hue: '#5b616e' },
	voices: { label: 'Proven in production', anchor: 'voices', hue: '#121425' },
};

/**
 * The capability rows. Consecutive ones share one `.new-rows` block, which sets their padding and
 * alternates their wash; anything else between two of them splits the block.
 */
export const ROW_SECTIONS: ReadonlySet<HomeSectionId> = new Set(['connect', 'twin', 'normalize', 'solution', 'scale']);

export interface HomeComposition {
	/** The address segment, `/internal/homepages/<id>/`. Never reused for a different order — `c` once, on purpose (see it). */
	id: string;
	/** The switch's label. A letter or one word: three of them share a pill. */
	label: string;
	/** What the order is called in the proposal it came from. */
	name: string;
	/** One sentence on what this order does differently, for the overview and the switch's tooltip. */
	note: string;
	/**
	 * What colours the sections. `primary` — the handoff's, which main kept: the rows alternate one
	 * flat primary wash (`#f5f6ff`) and every drawing's connectors are the brand blue. `section` — each
	 * section takes its OWN badge colour: a subtle gradient in that hue under the row (and under the
	 * use cases and the customer voices), and the connectors inside its drawing in the same hue, so a
	 * row's mark, ground and lines are one colour. Set per order so the reference stays the page it is.
	 */
	hues: 'primary' | 'section';
	/**
	 * What the page says. `facelift` — this branch's words. `live` — main's, as it ships them, on every
	 * element both pages have: the hero and the page title, the AI switch, routes, chat and terminal,
	 * the rows, the use cases' links, the Cloud card's actions, the ecosystem cards and the closing
	 * note's link (`data/home-live.ts`, and the `_LIVE` copy in `data/ai-visual.ts`). The two headings
	 * that already have options take theirs as `heading: 'live'`.
	 */
	copy: 'facelift' | 'live';
	/**
	 * The room round the hero's copy (`Hero`'s `ctaSpace`). `standard` — as every hero sets it,
	 * rounded out by the note under the buttons where the order has one. `roomy` — 24 more above the
	 * headline and under the buttons, for an order whose hero ends on its buttons: main's words have a
	 * short lede and no note, and the copy beside the footage came out short (C, 2026-10-02). Set per
	 * order so the reference keeps main's.
	 */
	heroCta: 'standard' | 'roomy';
	/**
	 * The hero lede's size (`Hero`'s `ledeSize`). `body` — 16/24, every lede's. `large` — 18/28, for
	 * C's short three-line lede under the 48px headline, picked in the hero lab over 20/30
	 * (2026-10-02). Set per order so the reference keeps main's.
	 */
	heroLede: 'body' | 'large';
	/**
	 * Which footer closes the page. `in-use` — `Landing/Footer`, the one every other marketing page
	 * has and main ships. `map` — `Landing/FooterMap`, the footer that maps the platform, judged at
	 * `/internal/sections/footer/`. Set per order so the reference keeps main's.
	 */
	footer: 'in-use' | 'map';
	sections: HomeSection[];
}

/** The order `/` renders. Also first in `HOME_COMPOSITIONS`, so every list shows it first. C since 4 Oct 2026: A's sections, order, colours and footer, in main's words. */
export const SHIPPING_COMPOSITION = 'c';

/** The order every other one is a change to: the overview marks what each adds, moves and drops against it. */
export const REFERENCE_COMPOSITION = 'live';

export const HOME_COMPOSITIONS: HomeComposition[] = [
	{
		/*
		 * A IN MAIN'S WORDS (2026-10-02): A's sections, order and colours, saying what main says
		 * (`copy: 'live'`) — so the copy can be judged apart from the redesign, against the same layout
		 * the shipping page has. The hero follows the copy: main's lines and its two buttons, Try for
		 * free and Talk to an expert, with no note under them. The two headings with a `live` option
		 * take it. What main has no words for keeps A's: the trust band, the customer voices, and the
		 * Filter and Notify tabs of the normalize row. The trust band itself is the sandbox's "Heading,
		 * ground turned over" (2026-10-02): a visible heading, its ground running indigo to white.
		 *
		 * THE ONE REUSED ID. `c` was "Map as you go" (2026-10-01), the platform as a step bar docked
		 * under the header; it left the switch on 2026-10-02 as too raw for the homepage, and its
		 * components stay (`PlatformSteps`, `PlatformStepsBar`, `diagram: 'steps'`). The letter was
		 * given to this order on purpose, so the switch's third letter and its address agree.
		 */
		id: 'c',
		label: 'C',
		name: 'Show, then explain, in main’s words',
		hues: 'section',
		copy: 'live',
		heroCta: 'roomy',
		heroLede: 'large',
		footer: 'map',
		note: 'A as it stands — its sections, order, colours and footer — speaking main’s words: main’s hero with its two buttons, the platform and features headings, the rows, the use cases’ links and the cards. The trust band and the customer voices, which main does not have, keep A’s words; the trust band takes a visible heading and its ground turned over.',
		sections: [
			{ id: 'ai', layout: 'wide', cta: 'none', wash: 'cycle' },
			{ id: 'platform', heading: 'live', diagram: 'loop' },
			{ id: 'connect' },
			{ id: 'twin' },
			{ id: 'normalize', media: 'switch' },
			{ id: 'solution' },
			{ id: 'dashboards' },
			{ id: 'trust', heading: 'visible', ground: 'fall' },
			{ id: 'products' },
			{ id: 'ecosystem' },
			{ id: 'features', heading: 'live' },
			{ id: 'voices' },
		],
	},
	{
		id: 'a',
		label: 'A',
		name: 'Show, then explain',
		hues: 'section',
		copy: 'facelift',
		heroCta: 'standard',
		heroLede: 'body',
		footer: 'map',
		note: 'The AI demo straight under the hero, in the wide window with its call to action, then the platform loop and its four rows in the loop’s own order. A trust band, “Why choose” under a value heading, and customer quotes join; Scale leaves for the On-premises page. Every section takes its own colour.',
		sections: [
			{ id: 'ai', layout: 'wide', cta: 'none', wash: 'cycle' },
			{ id: 'platform', heading: 'loop', diagram: 'loop' },
			{ id: 'connect' },
			{ id: 'twin' },
			{ id: 'normalize', media: 'switch' },
			{ id: 'solution' },
			{ id: 'dashboards' },
			{ id: 'trust', heading: 'hidden', ground: 'rise' },
			{ id: 'products' },
			{ id: 'ecosystem' },
			{ id: 'features', heading: 'value' },
			{ id: 'voices' },
		],
	},
	{
		/*
		 * MAIN'S HOMEPAGE, kept as the reference. It replaced `handoff` on 2026-09-29, when main shipped
		 * the facelift at ThingsBoard 4.4 (`72563afc5`, served at thingsboard.io): the handoff's order
		 * with AI lifted to the top, in the wide window. `/internal/homepages/handoff/` redirects here.
		 *
		 * A MIRROR, NOT A COPY OF MAIN'S CODE: this branch's sections in main's order, speaking main's
		 * words (`copy: 'live'`). What main does differently in its markup and chrome stays this
		 * branch's, and is listed in `data/home-live.ts`. Re-sync it when main's homepage moves.
		 */
		id: 'live',
		label: 'Live',
		name: 'As shipped',
		hues: 'primary',
		copy: 'live',
		heroCta: 'standard',
		heroLede: 'body',
		footer: 'in-use',
		note: 'The homepage main ships today (ThingsBoard 4.4, on thingsboard.io), kept as the reference: the AI demo straight under the hero, then the platform loop, its five rows, the use cases, Products, Ecosystem and the features — in main’s words, on this branch’s sections.',
		sections: [
			{ id: 'ai', layout: 'wide', cta: 'none', wash: 'cycle' },
			{ id: 'platform', heading: 'live', diagram: 'loop' },
			{ id: 'connect' },
			{ id: 'solution' },
			{ id: 'twin' },
			{ id: 'normalize', media: 'pulse' },
			{ id: 'scale' },
			{ id: 'dashboards' },
			{ id: 'products' },
			{ id: 'ecosystem' },
			{ id: 'features', heading: 'live' },
		],
	},
	{
		id: 'b',
		label: 'B',
		name: 'Map, then magic',
		hues: 'section',
		copy: 'facelift',
		heroCta: 'standard',
		heroLede: 'body',
		footer: 'map',
		note: 'A with its first two sections swapped: the platform loop orients first, then the AI demo. The smallest change from the handoff that still moves AI up.',
		sections: [
			{ id: 'platform', heading: 'loop', diagram: 'loop' },
			{ id: 'ai', layout: 'wide', cta: 'none', wash: 'cycle' },
			{ id: 'connect' },
			{ id: 'twin' },
			{ id: 'normalize', media: 'switch' },
			{ id: 'solution' },
			{ id: 'dashboards' },
			{ id: 'trust', heading: 'hidden', ground: 'rise' },
			{ id: 'products' },
			{ id: 'ecosystem' },
			{ id: 'features', heading: 'value' },
			{ id: 'voices' },
		],
	},
];

/**
 * Checked as this module loads, so a bad entry fails the build rather than rendering a page with a
 * section twice (two elements answering to one anchor) or a switch with two tabs on one address.
 */
(function assertCompositions() {
	const ids = new Set<string>();
	for (const c of HOME_COMPOSITIONS) {
		if (ids.has(c.id)) throw new Error(`home-compositions: the id "${c.id}" is used twice`);
		ids.add(c.id);
		const seen = new Set<HomeSectionId>();
		for (const s of c.sections) {
			if (seen.has(s.id)) throw new Error(`home-compositions: "${c.id}" runs "${s.id}" twice`);
			seen.add(s.id);
		}
	}
	if (HOME_COMPOSITIONS[0]?.id !== SHIPPING_COMPOSITION) {
		throw new Error('home-compositions: the shipping order must come first, so every list shows it first');
	}
	if (!ids.has(REFERENCE_COMPOSITION)) {
		throw new Error(`home-compositions: the reference "${REFERENCE_COMPOSITION}" is not an order`);
	}
	// Main's words for the AI section exist for `AiWide` alone, the layout main ships; the toggle
	// would keep this branch's and say nothing about it.
	for (const c of HOME_COMPOSITIONS) {
		if (c.copy === 'live' && c.sections.some((s) => s.id === 'ai' && s.layout !== 'wide')) {
			throw new Error(`home-compositions: "${c.id}" speaks main's words, which the toggle AI layout has none of`);
		}
	}
	// The step bar walks the four stages in order, one row each. Anything else between the platform
	// and those rows, or the rows in another order, and it would light a step for a row the reader is
	// not on — so an order that docks it must run exactly the stages' rows, next, in the stages' order.
	const stageRows = PLATFORM_STAGES.map((st) => st.row);
	for (const c of HOME_COMPOSITIONS) {
		const at = c.sections.findIndex((s) => s.id === 'platform' && s.diagram === 'steps');
		if (at < 0) continue;
		const next = c.sections.slice(at + 1, at + 1 + stageRows.length).map((s) => s.id);
		if (next.join() !== stageRows.join()) {
			throw new Error(
				`home-compositions: "${c.id}" docks the platform's steps, so ${stageRows.join(', ')} must follow the platform in that order (it runs ${next.join(', ')})`
			);
		}
	}
})();

export const shippingComposition = (): HomeComposition =>
	HOME_COMPOSITIONS.find((c) => c.id === SHIPPING_COMPOSITION) ?? HOME_COMPOSITIONS[0];

export const isShipping = (c: Pick<HomeComposition, 'id'>) => c.id === SHIPPING_COMPOSITION;

export const referenceComposition = (): HomeComposition =>
	HOME_COMPOSITIONS.find((c) => c.id === REFERENCE_COMPOSITION) as HomeComposition;

export const isReference = (c: Pick<HomeComposition, 'id'>) => c.id === REFERENCE_COMPOSITION;

/** Where an order lives. The shipping one is the real homepage, so its address is `/`. */
export const compositionHref = (c: Pick<HomeComposition, 'id'>) =>
	isShipping(c) ? '/' : `/internal/homepages/${c.id}/`;

/** The anchors an order renders, top to bottom. */
export const compositionAnchors = (c: HomeComposition) => c.sections.map((s) => HOME_SECTIONS[s.id].anchor);
