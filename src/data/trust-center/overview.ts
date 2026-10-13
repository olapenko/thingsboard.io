import { tc } from '@data/trust-center/nav';

/** The hub, as drafted: the overview, the certifications, six tiles, two deployment cards and more. */

/** The draft's Overview: its first paragraph is the hero's lede. */
export const OVERVIEW_LEDE =
	'Security is built into every layer of ThingsBoard, from device connections to the way we develop and run the platform. Your data stays isolated, encrypted in transit and under your control.';

/** The Overview's second paragraph, as the Deployments section's lead. */
export const DEPLOYMENTS_LEAD =
	'Whether you use ThingsBoard Cloud, Private Cloud or run the platform on-premises, you get the same security features and the same engineering practices behind every release.';

/** The hub's certifications, in the hero: each seal a link to its certificate's page. */
export const HUB_CERTIFICATIONS = [
	{
		title: 'ISO/IEC 27001:2022',
		number: '27001',
		issued: '9 Sep 2026',
		registration: '372-02-270-00460',
		href: tc('compliance/iso-27001'),
	},
	{
		title: 'ISO 9001:2015',
		number: '9001',
		issued: '9 Sep 2026',
		registration: '372-02-100-02170',
		href: tc('compliance/iso-9001'),
	},
];

/** The six tiles' mark: a dark grey near the ink, lit by the kit's own sheen. */
export const TILE_MARK = '#2f3137';

export interface Tile {
	title: string;
	subtitle: string;
	icon: string;
	points: string[];
	href: string;
}

export const TILES: Tile[] = [
	{
		title: 'Compliance',
		subtitle: 'Independently verified security',
		icon: 'tabler:shield-check',
		points: [
			'ISO/IEC 27001:2022 — certified',
			'ISO 9001:2015 — certified',
			// Trimmed from the draft (13 Oct 2026), three points a tile: 'Annual surveillance audits'. Implied by "certified" (ISO certificates require them); the Compliance page says it.
			'GDPR and CCPA, self-declared',
		],
		href: tc('compliance'),
	},
	{
		title: 'Data security',
		subtitle: 'Your data stays protected',
		icon: 'tabler:database',
		points: [
			'Tenant isolation by architecture',
			// Trimmed from the draft (13 Oct 2026), three points a tile: 'Encrypted in transit with TLS'. Repeats Product security's "Encrypted transport for every device protocol".
			// The draft's "Region of your choice: North America, EU or APAC", the regions alone so it fits a line.
			'North America, EU or APAC',
			'Export anytime via API, no lock-in',
		],
		href: tc('data'),
	},
	{
		title: 'Product security',
		subtitle: 'Security built into the product',
		icon: 'tabler:cpu',
		points: [
			// The draft's "Encrypted transport for every device protocol", shortened to fit a line.
			'Encrypted device connections',
			'X.509 device credentials and mutual TLS',
			'AES-256 encrypted secrets storage',
			// Trimmed from the draft (13 Oct 2026), three points a tile: 'Custom domains with automatic SSL'. A convenience feature, the tile's weakest security claim.
		],
		href: tc('product'),
	},
	{
		title: 'Access control',
		subtitle: 'You decide who sees what',
		icon: 'tabler:lock',
		points: [
			'2FA enforceable for all users',
			'SSO with OAuth 2.0 and OpenID Connect',
			'Role-based access with entity groups',
			// Trimmed from the draft (13 Oct 2026), three points a tile: 'Password, lockout and session policies'. Expected of any platform; 2FA, SSO and roles are the differentiators.
		],
		href: tc('access'),
	},
	{
		title: 'Dev security',
		subtitle: 'Built through a secure process',
		icon: 'tabler:code',
		points: [
			'Mandatory code review before merge',
			'Weekly code and dependency scanning',
			'Annual external penetration test',
			// Trimmed from the draft (13 Oct 2026), three points a tile: 'Fixed CVEs listed in release notes'. About reporting, not how we build; the report page and its thank-you say it.
		],
		href: tc('appsec'),
	},
	{
		// Short on the tile; the page keeps the draft's full name.
		title: 'Our commitments',
		subtitle: 'What we promise and what we handle',
		icon: 'tabler:clipboard-check',
		points: [
			'NDA documents within two business days',
			'Support response times for every plan',
			'Private Cloud uptime SLA up to 99.95%',
			// Trimmed from the draft (13 Oct 2026), three points a tile: 'What ThingsBoard handles in each deployment model'. Not a commitment: it describes the page; also the longest line, and it wrapped.
		],
		href: tc('commitments'),
	},
];

export interface DeploymentCard {
	title: string;
	icon: string;
	/** The mark's colour: the site's brand blue for Cloud, its green for on-premises. Links stay brand. */
	accent: 'brand' | 'onprem';
	text: string;
	rows: { label: string; html: string }[];
	link: string;
	href: string;
}

export const DEPLOYMENT_CARDS: DeploymentCard[] = [
	{
		title: 'ThingsBoard Cloud and Private Cloud',
		icon: 'tabler:cloud',
		accent: 'brand',
		text: 'We host and run the platform, so you can focus on your solution.',
		rows: [
			{
				label: 'Hosting',
				html: 'We host and operate everything: infrastructure, patching, upgrades, monitoring and backups.',
			},
			{
				label: 'Isolation',
				html: 'Cloud: every request is confined to its own tenant.<br>Private Cloud: a dedicated single-tenant cluster.',
			},
			{ label: 'Region', html: 'Cloud: North America or EU.<br>Private Cloud: North America, EU or APAC.' },
			{ label: 'Encryption', html: 'TLS in transit: HTTPS on 443, MQTTS on 8883.' },
			{
				label: 'Backups',
				html: 'Cloud: daily, with point-in-time recovery.<br>Private Cloud: nightly, in a separate cloud region.',
			},
			{
				label: 'Staff access',
				html: 'Authorized engineers only, and only to handle your request; role-based and logged.',
			},
		],
		link: 'Learn more',
		href: tc('cloud'),
	},
	{
		title: 'On-premises',
		icon: 'tabler:server',
		accent: 'onprem',
		text: 'You run the platform; we provide the product code, security fixes and guides.',
		rows: [
			{ label: 'You run', html: 'Infrastructure, network, patching, backups and recovery.' },
			{ label: 'Built in', html: '2FA, SSO, RBAC, an audit log, and X.509 with mutual TLS for devices.' },
			{ label: 'Guides', html: 'Step-by-step security configuration for every feature in the documentation.' },
			{
				label: 'Security fixes',
				html: 'Patch releases with no environment or database changes; fixed CVEs listed in release notes.',
			},
			{ label: 'Release support', html: 'LTS releases: 18 months. Standard releases: 6 months.' },
		],
		link: 'Learn more',
		href: tc('onprem'),
	},
];

export const HUB_DOCUMENTS_INTRO = `Public documents are open to everyone. Documents that describe our weak spots, such as the Statement of Applicability and the pentest summary, are shared under a mutual NDA.`;
