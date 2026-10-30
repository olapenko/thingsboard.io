import { ARM, CHIP, TUCKED_SWEEP, armDash, armTransform } from '@util/tb-mark-parts';

/**
 * The script behind `ui/MarkLoader`: the ThingsBoard mark as a loader. Started, the chip in the
 * middle tucks its pins in and shrinks away while the two arms pull onto one center and turn.
 * Stopped, the arms turn on to the next half turn (the mark looks the same every half turn), push
 * back out, and the chip grows back with its pins: at rest it is the logo again, exactly, attribute
 * for attribute as the component rendered it.
 *
 * Driven by `data-loading` on the SVG: present starts it, absent stops it, so a page toggles one
 * attribute. `markLoader(svg)` gives the same as calls; its `stop()` resolves once the logo is back,
 * when `markloader:settled` fires on the SVG.
 *
 * One frame loop for every loader on the page. Each frame is a pose computed from the time alone,
 * so a loader that misses frames catches up rather than slowing down, and a loader out of view keeps
 * its clock and skips its writes. A frame writes only the attributes whose value changed, so a part
 * that holds still (the hidden chip, a constant arc) costs nothing. Under `prefers-reduced-motion`,
 * or `data-motion="reduced"` on the SVG, nothing turns or travels: the chip fades and the arms pulse.
 *
 * Every motion starts from the speed the part already has. Stopping hands each moving value (the
 * turn, a breathing arc) its current rate, so nothing freezes for a frame and then sets off again.
 *
 * The variants differ in what the arms do while loading (`ARMS`); going and coming back are shared,
 * except that Flip waits for its next rest before it comes back (`canSettle`).
 */
export const MARK_LOADER_VARIANTS = ['spin', 'chase', 'orbit', 'flip'] as const;
export type MarkLoaderVariant = (typeof MARK_LOADER_VARIANTS)[number];

/** Spinning, the rings would reach past the mark's box; this keeps them inside it. */
const LOAD_SCALE = 0.89;
/** A load shorter than this still plays the whole way in before it settles, rather than flinching. */
const MIN_LOAD = 650;
/** Coming back, each pin pops out this many ms after the one before it. */
const PIN_STAGGER = 18;
/** Coming back, how long an arc takes to return to the logo's quarter circle. */
const ARCS_FOR = 420;

/** What the arms do: turned `turn` degrees, each half of an arc reaching `back`/`ahead` degrees from its ring. */
interface ArmPose {
	turn: number;
	back: number;
	ahead: number;
}

interface Pose extends ArmPose {
	/** 0 with the arms on their own centers (the logo), 1 with both on one center. */
	pull: number;
	/** The arms' opacity: below 1 only in the reduced pulse. */
	arms: number;
	/** The chip as a whole (body and pins): its scale, turn and opacity. */
	chipScale: number;
	chipTurn: number;
	chip: number;
	/** Each pin's own scale toward its base, inside the chip. */
	pins: number[];
}

const LOGO: Pose = {
	turn: 0,
	back: ARM.halfSweep,
	ahead: ARM.halfSweep,
	pull: 0,
	arms: 1,
	chipScale: 1,
	chipTurn: 0,
	chip: 1,
	pins: CHIP.pins.map(() => 1),
};

// ── Easing ──
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (x: number) => x * x * (3 - 2 * x);
const inCubic = (x: number) => x * x * x;
const outCubic = (x: number) => 1 - (1 - x) ** 3;
const inOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const inBack = (x: number, s = 1.4) => (s + 1) * x * x * x - s * x * x;
const outBack = (x: number, s = 1.6) => 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2;

/**
 * Cubic Hermite from `from`, leaving at `rate` a ms, to `to` at rest, `t` ms into `span`. With no
 * rate it is a smoothstep; with one, the value carries on as it was going before it turns for `to`.
 */
function hermite(from: number, rate: number, to: number, t: number, span: number): number {
	const u = clamp(t / span);
	return from + (u * u * u - 2 * u * u + u) * rate * span + (3 * u * u - 2 * u * u * u) * (to - from);
}

/**
 * Time run at full speed after a smooth spin-up: 0 until `delay`, then speeding up over `ramp` ms
 * (the integral of a smoothstep), then one for one. Multiplied by a speed it is an angle that starts
 * from rest.
 */
function run(t: number, delay = 140, ramp = 520): number {
	const x = (t - delay) / ramp;
	if (x <= 0) return 0;
	if (x < 1) return ramp * (x ** 3 - x ** 4 / 2);
	return ramp / 2 + (t - delay - ramp);
}

// ── What the arms do while loading, `t` ms after the start ──

// Chase: each arc grows and shrinks about its ring while it turns; the leading end runs ahead as it
// grows and the trailing end catches up as it shrinks, so the ring moves at the base speed plus the
// arc's own rate of change. Starts mid-swing, where the arc is the logo's quarter circle.
const CHASE = { lap: 1700, period: 1400, mid: 50, swing: 32 };
const CHASE_U0 = Math.acos((CHASE.mid - ARM.halfSweep) / CHASE.swing);
/** How far the half-sweep has traveled, up and down, by phase `u`: the extra turn it gives the ring. */
const chaseTravel = (u: number) => {
	const k = Math.floor(u / Math.PI);
	return CHASE.swing * (2 * k + 1 - Math.cos(u - k * Math.PI));
};

// Flip: half turns with a rest between, each arm leaning back on the move.
const FLIP = { delay: 160, move: 640, rest: 260, lean: 10 };

const ARMS: Record<MarkLoaderVariant, (t: number) => ArmPose> = {
	spin: (t) => ({ turn: (360 / 1100) * run(t), back: ARM.halfSweep, ahead: ARM.halfSweep }),

	chase: (t) => {
		const r = run(t);
		const u = CHASE_U0 + (2 * Math.PI * r) / CHASE.period;
		const sweep = CHASE.mid - CHASE.swing * Math.cos(u);
		return { turn: (360 / CHASE.lap) * r + chaseTravel(u) - chaseTravel(CHASE_U0), back: sweep, ahead: sweep };
	},

	// Orbit: the leading half of each arc draws back into its ring, stopping where it is all under the
	// ring, and the trailing half shortens to a tail that grows with the speed.
	orbit: (t) => {
		const tuck = inOutCubic(clamp((t - 60) / 320));
		const speed = smooth(clamp((t - 160) / 600));
		return {
			turn: (360 / 950) * run(t, 160, 600),
			back: lerp(ARM.halfSweep, TUCKED_SWEEP + 22 * speed, tuck),
			ahead: lerp(ARM.halfSweep, TUCKED_SWEEP, tuck),
		};
	},

	flip: (t) => {
		const tc = t - FLIP.delay;
		if (tc <= 0) return { turn: 0, back: ARM.halfSweep, ahead: ARM.halfSweep };
		const cycle = FLIP.move + FLIP.rest;
		const k = Math.floor(tc / cycle);
		const f = Math.min(1, (tc - k * cycle) / FLIP.move);
		const lean = FLIP.lean * Math.sin(Math.PI * f) ** 2;
		return { turn: 180 * (k + inOutCubic(f)), back: ARM.halfSweep + lean, ahead: ARM.halfSweep - lean };
	},
};

/**
 * Whether a variant may start coming back at `t`. Flip finishes the half turn it is on and comes back
 * at the rest, which is the logo already; the others come back from wherever they are.
 */
function canSettle(variant: MarkLoaderVariant, t: number): boolean {
	if (variant !== 'flip') return true;
	const tc = t - FLIP.delay;
	return tc <= 0 || tc % (FLIP.move + FLIP.rest) >= FLIP.move;
}

/**
 * Going: the pins tuck in one after another, clockwise from the top; the chip winds back and shrinks
 * to nothing, taking the pins still out with it. It stays solid on the way: faded, it read as a gray
 * square between the arms.
 */
function loadingPose(variant: MarkLoaderVariant, t: number, reduced: boolean): Pose {
	if (reduced) {
		return {
			...LOGO,
			arms: 0.4 + 0.6 * (0.5 + 0.5 * Math.cos((2 * Math.PI * t) / 1600)),
			chip: 1 - smooth(clamp(t / 240)),
		};
	}
	const q = clamp((t - 90) / 320);
	return {
		...ARMS[variant](t),
		pull: inOutCubic(clamp((t - 100) / 420)),
		arms: 1,
		chipScale: Math.max(0, 1 - inBack(q)),
		chipTurn: -45 * inCubic(q),
		chip: 1,
		pins: CHIP.pins.map((_, i) => 1 - inCubic(clamp((t - 20 * i) / 170))),
	};
}

/**
 * Coming back, from `from` at the moment of stopping, with `rates` the turn and each half of an arc
 * had then (degrees a ms). The turn carries on to the next half turn at least 180 ms of travel away,
 * on a curve that starts at that speed and slows to rest. It takes 1.6 times as long as holding the
 * speed would, which never speeds up first, capped at 1.1 s: Chase stopped at its slowest can gain a
 * few percent before it slows. Chase's arcs, and any arc still changing, start back to the quarter
 * circle at once, from their own rate; Orbit's held tails wait for the last stretch of the turn, so
 * the rings slow down before they grow arcs again. The arms push out from halfway through the
 * landing and the chip grows back from 60% of it, while the last of the turn is still moving: left
 * to the end, the arms crept into place with nothing else happening, which read as a hitch.
 */
function settlePlan(variant: MarkLoaderVariant, from: Pose, rates: ArmPose) {
	const speed = rates.turn;
	let target = from.turn;
	let turnFor = 0;
	if (speed > 0.002) {
		target = 180 * Math.ceil((from.turn + speed * 180) / 180 - 1e-9);
		turnFor = Math.min(1100, (1.6 * (target - from.turn)) / speed);
	} else if (from.turn % 180 > 0.01) {
		target = 180 * Math.ceil(from.turn / 180);
		turnFor = 300 + (target - from.turn) * 2.5;
	}
	const arcsAt = (rate: number) => (variant === 'chase' || Math.abs(rate) > 0.02 ? 0 : Math.max(0, turnFor - ARCS_FOR));
	const backAt = arcsAt(rates.back);
	const aheadAt = arcsAt(rates.ahead);
	const pullAt = turnFor * 0.5;
	const chipAt = turnFor * 0.6;
	const pinsAt = chipAt + 120;
	const end = Math.max(
		turnFor + 80,
		backAt + ARCS_FOR,
		aheadAt + ARCS_FOR,
		pullAt + 400,
		pinsAt + PIN_STAGGER * (CHIP.pins.length - 1) + 240
	);
	return { from, rates, target, turnFor, backAt, aheadAt, pullAt, chipAt, pinsAt, end };
}

type Plan = ReturnType<typeof settlePlan>;

function settlePose(p: Plan, t: number): Pose {
	const { from, rates } = p;
	const chip = clamp((t - p.chipAt) / 420);
	return {
		turn: p.turnFor > 0 ? hermite(from.turn, rates.turn, p.target, t, p.turnFor) : from.turn,
		back: hermite(from.back, rates.back, ARM.halfSweep, t - p.backAt, ARCS_FOR),
		ahead: hermite(from.ahead, rates.ahead, ARM.halfSweep, t - p.aheadAt, ARCS_FOR),
		pull: lerp(from.pull, 0, inOutCubic(clamp((t - p.pullAt) / 400))),
		arms: lerp(from.arms, 1, smooth(clamp(t / 240))),
		chipScale: lerp(from.chipScale, 1, outBack(chip)),
		chipTurn: lerp(from.chipTurn, 0, outCubic(chip)),
		// Only the reduced pulse fades the chip; in full motion it is solid and comes back by its scale.
		chip: lerp(from.chip, 1, smooth(clamp(chip * 3))),
		pins: from.pins.map((k, i) => lerp(k, 1, outBack(clamp((t - p.pinsAt - PIN_STAGGER * i) / 240)))),
	};
}

// ── Drawing ──
interface Parts {
	arms: SVGGElement;
	arm: SVGGElement[];
	back: SVGPathElement[];
	ahead: SVGPathElement[];
	chip: SVGGElement;
	pins: SVGPathElement[];
}

/** A number for an attribute, to three places. */
const num = (x: number) => String(Math.round(x * 1000) / 1000);

/** Writes an attribute only when it changes; `null` removes it, which is how a part goes back to rest. */
function set(el: Element, name: string, value: string | null) {
	if (el.getAttribute(name) === value) return;
	if (value === null) el.removeAttribute(name);
	else el.setAttribute(name, value);
}

function setDash(path: SVGPathElement, sweep: number) {
	const dash = armDash(sweep);
	set(path, 'visibility', dash ? null : 'hidden');
	if (!dash) return;
	set(path, 'stroke-dasharray', dash.array);
	set(path, 'stroke-dashoffset', dash.offset);
}

/** Scaled and turned about a point, or `null` (no transform) when it is neither. */
function about(x: number, y: number, scale: number, turn = 0): string | null {
	if (scale === 1 && turn === 0) return null;
	const r = turn === 0 ? '' : ` rotate(${num(turn)})`;
	return `translate(${x} ${y})${r} scale(${num(Math.max(0, scale))}) translate(${-x} ${-y})`;
}

function draw(parts: Parts, pose: Pose) {
	const scale = 1 - pose.pull * (1 - LOAD_SCALE);
	const turn = pose.turn % 360;
	parts.arm.forEach((g, i) => set(g, 'transform', armTransform(i as 0 | 1, pose.pull, turn, scale)));
	parts.back.forEach((p) => setDash(p, pose.back));
	parts.ahead.forEach((p) => setDash(p, pose.ahead));
	set(parts.arms, 'opacity', pose.arms === 1 ? null : num(pose.arms));

	// The pins live inside the chip group, so they turn and shrink with the body as it goes.
	set(parts.chip, 'opacity', pose.chip === 1 ? null : num(pose.chip));
	set(parts.chip, 'transform', about(CHIP.center.x, CHIP.center.y, pose.chipScale, pose.chipTurn));
	parts.pins.forEach((pin, i) => {
		const k = pose.pins[i];
		set(pin, 'visibility', k <= 0.001 ? 'hidden' : null);
		if (k > 0.001) set(pin, 'transform', about(CHIP.pins[i].base[0], CHIP.pins[i].base[1], k));
	});
}

// ── The loop ──
export interface MarkLoader {
	readonly el: SVGSVGElement;
	readonly loading: boolean;
	start(): void;
	/** Resolves once the mark is the logo again; in a hidden tab, once the tab is shown and it lands. */
	stop(): Promise<void>;
}

const active = new Set<Controller>();
let frame = 0;

function loop(now: number) {
	active.forEach((c) => c.tick(now));
	frame = active.size ? requestAnimationFrame(loop) : 0;
}

function wake(c: Controller) {
	active.add(c);
	if (!frame) frame = requestAnimationFrame(loop);
}

const reducedMotion = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

class Controller implements MarkLoader {
	private parts: Parts;
	private state: 'rest' | 'loading' | 'settling' = 'rest';
	private variant: MarkLoaderVariant = 'spin';
	private reduced = false;
	private startedAt = 0;
	private stopAsked = false;
	private restart = false;
	private plan: Plan | null = null;
	private settleFrom = 0;
	private visible = true;
	private waiting: (() => void)[] = [];
	readonly el: SVGSVGElement;

	constructor(el: SVGSVGElement) {
		this.el = el;
		const all = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));
		this.parts = {
			arms: el.querySelector('[data-arms]')!,
			arm: all('[data-arm]'),
			back: all('[data-back]'),
			ahead: all('[data-ahead]'),
			chip: el.querySelector('[data-chip]')!,
			pins: all('[data-pin]'),
		};
		new IntersectionObserver(([e]) => (this.visible = e.isIntersecting), { rootMargin: '80px' }).observe(el);
	}

	get loading() {
		return this.state === 'loading';
	}

	start() {
		if (this.state === 'loading') {
			this.stopAsked = false;
			return;
		}
		if (this.state === 'settling') {
			this.restart = true;
			return;
		}
		const v = this.el.dataset.variant as MarkLoaderVariant;
		this.variant = MARK_LOADER_VARIANTS.includes(v) ? v : 'spin';
		this.reduced = this.el.dataset.motion === 'reduced' || !!reducedMotion?.matches;
		this.state = 'loading';
		this.stopAsked = false;
		this.startedAt = performance.now();
		this.el.setAttribute('aria-busy', 'true');
		this.el.setAttribute('aria-label', this.el.dataset.label || 'Loading');
		wake(this);
	}

	stop(): Promise<void> {
		this.restart = false;
		if (this.state === 'rest') return Promise.resolve();
		if (this.state === 'loading') this.stopAsked = true;
		return new Promise((resolve) => this.waiting.push(resolve));
	}

	tick(now: number) {
		let pose: Pose;
		if (this.state === 'loading') {
			const t = now - this.startedAt;
			pose = loadingPose(this.variant, t, this.reduced);
			if (this.stopAsked && t >= MIN_LOAD && (this.reduced || canSettle(this.variant, t))) {
				// Each value's rate at this instant, from a millisecond either side.
				const [a, b] = [t - 1, t + 1].map((ms) => loadingPose(this.variant, ms, this.reduced));
				const rate = (key: keyof ArmPose) => (b[key] - a[key]) / 2;
				this.plan = settlePlan(this.variant, pose, {
					turn: Math.max(0, rate('turn')),
					back: rate('back'),
					ahead: rate('ahead'),
				});
				this.state = 'settling';
				this.settleFrom = now;
			}
		} else if (this.state === 'settling' && this.plan) {
			const t = now - this.settleFrom;
			if (t >= this.plan.end) return this.rest();
			pose = settlePose(this.plan, t);
		} else {
			active.delete(this);
			return;
		}
		if (this.visible) draw(this.parts, pose);
	}

	private rest() {
		draw(this.parts, LOGO);
		this.state = 'rest';
		this.plan = null;
		active.delete(this);
		this.el.removeAttribute('aria-busy');
		this.el.setAttribute('aria-label', 'ThingsBoard');
		this.waiting.splice(0).forEach((resolve) => resolve());
		this.el.dispatchEvent(new CustomEvent('markloader:settled', { bubbles: true }));
		// Started again while it was settling: it goes again from the logo.
		if (this.restart) {
			this.restart = false;
			this.start();
		}
	}
}

const controllers = new WeakMap<SVGSVGElement, Controller>();

export function markLoader(el: SVGSVGElement): MarkLoader {
	let c = controllers.get(el);
	if (!c) {
		c = new Controller(el);
		controllers.set(el, c);
	}
	return c;
}

/** Wires every `[data-mark-loader]`: its `data-loading` starts and stops it from now on. */
export function mountAllMarkLoaders(root: ParentNode = document): void {
	const watch = new MutationObserver((records) =>
		records.forEach(({ target }) => {
			const el = target as SVGSVGElement;
			if (el.hasAttribute('data-loading')) markLoader(el).start();
			else markLoader(el).stop();
		})
	);
	root.querySelectorAll<SVGSVGElement>('svg[data-mark-loader]').forEach((el) => {
		if (el.dataset.markLoaderMounted !== undefined) return;
		el.dataset.markLoaderMounted = '';
		watch.observe(el, { attributes: true, attributeFilter: ['data-loading'] });
		if (el.hasAttribute('data-loading')) markLoader(el).start();
	});
}
