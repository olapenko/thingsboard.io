// The bar's appearance, resolved from `BaseLayout`'s props and read by the Starlight Header override.
//
// TWO LOOKS. `docs` is the bar the documentation carries: the sidebar ground with a hairline, one
// state. `marketing` is every other page's: the surface with a hairline at
// the top of the page and, once scrolled, a shadow instead, the bar lifting off the page it covers.
// A marketing page that opens on a hero says so with `hero`, and the bar starts transparent over it —
// white ink over a dark hero, the page's own over a light one — until the hero is scrolled past.
// Search is the same control on both, sized by the room (`SearchButton`).
//
// There is no theme icon in either look: the theme follows the system, and its switch is the footer's.

export type HeaderLook = 'marketing' | 'docs';

/** The hero the bar opens over: its ink while transparent. */
export type HeaderHero = 'dark' | 'light';

export interface HeaderConfig {
	look: HeaderLook;
	hero?: HeaderHero;
	cloudSignupIds: boolean;
}

export interface HeaderConfigInput {
	look?: HeaderLook;
	hero?: HeaderHero;
	cloudSignupIds?: boolean;
}

export function resolveHeaderConfig(input: HeaderConfigInput = {}): HeaderConfig {
	const look = input.look ?? 'docs';
	return {
		look,
		// Only a marketing page has a hero to open over.
		hero: look === 'marketing' ? input.hero : undefined,
		cloudSignupIds: input.cloudSignupIds ?? true,
	};
}
