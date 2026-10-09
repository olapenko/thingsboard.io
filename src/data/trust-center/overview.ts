import { tc } from '@data/trust-center/nav';

/**
 * The overview's six topics, from the draft's tiles, with the review's edits. The Compliance topic
 * no longer repeats the two certificates the strip above it names (edit 1), and Data security no
 * longer offers APAC on ThingsBoard Cloud, which has none (the Cloud page's table wins).
 */

export interface Topic {
	title: string;
	subtitle: string;
	icon: string;
	href: string;
	points: string[];
}

export const TOPICS: Topic[] = [
	{
		title: 'Compliance',
		subtitle: 'Independently verified security',
		icon: 'tabler:shield-check',
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
		href: tc('data'),
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
		href: tc('product'),
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
	{
		title: 'Commitment and responsibility',
		subtitle: 'What we promise and what we handle',
		icon: 'tabler:arrows-exchange',
		href: tc('commitments'),
		points: [
			'NDA documents within two business days',
			'Support response times for every plan',
			'Private Cloud uptime SLA up to 99.95%',
			'What ThingsBoard handles in each deployment model',
		],
	},
];

export const CERTIFICATES = [
	{
		title: 'ISO/IEC 27001:2022',
		subtitle: 'Information security management system',
		href: tc('compliance/iso-27001'),
	},
	{ title: 'ISO 9001:2015', subtitle: 'Quality management system', href: tc('compliance/iso-9001') },
];

export const CERT_VALIDATOR = 'https://swissapproval.ch/certificate-validator/';

/** The two deployments, each one line and a link (edit 2: their facts live on their pages). */
export const DEPLOYMENTS = [
	{
		title: 'ThingsBoard Cloud and Private Cloud',
		text: 'We host and run the platform, so you can focus on your solution.',
		icon: 'tabler:cloud',
		href: tc('cloud'),
	},
	{
		title: 'On-premises',
		text: 'You run the platform; we provide the product code, security fixes and guides.',
		icon: 'tabler:server',
		href: tc('onprem'),
	},
];
