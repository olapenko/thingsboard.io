import { allSubmenus, mainNavItems, type NavItem, type SubMenu } from '@data/navigation';

/**
 * The menu as `SiteMenu` renders it: the top-level items in their order, each with its section where it
 * has one. Read once here so the row, the one panel, the dropdowns and the sheet walk the same list.
 */
export interface MenuEntry {
	item: NavItem;
	sub?: SubMenu;
}

export type MenuSection = Required<MenuEntry>;

export const MENU_ENTRIES: MenuEntry[] = mainNavItems.map((item) => {
	const sub = item.submenuId ? allSubmenus.find((s) => s.id === item.submenuId) : undefined;
	// Either a section or a page: an item with neither would render a link to nowhere.
	if (item.submenuId && !sub)
		throw new Error(`[menu] "${item.label}" names a section "${item.submenuId}" that does not exist`);
	if (!sub && !item.href) throw new Error(`[menu] "${item.label}" has neither a section nor a page`);
	return { item, sub };
});

export const MENU_SECTIONS: MenuSection[] = MENU_ENTRIES.filter((e): e is MenuSection => e.sub !== undefined);

/** Products and Docs draw their marks a step larger: they are the products' logos. */
export const iconSizeOf = (sub: SubMenu) => (sub.id === 'nav-products' || sub.id === 'nav-docs' ? 32 : 24);

/**
 * Products and Docs list the products, so their rows carry the products' badges (`product-badges`,
 * the footer's and the docs hub's), not the nav icons.
 */
export const badgesIn = (sub: SubMenu) => sub.id === 'nav-products' || sub.id === 'nav-docs';

/**
 * A link's line under its name, only where it tells two links apart: the products, and their docs.
 * Elsewhere the name says it — "Smart metering", "Careers" — and the line was the weight that made
 * the panel heavy.
 */
export const describes = (sub: SubMenu) => sub.id === 'nav-products' || sub.id === 'nav-docs';

/** Whether the page being rendered is the item's page or under it. The homepage is no item's. */
export const isHere = (pathname: string, href?: string) => !!href && href !== '/' && pathname.startsWith(href);

/**
 * Whether the page being rendered is in a section: its item's own page, one of its links' pages or
 * under one, or a path it owns (`SubMenu.owns`). The row underlines that item, so a reader on a case
 * study sees Solutions marked.
 */
export const inSection = (pathname: string, { item, sub }: MenuSection) =>
	isHere(pathname, item.href) ||
	sub.groups.some((g) => g.items.some((i) => i.href.startsWith('/') && isHere(pathname, i.href))) ||
	(sub.owns ?? []).some((path) => isHere(pathname, path));
