/**
 * The ThingsBoard mark (`landings/draft/thingsboard-mark.svg`, one compound path of 148 points)
 * rebuilt from the few shapes it is made of, so an animation can move each on its own. Measured from
 * that path on 30 Oct 2026:
 *
 * - Two ARMS, each the other turned a half turn about `CENTER`: a quarter-circle arc (radius 64.08
 *   to the middle of its 7.9 stroke, round caps) with a RING on its midpoint (radius 12.54, the same
 *   stroke). The arcs are not concentric. Each turns about its own center, and the two centers sit
 *   5.5 apart on the diagonal, so spinning them as drawn would wobble: the loader pulls them onto
 *   `CENTER` first.
 * - The CHIP: a rounded rectangle turned 45°, the trend arrow cut out of it, and eight PINS, two on
 *   each side: straight bars 7.57 wide with a round end.
 *
 * Every part is the simplest shape that draws it. The arms are strokes, so an animation lengthens an
 * arc through its dash; the pins are strokes too, two points each, so one draws in along its length.
 * The body is four edges and four rounded corners (the edges in the original carry the pins' feet as
 * extra points, within 0.08 of straight). The arrow keeps its outline, at two decimals. The Loader
 * page lays the parts over the original and counts the pixels that differ.
 */

export const VIEWBOX = '0 0 145 144';

/** The point the mark is symmetric about under a half turn: midway between the two arms' centers. */
export const CENTER = { x: 72.025, y: 71.775 } as const;

export const ARM = {
	/** The arc's radius to the middle of its stroke, about the arm's own center. */
	radius: 64.08,
	stroke: 7.9,
	/** Where the ring sits from the arm's own center: the top-left arm's angle (SVG degrees, y down). */
	ringAngle: 225.16,
	ringDistance: 64.25,
	ringRadius: 12.54,
	ringStroke: 7.88,
	/** The arc's sweep either side of the ring, in degrees: a quarter circle in all. */
	halfSweep: 45,
	/** The top-left arm's own center, from `CENTER`. The other arm's is the negative. */
	offset: { x: -4.025, y: -3.775 },
	/**
	 * Where each half of the arc starts, measured along it from the ring's center: on the ring's own
	 * center line, the one place where the round cap (radius 3.95) fits inside the ring's band (8.6
	 * to 16.5). So the start never shows, in the hole or past the ring, even when a half shrinks to a
	 * dot as it draws into its ring.
	 */
	tuck: 12.54,
	/** How far each half's path runs, in degrees: the most any animation lengthens it to. */
	reach: 170,
} as const;

/** The sweep at which a half of an arc is all under its ring: an animation that hides one stops here. */
export const TUCKED_SWEEP = (ARM.tuck / ARM.radius) * (180 / Math.PI);

/**
 * One half of an arc, along the circle from `from` to `to` degrees past the ring: `1` runs clockwise
 * (the leading half), `-1` back. By default the whole reach, for a dash to show part of.
 */
export function armArcPath(dir: 1 | -1, from = 0, to: number = ARM.reach): string {
	const r = ARM.radius;
	const at = (deg: number) => {
		const a = (deg * Math.PI) / 180;
		return `${round(r * Math.cos(a))} ${round(dir * r * Math.sin(a))}`;
	};
	return `M${at(from)}A${r} ${r} 0 0 ${dir === 1 ? 1 : 0} ${at(to)}`;
}

/** The dash that shows a half of an arc out to `sweep` degrees from the ring; `null` when none shows. */
export function armDash(sweep: number): { array: string; offset: string } | null {
	const length = (ARM.radius * sweep * Math.PI) / 180 - ARM.tuck;
	if (length <= 0.05) return null;
	return { array: `${round(length)} 999`, offset: String(-ARM.tuck) };
}

/**
 * The arm's transform: on its own center in the logo (`pull` 0) or on `CENTER` (`pull` 1), turned by
 * `turn` degrees past where the logo draws it, at `scale`.
 */
export function armTransform(arm: 0 | 1, pull = 0, turn = 0, scale = 1): string {
	const sign = arm === 0 ? 1 : -1;
	const x = CENTER.x + sign * ARM.offset.x * (1 - pull);
	const y = CENTER.y + sign * ARM.offset.y * (1 - pull);
	const angle = ARM.ringAngle + arm * 180 + turn;
	return `translate(${round(x)} ${round(y)}) rotate(${round(angle)})${scale === 1 ? '' : ` scale(${round(scale)})`}`;
}

export interface Pin {
	/** The middle of the pin's foot, on the body's edge. */
	base: readonly [number, number];
	/** The center of its round end. */
	tip: readonly [number, number];
}

export const CHIP = {
	/** The middle of the body, which it turns and shrinks about. */
	center: { x: 71.84, y: 70.5 },
	body: 'M72.81 26.92C74.61 25.12 77.49 25.12 79.29 26.92L115.56 62.98C117.36 64.78 117.36 67.65 115.56 69.44L70.79 114.03C68.99 115.83 66.11 115.83 64.31 114.03L28.08 78.01C26.28 76.22 26.28 73.35 28.08 71.55Z',
	/** The trend arrow, cut out of the body: drawn with it under `fill-rule="evenodd"`. */
	arrow:
		'M78.43 44.41C77.4 44.37 76.36 44.81 75.6 45.58C75.24 45.94 74.93 46.39 74.75 46.83L71.1 55.58C70.38 57.24 70.92 59.17 72.45 60.07C73.98 60.96 75.96 60.65 77.22 59.26L79.07 66.48L58.95 72.58C56.97 73.17 55.76 75.23 56.25 77.2L60.84 95.06C61.33 97.03 63.36 98.15 65.38 97.53C67.41 96.9 68.63 94.83 68.08 92.86L64.35 78.55L84.46 72.45C86.44 71.87 87.66 69.76 87.17 67.83L84.42 57.06C86.13 57.56 88.02 56.75 88.88 55.09C89.73 53.43 89.32 51.45 87.93 50.51L80.5 45.08C79.92 44.64 79.2 44.41 78.43 44.41Z',
	/**
	 * The pins' stroke. Measured across each pin's outline it is 7.55 to 7.62; 7.62 matches the
	 * original best in the Loader page's pixel check, since the original's round ends are a little
	 * fuller than a half circle.
	 */
	pinWidth: 7.62,
	/** Clockwise from the top: two on each side, top-right first. */
	pins: [
		{ base: [90.16, 37.75], tip: [99.03, 28.88] },
		{ base: [104.45, 52.02], tip: [113.43, 43.04] },
		{ base: [101.72, 83.24], tip: [110.73, 92.23] },
		{ base: [84.62, 100.26], tip: [93.65, 109.27] },
		{ base: [53.28, 103.04], tip: [44.29, 112.04] },
		{ base: [38.99, 88.8], tip: [30.01, 97.77] },
		{ base: [41.94, 57.76], tip: [32.98, 48.81] },
		{ base: [59, 40.76], tip: [50.04, 31.81] },
	] satisfies Pin[],
} as const;

/**
 * A pin drawn `out` of the way from tucked (0) to the logo (1), past 1 for an overshoot. It starts
 * a cap's width inside the body, so its round start never shows; its end runs along the pin's axis
 * from just inside the edge, where the round end is all under the body, out to the tip.
 */
export function pinPath(pin: Pin, out = 1): string {
	const [bx, by] = pin.base;
	const [tx, ty] = pin.tip;
	const reach = Math.hypot(tx - bx, ty - by);
	const [ax, ay] = [(tx - bx) / reach, (ty - by) / reach];
	const cap = CHIP.pinWidth / 2;
	const end = out === 1 ? reach : -cap + (reach + cap) * out;
	const start = -(cap + 1);
	const at = (d: number) => `${round2(bx + ax * d)} ${round2(by + ay * d)}`;
	return `M${at(start)}L${at(end)}`;
}

/**
 * The mark as named parts in one SVG, drawn as the logo: what the Loader page offers to download for
 * a design tool. Each arc half is its own path with no dash on it, since design tools read a dash
 * offset unevenly.
 */
export function markPartsSvg(): string {
	const half = (dir: 1 | -1, id: string) =>
		`<path id="${id}" d="${armArcPath(dir, TUCKED_SWEEP, ARM.halfSweep)}" stroke-width="${ARM.stroke}" stroke-linecap="round"/>`;
	const arm = (i: 0 | 1, id: string) =>
		`<g id="${id}" transform="${armTransform(i)}" fill="none" stroke="currentColor">` +
		half(-1, `${id}-arc-back`) +
		half(1, `${id}-arc-ahead`) +
		`<circle id="${id}-ring" cx="${ARM.ringDistance}" cy="0" r="${ARM.ringRadius}" stroke-width="${ARM.ringStroke}"/>` +
		`</g>`;
	const pins = CHIP.pins.map((p, i) => `<path id="pin-${i + 1}" d="${pinPath(p)}"/>`).join('');
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" width="145" height="144" color="#17181c">` +
		arm(0, 'arm-top-left') +
		arm(1, 'arm-bottom-right') +
		`<g id="chip"><path id="chip-body" fill="currentColor" fill-rule="evenodd" d="${CHIP.body}${CHIP.arrow}"/>` +
		`<g id="pins" fill="none" stroke="currentColor" stroke-width="${CHIP.pinWidth}" stroke-linecap="round">${pins}</g></g>` +
		`</svg>`
	);
}

function round(n: number): number {
	return Math.round(n * 1000) / 1000;
}

function round2(n: number): number {
	return Math.round(n * 100) / 100;
}
