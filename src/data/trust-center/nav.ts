/**
 * The Trust Center's sections, drawn as a section bar under the site's bar (build v3), with
 * Contact and Report apart as buttons. Five sections, each one page:
 *
 * - Compliance and Security: each a page of anchored parts, listed as tiles across the hero's foot
 *   (the overview's pattern), so a reader sees what is on the page and jumps to the part.
 * - Cloud and On-premises: the deployments, each a section of its own (review of 2026-10-12). The
 *   Deployment hub between them only repeated their summaries; what it held is on the two pages
 *   (who handles what, support) and under Security (what you configure).
 * - Documents: the library, and each requested document's address (`/documents/<slug>/`).
 *
 * What stays a page under a section (Sub-processors, under Compliance) is listed in its `pages`
 * and has the way back over its h1.
 *
 * Each section has a hue, from the product pages' rotation, which colours its hero, its marks and
 * its accent (buttons, links, the description tags) on every one of its pages: On-premises takes the
 * product's own green.
 */

export const TC_ROOT = '/trust-center/';

/** A page's URL from its path under the Trust Center (`''` is the overview). */
export const tc = (path = ''): string => (path ? `${TC_ROOT}${path.replace(/^\/|\/$/g, '')}/` : TC_ROOT);

export interface NavPage {
	label: string;
	href: string;
}

export interface Section {
	key: 'overview' | 'compliance' | 'security' | 'cloud' | 'onprem' | 'documents' | 'contact' | 'report';
	label: string;
	/** The section's own page (its hub). */
	href: string;
	/** One line on the overview. */
	summary: string;
	hue: string;
	icon: string;
	/** The pages under the section's own: each belongs to the section (`sectionFor`). */
	pages: NavPage[];
	/** Every page under this path belongs to the section too (the document pages). */
	prefix?: string;
}

export const HUES = {
	brand: '#3d50f5',
	violet: '#7c3aed',
	blue: '#006bc7',
	teal: '#007c7b',
	/** The on-premises product's green (`[data-accent='onprem']`). */
	green: '#178649',
	/** The alert hue: Report a vulnerability, wherever the way to report appears. */
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
		pages: [{ label: 'Sub-processors', href: tc('subprocessors') }],
	},
	{
		key: 'security',
		label: 'Security',
		href: tc('security'),
		summary: 'How the platform protects devices, data and users, and how we build and release it.',
		hue: HUES.blue,
		icon: 'tabler:lock',
		pages: [],
	},
	{
		key: 'cloud',
		label: 'Cloud',
		href: tc('cloud'),
		summary: 'ThingsBoard Cloud and Private Cloud: we run the platform and the infrastructure under it.',
		hue: HUES.teal,
		icon: 'tabler:cloud',
		pages: [],
	},
	{
		key: 'onprem',
		label: 'On-premises',
		href: tc('onprem'),
		summary: 'You run the platform; we provide the product code, security fixes and guides.',
		hue: HUES.green,
		icon: 'tabler:server',
		pages: [],
	},
	{
		key: 'documents',
		label: 'Documents',
		href: tc('documents'),
		summary: 'Policies, reports and certificates: open to everyone, or under NDA within two business days.',
		hue: HUES.brand,
		icon: 'tabler:file-text',
		pages: [],
		prefix: tc('documents'),
	},
];

/** Contact: not a section of the bar, but its page needs a hue. */
export const CONTACT_SECTION: Section = {
	key: 'contact',
	label: 'Get in touch',
	href: tc('contact'),
	summary: '',
	hue: HUES.brand,
	icon: 'tabler:message-circle',
	pages: [],
};

/**
 * Report a vulnerability: not a section either, and apart from Contact, so the way to report reads
 * as an alert in the alert hue on its page, in the section bar and in the overview's hero.
 */
export const REPORT_SECTION: Section = {
	key: 'report',
	label: 'Report a vulnerability',
	href: tc('report-vulnerability'),
	summary: '',
	hue: HUES.orange,
	icon: 'tabler:bug',
	pages: [],
};

export const TC_ACTIONS: NavPage[] = [
	{ label: 'Contact us', href: tc('contact') },
	{ label: 'Report a vulnerability', href: tc('report-vulnerability') },
];

/** The section a path belongs to: its own page, a page it lists, or under its prefix. */
export function sectionFor(pathname: string): Section {
	const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
	const listed = (s: Section) => s.pages.some((p) => p.href === path);
	return (
		SECTIONS.find((s) => s.href === path || listed(s) || (s.prefix && path.startsWith(s.prefix))) ??
		(path === REPORT_SECTION.href
			? REPORT_SECTION
			: TC_ACTIONS.some((a) => a.href === path)
				? CONTACT_SECTION
				: SECTIONS[0])
	);
}

/** The address readers write to, named on several pages. */
export const SECURITY_EMAIL = 'security@thingsboard.io';

/** The draft's date, shown at the foot of every page. */
export const LAST_UPDATED = '1 Oct 2026';
