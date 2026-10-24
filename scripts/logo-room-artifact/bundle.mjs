/**
 * The Logo Room's client scripts as one file for the artifact: the `<script>` blocks of the room's
 * components and of the About and Files pages (SCRIPTS below), bundled with esbuild (the copy Vite ships) and the repo's
 * path aliases, as `site/room.js`. The icon picker's fetch is pointed at the snapshot's own copy.
 *
 * Usage: node scripts/logo-room-artifact/bundle.mjs <out-dir>
 */
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = resolve(process.argv[2] ?? join(ROOT, 'scripts/logo-room-artifact/site'));
const require = createRequire(join(ROOT, 'package.json'));
const vite = require.resolve('vite', { paths: [dirname(require.resolve('astro/package.json'))] });
const { build } = require(require.resolve('esbuild', { paths: [dirname(vite)] }));

/** A component's processed script: the `<script>` without attributes, not the `is:inline` ones. */
const scriptOf = (file) => {
	const src = readFileSync(join(ROOT, file), 'utf8');
	const m = src.match(/^<script>\n([\s\S]*?)^<\/script>/m);
	if (!m) throw new Error(`No <script> in ${file}`);
	return m[1];
};

const TMP = join(ROOT, 'scripts/logo-room-artifact/.entry');
mkdirSync(TMP, { recursive: true });
/** Every file whose `<script>` the snapshot runs; each guards itself, so all of them load on every page. */
const SCRIPTS = {
	tabs: '_RoomTabs.astro',
	toc: '_RoomToc.astro',
	hero: '_PageHero.astro',
	room: '_LogoRoom.astro',
	about: 'logos/about.astro',
	files: 'logo-files.astro',
};
Object.entries(SCRIPTS).forEach(([name, file]) =>
	writeFileSync(join(TMP, `${name}.ts`), scriptOf(`src/pages/internal/design-system/${file}`))
);
writeFileSync(
	join(TMP, 'entry.ts'),
	Object.keys(SCRIPTS)
		.map((n) => `import './${n}';\n`)
		.join('')
);

const result = await build({
	entryPoints: [join(TMP, 'entry.ts')],
	bundle: true,
	format: 'esm',
	target: 'es2022',
	minify: true,
	write: false,
	tsconfig: join(ROOT, 'tsconfig.json'),
	logLevel: 'warning',
});
rmSync(TMP, { recursive: true, force: true });

let js = result.outputFiles[0].text;
const ICONS = '/internal/design-system/tabler-icons.json';
if (!js.includes(ICONS)) throw new Error('The icon picker no longer fetches ' + ICONS);
js = js.replaceAll(ICONS, 'tabler-icons.json');
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'room.js'), js);
console.log(`room.js ${(js.length / 1024).toFixed(0)} KB`);
