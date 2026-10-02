/**
 * The shape of a typed `CliTerminal` session.
 *
 * Here rather than in the component because three places need the same definition and none of them
 * can import it from the other two: `CliTerminal.astro` types its own prop from it, its `<script>`
 * is a separate module that cannot see the component's frontmatter, and `src/data/ai-visual.ts`
 * holds the session itself. The types lived in all three, written out by hand, and that is how the
 * data drifted out of the component's `Step[]` without anything catching it — a bare array literal
 * widens `t: 'cmd'` to `t: string`, so the copy no longer satisfied the shape it was written for.
 *
 * `src/models` is where this codebase keeps a type several components share.
 */

/** One coloured run inside a typed command. */
export interface CliSeg {
	t: 'cmd' | 'flag' | 'arg';
	v: string;
}

/** One line the command prints. */
export interface CliOut {
	text: string;
	tone?: 'ok' | 'dim';
	/** Leads the line with a success tick instead of a dot. */
	tick?: boolean;
	/** Holds a braille spinner on this line for this many ms before moving on. */
	spin?: number;
}

/** One command and what it prints — the unit the typed player works through. */
export interface CliStep {
	/**
	 * The command as SEGMENTS rather than one string, because each part is coloured differently and
	 * the colouring is not derivable from the text: `tb solution new cold-chain` is a two-word
	 * subcommand plus an argument, `tb push cold-chain` is a one-word subcommand plus an argument,
	 * and nothing in the characters says which.
	 */
	cmd: CliSeg[];
	/** Pause between the command finishing and its first output, in ms. */
	wait?: number;
	out?: CliOut[];
}
