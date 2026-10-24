/**
 * The Logo Room's vocabulary: its terms, each with the key the data and the code use for it, so a note,
 * a direction or a rule says one thing and the code says the same. The About page prints it as its
 * footnote.
 */
export const VOCABULARY: { group: string; terms: { term: string; means: string; key?: string }[] }[] = [
	{
		group: 'What we name',
		terms: [
			{ term: 'Logo', means: 'The logotype and the mark together' },
			{ term: 'Logotype', means: 'The name set in type', key: 'thingsboard-logo.svg' },
			{ term: 'Mark', means: 'The drawing that identifies a product', key: 'MARKS · MarkName' },
			{
				term: 'Set',
				means:
					'All the marks, in Platform, Ecosystem and AI. In the Studio, one way of showing them all; one of your own is kept in your browser',
				key: 'group · PRESETS · logo-room:sets',
			},
			{ term: 'App icon', means: 'A mark on a tile', key: 'ui/Mark' },
		],
	},
	{
		group: 'How a mark is shown',
		terms: [
			{
				term: 'Treatment',
				means: 'The tile a mark is drawn on: White (pure or shaded), Colour, Tint or Dark. Or the Glyph, with no tile',
				key: 'treatments: white · colour · tint · dark · glyph',
			},
			{
				term: 'Material',
				means: 'What a set or a candidate puts a mark on: a treatment’s tile, Dark tint, White + Dark, or Off',
				key: 'LOGO_MATERIALS · material',
			},
			{ term: 'Mode', means: 'A light or a dark ground, not the site’s theme', key: 'data-surface="dark"' },
			{
				term: 'Ground',
				means: 'The surface behind the tile: White, Grey, Tint or Dark',
				key: 'GROUNDS',
			},
			{ term: 'Size', means: 'One scale: 88 · 72 · 48 · 40 · 32 · 24 · 16', key: 'MarkSize · SCALE' },
			{
				term: 'Light',
				means: 'The 155° gradient that lights a fill, never a fill of its own',
				key: 'background-image',
			},
			{
				term: 'Shade',
				means: 'The White tile’s light: the mark’s colour toward the far corner. Pure white has none',
				key: 'data-light',
			},
			{ term: 'Lift', means: 'The shadow that seats a tile on a light ground', key: '--elev-mark' },
			{ term: 'Hairline', means: 'The 1px edge that seats a tile on a dark ground', key: '.pg__tile on dark' },
			{ term: 'Shape', means: 'The tile’s outline: the 32% squircle, or a circle', key: "shape: 'circle'" },
			{
				term: 'Colour',
				means: 'Each product’s colour, with a dark and a list value',
				key: '--color-product-* · hue · list',
			},
		],
	},
	{
		group: 'What gets decided',
		terms: [
			{ term: 'Baseline', means: 'What every mark has: a treatment for each mode, and a Glyph' },
			{ term: 'Pairing', means: 'A mark’s chosen treatment for each mode' },
			{ term: 'Signature', means: 'The one way a mark is shown when it stands for itself', key: 'signature' },
			{
				term: 'Round',
				means: 'A named proposal: one candidate picked per mark it touches, with the reason. Open, then decided',
				key: 'rounds/*.md · state',
			},
			{
				term: 'Route',
				means: 'One of the directions a round weighs before any pick: marks, or a character',
				key: 'routes',
			},
			{
				term: 'Brief',
				means: 'What a round decides and a new drawing in it must meet: topics of a few points, or a plain line',
				key: 'rounds · brief · topic, points',
			},
			{
				term: 'Palette',
				means: 'The colours a round proposes for the set, tried all at once in the Studio',
				key: 'rounds · palette',
			},
			{
				term: 'New colour',
				means: 'A colour proposed for the set that no product wears yet: a name, a token, a light and a dark value',
				key: 'palette.md · proposed',
			},
			{
				term: 'Secondary',
				means: 'A product’s second tone, for two-tone artwork; never a third',
				key: 'palette.md · of · --color-product-*-secondary',
			},
			{
				term: 'Candidate',
				means: 'A version of a mark under review: Current, A, B…; its drawing a file beside the record',
				key: 'candidates · marks/<mark>/<candidate>.svg',
			},
			{
				term: 'Exploration',
				means: 'A whole-set stress test in the Studio, never a candidate',
				key: "PRESETS · kind: 'exploration'",
			},
			{
				term: 'Group',
				means: 'Platform, Ecosystem or AI: how its marks are built, in GUIDE.md',
				key: 'group',
			},
			{
				term: 'Guideline',
				means: 'A mark’s symbol, its use on light and on dark, at small sizes, and its don’ts',
				key: 'guideline',
			},
			{
				term: 'Action',
				means: 'What a mark waits for: decide, draw or build. Ticked off with its date when done',
				key: 'actions · kind · done',
			},
			{
				term: 'Record',
				means: 'A mark’s or a round’s file in the repo: what is decided, and what is proposed',
				key: 'src/content/logo-room/',
			},
			{ term: 'Exception', means: 'A declared departure from the baseline, kept on its mark', key: 'exception.what' },
			{ term: 'Fallback', means: 'The still version an exception must provide', key: 'exception.fallback' },
			{ term: 'Rule', means: 'A do or a don’t, with the example it is about', key: 'ComboVerdict' },
			{ term: 'Check', means: 'A contrast measured at build: 3:1 for an edge or a mark', key: 'CHECKS · MIN' },
		],
	},
	{
		group: 'Where something stands',
		terms: [
			{ term: 'Exploring', means: 'An idea or a draft', key: "'exploring'" },
			{ term: 'Designed', means: 'Approved, waiting to be built', key: "'designed'" },
			{ term: 'Shipped', means: 'Live on the new pages', key: "'shipped'" },
			{ term: 'Legacy', means: 'Old files, to retire', key: "'legacy'" },
			{
				term: 'Proposed',
				means: 'A status or a colour suggested in the Studio, until the team decides',
				key: 'proposed',
			},
			{ term: 'Not defined', means: 'A baseline slot nobody has drawn', key: 'no version' },
		],
	},
];
