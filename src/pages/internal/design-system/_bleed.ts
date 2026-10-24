/**
 * The window's vertical scrollbar, as `--sbw` on the root. A band that spans the window takes it off
 * its `50vw` (`calc(50% - 50vw + var(--sbw, 0px) / 2)`), so it fills the page edge to edge and never
 * scrolls it sideways where scrollbars take room. Measured whenever the page's box changes: a resize,
 * or the page growing tall enough to need its scrollbar after the script first ran.
 */
export const trackScrollbar = () => {
	const root = document.documentElement;
	if (root.dataset.sbw) return;
	const set = () => {
		root.style.setProperty('--sbw', `${window.innerWidth - root.clientWidth}px`);
		root.dataset.sbw = 'on';
	};
	set();
	new ResizeObserver(set).observe(root);
};
