import { TBMQ_SITE_URL } from '@models/tbmq';

export interface EcosystemItem {
	name: string;
	/** Short category line under the name — what kind of thing this is. */
	label: string;
	description: string;
	icon: string;
	/**
	 * Trial (filled badge): opt-in per card. `true` fills the squircle with
	 * `accent` and knocks the mark out white; an object overrides the asset, its
	 * ink, or the fill. Only the mobile card takes it — the rest were tried
	 * filled and reverted. Deleting this field and the `filled:` below drops it.
	 */
	filled?: boolean | { icon?: string; ink?: string; bg?: string };
	href: string;
	/** Accent for the label, so each product is identifiable at a glance. */
	accent: string;
	/** Names the destination instead of the mechanic — replaces "Read more". */
	action: string;
	/** Sold as an add-on rather than part of the core platform. */
	addOn?: boolean;
	/** Spans two columns and carries the section's key visual. */
	wide?: boolean;
	videoWebm?: string;
	videoMp4?: string;
	/** Store buttons, shown beneath the primary action on the wide card. */
	stores?: { label: string; href: string }[];
	/** Mirrors the wide card: visual on the left, copy on the right. */
	flipped?: boolean;
	/** Category tiles — the visual and the navigation in one. */
	tiles?: { slug: string; label: string; href: string; color: string; icon: string }[];
}

// One card per product. The two mobile entries are now a single card pointing at
// the PE page, since they are one app to a reader even if there are two builds.
export const homeEcosystem: EcosystemItem[] = [
	{
		name: 'IoT Gateway',
		label: 'Protocol bridge',
		description:
			'Brings legacy equipment online. Modbus, OPC UA, BACnet, SNMP, KNX and 25+ industrial protocols, translated to MQTT or HTTP. Open-source, runs on any hardware.',
		icon: '/src/assets/images/landings/ce/gateway-icon.svg',
		href: '/docs/iot-gateway/',
		action: 'See supported protocols',
		accent: '#7b3fe4',
	},
	{
		name: 'TBMQ',
		label: 'Dedicated MQTT broker',
		description:
			"Picks up where ThingsBoard's MQTT transport stops. The transport collects telemetry; TBMQ routes messages between devices, at millions of concurrent connections.",
		icon: '/src/assets/images/landings/ce/tbmq-icon.svg',
		href: TBMQ_SITE_URL,
		action: 'Go to tbmq.io',
		accent: '#1f9d55',
	},
	{
		name: 'Edge',
		label: 'Edge computing',
		description:
			'Processes locally and keeps working offline, syncing to the cloud when the connection returns. Manage every remote node from one console.',
		icon: '/src/assets/images/landings/ce/thingsboard-e-icon.svg',
		href: '/products/thingsboard-edge/',
		action: 'See how Edge works',
		accent: '#0f9b8e',
		addOn: true,
	},
	{
		name: 'Trendz',
		label: 'Analytics & AI',
		description:
			'Predictive analytics, anomaly detection and forecasting. Explore your data without code using natural-language queries, and run AI agents over it.',
		icon: '/src/assets/images/landings/ce/trendz-icon.svg',
		href: '/products/trendz/',
		action: 'Explore Trendz',
		accent: '#1976d2',
		addOn: true,
	},
	{
		name: 'ThingsBoard Mobile App',
		label: 'iOS & Android',
		description:
			'Dashboards, alarms and device control in your pocket. Push notifications when something needs attention, and white-label builds you can ship under your own brand.',
		icon: '/src/assets/images/landings/ce/tb-pe-mobile-icon.svg',
		// Inverted against the platform badges above it (white tile, black mark): the app is the
		// thing on your phone, so its badge is the app icon — the same two colours, swapped.
		filled: { icon: '/src/assets/images/landings/thingsboard-mark.svg', ink: '#ffffff', bg: '#17181c' },
		href: '/products/mobile-pe/',
		// Exploratory, not acquisitive — the store buttons below are the download,
		// so the primary sends you to the product page instead of duplicating them.
		action: 'Tour the app',
		// Takes the app icon's own green rather than the brand purple.
		accent: '#1f8b4d',
		wide: true,
		// Reused from the mobile page's "Rich set of mobile actions" block —
		// 564 KB webm / 940 KB mp4, so it is lazy-loaded rather than shipped
		// with the page.
		videoWebm: 'https://video.thingsboard.io/mobile/pe/mobile-actions.webm',
		videoMp4: 'https://video.thingsboard.io/mobile/pe/mobile-actions.mp4',
		// TODO: real store URLs. None exist anywhere in this repo — no links, no
		// badge assets — so these point at the product page rather than guessing.
		stores: [
			{ label: 'App Store', href: '/products/mobile-pe/' },
			{ label: 'Google Play', href: '/products/mobile-pe/' },
		],
	},
	{
		name: 'IoT Hub',
		label: 'Free marketplace',
		description:
			'Device profiles, widgets, dashboards and rule chains published by the community. Install what you need in a click instead of building it from scratch.',
		icon: 'tabler:building-store',
		href: '/iot-hub/',
		action: 'Browse the Hub',
		accent: '#e8590c',
		wide: true,
		flipped: true,
		// Colours are the categories' own `tileColor` from src/models/iot-hub.ts —
		// the visual and the links are the same thing here, which is why this card
		// needs no separate button row.
		tiles: [
			{ slug: 'devices', label: 'Device Library', href: '/iot-hub/devices/', color: '#ccd5ff', icon: 'tabler:cpu' },
			{
				slug: 'solution-templates',
				label: 'Solution Templates',
				href: '/iot-hub/solution-templates/',
				color: '#b8d9ff',
				icon: 'tabler:template',
			},
			{ slug: 'widgets', label: 'Widgets', href: '/iot-hub/widgets/', color: '#a3ffc3', icon: 'tabler:layout-grid' },
			{
				slug: 'calculated-fields',
				label: 'Calculated Fields',
				href: '/iot-hub/calculated-fields/',
				color: '#bdedff',
				icon: 'tabler:math-function',
			},
			{
				slug: 'alarm-rules',
				label: 'Alarm Rules',
				href: '/iot-hub/alarm-rules/',
				color: '#ffe6cc',
				icon: 'tabler:bell',
			},
			{
				slug: 'rule-chains',
				label: 'Rule Chains',
				href: '/iot-hub/rule-chains/',
				color: '#ecd1ff',
				icon: 'tabler:sitemap',
			},
		],
	},
	{
		name: 'AI Solution Creator',
		label: 'Prompt to prototype',
		description:
			'Describe an IoT use case in plain language and get a working prototype in minutes — devices, dashboards and alert rules already wired together.',
		icon: 'tabler:sparkles-filled',
		href: '/docs/paas/user-guide/ai-solution-creator/',
		action: 'See how it works',
		accent: '#7048e8',
	},
];
