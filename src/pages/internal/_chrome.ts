/**
 * THE CHROME: the frame every page of the site shares, one workbench page per part. This is the
 * registry the Chrome area is built from — its overview tiles, the top bar's tabs, the island's
 * link and the old addresses that land here — so a part is added in ONE place: an entry below and a
 * page in `chrome/`.
 *
 * Why an area of its own. On FE-handoff the header lived under Flows ("main menu"), the footer under
 * Sections, the cookie notice and the chat under Flows: four pages in three menus for the one thing
 * they have in common, which is that they are on EVERY page and are judged against each other (the
 * launcher sits on the cookie bar's row; the footer's black meets the bar's indigo). Here they are
 * one area, with the same workbench on each page: every variation the site supports as a tab, each
 * drawn as the REAL page in frames at the widths where the chrome changes shape, under shared state
 * controls (theme, scrolled, menu open).
 */
export interface ChromePart {
	id: 'header' | 'footer' | 'cookie-notice' | 'chat';
	label: string;
	/** One line for the tile and the page's lede. */
	blurb: string;
	icon: string;
	/** The component(s) the page judges, as the tile's footnote. */
	source: string;
}

export const CHROME: ChromePart[] = [
	{
		id: 'header',
		label: 'Header',
		blurb: 'The one bar every page carries, in each of its variants and states, on docs and marketing pages.',
		icon: 'tabler:layout-navbar',
		source: 'Landing/HeaderContent · util/header-config',
	},
	{
		id: 'footer',
		label: 'Footer',
		blurb: 'The footer that maps the platform, the one the older pages keep, and the docs footer.',
		icon: 'tabler:layout-bottombar',
		source: 'SiteFooter (map · docs) · Landing/Footer',
	},
	{
		id: 'cookie-notice',
		label: 'Cookie consent',
		blurb:
			'The consent bar at the foot of every page and its preferences, over the homepage and a docs page, and what it replaced.',
		icon: 'tabler:cookie',
		source: 'CookieConsent',
	},
	{
		id: 'chat',
		label: 'Chat',
		blurb: 'The AI chat in the corner: its skin, its launcher, and the colour cycle they share.',
		icon: 'tabler:message-chatbot',
		source: 'ChatWidget/ChatSkin · ChatWidget/ChatLauncher',
	},
];

export const chromeHref = (part: Pick<ChromePart, 'id'>) => `/internal/chrome/${part.id}/`;

export const chrome = (id: ChromePart['id']): ChromePart => {
	const part = CHROME.find((p) => p.id === id);
	if (!part) throw new Error(`No chrome part "${id}"`);
	return part;
};
