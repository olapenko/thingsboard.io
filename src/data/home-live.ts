import type { EcosystemItem } from '@data/homeEcosystem';
import type { ProductChoice } from '@data/homeProducts';

/**
 * THE HOMEPAGE IN MAIN'S WORDS: the copy of the `live` running order (`copy: 'live'` in
 * `home-compositions.ts`), which mirrors the homepage `origin/main` ships at ThingsBoard 4.4
 * (`72563afc5`, 2026-09-29) and thingsboard.io serves.
 *
 * ONLY WORDS, AND ONLY ON ELEMENTS THIS BRANCH ALSO HAS. A Live page is this branch's homepage — its
 * sections, header, type and stylesheet — saying what main says: the hero's lines and buttons, the
 * platform intro, the Connect and Scale rows, the use cases' links, the Cloud card's actions, the
 * Mobile and IoT Hub cards, the features heading and the closing note's link. The AI section's are
 * beside its other copy, in `data/ai-visual.ts` (`AI_COLUMNS_LIVE`, `AI_ASSISTANT_DEMO_LIVE` and the
 * `_LIVE` sessions). An href is copy too — it is where main sends the reader — and every one here
 * resolves on this branch.
 *
 * NOT HERE, because none of it is a string on an element both pages have: main's system font (this
 * branch sets Ubuntu), its black header and promo bar, the logo strip's order, the closing note's
 * expert link set inline (a button here), and the foundation strip under the platform drawing, which
 * main's drawing does not have.
 *
 * RE-SYNC WHEN MAIN'S HOMEPAGE MOVES: render main's `/` and this branch's `/internal/homepages/live/`,
 * diff their text section by section, and bring every difference on an element both have into this
 * file. Main's sources: `pages/index.astro`, `data/home-ctas.ts`, `data/home-rows.ts`,
 * `data/homeProducts.ts`, `data/homeEcosystem.ts`, `data/ai-visual.ts`, and the use-case link in
 * `components/Landing/DashboardShowcase.astro`.
 */

/** A hero button, in the shape `Hero` takes (the component keeps its own type local). */
interface HeroButton {
	text: string;
	href: string;
	icon?: string;
	variant?: 'primary' | 'outline' | 'white' | 'brand';
	srOnlySuffix?: string;
	attrs?: Record<string, string>;
}

/**
 * The page's title and description, and the hero. Main's hero has no note under its buttons: "Talk to
 * an expert" IS its second button, in place of this branch's Install, so the Live hero drops the note.
 */
export const LIVE_HERO: {
	pageTitle: string;
	pageDescription: string;
	title: string[];
	subtitle: string;
	buttons: HeroButton[];
} = {
	pageTitle: 'ThingsBoard - All-in-one IoT Platform',
	pageDescription:
		'ThingsBoard is an all-in-one IoT platform that gives you everything you need to build, deploy, and scale IoT solutions.',
	title: ['ThingsBoard', 'All-in-one IoT Platform'],
	subtitle: 'Device management, data collection, processing and visualization for your IoT solution',
	buttons: [
		{
			text: 'Try for free',
			icon: 'tabler:cloud-filled',
			// Main's no-script fallback is the region chooser, not the US sign-up. With script, the
			// header's region dialog takes the click in both.
			href: '/installations/choose-region/',
			variant: 'brand',
			// Main names it with an aria-label, "Try ThingsBoard Cloud for free", which fails axe's
			// label-content-name-mismatch. The hidden suffix says the same and keeps the visible words first.
			srOnlySuffix: 'on ThingsBoard Cloud',
			attrs: { 'data-cloud-auth': 'signup' },
		},
		{
			text: 'Talk to an expert',
			icon: 'tabler:messages',
			href: '/contact-us/?subject=ThingsBoard%20Products',
			variant: 'outline',
		},
	],
};

/** The platform intro's heading and lede (`heading: 'live'` on the platform section). */
export const LIVE_PLATFORM = {
	title: 'The IoT platform between your equipment and your customers',
	description: 'ThingsBoard includes from the start all tools and components you need to develop your IoT application.',
};

/** A row's words: the fields main replaces. */
interface RowCopy {
	title?: string;
	body?: string;
	link?: { text: string; href: string };
}

/** The rows that say something else on main, keyed by section id. Solution, Model and Turn match. */
export const LIVE_ROWS: Partial<Record<'connect' | 'solution' | 'twin' | 'normalize' | 'scale', RowCopy>> = {
	connect: {
		body: "Directly, through an IoT gateway, from a LoRaWAN or NB-IoT network, or via a platform integration. Mix sensors, industrial machines, and any equipment you need in one solution. Browse pre-integrated devices from IoT Hub, or use emulators when hardware isn't ready.",
	},
	scale: {
		title: 'Predictable at any scale',
		body: 'Start with 5 devices on a single server and grow to 5+ million on a clustered deployment. Your dashboards, calculated fields, and device profiles carry over unchanged — you scale the deployment, not your solution. Performance scales linearly as you add nodes.',
		link: { text: 'Architecture reference', href: '/docs/pe/reference/architecture/' },
	},
};

/** Main names each use case's link after the case, where this branch writes a line per case. */
export const liveUseCaseLink = (title: string) => `${title} use case`;

/** The Cloud card's two actions as main labels them. On-premises already matches. */
const LIVE_PRODUCTS: Record<string, { primary?: Partial<ProductChoice['primary']>; action?: string }> = {
	'ThingsBoard Cloud': { primary: { label: 'Sign up and start in 5 min' }, action: 'Explore Cloud' },
};

export const liveProduct = (product: ProductChoice): ProductChoice => {
	const live = LIVE_PRODUCTS[product.name];
	return live ? { ...product, ...live, primary: { ...product.primary, ...live.primary } } : product;
};

/**
 * The ecosystem cards that read differently on main, keyed by this branch's name. `tiles` relabels
 * the IoT Hub card's category tiles by slug; the description is three paragraphs on main.
 */
const LIVE_ECOSYSTEM: Record<
	string,
	{ name?: string; href?: string; description?: string | string[]; tiles?: Record<string, string> }
> = {
	'Mobile App': { href: '/products/mobile/' },
	'IoT Hub': {
		description: [
			'One marketplace, two ways in - install what others built, or publish your own.',
			'Skip the multi-page integration guide: get IoT solution components running in one click, each reviewed by our team.',
			'Or list your own components - showcase your work or route users to your hardware.',
		],
		tiles: { 'solution-templates': 'Solution Templates' },
	},
};

export const liveEcosystemCard = (
	item: EcosystemItem
): Omit<EcosystemItem, 'description'> & { description: string | string[] } => {
	const live = LIVE_ECOSYSTEM[item.name];
	if (!live) return item;
	const { tiles, ...words } = live;
	return {
		...item,
		...words,
		tiles: tiles ? item.tiles?.map((tile) => ({ ...tile, label: tiles[tile.slug] ?? tile.label })) : item.tiles,
	};
};

/** The features heading, with no lede under it (`heading: 'live'` on the features section). */
export const LIVE_FEATURES = { title: 'ThingsBoard Features' };

/** Where the closing note's expert link goes on main: the contact form, its subject filled in. */
export const LIVE_CLOSING = { expertHref: '/contact-us/?subject=ThingsBoard%20Products' };
