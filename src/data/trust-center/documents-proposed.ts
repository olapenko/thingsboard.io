import { DOCS, type TrustDoc } from '@data/trust-center/documents';

/**
 * PROPOSED: the document library as the review of 2026-10-12 suggests it, beside the current one
 * (`/trust-center/documents/proposed/`). It reads the same `DOCS` and adds only what the proposal
 * needs, so the two libraries cannot drift apart while both exist:
 *
 * - ONE taxonomy, by what a document IS (`DOC_TYPES`), replacing the four groups and the seven
 *   categories, which crossed topic (Security, Governance) with type (Reports, Questionnaires).
 * - Search words a reader actually types (`KEYWORDS`): pentest, BCP, SoA, SOC 2.
 * - The two Private Cloud documents the request form already offers, so the library is the whole
 *   set a reader can request (`EXTRA_DOCS`; their descriptions say only what their names say).
 * - A clearer name for the internal data protection policy, which read as a second Privacy Policy.
 * - The vendor assessment pack: what an assessor asks for first, added in one click.
 *
 * No document has a page of its own in this version: a public one opens its file or page, one under
 * NDA is added to the request, a planned one is asked about. A row's address is `#<slug>`.
 */

export type DocType = 'certificates' | 'evidence' | 'policies' | 'legal' | 'questionnaires';

export const DOC_TYPES: { id: DocType; label: string; icon: string }[] = [
	{ id: 'certificates', label: 'Certificates', icon: 'tabler:certificate' },
	{ id: 'evidence', label: 'Audit evidence', icon: 'tabler:clipboard-check' },
	{ id: 'policies', label: 'Policies', icon: 'tabler:file-text' },
	{ id: 'legal', label: 'Legal', icon: 'tabler:scale' },
	{ id: 'questionnaires', label: 'Questionnaires', icon: 'tabler:list-check' },
];

const TYPE_OF: Record<string, DocType> = {
	'iso-27001-certificate': 'certificates',
	'iso-9001-certificate': 'certificates',
	'statement-of-applicability': 'evidence',
	'risk-assessment-report': 'evidence',
	'pentest-executive-summary': 'evidence',
	'internal-audit-report-2026': 'evidence',
	'private-cloud-architecture': 'evidence',
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
	'dpa-private-cloud': 'legal',
	'sub-processor-list': 'legal',
	'caiq-lite': 'questionnaires',
	'sig-lite': 'questionnaires',
};

/** What readers search for that the name does not say. */
const KEYWORDS: Record<string, string> = {
	'iso-27001-certificate': 'isms iso27001 27001 cert',
	'iso-9001-certificate': 'qms iso9001 9001 cert quality',
	'statement-of-applicability': 'soa annex a controls iso 27001',
	'risk-assessment-report': 'risk register treatment',
	'pentest-executive-summary': 'pentest pen test penetration security test',
	'internal-audit-report-2026': 'audit nonconformities',
	'private-cloud-architecture': 'architecture diagram metrics private cloud',
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
	'dpa-private-cloud': 'dpa private cloud processor',
	'sub-processor-list': 'subprocessors vendors',
	'caiq-lite': 'csa caiq questionnaire',
	'sig-lite': 'sig shared assessments questionnaire',
};

/** Names that read better in a list of their own type. */
const NAME: Record<string, string> = {
	'data-protection-policy': 'Data Protection Policy',
};

/** The request form's two Private Cloud documents, as library rows. */
const EXTRA_DOCS: TrustDoc[] = [
	{
		slug: 'dpa-private-cloud',
		name: 'DPA for Private Cloud',
		category: 'Legal',
		access: 'nda',
		version: '—',
		description: 'The Data Processing Addendum for Private Cloud customers.',
	},
	{
		slug: 'private-cloud-architecture',
		name: 'Private Cloud cluster architecture',
		category: 'Reports',
		access: 'nda',
		version: '—',
		description: 'How a Private Cloud cluster is built, with its read-only metrics.',
	},
];

/** For Private Cloud customers only: said on the row. */
const PRIVATE_CLOUD = new Set(['dpa-private-cloud', 'private-cloud-architecture']);

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

export interface LibraryDoc extends TrustDoc {
	type: DocType;
	keywords: string;
	privateCloud: boolean;
}

const order = (t: DocType) => DOC_TYPES.findIndex((d) => d.id === t);

/** Every document, in type order, then the draft's order within a type. */
export const LIBRARY: LibraryDoc[] = [...DOCS, ...EXTRA_DOCS]
	.map((d) => ({
		...d,
		name: NAME[d.slug] ?? d.name,
		type: TYPE_OF[d.slug] ?? 'policies',
		keywords: KEYWORDS[d.slug] ?? '',
		privateCloud: PRIVATE_CLOUD.has(d.slug),
	}))
	.map((d, i) => ({ d, i }))
	.sort((a, b) => order(a.d.type) - order(b.d.type) || a.i - b.i)
	.map(({ d }) => d);
