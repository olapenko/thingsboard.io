import { CHROME, chromeHref } from '@root/pages/internal/_chrome';
import { HOME_COMPOSITIONS, compositionHref } from '@data/home-compositions';

/**
 * The internal pages' structure, in one place: the areas the floating island links to, and the
 * pages each area's top bar shows as tabs.
 *
 * - HOMEPAGES: the homepage's running orders, each the real page with a different order between
 *   its hero and its bookend (`data/home-compositions.ts`). The shipping one is `/` itself.
 * - CHROME: the frame every page shares — header, footer, cookie notice, chat — one workbench page
 *   per part (`_chrome.ts`).
 * - DESIGN SYSTEM: what every page is built from. The kit today; Type and the UI inventory return
 *   with the pages that carry them.
 *
 * The other areas the FE-handoff sandbox had for the homepage — Components (its sections) and Flows
 * (sign-up, sign-in) — are still to be rebuilt on `_Workbench`; this file is where they are added,
 * and `_AreaBar` and `_InternalNav` need no edit for it.
 *
 * Every area has the same shape: an overview of tiles, then its pages. The island opens an area on
 * its overview; the top bar then switches between the pages, as tabs while there are few and as a
 * grouped picker once there are more than `TABS_UP_TO` (see `_AreaBar`).
 */
export interface AreaPage {
	href: string;
	label: string;
	/**
	 * The path prefix that counts as this page, when it has pages under it. Defaults to the page's
	 * own path, matched exactly.
	 */
	match?: string;
	/** Drawn as this icon rather than its label, which becomes the accessible name: the overviews. */
	icon?: string;
	/** The heading it sits under in the picker, when the area has enough pages for one. */
	group?: string;
}

/** An area shows its pages as tabs up to this many; past it, as a grouped picker. */
export const TABS_UP_TO = 5;

/** Every area opens on its overview, drawn as a grid icon. */
const overview = (href: string): AreaPage => ({ href, label: 'Overview', icon: 'tabler:layout-grid' });

export interface Area {
	id: 'homepages' | 'chrome' | 'design';
	label: string;
	pages: AreaPage[];
}

export const AREAS: Area[] = [
	{
		id: 'homepages',
		label: 'Homepages',
		pages: [
			overview('/internal/homepages/'),
			...HOME_COMPOSITIONS.map((c) => ({ href: compositionHref(c), label: `${c.label} · ${c.name}` })),
		],
	},
	{
		id: 'chrome',
		label: 'Chrome',
		pages: [
			overview('/internal/chrome/'),
			// The stage routes under a part's address count as the part: a header stage is the header page.
			...CHROME.map((p) => ({ href: chromeHref(p), label: p.label, match: chromeHref(p) })),
		],
	},
	{
		id: 'design',
		label: 'Design system',
		pages: [overview('/internal/design-system/'), { href: '/internal/library/kit/', label: 'Kit' }],
	},
];

/** Trailing slash either way, so `/internal/chrome` and `/internal/chrome/` both match. */
const normal = (path: string) => path.replace(/\/?$/, '/');

const matches = (page: AreaPage, path: string) =>
	page.match ? normal(path).startsWith(page.match) : normal(path) === page.href;

/** The area and page a path belongs to, or nothing for a page outside every area (the hub). */
export function areaFor(path: string): { area?: Area; page?: AreaPage } {
	for (const area of AREAS) {
		const page = area.pages.find((p) => matches(p, path));
		if (page) return { area, page };
	}
	return {};
}
