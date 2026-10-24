import { z } from 'astro/zod';

/**
 * The Logo Room's records: one Markdown file per mark (`src/content/logo-room/marks/`) and one per
 * round (`…/rounds/`). They hold what people decide — statuses, guidelines, candidates, rounds, the
 * next step — while the drawings stay in code, built from the site's own data, keyed by the same ids.
 * The room reads both and refuses to build when they disagree (a status for a treatment nobody draws,
 * a candidate with no drawing, a round naming a mark that does not exist).
 *
 * The words are the room's vocabulary: `colour` and `dark` here are the Colour and Dark tiles that the
 * room's code still keys as `filled` and `black`.
 */
export const LOGO_STATUSES = ['exploring', 'designed', 'shipped', 'legacy'] as const;
export const logoStatusSchema = z.enum(LOGO_STATUSES);
export type LogoStatus = z.infer<typeof logoStatusSchema>;

/** The treatments a mark is drawn in, and the materials a set can put it on. */
export const LOGO_TREATMENTS = ['white', 'colour', 'tint', 'dark', 'glyph'] as const;
export const LOGO_MATERIALS = ['white', 'colour', 'tint', 'dark', 'darktint', 'both', 'off'] as const;
export const logoMaterialSchema = z.enum(LOGO_MATERIALS);
/**
 * What a proposal can set a status on: the treatments, plus the Dark tint tile and the White + Dark
 * pair, which only the bench draws.
 */
export const LOGO_PROPOSAL_KEYS = ['white', 'colour', 'tint', 'dark', 'darktint', 'both', 'glyph'] as const;
export type LogoProposalKey = (typeof LOGO_PROPOSAL_KEYS)[number];
export type LogoMaterial = z.infer<typeof logoMaterialSchema>;

/** A mark's guideline: the same five lines for every mark, only what holds over time. */
export const logoGuidelineSchema = z.object({
	/** The parts of the drawing. */
	symbol: z.array(z.string()).min(1),
	/** How it is used on a light ground. */
	light: z.string(),
	/** How it is used on a dark ground. */
	dark: z.string(),
	/** What stands in for it at small sizes. */
	small: z.string(),
	/** What not to do, each with its reason after a colon. */
	dont: z.array(z.string()).default([]),
});

/** A version of a mark under review: Current, A, B… One with no drawing yet is a slot, "to draw". */
export const logoCandidateSchema = z.object({
	id: z.string().regex(/^(current|[a-z])$/),
	status: logoStatusSchema,
	note: z.string(),
	/** The material it puts the mark on in a set, where a round can pick it. */
	material: logoMaterialSchema.optional(),
	/** No drawing yet. */
	toDraw: z.boolean().default(false),
});

export const logoMarkSchema = z.object({
	/** Its place in the set, across groups. */
	order: z.number().int(),
	label: z.string(),
	group: z.enum(['Platform', 'Ecosystem', 'AI']),
	/** Its kind, a kicker's few words. Left out, the homepage card's kicker says it. */
	kind: z.string().optional(),
	/** What the product is and what its mark carries, in a line or two: the sheet's lede. */
	about: z.string(),
	/** The treatment that represents it in a set. */
	signature: z.enum(['white', 'colour']),
	/** What its colour does. */
	colourRole: z.string(),
	/** The status of each treatment it is drawn in; a treatment left out is not drawn. */
	treatments: z.partialRecord(z.enum(LOGO_TREATMENTS), logoStatusSchema),
	/** A declared departure from the baseline, with the still version it must provide. */
	exception: z.object({ what: z.string(), fallback: z.string() }).optional(),
	guideline: logoGuidelineSchema,
	/** Its versions under review; none for a settled mark. */
	candidates: z.array(logoCandidateSchema).default([]),
	/**
	 * What it waits for outside a round: a question for the team (`decide`), artwork to make (`draw`) or
	 * code to change (`build`), each read as the verb and then `what`. A round needs no action here: its
	 * marks show as under review, and its candidates still to draw as `draw`. None, and out of every
	 * round, the mark is settled.
	 */
	actions: z
		.array(z.object({ kind: z.enum(['decide', 'draw', 'build']), what: z.string(), done: z.coerce.date().optional() }))
		.default([]),
	/**
	 * What someone proposes and the team has not decided: a status for a treatment, a colour. Written
	 * by the room (Save to repo, Copy as patch) and reviewed as a pull request; deciding it means moving
	 * it into `treatments` and the drawings, and deleting it here.
	 */
	proposed: z
		.object({
			treatments: z.partialRecord(z.enum(LOGO_PROPOSAL_KEYS), logoStatusSchema).default({}),
			colour: z
				.string()
				.regex(/^#[0-9a-f]{6}$/)
				.optional(),
		})
		.optional(),
	/** Comments on the mark, oldest first, as the sheet's Decision and notes lists them. */
	notes: z.array(z.object({ at: z.coerce.date(), text: z.string().min(1) })).default([]),
});
export type LogoMark = z.infer<typeof logoMarkSchema>;

export const logoRoundSchema = z.object({
	label: z.string(),
	/** Its name in a list of sets: a word or two, never its number again. */
	name: z.string().max(20),
	state: z.enum(['open', 'decided']),
	opened: z.coerce.date(),
	decided: z.coerce.date().optional(),
	title: z.string(),
	/** Its annotation on the bench, under the Set picker: what the set proposes and what it builds on. */
	summary: z.string(),
	/** One candidate per mark it settles, with the reason. */
	picks: z.array(z.object({ mark: z.string(), candidate: z.string(), why: z.string() })).default([]),
	/** Marks under review with no pick yet. */
	reviews: z.array(z.string()).default([]),
	/** What a new drawing in this round has to meet. */
	brief: z.array(z.string()).default([]),
	/** The set it proposes, as departures from the shipped one: mark → material. */
	set: z.record(z.string(), logoMaterialSchema).default({}),
	/**
	 * What it covers that is not a mark yet, in groups: the License Portal's plans, say. Each plan has a
	 * shade, 0 (pure white) to 4 (the deepest), for a round that tells plans apart by shading one mark.
	 */
	scope: z
		.array(
			z.object({
				group: z.string(),
				note: z.string().optional(),
				/** The tile its plans are shaded on: the White tile, the product's Colour tile, or its Dark tint tile. */
				tile: z.enum(['white', 'colour', 'darktint']).default('white'),
				/** The product whose colour a Colour or Dark tint tile takes, by its mark id. */
				mark: z.string().optional(),
				plans: z.array(z.object({ name: z.string(), shade: z.number().int().min(0).max(4) })).default([]),
			})
		)
		.default([]),
});
export type LogoRound = z.infer<typeof logoRoundSchema>;

/** What the room sends to Save to repo: one mark's proposal and notes, whole, to replace the file's. */
export const logoSaveSchema = z.object({
	mark: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
	treatments: z.partialRecord(z.enum(LOGO_PROPOSAL_KEYS), logoStatusSchema),
	colour: z
		.string()
		.regex(/^#[0-9a-f]{6}$/)
		.optional(),
	notes: z.array(z.object({ at: z.iso.datetime(), text: z.string().trim().min(1).max(2000) })).max(200),
});
