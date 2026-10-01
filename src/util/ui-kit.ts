/**
 * The small rules every `ui/` component shares, so each states them once: which accents are
 * schemes, how a one-off colour is passed, and how a size per breakpoint becomes classes.
 */

/** The accent schemes `_theme.scss` defines for `data-accent`. */
export const SCHEMES = ['brand', 'onprem', 'neutral'] as const;
export type Scheme = (typeof SCHEMES)[number];

/** A scheme by name, or any CSS colour for a one-off (a product's hue). */
export type Accent = Scheme | (string & {});

const isScheme = (accent: string): accent is Scheme => (SCHEMES as readonly string[]).includes(accent);

/**
 * The attributes that give a component its accent: `data-accent` for a scheme, which everything
 * inside then inherits; for a one-off colour, the component's own three custom properties
 * (`--<prefix>-fill`, `-ink`, `-light`), which reach only that component.
 */
export function accentAttrs(accent: Accent | undefined, prefix: string): { 'data-accent'?: Scheme; style?: string } {
	if (!accent) return {};
	if (isScheme(accent)) return { 'data-accent': accent };
	return { style: `--${prefix}-fill: ${accent}; --${prefix}-ink: ${accent}; --${prefix}-light: ${accent}` };
}

/** A value, or the same value per breakpoint: `{ base: 'md', lg: 'xl' }`. Steps, never fluid. */
export type Responsive<T> = T | { base: T; sm?: T; md?: T; lg?: T };

/** `ui-btn--md ui-btn--lg-up-xl` from `{ base: 'md', lg: 'xl' }`. */
export function sizeClasses<T extends string | number>(block: string, size: Responsive<T>): string[] {
	const steps = typeof size === 'object' ? size : { base: size };
	return Object.entries(steps)
		.filter(([, value]) => value !== undefined)
		.map(([bp, value]) => (bp === 'base' ? `${block}--${value}` : `${block}--${bp}-up-${value}`));
}

/** A link that leaves the site: a new tab, without handing it this page. */
export const EXTERNAL_ATTRS = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** What a screen reader hears after such a link's label (in `<span class="ui-sr">`). */
export const EXTERNAL_NOTE = ' (opens in a new tab)';
