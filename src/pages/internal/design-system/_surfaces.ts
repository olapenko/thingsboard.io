import { markBySrc } from '@data/marks';
import { productsSubmenu } from '@data/navigation';
import { FOOTER_ECOSYSTEM, FOOTER_PLATFORMS } from '@data/footer-map';
import { glyphOf, menuBadgeOf } from '@data/product-badges';
import { homeProducts } from '@data/homeProducts';
import { homeEcosystem, type EcosystemItem } from '@data/homeEcosystem';
import { installProducts } from '@data/installationsHub';
import { CONSERVATIVE_ADDON_MARKS } from '@data/pricing-page';
import { DOCS_HUB_ECOSYSTEM, DOCS_HUB_PLATFORMS } from '@data/docs-hub';
import {
	PRODUCTS,
	type Cell,
	type Fill,
	type MarkSpec,
	type ProductId,
} from '@root/pages/internal/design-system/_logos';

/**
 * THE NEW SURFACES that list the products, each as a set of cells drawn from that surface's own data
 * with the props that surface passes (`Cell` in `_logos.ts`): the menu, the footer map, the docs hub,
 * the homepage's cards, the installations hub and pricing's add-ons. The Logos page's matrix adds the
 * two legacy columns (the docs selector, the OG cards); the Logos page reads these alone.
 *
 * Rebuilt from the data, not screenshotted, so it says what ships on this branch now. The surface
 * notes are written by hand, and so is the mapping of names to rows (`rowOf`): a name no row matches
 * shows up in a matrix's `unmatched` rather than being dropped.
 */

export type Row = Exclude<ProductId, 'thingsboard' | 'agent' | 'other'> | 'offline';

export const ROWS: { id: Row; label: string }[] = [
	...PRODUCTS.filter((p) => !['thingsboard', 'agent', 'other'].includes(p.id)).map((p) => ({
		id: p.id as Row,
		label: p.label,
	})),
	{ id: 'offline', label: 'Offline Mode (add-on)' },
];

const ROW_BY_NAME: [RegExp, Row][] = [
	[/cloud/i, 'cloud'],
	[/edge/i, 'edge'],
	[/gateway/i, 'gateway'],
	[/tbmq|mqtt/i, 'tbmq'],
	[/trendz/i, 'trendz'],
	[/mobile/i, 'mobile'],
	[/iot hub/i, 'iot-hub'],
	[/license/i, 'license'],
	[/offline/i, 'offline'],
	[/thingsboard|on-premises|community|professional/i, 'platform'],
];
export const rowOf = (name: string) => ROW_BY_NAME.find(([re]) => re.test(name))?.[1];

export interface Surface {
	id: string;
	label: string;
	source: string;
	dark?: boolean;
	/** Not shipping: drawn, but not a decision's evidence. */
	parked?: boolean;
	note: string;
	cells: Cell[];
}

export const glyphWord = (m: Pick<MarkSpec, 'logo' | 'product' | 'icon'>) =>
	m.logo ? 'logo' : m.product ? m.product : (m.icon ?? '').replace('tabler:', '');

export const markGlyph = (src: string): Pick<MarkSpec, 'logo' | 'product' | 'icon'> => {
	if (src.startsWith('tabler:')) return { icon: src };
	const name = markBySrc(src);
	if (name === 'thingsboard') return { logo: 'thingsboard' };
	if (name) return { product: name };
	return {};
};

/** `EcosystemCard`'s tile, worked out as that component does it (its frontmatter, 2026-10-23). */
export function ecosystemCell(
	item: Pick<EcosystemItem, 'name' | 'icon' | 'accent' | 'filled'> & { badgeFill?: string }
): Extract<Cell, { kind: 'mark' }> {
	const trial = item.filled === true ? {} : item.filled || null;
	const markSrc = trial?.icon ?? item.icon;
	const glyph = markGlyph(markSrc);
	const fill: Fill = item.badgeFill || (trial && (trial.bg ?? item.accent) !== '#ffffff') ? 'solid' : 'white';
	const accent = item.badgeFill ?? trial?.bg ?? item.accent;
	const inked = !!trial && fill === 'white';
	const ink = inked ? (trial?.ink ?? '#ffffff') : undefined;
	return {
		kind: 'mark',
		name: item.name,
		mark: { size: 72, fill, accent, lift: true, tone: inked ? 'knockout' : undefined, ...glyph },
		ink,
		caption: `${fill} · ${glyphWord(glyph)} · ${ink ?? accent}`,
	};
}

export const NEW_SURFACES: Surface[] = [
	{
		id: 'menu',
		label: 'Menu',
		source: 'data/navigation.ts · product-badges.ts menuBadgeOf · SiteMenu.astro .sm__badge',
		note: 'Products and Docs: the badge in CSS (32px) with its glyph from the sprite, not a Mark. Light theme.',
		cells: productsSubmenu.groups
			.flatMap((g) => g.items)
			.map((item): Cell => {
				const b = menuBadgeOf(item.heading);
				return b
					? {
							kind: 'menu',
							name: item.heading,
							fill: b.fill,
							hue: b.hue,
							glyph: b.glyph,
							size: b.size,
							caption: `${b.fill} · ${b.glyph.split('/').pop()?.replace('.svg', '')} · ${b.hue}`,
						}
					: { kind: 'nav', name: item.heading, src: item.icon ?? '', caption: 'nav icon' };
			}),
	},
	{
		id: 'footer',
		label: 'Footer map',
		source: 'data/footer-map.ts · FooterMap.astro',
		dark: true,
		note: 'Mark 40: the platforms solid in their hue, the ecosystem a wash of the dark menu’s lighter hues.',
		cells: [
			...FOOTER_PLATFORMS.map((p): Cell => ({
				kind: 'mark',
				name: p.name,
				mark: { size: 40, logo: 'thingsboard', accent: p.hue },
				caption: `solid · logo · ${p.hue}`,
			})),
			...FOOTER_ECOSYSTEM.map((p): Cell => {
				const g = glyphOf(p);
				return {
					kind: 'mark',
					name: p.name,
					mark: { size: 40, fill: 'wash', accent: p.hue, ...g },
					caption: `wash · ${glyphWord(g)} · ${p.hue}`,
				};
			}),
		],
	},
	{
		id: 'docs-hub',
		label: 'Docs hub',
		source: 'data/docs-hub.ts · DocsHubProducts.astro',
		parked: true,
		note: 'The footer’s badges at the docs’ sizes: the platforms 40, the ecosystem 36. Parked (not shipping).',
		cells: [
			...DOCS_HUB_PLATFORMS.map((p): Cell => ({
				kind: 'mark',
				name: p.heading,
				mark: { size: 40, logo: 'thingsboard', accent: p.mark.hue },
				caption: `solid · logo · ${p.mark.hue}`,
			})),
			...DOCS_HUB_ECOSYSTEM.map((p): Cell => {
				const g = glyphOf(p.mark);
				return {
					kind: 'mark',
					name: p.heading,
					mark: { size: 36, fill: 'wash', accent: p.mark.hue, ...g },
					caption: `wash · ${glyphWord(g)} · ${p.mark.hue}`,
				};
			}),
		],
	},
	{
		id: 'home',
		label: 'Homepage cards',
		source: 'data/homeProducts.ts · homeEcosystem.ts · EcosystemCard.astro',
		note: 'Mark 72, lifted. The two products solid in their badge fill; the ecosystem its artwork on white, or a glyph.',
		cells: [...homeProducts.map((p) => ecosystemCell(p)), ...homeEcosystem.map((e) => ecosystemCell(e))],
	},
	{
		id: 'install',
		label: 'Installations',
		source: 'data/installationsHub.ts · pages/installations',
		note: 'Mark 72 (64 in one column): a platform solid in its fill, the rest their artwork on white.',
		cells: installProducts.map((p): Cell => {
			const g = markGlyph(p.icon);
			const fill: Fill = p.badgeFill ? 'solid' : 'white';
			const accent = p.badgeFill ?? p.accent;
			return {
				kind: 'mark',
				name: p.name,
				mark: { size: 72, fill, accent, lift: true, ...g },
				caption: `${fill} · ${glyphWord(g)} · ${accent}`,
			};
		}),
	},
	{
		id: 'pricing',
		label: 'Pricing add-ons',
		source: 'data/pricing-page.ts CONSERVATIVE_ADDON_MARKS · pricing/_AddOnCards',
		note: 'Mark 48, solid in the add-on’s accent. The Mobile App is a phone here, the ThingsBoard mark everywhere else.',
		cells: Object.entries(CONSERVATIVE_ADDON_MARKS).map(([name, m]): Cell => {
			const g = m.src ? markGlyph(m.src) : { icon: m.icon };
			return {
				kind: 'mark',
				name,
				mark: { size: 48, accent: m.accent, ...g },
				caption: `solid · ${glyphWord(g)} · ${m.accent}`,
			};
		}),
	},
];

/** Each surface's cells by row, and the names no row claimed — said aloud rather than dropped. */
export const matrixOf = (surfaces: Surface[]) =>
	surfaces.map((s) => {
		const rows = new Map<Row, Cell[]>();
		const unmatched: string[] = [];
		for (const c of s.cells) {
			const key = c.name.includes('|') ? (c.name.split('|')[0] as Row) : rowOf(c.name);
			if (!key || !ROWS.some((r) => r.id === key)) {
				unmatched.push(c.name);
				continue;
			}
			rows.set(key, [...(rows.get(key) ?? []), c]);
		}
		return { ...s, rows, unmatched };
	});

/** A cell's name without its row key (`row|name`, which the OG cards use). */
export const cellName = (c: Cell) => (c.name.includes('|') ? c.name.split('|')[1] : c.name);
