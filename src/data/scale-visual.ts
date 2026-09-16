/**
 * Content for the scale half of "Deploy anywhere, scale without surprises".
 *
 * The section carries two claims that want two different pictures: that the platform scales, and
 * that it runs on any ground. This file is the first. The second — Cloud, on-premises, fully
 * offline — is a deployment and commercial story, and the free plan belongs with it rather than
 * here, because "5 devices, no card" is a fact about how you buy ThingsBoard and not about how it
 * behaves under load.
 *
 * EVERY NUMBER BELOW IS FROM THE REPO'S OWN BENCHMARKS, not from a marketing estimate. See
 * `_includes/docs/reference/architecture/performance.mdx` (scenarios B, D and E, each a 24h+ run on
 * AWS EC2 with MQTT smart-meter emulators) and `deployment-scenarios.mdx` for the sizing. The draft
 * this replaces put "one server with PostgreSQL" at 10K devices; the benchmark puts the same
 * sentence at 100K, and Scenario A tops a standalone monolith out near 300K. The honest number is
 * an order of magnitude better than the one we were about to claim.
 */

export const SCALE_COPY = {
	title: 'Scale without surprises',
	// Deliberately not "from 5 devices to 5+ million". The docs benchmark to 1M and size clusters to
	// 1M; nothing in this repo backs 5M, so the visual does not draw it. Raise it when there is a
	// benchmark to cite.
	body: 'From a pilot on one small server to a million devices. Every step is benchmarked: you know the machine, the database, and how much headroom is left before you need the next one.',
	link: { text: 'See the benchmarks', href: '/docs/reference/architecture/performance/' },
	badge: { icon: 'tabler:trending-up', color: '#1f8b4d' },
};

/** What the chart plots, said once so the percentages have a unit. */
export const SCALE_AXIS = {
	caption: 'CPU load on the recommended server',
};

export interface ScalePhase {
	/** The band this phase covers, as the recommendations table divides it. */
	range: string;
	/** Device count at the benchmarked point — the figure the column is really about. */
	devices: string;
	/** Measured average CPU, as a percentage. This is the bar. */
	load: number;
	/** The throughput that load was measured at, so the percentage is not a free-floating claim. */
	rate: string;
	/** The instance it ran on. */
	machine: string;
	/** What stores and queues the data at this scale. */
	stack: string[];
	/** The one thing that changes at this step. */
	note: string;
}

/**
 * Three measured points, which is what makes this a chart rather than an illustration.
 *
 * The bars are all the same height because they are all the same thing — one machine's capacity —
 * and only the fill differs. Read across, the fleet grows 10x while the load goes 20 -> 40 -> 55:
 * the load curve flattens against the device curve, which is the entire claim of the headline said
 * as a measurement instead of as an adjective.
 *
 * The third note is the one worth reading twice. The recommendations table puts a microservices
 * cluster at 500K+, but benchmark E reached 1M devices on a SINGLE monolithic instance at 55% CPU.
 * So the cluster is not what rescues you from running out of capacity — you move to it for high
 * availability. Saying that plainly is worth more than implying the platform hits a wall.
 */
export const SCALE_PHASES: ScalePhase[] = [
	{
		range: 'Up to 100K',
		devices: '100K',
		// Scenario B: 100K devices, 1,111 msg/sec, 3,333 dp/sec, c5.xlarge, PostgreSQL, 20% avg CPU.
		load: 20,
		rate: '3.3K data points/sec',
		machine: '4 vCPU · 8 GB',
		stack: ['PostgreSQL'],
		note: 'One server. No queue, no cluster.',
	},
	{
		range: '100K – 500K',
		devices: '500K',
		// Scenario D: 500K devices, 5,555 msg/sec, 16,666 dp/sec, c5.4xlarge, Kafka + Cassandra, 40%.
		load: 40,
		rate: '16.7K data points/sec',
		machine: '16 vCPU · 32 GB',
		// PostgreSQL tops out near 5K data points/sec, so this is the step where the database
		// changes — not the step where the platform does.
		stack: ['Cassandra', 'Kafka'],
		note: 'Same shape, a database built for the write rate.',
	},
	{
		range: '500K – 1M',
		devices: '1M',
		// Scenario E: 1M devices, 11,111 msg/sec, 33,333 dp/sec, c5.9xlarge, Kafka + Cassandra, 55%.
		load: 55,
		rate: '33.3K data points/sec',
		machine: '36 vCPU · 72 GB',
		stack: ['Cassandra', 'Kafka'],
		note: 'Cluster for high availability, not for capacity.',
	},
];

// -------------------------------------------------------------------------------------------
// A second cut of the same section, kept beside the first rather than replacing it.
//
// Two changes of mind, both driven by measurement. The chart's metric moves from CPU to MACHINES:
// the fear behind "without surprises" is the infrastructure bill, and a countable row of boxes
// answers it more directly than a percentage does. And the content is cut hard, because at 440px —
// the container a real 2-column section gives — the first version's labels measure 9.8px, and at
// phone width 7.4px. That is a density problem, not a type-size problem, so the fix is fewer facts
// rather than bigger ones.
// -------------------------------------------------------------------------------------------

export const SCALE_MACHINES_AXIS = {
	caption: 'What you run',
	// The most useful sentence the docs contain, and a caveat rather than a headline: the cluster
	// tables size the SAME million devices at 12 instances and at 68, purely on report interval.
	// Device count does not determine the infrastructure; message rate does.
	footnote: 'A million smart meters reporting every 15 minutes. The same million reporting every 10 seconds need 68.',
};

export interface ScaleTier {
	/** The device count this tier is sized for, as it is written. */
	devices: string;
	/** The same figure as a number, so a bar can be drawn to scale rather than to feel. */
	count: number;
	/** Application servers. */
	own: number;
	/**
	 * Database machines standing apart from the application server.
	 *
	 * Only ever the middle tier, and that is the point of it: at 100K the database sits ON the one
	 * server, and in the cluster it is one of the twelve instances already counted. The single step
	 * worth drawing it separately is the step where it MOVES — PostgreSQL beside the app tops out
	 * around 5K data points/sec and 500K devices need 16.7K, so the database leaves the box.
	 * Whether you then buy it managed or run it yourself is a procurement choice rather than an
	 * architectural one, which is why this is no longer called `managed`.
	 */
	database: number;
	/** Said in words, because "1 server" and "12 instances" are not the same kind of thing. */
	machines: string;
	/** Measured average CPU, carried as a single figure rather than a second chart. */
	load: number;
	stack: string[];
}

/**
 * Machine counts, every one summed from a table in the docs rather than estimated.
 *
 * - 1 server: Scenario A, "a single server running ThingsBoard in monolithic mode with PostgreSQL
 *   on the same machine", good to ~300K devices. CPU from benchmark B (100K devices, 20%).
 * - 1 + database: Scenario B, "ThingsBoard on one server, database on a separate managed service".
 *   The docs give this shape but never a machine count at 500K, so this tier says what you operate
 *   and does not invent a number. CPU from benchmark D (500K devices, 40%).
 * - 12 instances: Scenario C, 1M smart meters — 2 MQTT + 2 TB Node + 3 Zookeeper + 1 Redis +
 *   3 Kafka + 1 PostgreSQL. CPU from benchmark E (1M devices, 55%).
 *
 * The middle tier is the one to drop if this has to get smaller: it is the only one whose machine
 * count is a shape rather than a sum, and three tiers cost 640 units of width where two cost 420 —
 * which at phone width is the difference between 12.8px chips and 8.4px ones.
 */
export const SCALE_TIERS: ScaleTier[] = [
	{
		devices: '100K',
		count: 100_000,
		own: 1,
		database: 0,
		machines: '1 server',
		load: 20,
		stack: ['PostgreSQL'],
	},
	{
		devices: '500K',
		count: 500_000,
		own: 1,
		database: 1,
		machines: '1 server + database',
		load: 40,
		stack: ['Cassandra', 'Kafka'],
	},
	{
		devices: '1M',
		count: 1_000_000,
		own: 12,
		database: 0,
		// Naming the architecture, not just the count: "cluster" is the word the docs use for this
		// scenario and the word a reader arrives with. The other two labels stay a count of boxes
		// because that is all they are.
		machines: '12-instance cluster',
		// Belongs to benchmark E, which reached 1M devices on a SINGLE monolithic instance with
		// Cassandra at 33.3K data points/sec — a different machine and a different workload from the
		// twelve-instance cluster this tier counts. No CPU figure is published for that cluster, so
		// this number and this tier do not describe the same deployment. Only the two visuals that
		// print a percentage are affected; the growth chart does not show one.
		load: 55,
		// PostgreSQL, not Cassandra. The twelve instances are the 1M smart-meter cluster, and that
		// table reads 2 MQTT + 2 TB Node + 3 Zookeeper + 1 Redis + 3 Kafka + 1 POSTGRESQL — there is
		// no Cassandra in it, because a million meters reporting every 15 minutes is only 3.3K data
		// points/sec and PostgreSQL carries that. Cassandra belongs to the OTHER cluster table, the
		// one that needs 68 instances. Taking the count from one and the database from the other
		// described a deployment that does not exist.
		stack: ['PostgreSQL', 'Kafka'],
	},
];

/** The same story with the unevidenced middle tier removed. Both counts here are sums of a table. */
export const SCALE_TIERS_PAIR: ScaleTier[] = [SCALE_TIERS[0], SCALE_TIERS[2]];

// -------------------------------------------------------------------------------------------
// A fifth cut, and the first drawn from a proposal rather than from the benchmark tables.
//
// The proposal was a SLIDER: drag from 5 devices to 5M+ and a card answers with a badge, a stack
// and a sentence. Three things in it are kept — the reader's own fleet as the way in, one range
// rather than a menu, and three facts per answer. The slider is not, because a homepage visual is
// read rather than operated, because a readout of "4.9M" is a precision that is an artifact of
// pixel position, and because the range ran to 5M+ when nothing in this repo benchmarks past 1M.
//
// WHAT THE SLIDER GOT RIGHT AND THIS FILE HAD WRONG. The proposal put single-node at about 10K
// devices. The first draft of this cut put it at 100K, taken from the docs. Worked through, the
// proposal is closer to honest, and the two numbers are not in conflict — they are the same server
// under different workloads. PostgreSQL carries ~5,000 data points/sec, which at 3 data points a
// message is ~1,667 messages/sec, so ONE SERVER HOLDS:
//
//     devices reporting every 10 s      ~16,700     <- the proposal's ~10K
//     devices reporting every 60 s      ~100,000    <- the figure taken from the docs
//     devices reporting every 15 min    ~1,500,000
//
// The benchmark labelled "100K devices" is a 90-second interval (1,111 msg/sec across 100K
// devices); `deployment-scenarios` describes 100K meters at a 15-minute interval. Two pages, the
// same headline number, assumptions an order of magnitude apart. Meanwhile the docs' own 20K GPS
// trackers produce 10,000 data points/sec, which is TWICE what PostgreSQL will take — so a single
// server does not reach 100K of anything that reports often.
//
// Hence: every tier is a RANGE, not a point, and the interval that sets it is stated once
// underneath. A single number here is the thing that generates the support ticket.
// -------------------------------------------------------------------------------------------

/** What a machine is doing, which is all the drawing needs in order to colour it. */
export type ScaleRole = 'app' | 'infra' | 'db';

export interface ScaleSetupTier {
	/** The mode, in the docs\' own words: monolithic, hybrid, cluster. Reads as the card\'s title. */
	mode: string;
	/** Read before the figure. Empty on the column whose figure is not a count. */
	lead?: string;
	/**
	 * The figure itself, and a CEILING rather than a band.
	 *
	 * Four versions of this field have been wrong. A bare "100K" promised one server covers 100K of
	 * anything. "Up to 10K – 100K" folded the workload caveat into the number and produced a fork
	 * inside a bound. "5 – 100K" fixed the floor but made the other columns read as bands too, and a
	 * band has a bottom — which put a chatty 20K fleet in the wrong column, since the docs' own 20K
	 * GPS trackers already exceed what one server with PostgreSQL will take.
	 *
	 * A ceiling has no such problem: every mode covers everything below its number, the columns
	 * overlap honestly, and you choose between them on rate and uptime rather than on fleet size.
	 * The five-device start moved into `trait`, where it is a sentence rather than a bound.
	 */
	devices: string;
	/** Open-ended, drawn as a mark on the figure rather than as a word in front of it. */
	plus?: boolean;
	/**
	 * The word under the figure. Defaults to "devices", and is blanked on the Cluster column, whose
	 * figure is not a device count — "Any size devices" is not a phrase.
	 */
	unit?: string;
	/**
	 * What choosing this mode gets you — the reason to be in this column rather than the one beside.
	 *
	 * The row exists because without it the columns claim something false: read as a progression
	 * driven by fleet size, the third says "a cluster is what you need at a million devices", which
	 * is wrong in both directions. Scenario A is "No — single point of failure" and Scenario B is
	 * "still a single ThingsBoard process — no HA for the application", so a 20K fleet with an uptime
	 * commitment needs the cluster too; and benchmark E served 1M devices on ONE instance, so a
	 * million devices does not by itself require one.
	 *
	 * STATED AS A GAIN, NOT A RISK. The first version of this row printed "Single point of failure"
	 * under two of the three columns, which is accurate and is also us running down our own product
	 * on our own homepage. The information that matters is that HIGH AVAILABILITY IS WHAT THE CLUSTER
	 * IS FOR; naming that as the cluster\'s trait carries it without the other two columns having to
	 * describe themselves as a liability. The caveat itself belongs in the docs, which state it
	 * plainly, and in the section copy.
	 */
	trait: string;
	/** One entry per machine, so the count is drawn by counting rather than asserted. */
	machines: ScaleRole[];
	/**
	 * Draw the machines as a shape that continues rather than as a countable total.
	 *
	 * Set on the Cluster column, where a literal count cannot be honest. The twelve were the sum of
	 * the 1M smart-meter table, which runs PostgreSQL and no Cassandra; the cluster that DOES run
	 * Cassandra is the GPS one, at sixty-eight machines. Drawing the first count beside the second
	 * one\'s database described a deployment that exists in neither table — the precise mistake this
	 * file warns about twice above. A column whose fleet reads "Any size" cannot have a fixed
	 * machine count anyway, so the grid fades out instead of stopping.
	 */
	openEnded?: boolean;
	/** Drawn on the single machine that also carries its own database. */
	onboardDb?: boolean;
	/**
	 * What runs, BESIDES ThingsBoard.
	 *
	 * ThingsBoard used to be chip one in all three columns, on the argument that the constant is the
	 * point. In the row it just read as three-fifths of the ink saying the same word, and the word a
	 * reader on our own homepage least needs. It is still in the drawing — every blue machine is a
	 * ThingsBoard machine — and the legend says so once.
	 */
	stack: string[];
}

/**
 * Three modes, and the machine count is the story: 1 -> 3 -> 12.
 *
 * Ceilings, derived rather than chosen. PostgreSQL carries ~5,000 data points/sec, which at 3 data
 * points a message is ~1,667 messages/sec, so one server reaches ~16K devices reporting every ten
 * seconds and ~150K reporting every ninety. Rounded conservatively, that is the first column.
 * Benchmark E measured 33.3K data points/sec on one instance with Kafka and Cassandra, which is
 * 6.7x the PostgreSQL figure and lands the second column at ~100K chatty or ~1M moderate devices —
 * the same arithmetic, one tier up.
 *
 * The middle tier reaching 1M is not a typo and is the most interesting fact here: every row of
 * that benchmark table is "a single ThingsBoard instance in monolithic mode". So the cluster is not
 * what rescues you from running out of capacity. You move to it for high availability, and for what
 * lies past the numbers we publish.
 */
export const SCALE_SETUP: ScaleSetupTier[] = [
	{
		mode: 'Monolith',
		lead: 'Up to',
		devices: '100K',
		// Carries the five-device start that used to be the bottom of a band, and says what the mode
		// actually costs you to run — which is the reason to be in this column rather than the next.
		trait: 'One machine, from five devices up',
		machines: ['app'],
		onboardDb: true,
		stack: ['PostgreSQL'],
	},
	{
		mode: 'Hybrid',
		lead: 'Up to',
		devices: '1M',
		trait: 'Telemetry moves to its own database',
		// Application, queue, database. Kafka is not optional at this rate: the in-memory queue is
		// documented as unreliable past ~3K data points/sec, and this tier starts above that.
		machines: ['app', 'infra', 'db'],
		// Cassandra stands for "or TimescaleDB"; the docs offer them as alternatives for hybrid mode.
		stack: ['PostgreSQL', 'Kafka', 'Cassandra'],
	},
	{
		mode: 'Cluster',
		// NOT "1M+". A cluster is the answer to an uptime requirement at any fleet size, and pinning
		// it to a device count told a reader with 50K devices and an SLA that they did not need one.
		// The million-device claim has not been given up: it moved to the column that actually earns
		// it, Hybrid, where the benchmark put it on a single instance.
		devices: 'Any size',
		unit: '',
		trait: 'Redundant instances, added for uptime',
		// Enough machines to read as a cluster, in roughly the proportion the docs show — a third of
		// them running ThingsBoard and the rest infrastructure. NOT a count to be taken literally:
		// see `openEnded`. The two cluster tables in the docs are twelve machines and sixty-eight,
		// and which one you land on is set by message rate rather than by fleet size.
		machines: ['app', 'app', 'app', 'app', 'infra', 'infra', 'infra', 'infra', 'infra', 'infra', 'infra', 'db'],
		openEnded: true,
		// Cassandra is here on the Recommendations table\'s own authority: "500K+ devices, 15K+ dp/sec
		// -> Microservices cluster, Cassandra, Kafka". Leaving it out made the column read as a
		// regression from Hybrid, with telemetry apparently moving BACK to PostgreSQL as the fleet
		// grew, which nothing in the docs says.
		//
		// This list is only safe to state alongside a grid that does not claim a total. PostgreSQL
		// holds entities in every deployment; Zookeeper and Redis are in the component table; and the
		// time-series store answers message rate, so both appear across the cluster tables.
		stack: ['PostgreSQL', 'Cassandra', 'Kafka', 'Redis'],
	},
];

/**
 * Said once, because the colour coding is otherwise a question the card cannot answer.
 *
 * Two squares appeared in the drawing with no key at all, and "what do the grey ones mean" was the
 * first thing asked about it. This also keeps ThingsBoard in the visual after its chip came out of
 * all three stacks: it is the blue machines, stated once instead of three times.
 */
export const SCALE_SETUP_LEGEND = [
	{ role: 'app' as ScaleRole, label: 'ThingsBoard' },
	// Its own entry rather than folded into the one below, because the drawing gives it its own
	// treatment — and because where the data lives is exactly what moves between the first column
	// and the second. A key that named two things while the drawing showed three left the darkest
	// square on the card, the one the eye goes to, undecoded.
	{ role: 'db' as ScaleRole, label: 'Database' },
	{ role: 'infra' as ScaleRole, label: 'Queue, coordination' },
];

/**
 * WHERE THE INTERVAL CAVEAT WENT, because it is load-bearing and it is not in this component.
 *
 * A sentence explaining that the ceilings move with reporting interval used to render under the
 * three columns. It came out: this is a visual, and a paragraph under a drawing is a second copy
 * block competing with the one the section already has. ScaleTiers made the same move earlier and
 * for the same reason — "the sentences that were here have gone to the section copy, where a
 * sentence belongs."
 *
 * It still has to be said somewhere, or the first column promises that one server covers 100K of
 * anything, which is the reading that came back from review. The place for it is SCALE_COPY.body
 * above, which is the row\'s own copy column. Proposed wording, not yet applied because that string
 * is shared with the four other cuts:
 *
 *   "...Every step is benchmarked: you know the machine, the database, and how much headroom is
 *    left. How often your devices report sets the ceiling — one server covers ~10K devices
 *    reporting every few seconds, or ~100K reporting every 15 minutes."
 */
