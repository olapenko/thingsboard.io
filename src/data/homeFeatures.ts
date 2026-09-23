export interface FeatureItem {
	/** Tabler name — rendered as a bold black glyph, matching the ecosystem cards. */
	icon: string;
	title: string;
	href: string;
	/**
	 * The argument for the feature, not a label for it. Two or three sentences: what you get, and
	 * the consequence that makes it matter. The section this fills answers "why choose ThingsBoard",
	 * so a card that only names a capability leaves the question unanswered.
	 */
	description: string;
	/**
	 * Terms inside the description that point at a deeper article than `href`.
	 * Only where one actually exists — no link without a resource behind it.
	 */
	links?: { term: string; href: string }[];
}

/**
 * The closing feature section, taken from `develop`'s own `#bottom-features` — heading, order,
 * copy, links and glyphs — so the facelift argues the platform in the words the content team
 * settled on rather than a parallel set.
 *
 * It replaced sixteen one-line capability labels ("Telemetry collection", "Alarms", "Asset
 * management"…). Those named what the platform HAS; these ten say why it is the one to pick, which
 * is what a section immediately above the closing CTA is for.
 */
export const homeFeatures: FeatureItem[] = [
	{
		icon: 'tabler:source-code',
		title: 'Source-available & customization',
		href: 'https://github.com/thingsboard/thingsboard',
		description:
			'Full access to the source code — customize every part of your solution. Extend via APIs; integrate with any external system. Adapt the platform to your use case, not the other way around.',
	},
	{
		icon: 'tabler:palette',
		title: 'White-labeling',
		href: '/docs/pe/user-guide/white-labeling/',
		description:
			'Ship branded IoT solutions under your name — no coding or service restart required. Multi-level white-labeling: your customers and their customers can brand their own interface.',
	},
	{
		icon: 'tabler:users-group',
		title: 'Multi-tenancy',
		href: '/docs/pe/user-guide/multi-tenancy/',
		description:
			'Multi-tenant installations out-of-the-box. Each tenant can have multiple administrators managing millions of devices and customers — with full data isolation between tenants.',
	},
	{
		icon: 'tabler:shield-lock',
		title: 'Data sovereignty & air-gapped deployment',
		href: '/installations/',
		description:
			'Deploy in air-gapped environments with no internet connection. Your data stays where regulation, corporate policy, or operations require it — behind your firewall, in your data center, or in your cloud.',
	},
	{
		icon: 'tabler:certificate',
		title: 'Security & compliance',
		href: '/docs/pe/user-guide/security/',
		description:
			'Every LTS release receives regular security patches — reviewed and applied by our engineers, not left to the community. Independent third-party penetration tests validate the platform against real-world attack vectors before each major release. ISO certified.',
	},
	{
		icon: 'tabler:chart-line',
		title: 'Data visualization',
		href: '/iot-data-visualization/',
		description:
			'600+ built-in widgets — charts, gauges, maps, SCADA-ready industrial control. Build custom widgets with the built-in editor. Real-time dashboards with role-based access, shareable with your team, customers, and their end users.',
	},
	{
		icon: 'tabler:sparkles',
		title: 'Built-in AI',
		href: '/docs/pe/iot-solutions-with-ai/',
		description:
			'Three AI tools, one workflow. AI Solution Creator turns a plain-language prompt into a working IoT prototype in minutes. AI Assistant refines every part of it. ThingsBoard CLI takes it further from your terminal: deploy, iterate, and improve through AI coding agents.',
	},
	{
		icon: 'tabler:cpu',
		title: 'Device emulators',
		href: '/blog/from-zero-to-live-demo-how-to-simulate-real-world-iot-environments-instantly/',
		description:
			'Test your solution with realistic device data — no hardware needed. Prototype dashboards, tune rules, and validate at scale before your first device ships.',
	},
	{
		icon: 'tabler:stack-2',
		title: 'Microservices or monolithic',
		href: '/docs/pe/reference/architecture/monolithic/',
		description:
			'Start monolithic for quick launches, scale to microservices when you need horizontal scalability. Same platform, same code — upgrade without rewrites.',
		// The two architectures are the choice the card is about, and each has its own reference page,
		// so the words carry the links rather than the card sending both to one of them.
		links: [
			{ term: 'monolithic', href: '/docs/pe/reference/architecture/monolithic/' },
			{ term: 'microservices', href: '/docs/pe/reference/architecture/microservices/' },
		],
	},
	{
		icon: 'tabler:database',
		title: 'SQL, NoSQL, or hybrid database',
		href: '/docs/pe/reference/architecture/database/',
		description:
			'Choose SQL, NoSQL, or run both side-by-side. Store main entities and telemetry data wherever fits your operational and cost profile.',
	},
];
