import { SECURITY_EMAIL, tc } from '@data/trust-center/nav';

/**
 * The overview's FAQ, after the review's edits: 21 of the draft's 23 questions. "How do I report a
 * security issue?" and "Who are your sub-processors?" are gone, since the overview says both right
 * above it. Three answers stay whole because no page answers them (how to reach us, SOC 2, AI
 * training); the rest are one line and a link to the page that answers in full, so each fact is
 * stated once.
 *
 * The shape is Pricing's `FaqCategory`, which `ProductFaq` reads.
 */

const a = (href: string, text: string) => `<a href="${href}">${text}</a>`;

export const TC_FAQ = [
	{
		id: 'general',
		label: 'General',
		items: [
			{
				id: 'contact',
				question: 'How do I contact ThingsBoard about security?',
				answer: `<p>Email ${a(`mailto:${SECURITY_EMAIL}`, SECURITY_EMAIL)} for security, compliance and privacy questions, document requests and vulnerability reports.</p>`,
			},
			{
				id: 'nda-speed',
				question: 'How quickly can we get documents under NDA?',
				answer: `<p>Within two business days after we sign a mutual NDA. ${a(tc('documents'), 'Request documents')}</p>`,
			},
		],
	},
	{
		id: 'compliance',
		label: 'Compliance',
		items: [
			{
				id: 'certifications',
				question: 'What certifications does ThingsBoard hold?',
				answer: `<p>ISO/IEC 27001:2022 and ISO 9001:2015, both issued by Swiss Approval North America. ${a(tc('compliance'), 'Validity and verification')}</p>`,
			},
			{
				id: 'iso-scope',
				question: 'What does your ISO/IEC 27001 certificate cover?',
				answer: `<p>How we build and run ThingsBoard, not a customer's own installation. ${a(`${tc('compliance')}#what-it-covers`, 'What it covers')}</p>`,
			},
			{
				id: 'certify-own',
				question: 'Can I certify my own solution built on ThingsBoard?',
				answer: `<p>Yes: our certificates count as supplier evidence in your audit. ${a(`${tc('compliance')}#compliant-solution`, 'Building a compliant solution')}</p>`,
			},
			{
				id: 'soc-2',
				question: 'Do you have a SOC 2 report?',
				answer: `<p>ThingsBoard is certified to ISO/IEC 27001 and ISO 9001. The data centers behind ThingsBoard Cloud and Private Cloud hold SOC 2, ISO 27001 and PCI DSS attestations; AWS publishes them in AWS Artifact. ${a(tc('cloud'), 'Data center certifications by deployment')}</p>`,
			},
			{
				id: 'gdpr-ccpa',
				question: 'Do you comply with GDPR and CCPA?',
				answer: `<p>Yes, through our own privacy program, and we declare our compliance. ${a(`${tc('compliance')}#gdpr`, 'GDPR')} · ${a(`${tc('compliance')}#ccpa`, 'CCPA')}</p>`,
			},
		],
	},
	{
		id: 'cloud',
		label: 'Cloud and Private Cloud',
		items: [
			{
				id: 'hosting',
				question: 'Where is my data hosted?',
				answer: `<p>On AWS, in North America or the EU for ThingsBoard Cloud; Private Cloud adds APAC, and Azure or GCP on request. ${a(tc('cloud'), 'Hosting and data residency')}</p>`,
			},
			{
				id: 'separation',
				question: 'How is my data separated from other customers?',
				answer: `<p>ThingsBoard Cloud confines every request to its own tenant; Private Cloud is a dedicated single-tenant cluster. ${a(tc('cloud'), 'Isolation')}</p>`,
			},
			{
				id: 'backups',
				question: 'How are backups handled?',
				answer: `<p>Daily with point-in-time recovery on ThingsBoard Cloud, nightly to a separate region on Private Cloud. ${a(tc('cloud'), 'Backups')}</p>`,
			},
			{
				id: 'uptime',
				question: 'What uptime do you commit to?',
				answer: `<p>Private Cloud has a contractual SLA of up to 99.95%; ThingsBoard Cloud publishes its status live. ${a(tc('cloud'), 'Uptime')}</p>`,
			},
			{
				id: 'staff-access',
				question: 'Can ThingsBoard staff see my data?',
				answer: `<p>Only authorized engineers, only to handle a request you raised, and that access is role-based and logged. ${a(tc('cloud'), 'Infrastructure access')}</p>`,
			},
			{
				id: 'vpn',
				question: 'Can Private Cloud connect to our network?',
				answer: `<p>Yes, through a dedicated VPN tunnel, depending on your plan. ${a(tc('cloud'), 'Network protection')}</p>`,
			},
			{
				id: 'leaving',
				question: 'What happens to my data when I leave?',
				answer: `<p>On ThingsBoard Cloud you export it through the REST API; on Private Cloud we prepare a full encrypted dump for you to download. ${a(tc('cloud'), 'Leaving')}</p>`,
			},
		],
	},
	{
		id: 'on-premises',
		label: 'On-premises',
		items: [
			{
				id: 'responsibility',
				question: 'Who is responsible for security in an on-premises deployment?',
				answer: `<p>You run the infrastructure; we are responsible for the product code, security fixes and the guides. ${a(`${tc('deployment')}#who-handles-what`, 'Who handles what')}</p>`,
			},
			{
				id: 'fixes',
				question: 'How do I get security fixes?',
				answer: `<p>In patch releases that need no environment or database changes. ${a(`${tc('onprem')}#security-fixes`, 'Security fixes on-premises')}</p>`,
			},
			{
				id: 'internet',
				question: 'Does an on-premises installation need internet access?',
				answer: `<p>Only for the hourly license check; perpetual licenses can use offline licensing instead. ${a(`${tc('onprem')}#network-requirements`, 'Network requirements')}</p>`,
			},
			{
				id: 'guides',
				question: 'Where do I find security configuration guides?',
				answer: `<p>In the Security section of the documentation. ${a(`${tc('onprem')}#guides`, 'Security configuration guides')}</p>`,
			},
		],
	},
	{
		id: 'data',
		label: 'Data security',
		items: [
			{
				id: 'encryption',
				question: 'Is my data encrypted?',
				answer: `<p>In transit over TLS; stored secrets with AES-256, and passwords as BCrypt hashes. ${a(`${tc('security')}#data`, 'Data security')}</p>`,
			},
			{
				id: '2fa-sso',
				question: 'Can we enforce 2FA and single sign-on?',
				answer: `<p>Yes: 2FA can be required for all users, and single sign-on works over OAuth 2.0 and OpenID Connect. ${a(`${tc('security')}#access`, 'Access control')}</p>`,
			},
			{
				id: 'ai-training',
				question: 'Is my data used to train AI models?',
				answer: `<p>No. We never use customer data to train models, and customer data never goes into public AI services. Our use of AI follows a dedicated policy aligned with GDPR, the EU AI Act and the NIST AI RMF.</p>`,
			},
		],
	},
];
