import { TBMQ_SITE_URL } from '@models/tbmq';
import { CAREERS_URL } from '@models/careers';

/**
 * The footer candidate's contents (`FooterMap`), judged at `/internal/sections/footer/`.
 *
 * WHAT IT IS FOR. The footer in use says "Get Started · Documentation · Use cases · Blog · Services ·
 * Contact us" and nothing about what ThingsBoard is made of. This one maps the platform: the two ways
 * to run it, the products around it, what you build with it, and where each of those is documented.
 *
 * THE WORDS ARE THE SITE'S OWN, not new copy. The two groups of the map are the Products menu's
 * ("IoT platforms", "Product ecosystem", `data/navigation.ts`); each ecosystem product's line is its
 * homepage card's kicker (`data/homeEcosystem.ts`); the two platforms' lines are the Products
 * section's sentence split in two ("We host, scale and upgrade it for you, or you deploy it inside
 * your own network"). The link columns name pages that exist — every href below was checked against
 * `src/pages/` and `src/content/docs/` when it was written.
 */

export interface FooterProduct {
	name: string;
	line: string;
	href: string;
	/** A nav-sprite icon (`NavIcon`), or a `tabler:` name for the one product the menu does not list. */
	icon: string;
	/** The product's hue on the footer's dark ground: the dark menu's lighter brand shades. */
	hue: string;
	external?: boolean;
}

export interface FooterLink {
	label: string;
	href: string;
	external?: boolean;
}

export interface FooterColumn {
	title: string;
	links: FooterLink[];
	/** The column's own last word — "All use cases" — set apart from the list as a link with an arrow. */
	more?: FooterLink;
}

const NAV = '/src/assets/images/landings/nav';

/**
 * The two ways to run it. Their badges are the Products section's (the mark knocked out of a filled
 * squircle), in that section's fills: the product indigo for Cloud, PE green for On-premises. White
 * on either clears 4.5:1, so the ground under them does not matter.
 */
export const FOOTER_PLATFORMS: FooterProduct[] = [
	{
		name: 'ThingsBoard Cloud',
		line: 'We host, scale and upgrade it',
		href: '/products/paas/',
		icon: `${NAV}/thingsboard-c-icon.svg`,
		hue: '#3d50f5',
	},
	{
		name: 'ThingsBoard On-premises',
		line: 'Deploy it inside your own network',
		href: '/products/thingsboard-pe/',
		icon: `${NAV}/thingsboard-p-icon.svg`,
		hue: '#178649',
	},
];

/**
 * What goes around it, in the homepage's ecosystem order less its layout: the two that extend the
 * platform's reach first (Edge, Gateway), then the broker, analytics, the app and the marketplace.
 * Hues are the dark menu's (`[data-theme='dark'] --brand-*` in `_theme.scss`), because the light
 * ones fall under 3:1 on this ground; IoT Hub, which the menu does not carry, takes the amber its
 * card wears, lifted the same way.
 */
export const FOOTER_ECOSYSTEM: FooterProduct[] = [
	{
		name: 'Edge',
		line: 'Edge computing',
		href: '/products/thingsboard-edge/',
		icon: `${NAV}/thingsboard-e-icon.svg`,
		hue: '#2dd4bf',
	},
	{
		name: 'IoT Gateway',
		line: 'Protocol bridge',
		href: '/docs/iot-gateway/',
		icon: `${NAV}/gateway-icon.svg`,
		hue: '#a78bfa',
	},
	{
		name: 'TBMQ',
		line: 'Dedicated MQTT broker',
		href: TBMQ_SITE_URL,
		icon: `${NAV}/tbmq-icon.svg`,
		hue: '#4ade80',
		external: true,
	},
	{
		name: 'Trendz Analytics',
		line: 'Analytics & AI',
		href: '/products/trendz/',
		icon: `${NAV}/trendz-icon.svg`,
		hue: '#60a5fa',
	},
	{
		name: 'Mobile Application',
		line: 'iOS & Android',
		href: '/products/mobile/',
		icon: `${NAV}/tb-mobile-icon.svg`,
		hue: '#7da9d8',
	},
	{
		name: 'IoT Hub',
		line: 'Free marketplace',
		href: '/iot-hub/',
		icon: 'tabler:building-store',
		hue: '#fbbf24',
	},
];

/** Beside the map's two groups: what the platform costs and where it installs. */
export const FOOTER_PLATFORM_LINKS: FooterLink[] = [
	{ label: 'Pricing', href: '/pricing/' },
	{ label: 'Installation options', href: '/installations/' },
];

/**
 * The link columns. SOLUTIONS is the Use Cases menu's first five and the SCADA group; DEVELOPERS the
 * references a builder goes looking for, AI included; the last two are the Services, Partners,
 * Customers and Company menus folded together.
 *
 * NO "BUILD" COLUMN (dropped 2026-09-29). It listed capabilities — connect devices, rule engine,
 * twins, white-labeling — but seven of its eight links landed in the docs, which Developers already
 * covers; the header has no capabilities menu for it to mirror; and it said SCADA twice. It comes
 * back when the capability pages (`/device-management/`, `/iot-data-visualization/`…) are rebuilt,
 * pointing at those rather than at the docs.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
	{
		title: 'Solutions',
		links: [
			{ label: 'Smart energy', href: '/use-cases/smart-energy/' },
			{ label: 'Smart metering', href: '/use-cases/smart-metering/' },
			{ label: 'Fleet tracking', href: '/use-cases/site-fleet-tracking/' },
			{ label: 'Smart farming', href: '/use-cases/smart-farming/' },
			{ label: 'Environment monitoring', href: '/use-cases/environment-monitoring/' },
			{ label: 'SCADA systems', href: '/use-cases/scada/' },
			{ label: 'Case studies', href: '/case-studies/' },
		],
		more: { label: 'All use cases', href: '/use-cases/' },
	},
	{
		title: 'Developers',
		links: [
			{ label: 'Documentation', href: '/docs/pe/' },
			{ label: 'Getting started', href: '/docs/pe/getting-started/' },
			{ label: 'ThingsBoard CLI', href: '/docs/pe/user-guide/cli/' },
			{ label: 'AI and MCP server', href: '/docs/pe/iot-solutions-with-ai/' },
			{ label: 'REST API', href: '/docs/pe/reference/rest-api/' },
			{ label: 'MQTT API', href: '/docs/pe/reference/mqtt-api/' },
			{ label: 'Architecture', href: '/docs/pe/reference/architecture/' },
			{ label: 'Release notes', href: '/docs/pe/releases/' },
			{ label: 'GitHub', href: 'https://github.com/thingsboard/thingsboard', external: true },
		],
	},
	{
		title: 'Services',
		links: [
			{ label: 'Development services', href: '/services/development-services/' },
			{ label: 'Support plans', href: '/services/' },
			{ label: 'Trainings', href: '/services/trainings/' },
			{ label: 'Affiliate program', href: '/partners/affiliate/' },
			{ label: 'Hardware partners', href: '/partners/hardware/' },
			{ label: 'Distributors', href: '/partners/distributors/' },
		],
	},
	{
		title: 'Company',
		links: [
			{ label: 'About us', href: '/company/' },
			{ label: 'Clients feedback', href: '/clients-feedback/' },
			{ label: 'Blog', href: '/blog/' },
			{ label: 'Media kit', href: '/mediakit/' },
			{ label: 'Careers', href: CAREERS_URL, external: true },
			{ label: 'Contact us', href: '/contact-us/' },
		],
	},
];

/**
 * The social row: only the channels that are kept up (checked 2026-09-29). GitHub shipped 4.4 that
 * day, YouTube's tutorials are the evergreen ones, LinkedIn posts daily. Left out: X (silent since
 * August 2025), Stack Overflow (no question for ten months, most unanswered), Instagram (team life,
 * not the product), Facebook (kept up, but re-posts with little reach). The shared
 * `data/socialNetworks.ts` is untouched: the footer in use still reads all seven.
 */
export const FOOTER_SOCIAL = ['simple-icons:github', 'simple-icons:youtube', 'simple-icons:linkedin'];

/** The bottom line's links. The cookie policy is the only legal page the site has. */
export const FOOTER_LEGAL: FooterLink[] = [{ label: 'Cookie policy', href: '/cookie-policy/' }];

/** The newsletter block, word for word from the footer in use. */
export const FOOTER_NEWSLETTER = {
	label: 'Keep up with ThingsBoard',
	lede: 'Release notes and IoT know-how. Roughly monthly, no sales mail.',
	consent: 'By subscribing you agree to receive newsletters from ThingsBoard, Inc.',
	action: 'https://static.mailerlite.com/webforms/submit/r9r9x7',
};

/**
 * Under the logo: main's meta description for the homepage (`LIVE_HERO.pageDescription`) less its
 * "ThingsBoard is an", which the logo above it already says. Not this branch's older description:
 * that one calls the platform open-source, and from 4.4 it is source-available.
 */
export const FOOTER_TAGLINE =
	'All-in-one IoT platform that gives you everything you need to build, deploy, and scale IoT solutions.';
