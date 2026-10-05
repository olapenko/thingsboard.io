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

export const MENU_ENTRIES: MenuEntry[] = mainNavItems.map((item) => ({
	item,
	sub: item.submenuId ? allSubmenus.find((s) => s.id === item.submenuId) : undefined,
}));

export const MENU_SECTIONS: MenuSection[] = MENU_ENTRIES.filter((e): e is MenuSection => e.sub !== undefined);

/** The Products section draws its marks a step larger: they are the products' logos. */
export const iconSizeOf = (sub: SubMenu) => (sub.id === 'nav-products' ? 32 : 24);

/** Whether the page being rendered is the item's page or under it. The homepage is no item's. */
export const isHere = (pathname: string, href?: string) => !!href && href !== '/' && pathname.startsWith(href);
