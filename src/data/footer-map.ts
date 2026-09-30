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
	/**
	 * A group under the column's own list, with its own small heading and its own arrowed last link:
	 * Solutions' Customers, the header's Customers menu (case studies, clients feedback) folded in
	 * under the use cases they prove.
	 */
	sub?: { title: string; links: FooterLink[]; more?: FooterLink };
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
		// Named as the menu names it: "ThingsBoard", beside "ThingsBoard Cloud". The map's line under it
		// says where it runs; the strip has no line, and the pair still reads as the platform and its
		// hosted form.
		name: 'ThingsBoard',
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

/**
 * `focus` layout: the pages the panel puts beside the two platforms, in place of the ecosystem (which
 * becomes a link column). The ones a reader deciding goes looking for — what it costs, how it
 * installs, who runs it already — and the one a customer already deciding needs. One indigo for all
 * four, lifted like the product hues, so they read as pages rather than as products. A page here is
 * not repeated in the columns below.
 */
export const FOOTER_HIGHLIGHTS: FooterProduct[] = [
	{
		name: 'Pricing',
		line: 'Cloud plans and self-hosted licenses',
		href: '/pricing/',
		icon: 'tabler:receipt-2',
		hue: '#8b9bff',
	},
	{
		name: 'Installation options',
		line: 'Every way to install it',
		href: '/installations/',
		icon: 'tabler:download',
		hue: '#8b9bff',
	},
	{
		name: 'Case studies',
		line: 'Customer projects in production',
		href: '/case-studies/',
		icon: 'tabler:award',
		hue: '#8b9bff',
	},
	{
		name: 'License portal',
		line: 'Buy or renew license keys',
		href: 'https://license.thingsboard.io/',
		icon: 'tabler:key',
		hue: '#8b9bff',
		external: true,
	},
];

/** Under the map, across both groups, on the left: what it costs and where it installs. */
export const FOOTER_PLATFORM_LINKS: FooterLink[] = [
	{ label: 'Pricing', href: '/pricing/' },
	{ label: 'Installation options', href: '/installations/' },
];

/**
 * The same row's right end: the License Portal, the "License Server" account the pricing FAQ sends
 * people to, for the self-hosted customer buying or renewing keys. Captioned, because the name alone
 * does not say who it is for — the two links beside it are for someone still choosing.
 */
export const FOOTER_LICENSE_PORTAL = {
	caption: 'Buying or renewing a license?',
	label: 'License portal',
	href: 'https://license.thingsboard.io/',
};

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
/**
 * WIP — PARKED 2026-09-29, not rendered. Case studies are Solutions' seventh link and Clients feedback
 * sits in Company, which splits the two customer-proof pages and makes case studies read as one more
 * use case. This group under Solutions — the header's Customers menu, case studies arrowed like
 * "All use cases →" — was tried and pulled back undecided. To try it again: set it as `sub` on the
 * Solutions column and drop the two links from Solutions and Company; `FooterMap` renders `sub`.
 */
export const FOOTER_CUSTOMERS_WIP: NonNullable<FooterColumn['sub']> = {
	title: 'Customers',
	links: [{ label: 'Clients feedback', href: '/clients-feedback/' }],
	more: { label: 'Case studies', href: '/case-studies/' },
};

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
		// Getting started first: it is where a newcomer goes, and Documentation is where everyone
		// else already knows to look. One API link, not two: REST is the one people build ON; the
		// device-side protocols (MQTT, HTTP, CoAP, LwM2M, SNMP) are what the connectivity guide lists.
		title: 'Developers',
		links: [
			{ label: 'Getting started', href: '/docs/pe/getting-started/' },
			{ label: 'Documentation', href: '/docs/pe/' },
			{ label: 'Device connectivity', href: '/docs/pe/connect-iot-devices/' },
			{ label: 'REST API', href: '/docs/pe/reference/rest-api/' },
			{ label: 'ThingsBoard CLI', href: '/docs/pe/user-guide/cli/' },
			{ label: 'AI and MCP server', href: '/docs/pe/iot-solutions-with-ai/' },
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
 * The Follow line: only the channels that are kept up (checked 2026-09-29) and that are news, not
 * product. YouTube's tutorials are the evergreen ones, LinkedIn posts daily. GitHub is kept up too
 * (4.4 shipped that day) but is linked once, in Developers, where the source is looked for. Left out: X (silent since
 * August 2025), Stack Overflow (no question for ten months, most unanswered), Instagram (team life,
 * not the product), Facebook (kept up, but re-posts with little reach). The shared
 * `data/socialNetworks.ts` is untouched: the footer in use still reads all seven.
 */
export const FOOTER_SOCIAL = [
	{ icon: 'simple-icons:youtube', name: 'YouTube' },
	{ icon: 'simple-icons:linkedin', name: 'LinkedIn' },
];

/**
 * The bottom line's legal links: the ones that apply to anyone on any page. There is no site-wide
 * terms or privacy page, so the pair is Cloud's — the service most readers sign up for — and the
 * cookie policy is the site's own (the cookie banner links it too). Named as Cloud's, not as plain
 * "Terms" and "Privacy": they cover the service, and a reader of this site is not only a Cloud user.
 *
 * Left to their own pages: the DPA (both Cloud terms pages link it), the License agreement and the
 * On-premises EULA (paid-licence documents; the On-premises page and the License Portal carry them),
 * the EU Cloud pair, and the Community Grant agreement.
 */
export const FOOTER_LEGAL: FooterLink[] = [
	{ label: 'Cloud terms of use', href: '/products/paas/terms-of-use/' },
	{ label: 'Cloud privacy policy', href: '/products/paas/privacy-policy/' },
	{ label: 'Cookie policy', href: '/cookie-policy/' },
];

/**
 * The newsletter block: the heading and consent line from the footer in use; the lede rewritten
 * (2026-09-30). It promised "no sales mail", and the list does carry product news, so the promise
 * is the one that holds — no spam — and "roughly monthly" becomes plain words. "About once a
 * month" was 406px against the form's 400 and left "No spam." on a line of its own; this is 366.
 */
export const FOOTER_NEWSLETTER = {
	label: 'Keep up with ThingsBoard',
	lede: 'Release notes and IoT know-how, once a month. No spam.',
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
