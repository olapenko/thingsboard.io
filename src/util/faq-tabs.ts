/**
 * The product pages' FAQ tab set, and its per-panel "More questions".
 *
 * Shared by `/products/paas/` and `/products/thingsboard-pe/`, which render the same markup from
 * `_product-page.scss`. It lived in the first page's `<script>` block until the second one needed
 * it too.
 *
 * Progressive enhancement is deliberate: the markup ships with panel 0 visible and the rest
 * `hidden`, so with no JavaScript a reader still gets the first topic's answers rather than a bare
 * list of dead buttons. That is also why nothing here sets ARIA the markup has not already declared
 * — it only keeps those attributes true as the state changes.
 */
export function initFaqTabs() {
	const layout = document.querySelector<HTMLElement>('.faq-layout');
	if (!layout) return;

	const tabs = Array.from(layout.querySelectorAll<HTMLButtonElement>('.faq-tab'));
	const panels = Array.from(layout.querySelectorAll<HTMLElement>('.faq-panel'));
	if (tabs.length === 0 || tabs.length !== panels.length) return;

	function select(index: number, { focus = false } = {}) {
		tabs.forEach((tab, i) => {
			const active = i === index;
			tab.classList.toggle('is-active', active);
			tab.setAttribute('aria-selected', String(active));
			// Roving tabindex: one stop for the whole set, so Tab leaves the tablist rather than
			// walking every topic before reaching the answers.
			tab.tabIndex = active ? 0 : -1;
			panels[i].hidden = !active;
		});
		if (focus) tabs[index].focus();
	}

	tabs.forEach((tab, i) => {
		tab.addEventListener('click', () => select(i));

		tab.addEventListener('keydown', (event) => {
			// Both orientations: the sidebar is a column on desktop and a row on phones, and the
			// arrows a reader reaches for follow what they see.
			const moves: Record<string, number> = {
				ArrowDown: 1,
				ArrowRight: 1,
				ArrowUp: -1,
				ArrowLeft: -1,
			};

			if (event.key === 'Home') {
				event.preventDefault();
				select(0, { focus: true });
				return;
			}

			if (event.key === 'End') {
				event.preventDefault();
				select(tabs.length - 1, { focus: true });
				return;
			}

			const step = moves[event.key];
			if (!step) return;
			event.preventDefault();
			select((i + step + tabs.length) % tabs.length, { focus: true });
		});
	});

	panels.forEach((panel) => {
		const more = panel.querySelector<HTMLButtonElement>('.faq-more');
		if (!more) return;
		const label = more.querySelector<HTMLElement>('.faq-more__label');

		more.addEventListener('click', () => {
			const expanded = panel.classList.toggle('is-expanded');
			more.setAttribute('aria-expanded', String(expanded));
			if (label) label.textContent = expanded ? 'Fewer questions' : 'More questions';
		});
	});
}

/**
 * Wire it up, now and after each client-side navigation.
 *
 * The site swaps the body without reloading, so without the `astro:page-load` listener the tabs are
 * inert on every page reached by a link rather than by a fresh load.
 */
export function mountFaqTabs() {
	initFaqTabs();
	document.addEventListener('astro:page-load', initFaqTabs);
}
