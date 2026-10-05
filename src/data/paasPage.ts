/**
 * ThingsBoard Cloud page content.
 *
 * THE COPY IS MAIN'S. The content team edits it in `thingsboard.one` (Andrii Shvaika's Cloud passes
 * of 2026-09-25: the shared tier renamed to plain "Cloud", the table cut to where the two differ,
 * the managed case argued in the tiles, "Platform features" dropped), and upstream main carries it
 * with the SLA wording rules on top (#676: "uptime SLA", `99.9%–99.99%` closed up). Main keeps it
 * in `paas-page.ts` and `cloud-comparison.ts`; this file holds the same words in the kit's shapes.
 * Change the words there first, then here — a handoff carrying older copy would revert theirs.
 *
 * Kept as data rather than inlined in the page so the two things that change on different clocks —
 * commercial copy and the design it sits in — can be edited apart.
 */

import type { FaqCategory } from '@data/pricing/types';
import type { Benefit, ChoiceOption, CompareGroup, CompareRow } from '@data/product-blocks';
import { CLOUD_SIGNUP } from '@data/cta-destinations';
import { pickCategory } from '@data/pricing/faq/pick-category';
import { tbCloudFaq } from '@data/pricing/faq/tb-cloud';
import { tbPrivateCloudFaq } from '@data/pricing/faq/tb-private-cloud';

/** The Private Cloud enquiry form. `pcorder` is the flag the contact form routes on — keep it. */
const CONTACT_PRIVATE_CLOUD =
	'/contact-us/?subject=Private%20Cloud&pcorder&message=I%20am%20interested%20in%20Private%20Cloud';

/** The six tiles under "Why ThingsBoard Cloud": the managed case, main's words and hues. */
export const paasBenefits: Benefit[] = [
	{
		icon: 'tabler:box-multiple',
		color: '#3d50f5',
		title: 'All-in-one IoT Platform',
		description:
			'From device connectivity through data processing to the end-user interface — no separate services to license, integrate and keep in sync.',
	},
	{
		icon: 'tabler:server-cog',
		color: '#c2410c',
		title: 'We run it, you build on it',
		description:
			'No servers to size, no patches to apply, no upgrade windows. Infrastructure, version upgrades, daily backups and round-the-clock monitoring are ours.',
	},
	{
		icon: 'tabler:heartbeat',
		color: '#047857',
		title: 'Built to stay up',
		description: 'Deployed across multiple availability zones with replicated storage, under a contractual uptime SLA.',
	},
	{
		icon: 'tabler:certificate',
		color: '#7c3aed',
		title: 'Security & compliance',
		description:
			'ThingsBoard is ISO 27001 and ISO 9001 certified, and every environment runs in ISO 27001 and PCI-DSS certified data centres.',
	},
	{
		icon: 'tabler:world',
		color: '#007c7b',
		title: 'Data residency you choose',
		description:
			'ThingsBoard Cloud runs in North America or Europe. Private Cloud adds APAC, with the region chosen when your cluster is provisioned.',
	},
	{
		icon: 'tabler:transfer-in',
		color: '#006bc7',
		title: 'One platform, anywhere',
		description:
			'ThingsBoard Cloud, Private Cloud, or your own infrastructure — moving between them moves your solution rather than rebuilding it.',
	},
];

/**
 * The two-card chooser under the comparison table, and the page's only call to action for the two
 * deployments. Main's words; the buttons are the kit's (`variant`, the region dialog's `attrs`).
 *
 * `price` is the entry number and nothing more. The full ladder is `/pricing/`'s job, which
 * `plansHref` deep-links into. Both numbers are the ones the matrix states under "Starting price".
 */
export const paasChoice: { title: string; lead: string; options: ChoiceOption[] } = {
	title: 'Start free, or talk to us',
	lead: 'ThingsBoard Cloud is self-serve and running in five minutes. Private Cloud is a dedicated cluster our team manages for you, with a stronger uptime SLA and higher throughput.',
	options: [
		{
			// The pair is `cloud` / `cloud-lock`: one base glyph, and the lock is the only difference.
			name: 'Cloud',
			icon: 'tabler:cloud',
			price: 'Free',
			priceNote: 'Free tier up to 5 devices',
			summary: 'The fastest, shared-infrastructure start.',
			points: ['Shared multi-tenant environment', 'Under 5 minutes, self-serve', 'No card required to start'],
			// The glyph is the hero pair's own — the action's mark, not the option's.
			cta: {
				text: 'Start for free',
				icon: 'tabler:cloud-filled',
				href: CLOUD_SIGNUP.href,
				attrs: CLOUD_SIGNUP.attrs,
				variant: 'primary',
			},
			plansHref: '/pricing/?product=thingsboard-cloud',
		},
		{
			name: 'Private Cloud',
			icon: 'tabler:cloud-lock',
			price: 'From $1,499',
			priceNote: 'Per month, 5,000 devices',
			summary: 'A dedicated, isolated cluster with a stronger uptime SLA.',
			points: ['Dedicated, isolated Kubernetes cluster', 'Provisioned by our team in hours', '99.9%–99.99% uptime SLA'],
			// Outlined rather than filled: two solid purples side by side read as one choice twice.
			cta: { text: 'Contact us', icon: 'tabler:message-circle', href: CONTACT_PRIVATE_CLOUD, variant: 'secondary' },
			plansHref: '/pricing/?product=thingsboard-private-cloud',
		},
	],
};

// The matrix's rows read Cloud, then Private Cloud — the order of `paasChoice.options`, which
// names the columns. Main's `cloud-comparison.ts`, marketing-approved and kept verbatim: it is
// deliberately not derived from the pricing data, so when pricing moves, update both.

/** The unlabelled first row of the matrix, above the group headings. */
export const paasCompareLead: CompareRow = {
	label: 'Best for',
	values: [
		'Prototypes, MVPs and production up to a few thousand devices',
		'Enterprises, regulated industries and mission-critical fleets',
	],
};

/** Where the two differ. */
export const paasCompare: CompareGroup[] = [
	{
		title: 'Infrastructure & scale',
		icon: 'tabler:stack-2',
		color: '#3d50f5',
		rows: [
			{
				label: 'Infrastructure model',
				values: ['Shared multi-tenant environment', 'Dedicated, isolated Kubernetes cluster'],
			},
			{ label: 'Tenants & users', values: ['One tenant per subscription', 'Unlimited tenants, customers and users'] },
			{ label: 'Devices included', values: ['Up to 5,000', '5,000 and up'] },
			{ label: 'Throughput', values: ['Up to 2B data points / month', '2B+ data points / month'] },
			{
				label: 'Region choice',
				values: ['North America or Europe', 'Europe, North America or APAC — AWS, Azure or GCP on request'],
			},
		],
	},
	{
		title: 'Reliability & operations',
		icon: 'tabler:activity',
		color: '#047857',
		rows: [
			{ label: 'Uptime SLA', values: ['99.9%', '99.9%–99.99% by plan'] },
			{
				label: 'Backups',
				values: ['Automatic, managed by us', 'Nightly snapshots in a separate region, 7-day retention'],
			},
			{
				label: 'Maintenance windows',
				values: ['Scheduled by us', 'Suggested slots, or your choice from the Scale plan'],
			},
			{ label: 'Dev/Test environment', values: ['—', 'Available as an add-on'] },
		],
	},
	{
		title: 'Compliance',
		icon: 'tabler:shield-lock',
		color: '#006bc7',
		rows: [
			{ label: 'Certifications', values: ['ISO 27001 and ISO 9001 certified', 'ISO 27001 and ISO 9001 certified'] },
			{ label: 'Data centres', values: ['ISO 27001 and PCI-DSS certified', 'ISO 27001 and PCI-DSS certified'] },
			{
				label: 'Data export on exit',
				values: ['Via REST API and the dashboard', 'Full encrypted database dump, 60 days to retrieve'],
			},
		],
	},
	{
		title: 'Commercials',
		icon: 'tabler:headset',
		color: '#c2410c',
		rows: [
			{
				label: 'Starting price',
				values: ['Free up to 5 devices, then from $49 / month for 50 devices', 'From $1,499 / month for 5,000 devices'],
			},
			{
				label: 'Per-device price at scale',
				values: [
					'$0.30 / device / month, from 1,000 devices up',
					'$0.01 to $0.10 / device / month, lower as the fleet grows',
				],
			},
			{ label: 'White-labeling', values: ['From the Pilot plan', 'Included on every plan'] },
			{
				label: 'Support',
				values: [
					'Community on Free, then help desk from Pilot',
					'Support portal on every plan, dedicated engineer on Enterprise',
				],
			},
			{ label: 'Commitment', values: ['Cancel anytime', '30 days\u2019 notice, no setup or cancellation fee'] },
		],
	},
];

/**
 * The FAQ, assembled from the pricing FAQ as main's `paas-faq.ts` does, so the two pages cannot
 * drift: the ThingsBoard Cloud categories wholesale (minus the Trendz and Edge add-on ones, which
 * belong to the pricing context), and the Private Cloud "General" category appended as its own tab.
 *
 * Ids do not collide across the two sources: every Private Cloud item is `tb-private-cloud-*`, and
 * no ThingsBoard Cloud item uses that prefix.
 */
const PUBLIC_CLOUD_CATEGORIES = [
	'general',
	'billingAndPayments',
	'usageAndLimits',
	'securityAndCompliance',
	'trialsCancellationsAndRefunds',
	'supportAndAssistance',
];

const privateCloudGeneral = pickCategory(tbPrivateCloudFaq, 'general', 'tb-private-cloud');

// Answers that send the reader to the pricing page's plan calculator, which does not exist on this
// page. Like `pickCategory`, fail the build if an id no longer matches — a renamed item would
// otherwise silently reappear here.
const PRICING_PAGE_ONLY_ITEMS = new Set(['tb-private-cloud-what-are-the-prerequisites-to-get-started']);
for (const id of PRICING_PAGE_ONLY_ITEMS) {
	if (!privateCloudGeneral.items.some((item) => item.id === id)) {
		throw new Error(`paasPage: excluded item "${id}" no longer exists in tb-private-cloud general`);
	}
}

export const paasFaq: FaqCategory[] = [
	...PUBLIC_CLOUD_CATEGORIES.map((id) => pickCategory(tbCloudFaq, id, 'tb-cloud')),
	// Distinct id: the ThingsBoard Cloud set already owns 'general'.
	{
		id: 'privateCloud',
		label: 'Private Cloud',
		items: privateCloudGeneral.items.filter((item) => !PRICING_PAGE_ONLY_ITEMS.has(item.id)),
	},
];

/**
 * The exit to the third deployment.
 *
 * This page says "on-premises" a dozen times — the Why section defines Cloud as the option for
 * people who do not want to host their own instance, and five FAQ answers compare the two — and
 * until now linked to it zero times. A reader who decides the other way had nowhere to go.
 *
 * A line, not a card: the band's job is to drive its two calls to action, and a third option in the
 * grid would flatten the choice it has just set up. The href is the homepage's own action for this
 * product; the mark says what the deployment IS — a server you run — which the two cards above it
 * answer with clouds. No colour of its own: white puts it on the line's own ink rather than making
 * a third accent out of a one-line aside.
 */
export const paasOnPremises = {
	lead: 'Prefer to run it yourself?',
	text: 'ThingsBoard On-premises',
	href: '/products/thingsboard-pe/',
	icon: 'tabler:server',
};

/**
 * The two calls to action the develop page repeats in its hero and closing band.
 *
 * `primary` does NOT keep develop's href. There it points at `/installations/`, the guide to
 * installing ThingsBoard on your own infrastructure — which is the opposite of what a "try the
 * managed cloud for free" button on the Cloud page should do, and looks like a copy-paste from a
 * self-hosted page rather than a decision. It does what the homepage's own "Try for free" does:
 * `attrs` opens the region dialog the header renders (`CloudRegionDialog`), which asks North
 * America or Europe before leaving the site, and the href is the no-script fallback.
 */
/**
 * The line under the hero's buttons: the two things a reader weighs before pressing "Try Cloud for
 * free". Both are this page's own claims, restated rather than new — the Cloud card's "No card
 * required to start" and "Under 5 minutes, self-serve" — so the hero cannot promise what the page
 * below does not.
 */
export const paasHeroCaption = ['No credit card', 'Running in under 5 minutes'];

export const paasCtas = {
	primary: {
		text: 'Try Cloud for free',
		href: 'https://thingsboard.cloud/signup',
		attrs: { 'data-cloud-auth': 'signup' } as Record<string, string>,
	},
	secondary: {
		text: 'Talk to an expert',
		href: '/contact-us/?subject=ThingsBoard%20Products&message=I%20have%20a%20question%20about%20ThingsBoard%20Cloud',
	},
	privacy: { text: 'ThingsBoard Cloud Privacy policy', href: '/products/paas/privacy-policy/' },
};
