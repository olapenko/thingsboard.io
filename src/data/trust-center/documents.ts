import { tc } from '@data/trust-center/nav';

/**
 * The Trust Center's documents, from the draft (research/trust-center/CONTENT.md), with the review's
 * edits: the certificates' descriptions no longer repeat their dates and numbers (those live on the
 * ISO pages), and no document names its internal owner on the page.
 *
 * `u`: the document is a page of its own, and its row links there instead of a document page.
 * `f`: the file a public document's button opens.
 * `g`: its group on the overview (`DOC_GROUPS`); questionnaires have none.
 */

export type DocAccess = 'public' | 'nda' | 'planned';

export interface TrustDoc {
	slug: string;
	name: string;
	category: string;
	access: DocAccess;
	version: string;
	description: string;
	group?: number;
	u?: string;
	f?: string;
}

export const DOCS: TrustDoc[] = [
	{
		slug: 'information-security-policy',
		name: 'Information Security Policy',
		category: 'Governance',
		access: 'nda',
		version: 'v1.2',
		group: 0,
		description:
			'The policy behind our information security management system: objectives, roles, our approach to risk and the policy framework. Approved by the CEO and shared with all staff and contractors.',
	},
	{
		slug: 'iso-27001-certificate',
		// CONTENT NOTE: the draft keeps both certificates on Google Drive. They belong on the site,
		// next to the ISO pages, once the files are supplied.
		f: 'https://drive.google.com/file/d/1zvMo8-HRlJWvPNRMwr7He7iL-gu7zjuc/view',
		name: 'ISO/IEC 27001:2022 certificate',
		category: 'Compliance',
		access: 'public',
		version: '09.09.2026',
		group: 0,
		description: 'The certificate as issued. Its scope, validity and how to verify it are on the ISO/IEC 27001 page.',
	},
	{
		slug: 'iso-9001-certificate',
		f: 'https://drive.google.com/file/d/1dwljuwvOWOQp3lXSCyfBIfRasdQi7AVM/view',
		name: 'ISO 9001:2015 certificate',
		category: 'Compliance',
		access: 'public',
		version: '09.09.2026',
		group: 0,
		description: 'The certificate as issued. Its validity and how to verify it are on the ISO 9001 page.',
	},
	{
		slug: 'statement-of-applicability',
		name: 'Statement of Applicability',
		category: 'Compliance',
		access: 'nda',
		version: 'v1.0',
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
		group: 1,
		description: 'How a change reaches production: request, impact assessment, approval and tracking in Jira.',
	},
	{
		slug: 'incident-management-procedure',
		name: 'Incident Management Procedure',
		category: 'Security',
		access: 'nda',
		version: 'v1.0',
		group: 1,
		description: 'Reporting channels, severity classification, registration and escalation timings, evidence handling.',
	},
	{
		slug: 'supplier-security-policy',
		name: 'Supplier Security Policy',
		category: 'Security',
		access: 'nda',
		version: 'v1.0',
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
		group: 1,
		description:
			'Which data may reach AI services and how we control it, aligned with GDPR, the EU AI Act and the NIST AI RMF.',
	},
	{
		slug: 'privacy-policy',
		u: '/products/paas/privacy-policy/',
		name: 'Privacy Policy (ThingsBoard Cloud)',
		category: 'Legal',
		access: 'public',
		version: 'current',
		group: 2,
		description:
			'What personal data ThingsBoard Cloud processes in North America and the EU, on what basis, for how long, and how you exercise your rights.',
	},
	{
		slug: 'data-processing-addendum',
		u: '/products/paas/dpa/',
		name: 'Data Processing Addendum (DPA)',
		category: 'Legal',
		access: 'public',
		version: 'current',
		group: 2,
		description:
			'Contractual data protection terms: processor obligations, sub-processor rules, transfer mechanisms and breach notification.',
	},
	{
		slug: 'sub-processor-list',
		u: tc('subprocessors'),
		name: 'Sub-processor list',
		category: 'Legal',
		access: 'public',
		version: 'living',
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
		group: 2,
		description: 'Our internal rules for protecting personal data, including privacy by design.',
	},
	{
		slug: 'pentest-executive-summary',
		name: 'Penetration test executive summary',
		category: 'Reports',
		access: 'nda',
		version: 'Mar 2026',
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
		group: 3,
		description:
			'Encryption, separation from primary systems, archiving media and deadlines, and the annual restore test.',
	},
	{
		slug: 'caiq-lite',
		name: 'CAIQ Lite',
		category: 'Questionnaires',
		access: 'planned',
		version: '—',
		description:
			"Our self-assessment against the Cloud Security Alliance's Consensus Assessment Initiative Questionnaire (Lite).",
	},
	{
		slug: 'sig-lite',
		name: 'SIG Lite',
		category: 'Questionnaires',
		access: 'planned',
		version: '—',
		description: 'Our answers to the Standardized Information Gathering (Lite) questionnaire.',
	},
];

export const DOC_GROUPS = [
	'Governance & compliance',
	'Security & development',
	'Legal & privacy',
	'Reports & resilience',
];

export const ACCESS_LABEL: Record<DocAccess, string> = {
	public: 'Public',
	nda: 'Under NDA',
	planned: 'Planned',
};

/** Two documents the request form offers that only Private Cloud customers need. */
export const PRIVATE_CLOUD_NDA_DOCS: Pick<TrustDoc, 'slug' | 'name'>[] = [
	{ slug: 'dpa-private-cloud', name: 'DPA for Private Cloud' },
	{ slug: 'private-cloud-architecture', name: 'Private Cloud cluster architecture and read-only metrics' },
];

/** Everything the request form can ask for under NDA, in the library's order. */
export const NDA_DOCS: Pick<TrustDoc, 'slug' | 'name'>[] = [
	...DOCS.filter((d) => d.access === 'nda').map(({ slug, name }) => ({ slug, name })),
	...PRIVATE_CLOUD_NDA_DOCS,
];

/** A document's own page, or the page that is the document. */
export const docHref = (d: TrustDoc): string => d.u ?? tc(`documents/${d.slug}`);

/** The request form with these documents ticked. */
export const requestHref = (slugs: string[]): string =>
	`${tc('contact')}?subject=nda&docs=${slugs.map(encodeURIComponent).join(',')}`;

/** The contact form, asking about a planned document. */
export const askHref = (d: TrustDoc): string =>
	`${tc('contact')}?subject=${d.category === 'Questionnaires' ? 'questionnaire' : 'other'}&docs=${d.slug}`;
