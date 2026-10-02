/**
 * The artwork `ui/Mark` puts in a tile, by name, so no page passes a file path.
 *
 * `art` is the drawn shape's box in the file's own coordinates, measured with getBBox (1 Oct
 * 2026). Mark sets it as the inlined SVG's viewBox, which crops the file's padding once for every
 * tile: each file pads its artwork differently (the product logos fill 77–100% of their width and
 * 47–84% of their height, Trendz sits 13% above centre, TBMQ is 2:1), and sizing the file's box
 * instead of the artwork is why the same tile showed the same logo at different sizes.
 *
 * `wide` marks artwork wider than 3:2, which may run to 80% of the tile's width instead of 70%.
 */
export interface MarkArt {
	src: string;
	art: readonly [number, number, number, number];
	wide?: boolean;
}

export const MARKS = {
	// The ThingsBoard logo: one file for every tile. The 44px-box copy (landings/thingsboard-mark.svg),
	// whose artwork fills 74% of its box, retires as its tiles move to Mark.
	thingsboard: { src: '/src/assets/images/landings/draft/thingsboard-mark.svg', art: [0, 0, 145, 144] },
	edge: { src: '/src/assets/images/landings/ce/thingsboard-e-icon.svg', art: [5, 5, 44, 44] },
	trendz: { src: '/src/assets/images/landings/ce/trendz-icon.svg', art: [0, 1, 54, 37.63] },
	gateway: { src: '/src/assets/images/landings/ce/gateway-icon.svg', art: [6.33, 4.26, 41.34, 45.48] },
	mobile: { src: '/src/assets/images/landings/ce/tb-pe-mobile-icon.svg', art: [3, 5, 48, 44.01] },
	'mobile-ce': { src: '/src/assets/images/landings/ce/tb-mobile-icon.svg', art: [0.29, 12, 53.58, 30], wide: true },
	tbmq: { src: '/src/assets/images/landings/ce/tbmq-icon.svg', art: [5.26, 26.32, 92.11, 47.37], wide: true },
} as const satisfies Record<string, MarkArt>;

export type MarkName = keyof typeof MARKS;

/** The files data modules still name by path, and the mark each one is. */
const LEGACY_SRC: Record<string, MarkName> = {
	'/src/assets/images/landings/thingsboard-mark.svg': 'thingsboard',
	// The header menu's sprite copies of the product logos (the footer's data names these).
	'/src/assets/images/landings/nav/thingsboard-e-icon.svg': 'edge',
	'/src/assets/images/landings/nav/gateway-icon.svg': 'gateway',
	'/src/assets/images/landings/nav/tbmq-icon.svg': 'tbmq',
	'/src/assets/images/landings/nav/trendz-icon.svg': 'trendz',
};

/** The mark a file path stands for, for data that still names the file. */
export function markBySrc(src: string): MarkName | undefined {
	if (LEGACY_SRC[src]) return LEGACY_SRC[src];
	return (Object.keys(MARKS) as MarkName[]).find((name) => MARKS[name].src === src);
}
