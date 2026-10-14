import { DOCS_WITH_PAGE, type TcDoc } from '@data/trust-center/documents';
import { tc } from '@data/trust-center/nav';

/**
 * The Trust Center's pages, in one list: what the layout needs to place a page among the others.
 * - "Read next" at a page's foot: the next page in its section ("Next in Security"), then a page
 *   picked for it (`related`: the draft's own "Related:" links first, then ours), three in all. It is
 *   the one way on from a page; the breadcrumb is the way back up. It never offers what the bookend
 *   under it does (the documents, the contact form, the vulnerability report).
 * - A page's own date (`updated`), where one is shown: the Sub-processors list. The hub states the
 *   Trust Center's review once (`TC_UPDATED`); the other pages show no date.
 *
 * Words: a page's `title` is its h1 (or the short name its crumb uses), its `line` the hub tile's
 * subtitle where it has one, so a card says what the tile says.
 */

/** When the Trust Center as a whole was last updated: the draft's "Last updated 1 Oct 2026". */
export const TC_UPDATED = '2026-10-01';

/** Who owns the Trust Center: the IMS Manager, by name and title, the name linked to their profile. */
export const TC_OWNER = {
	name: 'Oleg Reutskyi',
	role: 'IMS Manager',
	href: 'https://www.linkedin.com/in/oleg-reutskyi-67a39a1b3/',
};

export type TcSection = 'compliance' | 'security' | 'deployments';

export const SECTION_LABEL: Record<TcSection, string> = {
	compliance: 'Compliance',
	security: 'Security',
	deployments: 'Deployments',
};

export interface TcPage {
	href: string;
	title: string;
	/** One line for a "Read next" card. */
	line: string;
	icon: string;
	section?: TcSection;
	/** Pages from elsewhere worth reading next, in order. */
	related?: string[];
	/** A `data-accent` for its card: `alert` (the Trust Center's red) on the vulnerability report. */
	accent?: string;
	/** When the page last changed (ISO date), where the page shows it; `TC_UPDATED` by default. */
	updated?: string;
}

const DPA = '/products/paas/dpa/';
const PRIVACY_POLICY = '/products/paas/privacy-policy/';

export const TC_PAGES: TcPage[] = [
	// Compliance: the overview, then its four pages.
	{
		href: tc('compliance'),
		title: 'Compliance',
		line: 'Independently verified security.',
		icon: 'tabler:rosette-discount-check',
		section: 'compliance',
		related: [tc('appsec'), tc('product'), tc('onprem')],
	},
	{
		href: tc('compliance/iso-27001'),
		title: 'ISO/IEC 27001:2022',
		line: 'Our certified information security management system.',
		icon: 'tabler:certificate',
		section: 'compliance',
		// The draft's "Related:" line, then ours.
		related: [tc('documents/statement-of-applicability'), tc('documents/internal-audit-report-2026')],
	},
	{
		href: tc('compliance/iso-9001'),
		title: 'ISO 9001:2015',
		line: 'Quality management, run as one system with information security.',
		icon: 'tabler:certificate',
		section: 'compliance',
		related: [tc('compliance/iso-27001'), tc('documents/change-management-procedure')],
	},
	{
		href: tc('compliance/gdpr'),
		title: 'GDPR',
		line: 'How our privacy program meets the GDPR.',
		icon: 'tabler:scale',
		section: 'compliance',
		// The draft's "Related:" line, then ours.
		related: [DPA, PRIVACY_POLICY, tc('documents/data-protection-policy')],
	},
	{
		href: tc('compliance/ccpa'),
		title: 'CCPA',
		line: 'The same privacy program, under the CCPA.',
		icon: 'tabler:scale',
		section: 'compliance',
		related: [tc('subprocessors'), PRIVACY_POLICY],
	},

	// Security: the hub's four security tiles, in their order.
	{
		href: tc('data'),
		title: 'Data security',
		line: 'Your data stays protected.',
		icon: 'tabler:database',
		section: 'security',
		// The draft's "Related:" line, then ours.
		related: [tc('subprocessors'), tc('cloud')],
	},
	{
		href: tc('product'),
		title: 'Product security',
		line: 'Security built into the product.',
		icon: 'tabler:cpu',
		section: 'security',
		related: [tc('onprem'), tc('cloud')],
	},
	{
		href: tc('access'),
		title: 'Access control',
		line: 'You decide who sees what.',
		icon: 'tabler:lock',
		section: 'security',
		related: [tc('data'), tc('product')],
	},
	{
		href: tc('appsec'),
		title: 'Dev security',
		line: 'Built through a secure process.',
		icon: 'tabler:code',
		section: 'security',
		related: [tc('report-vulnerability'), tc('compliance/iso-27001'), tc('documents/pentest-executive-summary')],
	},

	// Deployments: the hub's two cards, then who handles what.
	{
		href: tc('cloud'),
		title: 'ThingsBoard Cloud and Private Cloud',
		line: 'We host and run the platform, so you can focus on your solution.',
		icon: 'tabler:cloud',
		section: 'deployments',
		related: [tc('compliance/iso-27001'), tc('access')],
	},
	{
		href: tc('onprem'),
		title: 'On-premises',
		line: 'You run the platform; we provide the product code, security fixes and guides.',
		icon: 'tabler:server',
		section: 'deployments',
		related: [tc('appsec'), tc('access')],
	},
	{
		href: tc('commitments'),
		title: 'Commitment and responsibility',
		line: 'What we promise and what we handle.',
		icon: 'tabler:clipboard-check',
		section: 'deployments',
		related: [tc('compliance'), tc('compliance/iso-9001')],
	},

	// On their own: no section, no sibling links.
	{
		href: tc('documents'),
		title: 'Documents',
		line: 'Certificates, policies and reports, public or under NDA.',
		icon: 'tabler:file-text',
		related: [tc('compliance'), tc('data'), tc('commitments')],
	},
	{
		href: tc('subprocessors'),
		title: 'Sub-processors',
		line: 'The vendors that may access customer or personal data.',
		icon: 'tabler:building',
		related: [tc('compliance/gdpr'), tc('compliance/ccpa'), PRIVACY_POLICY],
		// Shown with the list: when it last changed is what a reader waiting on a notice of changes checks.
		updated: '2026-10-01',
	},
	{
		href: tc('report-vulnerability'),
		title: 'Report a vulnerability',
		line: 'Tell us privately. We reply within three business days.',
		icon: 'tabler:shield-exclamation',
		accent: 'alert',
	},

	// Off the Trust Center, but its pages point to them: the Cloud's legal pages.
	{
		href: DPA,
		title: 'Data Processing Agreement (DPA)',
		line: 'Our contractual data protection terms.',
		icon: 'tabler:file-certificate',
	},
	{
		href: PRIVACY_POLICY,
		title: 'Privacy Policy',
		line: 'What personal data ThingsBoard Cloud processes, and your rights.',
		icon: 'tabler:shield-lock',
	},
];

/** A document page as a card: its name, its category and how it is shared. */
const docPage = (d: TcDoc): TcPage => ({
	href: tc(`documents/${d.slug}`),
	title: d.name,
	line: `${d.category} · ${d.access === 'nda' ? 'Under NDA' : d.access === 'pending' ? 'Planned' : 'Public'}`,
	icon: d.access === 'public' ? 'tabler:file-text' : 'tabler:lock',
});

const byHref = new Map(TC_PAGES.map((p) => [p.href, p]));
const docByHref = new Map(DOCS_WITH_PAGE.map((d) => [tc(`documents/${d.slug}`), docPage(d)]));

/** The page at an address, from the list or a document's own page. */
export const pageAt = (href: string): TcPage | undefined => byHref.get(href) ?? docByHref.get(href);

/** A page's section, in order. */
export const siblingsOf = (page: TcPage | undefined): TcPage[] =>
	page?.section ? TC_PAGES.filter((p) => p.section === page.section) : [];

/** What the bookend under every page offers, so "Read next" never repeats it. */
const IN_BOOKEND = [tc('documents'), tc('contact'), tc('report-vulnerability')];

/**
 * "Read next": the next page in the section, its line saying so ("Next in Security"; round to the
 * section's first after its last), then the pages picked for it, then Compliance as a last resort;
 * three in all (picked so that no page is offered more than three times across the Trust Center), never the page itself, never a page the content already links to (`linked`), so the
 * foot doesn't repeat what the page just said, and never one the bookend offers (`IN_BOOKEND`).
 */
export const keepReading = (page: TcPage | undefined, linked: Set<string> = new Set(), count = 3): TcPage[] => {
	if (!page) return [];
	const siblings = siblingsOf(page);
	const at = siblings.findIndex((p) => p.href === page.href);
	const following = at < 0 ? undefined : siblings[(at + 1) % siblings.length];
	const next =
		following && following.href !== page.href && page.section
			? { ...following, line: `Next in ${SECTION_LABEL[page.section]}` }
			: undefined;
	const picks = [next, ...(page.related ?? []).map(pageAt), byHref.get(tc('compliance'))];
	const seen = new Set([page.href, ...linked, ...IN_BOOKEND]);
	return picks.filter((p): p is TcPage => !!p && !seen.has(p.href) && !!seen.add(p.href)).slice(0, count);
};

/** "1 Oct 2026", for a page's ISO date. */
export const formatDate = (iso: string): string =>
	new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	});

// Every related page must be one this list or the documents know, or a card would vanish quietly.
for (const p of TC_PAGES) {
	for (const r of p.related ?? []) {
		if (!pageAt(r)) throw new Error(`[trust-center] "${p.title}" picks an unknown page: ${r}`);
	}
}
