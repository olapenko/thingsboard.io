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
 * and the one `/pricing/` makes its primary control: rent the licence monthly, or own it outright.
 *
 * It is a difference in KIND rather than in invoice, which is what these two cards need. Stop
 * paying the subscription and "your license will become inactive, and your ThingsBoard instance
 * will be stopped"; the perpetual licence cannot end that way because it cannot be cancelled at
 * all. On software installed on the reader's own hardware that is the most consequential fact here.
 *
 * Every figure is from `src/data/pricing/tb-self-managed.ts`: Maker $10 through Business $499 at
 * 1,000 devices, and `Starting from $4,999` for the perpetual licence. Each card deep-links the
 * ladder rather than restating it.
 *
 * NOT "Run it yourself vs Managed Services", which was the strongest rival: that service's own
 * published SLA covers Public and Private Cloud only, and its migration path moves the reader off
 * their own infrastructure — so it cannot be a card on a page whose premise is that they stay on it.
 */
export const onPremChoice = {
	title: 'Rent the licence, or own it',
	lead: 'Both run on infrastructure you control and both are priced on device count. What differs is what you hold at the end.',
	/** The comparison table's two column headings, so the table and the band cannot drift. */
	columns: [
		{ name: 'ThingsBoard', icon: 'tabler:server-cog' },
		{ name: 'Custom IoT stack', icon: 'tabler:tools' },
	],
	options: [
		{
			icon: 'tabler:refresh',
			name: 'Monthly subscription',
			price: 'From $10',
			priceNote: 'Per month, 10 devices',
			summary: 'Self-serve, month to month, cancel whenever.',
			points: [
				'Five plans, from 10 devices up to 1,000',
				'A licence key from the License Server, installed by you',
				'Cancel any time — the licence goes inactive and the instance stops',
			],
			cta: { text: 'Get a licence', href: 'https://license.thingsboard.io/signup', variant: 'primary' as const },
			plansHref: PRICING_SUBSCRIPTION,
		},
		{
			icon: 'tabler:infinity',
			name: 'Perpetual licence',
			price: 'From $4,999',
			priceNote: 'One time, priced on device count',
			summary: 'Bought once, and it does not expire.',
			points: [
				'One-time payment, with no monthly fee after it',
				'Offline Mode is an add-on to this licence, priced on deployment scale',
				'Non-refundable and cannot be cancelled',
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
 * "ThingsBoard vs Custom IoT stack", all 39 rows.
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
 * So the transcription is gone and this re-exports the repo's, minus the Edge and Trendz
 * categories — 32 of its 89 answers are add-on marketing for two other products, and this page
 * sells neither. The six product categories ship.
 */
export const onPremFaq: FaqCategory[] = tbSelfManagedFaq.filter(
	(category) => !['edge', 'trendz'].includes(category.id)
);

/** The page's calls to action. `primary` is the pricing page, as develop's "Get it now" is. */
export const onPremCtas = {
	primary: { text: 'See plans and pricing', href: PRICING_SUBSCRIPTION },
	secondary: { text: 'Talk to an expert', href: CONTACT_SALES },
	/** The exit to the managed alternative, as the Cloud page has one to On-premises. */
	cloud: {
		lead: 'Would rather we ran it?',
		text: 'ThingsBoard Cloud',
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
