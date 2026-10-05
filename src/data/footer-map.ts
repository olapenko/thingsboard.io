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
	/**
	 * A nav-sprite icon (`NavIcon`), a `tabler:` name for the one product the menu does not list, or
	 * `mark` for the ThingsBoard mark itself.
	 */
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
	/**
	 * The column's own last words — Solutions' "All use cases" and "Case studies" — set apart from the
	 * list as links with an arrow: sections of the site, where the list above them is pages.
	 */
	more?: FooterLink[];
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
		// says where it runs.
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
		// Named as the menu and its own page name it ("IoT Mobile Application builder"); its mark is the
		// ThingsBoard logo in the app's own green, as the menu draws it too.
		name: 'Mobile Application',
		line: 'iOS & Android',
		href: '/products/mobile/',
		// The ThingsBoard mark, not the menu's phone: the app's icon IS the mark, and the ecosystem
		// card shows it that way.
		icon: 'mark',
		hue: '#4ade80',
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
 * `focus` layout: the two pages that sit in the panel's one "Platform" group beside the two
 * platforms, as peers — the product in its two forms, then what it costs and where it installs. A
 * mark and a name each, no line: a "Start here" group over them made Pricing read as a first step,
 * and two icon links at the row's end read as an afterthought. A page here is not repeated in the
 * columns below.
 */
export const FOOTER_HIGHLIGHTS: (FooterLink & { icon: string })[] = [
	{ label: 'Pricing', href: '/pricing/', icon: 'tabler:tag' },
	{ label: 'Installation options', href: '/installations/', icon: 'tabler:download' },
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
 * The link columns, the menu's sections in the menu's order (Products is the platform map above
 * them): one heading each, and A PAGE HAS ONE NAME AND ONE HOME in the menu and here. The footer may
 * show fewer of a section's links; it never moves one to another heading or calls it something else
 * (2026-10-05). So the case studies are Solutions', as in the menu, a plain link after the use cases
 * with All use cases the one arrowed link; Services closes on Talk to an expert, as its menu list
 * does; Docs is the menu's word. The partner programmes, a group in the menu's Company, are one link
 * here, to their hub (`/partners/`): a column of their three read as half a column.
 *
 * NO "BUILD" COLUMN (dropped 2026-09-29). It listed capabilities — connect devices, rule engine,
 * twins, white-labeling — but seven of its eight links landed in the docs, which the Docs column
 * already covers; the header has no capabilities menu for it to mirror; and it said SCADA twice. It
 * comes back when the capability pages (`/device-management/`, `/iot-data-visualization/`…) are
 * rebuilt, pointing at those rather than at the docs.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
	{
		title: 'Solutions',
		links: [
			{ label: 'Smart energy', href: '/use-cases/smart-energy/' },
			{ label: 'Smart metering', href: '/use-cases/smart-metering/' },
			{ label: 'Site fleet tracking', href: '/use-cases/site-fleet-tracking/' },
			{ label: 'SCADA systems', href: '/use-cases/scada/' },
			{ label: 'Case studies', href: '/case-studies/' },
		],
		more: [{ label: 'All use cases', href: '/use-cases/' }],
	},
	{
		title: 'Services',
		links: [
			{ label: 'Development services', href: '/services/development-services/' },
			{ label: 'Support plans', href: '/services/' },
			{ label: 'Trainings', href: '/services/trainings/' },
		],
		more: [{ label: 'Talk to an expert', href: '/contact-us/' }],
	},
	{
		// Getting started first: it is where a newcomer goes, and Documentation is where everyone
		// else already knows to look. No API or protocol references (REST, connectivity): they are
		// one click inside Documentation, and a footer is not a docs index.
		title: 'Docs',
		links: [
			{ label: 'Getting started', href: '/docs/pe/getting-started/' },
			{ label: 'Documentation', href: '/docs/pe/' },
			{ label: 'ThingsBoard CLI', href: '/docs/pe/user-guide/cli/' },
			{ label: 'Release notes', href: '/docs/pe/releases/releases-table/' },
			{ label: 'GitHub', href: 'https://github.com/thingsboard/thingsboard', external: true },
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
			{ label: 'Partners', href: '/partners/' },
			{ label: 'Contact us', href: '/contact-us/' },
		],
	},
];

/**
 * The Follow line: only the channels that are kept up (checked 2026-09-29) and that are news, not
 * product. YouTube's tutorials are the evergreen ones, LinkedIn posts daily. GitHub is kept up too
 * (4.4 shipped that day) but is linked once, in Docs, where the source is looked for. Left out: X (silent since
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

/**
 * THE DOCS FOOTER (`SiteFooter` at the `docs` density): lighter than the map — no platform grid,
 * no newsletter — and richer than the six-link row it replaces. Three short columns: where the
 * platform is run and bought, where to learn it, and the company. Every page named is one the map
 * carries; the first column's marks are the map's platform badges. The follow line and the base row
 * are the map's own.
 */
export const FOOTER_DOCS_COLUMNS: FooterColumn[] = [
	{
		title: 'Platform',
		links: [
			{ label: 'ThingsBoard Cloud', href: '/products/paas/' },
			{ label: 'ThingsBoard', href: '/products/thingsboard-pe/' },
			{ label: 'Pricing', href: '/pricing/' },
			{ label: 'Installation options', href: '/installations/' },
			{ label: 'License portal', href: 'https://license.thingsboard.io/', external: true },
		],
	},
	{
		title: 'Learn',
		links: [
			{ label: 'Getting started', href: '/docs/pe/getting-started/' },
			{ label: 'Documentation', href: '/docs/pe/' },
			{ label: 'Use cases', href: '/use-cases/' },
			{ label: 'Case studies', href: '/case-studies/' },
			{ label: 'IoT Hub', href: '/iot-hub/' },
			{ label: 'Blog', href: '/blog/' },
		],
	},
	{
		title: 'Company',
		links: [
			{ label: 'Support plans', href: '/services/' },
			{ label: 'Partners', href: '/partners/' },
			{ label: 'Clients feedback', href: '/clients-feedback/' },
			{ label: 'Contact us', href: '/contact-us/' },
			{ label: 'Careers', href: CAREERS_URL, external: true },
		],
	},
];
