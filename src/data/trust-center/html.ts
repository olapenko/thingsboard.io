import { NEW_TAB_NOTE } from '@util/external-links';

/**
 * Links inside the Trust Center's HTML strings (fact values, FAQ answers), held to the site's link
 * policy: a link on the site is a plain anchor; a link off it opens a new tab and says so to a screen
 * reader (`NEW_TAB_NOTE`), as the kit's `Link external` does.
 */

export const link = (href: string, text: string): string => `<a href="${href}">${text}</a>`;

export const extLink = (href: string, text: string): string =>
	`<a href="${href}" target="_blank" rel="noopener noreferrer">${text}<span class="ui-sr">${NEW_TAB_NOTE}</span></a>`;

export const mailLink = (address: string): string => `<a href="mailto:${address}">${address}</a>`;
