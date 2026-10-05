import { HOME_COMPOSITIONS, compositionHref, isShipping } from '@data/home-compositions';

/**
 * THE DESIGN SYSTEM: what the redesigned pages are built from, as four pages that read in the order
 * the system is built up — the tokens, the type roles drawn with them, the components drawn with
 * both, and where the pages actually use the result. This is the registry the area is built from:
 * the overview's tiles, the top bar's tabs (through `_areas.ts`), each page's title, lede and side
 * navigation, and the old kit anchors the Components page forwards. A page is added in ONE place: an
 * entry below and a file in `design-system/`.
 *
 * Why four pages and not the one kit page this area started as. The kit page was two pages in one:
 * the foundations every component is drawn with, and the components. Neither said anything about the
 * type roles beyond a ladder, or about the pages — whether what ships is the kit or markup a page
 * wrote for itself. Type and the inventory answer those two, by measuring the real pages rather than
 * listing what they should contain, so they cannot go stale.
 */
export interface DesignSection {
	id: string;
	label: string;
	/** The heading it sits under in the page's side navigation. */
	group?: string;
}

export interface DesignPage {
	id: 'foundations' | 'type' | 'components' | 'inventory';
	label: string;
	/** One honest line for the tile and the page's lede: what is on it and where its numbers come from. */
	blurb: string;
	icon: string;
	/** Where the thing it shows lives, as the tile's footnote. */
	source: string;
	/** The page's sections, in order: its side navigation, and the anchors old links can land on. */
	sections: DesignSection[];
}

/**
 * The pages the Type and Inventory pages read: the redesigned ones, which are the ones built on the
 * kit. The homepage in every running order, because the orders render sections and options the
 * shipping one leaves out; then the pages the island lists as the site (`_InternalNav`), and the
 * page Contact us leads to.
 */
export interface HarvestPage {
	key: string;
	label: string;
	src: string;
}

export const HARVEST_PAGES: HarvestPage[] = [
	...HOME_COMPOSITIONS.map((c) => ({
		key: isShipping(c) ? 'home' : `home-${c.id}`,
		label: isShipping(c) ? 'Home' : `Home · ${c.label}`,
		src: compositionHref(c),
	})),
	{ key: 'cloud', label: 'Cloud', src: '/products/paas/' },
	{ key: 'onprem', label: 'On-premises', src: '/products/thingsboard-pe/' },
	{ key: 'pricing', label: 'Pricing', src: '/pricing/' },
	{ key: 'install', label: 'Installations', src: '/installations/' },
	{ key: 'contact', label: 'Contact us', src: '/contact-us/' },
	{ key: 'thanks', label: 'Thank you', src: '/contact-us-thanks/' },
];

export const DESIGN: DesignPage[] = [
	{
		id: 'foundations',
		label: 'Foundations',
		blurb:
			'The values under every component: the accent schemes and the contrast they keep, the grounds a section sits on and the focus ring each picks, five elevations, the corners, the spacing scale, icon sizes and motion. Read from the rendered page, not copied from the source.',
		icon: 'tabler:color-swatch',
		source: 'src/styles/_theme.scss · _variables.scss · _surface.scss',
		sections: [
			{ id: 'colour', label: 'Colour' },
			{ id: 'grounds', label: 'Grounds and focus' },
			{ id: 'elevation', label: 'Elevation' },
			{ id: 'radius', label: 'Radius' },
			{ id: 'spacing', label: 'Spacing' },
			{ id: 'icons', label: 'Icons and motion' },
		],
	},
	{
		id: 'type',
		label: 'Type',
		blurb:
			'The type-* ladder drawn through its own mixins and measured, the older mixins beside it with how many files still use each, then one redesigned page read live in a frame: every size, weight and leading it paints, and how many of them land on the ladder.',
		icon: 'tabler:typography',
		source: 'src/styles/_variables.scss (type-*)',
		sections: [
			{ id: 'declared', label: 'Declared' },
			{ id: 'in-use', label: 'In use' },
		],
	},
	{
		id: 'components',
		label: 'Components',
		blurb:
			'Every ui/ component in its variants, sizes, schemes and grounds, rendered from the component itself with its numbers measured, then two Landing pieces built on them that several pages share: the section header and the region choice.',
		icon: 'tabler:components',
		source: 'src/components/ui/ · src/components/ui/README.md',
		sections: [
			{ id: 'button', label: 'Button', group: 'The kit' },
			{ id: 'link', label: 'Link', group: 'The kit' },
			{ id: 'mark', label: 'Mark', group: 'The kit' },
			{ id: 'chip', label: 'Chip', group: 'The kit' },
			{ id: 'tabs', label: 'Tabs', group: 'The kit' },
			{ id: 'field', label: 'Field', group: 'The kit' },
			{ id: 'card', label: 'Card', group: 'The kit' },
			{ id: 'band', label: 'Band', group: 'The kit' },
			{ id: 'dialog', label: 'Dialog', group: 'The kit' },
			{ id: 'header', label: 'Section header', group: 'Built on the kit' },
			{ id: 'regions', label: 'Region choice', group: 'Built on the kit' },
		],
	},
	{
		id: 'inventory',
		label: 'Inventory',
		blurb: `Where the pieces are used: every button, link, mark, label, card and image link on the ${HARVEST_PAGES.length} redesigned pages, harvested live and folded into variants by shape, each with the component file it came from and whether that file is the kit. Reading the pages takes under a minute.`,
		icon: 'tabler:list-search',
		source: 'Home in every order · Cloud · On-premises · Pricing · Installations · Contact us',
		sections: [],
	},
];

export const designHref = (page: Pick<DesignPage, 'id'>) => `/internal/design-system/${page.id}/`;

export const designPage = (id: DesignPage['id']): DesignPage => {
	const page = DESIGN.find((p) => p.id === id);
	if (!page) throw new Error(`No design-system page "${id}"`);
	return page;
};

/** A page's side navigation: its sections under their group headings, in the order they come. */
export const navGroups = (page: DesignPage) =>
	page.sections.reduce<{ title: string; items: DesignSection[] }[]>((acc, s) => {
		const title = s.group ?? page.label;
		const last = acc[acc.length - 1];
		if (last && last.title === title) last.items.push(s);
		else acc.push({ title, items: [s] });
		return acc;
	}, []);
