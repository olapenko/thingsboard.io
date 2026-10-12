import { DOCS } from '@data/trust-center/documents';
import { tc } from '@data/trust-center/nav';
import { ACCESS, type TagLook } from '@data/trust-center/status';

/**
 * PROPOSED: the document library as the review of 2026-10-12 suggests it, beside the current one
 * (`/trust-center/documents/proposed/`). It reads the same `DOCS` and adds only what the proposal
 * needs, so the two libraries cannot drift apart while both exist:
 *
 * - ONE taxonomy, by what a document IS (`DOC_TYPES`), replacing the four groups and the seven
 *   categories, which crossed topic (Security, Governance) with type (Reports, Questionnaires).
 * - PRODUCT-WIDE: every document a security reviewer, auditor or lawyer would cite, whichever
 *   deployment it concerns, including the ones the Cloud and On-premises pages listed on their own
 *   (`EXTRA_DOCS`). Product documentation (installation guides, release notes, network
 *   requirements, configuration guides) stays on the deployment pages as guides.
 * - APPLIES TO: each document names the deployments it concerns (`APPLIES_TO`); none means every
 *   deployment. Taken from where the deployment pages listed it; the owner to confirm.
 * - Two more access states: a hosting provider's attestation (`external`: theirs, not ours, so it
 *   never reads as a ThingsBoard SOC 2) and a document we have but have not published
 *   (`request`: asked for through the form, as the draft's "Ask for it" did).
 * - Search words a reader actually types (`KEYWORDS`): pentest, BCP, SoA, SOC 2.
 * - A clearer name for the internal data protection policy, which read as a second Privacy Policy.
 * - The vendor assessment pack: what an assessor asks for first, added in one click.
 *
 * No document has a page of its own in this version: a public one opens its file or page, one under
 * NDA is added to the request, a planned or unpublished one is asked about, a provider's opens at
 * the provider. A row's address is `#<slug>`. New descriptions say only what the draft's names and
 * the deployment pages say.
 */

export type DocType = 'certificates' | 'evidence' | 'policies' | 'legal' | 'questionnaires';
export type LibraryAccess = 'public' | 'nda' | 'planned' | 'request' | 'external';
export type Deployment = 'cloud' | 'private-cloud' | 'onprem';

export const DOC_TYPES: { id: DocType; label: string; icon: string }[] = [
	{ id: 'certificates', label: 'Certificates', icon: 'tabler:certificate' },
	{ id: 'evidence', label: 'Audit evidence', icon: 'tabler:clipboard-check' },
	{ id: 'policies', label: 'Policies', icon: 'tabler:file-text' },
	{ id: 'legal', label: 'Legal', icon: 'tabler:scale' },
	{ id: 'questionnaires', label: 'Questionnaires', icon: 'tabler:list-check' },
];

export const DEPLOYMENTS: { id: Deployment; label: string; short: string; icon: string }[] = [
	{ id: 'cloud', label: 'Cloud', short: 'Cloud', icon: 'tabler:cloud' },
	{ id: 'private-cloud', label: 'Private Cloud', short: 'Private', icon: 'tabler:cloud-lock' },
	{ id: 'onprem', label: 'On-premises', short: 'On-prem', icon: 'tabler:server' },
];

export const LIBRARY_ACCESS: Record<LibraryAccess, TagLook> = {
	...ACCESS,
	request: { label: 'On request', icon: 'tabler:mail', look: 'dashed', tone: 'neutral' },
	external: { label: 'Third party', icon: 'tabler:building', look: 'outline', tone: 'neutral' },
};

export interface LibraryDoc {
	slug: string;
	name: string;
	description: string;
	/** Shown when it says something: not "—", "current" or "living". */
	version: string;
	access: LibraryAccess;
	type: DocType;
	/** The deployments it concerns; empty: every deployment. */
	appliesTo: Deployment[];
	keywords: string;
	/** What a public document opens: its file or its page. */
	href?: string;
	/** Where a provider's attestation lives, one link per provider. */
	links?: { label: string; href: string }[];
	/** The contact form's subject for asking about it. */
	askSubject?: string;
	/** A third party's document: who publishes it. */
	provider?: string;
}

const TYPE_OF: Record<string, DocType> = {
	'iso-27001-certificate': 'certificates',
	'iso-9001-certificate': 'certificates',
	'statement-of-applicability': 'evidence',
	'risk-assessment-report': 'evidence',
	'pentest-executive-summary': 'evidence',
	'internal-audit-report-2026': 'evidence',
	'information-security-policy': 'policies',
	'secure-development-policy': 'policies',
	'change-management-procedure': 'policies',
	'incident-management-procedure': 'policies',
	'supplier-security-policy': 'policies',
	'ai-services-policy': 'policies',
	'data-protection-policy': 'policies',
	'backup-policy': 'policies',
	'bcp-drp': 'policies',
	'privacy-policy': 'legal',
	'data-processing-addendum': 'legal',
	'sub-processor-list': 'legal',
	'caiq-lite': 'questionnaires',
	'sig-lite': 'questionnaires',
};

/**
 * Where the deployment pages listed a document. Cloud's list is Private Cloud's too ("same set as
 * ThingsBoard Cloud … only the differences are listed"), except where Private Cloud has its own:
 * the privacy terms and the DPA. AWS's attestations are Cloud's, which runs on AWS.
 */
const APPLIES_TO: Record<string, Deployment[]> = {
	'privacy-policy': ['cloud'],
	'data-processing-addendum': ['cloud'],
	'sub-processor-list': ['cloud', 'private-cloud'],
	'bcp-drp': ['cloud', 'private-cloud'],
	'backup-policy': ['cloud', 'private-cloud'],
};

/** What readers search for that the name does not say. */
const KEYWORDS: Record<string, string> = {
	'iso-27001-certificate': 'isms iso27001 27001 cert',
	'iso-9001-certificate': 'qms iso9001 9001 cert quality',
	'statement-of-applicability': 'soa annex a controls iso 27001',
	'risk-assessment-report': 'risk register treatment',
	'pentest-executive-summary': 'pentest pen test penetration security test',
	'internal-audit-report-2026': 'audit nonconformities',
	'information-security-policy': 'isp infosec',
	'secure-development-policy': 'sdlc ssdlc code review',
	'change-management-procedure': 'change control',
	'incident-management-procedure': 'incident response ir breach',
	'supplier-security-policy': 'vendor third party',
	'ai-services-policy': 'ai llm eu ai act',
	'data-protection-policy': 'privacy by design personal data gdpr',
	'backup-policy': 'backups restore retention',
	'bcp-drp': 'bcp drp disaster recovery continuity',
	'privacy-policy': 'privacy gdpr personal data',
	'data-processing-addendum': 'dpa gdpr processor',
	'sub-processor-list': 'subprocessors vendors',
	'caiq-lite': 'csa caiq questionnaire',
	'sig-lite': 'sig shared assessments questionnaire',
};

/** Names that read better in a list of their own type. */
const NAME: Record<string, string> = {
	'data-protection-policy': 'Data Protection Policy',
};

const hidden = new Set(['—', 'current', 'living']);

/** From the draft's library (`DOCS`). */
const FROM_DOCS: LibraryDoc[] = DOCS.map((d) => ({
	slug: d.slug,
	name: NAME[d.slug] ?? d.name,
	description: d.description,
	version: hidden.has(d.version) ? '' : d.version,
	access: d.access,
	type: TYPE_OF[d.slug] ?? 'policies',
	appliesTo: APPLIES_TO[d.slug] ?? [],
	keywords: KEYWORDS[d.slug] ?? '',
	href: d.access === 'public' ? (d.f ?? d.u) : undefined,
	askSubject: d.category === 'Questionnaires' ? 'questionnaire' : 'other',
}));

/** What the deployment pages and the request form listed and the draft's library did not. */
const EXTRA_DOCS: LibraryDoc[] = [
	{
		slug: 'aws-attestations',
		name: 'AWS attestations (SOC 2, ISO 27001)',
		description:
			'The reports AWS publishes for the infrastructure ThingsBoard Cloud runs on, in AWS Artifact. They cover AWS, not ThingsBoard.',
		version: '',
		access: 'external',
		type: 'certificates',
		appliesTo: ['cloud'],
		provider: 'AWS',
		keywords: 'aws soc 2 soc2 iso 27001 artifact hosting infrastructure',
		links: [{ label: 'AWS Artifact', href: 'https://aws.amazon.com/artifact/' }],
	},
	{
		slug: 'data-center-certifications',
		name: 'Data center certifications (ISO 27001, PCI DSS)',
		description:
			"The cloud providers' own certifications for the data centers a Private Cloud runs in. They cover the provider, not ThingsBoard.",
		version: '',
		access: 'external',
		type: 'certificates',
		appliesTo: ['private-cloud'],
		provider: 'AWS, Azure and GCP',
		keywords: 'aws azure gcp data center iso 27001 pci dss soc 2 hosting',
		links: [
			{ label: 'AWS', href: 'https://aws.amazon.com/compliance/programs/' },
			{ label: 'Azure', href: 'https://learn.microsoft.com/en-us/azure/compliance/' },
			{ label: 'GCP', href: 'https://cloud.google.com/security/compliance' },
		],
	},
	{
		slug: 'private-cloud-architecture',
		name: 'Private Cloud cluster architecture',
		description: 'How a Private Cloud cluster is built, with its read-only metrics.',
		version: '',
		access: 'nda',
		type: 'evidence',
		appliesTo: ['private-cloud'],
		keywords: 'architecture diagram metrics private cloud',
	},
	{
		slug: 'release-policy',
		name: 'Release policy',
		description: 'How long each release is supported, and how security fixes reach the releases you run.',
		version: '',
		access: 'public',
		type: 'policies',
		appliesTo: ['onprem'],
		keywords: 'lts support window patch security fixes versions',
		href: '/docs/pe/releases/release-policy/',
	},
	{
		slug: 'support-policy',
		name: 'Support policy',
		description: 'What support comes with each plan, and how to reach it.',
		version: '',
		access: 'request',
		type: 'policies',
		appliesTo: ['onprem'],
		keywords: 'support sla response times plans',
		askSubject: 'other',
	},
	{
		slug: 'terms-of-use',
		name: 'Terms of Use (North America and EU)',
		description: 'The terms for using ThingsBoard Cloud in North America and the EU.',
		version: '',
		access: 'public',
		type: 'legal',
		appliesTo: ['cloud'],
		keywords: 'terms of service tos contract',
		href: '/products/paas/terms-of-use/',
	},
	{
		slug: 'dpa-private-cloud',
		name: 'DPA for Private Cloud',
		description: 'The Data Processing Addendum for Private Cloud customers.',
		version: '',
		access: 'nda',
		type: 'legal',
		appliesTo: ['private-cloud'],
		keywords: 'dpa private cloud processor gdpr',
	},
	{
		slug: 'private-cloud-sla',
		name: 'Private Cloud SLA and service description',
		description: 'The uptime formula, service credits and exclusions for Private Cloud.',
		version: '',
		access: 'request',
		type: 'legal',
		appliesTo: ['private-cloud'],
		keywords: 'sla uptime availability service credits',
		askSubject: 'cloud',
	},
	{
		slug: 'eula',
		name: 'EULA and license terms',
		description: 'The license agreement for running ThingsBoard on your own infrastructure.',
		version: '',
		access: 'public',
		type: 'legal',
		appliesTo: ['onprem'],
		keywords: 'license agreement eula self-hosted',
		href: '/legal/license-agreement/',
	},
];

/** What an assessor asks for first, in one click. */
export const ASSESSMENT_PACK = [
	'information-security-policy',
	'statement-of-applicability',
	'risk-assessment-report',
	'pentest-executive-summary',
	'internal-audit-report-2026',
];

/** The pack in a line, in the words an assessor uses. */
export const ASSESSMENT_PACK_SUMMARY =
	'the Information Security Policy, the Statement of Applicability, the risk assessment, the pentest summary and the internal audit report';

const order = (t: DocType) => DOC_TYPES.findIndex((d) => d.id === t);

/** Every document, in type order, then the draft's order within a type, the additions after. */
export const LIBRARY: LibraryDoc[] = [...FROM_DOCS, ...EXTRA_DOCS]
	.map((d, i) => ({ d, i }))
	.sort((a, b) => order(a.d.type) - order(b.d.type) || a.i - b.i)
	.map(({ d }) => d);

/**
 * The contact form, asking about a document: a planned one by its slug (the form asks when it will
 * be available), an unpublished one by its name (the form asks for it).
 */
export const askAbout = (d: LibraryDoc): string =>
	d.access === 'planned'
		? `${tc('contact')}?subject=${d.askSubject ?? 'other'}&docs=${d.slug}`
		: `${tc('contact')}?subject=${d.askSubject ?? 'other'}&about=${encodeURIComponent(d.name)}`;

/** The documents that concern this deployment alone or with others: not the ones for every deployment. */
export const documentsFor = (deployment: Deployment): LibraryDoc[] =>
	LIBRARY.filter((d) => d.appliesTo.includes(deployment));

/** The proposed library's address, and a document's own address in it. */
export const LIBRARY_PATH = `${tc('documents')}proposed/`;
export const docPath = (slug: string): string => `${LIBRARY_PATH}${slug}/`;

/** The library shown for one deployment. */
export const libraryFor = (deployment: Deployment): string => `${LIBRARY_PATH}?for=${deployment}`;

/** How a reader gets a document, in a few words under its action. */
export const howToGet = (d: LibraryDoc): string =>
	({
		public: 'Public',
		nda: 'Under mutual NDA',
		request: 'Not published yet',
		planned: 'Planned',
		external: d.provider?.includes(',') ? "Each provider's own page" : `${d.provider}'s own report`,
	})[d.access];

/** The same, as a sentence, in a document's details. */
export const howToGetSentence = (d: LibraryDoc): string =>
	({
		public: 'Public: open to everyone.',
		nda: 'Under NDA: we send our mutual NDA first, then the documents within two business days.',
		request: 'Not published on the site yet. Ask us for it.',
		planned: 'Planned: not available yet. Ask us when it will be.',
		external: `Published by ${d.provider}, not by ThingsBoard: it covers the provider's own infrastructure.`,
	})[d.access];

/** The deployments a document applies to, in words. */
export const scopeOf = (
	d: LibraryDoc,
	words: { all: string; suffix: string } = { all: '', suffix: ' only' }
): string => {
	const names = d.appliesTo.map((a) => DEPLOYMENTS.find((x) => x.id === a)!.label);
	return names.length ? `${names.join(' and ')}${words.suffix}` : words.all;
};

/** Where the Trust Center says more about what a document covers. */
const COMPLIANCE = tc('compliance');
const ISO_27001 = { label: 'ISO/IEC 27001 on the Compliance page', href: `${COMPLIANCE}#iso-27001` };
const GDPR = { label: 'GDPR on the Compliance page', href: `${COMPLIANCE}#gdpr` };
const DEV = { label: 'Dev security on the Security page', href: `${tc('security')}#dev` };
const CLOUD = { label: 'Cloud and Private Cloud', href: tc('cloud') };
const ONPREM = { label: 'On-premises', href: tc('onprem') };
export const RELATED: Record<string, { label: string; href: string }> = {
	'iso-27001-certificate': ISO_27001,
	'iso-9001-certificate': { label: 'ISO 9001 on the Compliance page', href: `${COMPLIANCE}#iso-9001` },
	'statement-of-applicability': ISO_27001,
	'risk-assessment-report': ISO_27001,
	'internal-audit-report-2026': ISO_27001,
	'pentest-executive-summary': DEV,
	'secure-development-policy': DEV,
	'change-management-procedure': DEV,
	'privacy-policy': GDPR,
	'data-processing-addendum': GDPR,
	'data-protection-policy': GDPR,
	'aws-attestations': CLOUD,
	'data-center-certifications': CLOUD,
	'private-cloud-architecture': CLOUD,
	'private-cloud-sla': CLOUD,
	'dpa-private-cloud': CLOUD,
	'bcp-drp': CLOUD,
	'backup-policy': CLOUD,
	'release-policy': ONPREM,
	'support-policy': ONPREM,
	eula: ONPREM,
};

/** Product documentation the On-premises page listed with its documents: guides, not library rows. */
export const ONPREM_PRODUCT_DOCS: { name: string; href?: string; askSubject?: string }[] = [
	{ name: 'Installation guides (Docker, Kubernetes, Ubuntu, cloud marketplaces)', href: '/docs/pe/installation/' },
	{ name: 'Release notes', href: '/docs/pe/releases/releases-table/' },
	{ name: 'License server network requirements', askSubject: 'other' },
];
