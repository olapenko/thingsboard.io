/**
 * THE LOGO ROOM: Logos as a few pages instead of one, the shell of the standalone room that will be
 * shared on its own. Overview for anyone it is shared with; Guidelines for what is settled, its rules
 * and the assets; the Studio for deciding; Files for the inventory and the legacy drawings; About for
 * proposing a change. In the order people need them, the most asked first. One component draws
 * Overview, Guidelines and the Studio (`_LogoRoom.astro`, by `page`); Files is the Logo files page with
 * the room's tabs on top. The ids are the code's (`spec` is Guidelines, `bench` the Studio); the labels
 * and addresses are what people see.
 *
 * Each page's sections are its section bar; the tabs carry the address's query (the set in the Studio)
 * from page to page.
 */
export type RoomPageId = 'overview' | 'bench' | 'spec' | 'files' | 'about';

export interface RoomPage {
	id: RoomPageId;
	label: string;
	href: string;
	/** Its icon beside its tab, a Tabler name; the Overview and About go without. */
	icon?: string;
	/** The page's sections, in order: its section bar. */
	sections: { id: string; label: string }[];
}

const BASE = '/internal/design-system/logos/';

/**
 * The room mark's cards, back to front, in the set's own colours: IoT Hub's amber, On-premises' green,
 * Cloud's indigo, then the platform's White. Its colours wash About's hero.
 */
export const ROOM_MARK = ['#b45309', '#178649', '#3d50f5', '#ffffff'];

export const ROOM: RoomPage[] = [
	{
		id: 'overview',
		label: 'Overview',
		href: BASE,
		// The Overview reads top to bottom: no section links of its own.
		sections: [],
	},
	{
		id: 'spec',
		label: 'Guidelines',
		href: `${BASE}guidelines/`,
		icon: 'tabler:file-description',
		sections: [
			{ id: 'brand', label: 'Assets' },
			{ id: 'map', label: 'Map' },
			{ id: 'colour', label: 'Colour' },
			{ id: 'fills', label: 'Materials' },
		],
	},
	{
		id: 'bench',
		label: 'Studio',
		href: `${BASE}studio/`,
		icon: 'tabler:tools',
		sections: [
			{ id: 'workbench', label: 'Canvas' },
			{ id: 'rounds', label: 'Rounds' },
			{ id: 'experiments', label: 'Ideas' },
			{ id: 'actions', label: 'Actions' },
		],
	},
	{
		id: 'files',
		label: 'Files',
		href: '/internal/design-system/logo-files/',
		icon: 'tabler:folders',
		sections: [],
	},
	{
		id: 'about',
		label: 'About',
		href: `${BASE}about/`,
		sections: [
			{ id: 'room', label: 'The room' },
			{ id: 'how-to', label: 'How to' },
			{ id: 'agent', label: 'With an agent' },
			{ id: 'groups', label: 'Groups' },
			{ id: 'maintainers', label: 'For maintainers' },
			{ id: 'vocabulary', label: 'Vocabulary' },
		],
	},
];

export const roomPage = (id: RoomPageId) => ROOM.find((p) => p.id === id) as RoomPage;
