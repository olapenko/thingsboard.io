/**
 * The ThingsBoard mark (`landings/draft/thingsboard-mark.svg`, one compound path) cut into the parts
 * an animation can move on their own. Measured from that path on 30 Oct 2026:
 *
 * - Two ARMS, each the other turned a half turn about `CENTER`: a quarter-circle arc (radius 64.08
 *   to the middle of its 7.9 stroke, round caps) with a RING on its midpoint (radius 12.54, the same
 *   stroke). The arcs are not concentric. Each turns about its own center, and the two centers sit
 *   5.5 apart on the diagonal, so spinning them as drawn would wobble: the loader pulls them onto
 *   `CENTER` first.
 * - The CHIP: a rounded rectangle turned 45°, the trend arrow cut out of it, and eight PINS, two on
 *   each side.
 *
 * The arms are REDRAWN as strokes, so an animation can lengthen an arc through its dash. The chip is
 * CUT from the original outline: the body is the outline with each pin replaced by the straight edge
 * under it, and each pin is its stretch of the outline closed 2 units inside the body, so the parts
 * overlap where they meet and no hairline seam shows. The Loader page lays the parts over the
 * original and counts the pixels that differ.
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
	 * Where each half of the arc starts, measured along it from the ring's center: inside the ring's
	 * band (8.6 to 16.5), so the round cap at the start hides under the ring and never shows in its hole.
	 */
	tuck: 14,
	/** How far each half's path runs, in degrees: the most any animation lengthens it to. */
	reach: 170,
} as const;

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
	/** The middle of the pin's base, on the body's edge: where it shrinks to. */
	base: readonly [number, number];
	d: string;
}

export const CHIP = {
	/** The middle of the body, which it turns and shrinks about. */
	center: { x: 71.84, y: 70.5 },
	body: 'M61.65 38.086L72.81 26.916C74.61 25.122 77.49 25.122 79.29 26.916L87.48 35.08L92.835 40.419L101.79 49.346L107.1 54.684L115.56 62.983C117.36 64.778 117.36 67.649 115.56 69.443L104.4 80.568L99.045 85.906L87.3 97.615L81.945 102.908L70.785 114.033C68.985 115.828 66.105 115.828 64.305 114.033L55.935 105.689L50.625 100.396L41.67 91.469L36.315 86.131L28.08 78.011C26.28 76.216 26.28 73.346 28.08 71.552L39.24 60.426L44.64 55.088L56.34 43.424L61.65 38.086Z',
	/** The trend arrow, cut out of the body: drawn with it under `fill-rule="evenodd"`. */
	arrow:
		'M78.4346 44.4111C77.3997 44.3664 76.3645 44.8146 75.5996 45.5771C75.2396 45.936 74.9251 46.3854 74.7451 46.834L71.0996 55.5811C70.3796 57.2409 70.9202 59.1702 72.4502 60.0674C73.9801 60.9644 75.9598 60.6502 77.2197 59.2598L79.0654 66.4824L58.9502 72.583C56.9702 73.1662 55.755 75.2303 56.25 77.2041L60.8398 95.0576C61.3348 97.0314 63.3598 98.1533 65.3848 97.5254C67.4098 96.8974 68.625 94.8332 68.085 92.8594L64.3496 78.5498L84.4648 72.4482C86.4448 71.8651 87.6599 69.7571 87.165 67.8281L84.4199 57.0615C86.1299 57.555 88.02 56.7477 88.875 55.0879C89.73 53.4281 89.3247 51.4538 87.9297 50.5117L80.5049 45.084C79.9199 44.6354 79.1995 44.4111 78.4346 44.4111Z',
	/** Clockwise from the top: two on each side, top-right first. */
	pins: [
		{
			base: [90.157, 37.749],
			d: 'M87.48 35.08C88.424 34.138 93.644 28.935 96.435 26.153C97.11 25.525 98.01 25.166 98.91 25.121C101.025 25.032 102.78 26.692 102.78 28.8C102.78 29.787 102.465 30.773 101.745 31.491C98.82 34.452 93.78 39.477 92.835 40.419L91.423 41.835L86.068 36.496Z',
		},
		{
			base: [104.445, 52.015],
			d: 'M101.79 49.346C102.285 48.852 107.91 43.245 110.835 40.329C111.51 39.701 112.41 39.342 113.31 39.297C115.425 39.207 117.18 40.867 117.18 42.976C117.18 43.962 116.865 44.949 116.145 45.667C113.04 48.762 107.64 54.145 107.1 54.684L105.682 56.094L100.372 50.756Z',
		},
		{
			base: [101.722, 83.237],
			d: 'M104.4 80.568C104.544 80.711 110.477 86.582 113.49 89.63C114.12 90.303 114.48 91.2 114.525 92.097C114.615 94.205 112.95 95.955 110.835 95.955C109.845 95.955 108.855 95.641 108.135 94.923C104.94 91.783 99.27 86.13 99.045 85.906L97.633 84.49L102.988 79.152Z',
		},
		{
			base: [84.623, 100.261],
			d: 'M87.3 97.615C87.326 97.641 93.336 103.588 96.39 106.677C97.02 107.35 97.38 108.246 97.425 109.144C97.515 111.252 95.85 113.002 93.735 113.002C92.745 113.002 91.755 112.687 91.035 111.97L81.945 102.908L80.539 101.486L85.894 96.193Z',
		},
		{
			base: [53.28, 103.042],
			d: 'M55.935 105.689C55.484 106.183 49.859 111.835 46.89 114.751C46.215 115.379 45.315 115.738 44.415 115.783C42.3 115.873 40.545 114.213 40.545 112.104C40.545 111.118 40.86 110.131 41.58 109.413C44.685 106.318 50.129 100.891 50.625 100.396L52.037 98.98L57.347 104.273Z',
		},
		{
			base: [38.992, 88.8],
			d: 'M41.67 91.469C41.22 91.917 35.55 97.57 32.58 100.486C31.905 101.114 31.004 101.473 30.105 101.518C27.99 101.607 26.235 99.947 26.235 97.839C26.235 96.852 26.55 95.865 27.27 95.147C30.375 92.052 35.865 86.579 36.315 86.131L37.727 84.715L43.082 90.053Z',
		},
		{
			base: [41.94, 57.757],
			d: 'M39.24 60.426C38.655 59.842 33.075 54.325 30.195 51.409C29.565 50.736 29.205 49.84 29.16 48.942C29.115 47.866 29.52 46.878 30.195 46.205C30.87 45.532 31.815 45.084 32.895 45.084C33.885 45.084 34.875 45.398 35.595 46.116C38.7 49.166 44.054 54.504 44.64 55.088L46.046 56.51L40.646 61.848Z',
		},
		{
			base: [58.995, 40.755],
			d: 'M56.34 43.424C55.619 42.705 50.175 37.278 47.295 34.407C46.665 33.734 46.305 32.882 46.26 31.94C46.17 29.832 47.835 28.082 49.95 28.082C50.94 28.082 51.93 28.397 52.65 29.114C55.666 32.12 60.975 37.413 61.65 38.086L63.068 39.496L57.758 44.834Z',
		},
	] satisfies Pin[],
} as const;

/**
 * The mark as named parts in one SVG, drawn as the logo: what the Loader page offers to download for
 * a design tool. Each arc half is its own path with no dash on it, since design tools read a dash
 * offset unevenly.
 */
export function markPartsSvg(): string {
	const tuck = (ARM.tuck / ARM.radius) * (180 / Math.PI);
	const half = (dir: 1 | -1, id: string) =>
		`<path id="${id}" d="${armArcPath(dir, tuck, ARM.halfSweep)}" stroke-width="${ARM.stroke}" stroke-linecap="round"/>`;
	const arm = (i: 0 | 1, id: string) =>
		`<g id="${id}" transform="${armTransform(i)}" fill="none" stroke="currentColor">` +
		half(-1, `${id}-arc-back`) +
		half(1, `${id}-arc-ahead`) +
		`<circle id="${id}-ring" cx="${ARM.ringDistance}" cy="0" r="${ARM.ringRadius}" stroke-width="${ARM.ringStroke}"/>` +
		`</g>`;
	const pins = CHIP.pins.map((p, i) => `<path id="pin-${i + 1}" d="${p.d}"/>`).join('');
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" width="145" height="144" color="#17181c">` +
		arm(0, 'arm-top-left') +
		arm(1, 'arm-bottom-right') +
		`<g id="chip" fill="currentColor"><path id="chip-body" fill-rule="evenodd" d="${CHIP.body}${CHIP.arrow}"/>${pins}</g>` +
		`</svg>`
	);
}

function round(n: number): number {
	return Math.round(n * 1000) / 1000;
}
