/**
 * The Tabler icons the Studio's Add proposes for a new mark, and the ones it does not: what the room's
 * icon picker shows before a search, and the symbols the set's marks already carry. `pnpm lint:logoroom`
 * checks both against Tabler and the records.
 */

/**
 * The picker's first screen, by what a product does: each icon one a new mark could carry and none a
 * mark carries already. Every one has a filled twin in Tabler, so each can be drawn in two tones (the
 * filled shape in the second colour, under the outline in the first).
 */
export const ICON_START: { group: string; icons: string[] }[] = [
	{
		group: 'Data and control',
		icons: ['database', 'layout-dashboard', 'gauge', 'bell', 'adjustments', 'settings', 'stack-2', 'sitemap'],
	},
	{
		group: 'Devices and places',
		icons: ['map-pin', 'current-location', 'radar', 'satellite', 'truck', 'home', 'battery-2', 'bulb'],
	},
	{ group: 'What they measure', icons: ['droplet', 'flame', 'leaf', 'sun', 'world', 'flask'] },
	{ group: 'Shapes', icons: ['hexagon', 'puzzle', 'shield-check', 'key', 'diamond', 'circles'] },
];

/**
 * The icons that would read as a mark's own symbol, by mark: the picker shows them, marked, but does not
 * put them on a new mark, which takes a symbol of its own. A name covers its `-filled` twin too.
 */
export const TAKEN_ICONS: Record<string, string[]> = {
	platform: ['cpu', 'cpu-2', 'bolt'],
	cloud: ['cloud'],
	mobile: ['device-mobile'],
	'iot-gateway': ['building-bridge', 'building-bridge-2'],
	tbmq: ['topology-ring', 'topology-ring-2', 'topology-ring-3'],
	trendz: ['chart-bar', 'chart-histogram'],
	'iot-hub': ['topology-star', 'topology-star-2', 'topology-star-3', 'topology-star-ring'],
	'ai-core': ['sparkles'],
	cli: ['terminal', 'terminal-2', 'prompt'],
	assistant: ['message-chatbot'],
};

/** A Tabler name as the taken list holds it: its outline's, a filled twin under its outline. */
export const iconBase = (name: string) => name.replace(/-filled$/, '');
