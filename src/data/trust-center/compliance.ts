import { SECURITY_TOPICS } from '@data/trust-center/forms';
import { contactHref, tc } from '@data/trust-center/nav';
import { TILE_MARK } from '@data/trust-center/overview';

/** The Compliance page and its four certificate pages, as drafted. */

export interface Fact {
	label: string;
	html: string;
}

export interface BadgeCard {
	/** The mark's text in the draft: ISO 27001, ISO 9001, GDPR, CCPA. */
	mark: string;
	/** The standard's number, for the seal. */
	number?: string;
	title: string;
	line: string;
	status: string;
	/** The certificate's registration number, for the validator. */
	registration?: string;
	href: string;
}

const VALIDATOR = 'https://swissapproval.ch/certificate-validator/';

export const ISO_CARDS: BadgeCard[] = [
	{
		mark: 'ISO 27001',
		number: '27001',
		title: 'ISO/IEC 27001:2022',
		line: 'Information security management system',
		status: 'Certified · 9 Sep 2026',
		registration: '372-02-270-00460',
		href: tc('compliance/iso-27001'),
	},
	{
		mark: 'ISO 9001',
		number: '9001',
		title: 'ISO 9001:2015',
		line: 'Quality management system',
		status: 'Certified · 9 Sep 2026',
		registration: '372-02-100-02170',
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

/**
 * THE PAGE'S STRUCTURE (13 Oct 2026), in place of the draft's:
 * - the lede states our position (`COMPLIANCE_LEDE`), not the draft's "for example" paragraph;
 * - Certifications and assurance: the ISO cards, the validator link (`CERTS`), then the draft's
 *   fact table (`CERT_DETAILS`);
 * - Using our compliance in your audit, on the page's one band, the site's blue tint (`AUDIT`);
 * - Privacy and data protection: the commitments both laws share, then GDPR and CCPA side by side
 *   at the same size (`PRIVACY`).
 * Each step came in as its own commit, so reverting the latest brings the one before back.
 */
export const COMPLIANCE_LEDE =
	'ThingsBoard is certified to ISO/IEC 27001 and ISO 9001, independently tested every year, and meets the GDPR and the CCPA through its own data protection program.';

/** Under the two certificate cards, the validator: a question, then its site's name as the link. */
export const CERTS = {
	/** Under the cards, beside the registration numbers the validator asks for. */
	verify: {
		lead: 'Want to verify a certificate?',
		label: 'swissapproval.ch',
		href: VALIDATOR,
	},
};

/**
 * The table under the certificate cards, as the draft had it, with its four rows: the certification
 * body (its sentence without "Verify them at…", which is the link under the cards), the scope, the
 * pentest and the data centers.
 */
export const CERT_DETAILS: Fact[] = COMPLIANCE_FACTS.map((fact) =>
	fact.label === 'Certification body'
		? {
				...fact,
				html: 'Swiss Approval North America (IAS-accredited, IAF MLA). Both certificates were issued on 9 September 2026 and are valid until 8 September 2027, within a three-year cycle that runs to 8 September 2029, with a surveillance audit every year.',
			}
		: fact
);

/**
 * A registration number with a button that copies it, for the certificate validator, which asks for
 * the number. The button works through the certificate page's script (`compliance/[slug].astro`);
 * as markup, so it sits in the fact table's cell.
 */
const COPY_ICON =
	'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"/><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/></svg>';
const regNo = (number: string, rest = '') =>
	`<span class="tc-regno">${number}</span>${rest} <button type="button" class="tc-copy-btn" data-copy="${number}" aria-label="Copy the registration number ${number}">${COPY_ICON}<span data-copy-label>Copy</span></button>`;

/** The draft's "Building a compliant solution" paragraph, as guidance with the controls linked. */
export const AUDIT = {
	title: 'Using our compliance in your audit',
	text: 'You can certify the solution you build on ThingsBoard to ISO/IEC 27001 or another standard. Our certificates count as supplier evidence in your audit, and under NDA we share the Statement of Applicability and audit reports.',
	controlsLead: "The platform gives you the controls auditors look for, so you don't need to build them from scratch:",
	controls: [
		{ label: 'Access control', href: tc('access') },
		{ label: 'An audit log', href: tc('access') },
		{ label: 'Encryption in transit', href: tc('data') },
		{ label: 'A choice of data region', href: tc('cloud') },
	],
	cta: {
		label: 'Request the Statement of Applicability',
		href: contactHref(SECURITY_TOPICS.documents.value, 'statement-of-applicability'),
	},
};

export const BUILDING_COMPLIANT = {
	title: 'Building a compliant solution on ThingsBoard',
	paragraphs: [
		"You can certify the solution you build on ThingsBoard, for example to ISO/IEC 27001. Our ISO certificates count as supplier evidence in your audit, and under NDA we share the Statement of Applicability and audit reports. The platform gives you the controls auditors look for: access control, an audit log, encryption in transit and a choice of data region, so you don't need to build them from scratch.",
		'We meet privacy regulations through our own data protection program and declare our compliance, for example:',
	],
};

const DPA = '/products/paas/dpa/';

/** A point with the page that proves it. */
/** A sentence with its proof inside it, as markup: the linked words are the link. */
export type Proof = string;

/**
 * Compliance's privacy section, drafted here (13 Oct 2026) in place of the draft's two thin rows
 * ("GDPR · Applied to all personal data we process · Self-declared", "CCPA · California residents'
 * privacy rights · Self-declared") and their lead ("We meet privacy regulations through our own data
 * protection program and declare our compliance, for example:"). Every point is a fact one of our
 * own pages already states: the EU region and that data never moves between regions (the FAQ), the
 * DPA's standard contractual clauses and its breach notification "without undue delay" (the DPA's
 * text), the notice of sub-processor changes (Sub-processors), the documented procedure for data
 * subject requests (the GDPR page). The DPA's Data Protection Officer is left out on purpose.
 */
export const PRIVACY = {
	title: 'Privacy and data protection',
	lead: 'We protect personal data under the GDPR and the CCPA through our own data protection program, backed by the same ISO 27001 controls.',
	/** What we commit to under both laws, each with the page that proves it. */
	commitments: [
		`Data stays in the EU on ThingsBoard Cloud’s <a href="${tc('cloud')}">EU region</a>, and never moves between regions.`,
		`A <a href="${DPA}">Data Processing Agreement</a>, with standard contractual clauses for transfers outside the EU.`,
		`Published <a href="${tc('subprocessors')}">sub-processors</a>, with notice of material changes.`,
		// "Security of processing under our certified ISO/IEC 27001 controls" left: the lead says it
		// ("backed by the same ISO 27001 controls"), and the certificates are the section above.
		`<a href="${contactHref(SECURITY_TOPICS.dsr.value)}">Data subject requests</a> and breach notification under documented procedures.`,
	] satisfies Proof[],
	/** What each law adds, at the same size: one line each, the rest on its own page. */
	laws: [
		{
			title: 'GDPR',
			icon: 'eu-stars',
			/** The site's primary blue: the EU's own colour, near enough, from the palette. */
			accent: 'brand' as const,
			text: 'For personal data of people in the EU. Transfers outside the EU are covered by standard contractual clauses.',
			href: tc('compliance/gdpr'),
		},
		{
			title: 'CCPA',
			icon: 'tabler:user-shield',
			/** The hub tiles' near-black. */
			accent: TILE_MARK,
			text: "For personal information of California residents. We don't sell personal information.",
			href: tc('compliance/ccpa'),
		},
	],
	/** Why there is no certificate here, said once. */
	note: 'Like most companies, we declare our GDPR and CCPA compliance ourselves, and commit to it contractually in our DPA.',
};

export interface CertPage {
	slug: string;
	crumb: string;
	title: string;
	lede: string;
	facts: Fact[];
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
			{ label: 'Registration No', html: regNo('372-02-270-00460') },
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
	},
	{
		slug: 'iso-9001',
		crumb: 'ISO 9001',
		title: 'ISO 9001:2015',
		lede: 'Quality management system, run as one integrated system together with information security.',
		facts: [
			{ label: 'Status', html: CERTIFIED },
			{ label: 'Registration No', html: regNo('372-02-100-02170', ' · IAF Code 33') },
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
			{
				label: 'Legal basis',
				// The document's own title, as the site names it everywhere (the draft said "Addendum").
				html: `When we process data on your behalf, the <a href="${DPA}">Data Processing Agreement</a> applies.`,
			},
			{
				label: 'Data residency',
				html: `ThingsBoard Cloud runs in two independent regions, North America and the EU, and data never moves between them. Private Cloud runs in North America, the EU or APAC. <a href="${tc('cloud')}">Cloud and Private Cloud</a>.`,
			},
			{
				label: 'International transfers',
				html: `Our <a href="${DPA}">DPA</a> provides for standard contractual clauses for transfers of personal data outside the EU.`,
			},
			{
				label: 'Sub-processors',
				html: `Every vendor that may access personal data is listed on our <a href="${tc('subprocessors')}">Sub-processors</a> page; we notify customers of material changes, as the DPA sets out.`,
			},
			{
				label: 'Security of processing',
				html: `Our information security controls are certified to <a href="${tc('compliance/iso-27001')}">ISO/IEC 27001:2022</a>.`,
			},
			{
				label: 'Data subject requests',
				html: 'We handle requests to access, correct or delete data under a documented procedure. Write to security@thingsboard.io.',
			},
			{
				label: 'Breach notification',
				html: 'Breaches go through our incident process. We notify affected parties and regulators as the law and our contracts require.',
			},
		],
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
