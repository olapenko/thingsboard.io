import {
	ACCESS_CONTROLS,
	DATA_CONTROLS,
	DEV_CONTROLS,
	PRODUCT_CONTROLS,
	type Control,
} from '@data/trust-center/controls';
import { link } from '@data/trust-center/html';
import { HUES, tc } from '@data/trust-center/nav';

/**
 * The overview's and the hubs' summaries, from the draft's tiles, with the review's edits.
 *
 * Build v3 gave Security and Deployment hubs, so each topic now lives on its section's hub rather
 * than on the overview, which lists the sections instead (`SECTIONS` in `@data/trust-center/nav`).
 * The four Security pages are now the Security hub's sections; the deployments are the Deployment
 * hub's cards, with Commitment and responsibility on the hub under them. The draft's Compliance tile
 * is gone: its points are the Compliance page's facts.
 */

/**
 * Each topic's own colour, so the six topics read apart on the overview and each Security part keeps
 * its topic's colour on the Security page. Compliance keeps its section's violet; the rest are vivid
 * hues, each at least 3:1 on white (the marks' white glyphs and the check marks need it).
 */
export const TOPIC_HUES = {
	compliance: HUES.violet,
	data: '#2563eb',
	product: '#0891b2',
	access: '#ea580c',
	dev: '#db2777',
	commitments: '#059669',
};

/**
 * The overview's six topics: the draft's tiles as build v2 carried them, with the review's edits
 * (the Compliance tile no longer repeats the two certificates the hero shows, edit 1; Data security
 * no longer offers APAC on ThingsBoard Cloud, which has none). The tiles mirror the tree: Compliance,
 * the four Security parts and Commitments. Since the pages merged, each links to its part of its
 * section's page rather than to a page of its own.
 */
export interface Topic {
	title: string;
	subtitle: string;
	icon: string;
	hue: string;
	href: string;
	points: string[];
}

export const TOPICS: Topic[] = [
	{
		title: 'Compliance',
		subtitle: 'Independently verified security',
		icon: 'tabler:shield-check',
		hue: TOPIC_HUES.compliance,
		href: tc('compliance'),
		points: [
			'Certified by Swiss Approval North America, IAF-accredited',
			'Certificates you can verify online',
			'Annual surveillance audits',
			'GDPR and CCPA, self-declared',
		],
	},
	{
		title: 'Data security',
		subtitle: 'Your data stays protected',
		icon: 'tabler:database',
		hue: TOPIC_HUES.data,
		href: `${tc('security')}#data`,
		points: [
			'Tenant isolation by architecture',
			'Encrypted in transit with TLS',
			'North America or EU on Cloud; APAC too on Private Cloud',
			'Export anytime via API, no lock-in',
		],
	},
	{
		title: 'Product security',
		subtitle: 'Security built into the product',
		icon: 'tabler:device-desktop',
		hue: TOPIC_HUES.product,
		href: `${tc('security')}#product`,
		points: [
			'Encrypted transport for every device protocol',
			'X.509 device credentials and mutual TLS',
			'AES-256 encrypted secrets storage',
			'Custom domains with automatic SSL',
		],
	},
	{
		title: 'Access control',
		subtitle: 'You decide who sees what',
		icon: 'tabler:lock',
		hue: TOPIC_HUES.access,
		href: `${tc('security')}#access`,
		points: [
			'2FA enforceable for all users',
			'SSO with OAuth 2.0 and OpenID Connect',
			'Role-based access with entity groups',
			'Password, lockout and session policies',
		],
	},
	{
		title: 'Dev security',
		subtitle: 'Built through a secure process',
		icon: 'tabler:code',
		hue: TOPIC_HUES.dev,
		href: `${tc('security')}#dev`,
		points: [
			'Mandatory code review before merge',
			'Weekly code and dependency scanning',
			'Annual external penetration test',
			'Fixed CVEs listed in release notes',
		],
	},
	{
		title: 'Commitment and responsibility',
		subtitle: 'What we promise and what we handle',
		icon: 'tabler:arrows-exchange',
		hue: TOPIC_HUES.commitments,
		href: `${tc('deployment')}#commitments`,
		points: [
			'NDA documents within two business days',
			'Support response times for every plan',
			'Private Cloud uptime SLA up to 99.95%',
			'What ThingsBoard handles in each deployment model',
		],
	},
];

export interface SecurityTopic {
	/** The section's anchor on the Security page. */
	id: string;
	title: string;
	icon: string;
	/** The topic's colour, as its card on the overview has it. */
	hue: string;
	/** The section's opening line: the lede of the page it was. */
	lede: string;
	controls: Control[];
	/** A closing line, HTML. */
	note?: string;
}

/**
 * The Security page's four sections, each a page of its own until they merged: its mark, the line
 * that was the page's lede, and its controls. The tiles' points are gone with the tiles: the
 * controls under them say the same in full.
 */
export const SECURITY_TOPICS: SecurityTopic[] = [
	{
		id: 'product',
		title: 'Product security',
		icon: 'tabler:device-desktop',
		hue: TOPIC_HUES.product,
		lede: "How the platform protects device connections, credentials and secrets, so you don't have to build this layer yourself.",
		controls: PRODUCT_CONTROLS,
		note: `Full documentation for every feature is in the ${link('/docs/pe/user-guide/security/overview/', 'Security section')} of the docs.`,
	},
	{
		id: 'data',
		title: 'Data security',
		icon: 'tabler:database',
		hue: TOPIC_HUES.data,
		lede: 'What happens to the data your devices send to the platform, from the moment it arrives until you delete it.',
		controls: DATA_CONTROLS,
	},
	{
		id: 'access',
		title: 'Access control',
		icon: 'tabler:lock',
		hue: TOPIC_HUES.access,
		lede: 'Who can sign in, what each user can see, and a record of what they did. We built these controls into the platform; you decide how strictly to apply them in your tenant.',
		controls: ACCESS_CONTROLS,
	},
	{
		id: 'dev',
		title: 'Dev security',
		icon: 'tabler:code',
		hue: TOPIC_HUES.dev,
		lede: 'How we build, test and release the software you run. These practices come from years of delivering production IoT solutions on our own platform.',
		controls: DEV_CONTROLS,
		note: `Found a weakness in our software? ${link(tc('report-vulnerability'), 'Report it privately')}, and we'll respond within three business days.`,
	},
];

export const CERTIFICATES = [
	{
		title: 'ISO/IEC 27001:2022',
		number: '27001',
		subtitle: 'Information security management system',
		href: `${tc('compliance')}#iso-27001`,
	},
	{
		title: 'ISO 9001:2015',
		number: '9001',
		subtitle: 'Quality management system',
		href: `${tc('compliance')}#iso-9001`,
	},
];

/**
 * The regulations we declare compliance with. GDPR takes the EU's circle of stars, the mark it is
 * known by; the CCPA has no such mark, so it takes the kit's privacy glyph.
 */
export const PRIVACY = [
	{
		title: 'GDPR',
		subtitle: 'Applied to all personal data we process',
		href: `${tc('compliance')}#gdpr`,
		icon: 'simple-icons:europeanunion',
		accent: '#003399',
	},
	{
		title: 'CCPA',
		subtitle: "California residents' privacy rights",
		href: `${tc('compliance')}#ccpa`,
		icon: 'tabler:user-shield',
		accent: HUES.violet,
	},
];

export const CERT_VALIDATOR = 'https://swissapproval.ch/certificate-validator/';

/**
 * The deployment cards, on the overview and the Deployment hub. The two deployments carry the
 * products' own marks, as the footer and the product pages draw them: the ThingsBoard mark in the
 * brand blue for Cloud, in the on-premises green for the platform you run yourself. Commitment and
 * responsibility is not a card: it is the hub's own sections, under the cards.
 *
 * Each card carries the draft's own rows again (edit 2 had cut them to a line): the summary a reader
 * compares the two by, in the draft's words, less the encryption row (identical in both, edit 3).
 * The full facts stay on the Cloud and On-premises pages; the rows agree with them.
 */
export interface DeploymentFact {
	term: string;
	/** HTML: a Cloud / Private Cloud pair is two labelled lines. */
	html: string;
}

export const DEPLOYMENTS: { title: string; text: string; href: string; accent: string; facts: DeploymentFact[] }[] = [
	{
		title: 'ThingsBoard Cloud and Private Cloud',
		text: 'We host and run the platform, so you can focus on your solution.',
		href: tc('cloud'),
		accent: HUES.brand,
		facts: [
			{
				term: 'Hosting',
				html: 'We host and operate everything: infrastructure, patching, upgrades, monitoring and backups.',
			},
			{
				term: 'Isolation',
				html: '<b>Cloud:</b> every request is confined to its own tenant.<br><b>Private Cloud:</b> a dedicated single-tenant cluster.',
			},
			{
				term: 'Region',
				html: '<b>Cloud:</b> North America or EU.<br><b>Private Cloud:</b> North America, EU or APAC.',
			},
			{
				term: 'Backups',
				html: '<b>Cloud:</b> daily, with point-in-time recovery.<br><b>Private Cloud:</b> nightly, in a separate cloud region.',
			},
			{
				term: 'Staff access',
				html: 'Authorized engineers only, and only to handle your request; role-based and logged.',
			},
		],
	},
	{
		title: 'On-premises',
		text: 'You run the platform; we provide the product code, security fixes and guides.',
		href: tc('onprem'),
		accent: 'onprem',
		facts: [
			{ term: 'You run', html: 'Infrastructure, network, patching, backups and recovery.' },
			{ term: 'Built in', html: '2FA, SSO, RBAC, an audit log, and X.509 with mutual TLS for devices.' },
			{ term: 'Guides', html: 'Step-by-step security configuration for every feature in the documentation.' },
			{
				term: 'Security fixes',
				html: 'Patch releases with no environment or database changes; fixed CVEs listed in release notes.',
			},
			{ term: 'Release support', html: 'LTS releases: 18 months. Standard releases: 6 months.' },
		],
	},
];
