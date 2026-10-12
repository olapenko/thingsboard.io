/**
 * TEMP-VERSION-SWITCH: the Trust Center versions under test, for the dev-only switch
 * (`TrustCenter/VersionSwitch.astro`). Not part of the page: nothing here renders in a build.
 *
 * Each version is its own branch, worktree and dev server (the hub's `launch.json` holds one config
 * per port), so the switch moves between ports. The file is the same on every version's branch;
 * the version a page belongs to is the port it is served from.
 *
 * Two shapes of page set:
 * - `pages`: every part has a page of its own (`/trust-center/product/`, `/compliance/gdpr/`).
 * - `anchors`: a section's short pages are one page, its parts anchored (`/security/#product`).
 * `PARTS` pairs the two, so a switch lands on the same part whichever way it goes.
 *
 * Remove this file, the switch and its one line in `TrustCenterLayout` before the Trust Center goes
 * into handoff.
 */

export interface TcVersion {
	id: string;
	label: string;
	branch: string;
	/** The port its dev server runs on (the hub's `launch.json`). */
	port: number;
	shape: 'pages' | 'anchors';
	note: string;
}

export const TC_VERSIONS: TcVersion[] = [
	{
		id: 'v3',
		label: 'v3',
		branch: 'feat/trust-center',
		port: 4346,
		shape: 'pages',
		note: 'Section bar under the site bar, hubs, section pages as pills in the hero',
	},
	{
		id: 'landing',
		label: 'Landing',
		branch: 'exp/trust-center-landing',
		port: 4348,
		shape: 'pages',
		note: 'v3 with an overview that has no bar: seals and actions in its hero',
	},
	{
		id: 'anchors',
		label: 'Anchors',
		branch: 'exp/trust-center-anchors',
		port: 4349,
		shape: 'anchors',
		note: 'One page per section, its parts anchored and listed in the hero',
	},
	{
		id: 'anchors-cards',
		label: 'Anchors + cards',
		branch: 'exp/trust-center-anchors-cards',
		port: 4350,
		shape: 'anchors',
		note: "Anchors' pages with their parts as tiles, Landing's overview, v2's topics, Cloud and On-premises as sections",
	},
];

/** A part as a page of its own (`page`) and as an anchored part of its section's page (`part`). */
export const PARTS: { page: string; part: string }[] = [
	{ page: '/trust-center/compliance/iso-27001/', part: '/trust-center/compliance/#iso-27001' },
	{ page: '/trust-center/compliance/iso-9001/', part: '/trust-center/compliance/#iso-9001' },
	{ page: '/trust-center/compliance/gdpr/', part: '/trust-center/compliance/#gdpr' },
	{ page: '/trust-center/compliance/ccpa/', part: '/trust-center/compliance/#ccpa' },
	{ page: '/trust-center/product/', part: '/trust-center/security/#product' },
	{ page: '/trust-center/data/', part: '/trust-center/security/#data' },
	{ page: '/trust-center/access/', part: '/trust-center/security/#access' },
	{ page: '/trust-center/appsec/', part: '/trust-center/security/#dev' },
	// v4 has no Deployment hub (review of 2026-10-12): its parts are on the pages they moved to.
	{ page: '/trust-center/commitments/#who-handles-what', part: '/trust-center/onprem/#who-handles-what' },
	{ page: '/trust-center/commitments/#you-configure', part: '/trust-center/security/#you-configure' },
];
