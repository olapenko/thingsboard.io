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
	 * The stage's own hue, carried by its icon.
	 *
	 * Read by `PlatformRaised`, where the card is white and the runs are grey, so the icons are the
	 * only colour in the picture and the four stages are told apart by it. `PlatformLoop` ignores it
	 * and draws all four in the platform's indigo. It lives here rather than in the component for the
	 * same reason the connect routes' accents live in `connect-visual.ts`.
	 *
	 * Four hues off the ramp this family already draws from — the same 600/700 steps as the connect
	 * route accents and the two zone colours. Ordered so that no two ADJACENT columns are near
	 * neighbours in hue: indigo, rose, lime, violet puts the only close pair (indigo and violet) at
	 * opposite ends of the row, where they are never read side by side. Deliberately not cyan or
	 * amber, which are spoken for by the equipment and people columns.
	 */
	accent: string;
}

/**
 * What the platform does, as four stages in the order you meet them. The names are verbs because
 * the column beside them is a list of nouns, and the contrast is what says one side is a thing you
 * own and the other is work being done to it.
 */
export const PLATFORM_STAGES: PlatformStage[] = [
	{ icon: 'tabler:plug-connected', name: 'Connect', note: 'Devices, gateways, integrations', accent: '#3d50f5' },
	{ icon: 'tabler:box-model', name: 'Model', note: 'Assets, relations, profiles', accent: '#be185d' },
	// Lime 700, not the 600 the connect visual uses. Measured on the white card, 600 came to 3.09:1
	// against the other three at 5.7–6.0, and a thin icon stroke at 3.09 reads as a lighter weight
	// rather than a different colour. 700 is 4.99 and sits in the same band as its siblings.
	{ icon: 'tabler:binary-tree', name: 'Automate', note: 'Rule chains, calculated fields, alarms', accent: '#4d7c0f' },
	{ icon: 'tabler:chart-dots', name: 'Operate', note: 'Dashboards, SCADA, reports', accent: '#7b3fe4' },
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
