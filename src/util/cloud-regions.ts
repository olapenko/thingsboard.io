/**
 * ThingsBoard Cloud's two regions, and what the website remembers about them.
 *
 * Cloud is two sites, `thingsboard.cloud` and `eu.thingsboard.cloud`, with an account on only one,
 * so every button that leads to Cloud has to know the region before it can send anyone anywhere.
 * `CloudRegionDialog` asks; this module holds what it asks about and what it keeps.
 */
export const CLOUD_REGIONS = [
	{ id: 'us', name: 'North America', host: 'thingsboard.cloud' },
	{ id: 'eu', name: 'Europe', host: 'eu.thingsboard.cloud' },
] as const;

export type CloudRegionId = (typeof CLOUD_REGIONS)[number]['id'];

export const isCloudRegionId = (value: unknown): value is CloudRegionId => CLOUD_REGIONS.some((r) => r.id === value);

/**
 * The region this browser last went to Cloud in, from the website. A `localStorage` key and a
 * window event: the event reaches listeners in the same document, the `storage` event reaches
 * other documents on this origin. The value is a region id only, never anything personal.
 */
export const LAST_REGION = { key: 'tb.site.lastSigninRegion', event: 'tfd:last' } as const;

export function readLastRegion(): CloudRegionId | null {
	try {
		const value = localStorage.getItem(LAST_REGION.key);
		return isCloudRegionId(value) ? value : null;
	} catch {
		// Private windows and blocked site data throw: then nothing is remembered.
		return null;
	}
}

export function writeLastRegion(value: CloudRegionId): void {
	try {
		localStorage.setItem(LAST_REGION.key, value);
	} catch {
		// No storage: this document still hears the event below.
	}
	window.dispatchEvent(new CustomEvent(LAST_REGION.event, { detail: value }));
}

/** Calls `fn` whenever the remembered region changes, from this document or another one. */
export function onLastRegion(fn: (value: CloudRegionId | null) => void): void {
	window.addEventListener(LAST_REGION.event, (e) => {
		const value = (e as CustomEvent<unknown>).detail;
		fn(isCloudRegionId(value) ? value : null);
	});
	window.addEventListener('storage', (e) => {
		if (e.key === LAST_REGION.key) fn(isCloudRegionId(e.newValue) ? e.newValue : null);
	});
}

/**
 * The region nearest to this browser, from its timezone: the one signal a static site has on the
 * client without asking anyone. Europe, Africa and the Atlantic islands are nearer the EU cluster
 * than the North American one; everywhere else, including the Americas and Asia-Pacific, defaults to
 * North America, which is also where the site sent everyone before it asked.
 */
export function nearestCloudRegion(): CloudRegionId {
	try {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
		return /^(Europe|Africa|Atlantic)\//.test(tz) ? 'eu' : 'us';
	} catch {
		return 'us';
	}
}

/**
 * What every region picker says and keys on, in one place (the dialog, the Install hub, Bookend and
 * choose-region all render `RegionChoice` from these). The sign-up note is the Cloud FAQ's own claim,
 * data "stored in either North America or the EU", and no narrower: the docs name no datacentre.
 */
export const REGION_STORED_IN: Record<CloudRegionId, string> = {
	us: 'Data stored in North America',
	eu: 'Data stored in the European Union',
};

/**
 * The analytics ids, on the dialog's rows only (a page that also mounts the dialog would otherwise
 * carry each id twice). The sign-up ones are what the retired choose-region buttons carried, so the
 * funnel keeps its names.
 */
export const REGION_GTM_ID: Record<'signup' | 'signin', Record<CloudRegionId, string>> = {
	signup: { us: 'TryItNow_Cloud_NorthAmerica', eu: 'TryItNow_Cloud_Europe' },
	signin: { us: 'SignIn_Cloud_NorthAmerica', eu: 'SignIn_Cloud_Europe' },
};

/** Each globe's hue. Decoration: the names carry the meaning. Europe is a graphics colour only. */
export const REGION_HUE: Record<CloudRegionId, string> = {
	us: '#3d50f5',
	eu: 'var(--region-eu)',
};

export const regionHref = (host: string, flow: 'signup' | 'signin'): string =>
	`https://${host}${flow === 'signin' ? '/login' : '/signup'}`;
