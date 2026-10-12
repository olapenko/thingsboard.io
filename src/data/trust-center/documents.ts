import { contactHref, tc } from '@data/trust-center/nav';

/**
 * The draft's 20 documents, as its `DOCS` dataset has them: the hub lists the 18 with a group, the
 * Documents page lists all 20, and each document without a page of its own gets a detail page.
 */

export type Access = 'public' | 'nda' | 'pending';

export interface TcDoc {
	slug: string;
	name: string;
	category: string;
	access: Access;
	version: string;
	owner: string;
	/** The hub's group (`DOC_GROUPS`); a document without one appears on the Documents page only. */
	group?: 0 | 1 | 2 | 3;
	description: string;
	/** A public file to download. */
	file?: string;
	/** A page the document IS: opened directly, no detail page. */
	url?: string;
}

export const DOC_GROUPS = [
	'Governance & compliance',
	'Security & development',
	'Legal & privacy',
	'Reports & resilience',
] as const;

export const ACCESS_LABEL: Record<Access, string> = { public: 'Public', nda: 'NDA', pending: 'Planned' };
export const ACCESS_ACTION: Record<Access, string> = {
	public: 'View',
	nda: 'Request via NDA',
	pending: 'Ask about it',
};

export const DOCS: TcDoc[] = [
	{
		slug: 'information-security-policy',
		name: 'Information Security Policy',
		category: 'Governance',
		access: 'nda',
		version: 'v1.2',
		owner: 'IMS Manager',
		group: 0,
		description:
			'The policy behind our information security management system: objectives, roles, our approach to risk and the policy framework. Approved by the CEO and shared with all staff and contractors.',
	},
	{
		slug: 'iso-27001-certificate',
		file: 'https://drive.google.com/file/d/1zvMo8-HRlJWvPNRMwr7He7iL-gu7zjuc/view',
		name: 'ISO/IEC 27001:2022 certificate',
		category: 'Compliance',
		access: 'public',
		version: '09.09.2026',
		owner: 'Swiss Approval North America',
		group: 0,
		description:
			'Registration No 372-02-270-00460, issued 9 September 2026, valid to 8 September 2027. Verify at swissapproval.ch/certificate-validator.',
	},
	{
		slug: 'iso-9001-certificate',
		file: 'https://drive.google.com/file/d/1dwljuwvOWOQp3lXSCyfBIfRasdQi7AVM/view',
		name: 'ISO 9001:2015 certificate',
		category: 'Compliance',
		access: 'public',
		version: '09.09.2026',
		owner: 'Swiss Approval North America',
		group: 0,
		description:
			'Registration No 372-02-100-02170 (IAF Code 33), issued 9 September 2026, valid to 8 September 2027. Verify at swissapproval.ch/certificate-validator.',
	},
	{
		slug: 'statement-of-applicability',
		name: 'Statement of Applicability',
		category: 'Compliance',
		access: 'nda',
		version: 'v1.0',
		owner: 'IMS Manager',
		group: 0,
		description:
			'All 93 Annex A controls with their status and justification: 91 implemented, 1 implemented partially (A.8.12, data leakage prevention) and 1 not applicable (A.8.30).',
	},
	{
		slug: 'risk-assessment-report',
		name: 'Risk assessment and treatment report',
		category: 'Compliance',
		access: 'nda',
		version: 'v1.1',
		owner: 'IMS Manager',
		group: 0,
		description:
			'The scoring method, every assessed risk, treatment decisions and each residual risk accepted by management.',
	},
	{
		slug: 'secure-development-policy',
		name: 'Secure Development Policy',
		category: 'Security',
		access: 'nda',
		version: 'v1.0',
		owner: 'CTO',
		group: 1,
		description:
			'Security across the engineering lifecycle: mandatory review, separate environments, weekly code and dependency scanning, and change control.',
	},
	{
		slug: 'change-management-procedure',
		name: 'Change Management Procedure',
		category: 'Security',
		access: 'nda',
		version: 'v1.0',
		owner: 'CTO',
		group: 1,
		description: 'How a change reaches production: request, impact assessment, approval and tracking in Jira.',
	},
	{
		slug: 'incident-management-procedure',
		name: 'Incident Management Procedure',
		category: 'Security',
		access: 'nda',
		version: 'v1.0',
		owner: 'IMS Manager',
		group: 1,
		description: 'Reporting channels, severity classification, registration and escalation timings, evidence handling.',
	},
	{
		slug: 'supplier-security-policy',
		name: 'Supplier Security Policy',
		category: 'Security',
		access: 'nda',
		version: 'v1.0',
		owner: 'Legal Counsel',
		group: 1,
		description:
			'NDA before any access, security clauses in contracts, scored supplier evaluation with a minimum security rating, and annual supplier review.',
	},
	{
		slug: 'ai-services-policy',
		name: 'AI Services Policy',
		category: 'Security',
		access: 'nda',
		version: 'v1.0',
		owner: 'IMS Manager',
		group: 1,
		description:
			'Which data may reach AI services and how we control it, aligned with GDPR, the EU AI Act and the NIST AI RMF.',
	},
	{
		slug: 'privacy-policy',
		url: '/products/paas/privacy-policy/',
		name: 'Privacy Policy (ThingsBoard Cloud)',
		category: 'Legal',
		access: 'public',
		version: 'current',
		owner: 'Legal Counsel',
		group: 2,
		description:
			'What personal data ThingsBoard Cloud processes in North America and the EU, on what basis, for how long, and how you exercise your rights.',
	},
	{
		slug: 'data-processing-addendum',
		url: '/products/paas/dpa/',
		name: 'Data Processing Addendum (DPA)',
		category: 'Legal',
		access: 'public',
		version: 'current',
		owner: 'Legal Counsel',
		group: 2,
		description:
			'Contractual data protection terms: processor obligations, sub-processor rules, transfer mechanisms and breach notification.',
	},
	{
		slug: 'sub-processor-list',
		url: tc('subprocessors'),
		name: 'Sub-processor list',
		category: 'Legal',
		access: 'public',
		version: 'living',
		owner: 'IMS Manager',
		group: 2,
		description:
			'Every vendor that may access customer or personal data, with its purpose, location and assessment status.',
	},
	{
		slug: 'data-protection-policy',
		name: 'Privacy Policy (Product Data Protection Policy)',
		category: 'Legal',
		access: 'nda',
		version: 'v1.0',
		owner: 'Legal Counsel',
		group: 2,
		description: 'Our internal rules for protecting personal data, including privacy by design.',
	},
	{
		slug: 'pentest-executive-summary',
		name: 'Penetration test executive summary',
		category: 'Reports',
		access: 'nda',
		version: 'Mar 2026',
		owner: 'CTO',
		group: 3,
		description:
			"Scope, methodology (OWASP, OSSTMM, NIST SP 800-115) and an overview of findings and remediation. We don't share the full report with anyone.",
	},
	{
		slug: 'internal-audit-report-2026',
		name: 'Internal audit report 2026',
		category: 'Reports',
		access: 'nda',
		version: 'Jul 2026',
		owner: 'IMS Manager',
		group: 3,
		description:
			'Full-scope audit of both standards by an independent contractor (30 June – 1 July 2026): no major and 3 minor nonconformities, with corrective actions and deadlines.',
	},
	{
		slug: 'bcp-drp',
		name: 'Business Continuity Plan',
		category: 'Resilience',
		access: 'nda',
		version: 'v1.0',
		owner: 'IMS Manager',
		group: 3,
		description:
			'Continuity scenarios for ThingsBoard Cloud, the crisis team, recovery procedures and the measured results of the last exercise.',
	},
	{
		slug: 'backup-policy',
		name: 'Backup Policy',
		category: 'Resilience',
		access: 'nda',
		version: 'v1.0',
		owner: 'IMS Manager',
		group: 3,
		description:
			'Encryption, separation from primary systems, archiving media and deadlines, and the annual restore test.',
	},
	{
		slug: 'caiq-lite',
		name: 'CAIQ Lite',
		category: 'Questionnaires',
		access: 'pending',
		version: '—',
		owner: 'IMS Manager',
		description:
			"Our self-assessment against the Cloud Security Alliance's Consensus Assessment Initiative Questionnaire (Lite).",
	},
	{
		slug: 'sig-lite',
		name: 'SIG Lite',
		category: 'Questionnaires',
		access: 'pending',
		version: '—',
		owner: 'IMS Manager',
		description: 'Our answers to the Standardized Information Gathering (Lite) questionnaire.',
	},
];

/** A document that is a page opens that page; the rest open their detail page. */
export const docHref = (d: TcDoc): string => d.url ?? tc(`documents/${d.slug}`);

export const isOffSite = (href: string | undefined): boolean => !!href && /^https?:/.test(href);

/** The documents with a detail page: the ones that are not a page already. */
export const DOCS_WITH_PAGE = DOCS.filter((d) => !d.url);

/** The hub's 18, the ones in a group. */
export const HUB_DOCS = DOCS.filter((d) => d.group !== undefined);

/**
 * Where a document's action goes: a public file opens, an NDA document is requested on the contact
 * form under "Request documents under NDA" with that document ticked, and a planned one asks about
 * it under the questionnaire subject (or "Other security question").
 */
export const docActionHref = (d: TcDoc): string => {
	if (d.access === 'public') return d.file ?? '#';
	if (d.access === 'nda') return contactHref('nda', d.slug);
	return contactHref(d.category === 'Questionnaires' ? 'questionnaire' : 'other', d.slug);
};

/** The contact form's "Documents you need": every NDA document, plus the two Private Cloud ones. */
export const NDA_DOC_OPTIONS: { value: string; label: string }[] = [
	...DOCS.filter((d) => d.access === 'nda').map((d) => ({ value: d.slug, label: d.name })),
	{ value: 'dpa-private-cloud', label: 'DPA for Private Cloud' },
	{ value: 'private-cloud-architecture', label: 'Private Cloud cluster architecture and read-only metrics' },
];

/** A document's action in a list: a public one is viewed, the rest are requested on the contact form. */
export const docAction = (d: TcDoc): { label: string; href: string; dead?: boolean } => {
	if (d.access !== 'public') return { label: 'Request', href: docActionHref(d) };
	const href = d.url ?? d.file;
	return href ? { label: 'View', href } : { label: 'View', href: '#', dead: true };
};
