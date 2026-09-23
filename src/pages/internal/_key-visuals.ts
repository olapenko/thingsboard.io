/**
 * The key visuals, one per link in the sandbox strip. Copy is the design's, verbatim.
 *
 * Its own module because the sandbox page and every one of its panels needs it, and a panel that
 * had to reach back into the page for it would be a panel that cannot be moved or deleted on its
 * own. Addressed by id through `kv()`, never by array position: the panels used to say
 * `KEY_VISUALS[6]`, which meant inserting a visual silently retitled four others. That is also what
 * makes the order below free to change — this array decides the strip and nothing else.
 *
 * THE ORDER IS THE PAGE'S ORDER. Platform first: it opens the homepage as a centred section
 * above the rows. Then the five rows in the order
 * `index.astro` runs them — connect, solution, twin, normalize, scale — so walking the strip walks
 * the page. `ai` sits between twin and normalize because that is where `AiSection` runs: it is a
 * full-bleed section rather than a row, but it is on the page there, and the strip is the page's
 * order. Everything after `scale` is not on the homepage at all, and sits at the end for that
 * reason rather than by age: gateway, deploy and whitelabel are drawn and waiting for a section,
 * and cli is a token-wiring check with no copy of its own.
 */
import { PLATFORM_COPY } from '@data/platform-visual';
import { SOLUTION_COPY } from '@data/solution-flow';
import { DIGITAL_TWIN_COPY } from '@data/digital-twin-visual';
import { NORMALIZE_COPY } from '@data/normalize-visual';
import { CONNECT_COPY } from '@data/connect-visual';
import { SCALE_COPY } from '@data/scale-visual';
import { DEPLOY_COPY } from '@data/deploy-visual';
import { WHITELABEL_COPY } from '@data/whitelabel-visual';
import { AI_COPY } from '@data/ai-visual';

export interface KeyVisual {
	id: string;
	/** The tab's label. Short: ten of them share one line. */
	label: string;
	title?: string;
	body?: string;
	link?: { text: string; href: string };
	/**
	 * The section's mark, as `FeatureBlockSection` renders it. Lives with each visual's COPY, so the
	 * homepage and the sandbox take the same one from the same place; this only carries it across.
	 */
	badge?: { icon: string; color: string };
	/**
	 * The section's anchor on the homepage, when it has one — `/#<home>`. Having one IS being on the
	 * page: the hub groups by it, numbers by it and links by it, and the strip draws its seam after
	 * the last visual that has one. Put a visual on the homepage and give it an `id` there; set this,
	 * and all three follow.
	 */
	home?: string;
	/**
	 * A component check rather than a section — it has no copy and is not headed for a row. The hub
	 * lists these apart from the sections waiting for a place on the page.
	 */
	check?: boolean;
}

export const KEY_VISUALS: KeyVisual[] = [
	{
		id: 'platform',
		home: 'intro',
		label: 'Platform',
		title: PLATFORM_COPY.title,
		body: PLATFORM_COPY.body,
		link: PLATFORM_COPY.link,
		badge: PLATFORM_COPY.badge,
	},
	{
		id: 'connect',
		home: 'connect',
		label: 'Connect devices',
		title: CONNECT_COPY.title,
		body: CONNECT_COPY.body,
		link: CONNECT_COPY.link,
		badge: CONNECT_COPY.badge,
	},
	{
		id: 'solution',
		home: 'solution',
		label: 'Device to end-user',
		title: SOLUTION_COPY.title,
		body: SOLUTION_COPY.body,
		link: SOLUTION_COPY.link,
		badge: SOLUTION_COPY.badge,
	},
	{
		id: 'twin',
		home: 'twin',
		label: 'Digital twin',
		...DIGITAL_TWIN_COPY,
	},
	{
		// A section, not a row: its copy has no link, and its badge is drawn by the section's own
		// header rather than by a row's.
		id: 'ai',
		home: 'ai',
		label: 'AI',
		title: AI_COPY.title,
		body: AI_COPY.body,
		badge: AI_COPY.badge,
	},
	{
		id: 'normalize',
		home: 'normalize',
		label: 'Normalize',
		title: NORMALIZE_COPY.title,
		body: NORMALIZE_COPY.body,
		link: NORMALIZE_COPY.link,
		badge: NORMALIZE_COPY.badge,
	},
	{
		id: 'scale',
		home: 'scale',
		label: 'Scale',
		title: SCALE_COPY.title,
		body: SCALE_COPY.body,
		link: SCALE_COPY.link,
		badge: SCALE_COPY.badge,
	},
	{
		// A SECTION of cards rather than a drawing: the deployment pair on the dark band. Its copy
		// is restated from `index.astro`'s own SectionHeader call, where it lives inline — keep the
		// two in step by hand until the section grows a data file.
		id: 'products',
		home: 'products',
		label: 'Products',
		title: 'Products',
		body: 'The same platform and the same features either way — what changes is who runs it. We host, scale and upgrade it for you, or you deploy it inside your own network.',
		badge: { icon: 'tabler:cloud', color: '#3d50f5' },
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
		// `#7b3fe4` twice over: the accent the Gateway carries in `homeEcosystem`, and the only strong
		// colour in `GatewayDiagram` itself.
		badge: { icon: 'tabler:router', color: '#7b3fe4' },
	},
	{
		id: 'deploy',
		label: 'Deploy anywhere',
		title: DEPLOY_COPY.title,
		body: DEPLOY_COPY.body,
		link: DEPLOY_COPY.link,
		badge: DEPLOY_COPY.badge,
	},
	{
		id: 'whitelabel',
		label: 'White-labeling',
		title: WHITELABEL_COPY.title,
		body: WHITELABEL_COPY.body,
		link: WHITELABEL_COPY.link,
		badge: WHITELABEL_COPY.badge,
	},
	{
		// The product pages' choice cards — Cloud's Public/Private pair and On-premises' licence
		// pair — on their own dark ground. A component check: the cards ship on those two pages,
		// and this is where their treatments get judged before touching them there.
		id: 'choice',
		label: 'Choice cards',
		check: true,
		badge: { icon: 'tabler:layout-columns', color: '#5b616e' },
	},
	{
		id: 'cli',
		label: 'CLI',
		check: true,
	},
];

/** The visuals that are on the homepage, in page order. */
export const ON_HOME = KEY_VISUALS.filter((v) => v.home);

/** The entry for `id`. Throws at build time rather than rendering a row with no copy in it. */
export function kv(id: string): KeyVisual {
	const found = KEY_VISUALS.find((v) => v.id === id);
	if (!found) throw new Error(`sections: no key visual with id "${id}"`);
	return found;
}
