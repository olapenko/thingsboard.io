/**
 * The specimen pages' captions, MEASURED from what rendered, so they cannot drift from the
 * components: change a component and its caption changes with it. Imported for its effect by
 * Foundations and Components; it measures once on load and again after a resize settles.
 *
 * - `data-m="size,pad,type,…"` on a figure: the readings to take (the keys of `read` below), off the
 *   figure's first child or the element `data-m-el` names, written into its `.kit-m`.
 * - `data-var="--token"`: the token's computed value, as the element's text.
 * - `data-ratios`: the contrast the accent scheme around it keeps, for each text role on its ground.
 */

const px = (v: string) => String(Math.round(parseFloat(v) * 10) / 10);

const shadowName = new Map<string, string>();
for (const token of ['--elev-tile', '--elev-tile-hover', '--elev-panel', '--elev-dialog', '--elev-mark']) {
	const probe = document.createElement('div');
	probe.style.boxShadow = `var(${token})`;
	document.body.append(probe);
	shadowName.set(getComputedStyle(probe).boxShadow, token.slice(2));
	probe.remove();
}

const read: Record<string, (el: HTMLElement, cs: CSSStyleDeclaration) => string | null> = {
	size: (el) => {
		const r = el.getBoundingClientRect();
		return `${Math.round(r.width)} × ${Math.round(r.height)}`;
	},
	h: (el) => `${Math.round(el.getBoundingClientRect().height)} tall`,
	pad: (_, cs) => `pad ${px(cs.paddingTop)} ${px(cs.paddingRight)}`,
	type: (_, cs) => {
		const size = parseFloat(cs.fontSize);
		const lh = cs.lineHeight === 'normal' ? '' : ` / ${Math.round((parseFloat(cs.lineHeight) / size) * 100) / 100}`;
		return `${px(cs.fontSize)}${lh} · ${cs.fontWeight}`;
	},
	radius: (_, cs) => {
		const r = cs.borderTopLeftRadius;
		return `r ${r.endsWith('%') ? r : px(r)}`;
	},
	shadow: (_, cs) => (cs.boxShadow === 'none' ? 'no lift' : (shadowName.get(cs.boxShadow) ?? 'own shadow')),
	icon: (el) => {
		const svg = el.querySelector('svg');
		return svg ? `icon ${Math.round(svg.getBoundingClientRect().width)}` : null;
	},
	dur: (_, cs) => {
		const times = cs.transitionDuration.split(',').map((t) => Math.round(parseFloat(t) * 1000));
		const max = Math.max(...times);
		// The first easing of the list: split on the commas between curves, not inside one.
		const ease = cs.transitionTimingFunction.split(/,(?![^(]*\))/)[0].trim();
		return max ? `${max}ms ${ease}` : 'no transition';
	},
};

function measure() {
	document.querySelectorAll<HTMLElement>('[data-m]').forEach((fig) => {
		const sel = fig.dataset.mEl;
		const el = (sel ? fig.querySelector(sel) : fig.firstElementChild) as HTMLElement | null;
		const out = fig.querySelector('.kit-m');
		if (!el || !out) return;
		const cs = getComputedStyle(el);
		out.textContent = (fig.dataset.m ?? '')
			.split(',')
			.map((k) => read[k]?.(el, cs))
			.filter(Boolean)
			.join(' · ');
	});

	document.querySelectorAll<HTMLElement>('[data-var]').forEach((el) => {
		el.textContent = getComputedStyle(el)
			.getPropertyValue(el.dataset.var ?? '')
			.trim();
	});

	// The contrast each scheme's text roles keep, against the ground each is meant for.
	const lum = (hex: string) => {
		let h = hex.trim().replace(/^#/, '');
		if (/^[0-9a-f]{3}$/i.test(h)) h = [...h].map((ch) => ch + ch).join('');
		if (!/^[0-9a-f]{6}$/i.test(h)) return null;
		const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
		const [r, g, b] = c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};
	const ratio = (a: string, b: string) => {
		const la = lum(a);
		const lb = lum(b);
		if (la === null || lb === null) return '–';
		return `${((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(1)}:1`;
	};
	document.querySelectorAll<HTMLElement>('[data-ratios]').forEach((el) => {
		const cs = getComputedStyle(el);
		const v = (name: string) => cs.getPropertyValue(name).trim();
		const indigo = v('--band-indigo') || '#121425';
		el.textContent = `on-fill on fill ${ratio(v('--accent-on-fill'), v('--accent-fill'))} · ink on white ${ratio(v('--accent-ink'), '#ffffff')} · light on indigo ${ratio(v('--accent-light'), indigo)}`;
	});
}

measure();

let t = 0;
addEventListener('resize', () => {
	clearTimeout(t);
	t = window.setTimeout(measure, 150);
});
export {};
