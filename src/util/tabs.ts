/**
 * The one tab script, for every `ui/Tabs` on a page (segmented or list). ARIA tabs: a roving
 * tabindex, both arrow pairs whatever the layout (wrapping, and mirrored right to left), Home and
 * End, and selection that follows focus, since every panel is already rendered and there is nothing
 * to load.
 *
 * It owns the panels' `hidden` attribute, found through each tab's `aria-controls`.
 *
 * Fires `tabs:change` on the tablist with `{ index, previous, panel, previousPanel }`. It is
 * CANCELABLE: `preventDefault()` and the panels are left for the caller to swap (to animate a
 * hand-off). The tabs and the thumb have moved by then; only the panels wait.
 *
 * A list that is a column on wide screens and a scrolling row on phones keeps `aria-orientation`
 * true to what is on screen (`data-tabs-orient="md"`: vertical from 750 up).
 */
export function mountTabs(list: HTMLElement): void {
	if (list.dataset.tabsMounted) return;
	list.dataset.tabsMounted = '';

	const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
	const panelOf = (tab: HTMLElement) => document.getElementById(tab.getAttribute('aria-controls') ?? '');

	const select = (i: number, focus: boolean) => {
		const previous = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
		if (focus) tabs[i].focus();
		// Already chosen: nothing to do, so Home on the first tab and End on the last are no-ops
		// (a hand-off caller would otherwise animate the showing panel out and leave it blank).
		if (i === previous) return;
		tabs.forEach((tab, j) => {
			const on = j === i;
			tab.setAttribute('aria-selected', String(on));
			tab.tabIndex = on ? 0 : -1;
			tab.classList.toggle('is-active', on);
		});
		list.style.setProperty('--seg-index', String(i));

		const detail = {
			index: i,
			previous,
			panel: panelOf(tabs[i]),
			previousPanel: previous >= 0 ? panelOf(tabs[previous]) : null,
		};
		if (!list.dispatchEvent(new CustomEvent('tabs:change', { cancelable: true, detail }))) return;
		tabs.forEach((tab, j) => {
			const panel = panelOf(tab);
			if (panel) panel.hidden = j !== i;
		});
	};

	tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i, false)));

	list.addEventListener('keydown', (e) => {
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

export function mountAllTabs(root: ParentNode = document): void {
	root.querySelectorAll<HTMLElement>('[data-tabs]').forEach(mountTabs);
}
