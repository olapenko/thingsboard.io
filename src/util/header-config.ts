// The bar's appearance, resolved from `BaseLayout`'s props and read by the Starlight Header override.
//
// TWO LOOKS. `docs` is the bar the documentation carries: the sidebar ground with a hairline, one
// state. `marketing` is every other page's: the surface with a hairline at
// the top of the page and, once scrolled, a shadow instead, the bar lifting off the page it covers.
// A marketing page that opens on a hero says so with `hero`, and the bar starts transparent over it —
// white ink over a dark hero, the page's own over a light one — until the hero is scrolled past.
// Search is the same control on both, sized by the room (`SearchButton`), on every bar unless the page
// turns it off: a page whose reader comes to choose rather than to look something up — the homepage,
// the product pages — leaves it out, with its dialog and keys.
//
// There is no theme icon in either look: the theme follows the system, and its switch is the footer's.

export type HeaderLook = 'marketing' | 'docs';

/**
 * The main menu's model (`SiteMenu`): `panel`, one surface under the bar with a rail of sections,
 * is the site's since 5 Oct. `dropdowns`, a panel under each item, is kept as the alternative and
 * shown by the chrome workbench; a page can ask for it through `BaseLayout`'s `menu`.
 */
export type HeaderMenu = 'dropdowns' | 'panel';

/** The hero the bar opens over: its ink while transparent. */
export type HeaderHero = 'dark' | 'light';

export interface HeaderConfig {
	look: HeaderLook;
	hero?: HeaderHero;
	/** Site search in the bar: the control, its dialog and its keys. */
	search: boolean;
	menu: HeaderMenu;
	cloudSignupIds: boolean;
}

export interface HeaderConfigInput {
	look?: HeaderLook;
	hero?: HeaderHero;
	search?: boolean;
	menu?: HeaderMenu;
	cloudSignupIds?: boolean;
}

export function resolveHeaderConfig(input: HeaderConfigInput = {}): HeaderConfig {
	const look = input.look ?? 'docs';
	return {
		look,
		// Only a marketing page has a hero to open over.
		hero: look === 'marketing' ? input.hero : undefined,
		search: input.search ?? true,
		menu: input.menu ?? 'panel',
		cloudSignupIds: input.cloudSignupIds ?? true,
	};
}
