/**
 * The script behind `ui/Segmented` used as a TOGGLE: a group of pressed buttons that sets a value
 * and shows no panel of its own (a region, a billing period). Choosing an option presses it, moves
 * the thumb, and fires `segmented:select` on the group, bubbling, with `{ name, value }`, for the
 * page to do what the value means. Every option stays in the tab order: it is a group of buttons,
 * not a tab set.
 *
 * A segmented TAB set is `ui/Tabs`' and runs on `util/tabs.ts` instead.
 */
export interface SegmentedSelect {
	name: string | undefined;
	value: string;
}

/** Presses the option with this value and moves the thumb under it, without firing the event. */
export function setSegmented(group: HTMLElement, value: string): void {
	const options = Array.from(group.querySelectorAll<HTMLButtonElement>('.ui-seg__opt'));
	const index = options.findIndex((o) => o.dataset.value === value);
	if (index < 0) return;
	options.forEach((o, i) => o.setAttribute('aria-pressed', String(i === index)));
	group.style.setProperty('--seg-index', String(index));
}

export function mountSegmented(group: HTMLElement): void {
	if (group.dataset.segMounted !== undefined) return;
	group.dataset.segMounted = '';
	group.addEventListener('click', (event) => {
		const option = (event.target as Element).closest<HTMLButtonElement>('.ui-seg__opt');
		const value = option?.dataset.value;
		if (!option || value === undefined || option.getAttribute('aria-pressed') === 'true') return;
		setSegmented(group, value);
		const detail: SegmentedSelect = { name: group.dataset.segmentedName, value };
		group.dispatchEvent(new CustomEvent('segmented:select', { bubbles: true, detail }));
	});
}

export function mountAllSegmented(): void {
	document.querySelectorAll<HTMLElement>('[data-segmented-toggle]').forEach(mountSegmented);
}
