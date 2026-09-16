/**
 * The key visuals, one per tab of the launch-visuals sandbox. Copy is the design's, verbatim.
 *
 * Its own module because the sandbox page and every one of its panels needs it, and a panel that
 * had to reach back into the page for it would be a panel that cannot be moved or deleted on its
 * own. Addressed by id through `kv()`, never by array position: the panels used to say
 * `KEY_VISUALS[6]`, which meant inserting a visual silently retitled four others.
 */
import { SOLUTION_COPY } from '@data/solution-flow';
import { DIGITAL_TWIN_COPY } from '@data/digital-twin-visual';
import { NORMALIZE_COPY } from '@data/normalize-visual';
import { CONNECT_COPY } from '@data/connect-visual';
import { SCALE_COPY } from '@data/scale-visual';
import { DEPLOY_COPY } from '@data/deploy-visual';
import { WHITELABEL_COPY } from '@data/whitelabel-visual';

export interface KeyVisual {
	id: string;
	/** The tab's label. Short: ten of them share one line. */
	label: string;
	title?: string;
	body?: string;
	/** The body with markup, when the row's copy carries part of the visual's meaning. */
	bodyHtml?: string;
	link?: { text: string; href: string };
}

export const KEY_VISUALS: KeyVisual[] = [
	{
		id: 'cli',
		label: 'CLI',
	},
	{
		id: 'solution',
		label: 'Device to end-user',
		title: SOLUTION_COPY.title,
		body: SOLUTION_COPY.body,
		link: SOLUTION_COPY.link,
	},
	{
		id: 'twin',
		label: 'Digital twin',
		...DIGITAL_TWIN_COPY,
	},
	{
		id: 'normalize',
		label: 'Normalize',
		title: NORMALIZE_COPY.title,
		body: NORMALIZE_COPY.body,
		link: NORMALIZE_COPY.link,
	},
	{
		id: 'gateway',
		label: 'IoT Gateway',
		// The Gateway's own words, from its `homeEcosystem` entry — description, action label and
		// href verbatim. Only the headline is changed, from the description's opening sentence
		// ("Brings legacy equipment online.") into the imperative the other three headlines use.
		title: 'Bring legacy equipment online',
		body: 'Modbus, OPC UA, BACnet, SNMP, KNX and 25+ industrial protocols, translated to MQTT or HTTP. Open-source, runs on any hardware.',
		link: { text: 'See supported protocols', href: '/docs/iot-gateway/' },
	},
	{
		id: 'connect',
		label: 'Connect devices',
		title: CONNECT_COPY.title,
		body: CONNECT_COPY.body,
		link: CONNECT_COPY.link,
	},
	{
		id: 'scale',
		label: 'Scale',
		title: SCALE_COPY.title,
		body: SCALE_COPY.body,
		link: SCALE_COPY.link,
	},
	{
		id: 'deploy',
		label: 'Deploy anywhere',
		title: DEPLOY_COPY.title,
		body: DEPLOY_COPY.body,
		link: DEPLOY_COPY.link,
	},
	{
		id: 'whitelabel',
		label: 'White-labeling',
		title: WHITELABEL_COPY.title,
		body: WHITELABEL_COPY.body,
		link: WHITELABEL_COPY.link,
	},
];

/** The entry for `id`. Throws at build time rather than rendering a row with no copy in it. */
export function kv(id: string): KeyVisual {
	const found = KEY_VISUALS.find((v) => v.id === id);
	if (!found) throw new Error(`launch-visuals: no key visual with id "${id}"`);
	return found;
}
