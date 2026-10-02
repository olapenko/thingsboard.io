/**
 * The one tab script, for every `ui/Tabs` on a page (segmented, list or grid). ARIA tabs: a roving
 * tabindex, both arrow pairs whatever the layout (wrapping, and mirrored right to left), Home and
 * End, and selection that follows focus, since every panel is already rendered and there is nothing
 * to load.
 *
 * It owns the panels' `hidden` attribute, found through each tab's `aria-controls`.
 *
 * Fires `tabs:change` on the tablist, bubbling, with `{ index, previous, panel, previousPanel }`. It is
 * CANCELABLE: `preventDefault()` and the panels are left for the caller to swap (to animate a
 * hand-off). The tabs and the thumb have moved by then; only the panels wait.
 *
 * A list that is a column on wide screens and a scrolling row on phones keeps `aria-orientation`
 * true to what is on screen (`data-tabs-orient="md"`: vertical from 750 up).
 */
export interface TabsChange {
	index: number;
	previous: number;
	panel: HTMLElement | null;
	previousPanel: HTMLElement | null;
}

const tabsOf = (list: HTMLElement) => Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
const panelOf = (tab: HTMLElement) => document.getElementById(tab.getAttribute('aria-controls') ?? '');

/**
 * Selects tab `index` and moves the thumb under it, without firing the event or touching the panels:
 * for a caller that drives the tabs itself (a ticker, arrows beside them) or paints a deep link.
 */
export function setTab(list: HTMLElement, index: number): void {
	tabsOf(list).forEach((tab, j) => {
		tab.setAttribute('aria-selected', String(j === index));
		tab.tabIndex = j === index ? 0 : -1;
	});
	list.style.setProperty('--seg-index', String(index));
}

export function mountTabs(list: HTMLElement): void {
	if (list.dataset.tabsMounted !== undefined) return;
	list.dataset.tabsMounted = '';

	const tabs = tabsOf(list);

	const select = (i: number, focus: boolean) => {
		const previous = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
		if (focus) tabs[i].focus();
		// Already chosen: nothing to do, so Home on the first tab and End on the last are no-ops
		// (a hand-off caller would otherwise animate the showing panel out and leave it blank).
		if (i === previous) return;
		setTab(list, i);

		const detail: TabsChange = {
			index: i,
			previous,
			panel: panelOf(tabs[i]),
			previousPanel: previous >= 0 ? panelOf(tabs[previous]) : null,
		};
		if (!list.dispatchEvent(new CustomEvent('tabs:change', { bubbles: true, cancelable: true, detail }))) return;
		tabs.forEach((tab, j) => {
			const panel = panelOf(tab);
			if (panel) panel.hidden = j !== i;
		});
	};

	// Focus on click too: Safari does not focus a button it clicks, and the arrows need a focused tab.
	// Without scrolling, for a click sent from elsewhere ("See Private Cloud plans").
	tabs.forEach((tab, i) =>
		tab.addEventListener('click', () => {
			tab.focus({ preventScroll: true });
			select(i, false);
		})
	);

	list.addEventListener('keydown', (e) => {
		// Alt or Cmd with an arrow is the browser's back and forward, not a tab key.
		if (e.altKey || e.ctrlKey || e.metaKey) return;
		const at = tabs.findIndex((t) => t === document.activeElement);
		const n = tabs.length;
		const ahead = getComputedStyle(list).direction === 'rtl' ? -1 : 1;
		const step: Record<string, number> = {
			ArrowRight: at + ahead + n,
			ArrowLeft: at - ahead + n,
			ArrowDown: at + 1,
			ArrowUp: at - 1 + n,
			Home: 0,
			End: n - 1,
		};
		const next = step[e.key];
		if (at < 0 || next === undefined) return;
		e.preventDefault();
		select(next % n, true);
	});

	const orient = list.dataset.tabsOrient;
	if (orient === 'md') {
		const wide = matchMedia('(min-width: 750px)');
		const set = () => list.setAttribute('aria-orientation', wide.matches ? 'vertical' : 'horizontal');
		set();
		wide.addEventListener('change', set);
	}
}

export function mountAllTabs(): void {
	document.querySelectorAll<HTMLElement>('[data-tabs]').forEach(mountTabs);
}
