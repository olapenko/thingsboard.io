/**
 * Whether the page being rendered follows the reader's theme, or is locked light.
 *
 * A page opts out with `forceLightTheme` on `BaseLayout`, which sets `bsl` and `bslForceLight` on
 * `Astro.locals`; `starlight/ThemeProvider.astro` then pins light before paint. Every other page —
 * the docs, and the marketing pages that never opted out — runs Starlight's theme script and
 * follows the stored choice or the OS. The same test `ThemeProvider` makes, in one place for the
 * controls that should exist only where switching does something (`ThemeChoice`).
 */
export function followsTheme(locals: unknown): boolean {
	const l = locals as Record<string, unknown>;
	return !(l.bsl === true && l.bslForceLight === true);
}
