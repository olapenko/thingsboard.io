import type { CliSeg } from './cli-terminal';

/**
 * The shape of a typed `AgentTerminal` session — a coding-agent transcript rather than a shell log.
 *
 * Beside `cli-terminal.ts` for the same reason that file exists: the component's frontmatter, its
 * `<script>` and the data file all need one definition and none can import it from the others.
 *
 * A transcript is a list of TURNS, in the shape a coding agent's console prints them:
 *
 *   ❯ the person's prompt
 *   ● Tool(argument)
 *     └ what the tool returned
 *   ● the agent's answer
 *     ✔ a point under it
 *
 * The player gives every turn its own leading glyph in a gutter column, wraps the text under itself
 * (prose wraps; a shell log never does), and opens a little air above each new turn.
 */

/**
 * The person's turn, typed into the docked input after the `❯` prompt and echoed into the log on
 * send. Either prose (`text`) or a command handed to the agent as coloured segments (`cmd`) — the
 * same segments `CliTerminal` uses, so a `tb …` line is coloured the way the real CLI window is.
 */
export interface AgentUserTurn {
	role: 'user';
	text?: string;
	cmd?: CliSeg[];
	/**
	 * The console OFFERS this line rather than the person typing it: it appears after the caret as
	 * ghost text — the next step, suggested — and a moment later is accepted whole, as Tab does, then
	 * sent. For the follow-up command that plainly comes next, where typing it out would be theatre.
	 */
	suggested?: boolean;
	/**
	 * With `suggested`: the offer is shown and LEFT STANDING — never accepted, never sent. For the
	 * last turn of a transcript, so the loop ends on the console holding out a reply.
	 */
	pending?: boolean;
}

/**
 * The agent calling a tool: `Skill(update-solution)`, `Bash(tb push …)`. It runs for `spin` ms,
 * then `result` lands NESTED under it behind a `└` — the tree glyph that says "this came back from
 * the line above". `ok` colours the result as a success.
 */
export interface AgentToolTurn {
	role: 'tool';
	text: string;
	spin: number;
	result?: string;
	ok?: boolean;
}

/**
 * The agent speaking. The text streams in word by word — the tell of a model, against a shell's
 * whole lines — and `items` follow as indented bullets, one at a time.
 */
export interface AgentSayTurn {
	role: 'agent';
	text: string;
	items?: string[];
	/**
	 * A closing paragraph after the items — a question back to the person, typically — set as a
	 * continuation of the same message: indented under the `●`, running straight on under the items. Streamed like the rest.
	 */
	tail?: string;
}

/** One coloured run of a banner line. */
export interface BannerSeg {
	/** `brand` is the accent; `ok` the success green; `arg` the CLI's argument violet; `dim`; `text`. */
	t: 'brand' | 'ok' | 'arg' | 'dim' | 'text';
	v: string;
}

/**
 * What the CLI prints as it launches, before anyone types: the mark in ASCII down the left, and a
 * line of status beside each row of it. Printed whole, at once — a banner is not streamed.
 */
export interface AgentBanner {
	role: 'banner';
	/** The art, one string per row, in a fixed-width column. */
	art: string[];
	/** The line beside each row of art; an empty list leaves that row's right side blank. */
	lines: BannerSeg[][];
}

export type AgentStep = AgentBanner | AgentUserTurn | AgentToolTurn | AgentSayTurn;
