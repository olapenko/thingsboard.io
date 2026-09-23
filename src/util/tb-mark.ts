import mark from '@root/assets/images/landings/draft/thingsboard-mark.svg?raw';

/**
 * The ThingsBoard mark for the white badges (Platform, Connect, Turn IoT data into action), with a
 * barely-there ink gradient in place of flat `currentColor`: graphite at the top-left to black at the
 * bottom-right, the same direction as the tile's own wash under it.
 *
 * A fill has to be an SVG paint server to take a gradient — CSS cannot reach inside an inlined path
 * — so the gradient ships inside the mark. The id is unique per call: an internal page stacks
 * several variants of the same visual, and a duplicated id resolves to whichever copy comes first,
 * which renders nothing if that copy sits in a hidden variant.
 */
let seq = 0;

export function inkedMark(): string {
	const id = `tb-mark-ink-${++seq}`;

	return mark
		.replace(
			/(<svg\b[^>]*>)/,
			`$1<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3d46"/><stop offset="1" stop-color="#000"/></linearGradient></defs>`
		)
		.replace('fill="currentColor"', `fill="url(#${id})"`);
}
