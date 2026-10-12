import { DOCS } from '@data/trust-center/documents';
import { tc } from '@data/trust-center/nav';
import type { TagLook } from '@data/trust-center/status';

/**
 * The Trust Center's document library (`/trust-center/documents/`), from the review of 2026-10-12.
 * It reads the draft's `DOCS` and adds what the library needs:
 *
 * - ONE taxonomy, by what a document IS (`DOC_TYPES`), replacing the draft's four groups and seven
 *   categories, which crossed topic (Security, Governance) with type (Reports, Questionnaires).
 * - PRODUCT-WIDE: every document a security reviewer, auditor or lawyer would cite, whichever
 *   deployment it concerns, including the ones the Cloud and On-premises pages listed on their own
 *   (`EXTRA_DOCS`). Product documentation stays on the deployment pages as guides.
 * - APPLIES TO: the deployments a document concerns (`APPLIES_TO`); none means every deployment.
 *   Taken from where the deployment pages listed it; the owner to confirm.
 * - TIERS, not access states: a document opens (`open`: ours or a provider's page or file), or is
 *   requested, either under a mutual NDA (`nda`) or simply on request (`request`, which a planned
 *   document joins). Both are a lock after the name, red for the NDA; the request form says what
 *   the NDA involves, once.
 * - No versions: they are the owner's bookkeeping, not the reader's. A certificate shows when it
 *   was issued, the one date a reader acts on.
 * - Search words readers type (`KEYWORDS`), a clearer name for the internal data protection policy,
 *   and the vendor assessment pack.
 *
 * New descriptions say only what the draft's names and the deployment pages say.
 */

export type DocType = 'certificates' | 'evidence' | 'policies' | 'legal' | 'questionnaires';
export type Deployment = 'cloud' | 'private-cloud' | 'onprem';
export type Tier = 'open' | 'request' | 'nda';

export const DOC_TYPES: { id: DocType; label: string; one: string }[] = [
	{ id: 'certificates', label: 'Certificates', one: 'Certificate' },
	{ id: 'evidence', label: 'Audit', one: 'Audit' },
	{ id: 'policies', label: 'Policies', one: 'Policy' },
	{ id: 'legal', label: 'Legal', one: 'Legal' },
	{ id: 'questionnaires', label: 'Questionnaires', one: 'Questionnaire' },
];

export const DEPLOYMENTS: { id: Deployment; label: string; short: string; icon: string }[] = [
	{ id: 'cloud', label: 'Cloud', short: 'Cloud', icon: 'tabler:cloud' },
	{ id: 'private-cloud', label: 'Private Cloud', short: 'Private', icon: 'tabler:cloud-lock' },
	{ id: 'onprem', label: 'On-premises', short: 'On-prem', icon: 'tabler:server' },
];

/** The NDA's red: the one colour in the list, on the lock of a document that needs one (5.9:1 on white). */
export const NDA_RED = '#b42318';

/**
 * The two requested tiers share one mark, a lock after the name; a document that needs a mutual NDA
 * has it in red. Its label shows on hover and is read out. The request form says what the NDA
 * involves, once, when the request holds a document that needs one (`NDA_NOTE`).
 */
export const TIERS: Record<Exclude<Tier, 'open'>, { label: string; icon: string; color?: string }> = {
	nda: { label: 'Requires a mutual NDA', icon: 'tabler:lock', color: NDA_RED },
	request: { label: 'On request', icon: 'tabler:lock' },
};

/** What the request form says, after how many need one, when the request holds documents that need an NDA. */
export const NDA_NOTE = "We send you our mutual NDA first; once it's signed, you get them within two business days.";

/** A requested tier as a tag, where a list shows tags rather than marks (the deployment pages). */
export const TIER_TAG: Record<Exclude<Tier, 'open'>, TagLook> = {
	nda: { label: 'NDA', icon: TIERS.nda.icon, look: 'outline', accent: NDA_RED },
	request: { label: 'On request', icon: TIERS.request.icon, look: 'outline', tone: 'neutral' },
};

export interface LibraryDoc {
	slug: string;
	name: string;
	description: string;
	tier: Tier;
	type: DocType;
	/** The deployments it concerns; empty: every deployment. */
	appliesTo: Deployment[];
	keywords: string;
	/** What an open document opens: its file or its page. */
	href?: string;
	/** A provider's document, not ours: who publishes it. */
	provider?: string;
	/** A certificate's issue date, as a reader reads it ("September 2026"): the end of its description. */
	issued?: string;
	/** Not written yet: sent on request once it is. */
	planned?: boolean;
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
	'aws-attestations': 'aws soc 2 soc2 iso 27001 artifact hosting infrastructure',
	'data-centers-aws': 'aws data center iso 27001 pci dss soc 2 hosting',
	'data-centers-azure': 'azure microsoft data center iso 27001 pci dss soc 2 hosting',
	'data-centers-gcp': 'gcp google cloud data center iso 27001 pci dss soc 2 hosting',
	'private-cloud-architecture': 'architecture diagram metrics private cloud',
	'release-policy': 'lts support window patch security fixes versions',
	'support-policy': 'support sla response times plans',
	'terms-of-use': 'terms of service tos contract',
	'dpa-private-cloud': 'dpa private cloud processor gdpr',
	'private-cloud-sla': 'sla uptime availability service credits',
	eula: 'license agreement eula self-hosted',
};

/** Names that read better in a list of their own type. */
const NAME: Record<string, string> = {
	'data-protection-policy': 'Data Protection Policy',
};

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
/** The draft keeps a certificate's issue date as its version, "09.09.2026". */
const issuedOf = (version: string) => {
	const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(version);
	return m ? `${MONTHS[Number(m[2]) - 1]} ${m[3]}` : undefined;
};

/** From the draft's library (`DOCS`). */
const FROM_DOCS: LibraryDoc[] = DOCS.map((d) => ({
	slug: d.slug,
	name: NAME[d.slug] ?? d.name,
	description: d.description,
	tier: d.access === 'public' ? 'open' : d.access === 'nda' ? 'nda' : 'request',
	type: TYPE_OF[d.slug] ?? 'policies',
	appliesTo: APPLIES_TO[d.slug] ?? [],
	keywords: KEYWORDS[d.slug] ?? '',
	href: d.access === 'public' ? (d.f ?? d.u) : undefined,
	issued: TYPE_OF[d.slug] === 'certificates' ? issuedOf(d.version) : undefined,
	planned: d.access === 'planned' || undefined,
}));

const dataCenters = (slug: string, provider: string, name: string, href: string): LibraryDoc => ({
	slug,
	name: `${name} data center certifications`,
	description: `${provider}'s own certifications (ISO 27001, PCI DSS and others) for its data centers, where a Private Cloud on ${name} runs.`,
	tier: 'open',
	type: 'certificates',
	appliesTo: ['private-cloud'],
	keywords: KEYWORDS[slug] ?? '',
	href,
	provider,
});

/** What the deployment pages and the request form listed and the draft's library did not. */
const EXTRA_DOCS: LibraryDoc[] = [
	{
		slug: 'aws-attestations',
		name: 'AWS attestations (SOC 2, ISO 27001)',
		description: "AWS's own reports on the infrastructure ThingsBoard Cloud runs on, in AWS Artifact.",
		tier: 'open',
		type: 'certificates',
		appliesTo: ['cloud'],
		keywords: KEYWORDS['aws-attestations'],
		href: 'https://aws.amazon.com/artifact/',
		provider: 'AWS',
	},
	dataCenters('data-centers-aws', 'AWS', 'AWS', 'https://aws.amazon.com/compliance/programs/'),
	dataCenters('data-centers-azure', 'Microsoft', 'Azure', 'https://learn.microsoft.com/en-us/azure/compliance/'),
	dataCenters('data-centers-gcp', 'Google', 'Google Cloud', 'https://cloud.google.com/security/compliance'),
	{
		slug: 'private-cloud-architecture',
		name: 'Private Cloud cluster architecture',
		description: 'How a Private Cloud cluster is built, with its read-only metrics.',
		tier: 'nda',
		type: 'evidence',
		appliesTo: ['private-cloud'],
		keywords: KEYWORDS['private-cloud-architecture'],
	},
	{
		slug: 'release-policy',
		name: 'Release policy',
		description: 'How long each release is supported, and how security fixes reach the releases you run.',
		tier: 'open',
		type: 'policies',
		appliesTo: ['onprem'],
		keywords: KEYWORDS['release-policy'],
		href: '/docs/pe/releases/release-policy/',
	},
	{
		slug: 'support-policy',
		name: 'Support policy',
		description: 'What support comes with each plan, and how to reach it.',
		tier: 'request',
		type: 'policies',
		appliesTo: ['onprem'],
		keywords: KEYWORDS['support-policy'],
	},
	{
		slug: 'terms-of-use',
		name: 'Terms of Use (North America and EU)',
		description: 'The terms for using ThingsBoard Cloud in North America and the EU.',
		tier: 'open',
		type: 'legal',
		appliesTo: ['cloud'],
		keywords: KEYWORDS['terms-of-use'],
		href: '/products/paas/terms-of-use/',
	},
	{
		slug: 'dpa-private-cloud',
		name: 'DPA for Private Cloud',
		description: 'The Data Processing Addendum for Private Cloud customers.',
		tier: 'nda',
		type: 'legal',
		appliesTo: ['private-cloud'],
		keywords: KEYWORDS['dpa-private-cloud'],
	},
	{
		slug: 'private-cloud-sla',
		name: 'Private Cloud SLA and service description',
		description: 'The uptime formula, service credits and exclusions for Private Cloud.',
		tier: 'request',
		type: 'legal',
		appliesTo: ['private-cloud'],
		keywords: KEYWORDS['private-cloud-sla'],
	},
	{
		slug: 'eula',
		name: 'EULA and license terms',
		description: 'The license agreement for running ThingsBoard on your own infrastructure.',
		tier: 'open',
		type: 'legal',
		appliesTo: ['onprem'],
		keywords: KEYWORDS.eula,
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

/** The documents that concern this deployment alone or with others: not the ones for every deployment. */
export const documentsFor = (deployment: Deployment): LibraryDoc[] =>
	LIBRARY.filter((d) => d.appliesTo.includes(deployment));

/** The library, and a requested document's own address: the library with it in the request. */
export const LIBRARY_PATH = tc('documents');
export const docPath = (slug: string): string => `${LIBRARY_PATH}${slug}/`;

/** The library shown for one deployment. */
export const libraryFor = (deployment: Deployment): string => `${LIBRARY_PATH}?for=${deployment}`;

/** The library with these documents in the request: how every other page asks for documents. */
export const requestIn = (slugs: string[], deployment?: Deployment): string =>
	`${LIBRARY_PATH}?${deployment ? `for=${deployment}&` : ''}request=${slugs.join(',')}${slugs.length === 1 ? `#${slugs[0]}` : ''}`;

/** Product documentation the On-premises page listed with its documents: guides, not library rows. */
export const ONPREM_PRODUCT_DOCS: { name: string; href?: string; askSubject?: string }[] = [
	{ name: 'Installation guides (Docker, Kubernetes, Ubuntu, cloud marketplaces)', href: '/docs/pe/installation/' },
	{ name: 'Release notes', href: '/docs/pe/releases/releases-table/' },
	{ name: 'License server network requirements', askSubject: 'other' },
];
