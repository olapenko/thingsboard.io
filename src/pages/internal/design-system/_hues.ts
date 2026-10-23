import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * A hue as a theme paints it, worked out on the server from the stylesheets themselves: a token
 * (`var(--brand-pe)`), a scheme name (`brand`, `onprem`), an SCSS variable (`#{$color-brand}`) or a
 * hex, followed through `_theme.scss` and `_variables.scss` to a six-digit hex. The Logos page
 * compares surfaces' hues with it and reads each product's light and dark values and contrast.
 *
 * Light values are each property's first definition in `_theme.scss` (the light `:root` opens the
 * file); dark values are the `[data-theme='dark']` block's, falling back to the light ones. A value
 * that resolves to nothing it knows comes back as it was.
 */
export type Theme = 'light' | 'dark';

const ROOT = process.cwd();
let tables:
	| { light: Map<string, string>; dark: Map<string, string>; scss: Map<string, string>; schemes: Map<string, string> }
	| undefined;

/** The text of the block opened at `from` (the index of its `{`), braces balanced. */
function blockAt(text: string, from: number) {
	let depth = 0;
	for (let i = from; i < text.length; i++) {
		if (text[i] === '{') depth++;
		else if (text[i] === '}' && --depth === 0) return text.slice(from + 1, i);
	}
	return '';
}

const propsOf = (text: string) => {
	const props = new Map<string, string>();
	for (const m of text.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
		if (!props.has(m[1])) props.set(m[1], m[2].replace(/\s*\/\/.*$/, '').trim());
	}
	return props;
};

function load() {
	if (tables) return tables;
	const theme = readFileSync(join(ROOT, 'src/styles/_theme.scss'), 'utf8');
	const variables = readFileSync(join(ROOT, 'src/styles/_variables.scss'), 'utf8');
	const darkAt = theme.indexOf("[data-theme='dark'] {");
	const scss = new Map<string, string>();
	for (const m of variables.matchAll(/^\$([\w-]+):\s*([^;]+);/gm)) scss.set(m[1], m[2].trim());
	const schemes = new Map<string, string>();
	for (const m of theme.matchAll(/\[data-accent='([\w-]+)'\]\s*\{[^}]*?--accent-fill:\s*([^;]+);/g)) {
		schemes.set(m[1], m[2].trim());
	}
	tables = {
		light: propsOf(theme),
		dark: darkAt < 0 ? new Map() : propsOf(blockAt(theme, theme.indexOf('{', darkAt))),
		scss,
		schemes,
	};
	return tables;
}

const hex6 = (h: string) =>
	h.length === 4 ? `#${[...h.slice(1)].map((c) => c + c).join('')}`.toLowerCase() : h.slice(0, 7).toLowerCase();

function resolve(value: string | undefined, theme: Theme, depth: number): string | undefined {
	if (!value || depth > 8) return value;
	const v = value.replace(/\s*!default\s*$/, '').trim();
	const { light, dark, scss, schemes } = load();
	if (/^#[0-9a-f]{3}$|^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(v)) return hex6(v);
	if (schemes.has(v)) return resolve(schemes.get(v), theme, depth + 1);
	const token = v.match(/^var\(\s*--([\w-]+)\s*(?:,\s*(.+))?\)$/);
	if (token) {
		const own = (theme === 'dark' ? dark.get(token[1]) : undefined) ?? light.get(token[1]) ?? token[2];
		return resolve(own, theme, depth + 1) ?? v;
	}
	const sass = v.match(/^#\{\s*\$([\w-]+)\s*\}$|^\$([\w-]+)$/);
	if (sass) return resolve(scss.get(sass[1] ?? sass[2]), theme, depth + 1) ?? v;
	return v;
}

export const resolveHue = (value: string | undefined, theme: Theme = 'light') => resolve(value, theme, 0);

/** Whether two hues paint the same colour in the light theme. */
export const sameHue = (a?: string, b?: string) => resolveHue(a) === resolveHue(b);

/** WCAG 2 contrast between two six-digit hexes, or undefined if either is not one. */
export function contrast(a?: string, b?: string): number | undefined {
	const lum = (hex?: string) => {
		if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return undefined;
		const [r, g, bl] = [1, 3, 5].map((i) => {
			const c = parseInt(hex.slice(i, i + 2), 16) / 255;
			return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
	};
	const [la, lb] = [lum(a), lum(b)];
	if (la === undefined || lb === undefined) return undefined;
	return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
