import { FOOTER_ECOSYSTEM, FOOTER_PLATFORMS, type FooterProduct } from '@data/footer-map';
import { docsSubmenu, type SubMenuItem } from '@data/navigation';

/**
 * THE DOCS HUB (`/docs/`): where a reader who does not yet know which product's documentation they
 * want starts. PROPOSAL, held for a ship decision (LAB.md, "Awaiting a ship decision").
 *
 * The products are the Docs menu's own groups, so the hub and the menu cannot list different
 * products; Community Edition is not one of them (it ends at 4.3), only a quiet line under
 * ThingsBoard for the reader who runs it. The page's other links are written in the
 * page itself (`docs/index.mdx`), as other docs pages write theirs.
 */

/** A product's docs, with the badge the footer's map gives the product (found by its name). */
export interface DocsHubProduct extends SubMenuItem {
	mark: FooterProduct;
}

const group = (name: string): DocsHubProduct[] => {
	const found = docsSubmenu.groups.find((g) => g.name === name);
	if (!found) throw new Error(`[docs-hub] the Docs menu has no "${name}" group`);
	return found.items.map((item) => {
		const mark = [...FOOTER_PLATFORMS, ...FOOTER_ECOSYSTEM].find((p) => p.name === item.heading);
		if (!mark) throw new Error(`[docs-hub] the footer's map has no product named "${item.heading}"`);
		return { ...item, mark };
	});
};

export const DOCS_HUB_PLATFORMS = group('IoT platforms');
export const DOCS_HUB_ECOSYSTEM = group('Product ecosystem');

/** Under ThingsBoard's card: the retired edition, for whoever still runs it. */
export const DOCS_HUB_COMMUNITY = {
	under: '/docs/pe/',
	text: 'Running Community Edition?',
	link: { title: 'Its docs', href: '/docs/getting-started/' },
};
