/**
 * The Trust Center's sections, as agreed in the review: the tree of revision 3, drawn as a section
 * bar under the site's bar (build v3). Five sections, each with a page of its own: Security and
 * Deployment gained hubs in v3 (they were plain labels), so a section's tab always lands on its
 * overview. Contact and Report sit apart as buttons.
 *
 * Short sibling pages are one page now: Compliance holds the two certificates, GDPR and CCPA;
 * Security its four topics; the Deployment hub its commitments and who handles what, each an
 * anchored section listed "On this page" in the hero. What stays a page of its own (Sub-processors,
 * Cloud, On-premises, a document) is a page under its section, with the way back over its h1.
 *
 * Each section has a hue, from the product pages' rotation, which colours its hero, its marks and
 * its accent (buttons, links, the description tags) on every one of its pages, as green does the
 * On-premises page. The document pages (`/documents/<slug>/`) belong to Documents.
 */

export const TC_ROOT = '/trust-center/';

/** A page's URL from its path under the Trust Center (`''` is the overview). */
export const tc = (path = ''): string => (path ? `${TC_ROOT}${path.replace(/^\/|\/$/g, '')}/` : TC_ROOT);

export interface NavPage {
	label: string;
	href: string;
}

export interface Section {
	key: 'overview' | 'compliance' | 'security' | 'deployment' | 'documents' | 'contact';
	label: string;
	/** The section's own page (its hub). */
	href: string;
	/** One line on the overview. */
	summary: string;
	hue: string;
	icon: string;
	/**
	 * What the section holds, as the overview lists it under the section: an anchored part of the
	 * section's page, or a page of its own. A page listed here belongs to the section (`sectionFor`).
	 */
	pages: NavPage[];
	/** Every page under this path belongs to the section too (the document pages). */
	prefix?: string;
}

export const HUES = {
	brand: '#3d50f5',
	violet: '#7c3aed',
	blue: '#006bc7',
	teal: '#007c7b',
	orange: '#c2410c',
};

export const SECTIONS: Section[] = [
	{
		key: 'overview',
		label: 'Overview',
		href: tc(),
		summary: '',
		hue: HUES.brand,
		icon: 'tabler:shield-check',
		pages: [],
	},
	{
		key: 'compliance',
		label: 'Compliance',
		href: tc('compliance'),
		summary: 'Certified to ISO/IEC 27001 and ISO 9001, with GDPR and CCPA self-declared.',
		hue: HUES.violet,
		icon: 'tabler:certificate',
		pages: [
			{ label: 'ISO/IEC 27001:2022', href: `${tc('compliance')}#iso-27001` },
			{ label: 'ISO 9001:2015', href: `${tc('compliance')}#iso-9001` },
			{ label: 'GDPR', href: `${tc('compliance')}#gdpr` },
			{ label: 'CCPA', href: `${tc('compliance')}#ccpa` },
			{ label: 'Sub-processors', href: tc('subprocessors') },
		],
	},
	{
		key: 'security',
		label: 'Security',
		href: tc('security'),
		summary: 'How the platform protects devices, data and users, and how we build and release it.',
		hue: HUES.blue,
		icon: 'tabler:lock',
		pages: [
			{ label: 'Product security', href: `${tc('security')}#product` },
			{ label: 'Data security', href: `${tc('security')}#data` },
			{ label: 'Access control', href: `${tc('security')}#access` },
			{ label: 'Dev security', href: `${tc('security')}#dev` },
		],
	},
	{
		key: 'deployment',
		label: 'Deployment',
		href: tc('deployment'),
		summary: 'What we run and what you run, on ThingsBoard Cloud, Private Cloud and on-premises.',
		hue: HUES.teal,
		icon: 'tabler:cloud',
		pages: [
			{ label: 'Cloud and Private Cloud', href: tc('cloud') },
			{ label: 'On-premises', href: tc('onprem') },
			{ label: 'Commitment and responsibility', href: `${tc('deployment')}#commitments` },
		],
	},
	{
		key: 'documents',
		label: 'Documents',
		href: tc('documents'),
		summary: 'Policies, reports and certificates: open to everyone, or under NDA within two business days.',
		hue: HUES.orange,
		icon: 'tabler:file-text',
		pages: [],
		prefix: tc('documents'),
	},
];

/** Contact and Report: not a section of the bar, but their pages need a hue. */
export const CONTACT_SECTION: Section = {
	key: 'contact',
	label: 'Get in touch',
	href: tc('contact'),
	summary: '',
	hue: HUES.brand,
	icon: 'tabler:message-circle',
	pages: [],
};

export const TC_ACTIONS: NavPage[] = [
	{ label: 'Contact us', href: tc('contact') },
	{ label: 'Report a vulnerability', href: tc('report-vulnerability') },
];

/** The section a path belongs to: its own page, a page it lists (an anchor's page is its own), or under its prefix. */
export function sectionFor(pathname: string): Section {
	const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
	const listed = (s: Section) => s.pages.some((p) => p.href.split('#')[0] === path);
	return (
		SECTIONS.find((s) => s.href === path || listed(s) || (s.prefix && path.startsWith(s.prefix))) ??
		(TC_ACTIONS.some((a) => a.href === path) ? CONTACT_SECTION : SECTIONS[0])
	);
}

/** The address readers write to, named on several pages. */
export const SECURITY_EMAIL = 'security@thingsboard.io';

/** The draft's date, shown at the foot of every page. */
export const LAST_UPDATED = '1 Oct 2026';
