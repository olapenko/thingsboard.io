import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import spriteManifest from '@root/assets/images/landings/nav-sprite.manifest.json';
import { ICONS } from '@root/pages/open-graph/_assets/icons';
import { MARKS, markBySrc, type MarkName } from '@data/marks';

/** A `ui/Mark` call, as a surface makes it: the props, so a page can redraw that surface's tile. */
export type MarkSize = 36 | 40 | 48 | 64 | 72 | 80 | 88;
export type Fill = 'solid' | 'white' | 'wash' | 'neutral';
export interface MarkSpec {
	size: MarkSize;
	fill?: Fill;
	accent?: string;
	logo?: 'thingsboard';
	product?: Exclude<MarkName, 'thingsboard'>;
	icon?: string;
	tone?: 'knockout' | 'original';
	lift?: boolean;
}

/**
 * A colour cycle, as the AI mark runs one: `hues[0]` is where it rests and where each lap ends, one
 * leg of `leg` seconds per hue. `on` is what changes colour: the tile's fill (the section's badge) or
 * the glyph on a white ground (the chat launcher). `_LogoCell` has keyframes for 2 to 8 hues.
 */
export interface HueCycle {
	hues: string[];
	leg: number;
	on: 'fill' | 'glyph';
}

/**
 * One product as one surface draws it (`_LogoCell` draws it again): a Mark; the menu's badge, which
 * is CSS and a sprite glyph rather than a Mark; a nav icon; a file as an image; or nothing, and why.
 * `ink` is the homepage mobile card's: the logo inked in a colour of its own on the white tile.
 * `disc` is the chat launcher: a white circle with a glyph, which is not a Mark. `draft` is a tile for
 * artwork that is not in `marks.ts` yet (the CE placeholder): Mark's squircle, drawn here, so a draft
 * never needs a registry entry to be reviewed.
 */
/**
 * One tone of a mark as its sheet shows it: its light and dark values, where the dark one comes from
 * (its record, its token, or the room's rule), the dark value the rule gives, and its token.
 */
export interface ToneView {
	light: string;
	dark: string;
	darkFrom: 'set' | 'token' | 'derived';
	derived: string;
	token?: string;
}

export type Cell = { name: string; caption: string } & (
	| { kind: 'mark'; mark: MarkSpec; ink?: string; cycle?: HueCycle }
	| { kind: 'disc'; size: number; icon: string; glyph: number; cycle?: HueCycle }
	/** The mark alone in one colour (currentColor): artwork as a mask, or a tabler glyph. */
	| { kind: 'glyph'; size: number; mask?: string; icon?: string }
	| {
			kind: 'draft';
			size: MarkSize;
			/** Artwork Mark does not know yet, drawn in currentColor; `art` is its box, as in `marks.ts`. */
			svg: string;
			art: readonly [number, number, number, number];
			/** Which of Mark's steps sizes it: a product's (70%), a wide product's (80%), or an icon's (60%). */
			step?: 'product' | 'wide' | 'icon';
			/**
			 * solid: knocked out of the accent · white: the accent on white · dark: the accent on black ·
			 * darktint: the accent on near-black tinted with `tint`, the product's own colour.
			 */
			fill: 'solid' | 'white' | 'dark' | 'darktint';
			/** The darktint tile's hue, when it is not the ink's. */
			tint?: string;
			accent: string;
			/** Two-tone artwork's second tone (`var(--lc-tone-2)` in its SVG), on the white and dark tiles. */
			second?: string;
			lift?: boolean;
	  }
	| { kind: 'menu'; fill: 'solid' | 'wash'; hue: string; glyph: string; size: number }
	| { kind: 'nav'; src: string }
	| { kind: 'img'; src: string; px: number; ground?: string }
	| { kind: 'none'; why: string }
);

/**
 * THE LOGO FILES, swept from the folders that hold the ThingsBoard logo and the products' logos, for
 * the Logos page. Swept rather than listed: a file added to one of these folders shows up on the page
 * under its product (or under Unsorted) without an edit here, and a file deleted drops off.
 *
 * Every number on a card is read from the file or from the tree as the page renders: the box, the
 * colours, the bytes, whether another file is the same artwork, whether the nav sprite carries it, and
 * which files outside `internal/` name it. The `via` lines below — how a folder's files reach a page —
 * are written by hand and are the part that can go stale.
 */

export type ProductId =
	| 'thingsboard'
	| 'cloud'
	| 'platform'
	| 'edge'
	| 'gateway'
	| 'tbmq'
	| 'trendz'
	| 'mobile'
	| 'iot-hub'
	| 'license'
	| 'agent'
	| 'other';

export interface Product {
	id: ProductId;
	label: string;
	/** What the row holds, when the label alone does not say it. */
	note?: string;
}

/** The page's rows, top to bottom: the logo, the two ways to run the platform, then the ecosystem. */
export const PRODUCTS: Product[] = [
	{ id: 'thingsboard', label: 'ThingsBoard logo', note: 'The wordmark, the mark, the favicon and the media kit.' },
	{ id: 'cloud', label: 'ThingsBoard Cloud' },
	{ id: 'platform', label: 'ThingsBoard · On-premises', note: 'Community and Professional Edition.' },
	{ id: 'edge', label: 'Edge' },
	{ id: 'gateway', label: 'IoT Gateway' },
	{ id: 'tbmq', label: 'TBMQ' },
	{ id: 'trendz', label: 'Trendz Analytics' },
	{ id: 'mobile', label: 'Mobile Application' },
	{ id: 'iot-hub', label: 'IoT Hub' },
	{ id: 'license', label: 'License Server' },
	{ id: 'agent', label: 'ThingsBoard Agent' },
	{ id: 'other', label: 'Unsorted', note: 'In a swept folder, and matched to no product by its name.' },
];

/** A file's product from its name. First match wins, so Mobile's `tb-mobile` is not the logo's `tb-`. */
const BY_NAME: [RegExp, ProductId][] = [
	[/thingsboard-c-icon/, 'cloud'],
	[/thingsboard-p-icon|thingsboard-pe\b/, 'platform'],
	[/mobile|thingsboard-m-icon/, 'mobile'],
	[/thingsboard-e-icon|(^|-)edge\b/, 'edge'],
	[/gateway/, 'gateway'],
	[/tbmq/, 'tbmq'],
	[/trendz/, 'trendz'],
	[/iot-hub/, 'iot-hub'],
	[/license/, 'license'],
	[/tb-agent/, 'agent'],
	[/thingsboard[-_](logo|mark)|tb-logo|badge-thingsboard|favicon|logo-fade/, 'thingsboard'],
];

/** The OG cards' icon keys (`open-graph/_assets/icons.ts`), by the product row they draw. */
export const OG_PRODUCT: Record<keyof typeof ICONS, ProductId> = {
	cm: 'platform',
	p: 'platform',
	c: 'cloud',
	e: 'edge',
	tbmq: 'tbmq',
	trendz: 'trendz',
	mobile: 'mobile',
	'pe-mobile': 'mobile',
	gateway: 'gateway',
	license: 'license',
	'iot-hub': 'iot-hub',
};

export interface LogoSource {
	id: string;
	/** The folder, from the repo root. */
	dir: string;
	/** Only the files whose name matches, where the folder holds other things too. */
	only?: RegExp;
	label: string;
	/** How this folder's files reach a page. Hand-written. */
	via: string;
	/**
	 * What else counts as naming a file, beside the default: `parent/name.svg`, or the folder held in a
	 * constant (`const NAV = '…/landings/nav'`) and `/name.svg` in one file; in `public/`, its URL.
	 */
	needles?: (file: { base: string; stem: string }) => string[];
	/** Shown on a dark ground only: artwork drawn white for a coloured slab. */
	white?: boolean;
}

export const SOURCES: LogoSource[] = [
	{
		id: 'landings',
		dir: 'src/assets/images/landings',
		only: /^thingsboard-(logo|mark)\.svg$/,
		label: 'landings/',
		via: 'The wordmark: the bar (SiteTitle), the map footer and the docs footer, each as ?raw. The 44-box mark: the data that still names it by path, which markBySrc maps to Mark’s logo.',
	},
	{
		id: 'draft',
		dir: 'src/assets/images/landings/draft',
		label: 'landings/draft/',
		via: 'ui/Mark’s logo artwork (MARKS.thingsboard): every tile that carries the ThingsBoard logo.',
	},
	{
		id: 'ce',
		dir: 'src/assets/images/landings/ce',
		only: /^(thingsboard-e-icon|gateway-icon|tbmq-icon|trendz-icon|tb(-pe)?-mobile-icon)\.svg$/,
		label: 'landings/ce/',
		via: 'ui/Mark’s product artwork (MARKS): the homepage’s ecosystem cards, pricing’s add-ons, the installations hub, the footer and the docs hub.',
	},
	{
		id: 'nav',
		dir: 'src/assets/images/landings/nav',
		only: /^(thingsboard-[a-z]-icon|gateway-icon|tbmq-icon|trendz-icon|badge-[a-z]+)\.svg$/,
		label: 'landings/nav/',
		via: 'The nav sprite (public/nav-sprite.svg), drawn by NavIcon. The badge-* files are the menu’s badge glyphs, their paths built from a prefix by menuBadgeOf; the *-icon files are named by the menu and footer data.',
		// The badges are named by the prefix their paths are built from (`BADGE_GLYPH` in product-badges).
		needles: ({ stem }) => (stem.startsWith('badge-') ? ['landings/nav/badge-'] : []),
	},
	{
		id: 'selector',
		dir: 'src/assets/images/docs/product-selector',
		label: 'docs/product-selector/',
		via: 'The docs product selector (VersionSwitcher), loaded by a glob and picked by iconId in version-switcher.data.ts.',
		needles: ({ stem }) => [`iconId: '${stem}'`, `getIcon('${stem}')`],
	},
	{
		id: 'trendz',
		dir: 'src/assets/images/landings/trendz',
		only: /^icon-trendz\.svg$/,
		label: 'landings/trendz/',
		via: 'The Trendz page’s own set.',
	},
	{
		id: 'install',
		dir: 'src/assets/images/installation',
		only: /^(thingsboard-pe|trendz-cloud|tb-agent(-docker)?)\.svg$/,
		label: 'installation/',
		via: 'The installation option cards (InstallationCardGrid) in the docs.',
	},
	{
		id: 'icons',
		dir: 'src/icons',
		only: /^thingsboard-mark\.svg$/,
		label: 'src/icons/',
		via: 'astro-icon’s local set, named thingsboard-mark.',
		needles: ({ stem }) => [`'${stem}'`, `"${stem}"`],
	},
	{
		id: 'public',
		dir: 'public',
		only: /^favicon\.svg$/,
		label: 'public/',
		via: 'The favicon, linked by BaseLayout, LegalLayout and astro.config.',
	},
	{
		id: 'public-images',
		dir: 'public/images',
		only: /^thingsboard_logo/,
		label: 'public/images/',
		via: 'Served as /images/…',
	},
	{
		id: 'public-products',
		dir: 'public/images/products',
		label: 'public/images/products/',
		via: 'Served as /images/products/…; what the OG cards’ white icons were derived from.',
	},
	{
		id: 'mediakit',
		dir: 'public/images/mediakit',
		only: /^(thingsboard_logo|logo-fade)/,
		label: 'public/images/mediakit/',
		via: 'The media kit page (MediaKit/LogosSection): the logos offered for download.',
	},
];

/** The OG cards' icons are strings in a module, not files; they are listed as one more source. */
export const OG_SOURCE: LogoSource = {
	id: 'og',
	dir: 'src/pages/open-graph/_assets/icons.ts',
	label: 'open-graph/_assets/icons.ts',
	via: 'The docs OG cards (DocsCard), drawn white on the product’s slab, by iconKey in product-meta.ts.',
	white: true,
};

export interface LogoFile {
	/** From the repo root; an OG icon is `icons.ts › key`. */
	path: string;
	name: string;
	source: LogoSource;
	product: ProductId;
	bytes: number;
	viewBox?: string;
	size?: string;
	colours: string[];
	currentColor: boolean;
	gradient: boolean;
	/** Other entries whose artwork is byte-identical once whitespace is folded. */
	sameAs: string[];
	/** The nav sprite's symbol id, for a file the sprite carries. */
	sprite?: string;
	/** The ui/Mark artwork this file is, or the one markBySrc maps it to. */
	mark?: { name: string; legacy: boolean };
	/** Files outside `internal/` that name it. Undefined for a source with no way to tell. */
	users?: string[];
	light: string;
	dark: string;
}

const ROOT = process.cwd();
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Every text file that could name a logo. The internal pages name them all, so they are skipped. Kept
 * for a few seconds, so the page's two sweeps read the tree once and a reload after an edit sees it.
 */
let treeCache: { at: number; files: { path: string; text: string }[] } | undefined;
function readTree(): { path: string; text: string }[] {
	if (treeCache && Date.now() - treeCache.at < 5000) return treeCache.files;
	const out: { path: string; text: string }[] = [];
	treeCache = { at: Date.now(), files: out };
	const skip = new Set([
		join(ROOT, 'src', 'pages', 'internal'),
		join(ROOT, 'src', 'assets', 'images', 'landings', 'nav-sprite.manifest.json'),
	]);
	const walk = (dir: string) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const path = join(dir, entry.name);
			if (skip.has(path)) continue;
			if (entry.isDirectory()) walk(path);
			else if (/\.(astro|scss|css|ts|tsx|mdx|md|mjs|js|json)$/.test(entry.name)) {
				out.push({ path: relative(ROOT, path), text: readFileSync(path, 'utf8') });
			}
		}
	};
	walk(join(ROOT, 'src'));
	for (const f of ['astro.config.ts', 'astro.sidebar.ts']) {
		if (existsSync(join(ROOT, f))) out.push({ path: f, text: readFileSync(join(ROOT, f), 'utf8') });
	}
	return out;
}

const svgAttr = (svg: string, attr: string) => svg.match(new RegExp(`<svg\\b[^>]*\\s${attr}="([^"]*)"`))?.[1];

const dataUri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

function describe(svg: string) {
	const width = svgAttr(svg, 'width');
	const height = svgAttr(svg, 'height');
	return {
		bytes: Buffer.byteLength(svg),
		viewBox: svgAttr(svg, 'viewBox'),
		size: width && height ? `${width}×${height}` : undefined,
		colours: [...new Set((svg.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) ?? []).map((c) => c.toLowerCase()))],
		currentColor: /currentColor/i.test(svg),
		gradient: /<(linear|radial)Gradient\b/.test(svg),
		hash: createHash('md5').update(svg.replace(/\s+/g, ' ').trim()).digest('hex'),
		light: dataUri(svg),
		// An `<img>` does not inherit a colour, so a currentColor file would draw black on the dark ground.
		dark: dataUri(svg.replace(/currentColor/gi, '#ffffff')),
	};
}

const productOf = (name: string): ProductId => BY_NAME.find(([re]) => re.test(name))?.[1] ?? 'other';

const SPRITE = spriteManifest.icons as Record<string, { id: string }>;

/** The ui/Mark artwork a file is, by its `/src/…` path. */
function markOf(src: string): LogoFile['mark'] {
	const own = (Object.keys(MARKS) as (keyof typeof MARKS)[]).find((k) => MARKS[k].src === src);
	if (own) return { name: own, legacy: false };
	const legacy = markBySrc(src);
	return legacy ? { name: legacy, legacy: true } : undefined;
}

/**
 * The older feature icons: drawn files, one per feature, from the landing pages before the redesign
 * (which draws a feature as a tabler glyph in a Mark). Swept the same way, so a card says whether
 * anything still uses one.
 */
export const FEATURE_SOURCES: LogoSource[] = [
	{
		id: 'ce-features',
		dir: 'src/assets/images/landings/ce',
		only: /^(?!thingsboard-e-icon|gateway-icon|tbmq-icon|trendz-icon|tb(-pe)?-mobile-icon).*\.svg$/,
		label: 'landings/ce/',
		via: 'The platform’s features, from the old CE landing.',
	},
	{
		id: 'edge-features',
		dir: 'src/assets/images/landings/edge',
		label: 'landings/edge/',
		via: 'The Edge page’s features.',
	},
	{
		id: 'trendz-features',
		dir: 'src/assets/images/landings/trendz',
		only: /^icon-(?!trendz).*\.svg$/,
		label: 'landings/trendz/',
		via: 'The Trendz page’s features.',
	},
];

/** Every file in `sources`, read and measured; the OG cards’ icons too unless `og` is false. */
export function sweepLogos(sources: LogoSource[] = SOURCES, { og = true } = {}): LogoFile[] {
	const tree = readTree();
	const files: (LogoFile & { hash: string })[] = [];

	for (const source of sources) {
		const abs = join(ROOT, source.dir);
		if (!existsSync(abs)) continue;
		const names = readdirSync(abs).filter((n) => n.endsWith('.svg') && (!source.only || source.only.test(n)));
		const inPublic = source.dir === 'public' || source.dir.startsWith('public/');
		for (const name of names.sort()) {
			const path = `${source.dir}/${name}`;
			const svg = readFileSync(join(abs, name), 'utf8');
			const stem = name.replace(/\.svg$/, '');
			const parent = basename(source.dir);
			const fromSrc = source.dir.replace(/^src\//, '');
			const extra = source.needles?.({ base: name, stem }) ?? [];
			const url = `${source.dir.replace(/^public/, '')}/${name}`;
			const direct = new RegExp(`${esc(parent)}/${esc(name)}`);
			const held = new RegExp(`${esc(fromSrc)}['"\`]`);
			const isNamedIn = (text: string) =>
				extra.some((n) => text.includes(n)) ||
				(inPublic ? text.includes(url) : direct.test(text) || (held.test(text) && text.includes(`/${name}`)));
			const users = tree.filter((f) => isNamedIn(f.text)).map((f) => f.path);
			files.push({
				path,
				name,
				source,
				product: productOf(name),
				...describe(svg),
				sameAs: [],
				sprite: source.id === 'nav' ? SPRITE[stem]?.id : undefined,
				mark: inPublic ? undefined : markOf(`/${path}`),
				users,
			});
		}
	}

	for (const [key, svg] of og ? (Object.entries(ICONS) as [keyof typeof ICONS, string][]) : []) {
		files.push({
			path: `${OG_SOURCE.dir} › ${key}`,
			name: key,
			source: OG_SOURCE,
			product: OG_PRODUCT[key],
			...describe(svg),
			sameAs: [],
			users: undefined,
		});
	}

	for (const f of files) {
		f.sameAs = files.filter((o) => o !== f && o.hash === f.hash).map((o) => o.path);
	}
	return files;
}
