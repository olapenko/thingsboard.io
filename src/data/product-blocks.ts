/**
 * The shapes the product pages' blocks read: `Landing/BenefitGrid`, `Landing/ProductMatrix` and
 * `Landing/ChoiceBand`. `/products/paas/` and `/products/thingsboard-pe/` declared each of these
 * twice, word for word, in `paasPage.ts` and `onPremPage.ts`; the data stays in those files and
 * the types live here once. The FAQ reads Pricing's `FaqCategory` (`data/pricing/types.ts`).
 */

/** One benefit tile: a bare coloured glyph, a title and a line — `FeatureTile`'s treatment. */
export interface Benefit {
	/** Tabler name, rendered as a bare glyph with no fill behind it. */
	icon: string;
	/** The glyph's hue. Each page explains where its own hues come from, above its list. */
	color: string;
	title: string;
	description: string;
}

/** One row of a comparison: a label and the two columns' values, in column order. */
export interface CompareRow {
	label: string;
	/** An em dash (`—`) is a value: "not included", which the table says in words for a screen reader. */
	values: [string, string];
}

/** A run of rows under a heading that spans the table, marked with a squircle in the group's hue. */
export interface CompareGroup {
	title: string;
	/** Tabler name for the group's mark. */
	icon: string;
	/** The mark's hue. One rotation runs through a page's tables and lists. */
	color: string;
	rows: CompareRow[];
}

/** A comparison column: its name and the glyph the header pill shows beside it from 880 up. */
export interface CompareColumn {
	name: string;
	icon?: string;
}

/** A choice card's action: one `ui/Button`. `attrs` carries what a script hooks (`data-cloud-auth`). */
export interface ChoiceCta {
	text: string;
	icon?: string;
	href: string;
	variant: 'primary' | 'secondary';
	attrs?: Record<string, string>;
}

/** One card of the "which edition" band. */
export interface ChoiceOption {
	name: string;
	/** Tabler name for the glyph beside the name. */
	icon?: string;
	/** The entry number and nothing else; the ladder is `/pricing/`'s, which `plansHref` opens on. */
	price?: string;
	priceNote?: string;
	summary?: string;
	points: string[];
	cta: ChoiceCta;
	/** "See plans": a deep link into `/pricing/` on this option. */
	plansHref?: string;
}

/** The line under the cards: the exit to the other deployment. */
export interface ChoiceNote {
	icon: string;
	lead: string;
	link: { text: string; href: string };
	tail?: string;
}
