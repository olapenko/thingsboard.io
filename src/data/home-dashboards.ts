/**
 * The use cases section's heading, its lede and its way out to the rest — for `UseCasesSection` and
 * the section's sandbox tile, so the two cannot word it differently.
 */
export const DASHBOARDS_COPY = {
	title: 'Build real-time IoT dashboards',
	subtitle:
		'Assemble the view your users need from 600+ widgets, and control devices from the same screen. No front-end code required.',
	link: { text: 'Browse all use cases', href: '/use-cases/' },
};

/**
 * The use cases section's badge ("Build real-time IoT dashboards").
 *
 * BERRY, #b3268f, in the orders that colour each section by its badge (`hues: 'section'`). It was
 * #006bc7, the platform loop's own blue — two sections on one hue — and under the section colours it
 * sat straight below the indigo Solution row, a second blue band in a row. Every other hue on the
 * page was taken (teal, violet, orange, indigo, the loop's blue, green) and red means an alarm, so
 * this is the one gap on the wheel: 339° against the twin's violet at 310° and the alarm red at 32°,
 * at the badge set's lightness (L* 42.7 against the set's 42–47) and 5.85:1 with the white glyph.
 * It also breaks the run of cool grounds from Solution through the trust band into Products.
 *
 * The handoff keeps the blue it shipped with (`DASHBOARDS_BADGE_HANDOFF`), so that order is still
 * the page it was.
 */
export const DASHBOARDS_BADGE = { icon: 'tabler:layout-dashboard', color: '#b3268f' };

export const DASHBOARDS_BADGE_HANDOFF = { icon: 'tabler:layout-dashboard', color: '#006bc7' };

/**
 * The glow under the board in a colour of the case it is showing, rather than the section's berry
 * throughout, cross-fading as the case changes — so the light on the band reads as coming off the
 * board. Keyed by each case's `href`.
 *
 * `shot` IS PROMOTED (2026-09-29): the orders that colour each section (A, B) take it by default, see
 * `UseCasesSection`'s `tones`. `page` stays a candidate on the dashboards sandbox.
 *
 * `page` — the homepage's own badge colours, the nearest to each board: nothing new enters the
 * palette, and the section still looks like the page. `shot` — each board's own accent, picked off the
 * screenshot: the chart blue on the energy board's navy, the crop-level green, the route blue, the
 * HVAC switch's orange, the retail floor plan's alarm orange, the pool's water. SCADA energy is a grey
 * canvas with almost no colour in it, so it takes the amber of the energy it tracks.
 */
export type DashboardTones = 'page' | 'shot';

export const DASHBOARD_TONES: Record<DashboardTones, Record<string, string>> = {
	page: {
		'/use-cases/smart-energy/': '#006bc7', // the loop's blue: a navy board with blue charts
		'/use-cases/smart-farming/': '#008242', // Scale's green: fields and crop level
		'/use-cases/site-fleet-tracking/': '#3d50f5', // Deploy's indigo: the route line on a dark map
		'/use-cases/smart-metering/': '#007c7b', // Connect's teal: meters on a coastline
		'/use-cases/environment-monitoring/': '#008242', // green again, for air and land
		'/use-cases/smart-office/': '#b44100', // Normalize's orange: the HVAC switch
		'/use-cases/water-metering/': '#006bc7', // blue, for water
		'/use-cases/smart-retail/': '#b3268f', // the section's own berry: a store's alarms
		'/use-cases/scada/': '#007c7b', // teal: the pool
		'/use-cases/scada-energy-management/': '#7a37e7', // the twin's violet: power
	},
	shot: {
		'/use-cases/smart-energy/': '#2f80ed',
		'/use-cases/smart-farming/': '#43a047',
		'/use-cases/site-fleet-tracking/': '#3b6fe0',
		'/use-cases/smart-metering/': '#29a3d9',
		'/use-cases/environment-monitoring/': '#2aa198',
		'/use-cases/smart-office/': '#f26b38',
		'/use-cases/water-metering/': '#4caf50',
		'/use-cases/smart-retail/': '#f07a2e',
		'/use-cases/scada/': '#2f9fca',
		'/use-cases/scada-energy-management/': '#e3a232',
	},
};
