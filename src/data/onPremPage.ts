/**
 * ThingsBoard On-premises page content.
 *
 * Lifted from `develop.tbqa.cloud/products/thingsboard-pe/`, the same way `paasPage.ts` was lifted
 * from the Cloud page there — that copy was never merged into this fork, so it could not be taken
 * from a branch. Wording, prices, plan limits and link targets are develop's.
 *
 * WHAT IS NOT HERE. Develop's page carries the full shared-capability list — the one the Cloud page
 * renders as "Platform features" — and this page deliberately omits it. Those capabilities are
 * identical across Cloud and On-premises, so stating them on both pages twice says nothing about
 * the choice a reader is on this page to make. What survives is the half that IS about self-hosting:
 * the comparison against assembling your own stack, and the licensing.
 */

import type { FaqCategory } from '@data/pricing/types';
import { tbSelfManagedFaq } from '@data/pricing/faq/tb-self-managed';

/** Link targets used from more than one place below. Declared up here because `onPremChoice` reads
 *  one of them and a `const` cannot be referenced before its own line has run. */
const CONTACT = '/contact-us/';
const CONTACT_SALES = '/contact-us/?subject=ThingsBoard%20Products&message=I%20have%20a%20question%20about%20ThingsBoard%20On-premises';
const LICENSE_SERVER = 'https://license.thingsboard.io/';
const PRICING_SUBSCRIPTION = '/pricing/?section=thingsboard-pe-options&product=thingsboard-pe';
const PRICING_PERPETUAL = '/pricing/?section=thingsboard-pe-options&product=thingsboard-pe&solution=pe-perpetual';

export interface OnPremBenefit {
	/** Tabler name, rendered as a bare coloured glyph — `FeatureTile`'s treatment. */
	icon: string;
	/** The glyph's hue. Every value is one already used on the Cloud page. */
	color: string;
	title: string;
	description: string;
}

/**
 * The six tiles.
 *
 * Every claim is traceable, and the sources are named per tile. Where develop's page and this
 * repo disagree, the repo wins — it is the live data and develop is a stale build.
 *
 * WHAT IS DELIBERATELY NOT HERE. Nothing generic to ThingsBoard: a reader on this page has already
 * decided to run the platform themselves, and "600+ widgets" tells them nothing they could not read
 * on the Cloud page. Each tile below is about SELF-HOSTING specifically — custody, placement,
 * sizing, metering, clustering, observability.
 *
 * Hues come from this page's own comparison groups rather than the Cloud page's palette. The Cloud
 * file justifies its six on the grounds that every value already appears on that page; none of them
 * appears on this one.
 */
export const onPremBenefits: OnPremBenefit[] = [
	{
		// FAQ, Security & Compliance: "Your data is stored on your own infrastructure, whether
		// on-premise or in the cloud" and "you have full control over data storage location".
		icon: 'tabler:shield-lock',
		color: '#1f8b4d',
		title: 'Your infrastructure, your custody',
		description: 'The data sits on hardware you control — your own data centre or your own cloud account — and you decide where.',
	},
	{
		// `homeProducts.ts`: "Deploy in your own data centre, in your private cloud (AWS, Azure,
		// GCP), or on Kubernetes." Plus FAQ, Usage: "cloud-agnostic and can be migrated as needed".
		// It says "migratable", NOT "no lock-in": moving servers means deactivating on the License
		// Server first, and that caveat belongs in the FAQ where it is stated in full.
		icon: 'tabler:server',
		color: '#007c7b',
		title: 'Your data centre, or any cloud',
		description: 'Run it on your own hardware, in AWS, Azure or GCP, or on Kubernetes — the deployment is cloud-agnostic and migratable.',
	},
	{
		// `scale-visual.ts`, benchmark scenarios B and E. NOT develop's "from 5 devices to 5+
		// million" — that file carries an explicit note rejecting the figure as unsupported.
		icon: 'tabler:gauge',
		color: '#006bc7',
		title: 'Benchmarked sizing, from one server',
		description: 'Published benchmarks size the machine: 100K devices on 4 vCPU and 8 GB, a million on 36 vCPU and 72 GB.',
	},
	{
		// FAQ, Usage: "Does ThingsBoard charge for API calls or storage? No, but you may be charged
		// by your cloud provider for resource usage." Plus Billing: no extra beyond the licence fee.
		icon: 'tabler:coin',
		color: '#c2410c',
		title: 'No metering on the licence',
		description: 'The licence is priced on device count alone. Nothing is billed for API calls, data points or storage — your provider bills the infrastructure.',
	},
	{
		// `tb-self-managed.ts`: Startup includes 2 production instances, Business 3, and extra
		// instances are purchasable. The FAQ explains what they buy: HA, horizontal scale, redundancy.
		icon: 'tabler:topology-star-3',
		color: '#3d50f5',
		title: 'Cluster mode for high availability',
		description: 'Run several instances for redundancy and horizontal scale — Startup includes two, Business three, and more can be added.',
	},
	{
		// The comparison table's own Foundation row. The capability is platform-wide; the benefit
		// only lands on a reader who operates the deployment, which is everyone on this page.
		icon: 'tabler:activity',
		color: '#7c3aed',
		title: 'Monitoring ships with it',
		description: 'A Prometheus and Grafana stack comes with the platform, so whoever operates the deployment has observability from the first install.',
	},
];

/**
 * The decision band.
 *
 * The Cloud page forks on deployment — Public or Private — because that is the only open question
 * once you have chosen managed hosting. Here deployment is already answered: you run it. So the
 * fork is the one develop's own page names in its "Simple and predictable pricing models" section,
 * and the one `/pricing/` makes its primary control: pay monthly, or buy once.
 *
 * It is a difference in KIND rather than in invoice, which is what these two cards need. Stop
 * paying the subscription and "your license will become inactive, and your ThingsBoard instance
 * will be stopped"; the perpetual licence cannot end that way because it cannot be cancelled at
 * all. On software installed on the reader's own hardware that is the most consequential fact here.
 *
 * The perpetual figure is `tb-self-managed.ts`'s own `Starting from $4,999`. The monthly card no
 * longer takes its entry price from there, and this is the one place the page KNOWINGLY leads that
 * file: under the current model the ladder's bottom two rungs — Maker $10 and Prototype $39 —
 * dissolve into free licences, so the monthly route starts at no charge and the paid tiers begin
 * at Pilot. The caps the card states are `FreeLicenseType`'s own (commercial to 100 devices on one
 * server, non-commercial to 1,000), which is also what BUSL 1.1's Additional Use Grant says for
 * the commercial case.
 *
 * ⚠ `tb-self-managed.ts` and the FAQ below it still describe the old ladder, and both are shared
 * with `/pricing/` — so this page currently states a free tier that its own FAQ denies. Resolving
 * that is a pricing-data change, not a page change.
 *
 * NOT "Run it yourself vs Managed Services", which was the strongest rival: that service's own
 * published SLA covers Public and Private Cloud only, and its migration path moves the reader off
 * their own infrastructure — so it cannot be a card on a page whose premise is that they stay on it.
 */
export const onPremChoice = {
	title: 'Pay monthly, or once',
	lead: 'Both run on infrastructure you control. The monthly route starts free and charges once you outgrow it; the perpetual one is bought once and does not expire.',
	/** The comparison table's two column headings, so the table and the band cannot drift. */
	columns: [
		/**
		 * Both columns are marked with a glyph, and the pair is the comparison: one server you
		 * configure against a bench of tools you assemble. The product column carried the
		 * ThingsBoard logo until it was pinned — in the sticky header the logo rides along the
		 * whole scroll of the table, where a brand mark reads as site chrome rather than as this
		 * table's left-hand column. `server-cog` was already the column's declared icon.
		 */
		{ name: 'ThingsBoard', icon: 'tabler:server-cog' },
		{ name: 'Custom IoT stack', icon: 'tabler:tools' },
	],
	options: [
		{
			icon: 'tabler:refresh',
			name: 'Monthly subscription',
			price: 'Free',
			priceNote: 'Up to 100 devices on one server',
			/** One sentence, as the perpetual card's is. The second — "Pay only once you outgrow
			 *  it" — said again what the band's own lead says a line above it, and cost the card
			 *  a second line the other card did not have, so the two summaries sat at different
			 *  heights and pushed their bullet lists out of step. */
			summary: 'Subscribe for free, no credit card needed.',
			/**
			 * Two, and both are reasons to choose this card. What came out: where the licence key
			 * is issued (plumbing — nobody picks a licence on that), and what cancelling does to a
			 * running instance. The second is a real fact and it is still on the page, in the FAQ
			 * under "Can I cancel my subscription anytime?", which is where a consequence belongs.
			 */
			/**
			 * The third bullet is the pair's reversibility axis — see the perpetual card. Source:
			 * the FAQ's own `self-managed-upgrade`, "you can change plans anytime, and billing
			 * will be prorated accordingly", and `proration`, "Stripe automatically prorates the
			 * charges when you change plans". It names no tier and no price, deliberately: the
			 * ladder in `data/pricing/` is stale and out of this handoff's scope.
			 */
			points: [
				'Free for commercial use to 100 devices on one server, and to 1,000 for non-commercial use',
				'Cancel any time, no notice',
				'Change tier any time, prorated automatically',
			],
			cta: { text: 'Install for free', href: '/docs/pe/installation/', variant: 'primary' as const },
			// ⚠ STALE, knowingly: this lands on the old ladder — Maker $10 through Business $499 —
			// which the card above no longer describes. Left pointing there until `/pricing/`
			// carries the current model; see the note on `onPremFaq` for the same problem.
			plansHref: PRICING_SUBSCRIPTION,
		},
		{
			icon: 'tabler:infinity',
			name: 'Perpetual licence',
			price: 'From $4,999',
			priceNote: 'One time, priced on device count',
			summary: 'Bought once, and it does not expire.',
			/**
			 * "Non-refundable and cannot be cancelled" came out: on a card whose job is to argue
			 * for buying once, a warning is the wrong register for a property the buyer is
			 * actually paying to get. The FAQ states it plainly — "The perpetual license is
			 * non-refundable. Once purchased, it cannot be canceled" — so nothing is hidden.
			 *
			 * The scale qualifier STAYS on Offline Mode. Without it the add-on reads as either
			 * included or flatly priced, and it is neither.
			 */
			/**
			 * The other half of the reversibility pair, and the only place on the site that says
			 * so: `subscription-to-perpetual` — "The remaining costs from the terminated
			 * subscription plan (if any) will be deducted from the total cost for the perpetual
			 * license." It answers the objection this card actually meets, which is that months
			 * already spent on a subscription are money thrown away if you switch.
			 */
			points: [
				'One payment, with no monthly fee after it',
				'Offline Mode available as an add-on, priced on deployment scale',
				'Subscription already paid is deducted from the price',
			],
			cta: {
				text: 'Talk to sales',
				href: '/contact-us/?subject=ThingsBoard%20Products&message=I%20am%20interested%20in%20Self-managed%20perpetual%20license',
				variant: 'secondary' as const,
			},
			plansHref: PRICING_PERPETUAL,
		},
	],
};

export interface CompareRow {
	label: string;
	/** ThingsBoard, then a custom-assembled stack. */
	values: [string, string];
}

export interface CompareGroup {
	title: string;
	/** Tabler name for the group's mark. */
	icon: string;
	/** The mark's hue — one rotation through the table. */
	color: string;
	rows: CompareRow[];
}

/**
 * "ThingsBoard vs Custom IoT stack", all 35 rows.
 *
 * Note this is a DIFFERENT comparison from the Cloud page's. There the two columns are two ways to
 * buy the same product; here they are "use this platform" against "assemble one yourself", so the
 * right-hand column is not a product at all. The column headings say so.
 */
export const onPremCompare: CompareGroup[] = [
	{
		title: 'Device layer',
		icon: 'tabler:plug-connected',
		color: '#007c7b',
		rows: [
			{
				label: 'Device connectivity',
				values: [
					'Built-in: connect any device or asset without technical barriers — MQTT, HTTP, CoAP, LwM2M and SNMP directly; Modbus, OPC UA, BACnet, CAN and others through the IoT Gateway; LoRaWAN, Sigfox and others through network server integrations',
					'Cloud provider IoT service + industrial protocol bridge + LPWAN integration + custom code for each path',
				],
			},
			{
				label: 'Device management & provisioning',
				values: [
					'Built-in: lifecycle, provisioning, claiming, bulk import, and device profiles inherited by every device of a type',
					'Your own registry, provisioning flow, and profile model',
				],
			},
			{
				label: 'Remote control',
				values: [
					'Built-in: persistent RPC from dashboards, rules, or API: commands are stored and delivered when the device reconnects, with retries, expiry, and a full delivery state machine',
					'A command channel you build per protocol — no persistence, no delivery guarantees, no state to query once the command leaves your system',
				],
			},
			{
				label: 'Firmware & config updates (OTA)',
				values: [
					'Built-in: firmware repository, staged rollouts, chunked delivery, checksum validation, per-device status',
					'Distribution, resume and rollback logic you build, plus a device-side agent per protocol',
				],
			},
			{
				label: 'Device security & identity',
				values: [
					'Built-in: X.509, tokens, per-device credentials, device claiming, audit log',
					'Device identity, credential rotation, and certificate lifecycle you design and operate',
				],
			},
		],
	},
	{
		title: 'Data layer',
		icon: 'tabler:sitemap',
		color: '#047857',
		rows: [
			{
				label: 'Asset modeling & digital twin',
				values: [
					'Built-in: assets, customers, hierarchies, relations, attributes and metrics that resolve across the hierarchy. KPIs roll up the tree',
					'Your own domain model and relation layer, maintained across services',
				],
			},
			{
				label: 'Data processing',
				values: [
					'Built-in: calculated fields and formulas, visual rule chains, a library of ready-made processing nodes, JavaScript or TBEL',
					'Separate flow-processing tool + custom code + integrations',
				],
			},
			{
				label: 'Alarms & alarm lifecycle',
				values: [
					'Built-in: conditions, severity, assignment, full lifecycle and history',
					'Separate incident management tool + custom integration',
				],
			},
			{
				label: 'Time-series storage',
				values: [
					'Built-in: runs on PostgreSQL (with TimescaleDB or Citus) or Cassandra; partitioning, retention, downsampling and aggregation handled for you',
					'Separate time-series database — operate and tune it yourself',
				],
			},
			{
				label: 'External systems integrations',
				values: [
					'Built-in: REST, Kafka, RabbitMQ, AWS, Azure and GCP nodes to push data into ERP, CRM or billing systems',
					'Point-to-point integrations you write and maintain per system',
				],
			},
			{
				label: 'APIs & version control',
				values: [
					'Built-in: REST and WebSocket APIs, entity import and export, version control, CLI',
					'Separate API per service, and no shared way to version a solution',
				],
			},
		],
	},
	{
		title: 'Application layer',
		icon: 'tabler:chart-dots',
		color: '#006bc7',
		rows: [
			{
				label: 'Dashboards & visualization',
				values: [
					'Built-in: real-time updates, drill-down navigation, maps, charts, SCADA; 600+ widgets plus custom widgets in JavaScript',
					'Separate dashboard tool + custom plugins + separate SCADA tool',
				],
			},
			{
				label: 'Multi-tenant isolation',
				values: ['Built-in: nested customers with data isolation, no custom code', 'Custom implementation — months of engineering'],
			},
			{
				label: 'White-label & custom branding',
				values: [
					'Built-in: logo, colors, domain, menu, login page, emails — set per tenant and inherited by every customer below',
					'Custom UI development from scratch',
				],
			},
			{
				label: 'Fine-grained RBAC & SSO',
				values: [
					'Built-in: OAuth2 SSO (Google, Azure AD, Okta, Keycloak, any OIDC provider), 2FA, user groups, default dashboard per role',
					'Separate identity provider + custom permission model',
				],
			},
			{
				label: 'Notifications',
				values: [
					'Built-in: in-app, email, SMS, push, Slack and Teams, with per-user preferences',
					'A separate integration to build and maintain per channel',
				],
			},
			{
				label: 'Reporting & scheduling',
				values: [
					'Built-in: scheduled PDF, CSV and XLSX by email or to external systems, plus scheduled commands and events',
					'Separate BI tool + scheduler + integration',
				],
			},
			{
				label: 'Self-service forms',
				values: [
					'Built-in: end users register, onboard their own devices and manage their data; every action audited',
					'A custom end-user application on top of your stack',
				],
			},
		],
	},
	{
		title: 'Foundation',
		icon: 'tabler:stack-2',
		color: '#3d50f5',
		rows: [
			{
				label: 'Scale & high availability',
				values: [
					'Built-in: horizontal scaling on microservices and Kafka, fault tolerance across the stack',
					'Each service scales, fails, and recovers on its own terms',
				],
			},
			{
				label: 'Monitoring',
				values: [
					'Built-in: Prometheus and Grafana monitoring stack ships with the platform',
					'Observability you assemble and wire across every service',
				],
			},
			{
				label: 'Proven at scale',
				values: [
					'Open benchmarks: 8+ years of performance optimization in production with 500K–1M device environments',
					'Your ceiling surfaces in production, after go-live',
				],
			},
		],
	},
	{
		title: 'Operations & commercials',
		icon: 'tabler:headset',
		color: '#c2410c',
		rows: [
			{ label: 'Number of vendors to manage', values: ['1', '5–10 different services to license and integrate'] },
			{
				label: 'Deployment',
				values: ['Monolith for pilots, microservices for scale, same platform', 'Multiple services — ops overhead scales with each'],
			},
			{
				label: 'Upgrades & security',
				values: [
					'LTS releases with an 18-month support window — one upgrade path; vulnerabilities typically patched within 2 weeks',
					'Each service on its own release cycle — you track advisories per project and re-validate every integration',
				],
			},
			{
				label: 'Support & accountability',
				values: [
					'One vendor, one support portal — direct access to the engineers who build the platform',
					'Tickets across multiple vendors — each points at the others while the issue stays open',
				],
			},
			{
				label: 'Total cost of ownership',
				values: [
					'One license priced on device count, plus reference architectures for the infrastructure',
					'Multiple licenses, plus integration engineering and infrastructure costs that surface after go-live',
				],
			},
			{
				label: 'Time to first production deployment',
				values: [
					'Days to weeks — configure the platform to your use case, not build it',
					'Months to a year — assembly and integration before the first use case ships',
				],
			},
			{
				label: 'Delivery risk',
				values: [
					'Proven in thousands of production deployments — the architecture is validated before you start',
					'The integration layer is yours to design, test and prove in production',
				],
			},
		],
	},
	{
		title: 'Ecosystem features',
		icon: 'tabler:puzzle',
		color: '#7c3aed',
		rows: [
			{
				label: 'AI Tools',
				values: ['Built-in: AI Solution Creator, IoT AI assistants and the ThingsBoard CLI', 'Build integrations to AI services yourself'],
			},
			{
				label: 'IoT Hub',
				values: [
					'Ready-made components — solution templates, device integrations, widgets, rule chains and dashboards, installed in one click',
					'Every dashboard, integration and rule chain built from scratch',
				],
			},
			{
				label: 'Edge computing',
				values: [
					'ThingsBoard Edge runs rules on site, buffers offline, syncs automatically, managed centrally',
					'Separate edge runtime plus your own sync and conflict resolution',
				],
			},
			{
				label: 'Analytics & forecasting',
				values: [
					'Trendz Analytics adds prediction, anomaly detection and BI views',
					'Separate analytics stack plus a data export pipeline to feed it',
				],
			},
			{
				label: 'Mobile application',
				values: [
					'One vendor: white-label iOS and Android app builder based on Flutter, same dashboards, push, QR onboarding',
					'Two native apps to build, maintain and ship through both stores',
				],
			},
			{
				label: 'MQTT broker',
				values: [
					'TBMQ — MQTT broker built for high-load messaging: 4M+ concurrent connections per node, 100M+ in cluster mode',
					'A broker to license, cluster and operate — capacity you benchmark and tune yourself',
				],
			},
			{
				label: 'IoT Gateway',
				values: [
					'ThingsBoard IoT Gateway — Modbus, OPC UA, BACnet, CAN, BLE and proprietary PLCs, deployed on site and configured remotely from the platform',
					'A protocol bridge per fieldbus, each with its own deployment, configuration and remote management to build',
				],
			},
		],
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

/** The page's calls to action. `primary` is the pricing page, as develop's "Get it now" is. */
export const onPremCtas = {
	/**
	 * The hero's action, mirroring the Cloud page's pair: the thing you actually do, then the way
	 * to ask a person. Pricing is deliberately NOT in the hero here — on a page whose premise is
	 * running it yourself, the first move is the install, and the licence question belongs lower,
	 * once the reader knows what they would be installing.
	 */
	install: { text: 'Install for free', href: '/docs/pe/installation/' },
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
	legal: { text: 'ThingsBoard licence agreement', href: '/products/thingsboard-pe/eula/' },
};

export { CONTACT, CONTACT_SALES, PRICING_SUBSCRIPTION, PRICING_PERPETUAL };
