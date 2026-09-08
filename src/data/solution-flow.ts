/**
 * The app shown in the launch visual, as a set of interchangeable use cases.
 *
 * Shared so the key visual's brand rotation and the technical comparison row draw on the same
 * definitions — a brand that reads one way in the row and another in the visual would be a bug
 * nobody would think to look for.
 *
 * Metrics and terminology come from the published pages in `src/data/use-cases/`, so this copy can
 * move to a marketing page without being re-checked.
 */

export interface SolutionCase {
	brand: { name: string; accent: string };
	/** Names the reading — "Live temperature", "Fuel level". */
	metricLabel: string;
	/** Appended to the reading verbatim, so it carries its own leading space if it needs one. */
	unit?: string;
	decimals?: number;
	/**
	 * Recent history in the reading's own units. The LAST point is the reading, so the number and
	 * the line beneath it cannot disagree.
	 */
	series: number[];
	alarms?: number;
	/**
	 * The sparkline's y-axis, in the reading's units. Set it wherever the metric has a meaningful
	 * frame — 0-100 for a percentage — rather than letting the line fit its own min and max.
	 *
	 * Fitting the series was the default and it lied: a fuel level drifting 74% -> 68% is a
	 * descending series, so it drew as a line ending at the floor of the box, and a healthy 68%
	 * tank read as nearly empty. An axis is a claim about what "low" means, and only the metric
	 * knows that.
	 */
	domain?: [number, number];
	/**
	 * How far the reading may wander from its starting value while animating, in its own units.
	 * Separate from `domain` on purpose: the axis for a percentage is 0-100, but a tank does not
	 * empty and refill every few seconds.
	 */
	drift?: number;
	/** Where the wording came from. Shown only on the internal comparison page. */
	source: string;
}

export const SOLUTION_CASES: SolutionCase[] = [
	{
		brand: { name: 'Acme Cold Chain', accent: '#3d50f5' },
		metricLabel: 'Live temperature',
		unit: '°',
		decimals: 1,
		// A room drifting up over the window, which is also why anyone would be watching it. Wide
		// enough to have a shape against a 20-30 axis rather than sitting on one line.
		series: [22.1, 22.6, 23.0, 23.4, 23.6, 24.0, 24.3, 24.6, 24.8, 24.6, 24.5],
		alarms: 0,
		// A chilled room's working band, so the reading sits mid-axis rather than at an edge.
		domain: [20, 30],
		drift: 0.8,
		source: 'environment-monitoring',
	},
	{
		brand: { name: 'Northwind Fuel', accent: '#1f8b4d' },
		metricLabel: 'Fuel level',
		unit: '%',
		decimals: 0,
		// A tank draining across the window. The earlier series only spanned 74->68, which is six
		// points of a hundred-point axis — correct, and visually a flat line. History covering a
		// real drawdown gives the axis something to draw without misstating where 68% sits.
		series: [92, 89, 86, 83, 80, 78, 75, 73, 71, 69, 68],
		alarms: 1,
		// A percentage's own frame. 68% then draws at 68% of the box, which is the whole point.
		domain: [0, 100],
		drift: 3,
		source: 'tank-level-monitoring',
	},
	{
		brand: { name: 'Civica Air', accent: '#c2703a' },
		metricLabel: 'PM2.5',
		unit: ' µg/m³',
		decimals: 0,
		series: [8, 11, 9, 14, 12, 18, 15, 21, 17, 19, 18],
		alarms: 0,
		// Anchored at zero because zero is meaningful here — clean air — and topped near the
		// threshold where PM2.5 stops counting as good.
		domain: [0, 35],
		drift: 4,
		source: 'air-quality-monitoring',
	},
];

/**
 * The app's navigation. Identical for every brand on purpose: the navigation is the platform's,
 * not the customer's, so it is the one thing that should NOT vary as the brand rotates.
 *
 * Home first and current, the capabilities that are screens a user opens, then the account. Rule
 * chains is absent for the same reason the digital twin is: it is how the solution behaves, not
 * somewhere a user goes.
 */
export const SOLUTION_RAIL = [
	{ icon: 'tabler:home', active: true },
	{ icon: 'tabler:bell-ringing' },
	{ icon: 'tabler:layout-dashboard' },
	{ icon: 'tabler:user' },
];
