/**
 * ThingsBoard On-premises page content.
 *
 * THE COPY IS MAIN'S. The content team edits it in `thingsboard.one` (Andrii Shvaika's On-premises
 * passes of 2026-09-25: the licence choice reframed as use against own, the custom-stack table
 * argued in the right direction and led on the track record), and upstream main carries it in
 * `onprem-page.ts` and `onprem-comparison.ts`. This file holds the same words in the kit's shapes.
 * Change the words there first, then here — a handoff carrying older copy would revert theirs.
 *
 * WHAT IS NOT HERE. The shared-capability list, as on the Cloud page and on main: those
 * capabilities are identical across Cloud and On-premises, so stating them says nothing about the
 * choice a reader is on this page to make.
 */

import type { FaqCategory } from '@data/pricing/types';
import type { Benefit, ChoiceOption, CompareColumn, CompareGroup, CompareRow } from '@data/product-blocks';
import { tbSelfManagedFaq } from '@data/pricing/faq/tb-self-managed';
import { INSTALL_GUIDE_HREF } from '@data/cta-destinations';

/** Link targets used from more than one place below. Declared up here because `onPremChoice` reads
 *  one of them and a `const` cannot be referenced before its own line has run. */
const CONTACT = '/contact-us/';
const CONTACT_SALES =
	'/contact-us/?subject=ThingsBoard%20Products&message=I%20have%20a%20question%20about%20ThingsBoard%20On-premises';
const PRICING_SUBSCRIPTION = '/pricing/?section=thingsboard-pe-options&product=thingsboard-pe';
const PRICING_PERPETUAL = '/pricing/?section=thingsboard-pe-options&product=thingsboard-pe&solution=pe-perpetual';

/** The six tiles under "Why ThingsBoard On-premises": main's words and hues. */
export const onPremBenefits: Benefit[] = [
	{
		icon: 'tabler:box-multiple',
		color: '#007c7b',
		title: 'All-in-one IoT Platform',
		description:
			'From device connectivity through data processing to the end-user interface — no separate services to license, integrate and keep in sync.',
	},
	{
		icon: 'tabler:server',
		// `--brand-pe` since the 29 Sep contrast pass (#1f8b4d before).
		color: '#178649',
		title: 'Runs where you choose',
		description:
			'Your own data centre, your AWS, Azure or GCP account, or a Kubernetes cluster — including fully air-gapped environments with no internet connection at all.',
	},
	{
		icon: 'tabler:certificate',
		color: '#7c3aed',
		title: 'Security & compliance',
		description:
			'Every LTS release gets security patches from our engineers and an independent penetration test. ThingsBoard is ISO 27001 and ISO 9001 certified.',
	},
	{
		icon: 'tabler:source-code',
		color: '#c2410c',
		title: 'Source code included',
		description:
			'Read it, extend any part of it, and build what your use case needs instead of working around what the platform assumes.',
	},
	{
		icon: 'tabler:stack-2',
		color: '#3d50f5',
		title: 'Horizontal scalability',
		description:
			'Start monolithic for quick launches, move to microservices as load grows. Add instances of any service — no single point of failure, and no rewrite along the way.',
	},
	{
		icon: 'tabler:headset',
		color: '#006bc7',
		title: 'Support from our engineers',
		description:
			'Around 30 minutes average response in business hours, from the same team that writes the platform — plus help with upgrade planning, architecture reviews and performance tuning.',
	},
];

/**
 * The decision band. Deployment is already answered on this page — you run it — so the fork is the
 * licence: one you pay for while you use it, one you own. Main's words; the buttons are the kit's.
 */
export const onPremChoice: { title: string; lead: string; columns: CompareColumn[]; options: ChoiceOption[] } = {
	title: 'Subscribe, or own it',
	lead: 'Both run on infrastructure you control — one license you pay for while you use it, one you own.',
	/**
	 * The comparison table's two column headings, so the table and the band cannot drift. One server
	 * you configure against a bench of tools you assemble — glyphs, not the ThingsBoard logo, which
	 * in the pinned header would ride the whole scroll and read as site chrome.
	 */
	columns: [
		{ name: 'ThingsBoard', icon: 'tabler:server-cog' },
		{ name: 'Custom IoT stack', icon: 'tabler:tools' },
	],
	options: [
		{
			icon: 'tabler:refresh',
			name: 'Subscription',
			price: 'Free',
			priceNote: '100 devices included',
			summary: 'Licensed month to month, on your own servers.',
			points: [
				'Commercial use included, and 1,000 devices for non-commercial projects',
				'Paid tiers from $99 a month add white labeling, a help desk, and more devices as you scale',
				'Cancel any time, no notice',
			],
			// The glyph is the hero pair's own — the action's mark, not the option's.
			cta: { text: 'Install for free', icon: 'tabler:server', href: INSTALL_GUIDE_HREF, variant: 'primary' },
			plansHref: PRICING_SUBSCRIPTION,
		},
		{
			icon: 'tabler:infinity',
			name: 'Perpetual license',
			price: 'From $4,999',
			priceNote: '5,000 devices included',
			summary: 'Bought once, and it does not expire.',
			points: [
				'The platform keeps running whether or not you renew updates',
				'A capital purchase on your books, not an operating cost',
				'License terms shaped around your deployment rather than a fixed package',
			],
			cta: {
				text: 'Talk to sales',
				icon: 'tabler:message-circle',
				href: '/contact-us/?subject=ThingsBoard%20Products&message=I%20am%20interested%20in%20Self-managed%20perpetual%20license',
				variant: 'secondary',
			},
			plansHref: PRICING_PERPETUAL,
		},
	],
};

/**
 * "ThingsBoard vs a custom IoT stack": main's `onprem-comparison.ts`, marketing-approved and kept
 * verbatim. The table argues for one platform over an assembled stack of separate services, so the
 * values are prose, not figures derived from pricing or feature data. Each row reads ThingsBoard,
 * then the custom stack — the order of `onPremChoice.columns`.
 */
const rows = (entries: [string, string, string][]): CompareRow[] =>
	entries.map(([label, thingsboard, custom]) => ({ label, values: [thingsboard, custom] }));

/** The two rows above the group headings: the track record, then the vendor count. */
export const onPremCompareLead: CompareRow[] = rows([
	[
		'Proven in production',
		'Ten years, thousands of production systems',
		'Your particular combination is the first of its kind, and production is where you find out',
	],
	['Vendors to manage', '1', '5–10, each with its own contract, release cycle and support queue'],
]);

export const onPremCompare: CompareGroup[] = [
	{
		title: 'Device & data',
		icon: 'tabler:plug-connected',
		color: '#007c7b',
		rows: rows([
			[
				'Device connectivity',
				'Direct, via Gateway, or via network server',
				'A cloud IoT service, an industrial bridge and an LPWAN integration, with custom code for each path',
			],
			[
				'OTA updates',
				'Per device or per device profile',
				'An update service, plus per-protocol delivery and rollout tracking you build',
			],
			[
				'Asset modeling & digital twin',
				'Assets, relations and hierarchies',
				'Your own schema, relation graph and hierarchy logic, in your own database',
			],
			[
				'Data processing',
				'Rule chains, calculated fields and alarms',
				'A stream processor, a rules service and alarm state, wired together and kept in sync',
			],
			[
				'Time-series storage',
				'SQL or hybrid, your choice',
				'A time-series database to select, size, shard and operate',
			],
			[
				'External integrations',
				'CRM, ERP, cloud and MQTT targets',
				'An integration service per target, with retries and back-pressure to design',
			],
		]),
	},
	{
		title: 'What your users get',
		icon: 'tabler:chart-dots',
		color: '#006bc7',
		rows: rows([
			[
				'Dashboards & visualization',
				'600+ widgets, SCADA and real-time views',
				'A front-end application to design, build and maintain for every use case',
			],
			[
				'Multi-tenancy',
				'Full data isolation between tenants',
				'Tenant scoping through every query, API and dashboard you write',
			],
			['White-labeling', 'Configured, not coded', 'Your own theming layer, maintained per customer'],
			[
				'Fine-grained RBAC & SSO',
				'Roles, groups, OAuth 2.0 and 2FA',
				'An identity provider integration plus your own permission model',
			],
		]),
	},
	{
		title: 'Running it',
		icon: 'tabler:stack-2',
		color: '#3d50f5',
		rows: rows([
			[
				'Scale & high availability',
				'Add instances of any service, with no single point of failure',
				'Scale and failover designed per service, then proven under load',
			],
			[
				'Upgrades & security',
				'One LTS upgrade path, patches in about 2 weeks',
				'Every service on its own cycle, with advisories to track and integrations to re-validate',
			],
			[
				'Support & accountability',
				'One vendor, one portal, staffed by the engineers who build it',
				'Tickets across vendors, each pointing at the others while the issue stays open',
			],
			[
				'Monitoring',
				'Deployment scripts and dashboards for Prometheus and Grafana',
				'A monitoring stack to deploy, and every dashboard and alert to design',
			],
			[
				'Performance',
				'Millions of devices in production, tested beyond 10 million',
				'Throughput and latency you benchmark, tune and re-prove for every service',
			],
		]),
	},
	{
		title: 'Commercials & risk',
		icon: 'tabler:headset',
		color: '#c2410c',
		rows: rows([
			[
				'Total cost of ownership',
				'One license, priced on device count',
				'Several licenses, integration engineering, and infrastructure costs that surface after go-live',
			],
			[
				'Time to first production deployment',
				'Days to weeks, configuring rather than building',
				'Months to a year of assembly and integration before the first use case ships',
			],
			[
				'Ecosystem',
				'Edge, Trendz, mobile, TBMQ, Gateway and IoT Hub from one vendor',
				'Each one sourced, licensed, integrated and upgraded on its own schedule',
			],
			[
				'Delivery risk',
				'The architecture is validated before you start',
				'The integration layer is yours to design, test and prove in production',
			],
		]),
	},
];

/**
 * THE FAQ COMES FROM THE REPO, NOT FROM DEVELOP.
 *
 * This was 57 answers transcribed by hand from develop's page before anyone checked whether the
 * repo already had them. It does: `src/data/pricing/faq/tb-self-managed.ts` is live data that
 * `/pricing/` already renders, and develop's copy is STALE against it in ways that matter —
 *
 *   - develop names the plans Free / Pilot / Startup / Business and says "4 predefined plans";
 *     the repo has Maker $10, Prototype $39, Pilot $99, Startup $299, Business $499, and there is
 *     no free self-managed tier at all. Shipping develop's copy would have promised one.
 *   - develop adds a "Non-commercial" plan that appears on no pricing page.
 *
 * ⚠ REVERSED, 2026-09-21: develop was describing the CURRENT model and this repo's pricing data is
 * what is stale. Free and Non-commercial are real licences — `FreeLicenseType` caps them at 100
 * devices on one server and 1,000 respectively — and the paid ladder now starts at Pilot. The
 * chooser above says so; these re-exported answers still say "5 predefined plans", name Maker and
 * Prototype in eight places, and price the beginner plan at $10. They contradict the card on the
 * same page. Left in place deliberately: the fix belongs in the shared pricing data, which
 * `/pricing/` renders too.
 *
 * AUDITED against develop, 2026-09-22. All 57 answers were diffed by id: same ids, same order,
 * same six categories. 45 matched byte for byte; 12 did not, and they split cleanly in two —
 *
 *   - FIXED HERE (they do not depend on the plan ladder): the product rename `self-managed` →
 *     `on-premises` across ten questions and three answers, the ISO 27001 / ISO 9001 sentence
 *     develop carries in the security answer, "ThingsBoard Professional Edition" → "ThingsBoard"
 *     in the migration answer, and the database-reference link, which pointed at the CE docs
 *     (`/docs/reference/...`) where develop points at the PE ones (`/docs/pe/reference/...`).
 *   - STILL STALE, and deliberately so — all seven encode the old ladder: `subscription-plans`,
 *     `device-asset-limits`, `features`, `license-multi-location`, `multiple-servers`,
 *     `try-license`, `support-included`. Develop's `/pricing/` sells Free $0 / Pilot $99 /
 *     Startup $299 / Business $499 (100 / 100 / 500 / 1,000 devices); this repo's
 *     `data/pricing/tb-self-managed.ts` still sells Maker $10 / Prototype $39 / Pilot / Startup /
 *     Business. Rewriting the seven answers alone would leave `/pricing/` contradicting its OWN
 *     plan cards, so the answers move when the cards do — one pricing-model change, not a copy fix.
 *
 * So the transcription is gone and this re-exports the repo's, minus the Edge and Trendz
 * categories — 32 of its 89 answers are add-on marketing for two other products, and this page
 * sells neither. The six product categories ship.
 */
export const onPremFaq: FaqCategory[] = tbSelfManagedFaq.filter(
	(category) => !['edge', 'trendz'].includes(category.id)
);

/** The line under the hero's buttons, main's: the two things a reader weighs before installing. */
export const onPremHeroCaption = ['No credit card', 'Docker, Kubernetes or any cloud'];

/** The page's calls to action. `primary` is the pricing page, as develop's "Get it now" is. */
export const onPremCtas = {
	/**
	 * The hero's action, mirroring the Cloud page's pair: the thing you actually do, then the way
	 * to ask a person. Pricing is deliberately NOT in the hero here — on a page whose premise is
	 * running it yourself, the first move is the install, and the licence question belongs lower,
	 * once the reader knows what they would be installing.
	 */
	install: { text: 'Install for free', href: INSTALL_GUIDE_HREF },
	primary: { text: 'See plans and pricing', href: PRICING_SUBSCRIPTION },
	secondary: { text: 'Talk to an expert', href: CONTACT_SALES },
	/** The exit to the managed alternative, as the Cloud page has one to On-premises. */
	cloud: {
		lead: 'Want to look around first? Nothing to install on',
		text: 'ThingsBoard Cloud',
		tail: ' — and you can bring it in-house later.',
		href: '/products/paas/',
		icon: 'tabler:cloud',
	},
	/**
	 * The Cloud page closes on its privacy policy. There is no site-wide one to point at — the only
	 * `privacy-policy` routes in this repo are per-product, and On-premises has none — so this closes
	 * on the licence instead, which is the document that actually governs a self-hosted deployment.
	 */
	legal: { text: 'ThingsBoard license agreement', href: '/products/thingsboard-pe/eula/' },
};

export { CONTACT, CONTACT_SALES, PRICING_SUBSCRIPTION, PRICING_PERPETUAL };
