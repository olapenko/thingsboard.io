/**
 * THE LOGO ROOM: Logos as a few pages instead of one, the shell of the standalone room that will be
 * shared on its own. Overview for anyone it is shared with; the Bench for deciding; the Spec for what
 * is settled and its rules; Files for the inventory and the legacy drawings. One component draws the
 * first three (`_LogoRoom.astro`, by `page`); Files is the Logo files page with the room's tabs on top.
 *
 * Each page's sections are its section bar; the tabs carry the address's query (the set on the bench)
 * from page to page.
 */
export type RoomPageId = 'overview' | 'bench' | 'spec' | 'files';

export interface RoomPage {
	id: RoomPageId;
	label: string;
	href: string;
	/** The page's sections, in order: its section bar. */
	sections: { id: string; label: string }[];
}

const BASE = '/internal/design-system/logos/';

export const ROOM: RoomPage[] = [
	{
		id: 'overview',
		label: 'Overview',
		href: BASE,
		// The Overview reads top to bottom: no section links of its own.
		sections: [],
	},
	{
		id: 'bench',
		label: 'Bench',
		href: `${BASE}bench/`,
		sections: [
			{ id: 'workbench', label: 'Workbench' },
			{ id: 'rounds', label: 'Rounds' },
			{ id: 'experiments', label: 'Exploring' },
			{ id: 'actions', label: 'Actions' },
		],
	},
	{
		id: 'spec',
		label: 'Spec',
		href: `${BASE}spec/`,
		sections: [
			{ id: 'brand', label: 'Logotype' },
			{ id: 'map', label: 'Map' },
			{ id: 'colour', label: 'Colour' },
			{ id: 'fills', label: 'Materials' },
			{ id: 'vocabulary', label: 'Vocabulary' },
		],
	},
	{
		id: 'files',
		label: 'Files',
		href: '/internal/design-system/logo-files/',
		sections: [],
	},
];

export const roomPage = (id: RoomPageId) => ROOM.find((p) => p.id === id) as RoomPage;
