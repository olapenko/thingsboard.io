import { lockScroll, unlockScroll } from '@util/scroll-lock';

/**
 * The script behind `ui/Dialog`: a native `<dialog>` opened with `showModal()`, so the focus trap,
 * Escape and the inert page come from the browser. This adds what the browser leaves out:
 *
 * - the page's scroll lock, held by each dialog while it is open, so the page unlocks once nothing
 *   holding it (another dialog, the phone menu) is left open;
 * - focus returned to the opener on close, explicitly, rather than left to the browser;
 * - a click on the backdrop closes a dismissible dialog, but a drag that started inside the panel
 *   (selecting text, say) and ended outside does not;
 * - triggers: any element with `data-dialog-open="<id>"` opens the dialog with that id.
 */
const openers = new WeakMap<HTMLDialogElement, HTMLElement | null>();

export function openDialog(
	dlg: HTMLDialogElement,
	options: { focus?: HTMLElement | null; opener?: HTMLElement | null } = {}
): void {
	if (dlg.open) return;
	let opener = options.opener ?? (document.activeElement as HTMLElement | null);
	// An opener inside a dialog that has just closed (one dialog handing off to another) cannot take
	// focus back: return it to whatever opened that dialog instead.
	const within = opener?.closest('dialog');
	if (within && within !== dlg && !within.open) opener = openers.get(within) ?? null;
	openers.set(dlg, opener);
	dlg.showModal();
	lockScroll(dlg);
	// `showModal` lands on the first focusable, the close button. A caller that knows the likeliest
	// answer focuses it instead, so Enter is the whole interaction.
	options.focus?.focus();
}

export function mountDialog(dlg: HTMLDialogElement): void {
	if (dlg.dataset.uiDialogMounted !== undefined) return;
	dlg.dataset.uiDialogMounted = '';

	dlg.addEventListener('close', () => {
		unlockScroll(dlg);
		const opener = openers.get(dlg);
		// Back to where the reader was, unless they have moved on to another dialog meanwhile.
		if (opener && opener.isConnected && !document.querySelector('dialog.ui-dialog[open]')) opener.focus();
	});

	if (dlg.dataset.dismissible !== 'false') {
		let downOnBackdrop = false;
		dlg.addEventListener('pointerdown', (e) => {
			downOnBackdrop = e.target === dlg;
		});
		// The panel does not fill the dialog box, so a click whose target is the dialog element itself
		// landed beside the panel, on the backdrop.
		dlg.addEventListener('click', (e) => {
			if (e.target === dlg && downOnBackdrop) dlg.close();
		});
	}

	if (dlg.id) {
		document.querySelectorAll<HTMLElement>(`[data-dialog-open="${dlg.id}"]`).forEach((trigger) => {
			trigger.setAttribute('aria-haspopup', 'dialog');
			trigger.addEventListener('click', (e) => {
				if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
				e.preventDefault();
				openDialog(dlg, { opener: trigger });
			});
		});
	}
}

export function mountAllDialogs(): void {
	document.querySelectorAll<HTMLDialogElement>('dialog.ui-dialog').forEach(mountDialog);
}
