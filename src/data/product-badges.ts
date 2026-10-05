import { FOOTER_ECOSYSTEM, FOOTER_PLATFORMS, type FooterProduct } from '@data/footer-map';
import { markBySrc, type MarkName } from '@data/marks';

/**
 * A product's badge (`ui/Mark`), one per product wherever products are listed — the footer's map, the
 * menu's Products and Docs, the docs hub: the two platforms as the ThingsBoard logo on a solid tile in
 * their hue, the ecosystem as its own glyph on a wash of its hue. The products and hues are the
 * footer map's (`FOOTER_PLATFORMS`, `FOOTER_ECOSYSTEM`), found by the name the menu gives them too.
 */
export interface ProductBadge {
	fill: 'solid' | 'wash';
	accent: string;
	logo?: 'thingsboard';
	icon?: string;
	product?: Exclude<MarkName, 'thingsboard'>;
}

/** An ecosystem badge's glyph: the ThingsBoard logo (the Mobile App's), a tabler icon, or the product's logo. */
export const glyphOf = (p: FooterProduct): Pick<ProductBadge, 'logo' | 'icon' | 'product'> =>
	p.icon === 'mark'
		? { logo: 'thingsboard' }
		: p.icon.startsWith('tabler:')
			? { icon: p.icon }
			: { product: markBySrc(p.icon) as Exclude<MarkName, 'thingsboard'> };

/**
 * The menu's badge: the same tile in CSS (`SiteMenu.astro`, `.sm__badge`) with its glyph from the nav
 * sprite (`nav/badge-*.svg`, Mark's artwork cropped to Mark's boxes), not an inline `ui/Mark`. The menu
 * draws 14 badges on two surfaces on every page; inlined, their artwork was 147 KB of HTML (35 KB
 * gzipped) a page. `glyph` is the sprite file; `wide` is TBMQ's long logo, given a wider box.
 */
export interface MenuBadge {
	fill: 'solid' | 'wash';
	hue: string;
	glyph: string;
	/** The glyph's box in a 32px tile, Mark's at 32: the logo 20, a product 23, a wide product 26. */
	size: number;
	wide?: boolean;
}

const BADGE_GLYPH = '/src/assets/images/landings/nav/badge-';

/** The menu badge of the product named `name`; undefined for a name that is no product, or a tabler glyph. */
export function menuBadgeOf(name: string): MenuBadge | undefined {
	const platform = FOOTER_PLATFORMS.find((p) => p.name === name);
	if (platform) return { fill: 'solid', hue: platform.hue, glyph: `${BADGE_GLYPH}thingsboard.svg`, size: 20 };
	const eco = FOOTER_ECOSYSTEM.find((p) => p.name === name);
	if (!eco) return undefined;
	const glyph = glyphOf(eco);
	if (glyph.logo) return { fill: 'wash', hue: eco.hue, glyph: `${BADGE_GLYPH}thingsboard.svg`, size: 20 };
	if (!glyph.product) return undefined;
	const wide = glyph.product === 'tbmq';
	return { fill: 'wash', hue: eco.hue, glyph: `${BADGE_GLYPH}${glyph.product}.svg`, size: wide ? 26 : 23, wide };
}

/** The badge of the product named `name`, or undefined for a name that is no product. */
export function badgeOf(name: string): ProductBadge | undefined {
	const platform = FOOTER_PLATFORMS.find((p) => p.name === name);
	if (platform) return { fill: 'solid', accent: platform.hue, logo: 'thingsboard' };
	const eco = FOOTER_ECOSYSTEM.find((p) => p.name === name);
	if (eco) return { fill: 'wash', accent: eco.hue, ...glyphOf(eco) };
	return undefined;
}
