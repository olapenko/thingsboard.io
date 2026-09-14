/**
 * Content for the third key visual: mixed payloads becoming one data model.
 *
 * The design pairs this with a second idea — a rule chain raising an alarm and notifying — under
 * one heading. They are two arguments ("any protocol, one model" and "then act on it") and each
 * needs its own picture, so they are being drafted separately; this file holds the first only.
 *
 * The copy below is the section's as written. It covers both halves, so it will need splitting
 * once the second visual exists — noted here rather than silently trimmed.
 */

export const NORMALIZE_COPY = {
	title: 'Turn IoT data into action',
	body: 'Normalize data from any device or protocol. Spot anomalies before they hit production. Filter signals from noise before alerts reach your team. Push data and notifications into your CRM, ERP, or other external app — your data, your workflows.',
	link: { text: 'Process IoT data', href: '/docs/pe/user-guide/rule-engine/' },
	badge: { icon: 'tabler:database-search', color: '#c2703a' },
};

/** The two sides, as the design labels them. */
export const NORMALIZE_STAGES = { in: 'Mixed payloads', out: 'One data model' };

/** What the platform does in the middle. */
export const NORMALIZE_NODE = { label: 'Normalize' };

export type TokenRole = 'key' | 'punct' | 'num' | 'unit';

export interface PayloadToken {
	t: string;
	role: TokenRole;
}

/** How a device chooses to express a temperature. */
export type PayloadFormat = 'fahrenheit' | 'json-comma' | 'hex-register' | 'kelvin';

export interface NormalizeCase {
	/**
	 * The reading in °C, and the ONLY number stored.
	 *
	 * Both the raw payload and the normalised row are derived from it, which is what keeps the
	 * translation honest: there is no second value to fall out of step, so whatever the payload
	 * says, the row beside it is that same reading in °C by construction. An earlier draft stored
	 * the two sides separately and they were only equal because they had been typed that way.
	 */
	celsius: number;
	format: PayloadFormat;
	/** How far the reading may wander from its starting value while animating, in °C. */
	drift: number;
	/** What makes this payload awkward. Carried as a title attribute, not drawn. */
	note: string;
}

/**
 * Four devices, four incompatible ways of saying what they measured — and four different
 * measurements, because they are four devices in four places.
 *
 * The readings deliberately do NOT agree. Identical values on both sides read as a trick, and the
 * claim is not that every sensor reports the same temperature; it is that whatever they report,
 * and however they encode it, what you build on is one key, one unit and one shape.
 *
 * Drifts are small enough that no reading changes its digit count as it moves — a payload that
 * grew from `99.9` to `100.4` would push the rest of its line along, and the chips are a fixed
 * width.
 */
export const NORMALIZE_CASES: NormalizeCase[] = [
	{ celsius: 24.5, format: 'fahrenheit', drift: 1.4, note: 'Fahrenheit' },
	{ celsius: 21.8, format: 'json-comma', drift: 1.4, note: 'JSON, decimal comma' },
	{ celsius: 24, format: 'hex-register', drift: 3, note: 'raw register, whole degrees in hex' },
	{ celsius: 19.3, format: 'kelvin', drift: 1.4, note: 'Kelvin' },
];

/**
 * A register reports whole degrees, so its reading is snapped before anything is derived from it.
 *
 * Both sides go through this, which is the point: the payload shows `0x18` and the model shows
 * `24.0 °C`, and the model is not pretending to a precision the device never sent. Normalising a
 * format is not the same as inventing detail.
 */
function canonical(c: NormalizeCase, celsius: number): number {
	return c.format === 'hex-register' ? Math.round(celsius) : celsius;
}

/**
 * The payload as the device would send it, split into syntax tokens.
 *
 * Tokens rather than one string so the component can colour each part; the numeric token is the
 * only one that changes as the reading moves, so it is the only one the client has to touch.
 */
/*
 * Spaces that belong to a payload are non-breaking, and that is not cosmetic.
 *
 * Each token renders as its own flex item, and a flex item's leading and trailing whitespace is
 * trimmed. That trimming is wanted — the template puts newlines and tabs inside every span, since
 * Prettier breaks the JSX across lines — but it took the real space with it, turning `"t": "21,8"`
 * into `"t":"21,8"` and ` °F` into `°F`.
 *
 * A non-breaking space survives both the collapsing and the trim, so the noise goes and the intent
 * stays. Setting `white-space: pre` instead would have kept the intent AND rendered every tab in
 * the template — it took the chips from 148px to over 3000px wide.
 */
export function payloadTokens(c: NormalizeCase, celsius = c.celsius): PayloadToken[] {
	const v = canonical(c, celsius);
	switch (c.format) {
		case 'fahrenheit':
			return [
				{ t: (v * (9 / 5) + 32).toFixed(1), role: 'num' },
				{ t: '\u00a0°F', role: 'unit' },
			];
		case 'json-comma':
			return [
				{ t: '"t"', role: 'key' },
				{ t: ':\u00a0', role: 'punct' },
				{ t: '"', role: 'punct' },
				// The comma is the awkward part: a decimal separator inside a quoted string.
				{ t: v.toFixed(1).replace('.', ','), role: 'num' },
				{ t: '"', role: 'punct' },
			];
		case 'hex-register':
			return [
				{ t: '0x', role: 'punct' },
				{ t: v.toString(16), role: 'num' },
			];
		case 'kelvin':
			return [
				{ t: 'TEMP_K', role: 'key' },
				{ t: '=', role: 'punct' },
				{ t: (v + 273.15).toFixed(1), role: 'num' },
			];
	}
}

/** The same reading as the model holds it: one key, one unit, one shape. */
export function readingText(c: NormalizeCase, celsius = c.celsius): string {
	return `${canonical(c, celsius).toFixed(1)} °C`;
}

/** The key every payload ends up under, whatever it called itself. */
export const NORMALIZE_KEY = 'temperature';
