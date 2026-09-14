/**
 * Content for the white-labeling key visual.
 *
 * The copy is the published section's, kept verbatim. The visual it replaces was a screenshot of
 * the White Labeling settings form — a logo uploader, two palette dropdowns and an "Advanced CSS"
 * button — which shows the WORK rather than the RESULT. Nobody buys a file picker. The thing worth
 * showing is a dashboard that is already somebody else's, and then another one, and another.
 *
 * Brands, telemetry and rail come from `solution-flow.ts`, so the app in this visual and the app at
 * the end of the device-to-end-user flow are the same app. That is the point: one product, three
 * customers' colours.
 */

export const WHITELABEL_COPY = {
	// "White-labeling" names the feature; every other headline in this set makes a promise —
	// "Bring legacy equipment online", "Build IoT solutions from device to end-user". This one is
	// what the feature is FOR: the platform leaves wearing your name, not ours.
	title: 'Ship it as your own product',
	// The published sentences, tightened to the length its neighbours run to. The three claims are
	// kept intact because each one answers a different objection: two minutes answers "how long",
	// no restart answers "what does it cost me to try", and the sub-customer line answers the one
	// that actually decides deals — whether your customers can do it too.
	body: 'Your logo, your colours, your domain, across the whole interface in two minutes — no coding, no service restart. Your customers can rebrand their own view, and so can theirs.',
	link: { text: 'See how white-labeling works', href: '/docs/user-guide/white-labeling/' },
};

/**
 * What the switcher calls itself.
 *
 * Deliberately outside the app frame. Inside, it would read as a tenant switcher the product ships
 * — which it is not; this is a control for the reader, not a feature. Saying "preview" once is what
 * keeps that honest.
 */
export const WHITELABEL_SWITCH = {
	label: 'Preview as',
};
