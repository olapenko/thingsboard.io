import tabler from '@iconify-json/tabler/icons.json';

/**
 * The three deployment models' icons, the product pages' own: Cloud's `cloud` / `cloud-lock` pair
 * (one glyph, the lock the only difference) and on-premises' server. They mark the comparison
 * tables' column heads and every line of the draft's text that a deployment's name opens
 * ("<b>Private Cloud:</b> …"), where they replace the bullet in an indent of their own: the text
 * starts after it, on every line of the list, marked or not, so the names line up.
 */
export const DEPLOYMENT_ICON = {
	cloud: 'tabler:cloud',
	private: 'tabler:cloud-lock',
	onprem: 'tabler:server',
} as const;

/** The names the draft's lines open on. "Every deployment" has no mark: it is all three. */
const BY_LABEL: Record<string, string> = {
	'ThingsBoard Cloud': DEPLOYMENT_ICON.cloud,
	'Private Cloud': DEPLOYMENT_ICON.private,
	'On-premises': DEPLOYMENT_ICON.onprem,
	'ThingsBoard Cloud and Private Cloud': DEPLOYMENT_ICON.cloud,
};

/** The icon's markup, for text that is a string (a table cell's, a row's): astro-icon is not there. */
function glyph(name: string): string {
	const body = tabler.icons[name.replace('tabler:', '') as keyof typeof tabler.icons]?.body;
	if (!body) throw new Error(`deployment-marks: no Tabler icon "${name}".`);
	return `<svg class="tc-lines__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">${body}</svg>`;
}

const LABELLED = /^\s*<b>([^<]+):<\/b>\s*/;

/** The icon of the deployment whose name opens a line, if one does. */
function iconOf(html: string): string | undefined {
	const label = html.match(LABELLED)?.[1];
	return label ? BY_LABEL[label] : undefined;
}

/**
 * Lines as a list, each deployment's line marked. When any line is, every line takes the icons'
 * indent (`tc-lines--marked`), so "Every deployment" lines up with the names beside it.
 */
export function deploymentList(lines: string[]): string {
	const icons = lines.map(iconOf);
	const marked = icons.some(Boolean);
	const items = lines.map((html, i) => `<li>${icons[i] ? glyph(icons[i]) : ''}${html.trim()}</li>`);
	return `<ul class="${marked ? 'tc-lines tc-lines--marked' : 'tc-lines'}">${items.join('')}</ul>`;
}

/**
 * The draft's `<br>`-separated text as such a list, when its lines open on a label ("<b>MQTT:</b>",
 * "<b>Private Cloud:</b>"); text with no labelled line comes back as it was.
 */
export function labelledLines(html: string): string {
	const lines = html.split(/<br\s*\/?>/);
	return lines.length > 1 && lines.some((l) => LABELLED.test(l)) ? deploymentList(lines) : html;
}
