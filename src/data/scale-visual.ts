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
