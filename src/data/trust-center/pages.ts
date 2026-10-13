import { DOCS_WITH_PAGE, type TcDoc } from '@data/trust-center/documents';
import { tc } from '@data/trust-center/nav';

/**
 * The Trust Center's pages, in one list: what the layout needs to place a page among the others.
 * - "Read next" at a page's foot: the next page in its section ("Next in Security"), then a page
 *   picked for it (`related`: the draft's own "Related:" links first, then ours), two in all. It is
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
		related: [tc('appsec'), tc('product')],
	},
	{
		href: tc('compliance/iso-27001'),
		title: 'ISO/IEC 27001:2022',
		line: 'Our certified information security management system.',
		icon: 'tabler:certificate',
		section: 'compliance',
		// The draft's "Related:" line, then ours.
		related: [
			tc('documents/statement-of-applicability'),
			tc('documents/internal-audit-report-2026'),
			tc('appsec'),
			tc('commitments'),
		],
	},
	{
		href: tc('compliance/iso-9001'),
		title: 'ISO 9001:2015',
		line: 'Quality management, run as one system with information security.',
		icon: 'tabler:certificate',
		section: 'compliance',
		related: [tc('commitments')],
	},
	{
		href: tc('compliance/gdpr'),
		title: 'GDPR',
		line: 'How our privacy program meets the GDPR.',
		icon: 'tabler:scale',
		section: 'compliance',
		// The draft's "Related:" line, then ours.
		related: [DPA, PRIVACY_POLICY, tc('subprocessors'), tc('data')],
	},
	{
		href: tc('compliance/ccpa'),
		title: 'CCPA',
		line: 'The same privacy program, under the CCPA.',
		icon: 'tabler:scale',
		section: 'compliance',
		related: [tc('subprocessors'), tc('data')],
	},

	// Security: the hub's four security tiles, in their order.
	{
		href: tc('data'),
		title: 'Data security',
		line: 'Your data stays protected.',
		icon: 'tabler:database',
		section: 'security',
		// The draft's "Related:" line, then ours.
		related: [tc('subprocessors'), tc('cloud'), tc('compliance/gdpr'), tc('commitments')],
	},
	{
		href: tc('product'),
		title: 'Product security',
		line: 'Security built into the product.',
		icon: 'tabler:cpu',
		section: 'security',
		related: [tc('onprem')],
	},
	{
		href: tc('access'),
		title: 'Access control',
		line: 'You decide who sees what.',
		icon: 'tabler:lock',
		section: 'security',
		related: [tc('data')],
	},
	{
		href: tc('appsec'),
		title: 'Dev security',
		line: 'Built through a secure process.',
		icon: 'tabler:code',
		section: 'security',
		related: [tc('report-vulnerability'), tc('compliance/iso-27001')],
	},

	// Deployments: the hub's two cards, then who handles what.
	{
		href: tc('cloud'),
		title: 'ThingsBoard Cloud and Private Cloud',
		line: 'We host and run the platform, so you can focus on your solution.',
		icon: 'tabler:cloud',
		section: 'deployments',
		related: [tc('commitments')],
	},
	{
		href: tc('onprem'),
		title: 'On-premises',
		line: 'You run the platform; we provide the product code, security fixes and guides.',
		icon: 'tabler:server',
		section: 'deployments',
		related: [tc('appsec'), tc('product')],
	},
	{
		href: tc('commitments'),
		title: 'Commitment and responsibility',
		line: 'What we promise and what we handle.',
		icon: 'tabler:clipboard-check',
		section: 'deployments',
		related: [tc('access'), tc('documents')],
	},

	// On their own: no section, no sibling links.
	{
		href: tc('documents'),
		title: 'Documents',
		line: 'Certificates, policies and reports, public or under NDA.',
		icon: 'tabler:file-text',
		related: [tc('compliance'), tc('subprocessors'), tc('data'), tc('cloud')],
	},
	{
		href: tc('subprocessors'),
		title: 'Sub-processors',
		line: 'The vendors that may access customer or personal data.',
		icon: 'tabler:building',
		related: [tc('compliance/gdpr'), tc('compliance/ccpa')],
		// Shown with the list: when it last changed is what a reader of the DPA's notice clause checks.
		updated: '2026-10-01',
	},
	{
		href: tc('report-vulnerability'),
		title: 'Report a vulnerability',
		line: 'Tell us privately. We reply within three business days.',
		icon: 'tabler:bug',
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
 * two in all, never the page itself, never a page the content already links to (`linked`), so the
 * foot doesn't repeat what the page just said, and never one the bookend offers (`IN_BOOKEND`).
 */
export const keepReading = (page: TcPage | undefined, linked: Set<string> = new Set(), count = 2): TcPage[] => {
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

/**
 * A document page's "Read next": the next two documents in its category, round to the category's
 * first after its last, NDA or public alike; a category with fewer than two others fills from the
 * documents after it in the library. So every document is suggested about as often as any other,
 * rather than the first of each category every time. The library itself is the breadcrumb's and the
 * bookend's.
 */
export const keepReadingForDoc = (d: TcDoc): TcPage[] => {
	const at = DOCS_WITH_PAGE.findIndex((o) => o.slug === d.slug);
	// The whole library from the document onwards, wrapping round, the document itself left out.
	const after = [...DOCS_WITH_PAGE.slice(at + 1), ...DOCS_WITH_PAGE.slice(0, at)];
	const sameCategory = after.filter((o) => o.category === d.category);
	const picks = [...sameCategory, ...after.filter((o) => o.category !== d.category)];
	return picks.slice(0, 2).map(docPage);
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
