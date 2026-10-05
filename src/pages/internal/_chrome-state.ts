/**
 * The state the chrome is judged in, shared by every frame on a workbench page and by the stage
 * pages inside them: the theme, whether the page has scrolled (the bar's solid state), whether the
 * menu is open (the panel from 1281, the sheet below), and whether the search dialog is.
 *
 * The workbench writes it (`_StateControls`), the frames read it to build their `src`
 * (`_Frames`), and a stage page reads the resulting query to put itself in that state
 * (`_StageState`). Kept in localStorage, so a phone frame — a document of its own — reads the same
 * state the page set, and the choice survives a reload.
 */
export interface ChromeState {
	theme: 'auto' | 'light' | 'dark';
	scrolled: boolean;
	drawer: boolean;
	search: boolean;
}

const KEY = 'lab:chrome-state';
const DEFAULT: ChromeState = { theme: 'auto', scrolled: false, drawer: false, search: false };

export function readState(): ChromeState {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return { ...DEFAULT };
		const v = JSON.parse(raw) as Partial<ChromeState>;
		return {
			theme: v.theme === 'light' || v.theme === 'dark' ? v.theme : 'auto',
			scrolled: v.scrolled === true,
			drawer: v.drawer === true,
			search: v.search === true,
		};
	} catch {
		return { ...DEFAULT };
	}
}

export function writeState(patch: Partial<ChromeState>): ChromeState {
	const next = { ...readState(), ...patch };
	try {
		localStorage.setItem(KEY, JSON.stringify(next));
	} catch {
		/* the controls still work for this page */
	}
	document.dispatchEvent(new CustomEvent('chrome-state', { detail: next }));
	return next;
}

/**
 * The state as a stage page's query. The theme always goes, `auto` included: the stage pages share
 * the browser's `starlight-theme` storage with every other page on this origin, so "System" has to
 * clear what a previous choice left there, not merely say nothing.
 */
export function stateParams(state: ChromeState = readState()): URLSearchParams {
	const p = new URLSearchParams();
	p.set('theme', state.theme);
	if (state.scrolled) p.set('scrolled', '1');
	if (state.drawer) p.set('drawer', '1');
	if (state.search) p.set('search', '1');
	return p;
}

/** `route` plus its own query plus the shared state. */
export function withState(route: string, state?: ChromeState): string {
	const [path, own = ''] = route.split('?');
	const p = new URLSearchParams(own);
	stateParams(state).forEach((v, k) => p.set(k, v));
	const q = p.toString();
	return q ? `${path}?${q}` : path;
}
