/** ThingsBoard Cloud's regions and the one this browser last chose on the site. */
// The notes must match the Cloud FAQ, which names no country or datacentre.
// `gtm` is part of the click ids the GTM funnel keys on.
export const CLOUD_REGIONS = [
	{
		id: 'us',
		name: 'North America',
		note: 'Data stored in North America',
		host: 'thingsboard.cloud',
		gtm: 'NorthAmerica',
		hue: 'var(--color-brand)',
	},
	{
		id: 'eu',
		name: 'Europe',
		note: 'Data stored in the European Union',
		host: 'eu.thingsboard.cloud',
		gtm: 'Europe',
		hue: '#0e8aa8',
	},
] as const;

export type CloudRegion = (typeof CLOUD_REGIONS)[number];

export type CloudRegionId = CloudRegion['id'];

export type CloudFlow = 'signup' | 'signin';

export const cloudRegionHref = (region: CloudRegion, flow: CloudFlow) =>
	`https://${region.host}${flow === 'signin' ? '/login' : '/signup'}`;

/** Sign-up ids must match `/installations/choose-region/`'s, so every sign-up click lands in one funnel. */
export const cloudRegionGtmId = (region: CloudRegion, flow: CloudFlow) =>
	`${flow === 'signin' ? 'SignIn' : 'TryItNow'}_Cloud_${region.gtm}`;

const LAST_REGION_KEY = 'tb.site.lastSigninRegion';

export function readLastRegion(): CloudRegionId | null {
	try {
		const value = localStorage.getItem(LAST_REGION_KEY);
		return CLOUD_REGIONS.some((r) => r.id === value) ? (value as CloudRegionId) : null;
	} catch {
		return null;
	}
}

export function writeLastRegion(value: CloudRegionId): void {
	try {
		localStorage.setItem(LAST_REGION_KEY, value);
	} catch {
		// No storage: the next visit simply has no "Last visited" chip; this document still hears the event.
	}
	window.dispatchEvent(new CustomEvent(LAST_REGION.event, { detail: value }));
}

// ---- The kit-era pickers' names ---------------------------------------------------------------
// `RegionChoice` (the Install hub, choose-region, later the dialog and the bookends) reads these;
// the dialog and the header still read the ones above. One module, two vocabularies, until the
// dialog moves onto `RegionChoice` and the older names go.

export const isCloudRegionId = (value: unknown): value is CloudRegionId => CLOUD_REGIONS.some((r) => r.id === value);

/**
 * The region this browser last went to Cloud in: the storage key above, and a window event so a
 * picker in the same document hears a choice made in another (the `storage` event reaches other
 * documents on this origin). The value is a region id only, never anything personal.
 */
export const LAST_REGION = { key: LAST_REGION_KEY, event: 'tfd:last' } as const;

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

/** What every region picker says, in one place: the Cloud FAQ's own claim, and no narrower. */
export const REGION_STORED_IN: Record<CloudRegionId, string> = Object.fromEntries(
	CLOUD_REGIONS.map((r) => [r.id, r.note])
) as Record<CloudRegionId, string>;

/** The analytics ids, as `cloudRegionGtmId` builds them, by flow and region. */
export const REGION_GTM_ID: Record<CloudFlow, Record<CloudRegionId, string>> = {
	signup: Object.fromEntries(CLOUD_REGIONS.map((r) => [r.id, cloudRegionGtmId(r, 'signup')])) as Record<
		CloudRegionId,
		string
	>,
	signin: Object.fromEntries(CLOUD_REGIONS.map((r) => [r.id, cloudRegionGtmId(r, 'signin')])) as Record<
		CloudRegionId,
		string
	>,
};

/** Each globe's hue. Decoration: the names carry the meaning. Europe is a graphics colour only. */
export const REGION_HUE: Record<CloudRegionId, string> = {
	us: '#3d50f5',
	eu: 'var(--region-eu)',
};

export const regionHref = (host: string, flow: CloudFlow): string =>
	`https://${host}${flow === 'signin' ? '/login' : '/signup'}`;

const GREENLAND = /^America\/(Nuuk|Godthab|Scoresbysund|Danmarkshavn|Thule)$/;

/**
 * By hemisphere: UTC−2 and further west (the Americas) goes to North America; the rest, with Greenland
 * and the UTC−1 Atlantic islands (Azores, Cape Verde), to Europe.
 */
export function nearestCloudRegion(): CloudRegionId {
	const west = new Date().getTimezoneOffset() > 60;
	return west && !GREENLAND.test(Intl.DateTimeFormat().resolvedOptions().timeZone) ? 'us' : 'eu';
}
