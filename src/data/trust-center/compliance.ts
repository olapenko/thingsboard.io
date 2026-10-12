import { tc } from '@data/trust-center/nav';

/** The Compliance page and its four certificate pages, as drafted. */

export interface Fact {
	label: string;
	html: string;
}

export interface BadgeCard {
	/** The mark's text in the draft: ISO 27001, ISO 9001, GDPR, CCPA. */
	mark: string;
	title: string;
	line: string;
	status: string;
	href: string;
}

const VALIDATOR = 'https://swissapproval.ch/certificate-validator/';

export const ISO_CARDS: BadgeCard[] = [
	{
		mark: 'ISO 27001',
		title: 'ISO/IEC 27001:2022',
		line: 'Information security management system',
		status: 'Certified · 9 Sep 2026',
		href: tc('compliance/iso-27001'),
	},
	{
		mark: 'ISO 9001',
		title: 'ISO 9001:2015',
		line: 'Quality management system',
		status: 'Certified · 9 Sep 2026',
		href: tc('compliance/iso-9001'),
	},
];

export const COMPLIANCE_FACTS: Fact[] = [
	{
		label: 'Certification body',
		html: `Swiss Approval North America (IAS-accredited, IAF MLA). Both certificates were issued on 9 September 2026 and are valid until 8 September 2027, within a three-year cycle that runs to 8 September 2029, with a surveillance audit every year. Verify them at <a href="${VALIDATOR}" target="_blank" rel="noopener noreferrer">swissapproval.ch/certificate-validator</a>.`,
	},
	{
		label: 'Certified scope',
		html: 'Software design and development, maintenance, training, IT consulting services, support services, integration services; cloud services; software QA testing; software licensing.',
	},
	{
		label: 'Penetration testing',
		html: 'An independent penetration test runs every year. The latest, by DataArt, took place in February 2026, with a retest in March 2026.',
	},
	{
		label: 'Data centers',
		html: 'ThingsBoard Cloud and Private Cloud run in data centers with ISO 27001, PCI DSS and SOC 2 attestations (AWS for ThingsBoard Cloud; AWS, Azure or GCP for Private Cloud).',
	},
];

export const BUILDING_COMPLIANT = {
	title: 'Building a compliant solution on ThingsBoard',
	paragraphs: [
		"You can certify the solution you build on ThingsBoard, for example to ISO/IEC 27001. Our ISO certificates count as supplier evidence in your audit, and under NDA we share the Statement of Applicability and audit reports. The platform gives you the controls auditors look for: access control, an audit log, encryption in transit and a choice of data region, so you don't need to build them from scratch.",
		'We meet privacy regulations through our own data protection program and declare our compliance, for example:',
	],
};

export const PRIVACY_CARDS: BadgeCard[] = [
	{
		mark: 'GDPR',
		title: 'GDPR',
		line: 'Applied to all personal data we process',
		status: 'Self-declared',
		href: tc('compliance/gdpr'),
	},
	{
		mark: 'CCPA',
		title: 'CCPA',
		line: "California residents' privacy rights",
		status: 'Self-declared',
		href: tc('compliance/ccpa'),
	},
];

export interface CertPage {
	slug: string;
	crumb: string;
	title: string;
	lede: string;
	facts: Fact[];
	/** The "Related:" line under the table, as markup. */
	related?: string;
}

const CERTIFIED = '<i class="tc-status">Certified.</i> Issued 9 September 2026 by Swiss Approval North America.';
const VALIDITY = `9 September 2026 – 8 September 2027, within a three-year cycle running to 8 September 2029, with annual surveillance audits. <a href="${VALIDATOR}" target="_blank" rel="noopener noreferrer">Verify the certificate</a>.`;

export const CERT_PAGES: CertPage[] = [
	{
		slug: 'iso-27001',
		crumb: 'ISO 27001',
		title: 'ISO/IEC 27001:2022',
		lede: 'Information security management system, including Amendment 1:2024.',
		facts: [
			{ label: 'Status', html: CERTIFIED },
			{ label: 'Registration No', html: '372-02-270-00460' },
			{ label: 'Validity', html: VALIDITY },
			{
				label: 'Statement of Applicability',
				html: '93 Annex A controls: 91 implemented, 1 implemented partially (A.8.12) and 1 not applicable (A.8.30). Available under NDA.',
			},
			{
				label: 'What it covers',
				html: "Our management system, meaning how we build, maintain and support the software. It doesn't certify the product itself, and it doesn't cover your own installation.",
			},
			{
				label: 'For your vendor assessment',
				html: 'You can use the certificate and its scope as supplier evidence in your own ISMS (A.5.19–A.5.23). We share the Statement of Applicability and audit reports under NDA.',
			},
		],
		related: `Related: <a href="${tc('documents/statement-of-applicability')}">Statement of Applicability</a> · <a href="${tc('documents/internal-audit-report-2026')}">Internal audit report</a>`,
	},
	{
		slug: 'iso-9001',
		crumb: 'ISO 9001',
		title: 'ISO 9001:2015',
		lede: 'Quality management system, run as one integrated system together with information security.',
		facts: [
			{ label: 'Status', html: CERTIFIED },
			{ label: 'Registration No', html: '372-02-100-02170 · IAF Code 33' },
			{ label: 'Validity', html: VALIDITY },
			{ label: 'For procurement', html: 'Use it as supplier evidence under clause 8.4 of your own QMS.' },
		],
	},
	{
		slug: 'gdpr',
		crumb: 'GDPR',
		title: 'GDPR',
		lede: 'We meet GDPR requirements through our own privacy program and declare our compliance.',
		facts: [
			{
				label: 'Scope of application',
				html: 'We apply data minimization and storage limitation to all personal data we process, wherever the person lives.',
			},
			{ label: 'Legal basis', html: 'When we process data on your behalf, the Data Processing Addendum applies.' },
			{
				label: 'Data subject requests',
				html: 'We handle requests to access, correct or delete data under a documented procedure. Write to security@thingsboard.io.',
			},
			{
				label: 'Breach notification',
				html: 'Breaches go through our incident process. We notify affected parties and regulators as the law and our contracts require.',
			},
		],
		related: `Related: <a href="/products/paas/dpa/">DPA</a> · <a href="/products/paas/privacy-policy/">Privacy Policy</a> · <a href="${tc('subprocessors')}">Sub-processors</a>`,
	},
	{
		slug: 'ccpa',
		crumb: 'CCPA',
		title: 'CCPA',
		lede: 'We meet CCPA requirements through the same privacy program and declare our compliance.',
		facts: [
			{
				label: 'Consumer rights',
				html: 'We handle requests to know, delete and correct personal information through the same procedure as GDPR requests. Write to security@thingsboard.io.',
			},
			{ label: 'Sale of data', html: 'We do not sell personal information.' },
		],
	},
];

export const certPage = (slug: string): CertPage => {
	const page = CERT_PAGES.find((p) => p.slug === slug);
	if (!page) throw new Error(`trust-center: no certificate page "${slug}".`);
	return page;
};
