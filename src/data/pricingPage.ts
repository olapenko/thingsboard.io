/**
 * The pricing page's DRAFT, in the product pages' language — `/internal/pages/pricing/`.
 *
 * THE NUMBERS ARE MAIN'S. `src/data/pricing-live/` is origin/main's `src/data/pricing/` at
 * `b6abdca6a`, copied byte for byte: main ships ThingsBoard 4.4's pricing (Cloud, Private Cloud and
 * On-premises — TBMQ and Community Edition left the page), and this branch's own `src/data/pricing/`
 * still carries the ladder before it (On-premises from Maker $10, which `onPremPage.ts` already flags
 * as stale). The shipped `/pricing/` on this branch reads the old files, so they are left alone.
 * Re-sync after main moves, file by file:
 *
 *   git show origin/main:src/data/pricing/<file> > src/data/pricing-live/<file>
 *
 * What lives HERE is only the frame: each deployment's name, mark and one line, the band that
 * compares them, and the page's own headings. Every price below is DERIVED from the plan data, so
 * the hero, the band and the cards cannot disagree about what something costs.
 */
import { tbCloudData } from '@data/pricing-live/tb-cloud';
import { tbPrivateCloudData } from '@data/pricing-live/tb-private-cloud';
import { tbPerpetualHero, tbSelfManagedData } from '@data/pricing-live/tb-self-managed';
import type { FaqCategory, PlanCard } from '@data/pricing-live/types';

/**
 * Main's sub-tab ids, unchanged, so every `?product=` link already out there — the Cloud and
 * On-premises pages' "See plans", the FAQ answers — lands on the right deployment here too.
 */
export type DeploymentId = 'thingsboard-cloud' | 'thingsboard-private-cloud' | 'thingsboard-pe';

/** "$49", "€1,349": the cards' own format, with a thin comma rather than main's space. */
export function formatPrice(price: number | null, currency: string): string {
	if (price === null) return 'Custom';
	return `${currency}${price.toLocaleString('en-US')}`;
}

/** The cheapest plan that costs something, for "Paid plans from …". */
const lowestPaid = (plans: PlanCard[]) =>
	plans.filter((p) => p.price !== null && p.price > 0).sort((a, b) => a.price! - b.price!)[0];

const cloudFrom = lowestPaid(tbCloudData.na.plans);
const privateFrom = lowestPaid(tbPrivateCloudData.plans);
const onPremFrom = lowestPaid(tbSelfManagedData.payg.plans);
/** "5,000 devices included" → "5,000 devices", the Launch plan's first line. */
const privateFromDevices = privateFrom.features[0]?.text.replace(/ included$/, '') ?? '';
/** "Starting from $4,999" → "$4,999". */
const perpetualFrom = tbPerpetualHero.priceLabel?.replace(/^Starting from /, '') ?? '';

export interface ChoiceCta {
	text: string;
	icon: string;
	href: string;
	variant: 'primary' | 'secondary';
	attrs?: Record<string, string>;
}

export interface Deployment {
	id: DeploymentId;
	/** As main's tabs name them. */
	name: string;
	/** The Cloud page's pair, `cloud` / `cloud-lock`, and the server On-premises carries everywhere. */
	icon: string;
	/** Under the hero's switch while this one is selected. Main's tab tooltips, cut to one line. */
	caption: string;
	/** The plans section's heading. */
	title: string;
	/** Main's section subtitle for it. */
	subtitle: string;
	/** The comparison band's card. */
	choice: {
		price: string;
		priceNote: string;
		summary: string;
		points: string[];
		cta: ChoiceCta;
	};
	/** The FAQ heading, as main titles each context. */
	faqTitle: string;
}

const CONTACT_PRIVATE_CLOUD =
	'/contact-us/?subject=Private%20Cloud&pcorder&message=I%20am%20interested%20in%20Private%20Cloud';
export const CONTACT_ON_PREM =
	'/contact-us/?subject=ThingsBoard%20Products&message=I%20have%20a%20question%20about%20ThingsBoard%20On-premises';

export const DEPLOYMENTS: Deployment[] = [
	{
		id: 'thingsboard-cloud',
		name: 'Cloud',
		icon: 'tabler:cloud',
		caption: 'Fully managed ThingsBoard. We run the infrastructure, upgrades and reliability.',
		title: 'ThingsBoard Cloud plans',
		subtitle: tbCloudData.na.sectionSubtitle,
		choice: {
			price: 'Free',
			priceNote: `Paid plans from ${formatPrice(cloudFrom.price, cloudFrom.currency)} a month`,
			summary: 'The fastest start, on shared infrastructure.',
			// The Cloud page's Public Cloud card, to the word.
			points: ['Shared multi-tenant environment', 'Under 5 minutes, self-serve', 'No card required to start'],
			cta: {
				text: 'Start for free',
				icon: 'tabler:cloud-filled',
				href: 'https://thingsboard.cloud/signup',
				variant: 'primary',
				// Opens the region dialog, as every Cloud sign-up on the new pages does.
				attrs: { 'data-cloud-auth': 'signup' },
			},
		},
		faqTitle: 'ThingsBoard Cloud FAQ',
	},
	{
		id: 'thingsboard-private-cloud',
		name: 'Private Cloud',
		icon: 'tabler:cloud-lock',
		caption: 'A dedicated, isolated ThingsBoard cluster, run by our team for you.',
		title: 'Private Cloud plans',
		subtitle: tbPrivateCloudData.sectionSubtitle,
		choice: {
			price: `From ${formatPrice(privateFrom.price, privateFrom.currency)}`,
			priceNote: `Per month, ${privateFromDevices}`,
			summary: 'A dedicated, isolated cluster with a stronger SLA.',
			// The Cloud page's Private Cloud card, to the word.
			points: [
				'Dedicated, isolated Kubernetes cluster',
				'Provisioned by our team in hours',
				'99.9% – 99.99% uptime SLA',
			],
			cta: { text: 'Contact us', icon: 'tabler:message-circle', href: CONTACT_PRIVATE_CLOUD, variant: 'secondary' },
		},
		faqTitle: 'ThingsBoard Private Cloud FAQ',
	},
	{
		id: 'thingsboard-pe',
		name: 'On-premises',
		icon: 'tabler:server',
		caption: 'ThingsBoard on infrastructure you control: your own data centre, or your own cloud account.',
		title: 'On-premises plans',
		// The subtitle main's PAGE prints, not the data file's "Flexible monthly licensing for your own
		// infrastructure." — the page's says what every plan includes, which is the useful half.
		subtitle: 'Every plan includes unlimited customers, dashboards, integrations, API calls, data points and messages.',
		choice: {
			price: 'Free',
			priceNote: `Paid plans from ${formatPrice(onPremFrom.price, onPremFrom.currency)} a month, perpetual from ${perpetualFrom}`,
			summary: 'Run it yourself, on your own servers.',
			// The On-premises page's two cards, one reason each.
			points: [
				'Free for commercial use to 100 devices on one server',
				'Subscribe monthly, or buy a perpetual license once',
				'Change tier any time, prorated automatically',
			],
			cta: { text: 'Install for free', icon: 'tabler:server', href: '/docs/pe/installation/', variant: 'secondary' },
		},
		faqTitle: 'ThingsBoard On-premises FAQ',
	},
];

/** Cloud's default: the shipped page opens on it, and so does main's. */
export const DEFAULT_DEPLOYMENT: DeploymentId = 'thingsboard-cloud';

export const pricingHero = {
	title: 'ThingsBoard pricing',
	subtitle: 'Start free on ThingsBoard Cloud or on your own servers, and move up a plan as your fleet grows.',
};

/** On-premises' second mode: main's words for both states of its heading. */
export const onPremPerpetual = {
	title: 'On-premises perpetual license',
	subtitle: tbSelfManagedData.perpetual.sectionSubtitle,
};

export const pricingChoice = {
	title: 'Not sure which one fits?',
	lead: 'All three run the same platform. They differ in who runs the servers, and in how you pay for it.',
};

export const pricingClosing = {
	title: 'Ready to start?',
	lead: 'Start free on ThingsBoard Cloud in under five minutes, or talk to our team about the plan that fits your fleet.',
	primary: {
		text: 'Try Cloud for free',
		href: 'https://thingsboard.cloud/signup',
		attrs: { 'data-cloud-auth': 'signup' } as Record<string, string>,
	},
	secondary: {
		text: 'Talk to an expert',
		href: '/contact-us/?subject=ThingsBoard%20Products&message=I%20have%20a%20question%20about%20ThingsBoard%20pricing',
	},
};

/**
 * Main's `getLicense()` builds this on click and adds the visitor's UTM and referral ids from
 * `localStorage`. The draft states the plain address; the click handler comes back with the page.
 */
export const licenseSignup = (plan: PlanCard) =>
	plan.productId && plan.planId
		? `https://license.thingsboard.io/signup?createSubscription=true&productId=${plan.productId}&planId=${plan.planId}`
		: plan.ctaHref;

/**
 * The add-ons wear the homepage's ecosystem badges (`homeEcosystem`): the product's mark knocked out
 * of a squircle in its own accent, so Edge on this page is the Edge of the cards a visitor has
 * already seen. Offline Mode is not a product and has no mark, so it takes a glyph on the ink.
 * Keyed by main's add-on NAME, which is what the three deployments share; a name missing here fails
 * the build rather than rendering a blank tile.
 */
export interface AddOnMark {
	/** An ecosystem mark, knocked out white of the accent; or a Tabler glyph, drawn white on it. */
	src?: string;
	icon?: string;
	accent: string;
}

export const ADDON_MARKS: Record<string, AddOnMark> = {
	'Edge Computing': { src: '/src/assets/images/landings/ce/thingsboard-e-icon.svg', accent: '#008478' },
	'Trendz Analytics': { src: '/src/assets/images/landings/ce/trendz-icon.svg', accent: '#1976d2' },
	'White-labeled Mobile App': { src: '/src/assets/images/landings/thingsboard-mark.svg', accent: '#178649' },
	'Offline Mode': { icon: 'tabler:wifi-off', accent: '#17181c' },
};

/**
 * The conservative draft's marks, where they differ from the long one's. The Mobile App is a PHONE:
 * the ThingsBoard mark there said "the platform" rather than "an app", and its green sat on the
 * On-premises tab's own green. It takes the site's violet (`--color-accent-violet`, 5.6:1 under
 * white), the one hue no other add-on or page accent uses. Offline Mode lifts from near-black to a
 * slate, so a tile with no product behind it stops being the heaviest of the three.
 */
export const CONSERVATIVE_ADDON_MARKS: Record<string, AddOnMark> = {
	...ADDON_MARKS,
	'White-labeled Mobile App': { icon: 'tabler:device-mobile', accent: '#7b3fe4' },
	'Offline Mode': { icon: 'tabler:wifi-off', accent: '#475467' },
};

export function addonMark(name: string, marks: Record<string, AddOnMark> = ADDON_MARKS) {
	const mark = marks[name];
	if (!mark) throw new Error(`pricingPage: no mark for the add-on "${name}"`);
	return mark;
}

/**
 * Main's `faqAnswerMap`, to its rule: every answer as plain text, cut at 120 characters on a word
 * boundary with an ellipsis. Main fills a plan line's tooltip from it when the line names a
 * `faqId` and carries no tooltip of its own; the conservative draft does the same.
 */
export function answerSnippets(categories: FaqCategory[]): Map<string, string> {
	const map = new Map<string, string>();
	for (const category of categories) {
		for (const item of category.items) {
			const plain = item.answer
				.replace(/<[^>]+>/g, '')
				.trim()
				.replace(/\s+/g, ' ');
			map.set(item.id, plain.length > 120 ? plain.slice(0, 120).replace(/\s+\S*$/, '') + '…' : plain);
		}
	}
	return map;
}

/**
 * The conservative draft's words, which are main's (`src/pages/pricing/index.astro` at b6abdca6a):
 * its tab tooltips, its upsell cards, its section titles. Kept here so the two drafts read from one
 * file, and so a re-sync with main has one place to look.
 */
export const mainTabTooltips: Record<DeploymentId, string> = {
	'thingsboard-pe':
		'On-premises lets you run ThingsBoard on infrastructure you control — your own data centre or your own cloud account. Ideal when you need full environment control and prefer to manage operations in-house.',
	'thingsboard-cloud':
		'Fully managed ThingsBoard, built for speed. We handle infrastructure, upgrades, and reliability so your team can focus on shipping IoT solutions faster.',
	'thingsboard-private-cloud':
		'Private Cloud is a dedicated, isolated ThingsBoard cluster run by us for you. You get enterprise-grade control and security—without the ops overhead.',
};

/** Main's tab order: On-premises, then Cloud (the default), then Private Cloud. */
export const MAIN_TAB_ORDER: DeploymentId[] = ['thingsboard-pe', 'thingsboard-cloud', 'thingsboard-private-cloud'];

export const mainCopy = {
	title: 'ThingsBoard Products Pricing',
	upsellPrivateCloud: {
		heading: 'Require dedicated infrastructure for unique enterprise needs?',
		cta: 'See Private Cloud options',
	},
	// Main's card opens a calculator ("Use our calculator to estimate the best plan for your
	// needs." → "Estimate your cost"). The calculators' arithmetic lives in main's page script, not
	// in their components, so the draft sends the question to a person until it is ported.
	upsellNotSure: { heading: 'Not sure which plan fits?', cta: 'Talk to an expert' },
	// On-premises' licensing toggle: main's labels and the two tooltips it gives them.
	licensing: {
		payg: {
			label: 'Subscription',
			tip: 'A monthly subscription priced by the devices and assets you need — move up or down a tier as you grow.',
		},
		perpetual: {
			label: 'Perpetual',
			tip: 'Perpetual is a one-time license that turns your IoT platform into a long-term asset — predictable costs, full control of your roadmap, and a strong foundation for enterprise scale.',
		},
	},
	pcBillingHint: 'Save 10% on annual plans',
	onPremPayg: {
		title: 'Subscription plans',
		subtitle: 'Every plan includes unlimited customers, dashboards, integrations, API calls, data points and messages.',
	},
	onPremPerpetual: { title: 'Perpetual License', subtitle: 'One-time payment, run forever on your infrastructure.' },
	addOns: {
		title: 'Add-ons',
		subtitle: 'Customize your deployment with optional features to suit your business needs.',
	},
	topUps: 'Top-ups',
	comparison: {
		title: 'Additional features',
		subtitle: 'Extra details and upgrade options for all subscription plans.',
		caption: 'ThingsBoard Private Cloud: additional features by plan',
	},
	perpetualBenefits: 'Why choose a Perpetual License?',
	perpetualHelp: 'Let us help you identify the best option for your business',
	contactUs: 'Contact us',
};
