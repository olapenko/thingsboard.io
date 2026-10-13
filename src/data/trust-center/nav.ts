/**
 * The Trust Center's addresses and shared lines.
 *
 * The pages, their order and every word on them follow the shared Trust Center draft (1 Oct 2026)
 * letter for letter; `research/trust-center/` on `feat/trust-center` holds the draft's words as
 * captured. The draft was one page of hash views (`#/compliance`); here each view is a page under
 * `/trust-center/` with the draft's slug.
 */

export const TC_ROOT = '/trust-center/';

/** `tc('compliance/gdpr')` → `/trust-center/compliance/gdpr/`; `tc()` is the hub. */
export const tc = (path = ''): string => (path ? `${TC_ROOT}${path.replace(/^\/|\/$/g, '')}/` : TC_ROOT);

/** The draft's `#/contact/<subject>/<doc>` prefill, as a query on the contact page. */
export const contactHref = (subject?: string, doc?: string): string => {
	const params = new URLSearchParams();
	if (subject) params.set('subject', subject);
	if (doc) params.set('doc', doc);
	const query = params.toString();
	return `${tc('contact')}${query ? `?${query}` : ''}`;
};

/** The breadcrumb's names, as the draft's `CRUMB` table has them. */
export const CRUMB = {
	compliance: 'Compliance',
	documents: 'Documents',
	product: 'Product security',
	data: 'Data security',
	access: 'Access control',
	appsec: 'Dev security',
	cloud: 'Cloud and Private Cloud',
	onprem: 'On-premises',
	subprocessors: 'Sub-processors',
	commitments: 'Commitment and responsibility',
	contact: 'Contact',
	'report-vulnerability': 'Report a vulnerability',
} as const;

export interface Crumb {
	label: string;
	href?: string;
}

/** `crumbs('compliance', 'ISO 27001')`: Trust Center › Compliance › ISO 27001. */
export const crumbs = (section?: keyof typeof CRUMB, leaf?: string): Crumb[] => {
	const trail: Crumb[] = [{ label: 'Trust Center', href: tc() }];
	if (section) trail.push({ label: CRUMB[section], href: leaf ? tc(section) : undefined });
	if (leaf) trail.push({ label: leaf });
	return trail;
};

export const SECURITY_EMAIL = 'security@thingsboard.io';
