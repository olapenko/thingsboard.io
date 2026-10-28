import type { LogoProposalKey } from '@models/logo-room';

/**
 * Writing the Logo Room's records: what the room proposes (a status, a colour, a note) becomes a change
 * to a mark's file in `src/content/logo-room/marks/`. The same functions run in the browser, for Copy
 * as patch, and on the dev server, for Save to repo, so both make the same change.
 *
 * Only the `proposed` and `notes` blocks are rewritten, as whole blocks at the end of the frontmatter;
 * everything else in the file is left as it was written. No YAML library: the two blocks are written
 * here, and the rest is never parsed.
 */
export interface RecordNote {
	at: string;
	text: string;
}

export interface RecordProposal {
	treatments: Partial<Record<LogoProposalKey, string>>;
	/** New values for its tones, as hexes: either tone's light or dark value. */
	colours?: ProposedColours;
	/** A new name for the mark. */
	label?: string;
	/** Take the mark out of the set. */
	remove?: boolean;
	notes: RecordNote[];
}

/** A tone's values as a proposal changes them. */
export interface ProposedTone {
	light?: string;
	dark?: string;
}
export interface ProposedColours {
	first?: ProposedTone;
	second?: ProposedTone;
}
/** The tones a proposal changes, with only the values it sets; nothing when it sets none. */
export const proposedColours = (c?: ProposedColours): ProposedColours | undefined => {
	const tone = (t?: ProposedTone) =>
		t && (t.light || t.dark)
			? { ...(t.light ? { light: t.light } : {}), ...(t.dark ? { dark: t.dark } : {}) }
			: undefined;
	const first = tone(c?.first);
	const second = tone(c?.second);
	return first || second ? { ...(first ? { first } : {}), ...(second ? { second } : {}) } : undefined;
};

export const MARKS_DIR = 'src/content/logo-room/marks';
export const markPath = (id: string) => `${MARKS_DIR}/${id}.md`;
/** A mark id as a file name may have it: no path, no dots. */
export const isMarkId = (id: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id);

/** The room's treatment keys (`filled`, `black`) in the records' words, and back. */
const TO_RECORD: Record<string, LogoProposalKey> = { filled: 'colour', black: 'dark' };
const TO_ROOM: Record<string, string> = { colour: 'filled', dark: 'black' };
export const recordKey = (key: string) => TO_RECORD[key] ?? (key as LogoProposalKey);
export const roomKey = (key: string) => TO_ROOM[key] ?? key;

/** A scalar as Prettier would leave it: single quotes, double where the text has an apostrophe or a line break. */
const quote = (s: string) =>
	/[\n\r\t\\]/.test(s) || (s.includes("'") && !s.includes('"')) ? JSON.stringify(s) : `'${s.replace(/'/g, "''")}'`;

/** The `proposed` and `notes` blocks, or nothing when there is nothing to say. */
export function proposalYaml(p: RecordProposal): string {
	const lines: string[] = [];
	const treatments = Object.entries(p.treatments).filter(([, v]) => v);
	const colours = proposedColours(p.colours);
	if (treatments.length > 0 || colours || p.label || p.remove) {
		lines.push('proposed:');
		if (treatments.length > 0) {
			lines.push('  treatments:');
			treatments.forEach(([k, v]) => lines.push(`    ${k}: ${v}`));
		}
		if (colours) {
			lines.push('  colours:');
			(['first', 'second'] as const).forEach((role) => {
				const t = colours[role];
				if (!t) return;
				lines.push(`    ${role}:`);
				if (t.light) lines.push(`      light: ${quote(t.light)}`);
				if (t.dark) lines.push(`      dark: ${quote(t.dark)}`);
			});
		}
		if (p.label) lines.push(`  label: ${quote(p.label)}`);
		if (p.remove) lines.push('  remove: true');
	}
	if (p.notes.length > 0) {
		lines.push('notes:');
		p.notes.forEach((n) => lines.push(`  - at: ${quote(n.at)}`, `    text: ${quote(n.text)}`));
	}
	return lines.join('\n');
}

/** A record's file with its `proposed` and `notes` blocks replaced by these. */
export function writeProposal(raw: string, p: RecordProposal): string {
	const m = raw.match(/^---\n([\s\S]*?)\n---(\n[\s\S]*)?$/);
	if (!m) throw new Error('Not a record: no frontmatter');
	const kept: string[] = [];
	let skipping = false;
	for (const line of m[1].split('\n')) {
		if (/^\S/.test(line)) skipping = /^(proposed|notes):/.test(line);
		if (!skipping) kept.push(line);
	}
	const blocks = proposalYaml(p);
	return `---\n${[...kept, ...(blocks ? [blocks] : [])].join('\n')}\n---${m[2] ?? '\n'}`;
}

/** A colour proposed for the set, as `palette.md` holds it. */
export interface PaletteColour {
	name: string;
	token: string;
	light: string;
	dark: string;
	/** A secondary: the mark whose colour it seconds. */
	of?: string;
}

export const PALETTE_PATH = 'src/content/logo-room/palette.md';

/** The token a named colour would become: `--color-product-` and its name in lowercase words. */
export const tokenOf = (name: string) =>
	`--color-product-${
		name
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '') || 'colour'
	}`;

/** `palette.md` with its `proposed` block replaced by these colours; the rest of the file as it was. */
export function writePalette(raw: string, colours: PaletteColour[]): string {
	const m = raw.match(/^---\n([\s\S]*?)\n---(\n[\s\S]*)?$/);
	if (!m) throw new Error('Not a record: no frontmatter');
	const kept: string[] = [];
	let skipping = false;
	for (const line of m[1].split('\n')) {
		if (/^\S/.test(line)) skipping = /^proposed:/.test(line);
		if (!skipping) kept.push(line);
	}
	const block =
		colours.length === 0
			? ['proposed: []']
			: [
					'proposed:',
					...colours.flatMap((c) => [
						`  - name: ${quote(c.name)}`,
						`    token: ${c.token}`,
						`    light: ${quote(c.light)}`,
						`    dark: ${quote(c.dark)}`,
						...(c.of ? [`    of: ${c.of}`] : []),
					]),
				];
	return `---\n${[...kept, ...block].join('\n')}\n---${m[2] ?? '\n'}`;
}

/** A mark drafted in the Studio, as its record and its artwork would hold it. */
export interface NewMark {
	id: string;
	label: string;
	group: 'Platform' | 'Ecosystem' | 'AI';
	about: string;
	hue: string;
	/** Its colour's dark value, where one is set; the room's rule gives it otherwise. */
	dark?: string;
	/** The second tone, for two-tone artwork. */
	second?: string;
	/** The second tone's dark value, where one is set. */
	secondDark?: string;
	status: 'exploring' | 'designed';
	order: number;
}

/** Where a mark's own artwork goes when the room draws it from a file. */
export const markArtPath = (id: string) => `${MARKS_DIR}/${id}/mark.svg`;

/**
 * The paint of two-tone artwork's second tone, as its file writes it: the tile's second colour, or the
 * first's where nothing sets one (the file opened on its own). Never a third tone.
 */
export const TONE_2 = 'var(--lc-tone-2, currentColor)';
/** Whether an artwork paints a second tone. */
export const isTwoTone = (svg: string) => svg.includes('--lc-tone-2');

/**
 * A new mark's record: its group's tile as its signature (White for the Ecosystem, Colour for the
 * platform and the AI), that treatment and its glyph at the status proposed, its colour as `hue`, and
 * the rest left for the team to write, each "To write" a question the review answers.
 */
export function newMarkRecord(m: NewMark): string {
	const signature = m.group === 'Ecosystem' ? 'white' : 'colour';
	return [
		'---',
		`order: ${m.order}`,
		`label: ${quote(m.label)}`,
		`group: ${m.group}`,
		`about: ${quote(m.about || 'To write: what the product is, and what its mark carries.')}`,
		`signature: ${signature}`,
		`colourRole: ${signature === 'white' ? 'Accent beside the white tile' : 'Tile fill'}`,
		'colours:',
		'  first:',
		`    light: ${quote(m.hue)}`,
		...(m.dark ? [`    dark: ${quote(m.dark)}`] : []),
		...(m.second ? ['  second:', `    light: ${quote(m.second)}`] : []),
		...(m.second && m.secondDark ? [`    dark: ${quote(m.secondDark)}`] : []),
		'treatments:',
		`  ${signature}: ${m.status}`,
		`  glyph: ${m.status}`,
		'guideline:',
		'  symbol:',
		"    - 'To write: the parts of the drawing'",
		`  light: ${quote(signature === 'white' ? 'White tile, in its own colours' : 'Colour tile, its colour')}`,
		"  dark: 'To write'",
		"  small: 'The glyph, in its colour'",
		'  dont: []',
		'actions:',
		'  - kind: decide',
		"    what: 'whether it joins the set: added in the Studio'",
		'---',
		'',
	].join('\n');
}

/** Notes from the file and from this browser, once each, oldest first. */
export const mergeNotes = (...lists: RecordNote[][]) =>
	[...new Map(lists.flat().map((n) => [`${n.at}|${n.text}`, n])).values()].sort((a, b) => a.at.localeCompare(b.at));

/**
 * A unified diff of one file, as `git apply` takes it: one hunk around what changed, three lines of
 * context. Empty when nothing changed.
 */
export function unifiedDiff(path: string, before: string, after: string): string {
	if (before === after) return '';
	// A file that is not there yet: a creation, which git apply takes from /dev/null.
	if (before === '') {
		const b = after.split('\n');
		if (b.at(-1) === '') b.pop();
		return [
			`diff --git a/${path} b/${path}`,
			'new file mode 100644',
			'--- /dev/null',
			`+++ b/${path}`,
			`@@ -0,0 +1,${b.length} @@`,
			...b.map((l) => `+${l}`),
			'',
		].join('\n');
	}
	const a = before.split('\n');
	const b = after.split('\n');
	// Both end in a newline, so both end in an empty string: drop it, as a diff counts lines.
	if (a.at(-1) === '') a.pop();
	if (b.at(-1) === '') b.pop();
	let head = 0;
	while (head < a.length && head < b.length && a[head] === b[head]) head++;
	let tail = 0;
	while (tail < a.length - head && tail < b.length - head && a[a.length - 1 - tail] === b[b.length - 1 - tail]) tail++;
	const from = Math.max(0, head - 3);
	const aEnd = Math.min(a.length, a.length - tail + 3);
	const bEnd = Math.min(b.length, b.length - tail + 3);
	const range = (start: number, end: number) => `${end - start === 0 ? start : start + 1},${end - start}`;
	return [
		`diff --git a/${path} b/${path}`,
		`--- a/${path}`,
		`+++ b/${path}`,
		`@@ -${range(from, aEnd)} +${range(from, bEnd)} @@`,
		...a.slice(from, head).map((l) => ` ${l}`),
		...a.slice(head, a.length - tail).map((l) => `-${l}`),
		...b.slice(head, b.length - tail).map((l) => `+${l}`),
		...a.slice(a.length - tail, aEnd).map((l) => ` ${l}`),
		'',
	].join('\n');
}
