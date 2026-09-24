import type { CliStep } from '@models/cli-terminal';
import type { AgentStep } from '@models/agent-terminal';

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
	/**
	 * The non-breaking space between "than" and "ever" is load-bearing.
	 *
	 * This title is the longest on the page and is capped to two lines (`titleMeasure="headline"`).
	 * Left to itself the balancer splits it at the most EVEN point, which is between those two words:
	 *
	 *   Build IoT solutions faster than      462
	 *   ever with AI inside ThingsBoard      482
	 *
	 * Numerically perfect and wrong to read — "than ever" is one phrase and the line ends in the middle
	 * of it. Gluing the pair takes that break off the table and the balancer falls to the next best,
	 * which is also where the sentence divides: the claim on one line, the means on the other.
	 *
	 *   Build IoT solutions faster than ever   538
	 *   with AI inside ThingsBoard             407
	 *
	 * Less even, better English, and 538/407 is an ordinary headline shape. Keep the glue if the copy
	 * is edited; drop it only if "than ever" stops being a phrase.
	 */
	title: 'Build IoT solutions faster than\u00a0ever with AI inside ThingsBoard',
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
	/**
	 * A kicker that NAMES THE TOOL, for the toggle layout, where `eyebrow` has become the switch's
	 * label and the row would otherwise carry no name at all. Only the candidate copy sets it.
	 */
	kicker?: string;
	/**
	 * The switch's label for this route in the toggle layout, and its phone-width short form. Omitted,
	 * the switch uses `eyebrow` ("From a prompt") and the stock short forms.
	 */
	switchLabel?: string;
	switchShort?: string;
}

export const AI_COLUMNS: { assistant: AiColumn; cli: AiColumn } = {
	assistant: {
		eyebrow: 'From a prompt',
		// The switch names WHO does the work (2026-09-24, promoted with the agent terminal); the eyebrow
		// stays for the `bands` layout.
		switchLabel: 'Ask the Assistant',
		switchShort: 'Assistant',
		title: 'AI assistants built into the platform',
		body: 'A unified AI layer that helps you build every part of your IoT solution through natural language — from a full prototype (AI Solution Creator) to individual dashboards, rules, and calculated fields.',
		accent: '#0d7a5f',
		accentText: '#0b6952',
	},
	cli: {
		eyebrow: 'From your terminal',
		switchLabel: 'Brief your agent',
		switchShort: 'Agent',
		title: 'ThingsBoard CLI for AI coding agents',
		body: 'Develop your IoT solution from your terminal. Integrate with AI coding agents to build, test, and deploy ThingsBoard as code.',
		accent: '#7c5cf0',
		accentText: '#6249be',
	},
};

/**
 * CANDIDATE COPY — value first, with a kicker naming the tool. Judged at
 * `/internal/sections/ai/`; the homepage still reads `AI_COLUMNS`.
 *
 * The shipping headlines describe what each thing IS ("AI assistants built into the platform",
 * "ThingsBoard CLI for AI coding agents"). These say what you GET, and the name moves up into the
 * kicker, where it still reads first.
 *
 * Every claim is taken from the docs rather than written for effect:
 *
 *   Assistant  `user-guide/ai-assistant` — knows the platform and SEES YOUR DATA ("say 'my pumps'
 *              instead of listing device IDs"); configures Dashboards, Alarm Rules, Calculated
 *              Fields and Notifications; "never modifies your tenant without your confirmation".
 *   CLI        `user-guide/cli-solutions` — you describe the change to your AI coding agent and it
 *              builds, evolves and fixes the solution; "the agent commits every change it makes,
 *              so your whole IoT setup lives in git"; "the same project files deploy to dev,
 *              staging, and production" with `tb push`.
 *
 * ⚠ NOT "AI agents of your choice". The CLI supports exactly two agents today — Claude Code and
 * Antigravity (`tb init` writes `.claude/` or `.agents/` + `AGENTS.md`) — so the body names them
 * and the headline says "your coding agent". Widen it when the docs do.
 *
 * Headlines are held near 40 characters, the copy column's measure, so each balances onto two
 * lines like the rows above.
 *
 * The SWITCH names who does the work — "Ask the Assistant" / "Brief your agent" — rather than
 * where the input goes ("From a prompt" / "From your terminal"). Action-led, and the second half
 * is honest about the CLI's model: you brief an agent, it drives the CLI. It does repeat
 * "Assistant" with the chat's kicker; that was weighed and accepted. On a phone neither label fits
 * half the switch, so the short forms keep the pair parallel: "Assistant" / "Agent".
 */
export const AI_COLUMNS_VALUE: { assistant: AiColumn; cli: AiColumn } = {
	assistant: {
		...AI_COLUMNS.assistant,
		kicker: 'AI Assistant',
		switchLabel: 'Ask the Assistant',
		switchShort: 'Assistant',
		title: 'Skip the learning curve. Just describe it.',
		body: 'It knows the platform and sees your data, so “my pumps” is all it needs. It sets up dashboards, alarm rules, calculated fields and notifications — and changes nothing until you approve.',
	},
	cli: {
		...AI_COLUMNS.cli,
		kicker: 'ThingsBoard CLI',
		switchLabel: 'Brief your agent',
		switchShort: 'Agent',
		title: 'Turn your coding agent into an IoT engineer',
		body: 'Describe a change to Claude Code or Antigravity and it builds, fixes and evolves your solution as code. Every change is committed to git, and a single push ships it to dev, staging or production.',
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
export const AI_CLI_SESSION: CliStep[] = [
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
 * THE TERMINAL RUNS A CODING AGENT, not a shell — THE HOMEPAGE since 2026-09-24; `AI_CLI_SESSION` above
 * is the shell session it replaced, kept for `terminal="cli"` and the cards page.
 *
 * The transcript is the real one from Slack, lightly trimmed. A tighter cut was tried on 2026-09-24
 * (items under one line each, a three-word question) and REVERTED as too minimal — the wrapped
 * items are part of how an agent's answer reads: a request in plain English, the agent
 * calling `update-solution`, its answer in prose with a list of what changed, and the person handing
 * it a `tb push`. NO AGENT IS NAMED, anywhere — the window is recognisably an agent's transcript by
 * its SHAPE (a `>` prompt, `●` turns, prose that wraps, streamed words) and not by a logo.
 *
 * Added to the Slack transcript: the nested results (`⎿`) under the two tool calls — the skill's
 * summary, and the push seen to land, or the loop would end on a command with no answer. The agent
 * runs the handed-over push as `Bash(…)`, which is how a coding agent does run it. Results are
 * illustrative, as the CLI window's counts are.
 *
 * SIZE. The CLI window fitted nine short lines with no scroll; this is ~15 rows of wrapped prose and
 * the log SCROLLS, following its newest turn, with the input docked under it. The type stays at the
 * CLI window's 18px. Lines can be any length; a longer one only scrolls sooner.
 */
export const AI_AGENT_SESSION: AgentStep[] = [
	/**
	 * The CLI's launch banner, as pasted from the real thing (2026-09-24): the mark, the version, the
	 * profile it is pointed at, and the agent it found. The real banner names the agent; here it says
	 * "Coding agent" — nominative use would be lawful, but naming one tool under a transcript that
	 * mimics it reads as an endorsement, and the section's argument is any agent (decided 2026-09-24).
	 */
	{
		role: 'banner',
		art: [' _   _', '| |_| |__', "|  _| '_ \\", ' \\__|_.__/'],
		lines: [
			[],
			[
				{ t: 'brand', v: 'ThingsBoard CLI ' },
				{ t: 'dim', v: '4.3.1.5' },
			],
			[
				{ t: 'ok', v: '\u2713 ' },
				{ t: 'text', v: 'profile ' },
				{ t: 'arg', v: 'dev' },
				{ t: 'dim', v: ' \u203a thingsboard.cloud' },
			],
			[
				{ t: 'ok', v: '\u2713 ' },
				{ t: 'text', v: 'Coding agent detected' },
			],
		],
	},
	{
		role: 'user',
		text: 'Each freezer in my stores needs its own alarm limit. Let me set it from the dashboard.',
	},
	/** Both results are `ok`: what a tool returned is dim while it runs and green once it succeeded — one rule, twice. */
	{ role: 'tool', text: 'Skill(update-solution)', spin: 1600, result: 'attribute, alarm rule and dashboard updated', ok: true },
	{
		role: 'agent',
		text: 'Done. Each freezer now has its own temperature threshold:',
		items: [
			'New attribute temperatureThreshold, set to -15 °C on all freezers',
			'Freezer Too Warm alarm now reads each freezer’s own threshold',
			'Dashboard: the freezer view has a Temperature Threshold card to set it per freezer',
		],
		/** The agent hands the next step back as a question; the console then offers the command for it. */
		tail: 'Want me to push this to dev?',
	},
	/**
	 * SUGGESTED, not typed: once the change is made, the push is the obvious next step, so the console
	 * offers it as ghost text and the person takes it with Tab. Typing it out was theatre — and it is
	 * the one thing in the window that shows the console knows what comes next.
	 */
	{
		role: 'user',
		suggested: true,
		cmd: [
			{ t: 'cmd', v: 'tb push ' },
			{ t: 'arg', v: 'smart-retail ' },
			{ t: 'flag', v: '--profile ' },
			{ t: 'arg', v: 'dev' },
		],
	},
	/** The agent runs the command it was handed, and the result nests under the call. */
	{
		role: 'tool',
		text: 'Bash(tb push smart-retail --profile dev)',
		// 2.6s: a push of nine entities takes a few seconds; 1.5 read as instant.
		spin: 2600,
		result: 'smart-retail deployed → dev · 9 entities',
		ok: true,
	},
	/** The loop ends on the console holding out a reply — shown as a suggestion, never sent. */
	{ role: 'user', suggested: true, pending: true, text: 'Easy!' },
];

/** What the terminal is doing, for the `role="img"` label — it is a picture, not a live console. */
export const AI_AGENT_LABEL =
	'A coding agent in a terminal: asked in plain English to give each freezer its own alarm limit, it updates the solution, lists what changed, and the smart-retail solution is pushed to the dev profile.';

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
