import { ARM, CENTER, CHIP, armDash, armTransform } from '@util/tb-mark-parts';

/**
 * The script behind `ui/MarkLoader`: the ThingsBoard mark as a loader. Started, the chip in the
 * middle tucks its pins in and shrinks away while the two arms pull onto one center and turn.
 * Stopped, the arms turn on to the next half turn (the mark looks the same every half turn), push
 * back out, and the chip grows back with its pins: at rest it is the logo again, exactly.
 *
 * Driven by `data-loading` on the SVG: present starts it, absent stops it, so a page toggles one
 * attribute. `markLoader(svg)` gives the same as calls; its `stop()` resolves once the logo is back,
 * when `markloader:settled` fires on the SVG.
 *
 * One frame loop for every loader on the page. Each frame is a pose computed from the time alone,
 * so a loader that misses frames catches up rather than slowing down, and a loader out of view keeps
 * its clock and skips its writes. Under `prefers-reduced-motion`, or `data-motion="reduced"` on the
 * SVG, nothing turns or travels: the chip fades and the arms pulse.
 *
 * The variants differ in what the arms do while loading (`ARMS`); going and coming back are shared,
 * except that Flip waits for its next rest before it comes back (`canSettle`).
 */
export const MARK_LOADER_VARIANTS = ['spin', 'chase', 'orbit', 'flip'] as const;
export type MarkLoaderVariant = (typeof MARK_LOADER_VARIANTS)[number];

/** Spinning, the arms' outer edge would reach past the mark's box; this keeps them inside it. */
const LOAD_SCALE = 0.89;
/** A load shorter than this still plays the whole way in before it settles, rather than flinching. */
const MIN_LOAD = 650;
/** Coming back, each pin pops out this many ms after the one before it. */
const PIN_STAGGER = 18;

/** What the arms do: turned `turn` degrees, each half of an arc reaching `back`/`ahead` degrees from its ring. */
interface ArmPose {
	turn: number;
	back: number;
	ahead: number;
	/** The faint circle the rings run on, as an opacity. */
	track: number;
}

interface Pose extends ArmPose {
	/** 0 with the arms on their own centers (the logo), 1 with both on `CENTER`. */
	pull: number;
	/** The arms' opacity: below 1 only in the reduced pulse. */
	arms: number;
	bodyScale: number;
	bodyTurn: number;
	chip: number;
	pins: number[];
}

const LOGO: Pose = {
	turn: 0,
	back: ARM.halfSweep,
	ahead: ARM.halfSweep,
	track: 0,
	pull: 0,
	arms: 1,
	bodyScale: 1,
	bodyTurn: 0,
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
	spin: (t) => ({ turn: (360 / 1100) * run(t), back: ARM.halfSweep, ahead: ARM.halfSweep, track: 0 }),

	chase: (t) => {
		const r = run(t);
		const u = CHASE_U0 + (2 * Math.PI * r) / CHASE.period;
		const sweep = CHASE.mid - CHASE.swing * Math.cos(u);
		return {
			turn: (360 / CHASE.lap) * r + chaseTravel(u) - chaseTravel(CHASE_U0),
			back: sweep,
			ahead: sweep,
			track: 0,
		};
	},

	// Orbit: the leading half of each arc draws back into its ring and the trailing half shortens to a
	// tail that grows with the speed; the rings run round a faint track.
	orbit: (t) => {
		const tuck = inOutCubic(clamp((t - 60) / 320));
		const speed = smooth(clamp((t - 160) / 600));
		return {
			turn: (360 / 950) * run(t, 160, 600),
			back: lerp(ARM.halfSweep, 12 + 22 * speed, tuck),
			ahead: lerp(ARM.halfSweep, 0, tuck),
			track: 0.1 * smooth(clamp((t - 200) / 500)),
		};
	},

	flip: (t) => {
		const tc = t - FLIP.delay;
		if (tc <= 0) return { turn: 0, back: ARM.halfSweep, ahead: ARM.halfSweep, track: 0 };
		const cycle = FLIP.move + FLIP.rest;
		const k = Math.floor(tc / cycle);
		const f = Math.min(1, (tc - k * cycle) / FLIP.move);
		const lean = FLIP.lean * Math.sin(Math.PI * f) ** 2;
		return { turn: 180 * (k + inOutCubic(f)), back: ARM.halfSweep + lean, ahead: ARM.halfSweep - lean, track: 0 };
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

/** Going: the pins tuck in one after another, clockwise from the top; the body winds back and shrinks. */
function loadingPose(variant: MarkLoaderVariant, t: number, reduced: boolean): Pose {
	if (reduced) {
		return {
			...LOGO,
			arms: 0.4 + 0.6 * (0.5 + 0.5 * Math.cos((2 * Math.PI * t) / 1600)),
			chip: 1 - clamp(t / 220),
		};
	}
	const q = clamp((t - 90) / 320);
	return {
		...ARMS[variant](t),
		pull: inOutCubic(clamp((t - 100) / 420)),
		arms: 1,
		bodyScale: Math.max(0, 1 - inBack(q)),
		bodyTurn: -45 * inCubic(q),
		chip: 1 - clamp((t - 300) / 110),
		pins: CHIP.pins.map((_, i) => 1 - inCubic(clamp((t - 20 * i) / 170))),
	};
}

/**
 * Coming back, from `from` at the moment of stopping, turning `speed` degrees a ms. The turn carries
 * on to the next half turn at least 180 ms of travel away, on a curve that starts at that speed and
 * slows to rest. It takes 1.6 times as long as holding the speed would, which never speeds up first,
 * capped at 1.1 s: Chase stopped at its slowest can gain a few percent before it slows. The arms push
 * out over its last stretch and the chip grows back as it lands, its pins popping out after it.
 */
function settlePlan(from: Pose, speed: number) {
	let target = from.turn;
	let turnFor = 0;
	if (speed > 0.002) {
		target = 180 * Math.ceil((from.turn + speed * 180) / 180 - 1e-9);
		turnFor = Math.min(1100, (1.6 * (target - from.turn)) / speed);
	} else if (from.turn % 180 > 0.01) {
		target = 180 * Math.ceil(from.turn / 180);
		turnFor = 300 + (target - from.turn) * 2.5;
	}
	const arcsAt = Math.max(0, turnFor - 420);
	const pullAt = Math.max(0, turnFor - 330);
	const chipAt = Math.max(0, turnFor - 140);
	const pinsAt = chipAt + 120;
	const end = Math.max(turnFor + 80, arcsAt + 420, pullAt + 400, pinsAt + PIN_STAGGER * (CHIP.pins.length - 1) + 240);
	return { from, speed, target, turnFor, arcsAt, pullAt, chipAt, pinsAt, end };
}

type Plan = ReturnType<typeof settlePlan>;

function settlePose(p: Plan, t: number): Pose {
	const { from } = p;
	let turn = from.turn;
	if (p.turnFor > 0) {
		// Cubic Hermite: from `from.turn` at `speed` to `target` at rest.
		const u = clamp(t / p.turnFor);
		const h10 = u * u * u - 2 * u * u + u;
		const h01 = -2 * u * u * u + 3 * u * u;
		turn = from.turn + h10 * p.turnFor * p.speed + h01 * (p.target - from.turn);
	}
	const arcs = inOutCubic(clamp((t - p.arcsAt) / 420));
	const chip = clamp((t - p.chipAt) / 420);
	return {
		turn,
		back: lerp(from.back, ARM.halfSweep, arcs),
		ahead: lerp(from.ahead, ARM.halfSweep, arcs),
		track: lerp(from.track, 0, arcs),
		pull: lerp(from.pull, 0, inOutCubic(clamp((t - p.pullAt) / 400))),
		arms: lerp(from.arms, 1, clamp(t / 240)),
		bodyScale: lerp(from.bodyScale, 1, outBack(chip)),
		bodyTurn: lerp(from.bodyTurn, 0, outCubic(chip)),
		chip: lerp(from.chip, 1, clamp(chip * 3)),
		pins: from.pins.map((k, i) => lerp(k, 1, outBack(clamp((t - p.pinsAt - PIN_STAGGER * i) / 240)))),
	};
}

// ── Drawing ──
interface Parts {
	arms: SVGGElement;
	arm: SVGGElement[];
	back: SVGPathElement[];
	ahead: SVGPathElement[];
	track: SVGCircleElement;
	chip: SVGGElement;
	body: SVGPathElement;
	pins: SVGPathElement[];
}

/** A number for an attribute, to three places. */
const num = (x: number) => String(Math.round(x * 1000) / 1000);

function setDash(path: SVGPathElement, sweep: number) {
	const dash = armDash(sweep);
	if (!dash) return path.setAttribute('visibility', 'hidden');
	path.removeAttribute('visibility');
	path.setAttribute('stroke-dasharray', dash.array);
	path.setAttribute('stroke-dashoffset', dash.offset);
}

function draw(parts: Parts, pose: Pose) {
	const scale = 1 - pose.pull * (1 - LOAD_SCALE);
	const turn = pose.turn % 360;
	parts.arm.forEach((g, i) => g.setAttribute('transform', armTransform(i as 0 | 1, pose.pull, turn, scale)));
	parts.back.forEach((p) => setDash(p, pose.back));
	parts.ahead.forEach((p) => setDash(p, pose.ahead));
	parts.arms.setAttribute('opacity', num(pose.arms));
	parts.track.setAttribute('opacity', num(pose.track));
	parts.track.setAttribute('transform', `translate(${CENTER.x} ${CENTER.y}) scale(${num(scale)})`);

	const { x, y } = CHIP.center;
	parts.chip.setAttribute('opacity', num(pose.chip));
	parts.body.setAttribute(
		'transform',
		`translate(${x} ${y}) rotate(${num(pose.bodyTurn)}) scale(${num(Math.max(0, pose.bodyScale))}) translate(${-x} ${-y})`
	);
	parts.pins.forEach((pin, i) => {
		const k = pose.pins[i];
		if (k <= 0.001) return pin.setAttribute('visibility', 'hidden');
		pin.removeAttribute('visibility');
		const [bx, by] = CHIP.pins[i].base;
		pin.setAttribute('transform', `translate(${bx} ${by}) scale(${num(k)}) translate(${-bx} ${-by})`);
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
			track: el.querySelector('[data-track]')!,
			chip: el.querySelector('[data-chip]')!,
			body: el.querySelector('[data-body]')!,
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
				// The turn's rate at this instant, from a millisecond either side.
				const turnAt = (ms: number) => loadingPose(this.variant, ms, this.reduced).turn;
				this.plan = settlePlan(pose, Math.max(0, (turnAt(t + 1) - turnAt(t - 1)) / 2));
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
