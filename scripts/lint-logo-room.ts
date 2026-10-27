/**
 * Checks the Logo Room's records (`src/content/logo-room/`) without a build: each file against its
 * schema, then what the schemas cannot see — the records against each other.
 *
 *   - marks: a unique `order`; candidate ids unique, `current` first, none named `mark`; a proposal
 *     that only repeats a decided status or the mark's own name; notes in order; a `hue` only on a mark
 *     drawn from its own file
 *   - rounds: names unique; the marks they pick, review, set, route through and recolour exist; a
 *     palette colour holds 3:1 against white, as a Colour tile's white mark needs; a pick names a drawn candidate of its mark;
 *     no mark both picked and reviewed; no mark in two open rounds; an open round has no `decided`
 *     date and a decided one has one, not before it opened
 *
 *   - artwork: each file in `marks/<mark>/` is `<candidate>.svg` for a candidate of that mark (not
 *     `current`), or `mark.svg`, the mark's own artwork; each with a viewBox and nothing that runs; a
 *     candidate with a file is no longer `toDraw`
 *   - two tones: a `second` only on a mark whose `mark.svg` paints a second tone, and one on every such
 *     mark; the second tone painted as `TONE_2`, nothing else
 *   - a new mark: the record the Studio writes for a mark added there is one the schema takes, and its
 *     creation diff is one `git apply --check` takes
 *   - the icon picker (`_room-icons.ts`): every icon in Tabler; the icons proposed each once, each with a
 *     filled twin, none a mark's symbol; the taken icons by marks that exist
 *   - palette.md: each proposed colour's token unique and not in the theme yet; its light value 3:1 on
 *     white, its dark value 3:1 on night; its writer, tried as the marks' is below
 *   - the patch writer (what Copy as patch and Save to repo write), tried on every mark: a probe
 *     proposal comes out as a record the schema takes, still carrying the probe, and as a diff that
 *     `git apply --check` takes against the file on disk; a record's own proposal written twice is
 *     written the same
 *
 * Whether a record and the room's drawings agree (a status needs a drawing) is checked by the room
 * itself, as it renders: `pnpm dev`, or a build.
 *
 * Usage:
 *   pnpm lint:logoroom
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import {
	logoMarkSchema,
	logoPaletteSchema,
	logoRoundSchema,
	type LogoMark,
	type LogoRound,
} from '../src/models/logo-room.ts';
import { ICON_START, iconBase, TAKEN_ICONS } from '../src/pages/internal/design-system/_room-icons.ts';
import {
	isTwoTone,
	markArtPath,
	markPath,
	newMarkRecord,
	PALETTE_PATH,
	TONE_2,
	unifiedDiff,
	writePalette,
	writeProposal,
	type RecordProposal,
} from '../src/util/logo-room-records.ts';

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

/** WCAG 2 contrast between two #rrggbb colours; against white by default. */
const contrastOf = (hex: string, ground = '#ffffff') => {
	const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
	const lum = (h: string) => {
		const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(h.slice(i, i + 2), 16) / 255));
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};
	const [a, b] = [lum(hex), lum(ground)].sort((x, y) => y - x);
	return (a + 0.05) / (b + 0.05);
};
const contrastOnWhite = (hex: string) => contrastOf(hex);
/** The night the room's dark grounds stand for. */
const NIGHT = '#0b0d1f';

// ── Rounds ──
const openRound = new Map<string, string>();
const roundNames = new Map<string, string>();
for (const [id, { file, data }] of rounds) {
	const sameName = roundNames.get(data.name.toLowerCase());
	if (sameName) report(file, `name “${data.name}” is ${sameName}’s too`);
	roundNames.set(data.name.toLowerCase(), id);

	const named = [
		...data.picks.map((p) => p.mark),
		...data.reviews,
		...Object.keys(data.set),
		...data.routes.flatMap((r) => r.marks),
		...Object.keys(data.palette),
	];
	named.filter((m) => !marks.has(m)).forEach((m) => report(file, `no mark “${m}” in marks/`));

	for (const [mark, hex] of Object.entries(data.palette)) {
		const ratio = contrastOnWhite(hex);
		if (ratio < 3) report(file, `palette: ${mark}’s ${hex} is ${ratio.toFixed(1)}:1 on white, under 3:1`);
	}

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

// ── Artwork: marks/<mark>/<candidate>.svg, drawn by the room as that candidate ──
const marksDir = join(DIR, 'marks');
for (const name of readdirSync(marksDir).sort()) {
	const folder = join(marksDir, name);
	if (!statSync(folder).isDirectory()) continue;
	const mark = marks.get(name);
	if (!mark) {
		report(folder, 'a folder of artwork for no mark');
		continue;
	}
	for (const file of readdirSync(folder).sort()) {
		const at = join(folder, file);
		const id = file.replace(/\.svg$/, '');
		const svg = file.endsWith('.svg') ? readFileSync(at, 'utf8') : '';
		if (!file.endsWith('.svg')) report(at, 'artwork is an .svg named for its candidate, or mark.svg');
		else if (id === 'current') report(at, 'the current drawing is the shipped one, not a file here');
		else if (id !== 'mark' && !mark.data.candidates.some((c) => c.id === id))
			report(at, `no candidate “${id}” in ${name}.md`);
		else if (!/viewBox="[^"]+"/.test(svg)) report(at, 'needs a viewBox');
		else if (/<script\b|<foreignObject\b|\son\w+\s*=|javascript:/i.test(svg)) report(at, 'has something that runs');
	}
}
for (const [name, { file, data }] of marks) {
	if (data.candidates.some((c) => c.id === 'mark'))
		report(file, 'no candidate is “mark”: mark.svg is the mark’s own artwork');
	const own = join(marksDir, name, 'mark.svg');
	if (data.hue && !existsSync(own))
		report(file, `hue is the colour of a mark drawn from marks/${name}/mark.svg, which is not there`);
	const art = existsSync(own) ? readFileSync(own, 'utf8') : '';
	if (data.second && !isTwoTone(art))
		report(file, 'second is the second tone of two-tone artwork, and its mark.svg paints none');
	if (isTwoTone(art) && !data.second) report(file, 'its mark.svg paints a second tone: give it a second');
	if ((art.match(/var\(--lc-tone-2[^)]*\)/g) ?? []).some((v) => v !== TONE_2))
		report(own, `the second tone is painted ${TONE_2}`);
	if (data.proposed?.label === data.label) report(file, `proposed.label repeats its name, ${data.label}`);
	for (const c of data.candidates) {
		if (c.toDraw && existsSync(join(marksDir, name, `${c.id}.svg`)))
			report(file, `candidate ${c.id} has its drawing now: drop toDraw`);
	}
}

// ── A new mark, as the Studio writes it ──
{
	const probe = newMarkRecord({
		id: 'probe-mark',
		label: `A probe's "mark"`,
		group: 'AI',
		about: '',
		hue: '#3d50f5',
		second: '#b1b9fb',
		status: 'exploring',
		order: 9990,
	});
	const front = probe.match(/^---\n([\s\S]*?)\n---/)?.[1];
	const parsed = logoMarkSchema.safeParse(parse(front ?? ''));
	if (!parsed.success) report(markPath('probe-mark'), 'new-mark writer: its record does not match the schema');
	else if (parsed.data.second !== '#b1b9fb') report(markPath('probe-mark'), 'new-mark writer: its second is lost');
	const diff = [
		unifiedDiff(markPath('probe-mark'), '', probe),
		unifiedDiff(markArtPath('probe-mark'), '', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"/>\n'),
	].join('');
	const check = spawnSync('git', ['apply', '--check', '-'], { cwd: ROOT, input: diff });
	if (check.status !== 0)
		report(
			markPath('probe-mark'),
			`new-mark writer: git apply refuses its diff (${check.stderr.toString().trim().split('\n')[0]})`
		);
}

// ── The icon picker: what it proposes, and the marks' symbols it holds back ──
{
	const at = join(ROOT, 'src/pages/internal/design-system/_room-icons.ts');
	const tabler = JSON.parse(readFileSync(join(ROOT, 'node_modules/@iconify-json/tabler/icons.json'), 'utf8')) as {
		icons: Record<string, unknown>;
	};
	const has = (n: string) => n in tabler.icons;
	const taken = new Set(Object.values(TAKEN_ICONS).flat());
	for (const [id, names] of Object.entries(TAKEN_ICONS)) {
		if (!marks.has(id)) report(at, `TAKEN_ICONS: ${id} is no mark`);
		names.filter((n) => !has(n)).forEach((n) => report(at, `TAKEN_ICONS: no Tabler icon ${n}`));
	}
	const seen = new Set<string>();
	for (const n of ICON_START.flatMap((g) => g.icons)) {
		if (seen.has(n)) report(at, `ICON_START: ${n} is proposed twice`);
		seen.add(n);
		if (!has(n)) report(at, `ICON_START: no Tabler icon ${n}`);
		else if (!has(`${n}-filled`)) report(at, `ICON_START: ${n} has no filled twin, so no second tone`);
		if (taken.has(iconBase(n))) report(at, `ICON_START: ${n} is a mark's symbol`);
	}
}

// ── palette.md: colours proposed for the set ──
const paletteFile = join(ROOT, PALETTE_PATH);
const paletteRaw = existsSync(paletteFile) ? readFileSync(paletteFile, 'utf8') : '';
if (!paletteRaw) report(paletteFile, 'missing: the Studio writes proposed colours here');
else {
	const front = paletteRaw.match(/^---\n([\s\S]*?)\n---(\n|$)/)?.[1];
	const parsed = logoPaletteSchema.safeParse(parse(front ?? ''));
	if (!parsed.success) report(paletteFile, 'does not match its schema (src/models/logo-room.ts)');
	else {
		const theme = readFileSync(join(ROOT, 'src/styles/_theme.scss'), 'utf8');
		const seen = new Set<string>();
		for (const c of parsed.data.proposed) {
			if (seen.has(c.token)) report(paletteFile, `${c.token} is proposed twice`);
			seen.add(c.token);
			if (theme.includes(`${c.token}:`)) report(paletteFile, `${c.token} is a token already`);
			const light = contrastOf(c.light);
			const dark = contrastOf(c.dark, NIGHT);
			if (light < 3) report(paletteFile, `${c.name}: ${c.light} is ${light.toFixed(1)}:1 on white, under 3:1`);
			if (dark < 3) report(paletteFile, `${c.name}: ${c.dark} is ${dark.toFixed(1)}:1 on night, under 3:1`);
			if (c.of && !marks.has(c.of)) report(paletteFile, `${c.name}: seconds ${c.of}, which is not a mark`);
		}
		const seconded = parsed.data.proposed.flatMap((c) => (c.of ? [c.of] : []));
		for (const id of new Set(seconded.filter((id, i) => seconded.indexOf(id) !== i)))
			report(paletteFile, `${id} has two secondaries: two tones at most`);
		// Its writer: the file's own colours written back are the file; a probe comes through and applies.
		if (writePalette(paletteRaw, parsed.data.proposed) !== paletteRaw)
			report(paletteFile, 'palette writer: its own colours, written back, change the file');
		const probe = {
			name: `A probe's "colour"`,
			token: '--color-product-probe',
			light: '#3d50f5',
			dark: '#b3c7ff',
			of: 'platform',
		};
		const probed = writePalette(paletteRaw, [...parsed.data.proposed, probe]);
		const back = logoPaletteSchema.safeParse(parse(probed.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''));
		if (!back.success || !back.data.proposed.some((c) => c.name === probe.name && c.of === probe.of))
			report(paletteFile, 'palette writer: the probe did not come through');
		const check = spawnSync('git', ['apply', '--check', '-'], {
			cwd: ROOT,
			input: unifiedDiff(PALETTE_PATH, paletteRaw, probed),
		});
		if (check.status !== 0)
			report(
				paletteFile,
				`palette writer: git apply refuses its diff (${check.stderr.toString().trim().split('\n')[0]})`
			);
	}
}

// ── The patch writer ──
/** A proposal with a status, a colour and a note that quotes and colons can trip. */
const PROBE = {
	treatments: { white: 'exploring' },
	colour: '#3d50f5',
	note: { at: '2026-01-01T00:00:00.000Z', text: `A probe's note, "quoted": with a colon` },
} as const;
for (const { file, data } of marks.values()) {
	const raw = readFileSync(file, 'utf8');
	const own: RecordProposal = {
		treatments: data.proposed?.treatments ?? {},
		colour: data.proposed?.colour,
		label: data.proposed?.label,
		remove: data.proposed?.remove,
		notes: data.notes.map((n) => ({ at: n.at.toISOString(), text: n.text })),
	};
	const once = writeProposal(raw, own);
	if (writeProposal(once, own) !== once) report(file, 'patch writer: its own proposal, written twice, changes');

	const probed = writeProposal(raw, {
		treatments: { ...own.treatments, ...PROBE.treatments },
		colour: PROBE.colour,
		label: `${data.label}'s "probe"`,
		remove: true,
		notes: [...own.notes, PROBE.note],
	});
	const parsed = logoMarkSchema.safeParse(parse(probed.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''));
	if (!parsed.success) report(file, 'patch writer: the record it writes fails the schema');
	else if (
		parsed.data.proposed?.treatments.white !== PROBE.treatments.white ||
		parsed.data.proposed?.colour !== PROBE.colour ||
		parsed.data.proposed?.label !== `${data.label}'s "probe"` ||
		parsed.data.proposed?.remove !== true ||
		!parsed.data.notes.some((n) => n.text === PROBE.note.text)
	)
		report(file, 'patch writer: the probe did not come through');

	const check = spawnSync('git', ['apply', '--check', '-'], {
		cwd: ROOT,
		input: unifiedDiff(relative(ROOT, file), raw, probed),
	});
	if (check.status !== 0)
		report(file, `patch writer: git apply refuses its diff (${check.stderr.toString().trim().split('\n')[0]})`);
}

if (problems.length > 0) {
	console.error(`Logo Room records: ${problems.length} problem${problems.length > 1 ? 's' : ''}\n`);
	problems.forEach((p) => console.error(`  ${p}`));
	process.exit(1);
}
console.log(`Logo Room records: ${marks.size} marks, ${rounds.size} rounds, all consistent.`);
