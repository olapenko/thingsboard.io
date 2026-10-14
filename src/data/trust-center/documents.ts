import { SECURITY_TOPICS } from '@data/trust-center/forms';
import { contactHref, tc } from '@data/trust-center/nav';

/**
 * The draft's 20 documents, as its `DOCS` dataset has them, plus three the Cloud page lists (Terms of
 * Use, DPA for Private Cloud, Private Cloud cluster architecture): the hub lists the draft's 18 with a
 * group, the Documents page lists all 23, and each document without a page of its own gets a detail page.
 *
 * Three states, one meaning and one action each:
 * - `public`: available now; View.
 * - `nda`: exists, sent after a mutual NDA; Request (Add in the library), on the contact form.
 * - `pending`: planned, not written yet; no action, since there is nothing to send.
 *
 * Four more, which the Cloud and On-premises pages list, wait for their address (`linkMissing`): the
 * draft listed them as public with links to nowhere. They stay out of the library until one is given.
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

/**
 * A public document with neither a file nor a page: its address is missing. It is listed where the
 * draft listed it, marked "Link needed", and joins the library, the hub's count and the detail pages
 * once it has a `file` or a `url`.
 */
export const linkMissing = (d: TcDoc): boolean => d.access === 'public' && !d.file && !d.url;

/**
 * The hub's four groups, in order (a document's `group` is the index), each with its heading's icon:
 * a seal (the "Certified" check), a shield with a check (the rules; no keyhole, which the rows' NDA
 * lock already is), the scales of law, a report with a chart. The second was the draft's "Security &
 * development": its five are policies and procedures, so it is named for them.
 */
export const DOC_GROUPS = [
	{ name: 'Governance & compliance', icon: 'tabler:rosette-discount-check' },
	{ name: 'Security policies', icon: 'tabler:shield-check' },
	{ name: 'Legal & privacy', icon: 'tabler:scale' },
	{ name: 'Reports & resilience', icon: 'tabler:report-analytics' },
] as const;

export const ACCESS_LABEL: Record<Access, string> = { public: 'Public', nda: 'NDA', pending: 'Planned' };
/** The one action a state takes; a planned document has none. */
export const ACCESS_ACTION: Record<Access, string | undefined> = {
	public: 'View',
	nda: 'Request via NDA',
	pending: undefined,
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
		// One page per certificate: the library opens its Compliance page, which has the file too.
		url: tc('compliance/iso-27001'),
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
		// One page per certificate: the library opens its Compliance page, which has the file too.
		url: tc('compliance/iso-9001'),
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
		owner: 'IMS Manager',
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
		owner: 'IMS Manager',
		group: 1,
		description:
			'How changes to our systems and processes are requested, assessed, approved, implemented and reviewed, tracked in Jira.',
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
		slug: 'private-cloud-architecture',
		name: 'Private Cloud cluster architecture and read-only metrics',
		category: 'Security',
		access: 'nda',
		version: '—',
		owner: 'CTO',
		description:
			"Your Private Cloud cluster's architecture, with read-only access to its metrics and Kubernetes dashboards.",
	},
	{
		slug: 'terms-of-use',
		url: '/products/paas/terms-of-use/',
		name: 'Terms of Use (ThingsBoard Cloud)',
		category: 'Legal',
		access: 'public',
		version: 'current',
		owner: 'Legal Counsel',
		description: 'The terms under which you use ThingsBoard Cloud in North America and the EU.',
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
		name: 'Data Processing Agreement (DPA)',
		category: 'Legal',
		access: 'public',
		version: 'current',
		owner: 'Legal Counsel',
		group: 2,
		description:
			'Contractual data protection terms: processor obligations, sub-processor rules, transfer mechanisms and breach notification.',
	},
	{
		slug: 'dpa-private-cloud',
		name: 'DPA for Private Cloud',
		category: 'Legal',
		access: 'nda',
		version: '—',
		owner: 'Legal Counsel',
		description: 'The Data Processing Agreement for Private Cloud, which has its own privacy terms.',
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
		owner: 'IMS Manager',
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
			'Full-scope audit of both standards by an independent contractor (30 June – 1 July 2026): no major and 3 minor nonconformities, with the deadline for corrective actions.',
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
			'Continuity of company operations: crisis team, emergency response, alternate sites and the exercise program.',
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
	// CLARIFY: the four below are public in the draft, with links to nowhere. Give each its address
	// (`url` for a page, `file` for a download) and it joins the library. The descriptions say no more
	// than the draft's names and lines do.
	{
		slug: 'private-cloud-sla',
		url: '/pricing/?product=thingsboard-private-cloud',
		name: 'Private Cloud SLA and service description',
		category: 'Legal',
		access: 'public',
		version: 'current',
		owner: '—',
		description: 'The uptime formula and exclusions for Private Cloud, in the Private Cloud pricing FAQ.',
	},
	{
		slug: 'license-server-network-requirements',
		name: 'License server network requirements',
		category: 'Operations',
		access: 'public',
		version: '—',
		owner: '—',
		description: 'The outbound connection to license.thingsboard.io that the hourly license check needs.',
	},
	{
		slug: 'eula',
		name: 'EULA and license terms',
		category: 'Legal',
		access: 'public',
		version: '—',
		owner: '—',
		description: 'The license terms for ThingsBoard installed on-premises.',
	},
	{
		slug: 'support-policy',
		name: 'Support policy',
		category: 'Legal',
		access: 'public',
		version: '—',
		owner: '—',
		description: 'How we support ThingsBoard.',
	},
];

/** The library: every document that can be opened, requested or is planned; not the ones awaiting an address. */
export const LIBRARY_DOCS = DOCS.filter((d) => !linkMissing(d));

/** A document that is a page opens that page; the rest open their detail page. */
export const docHref = (d: TcDoc): string => d.url ?? tc(`documents/${d.slug}`);

export const isOffSite = (href: string | undefined): boolean => !!href && /^https?:/.test(href);

/** The documents with a detail page: the library's, less the ones that are a page already. */
export const DOCS_WITH_PAGE = LIBRARY_DOCS.filter((d) => !d.url);

/** The hub's 18, the ones in a group. */
export const HUB_DOCS = LIBRARY_DOCS.filter((d) => d.group !== undefined);

/**
 * Where a document's action goes: a public file opens; an NDA one is requested on the contact form
 * under "Request documents" with that document ticked. A planned one has nowhere to go.
 */
export const docActionHref = (d: TcDoc): string | undefined => {
	if (d.access === 'public') return d.file ?? d.url;
	if (d.access === 'nda') return contactHref(SECURITY_TOPICS.documents.value, d.slug);
	return undefined;
};

/** The hub's group each category of NDA document falls in. */
const REQUEST_GROUP_OF: Record<string, number> = {
	Governance: 0,
	Compliance: 0,
	Security: 1,
	Legal: 2,
	Reports: 3,
	Resilience: 3,
};

export interface RequestGroup {
	name: string;
	docs: { value: string; label: string }[];
}

/**
 * The contact form's "Documents you need": the documents that can be requested, the NDA ones, in the
 * hub's four groups by category. A planned one is not there: there is nothing to send yet. An NDA
 * document with a category the groups don't know fails the build rather than landing in the wrong
 * group.
 */
export const REQUEST_GROUPS: RequestGroup[] = DOC_GROUPS.map((g, i) => ({
	name: g.name,
	docs: LIBRARY_DOCS.filter((d) => d.access === 'nda').flatMap((d) => {
		const group = REQUEST_GROUP_OF[d.category];
		if (group === undefined) throw new Error(`[trust-center] no request group for the category "${d.category}"`);
		return group === i ? [{ value: d.slug, label: d.name }] : [];
	}),
})).filter((g) => g.docs.length > 0);

/** A list row's action: what the document's state allows. */
export interface DocAction {
	label: string;
	href: string;
	/** The document's address is missing (`linkMissing`): "Link needed" in the action's place. */
	missing?: boolean;
}

/**
 * A document's action in a list: a public one is viewed, an NDA one requested on the contact form, a
 * planned one has none (`undefined`).
 */
export const docAction = (d: TcDoc): DocAction | undefined => {
	if (d.access === 'pending') return undefined;
	if (d.access === 'nda') return { label: 'Request', href: docActionHref(d)! };
	// The file first: a certificate's `url` is its Compliance page, and "View" opens the certificate.
	const href = d.file ?? d.url;
	return href ? { label: 'View', href } : { label: 'View', href: '#', missing: true };
};

/** The row's actions, for a list: the one its state takes, or none. */
export const docActions = (d: TcDoc): DocAction[] => {
	const action = docAction(d);
	return action ? [action] : [];
};

/** A document's row where a deployment page lists it, under the draft's name for it there. */
export const docRow = (slug: string, name?: string) => {
	const d = DOCS.find((doc) => doc.slug === slug);
	if (!d) throw new Error(`[trust-center] no document "${slug}"`);
	return { name: name ?? d.name, access: d.access, actions: docActions(d) };
};
