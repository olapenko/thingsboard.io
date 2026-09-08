/**
 * Geometry for the app shell's sparkline, shared by the server's first paint and the client's
 * later frames so the two are computed by one set of rules and cannot drift apart.
 *
 * Values are drawn against an explicit domain rather than their own min and max: an axis is a
 * claim about what "low" means, and only the metric knows that.
 */

export type Domain = [number, number];

export interface SparkView {
	w: number;
	h: number;
	pad: number;
}

/**
 * Horizontal distance between neighbouring points when `n` of them span the box. The window may
 * carry one extra point past the right edge — the reading that is about to arrive — which is why
 * the spacing is a function of the window size and not of the array length.
 */
export function segmentWidth(n: number, view: SparkView): number {
	return view.w / (n - 1);
}

export function sparkY(value: number, [lo, hi]: Domain, view: SparkView): number {
	return view.h - view.pad - ((value - lo) / (hi - lo)) * (view.h - view.pad * 2);
}

/**
 * Smooth line and its area as SVG path data.
 *
 * A Catmull-Rom spline through the points, converted to cubic Béziers. The box is stretched with
 * `preserveAspectRatio="none"`, which is safe here: a cubic Bézier is affine-invariant, so the
 * stretched curve is exactly the spline of the stretched points — no distortion of the shape,
 * only of its aspect.
 *
 * `window` is how many points span the box; `values` may hold one more, drawn past the right
 * edge so the line can slide left into place.
 */
export function sparkPaths(
	values: number[],
	domain: Domain,
	view: SparkView,
	window: number = values.length
): { line: string; area: string } {
	const seg = segmentWidth(window, view);
	const pts = values.map((v, i) => [i * seg, sparkY(v, domain, view)] as const);
	const f = (n: number) => n.toFixed(2);

	if (pts.length < 2) {
		const [x, y] = pts[0] ?? [0, view.h];
		return { line: `M${f(x)},${f(y)}`, area: `M${f(x)},${f(y)} L${f(x)},${f(view.h)} Z` };
	}

	let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
	for (let i = 0; i < pts.length - 1; i++) {
		const p0 = pts[Math.max(0, i - 1)];
		const p1 = pts[i];
		const p2 = pts[i + 1];
		const p3 = pts[Math.min(pts.length - 1, i + 2)];
		// Uniform Catmull-Rom: tangent at each point is the chord between its neighbours, scaled
		// by a sixth to land on the equivalent Bézier control points.
		const c1x = p1[0] + (p2[0] - p0[0]) / 6;
		const c1y = p1[1] + (p2[1] - p0[1]) / 6;
		const c2x = p2[0] - (p3[0] - p1[0]) / 6;
		const c2y = p2[1] - (p3[1] - p1[1]) / 6;
		d += ` C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2[0])},${f(p2[1])}`;
	}

	const last = pts[pts.length - 1];
	return {
		line: d,
		// Closed along the baseline so the area can carry a faint wash without a gradient — a
		// gradient needs an id, and ids collide the moment the component is used twice on a page.
		area: `${d} L${f(last[0])},${f(view.h)} L${f(pts[0][0])},${f(view.h)} Z`,
	};
}
