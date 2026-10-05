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

/** The badge of the product named `name`, or undefined for a name that is no product. */
export function badgeOf(name: string): ProductBadge | undefined {
	const platform = FOOTER_PLATFORMS.find((p) => p.name === name);
	if (platform) return { fill: 'solid', accent: platform.hue, logo: 'thingsboard' };
	const eco = FOOTER_ECOSYSTEM.find((p) => p.name === name);
	if (eco) return { fill: 'wash', accent: eco.hue, ...glyphOf(eco) };
	return undefined;
}
