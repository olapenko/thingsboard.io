import { contrastOf, oklchOf } from '@util/oklch';

/**
 * The room's colour picker: one popover that every `<input type="color">` on the page opens in place of
 * the browser's own. The input stays the value: the popover sets it and fires `input` as it moves and
 * `change` as it closes, so whatever listens to the input works as before.
 *
 * It shows the set's colours as swatches, in their dark values for an input on a dark ground (a dark
 * card's, or one marked `data-cp-dark`), and reads the colour out as the room measures it: OKLCH, and
 * its contrast on white and on night against the checks' 3:1.
 */

type Hsv = [h: number, s: number, v: number];

/** The checks' floor, as the sheet's own. */
const MIN = 3;
const NIGHT = '#0b0d1f';
/** The colours added in the Studio's palette, this browser's: they join the swatches as Yours. */
const ADDED_KEY = 'logo-room:colours';

/** A hex as the input holds it, `#rrggbb` in lower case, from one typed with or without `#`, 3 or 6 digits. */
export const hexIn = (s: string) => {
	const m = s
		.trim()
		.toLowerCase()
		.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/);
	if (!m) return undefined;
	const d = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
	return `#${d}`;
};

function hsvOf(hex: string): Hsv {
	const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
	const max = Math.max(r, g, b);
	const d = max - Math.min(r, g, b);
	let h = 0;
	if (d) {
		if (max === r) h = ((g - b) / d) % 6;
		else if (max === g) h = (b - r) / d + 2;
		else h = (r - g) / d + 4;
	}
	return [(h * 60 + 360) % 360, max ? d / max : 0, max];
}

function hexOfHsv([h, s, v]: Hsv) {
	const f = (n: number) => {
		const k = (n + h / 60) % 6;
		return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
	};
	return `#${[f(5), f(3), f(1)]
		.map((c) =>
			Math.round(c * 255)
				.toString(16)
				.padStart(2, '0')
		)
		.join('')}`;
}

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

export function initColourPicker(box: HTMLElement) {
	const area = box.querySelector<HTMLElement>('[data-cp-area]');
	const knob = box.querySelector<HTMLElement>('[data-cp-knob]');
	const hue = box.querySelector<HTMLElement>('[data-cp-hue]');
	const hueKnob = box.querySelector<HTMLElement>('[data-cp-hknob]');
	const hexField = box.querySelector<HTMLInputElement>('[data-cp-hex]');
	const was = box.querySelector<HTMLButtonElement>('[data-cp-was]');
	const drop = box.querySelector<HTMLButtonElement>('[data-cp-drop]');
	const oklch = box.querySelector<HTMLElement>('[data-cp-oklch]');
	const onWhite = box.querySelector<HTMLElement>('[data-cp-white]');
	const onNight = box.querySelector<HTMLElement>('[data-cp-night]');
	const added = box.querySelector<HTMLElement>('[data-cp-added]');
	const dotTemplate = box.querySelector<HTMLTemplateElement>('[data-cp-dot]');
	if (!area || !knob || !hue || !hueKnob || !hexField) return;

	let input: HTMLInputElement | undefined;
	let start = '';
	let dark = false;
	let hsv: Hsv = [0, 0, 0];
	let frame = 0;
	/** Whether the input was changed since it opened: only then does closing tell it. */
	let moved = false;

	const anchorOf = (el: HTMLInputElement) => el.closest<HTMLElement>('label') ?? el;
	const dots = () => [...box.querySelectorAll<HTMLButtonElement>('[data-cp-light]')];
	const valueOf = (dot: HTMLElement) => (dark ? dot.dataset.cpDark : dot.dataset.cpLight) ?? '';

	// The input's own events, one a frame while dragging, so the sheet repaints at the screen's pace.
	const emit = () => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => input?.dispatchEvent(new Event('input', { bubbles: true })));
	};

	const paint = (typing = false) => {
		const hex = hexOfHsv(hsv);
		box.style.setProperty('--cp-now', hex);
		box.style.setProperty('--cp-hue', `hsl(${hsv[0]} 100% 50%)`);
		knob.style.left = `${hsv[1] * 100}%`;
		knob.style.top = `${(1 - hsv[2]) * 100}%`;
		hueKnob.style.left = `${(hsv[0] / 360) * 100}%`;
		area.setAttribute(
			'aria-valuetext',
			`Saturation ${Math.round(hsv[1] * 100)}%, brightness ${Math.round(hsv[2] * 100)}%`
		);
		hue.setAttribute('aria-valuenow', String(Math.round(hsv[0])));
		if (!typing) hexField.value = hex;
		const [l, c, h] = oklchOf(hex);
		if (oklch) oklch.textContent = `${l.toFixed(2)} ${c.toFixed(2)} ${Math.round(h)}°`;
		[
			[onWhite, contrastOf(hex, '#ffffff')],
			[onNight, contrastOf(hex, NIGHT)],
		].forEach(([dd, r]) => {
			if (!(dd instanceof HTMLElement) || typeof r !== 'number') return;
			dd.textContent = `${r.toFixed(1)}:1`;
			dd.dataset.pass = r >= MIN ? 'yes' : 'no';
		});
		dots().forEach((d) => d.setAttribute('aria-pressed', String(valueOf(d) === hex)));
		return hex;
	};

	const set = (next: Hsv, typing = false) => {
		hsv = next;
		const hex = paint(typing);
		if (input && input.value !== hex) {
			input.value = hex;
			moved = true;
			emit();
		}
	};
	const setHex = (hex: string, typing = false) => set(hsvOf(hex), typing);

	// The swatches take the ground's values: dark ones for an input on a dark ground.
	const drawDots = () => {
		dots().forEach((d) => {
			d.style.setProperty('--c', valueOf(d));
			d.title = `${d.dataset.cpName}, ${valueOf(d)}`;
		});
		if (!added || !dotTemplate) return;
		let mine: { name?: string; hex?: string; dark?: string }[] = [];
		try {
			mine = JSON.parse(localStorage.getItem(ADDED_KEY) ?? '[]');
		} catch {
			// No storage here: no colours of yours.
		}
		const row = added.querySelector<HTMLElement>('[data-cp-row]');
		// Each colour once: one the set already shows is not repeated as yours.
		const shown = new Set(dots().flatMap((d) => (row?.contains(d) ? [] : [d.dataset.cpLight])));
		row?.replaceChildren(
			...mine.flatMap((c) => {
				const light = c.hex && hexIn(c.hex);
				if (!light || shown.has(light)) return [];
				shown.add(light);
				const dot = dotTemplate.content.firstElementChild?.cloneNode(true);
				if (!(dot instanceof HTMLButtonElement)) return [];
				dot.dataset.cpName = c.name || 'Yours';
				dot.dataset.cpLight = light;
				dot.dataset.cpDark = (c.dark && hexIn(c.dark)) || light;
				dot.style.setProperty('--c', valueOf(dot));
				dot.title = `${dot.dataset.cpName}, ${valueOf(dot)}`;
				return [dot];
			})
		);
		added.hidden = !row?.childElementCount;
	};

	const place = () => {
		if (!input) return;
		const r = anchorOf(input).getBoundingClientRect();
		const { clientWidth: vw, clientHeight: vh } = document.documentElement;
		if (r.bottom < 0 || r.top > vh) return close(true);
		const w = box.offsetWidth;
		const h = box.offsetHeight;
		const left = clamp(r.left, 8, vw - w - 8);
		const below = r.bottom + 8;
		const top = below + h <= vh - 8 ? below : Math.max(8, r.top - h - 8);
		box.style.left = `${left}px`;
		box.style.top = `${top}px`;
	};

	function close(keep: boolean) {
		if (!input) return;
		const el = input;
		if (!keep && el.value !== start) setHex(start);
		cancelAnimationFrame(frame);
		if (moved) el.dispatchEvent(new Event('input', { bubbles: true }));
		if (el.value !== start) el.dispatchEvent(new Event('change', { bubbles: true }));
		box.hidden = true;
		input = undefined;
		el.focus({ preventScroll: true });
	}

	const open = (el: HTMLInputElement) => {
		input = el;
		start = hexIn(el.value) ?? '#000000';
		moved = false;
		dark = !!el.closest('[data-ground-card="dark"]') || el.hasAttribute('data-cp-dark');
		box.dataset.ground = dark ? 'dark' : 'light';
		box.setAttribute('aria-label', el.getAttribute('aria-label') ?? 'Pick a colour');
		box.style.setProperty('--cp-was', start);
		hsv = hsvOf(start);
		drawDots();
		box.hidden = false;
		paint();
		place();
		area.focus({ preventScroll: true });
	};

	// Every colour input opens this, not the browser's picker: a click on it or its label, or Enter or Space.
	document.addEventListener(
		'click',
		(e) => {
			const el = e.target;
			if (!(el instanceof HTMLInputElement) || el.type !== 'color' || el.disabled) return;
			e.preventDefault();
			if (input === el) close(true);
			else {
				if (input) close(true);
				open(el);
			}
		},
		true
	);
	document.addEventListener(
		'pointerdown',
		(e) => {
			if (!input || !(e.target instanceof Node)) return;
			if (box.contains(e.target) || anchorOf(input).contains(e.target)) return;
			close(true);
		},
		true
	);
	addEventListener('scroll', () => input && place(), true);
	addEventListener('resize', () => input && place());

	// Dragging on the area or the strip.
	const drag = (el: HTMLElement, at: (x: number, y: number) => void) => {
		const move = (e: PointerEvent) => {
			const r = el.getBoundingClientRect();
			at(clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height));
		};
		el.addEventListener('pointerdown', (e) => {
			e.preventDefault();
			el.setPointerCapture(e.pointerId);
			el.focus({ preventScroll: true });
			move(e);
			el.addEventListener('pointermove', move);
			el.addEventListener('pointerup', () => el.removeEventListener('pointermove', move), { once: true });
		});
	};
	drag(area, (x, y) => set([hsv[0], x, 1 - y]));
	drag(hue, (x) => set([x * 360, hsv[1], hsv[2]]));

	// The keyboard: arrows move by one, with Shift by ten.
	const step = (e: KeyboardEvent) => (e.shiftKey ? 10 : 1);
	area.addEventListener('keydown', (e) => {
		const d = step(e) / 100;
		const moves: Record<string, [number, number]> = {
			ArrowLeft: [-d, 0],
			ArrowRight: [d, 0],
			ArrowUp: [0, d],
			ArrowDown: [0, -d],
		};
		const m = moves[e.key];
		if (!m) return;
		e.preventDefault();
		set([hsv[0], clamp(hsv[1] + m[0]), clamp(hsv[2] + m[1])]);
	});
	hue.addEventListener('keydown', (e) => {
		const d = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
		if (!d) return;
		e.preventDefault();
		set([(hsv[0] + d * step(e) + 360) % 360, hsv[1], hsv[2]]);
	});

	hexField.addEventListener('input', () => {
		const hex = hexIn(hexField.value);
		if (hex) setHex(hex, true);
	});
	hexField.addEventListener('blur', () => paint());
	was?.addEventListener('click', () => setHex(start));
	box.addEventListener('click', (e) => {
		const dot = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-cp-light]') : null;
		if (dot) setHex(valueOf(dot));
	});
	box.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
			close(false);
		} else if (e.key === 'Enter' && e.target === hexField) {
			e.preventDefault();
			close(true);
		}
	});

	// The page's own colours, where the browser has an eyedropper.
	const Dropper = (window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } })
		.EyeDropper;
	if (Dropper && drop) {
		drop.hidden = false;
		drop.addEventListener('click', async () => {
			try {
				const { sRGBHex } = await new Dropper().open();
				const hex = hexIn(sRGBHex);
				if (hex) setHex(hex);
			} catch {
				// Dismissed: nothing picked.
			}
		});
	}
}
