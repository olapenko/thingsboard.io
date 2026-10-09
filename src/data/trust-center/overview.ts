import { HUES, tc } from '@data/trust-center/nav';

/**
 * The overview's and the hubs' summaries, from the draft's tiles, with the review's edits.
 *
 * Build v3 gave Security and Deployment hubs, so each topic now lives on its section's hub rather
 * than on the overview, which lists the sections instead (`SECTIONS` in `@data/trust-center/nav`):
 * the four Security topics with their points are the Security hub; the deployments and Commitment
 * and responsibility are the Deployment hub's cards. The draft's Compliance tile is gone: its points
 * are the Compliance hub's facts.
 */

export interface Topic {
	title: string;
	subtitle: string;
	icon: string;
	href: string;
	points: string[];
}

export const SECURITY_TOPICS: Topic[] = [
	{
		title: 'Product security',
		subtitle: 'Security built into the product',
		icon: 'tabler:device-desktop',
		href: tc('product'),
		points: [
			'Encrypted transport for every device protocol',
			'X.509 device credentials and mutual TLS',
			'AES-256 encrypted secrets storage',
			'Custom domains with automatic SSL',
		],
	},
	{
		title: 'Data security',
		subtitle: 'Your data stays protected',
		icon: 'tabler:database',
		href: tc('data'),
		points: [
			'Tenant isolation by architecture',
			'Encrypted in transit with TLS',
			'North America or EU on Cloud; APAC too on Private Cloud',
			'Export anytime via API, no lock-in',
		],
	},
	{
		title: 'Access control',
		subtitle: 'You decide who sees what',
		icon: 'tabler:lock',
		href: tc('access'),
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
		href: tc('appsec'),
		points: [
			'Mandatory code review before merge',
			'Weekly code and dependency scanning',
			'Annual external penetration test',
			'Fixed CVEs listed in release notes',
		],
	},
];

export const CERTIFICATES = [
	{
		title: 'ISO/IEC 27001:2022',
		number: '27001',
		subtitle: 'Information security management system',
		href: tc('compliance/iso-27001'),
	},
	{ title: 'ISO 9001:2015', number: '9001', subtitle: 'Quality management system', href: tc('compliance/iso-9001') },
];

/**
 * The regulations we declare compliance with. GDPR takes the EU's circle of stars, the mark it is
 * known by; the CCPA has no such mark, so it takes the kit's privacy glyph.
 */
export const PRIVACY = [
	{
		title: 'GDPR',
		subtitle: 'Applied to all personal data we process',
		href: tc('compliance/gdpr'),
		icon: 'simple-icons:europeanunion',
		accent: '#003399',
	},
	{
		title: 'CCPA',
		subtitle: "California residents' privacy rights",
		href: tc('compliance/ccpa'),
		icon: 'tabler:user-shield',
		accent: HUES.violet,
	},
];

export const CERT_VALIDATOR = 'https://swissapproval.ch/certificate-validator/';

/**
 * The Deployment hub's cards. The two deployments carry the products' own marks, as the footer and
 * the product pages draw them: the ThingsBoard mark in the brand blue for Cloud, in the on-premises
 * green for the platform you run yourself.
 */
export const DEPLOYMENTS: {
	title: string;
	text: string;
	href: string;
	mark: { logo: 'thingsboard'; accent: string } | { icon: string; accent: string };
}[] = [
	{
		title: 'ThingsBoard Cloud and Private Cloud',
		text: 'We host and run the platform, so you can focus on your solution.',
		href: tc('cloud'),
		mark: { logo: 'thingsboard', accent: HUES.brand },
	},
	{
		title: 'On-premises',
		text: 'You run the platform; we provide the product code, security fixes and guides.',
		href: tc('onprem'),
		mark: { logo: 'thingsboard', accent: 'onprem' },
	},
	{
		title: 'Commitment and responsibility',
		text: 'What we promise, and what ThingsBoard handles in each deployment model.',
		href: tc('commitments'),
		mark: { icon: 'tabler:arrows-exchange', accent: HUES.teal },
	},
];
