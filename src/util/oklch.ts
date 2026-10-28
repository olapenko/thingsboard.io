/**
 * OKLCH (Björn Ottosson's Oklab, in lightness, chroma and hue) for the Logo Room's colours: a space in
 * which a colour can be made lighter without turning into another one. The room derives a tone's dark
 * value here, as the set's own dark values were picked: the same hue, lifted to a lightness of about
 * 0.78 with its chroma kept, holding 4.5:1 on the dark grounds. Contrast itself is WCAG's, not OKLCH's.
 */

export type Oklch = [l: number, c: number, h: number];

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

export function oklchOf(hex: string): Oklch {
	const [r, g, b] = channels(hex).map(toLinear);
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	return [L, Math.hypot(a, bb), ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360];
}

/** Linear sRGB of an OKLCH colour; out of gamut where a channel falls outside 0 to 1. */
function linearOf([L, C, h]: Oklch) {
	const a = C * Math.cos((h * Math.PI) / 180);
	const b = C * Math.sin((h * Math.PI) / 180);
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	];
}

/** An OKLCH colour as a hex, its chroma taken down until the screen can show it. */
export function hexOf([L, C, h]: Oklch): string {
	let c = C;
	let rgb = linearOf([L, c, h]);
	while (c > 0 && rgb.some((v) => v < -0.0005 || v > 1.0005)) {
		c = Math.max(0, c - 0.002);
		rgb = linearOf([L, c, h]);
	}
	return `#${rgb
		.map((v) =>
			Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, v))))) * 255)
				.toString(16)
				.padStart(2, '0')
		)
		.join('')}`;
}

/** WCAG 2 contrast between two hexes. */
export function contrastOf(a: string, b: string) {
	const lum = (hex: string) => {
		const [r, g, bl] = channels(hex).map(toLinear);
		return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
	};
	const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
	return (x + 0.05) / (y + 0.05);
}

/** How far apart two colours look: the distance in Oklab, scaled to read as CIE ΔE does (×100). */
export function deltaOk(a: string, b: string) {
	const lab = (hex: string) => {
		const [L, C, h] = oklchOf(hex);
		return [L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)];
	};
	const [p, q] = [lab(a), lab(b)];
	return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) * 100;
}

/** The dark grounds a dark value sits on: the night band and the Dark tile. */
export const DARK_GROUNDS = ['#0b0d1f', '#17181c'];
/** The lightness a dark value lifts to, the set's own (its picked dark values sit at 0.71 to 0.84). */
const DARK_L = 0.78;

/**
 * Warm hues turn toward yellow on dark, as an amber's lighter shades do (the set's IoT Hub: 49° to 84°):
 * fully at 50°, not at all by 30° or 70°.
 */
const warmShift = (h: number) => {
	const w = Math.max(0, 1 - Math.abs(h - 50) / 20);
	return h + (85 - h) * w;
};

/** Lifted until it holds 4.5:1 on every dark ground, in steps of lightness. */
function holding([L, C, h]: Oklch) {
	let l = L;
	let hex = hexOf([l, C, h]);
	while (l < 0.99 && DARK_GROUNDS.some((g) => contrastOf(hex, g) < 4.5)) {
		l += 0.01;
		hex = hexOf([l, C, h]);
	}
	return hex;
}

/**
 * The chroma a dark value takes: halfway to 0.16, as the set's picked ones are (a muted colour gains
 * some on dark, a vivid one gives some up). Fitted to the ten pairs, within ΔE 8 of each.
 */
const DARK_C = 0.16;

/** A colour's dark value: its hue (warm ones toward yellow), lifted to the set's lightness and chroma. */
export function darkFor(light: string) {
	const [L, C, h] = oklchOf(light);
	return holding([Math.max(L, DARK_L), C + (DARK_C - C) * 0.5, warmShift(h)]);
}

/**
 * A second tone's dark value. On light the second tone is a fill under the colour's line, some way
 * lighter; on dark the line lifts, so the fill sits that far under it instead, and the line stays the
 * brightest part. A second tone darker than its colour mirrors the other way.
 */
export function secondDarkFor(second: string, first: string, firstDark: string) {
	const [Ls, Cs, hs] = oklchOf(second);
	const [Lf] = oklchOf(first);
	const [Lfd] = oklchOf(firstDark);
	const gap = Ls - Lf;
	const l = Math.min(0.95, Math.max(0.2, Lfd - gap));
	return hexOf([l, Cs, warmShift(hs)]);
}

/** A second tone to start from: the colour's hue, light, at half its chroma (a pale fill under its line). */
export function secondFor(first: string) {
	const [, C, h] = oklchOf(first);
	return hexOf([0.87, C * 0.5, h]);
}
