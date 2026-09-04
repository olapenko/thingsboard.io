export interface FeatureItem {
	/** Tabler name — rendered as a bold black glyph, matching the ecosystem cards. */
	icon: string;
	title: string;
	href: string;
	/** One line. The long-form explanations live in the docs these link to. */
	description: string;
	/**
	 * Terms inside the description that point at a deeper article than `href`.
	 * Only where one actually exists — no link without a resource behind it.
	 */
	links?: { term: string; href: string }[];
}

export const homeFeatures: FeatureItem[] = [
	{
		icon: 'tabler:activity',
		title: 'Telemetry collection',
		href: '/docs/pe/user-guide/digital-twins/time-series-data/',
		description: 'Collect and store device telemetry reliably, through network and hardware failures.',
	},
	{
		icon: 'tabler:devices',
		title: 'Device management',
		href: '/docs/pe/user-guide/ui/devices/',
		description: 'Provision, monitor and control devices, with credentials and profiles built in.',
		links: [{ term: 'profiles', href: '/docs/pe/user-guide/device-profiles/' }],
	},
	{
		icon: 'tabler:sitemap',
		title: 'Rule engine',
		href: '/docs/pe/user-guide/rule-engine/',
		description: 'Process incoming data with rule chains. Trigger alarms, forward to external systems.',
	},
	{
		icon: 'tabler:chart-donut',
		title: 'Data visualization',
		href: '/iot-data-visualization/',
		description: '30+ configurable widgets, plus an editor for building your own.',
		links: [{ term: 'widgets', href: '/docs/pe/user-guide/widgets/' }],
	},
	{
		icon: 'tabler:bell-ringing',
		title: 'Alarms',
		href: '/docs/pe/user-guide/alarms/',
		description: 'Create, propagate and clear alarms across your entity hierarchy in real time.',
	},
	{
		icon: 'tabler:building-factory-2',
		title: 'Asset management',
		href: '/docs/pe/user-guide/ui/assets/',
		description: 'Register assets and relate them to devices, customers and each other.',
	},
	{
		icon: 'tabler:users-group',
		title: 'Multi-tenancy',
		href: '/docs/pe/user-guide/multi-tenancy/',
		description: 'Multiple tenants out of the box, each with its own admins, devices and customers.',
	},
	{
		icon: 'tabler:shield-lock',
		title: 'Security',
		href: '/docs/pe/user-guide/device-credentials/',
		description: 'Device credentials over MQTT, CoAP and HTTP, with X.509 and access tokens.',
	},
	{
		icon: 'tabler:stack-2',
		title: 'Horizontal scalability',
		href: '/docs/pe/reference/architecture/#services',
		description: 'Add servers to add capacity. No downtime, restarts or application errors.',
	},
	{
		icon: 'tabler:shield-check',
		title: 'Fault tolerance',
		href: '/docs/pe/reference/architecture/',
		description: 'No single point of failure — every node is identical and replaceable.',
	},
	{
		icon: 'tabler:box-multiple',
		title: 'Microservices or monolithic',
		href: '/docs/pe/reference/msa/',
		description: 'Start monolithic and move to microservices when you need the scale.',
	},
	{
		icon: 'tabler:database',
		title: 'SQL, NoSQL or hybrid',
		href: '/docs/pe/reference/#database-options',
		description: 'Choose where entities and telemetry live: SQL, NoSQL, or both.',
	},
	{
		icon: 'tabler:palette',
		title: 'White labelling',
		href: '/docs/pe/user-guide/white-labeling/',
		description: 'Ship it under your own brand — logo, colours, domain, login page and mail.',
		links: [
			{ term: 'login page', href: '/docs/pe/user-guide/white-labeling-login/' },
			{ term: 'mail', href: '/docs/pe/user-guide/white-labeling-mail/' },
		],
	},
	{
		icon: 'tabler:schema',
		title: 'SCADA',
		href: '/docs/pe/user-guide/scada/',
		description: 'Build industrial control screens from vector symbols, wired to live device data.',
		links: [{ term: 'vector symbols', href: '/docs/pe/user-guide/scada-symbol-dev/' }],
	},
	{
		icon: 'tabler:variable',
		title: 'Calculated fields',
		href: '/docs/pe/user-guide/calculated-fields/',
		description: 'Derive new values from incoming telemetry without writing a rule chain.',
	},
	{
		icon: 'tabler:puzzle',
		title: 'Customization',
		href: '/docs/user-guide/contribution/how-to-contribute/',
		description: 'Extend the platform with your own rule nodes, widgets and transports.',
		links: [
			{ term: 'rule nodes', href: '/docs/pe/user-guide/contribution/rule-node-development/' },
			{ term: 'widgets', href: '/docs/pe/user-guide/contribution/widgets-development/' },
		],
	},
];
