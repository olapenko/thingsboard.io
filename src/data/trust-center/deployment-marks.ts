import tabler from '@iconify-json/tabler/icons.json';

/**
 * The three deployment models' icons, the product pages' own: Cloud's `cloud` / `cloud-lock` pair
 * (one glyph, the lock the only difference) and on-premises' server. They mark the comparison
 * tables' column heads and every line of the draft's text that a deployment's name opens
 * ("<b>Private Cloud:</b> …"), where they replace the bullet and hang in the margin, so the names
 * line up and the words after them start on one edge.
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
	return `<svg class="tc-lines__icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">${body}</svg>`;
}

const LABELLED = /^\s*<b>([^<]+):<\/b>\s*/;

/** One line of a list: its icon when a deployment's name opens it. */
function line(html: string): string {
	const label = html.match(LABELLED)?.[1];
	const icon = label ? BY_LABEL[label] : undefined;
	return icon ? `<li class="tc-lines__item">${glyph(icon)}${html.trim()}</li>` : `<li>${html.trim()}</li>`;
}

/** Lines as a list, each deployment's line marked. */
export function deploymentList(lines: string[]): string {
	return `<ul class="tc-lines">${lines.map(line).join('')}</ul>`;
}

/**
 * The draft's `<br>`-separated text as such a list, when its lines open on a label ("<b>MQTT:</b>",
 * "<b>Private Cloud:</b>"); text with no labelled line comes back as it was.
 */
export function labelledLines(html: string): string {
	const lines = html.split(/<br\s*\/?>/);
	return lines.length > 1 && lines.some((l) => LABELLED.test(l)) ? deploymentList(lines) : html;
}
