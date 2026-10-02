/**
 * The hero's switches: what `sections/hero.astro` can change about the homepage's hero, the footage it
 * can play, and the screens it shows the page at.
 *
 * EVERY SWITCH'S FIRST OPTION IS WHAT SHIPS. A page with no query is the homepage as it is, and the
 * address carries only what differs from it, so a link to a combination is short enough to paste.
 *
 * The candidates themselves are CSS, in `_hero-lab.scss`, keyed to `data-lab-<switch>` on the frame's
 * `<html>`. Three need the page's script as well: footage and phone video swap the `<video>`, and the
 * dark menu lets go of the header's scrolled state, which the homepage holds from the top.
 */

export interface LabOption {
	value: string;
	label: string;
	/** What it does, for the button's tooltip. */
	note?: string;
}

export interface LabSwitch {
	key: string;
	label: string;
	/** Which part of the page it is about: the bar sets each group under its own heading. */
	group: LabGroup['id'];
	/** Where it shows, when that is not everywhere. */
	scope?: string;
	options: LabOption[];
}

export interface LabGroup {
	id: 'top' | 'copy' | 'footage' | 'phone' | 'below';
	label: string;
}

/** The bar's headings, top of the page to bottom. */
export const GROUPS: LabGroup[] = [
	{ id: 'top', label: 'Menu & headline' },
	{ id: 'copy', label: 'Lede & words' },
	{ id: 'footage', label: 'Footage' },
	{ id: 'phone', label: 'On a phone' },
	{ id: 'below', label: 'Under the hero' },
];

/** Past this many options a switch is a dropdown rather than a row of buttons. */
export const SEGMENTS_UP_TO = 3;

export interface Footage {
	id: string;
	label: string;
	note?: string;
	webm?: string;
	mp4?: string;
	/** The still shown until the video plays, and instead of it on a phone. None means black. */
	poster?: string;
	/** Its shape as `width / height`, where it is not 16:9: Hero's `footageRatio`. */
	ratio?: string;
}

/** A candidate is one entry here: it gets a button. The first is what ships. */
export const FOOTAGE: Footage[] = [
	{
		id: 'slides',
		label: 'Slides',
		note: 'On the homepage now: the dashboards tour with slide transitions between the dashboards · 1920×924, 30 fps from a 60 fps master, 26.2 s, the fade-in and the fade-out cut so the loop is a hard cut · VP9 2.3 MB, H.264 2.4 MB',
		webm: '/videos/horizontal-slider-slides.webm',
		mp4: '/videos/horizontal-slider-slides.mp4',
		// Its exact first frame, 63 KB.
		poster: '/images/hero/horizontal-slider-slides.webp',
		ratio: '1920 / 924',
	},
	{
		id: 'smooth',
		label: 'Smooth slider',
		note: 'The cut before it: the tour re-rendered with eased pans · 1920×924, 30 fps from a 60 fps master, 26.5 s, the slide-in and the zoom-out cut so the loop is a hard cut · VP9 2.2 MB, H.264 2.5 MB',
		webm: '/videos/horizontal-slider-smooth.webm',
		mp4: '/videos/horizontal-slider-smooth.mp4',
		// Its exact first frame, 63 KB.
		poster: '/images/hero/horizontal-slider-smooth.webp',
		ratio: '1920 / 924',
	},
	{
		id: 'slider',
		label: 'Horizontal slider',
		note: 'The first cut: the dashboards tour · 1920×924, 30 fps, 40.5 s, the black fades cut so the loop is a hard cut · VP9 2.3 MB, H.264 3.3 MB',
		webm: '/videos/horizontal-slider.webm',
		mp4: '/videos/horizontal-slider.mp4',
		// Its exact first frame, 64 KB.
		poster: '/images/hero/horizontal-slider.webp',
		ratio: '1920 / 924',
	},
	{
		id: 'cover2',
		label: 'tb-cover2',
		note: 'The homepage before it · 1920×1080, 25 fps, 40 s · VP9 7.5 MB, H.264 12.8 MB',
		webm: 'https://video.thingsboard.io/tb-cover2.webm',
		mp4: 'https://video.thingsboard.io/tb-cover2.mp4',
		poster: '/images/hero/tb-cover.webp',
	},
	{
		id: 'cover',
		label: 'tb-cover',
		note: 'The earlier cut, still on the CDN. No poster of its own, so black until it plays',
		webm: 'https://video.thingsboard.io/tb-cover.webm',
		mp4: 'https://video.thingsboard.io/tb-cover.mp4',
	},
];

/**
 * The page each frame loads, by the `words` switch: the homepage in A's words, or order C — A's
 * sections in main's words, whose hero has a shorter lede, no note under the buttons, and more room
 * round them (`heroCta: 'roomy'`). So a lede size can be judged against both.
 */
export const WORDS_SRC: Record<string, string> = {
	a: '/',
	c: '/internal/homepages/c/',
};

/** `footage=url` plays whatever address is pasted into the field beside the buttons. */
export const PASTED = 'url';

export const SWITCHES: LabSwitch[] = [
	{
		key: 'menu',
		label: 'Menu',
		group: 'top',
		options: [
			{ value: 'white', label: 'White', note: 'As now: the white bar from the top, its scrolled state held' },
			{ value: 'dark', label: 'Dark', note: 'The bar in 80% black over the hero, white once scrolled' },
		],
	},
	{
		key: 'brand',
		label: 'Brand line',
		group: 'top',
		options: [
			{ value: 'now', label: 'As now', note: '“ThingsBoard” at the headline’s size' },
			{ value: 'none', label: 'Removed', note: 'The headline alone' },
			{ value: 'kicker', label: 'Kicker', note: '“ThingsBoard” as an eyebrow over the headline, still inside the H1' },
		],
	},
	{
		key: 'fill',
		label: 'Brand fill',
		group: 'top',
		options: [
			{
				value: 'gradient',
				label: 'Gradient',
				note: 'As now: “ThingsBoard” lighter at the top, darker toward the bottom, and the logo strip’s marks with it',
			},
			{ value: 'flat', label: 'Flat', note: '“ThingsBoard” and the logo strip’s marks in flat half white' },
		],
	},
	{
		key: 'lede',
		label: 'Lede',
		group: 'copy',
		options: [
			{ value: '16', label: '16 / 24', note: 'As now: the body size, as every lede on the site is' },
			{
				value: '18',
				label: '18 / 28',
				note: 'Candidate, 2026-10-02: the one lede set above body size, under a 48px headline · the measure stays 34ch, so it widens with the type',
			},
			{
				value: '20',
				label: '20 / 30',
				note: 'Candidate, 2026-10-02: a step further, 2.4:1 to the headline · the measure stays 34ch',
			},
		],
	},
	{
		key: 'words',
		label: 'Words',
		group: 'copy',
		options: [
			{ value: 'a', label: 'A', note: 'As now: the homepage at /, in A’s words, with its note under the buttons' },
			{
				value: 'c',
				label: 'C · main’s',
				note: 'Order C at /internal/homepages/c/: A in main’s words — a three-line lede, no note, and the roomy spacing round the buttons',
			},
		],
	},
	{
		key: 'footage',
		label: 'Video',
		group: 'footage',
		options: [
			...FOOTAGE.map((f) => ({ value: f.id, label: f.label, note: f.note })),
			{ value: PASTED, label: 'Pasted address', note: 'The address in the field' },
		],
	},
	{
		key: 'colour',
		label: 'Colour',
		group: 'footage',
		options: [
			{ value: 'lift', label: 'Lift', note: 'As now: saturate(1.2), the charts a step richer, the dark UI as it is' },
			{ value: 'shot', label: 'As shot', note: 'The footage as encoded' },
			{ value: 'vivid', label: 'Vivid', note: 'saturate(1.35) contrast(1.06): punchier, the panels a touch deeper' },
		],
	},
	{
		key: 'fade',
		label: 'Edge fade',
		group: 'footage',
		scope: 'side by side',
		options: [
			{ value: 'smooth', label: 'Smooth, 240px', note: 'As now: smootherstep, no knee where it ends' },
			{ value: 'long', label: 'Longer, a third', note: 'The same curve over a third of the panel: 240 to 360px' },
			{
				value: 'previous',
				label: 'Previous',
				note: 'The smoothstep before it, whose end showed as a line over white frames',
			},
			{ value: 'off', label: 'Off', note: 'The footage starts beside the copy, with a hard edge' },
			{
				value: 'off-centred',
				label: 'Off once centred',
				note: 'As now where the footage bleeds to the edge; once the composition is capped and centred (past 2000), a hard edge beside the band, like its right one',
			},
		],
	},
	{
		key: 'phone',
		label: 'Layout',
		group: 'phone',
		scope: 'under 600px',
		options: [
			{ value: 'panel', label: 'Panel below', note: 'As now: the footage in a strip under the copy' },
			{
				value: 'backdrop',
				label: 'Backdrop',
				note: 'The footage behind the copy from under the menu, darkened, the copy over it',
			},
		],
	},
	{
		key: 'motion',
		label: 'Video',
		group: 'phone',
		scope: 'under 768px',
		options: [
			{ value: 'video', label: 'Plays', note: 'As now: phones play the footage too' },
			{ value: 'still', label: 'Still', note: 'Phones get the poster and never load the video' },
		],
	},
	{
		key: 'logos',
		label: 'Logo strip',
		group: 'below',
		options: [
			{ value: 'dark', label: 'Dark', note: 'As now: white marks on the hero’s black' },
			{ value: 'light', label: 'Light', note: 'Grey marks on white, a subtle grey at the top easing into the page' },
		],
	},
];

export interface Screen {
	id: string;
	label: string;
	w: number;
	h: number;
	/** Shown until the reader picks their own set. */
	on?: boolean;
}

/**
 * Viewports, not devices: each height is what the browser leaves once its own bars are drawn, since
 * that is what the hero's `svh` fold is measured against. One per composition by default: side by
 * side, the two stacked copy columns, and the phone's single one.
 */
export const SCREENS: Screen[] = [
	// 34" 21:9 with the browser's own bars, and a 29"/34" 2560x1080 with them: both 2560 and
	// wider, so both get the hero's wide composition, one tall and one short.
	{ id: 'ultra', label: 'Ultra-wide', w: 3440, h: 1350 },
	{ id: 'ultra-short', label: 'Ultra-wide, short', w: 2560, h: 990 },
	{ id: 'wide', label: 'Wide', w: 1920, h: 960 },
	{ id: 'laptop', label: 'Laptop', w: 1440, h: 780, on: true },
	{ id: 'short', label: 'Short laptop', w: 1366, h: 645 },
	{ id: 'tablet', label: 'Tablet', w: 1024, h: 698 },
	{ id: 'upright', label: 'Tablet, upright', w: 820, h: 1110, on: true },
	{ id: 'sideways', label: 'Phone, sideways', w: 740, h: 360 },
	{ id: 'phone', label: 'Phone', w: 390, h: 664, on: true },
	{ id: 'small', label: 'Small phone', w: 360, h: 640 },
];

export const SCALES = [0.33, 0.5, 0.75, 1];
const DEFAULT_SCALE = 0.5;

export type View = 'screens' | 'window';

export interface LabState {
	/** Each switch's value, by key. */
	on: Record<string, string>;
	/** The pasted footage address. */
	src: string;
	screens: string[];
	scale: number;
	view: View;
}

const DEFAULT_SCREENS = SCREENS.filter((s) => s.on).map((s) => s.id);

/** The state an address describes. Anything missing or unknown is what ships. */
export function readState(query: URLSearchParams): LabState {
	const on: Record<string, string> = {};
	for (const s of SWITCHES) {
		const asked = query.get(s.key);
		on[s.key] = s.options.some((o) => o.value === asked) ? asked! : s.options[0].value;
	}
	const src = query.get('src')?.trim() ?? '';
	// Pasted footage with nothing pasted is the footage that ships.
	if (on.footage === PASTED && !src) on.footage = FOOTAGE[0].id;
	const screens = query
		.get('screens')
		?.split(',')
		.filter((id) => SCREENS.some((s) => s.id === id));
	const scale = Number(query.get('scale'));
	return {
		on,
		src,
		screens: screens ?? DEFAULT_SCREENS,
		scale: SCALES.includes(scale) ? scale : DEFAULT_SCALE,
		view: query.get('view') === 'window' ? 'window' : 'screens',
	};
}

/** The query for a state: only what differs from the defaults, in a fixed order. */
export function writeState(state: LabState): string {
	const query = new URLSearchParams();
	for (const s of SWITCHES) if (state.on[s.key] !== s.options[0].value) query.set(s.key, state.on[s.key]);
	if (state.src) query.set('src', state.src);
	if (state.screens.join() !== DEFAULT_SCREENS.join()) query.set('screens', state.screens.join());
	if (state.scale !== DEFAULT_SCALE) query.set('scale', String(state.scale));
	if (state.view !== 'screens') query.set('view', state.view);
	// Commas are legal in a query, and `screens=laptop,phone` is a link someone can read.
	const out = query.toString().replace(/%2C/g, ',');
	return out ? `?${out}` : '';
}
