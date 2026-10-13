import tabler from '@iconify-json/tabler/icons.json';

/**
 * A Tabler icon's markup, for text the Trust Center keeps as strings (a fact table's cell, a topic
 * row's lines), where astro-icon's component cannot go. Decorative: hidden from screen readers.
 */
export function tablerSvg(name: string, className: string, size = 18): string {
	const body = tabler.icons[name.replace('tabler:', '') as keyof typeof tabler.icons]?.body;
	if (!body) throw new Error(`tabler-svg: no Tabler icon "${name}".`);
	return `<svg class="${className}" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${body}</svg>`;
}
