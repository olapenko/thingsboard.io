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
	brand: {
		name: string;
		accent: string;
		/** The customer's own domain, shown in the browser bar. What says "white-labelled" fastest. */
		host: string;
		/** Stands in for the customer's logo. A Tabler icon name. */
		icon: string;
	};
	/** Names the reading — "Live temperature", "Fuel level". */
	metricLabel: string;
	/** Appended to the reading verbatim, so it carries its own leading space if it needs one. */
	unit?: string;
	decimals?: number;
	/**
	 * The metric's history as a closed LOOP: the last point leads back into the first without a
	 * seam. The sparkline shows a window of `SPARK_WINDOW` consecutive points and slides along the
	 * loop one point per reading, so the curve keeps its designed shape forever instead of
	 * flattening into noise. The reading is always the newest point in the window, so the number
	 * and the line beneath it cannot disagree.
	 *
	 * Precalculated here, deterministically, so every page load and every frame shows the same
	 * telemetry — nothing is invented at runtime.
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
	/** Where the wording came from. Shown only on the internal comparison page. */
	source: string;
}

/** How many points of history the sparkline shows at once. */
export const SPARK_WINDOW = 32;

const TAU = Math.PI * 2;

/**
 * Samples `f` across one period so the series joins back onto its own start. Every term below
 * uses a whole number of cycles per loop for the same reason.
 */
const loop = (n: number, f: (t: number) => number): number[] =>
	Array.from({ length: n }, (_, i) => Math.round(f(i / n) * 100) / 100);

export const SOLUTION_CASES: SolutionCase[] = [
	{
		brand: { name: 'Acme Cold Chain', accent: '#3d50f5', host: 'acme.com', icon: 'tabler:snowflake' },
		metricLabel: 'Temperature',
		unit: '°',
		decimals: 1,
		// A chilled room breathing inside the 2-8°C band a cold chain has to hold: one slow swell
		// across the loop with two smaller cycles riding it, so any window shows a curve rather than
		// a line. Stays inside roughly 3-5.5 against a 0-10 axis.
		series: loop(
			64,
			(t) => 4.2 + 0.9 * Math.sin(TAU * t) + 0.35 * Math.sin(TAU * 3 * t + 1.2) + 0.12 * Math.sin(TAU * 7 * t + 0.4)
		),
		alarms: 0,
		// Zero to ten: the room's working band sits mid-axis, and the bottom of the box is freezing
		// — which is the line a cold chain must not cross either way.
		domain: [0, 10],
		source: 'environment-monitoring',
	},
	{
		brand: { name: 'Northwind Fuel', accent: '#1f8b4d', host: 'tanks.nw.com', icon: 'tabler:gas-station' },
		metricLabel: 'Fuel level',
		unit: '%',
		decimals: 0,
		// A tank draining in steps — dispensing events, not a smooth leak — from 88% down to 58%
		// over most of the loop, then a refill that climbs back in the last eighth. The cliff is
		// what makes this curve unmistakably a tank and not a thermometer.
		series: loop(64, (t) => {
			const drain = 0.86;
			if (t < drain) {
				const p = t / drain;
				// Mostly linear with a stepped component, so the descent reads as a staircase.
				return 88 - 30 * (0.7 * p + (0.3 * Math.floor(p * 8)) / 8);
			}
			return 58 + 30 * ((t - drain) / (1 - drain));
		}),
		alarms: 1,
		// A percentage's own frame. 68% then draws at 68% of the box, which is the whole point.
		domain: [0, 100],
		source: 'tank-level-monitoring',
	},
	{
		brand: { name: 'Civica Air', accent: '#c2703a', host: 'air.civica.org', icon: 'tabler:wind' },
		metricLabel: 'PM2.5',
		unit: ' µg/m³',
		decimals: 0,
		// Restless: a jittery base with three sharp spikes per loop, the shape of traffic and wind.
		// Stays roughly 5-25 against a 0-35 axis, so the spikes approach but never cross the line
		// where air stops counting as good.
		series: loop(
			64,
			(t) =>
				12 +
				3 * Math.sin(TAU * 2 * t) +
				2.2 * Math.sin(TAU * 5 * t + 2) +
				1.5 * Math.sin(TAU * 11 * t + 0.7) +
				8 * Math.pow(Math.max(0, Math.sin(TAU * 3 * t + 0.9)), 8)
		),
		alarms: 0,
		// Anchored at zero because zero is meaningful here — clean air — and topped near the
		// threshold where PM2.5 stops counting as good.
		domain: [0, 35],
		source: 'air-quality-monitoring',
	},
];

/**
 * The app's navigation. Identical for every brand on purpose: the navigation is the platform's,
 * not the customer's, so it is the one thing that should NOT vary as the brand rotates.
 *
 * Dashboards first and current — the home of an app like this is its dashboard — then alarms,
 * then the entity list, then the account. Rule chains is absent for the same reason the digital
 * twin is: it is how the solution behaves, not somewhere a user goes.
 */
export const SOLUTION_RAIL = [
	{ icon: 'tabler:layout-dashboard', active: true },
	{ icon: 'tabler:bell-ringing' },
	{ icon: 'tabler:list' },
	{ icon: 'tabler:user' },
];
