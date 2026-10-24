/**
 * Checks the Logo Room's records (`src/content/logo-room/`) without a build: each file against its
 * schema, then what the schemas cannot see — the records against each other.
 *
 *   - marks: a unique `order`; candidate ids unique, `current` first; a proposal that only repeats a
 *     decided status; notes in order
 *   - rounds: the marks they pick, review and set exist; a pick names a drawn candidate of its mark;
 *     no mark both picked and reviewed; no mark in two open rounds; an open round has no `decided`
 *     date and a decided one has one, not before it opened
 *
 * Whether a record and the room's drawings agree (a status needs a drawing) is checked by the room
 * itself, as it renders: `pnpm dev`, or a build.
 *
 * Usage:
 *   pnpm lint:logoroom
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { logoMarkSchema, logoRoundSchema, type LogoMark, type LogoRound } from '../src/models/logo-room.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'src/content/logo-room');
const problems: string[] = [];
const report = (file: string, what: string) => problems.push(`${relative(ROOT, file)}: ${what}`);

function load<T>(sub: string, schema: { safeParse: (v: unknown) => { success: boolean; data?: T; error?: unknown } }) {
	const out = new Map<string, { file: string; data: T }>();
	for (const name of readdirSync(join(DIR, sub))
		.filter((n) => n.endsWith('.md'))
		.sort()) {
		const file = join(DIR, sub, name);
		const frontmatter = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---(\n|$)/)?.[1];
		if (frontmatter === undefined) {
			report(file, 'no frontmatter');
			continue;
		}
		let raw: unknown;
		try {
			raw = parse(frontmatter);
		} catch (e) {
			report(file, `YAML: ${e instanceof Error ? e.message.split('\n')[0] : e}`);
			continue;
		}
		const result = schema.safeParse(raw);
		if (!result.success) {
			const issues = (result.error as { issues: { path: PropertyKey[]; message: string }[] }).issues;
			issues.forEach((i) => report(file, `${i.path.join('.') || '(root)'}: ${i.message}`));
			continue;
		}
		out.set(name.replace(/\.md$/, ''), { file, data: result.data as T });
	}
	return out;
}

const marks = load<LogoMark>('marks', logoMarkSchema);
const rounds = load<LogoRound>('rounds', logoRoundSchema);

// ── Marks ──
const orders = new Map<number, string>();
for (const [id, { file, data }] of marks) {
	const other = orders.get(data.order);
	if (other) report(file, `order ${data.order} is ${other}’s too`);
	orders.set(data.order, id);

	const ids = data.candidates.map((c) => c.id);
	if (new Set(ids).size !== ids.length) report(file, `candidate ids repeat: ${ids.join(', ')}`);
	if (ids.includes('current') && ids[0] !== 'current') report(file, 'the current candidate comes first');

	const decided = data.treatments as Record<string, string | undefined>;
	for (const [key, status] of Object.entries(data.proposed?.treatments ?? {}))
		if (decided[key] === status) report(file, `proposed.treatments.${key} repeats the decided ${status}`);

	const times = data.notes.map((n) => n.at.getTime());
	if (times.some((t, i) => i > 0 && t < times[i - 1])) report(file, 'notes are not oldest first');
}

// ── Rounds ──
const openRound = new Map<string, string>();
for (const [id, { file, data }] of rounds) {
	const named = [...data.picks.map((p) => p.mark), ...data.reviews, ...Object.keys(data.set)];
	named.filter((m) => !marks.has(m)).forEach((m) => report(file, `no mark “${m}” in marks/`));

	for (const pick of data.picks) {
		const candidate = marks.get(pick.mark)?.data.candidates.find((c) => c.id === pick.candidate);
		if (marks.has(pick.mark) && !candidate) report(file, `${pick.mark} has no candidate “${pick.candidate}”`);
		if (candidate?.toDraw) report(file, `${pick.mark}’s candidate ${pick.candidate} is not drawn yet`);
		if (data.reviews.includes(pick.mark)) report(file, `${pick.mark} is both picked and under review`);
	}

	if (data.state === 'open') {
		if (data.decided) report(file, 'an open round has no decided date');
		for (const m of new Set([...data.picks.map((p) => p.mark), ...data.reviews])) {
			const other = openRound.get(m);
			if (other) report(file, `${m} is in ${other} too, also open`);
			openRound.set(m, id);
		}
	} else if (!data.decided) report(file, 'a decided round needs its decided date');
	else if (data.decided < data.opened) report(file, 'decided before it opened');
}

if (problems.length > 0) {
	console.error(`Logo Room records: ${problems.length} problem${problems.length > 1 ? 's' : ''}\n`);
	problems.forEach((p) => console.error(`  ${p}`));
	process.exit(1);
}
console.log(`Logo Room records: ${marks.size} marks, ${rounds.size} rounds, all consistent.`);
