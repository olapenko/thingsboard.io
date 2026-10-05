/**
 * The pricing drafts' state: which deployment, Cloud region, Private Cloud billing and On-premises
 * licence show. It lives on <html> (`data-deploy`, `data-cloud-region`, `data-pc-billing`,
 * `data-onprem-billing`), written before paint by `_PricingPrepaint.astro` and the toggles'
 * `initialFromRoot`, and `_pricing-state.scss` shows the matching blocks. This keeps it there, and
 * in the address, as the reader changes it.
 *
 * Underscore-prefixed so Astro does not make it a route.
 */
import { setSegmented, type SegmentedSelect } from '@util/segmented';
import type { TabsChange } from '@util/tabs';

interface Options {
	/** The class of the deployment tab set (`ui/Tabs`). */
	tabs: string;
	/** Where "See … plans" scrolls back to. */
	plans: () => Element | null;
	/** After the deployment changes: a caption that names it, say. */
	onDeploy?: (id: string) => void;
}

const root = document.documentElement;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Under the fixed bar, with the same air the FAQ sidebar keeps from it. */
function scrollToElement(el: Element) {
	const bar = parseFloat(getComputedStyle(root).getPropertyValue('--home-header-h')) || 64;
	const top = el.getBoundingClientRect().top + window.scrollY - bar - 24;
	window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
}

/** The address follows the view, so a link copied from here opens on what you were reading. */
function updateUrl(edit: (params: URLSearchParams) => void) {
	const url = new URL(location.href);
	edit(url.searchParams);
	history.replaceState(history.state, '', url);
}

// `?solution=` means something on On-premises only, and says the licence when it is Perpetual.
function setSolution(params: URLSearchParams) {
	if (root.dataset.deploy === 'thingsboard-pe' && root.dataset.onpremBilling === 'perpetual') {
		params.set('solution', 'pe-perpetual');
	} else {
		params.delete('solution');
	}
}

export function mountPricingState({ tabs, plans, onDeploy }: Options): void {
	// The deployment tabs move the selection, the focus and the thumb, and ask first. The page shows
	// its blocks from <html> rather than through `hidden`, so it takes over.
	document.addEventListener('tabs:change', (event) => {
		if (!(event.target as Element).classList?.contains(tabs)) return;
		event.preventDefault();
		const id = (event as CustomEvent<TabsChange>).detail.panel?.id.replace(/^plans-/, '');
		if (!id) return;
		root.dataset.deploy = id;
		onDeploy?.(id);
		// Main's `?section=` is dropped once read.
		updateUrl((params) => {
			params.set('product', id);
			params.delete('section');
			setSolution(params);
		});
	});

	// Every other choice is a `ui/Segmented` toggle: its value goes to <html>, where the CSS reads it,
	// and to any other toggle of the same name.
	document.addEventListener('segmented:select', (event) => {
		const { name, value } = (event as CustomEvent<SegmentedSelect>).detail;
		if (!name) return;
		root.dataset[name] = value;
		document
			.querySelectorAll<HTMLElement>(`[data-segmented-name="${name}"]`)
			.forEach((group) => setSegmented(group, value));
		if (name === 'onpremBilling') updateUrl(setSolution);
	});

	document.addEventListener('click', (event) => {
		const target = event.target as Element | null;
		if (!target) return;

		// "See plans", "See Private Cloud plans": the deployment's tab, focused (the link that was
		// focused is in a panel that has just gone), and back up to the plans.
		const go = target.closest<HTMLAnchorElement>('[data-deploy-go]');
		if (go) {
			event.preventDefault();
			document.getElementById(`plans-${go.dataset.deployGo}-tab`)?.click();
			const to = plans();
			if (to) scrollToElement(to);
			return;
		}

		// A link that quotes an FAQ answer opens it, through the FAQ's own opener (`ProductFaq`): its
		// topic selected, "More questions" opened if it is held back, the answer expanded and scrolled
		// to under the bar.
		const more = target.closest<HTMLAnchorElement>('[data-faq-link]');
		if (more) {
			const answer = document.getElementById(more.hash.slice(1));
			if (!answer) return;
			event.preventDefault();
			answer.dispatchEvent(new CustomEvent('faq:open', { bubbles: true }));
			answer.querySelector('summary')?.focus({ preventScroll: true });
		}
	});

	// An answer in another deployment's FAQ — a copied link, main's address — brings that deployment
	// forward before it opens.
	document.addEventListener('faq:reveal', (event) => {
		const view = (event.target as Element).closest<HTMLElement>('[data-deploy-panel]');
		const id = view?.dataset.deployPanel;
		if (id && root.dataset.deploy !== id) document.getElementById(`plans-${id}-tab`)?.click();
	});
}
