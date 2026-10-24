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
	colour?: string;
	notes: RecordNote[];
}

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
	if (treatments.length > 0 || p.colour) {
		lines.push('proposed:');
		if (treatments.length > 0) {
			lines.push('  treatments:');
			treatments.forEach(([k, v]) => lines.push(`    ${k}: ${v}`));
		}
		if (p.colour) lines.push(`  colour: ${quote(p.colour)}`);
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

/** Notes from the file and from this browser, once each, oldest first. */
export const mergeNotes = (...lists: RecordNote[][]) =>
	[...new Map(lists.flat().map((n) => [`${n.at}|${n.text}`, n])).values()].sort((a, b) => a.at.localeCompare(b.at));

/**
 * A unified diff of one file, as `git apply` takes it: one hunk around what changed, three lines of
 * context. Empty when nothing changed.
 */
export function unifiedDiff(path: string, before: string, after: string): string {
	if (before === after) return '';
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
