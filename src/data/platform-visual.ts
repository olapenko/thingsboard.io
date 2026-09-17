/**
 * Content for the platform overview: your equipment on one side, your people on the other, and
 * what runs between them in the middle.
 *
 * Adapted from a standalone HTML sandbox that carried two arrow layouts — arrows inline in the
 * gutters, and arrows routed through bands above and below the platform ("in & out"). Only the
 * second one is here. The inline version put all four runs on the same horizontal line as the
 * cards, which made the two directions read as one two-way pipe; separating them into an upper
 * band and a lower band is what turns the picture into a loop, and the loop is the argument.
 *
 * Four runs, clockwise: telemetry comes in from the equipment, views and alerts go out to the
 * people, actions come back in from the people, commands and updates go back out to the equipment.
 * Every run has a named source and a named destination, so the colour of a line is never a
 * decoration — it is the zone the line starts in.
 *
 * The icons are Tabler names, resolved by `astro-icon` at build time. The sandbox they came from
 * shipped a 40 KB inlined icon map and a picker for choosing between a dozen candidates per slot;
 * the picking is done, so what survives is the chosen name.
 */

import { CONNECT_COPY } from '@data/connect-visual';
import { DIGITAL_TWIN_COPY } from '@data/digital-twin-visual';
import { NORMALIZE_COPY } from '@data/normalize-visual';
import { SOLUTION_COPY } from '@data/solution-flow';

/** The row's copy. One claim, and the diagram is the evidence for it. */
export const PLATFORM_COPY = {
	title: 'Your equipment, your people, one platform between them',
	body: 'Nothing to integrate between the steps, and nothing to buy as an add-on.',
	link: { text: 'See what the platform covers', href: '/products/thingsboard-pe/' },
};

/**
 * The middle column's lockup. Two fields rather than one string because the mark sits beside them
 * and the brand is set bolder than the product — "ThingsBoard Platform" as one string would have to
 * be split back apart in the component to do that.
 */
export const PLATFORM_CORE = { brand: 'ThingsBoard', product: 'Platform' };

export interface ZoneItem {
	icon: string;
	/** Two or three words. The note underneath carries the specifics. */
	name: string;
	note: string;
}

export interface Zone {
	/** Keys the run colours as well as the card, so a line and its origin cannot disagree. */
	id: 'equipment' | 'people';
	icon: string;
	title: string;
	items: ZoneItem[];
}

/**
 * The two outer zones. Three items each, deliberately: a fourth in either column makes that column
 * taller than the platform and the whole composition starts hanging off one side.
 */
export const PLATFORM_ZONES: Zone[] = [
	{
		id: 'equipment',
		icon: 'tabler:cpu',
		title: 'Your equipment and data',
		items: [
			{ icon: 'tabler:gauge', name: 'Machines and sensors', note: 'Telemetry and device state' },
			{ icon: 'tabler:server', name: 'Gateways and platforms', note: 'Existing IoT data sources' },
			{ icon: 'tabler:database', name: 'Business systems', note: 'Schedules, tariffs, context' },
		],
	},
	{
		id: 'people',
		icon: 'tabler:users-group',
		title: 'Your people and operations',
		items: [
			{ icon: 'tabler:urgent', name: 'Operators', note: 'Know what needs attention' },
			{ icon: 'tabler:tool', name: 'Service teams', note: 'Act with equipment context' },
			{ icon: 'tabler:chart-line', name: 'Business owners', note: 'Track operational KPIs' },
		],
	},
];

export interface PlatformStage {
	icon: string;
	name: string;
	note: string;
	/**
	 * The stage's own hue, carried by its icon. Comes from the section's badge — see below.
	 *
	 * Read by `PlatformRaised`, where the card is white and the runs are grey, so the icons are the
	 * only colour in the picture. `PlatformLoop` ignores it and draws all four in the platform's
	 * indigo.
	 */
	accent: string;
}

/**
 * What the platform does, as four stages in the order you meet them. The names are verbs because
 * the column beside them is a list of nouns, and the contrast is what says one side is a thing you
 * own and the other is work being done to it.
 *
 * EACH STAGE IS CODED AS A SECTION OF THE PAGE. The colour comes from that section's badge, by
 * reference rather than by copy, so the two cannot drift apart:
 *
 *   Connect   -> the connect section        #0e7490
 *   Model     -> the digital twin section   #7b3fe4
 *   Automate  -> the normalize section      #c2703a
 *   Operate   -> the solution section       #3d50f5
 *
 * That makes the platform column a legend for the rest of the page: whoever reads the diagram meets
 * each of these four again further down, in the same colour.
 *
 * THE ICONS ARE THE STAGE'S OWN, not the section's badge glyph, and are the four the original
 * drawing chose. A section badge has to stand for a whole section in one mark; a stage here sits
 * above a verb and a line of detail and only has to stand for that. Where the two agree they are
 * the same glyph — Connect takes `plug-connected` either way — and where they do not, the stage
 * wins: `binary-tree` reads as branching logic beside "Rule chains", which is Automate's job, and
 * the twin's own box is what `DigitalTwin.astro` draws its unit with, which is Model's.
 */
export const PLATFORM_STAGES: PlatformStage[] = [
	{
		name: 'Connect',
		note: 'Devices, gateways, integrations',
		icon: 'tabler:plug-connected',
		accent: CONNECT_COPY.badge.color,
	},
	{
		name: 'Model',
		note: 'Assets, relations, profiles',
		// The twin's own box — the glyph `DigitalTwin.astro` draws its unit with.
		icon: 'tabler:box-model',
		accent: DIGITAL_TWIN_COPY.badge.color,
	},
	{
		name: 'Automate',
		note: 'Rule chains, calculated fields, alarms',
		icon: 'tabler:binary-tree',
		accent: NORMALIZE_COPY.badge.color,
	},
	{
		name: 'Operate',
		note: 'Dashboards, SCADA, reports',
		icon: 'tabler:chart-dots',
		accent: SOLUTION_COPY.badge.color,
	},
];

/**
 * Underneath the four stages, and not one of them: these are not a step you take, they are true of
 * every step. Hence the rule above the row rather than a fifth column.
 */
export const PLATFORM_FOUNDATIONS: { icon: string; label: string }[] = [
	{ icon: 'tabler:shield-check', label: 'Identity and access' },
	{ icon: 'tabler:database', label: 'Data and APIs' },
	{ icon: 'tabler:arrows-maximize', label: 'Scalable architecture' },
];

export interface PlatformRun {
	id: 'telemetry' | 'views' | 'actions' | 'commands';
	/** The zone the line leaves, which is also the zone whose colour it takes. */
	from: 'equipment' | 'platform' | 'people';
	to: 'equipment' | 'platform' | 'people';
	label: string;
}

/**
 * The four runs, in the order they go round: in at the top left, out at the top right, in at the
 * bottom right, out at the bottom left. Two words each at most — a run that needed a sentence
 * would be an argument the picture is not making.
 */
export const PLATFORM_RUNS: PlatformRun[] = [
	{ id: 'telemetry', from: 'equipment', to: 'platform', label: 'Telemetry' },
	{ id: 'views', from: 'platform', to: 'people', label: 'Views and alerts' },
	{ id: 'actions', from: 'people', to: 'platform', label: 'Actions' },
	// "Commands", not "Commands and updates". The longer form was the only label of the four that
	// needed two lines, and the "and updates" half was doing the least work in the picture — firmware
	// going down the same wire is a detail for the copy beside the visual, not for the wire.
	{ id: 'commands', from: 'platform', to: 'equipment', label: 'Commands' },
];
