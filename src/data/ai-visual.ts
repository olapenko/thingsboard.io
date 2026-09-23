import { CONNECT_COPY } from './connect-visual';
import { DIGITAL_TWIN_COPY } from './digital-twin-visual';
import { NORMALIZE_COPY } from './normalize-visual';
import { PLATFORM_COPY } from './platform-visual';
import { SCALE_COPY } from './scale-visual';

/**
 * The AI section's copy, ported from the `tb-landing-prototype` repo (`src/sections/06-ai.html`).
 *
 * Copy that carries meaning lives here rather than in the component, per `Landing/CLAUDE.md`, so the
 * two columns can be redrawn without retyping the words and a product page can import the same
 * strings.
 *
 * WHAT CHANGED FROM THE PROTOTYPE, and why — the port is to this page's ladder, not char-for-char:
 *
 * - The prototype's section eyebrow ("AI · Built into the ThingsBoard IoT platform") is dropped.
 *   This page states a section's subject with `SectionHeader`'s squircle badge, not with a kicker;
 *   every other section on the homepage does, and an eyebrow here would be the only one.
 * - The title loses its hard `<br>`. `SectionHeader` balances its own lines and the page's measure
 *   is 1000, not the prototype's 1240 — the break landed mid-phrase here.
 * - The column eyebrows ("From a prompt", "From your terminal") are KEPT. They are the section's
 *   argument — the same platform reached two ways — and nothing else says it.
 */

export const AI_COPY = {
	title: 'Build IoT solutions faster than ever with AI inside ThingsBoard',
	body: 'From describing a project in plain English to complete dashboards, alarm rules, and data transformations with AI assistance — ThingsBoard cuts your development time from weeks to hours.',
	/**
	 * `sparkles-filled` at the brand indigo. The hue is the prototype's own `--ai-accent` (#3d50f5),
	 * which is this repo's `$color-brand` to the digit — so the port needed no colour decision here.
	 * It repeats the solution row's badge, which is correct: both are claims about building.
	 *
	 * FILLED rather than the outline. Tabler draws its outline glyphs at a 2px stroke on a 24px grid,
	 * which is tuned for a 24px glyph — blown up to the 34 this section's tile carries, the stroke
	 * stays 2 and the mark thins out as it grows. The filled cut has no stroke to fall behind.
	 */
	badge: { icon: 'tabler:sparkles-filled', color: '#3d50f5' },
};

export interface AiColumn {
	/** The kicker over the column title — the route this column describes. */
	eyebrow: string;
	title: string;
	body: string;
	/**
	 * The column's hue, for everything that is not TYPE: the band's wash and (for the CLI) the
	 * terminal's prompt and caret.
	 *
	 * The prototype's own values, taken from it running in the approved config rather than remapped.
	 */
	accent: string;
	/**
	 * The same hue, darkened, for the kicker — the one place the accent is set as 14px type.
	 *
	 * THIS EXISTS BECAUSE ONE VALUE COULD NOT DO BOTH JOBS, which an earlier pass here asserted it
	 * could. That pass checked both accents as type ON WHITE — 5.29:1 and 4.52:1 — and concluded they
	 * cleared 4.5:1. The kicker is never on white. It sits in a band washed with its own accent, so
	 * the background it is read against is tinted with the very colour it is printed in, and the
	 * measured ratios where the text actually lands were 4.94:1 and **4.18:1**. The purple failed.
	 *
	 * These values are derived rather than picked: each is its accent scaled toward black until it
	 * clears 5:1 against the DEEPEST point of that band's wash (the accent at 20% over white), so the
	 * kicker holds the standard wherever the copy sits — and the copy does move, riding higher or
	 * lower in the band with the breakpoint. Where it sits today both land at about 6:1, which also
	 * ends a second problem: at 4.94 and 4.18 the two kickers did not read as the same weight.
	 *
	 *   #0b6952  green   accent x 0.86   5.03:1 at the band's foot, 6.09:1 as set, 6.66:1 on white
	 *   #6249be  purple  accent x 0.79   5.06:1 at the band's foot, 6.03:1 as set, 6.56:1 on white
	 *
	 * Re-derive both if the wash's 20% changes, if the kicker moves down the band, or if the type
	 * drops below 14px.
	 */
	accentText: string;
}

export const AI_COLUMNS: { assistant: AiColumn; cli: AiColumn } = {
	assistant: {
		eyebrow: 'From a prompt',
		title: 'AI assistants built into the platform',
		body: 'A unified AI layer that helps you build every part of your IoT solution through natural language — from a full prototype (AI Solution Creator) to individual dashboards, rules, and calculated fields.',
		accent: '#0d7a5f',
		accentText: '#0b6952',
	},
	cli: {
		eyebrow: 'From your terminal',
		title: 'ThingsBoard CLI for AI coding agents',
		body: 'Develop your IoT solution from your terminal. Integrate with AI coding agents to build, test, and deploy ThingsBoard as code.',
		accent: '#7c5cf0',
		accentText: '#6249be',
	},
};

/**
 * The conversation the assistant window plays out, as a list of exchanges.
 *
 * TWO of them, and the second is doing a specific job. The first shows a Calculated Field being
 * created; the second shows an Alarm Rule — a different one of the four things the Assistant
 * configures (`docs/user-guide/ai-assistant`: Dashboards, Alarm Rules, Calculated Fields,
 * Notifications) — and shows it as a SHORT FOLLOW-UP that says "it" rather than naming the field
 * again.
 *
 * That last part is the point of having a second prompt at all. The docs make conversation memory
 * an explicit feature — "Stay in the same chat. The Assistant remembers everything from the current
 * conversation… Follow-ups can be short" — and a single exchange cannot demonstrate it. One prompt
 * shows that the Assistant understands English; two show that it is holding the thread.
 *
 * The follow-up also carries a threshold, a unit, a window and a severity, because those are the
 * one class of detail the docs say the Assistant cannot infer.
 *
 * ⚠ KEEP EACH PROMPT AT OR UNDER 40 CHARACTERS. The composer holds about 45 at the window's native
 * width, and both of these sat within a character or two of that — close enough that any edit would
 * have pushed them over. They no longer BREAK when they do (see `white-space: nowrap` on
 * `.assistant__typed`), but a prompt long enough to scroll is a prompt whose opening words the
 * reader never sees being typed. 40 leaves room to edit them without re-measuring.
 */
export const AI_ASSISTANT_DEMO = {
	exchanges: [
		{
			prompt: 'Dew point calculated field on thermostat',
			/** `<b>` marks the entities the Assistant created; rendered with `set:html`, and ours. */
			reply:
				'Created calculated field <b>Dew Point</b> on device profile <b>thermostat</b>. Output key: <b>dewPoint</b>.',
		},
		{
			/**
			 * "it" is the whole demonstration: no entity named, the Assistant carries it from above.
			 *
			 * `18C`, not `18 °C`, because nobody reaches for the degree sign mid-sentence in a chat box —
			 * they type the two characters next to each other and move on. The REPLY writes it properly,
			 * which makes the sloppiness worth keeping: the pair shows the Assistant taking informal input
			 * and returning a correctly formed rule, which is a claim the section is making anyway.
			 */
			prompt: 'Warn me if it stays above 18C for 10 min',
			reply:
				'Created alarm rule <b>High Dew Point</b> on <b>dewPoint</b> — warning above <b>18 °C</b> for 10 minutes.',
		},
	],
	hello: 'Hello! I’m your AI Assistant',
	lead: 'I can help you set up and manage your Devices, Dashboards, Calculated Fields, Alarm Rules and Notifications — just describe what you need, and I’ll handle the rest.',
	chip: 'Connect my device',
	placeholder: 'Describe what you’d like to set up…',
};

/** What the window is doing, for the `role="img"` label — it is a picture, not a live assistant. */
export const AI_ASSISTANT_LABEL =
	'The ThingsBoard AI Assistant: asked to add a dew point calculated field to the thermostat profile, then asked in a follow-up to warn above 18 °C, creating an alarm rule from the field it just made.';

/**
 * The CLI session the terminal types out.
 *
 * Ported from the prototype's `SCRIPT` verbatim — the same commands, the same waits, the same
 * braille spinner on the push. An earlier pass flattened this into plain strings and let the
 * terminal fade the finished rows in one at a time; that dropped both the typing and the spinner,
 * which are most of what makes the thing read as a session rather than a screenshot.
 *
 * The command is a list of SEGMENTS rather than one string because each part is coloured
 * differently, and the colouring is not derivable: `tb solution new cold-chain` is a two-word
 * subcommand plus an argument, `tb push cold-chain` is a one-word subcommand plus an argument, and
 * nothing in the text says which. Stating the segments is the only way the mock cannot mis-colour
 * itself.
 *
 * Every command is one the CLI actually takes, so the mock cannot drift into a syntax that does not
 * exist. Output lines are illustrative.
 */
export const AI_CLI_SESSION = [
	{
		cmd: [
			{ t: 'cmd', v: 'tb solution new ' },
			{ t: 'arg', v: 'cold-chain' },
		],
		wait: 520,
		out: [{ tick: true, tone: 'ok', text: 'solution cold-chain' }],
	},
	{
		cmd: [
			{ t: 'cmd', v: 'tb calculated-field save ' },
			{ t: 'flag', v: '--name ' },
			{ t: 'arg', v: 'mean-cargo-temp' },
		],
		wait: 760,
		out: [{ tick: true, tone: 'ok', text: 'calculated-field mean-cargo-temp' }],
	},
	{
		cmd: [
			{ t: 'cmd', v: 'tb validate ' },
			{ t: 'arg', v: 'cold-chain' },
		],
		wait: 640,
		out: [{ tone: 'dim', text: '7 entities \u00b7 0 errors' }],
	},
	{
		cmd: [
			{ t: 'cmd', v: 'tb push ' },
			{ t: 'arg', v: 'cold-chain ' },
			{ t: 'flag', v: '--profile ' },
			{ t: 'arg', v: 'prod ' },
			{ t: 'flag', v: '--run-tasks' },
		],
		wait: 420,
		out: [
			/** `spin` holds the braille spinner on this line for that many ms before the next one lands. */
			{ spin: 1500, tone: 'dim', text: 'pushing 7 entities \u2192 prod' },
			{ tick: true, tone: 'ok', text: 'cold-chain deployed' },
		],
	},
];

/** What the terminal is doing, for the `role="img"` label — it is a picture, not a live console. */
export const AI_CLI_LABEL =
	'A ThingsBoard CLI session: creating a cold-chain solution, saving a calculated field, validating, and pushing it to production.';

/**
 * The hues the section's mark cycles through: every OTHER section's badge colour on this page.
 *
 * READ FROM THOSE SECTIONS RATHER THAN RETYPED, which is the whole point of the export. The claim
 * the animation makes is "these are the colours this page is built out of" — a copied list would
 * stop being true the first time one of them was retuned, and would do it silently, because nothing
 * would look broken. Imported, the cycle follows the palette.
 *
 * ORDERED TO AVOID MUD, not by section order. CSS interpolates `background-color` through sRGB, so a
 * leg between two distant hues passes through the desaturated middle of the cube — green to orange
 * goes through olive, which is the one pairing on this page that reads as a rendering fault rather
 * than as a colour. The orange is the outlier (hue 22° against a spread of 150–268°) and it has to
 * sit next to something, so it sits between the two violets, where the midpoints are a plum and a
 * mulberry — colours, not sludge. The rest runs down the wheel: violet, blue, teal, green, and back
 * to the section's own indigo through a blue-teal.
 *
 * The first stop is NOT in this list: the cycle starts and ends at `AI_COPY.badge.color`, so the
 * mark is its own colour at rest and the animation is a departure that returns.
 */
export const AI_BADGE_CYCLE = [
	NORMALIZE_COPY.badge.color,
	DIGITAL_TWIN_COPY.badge.color,
	PLATFORM_COPY.badge.color,
	CONNECT_COPY.badge.color,
	SCALE_COPY.badge.color,
];
