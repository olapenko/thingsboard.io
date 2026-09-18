/**
 * Content for the deployment half of "Deploy anywhere, scale without surprises".
 *
 * The scale half is ScaleGrowth. This is the other one, and its shape comes from a comment already
 * sitting in `homeProducts.ts`: "Two deployments, one decision: who runs it." That is the whole
 * section. The reference draft laid out Cloud, On-premises and Fully offline as three peers, which
 * invents a product — "private cloud" is not a third tier, it is YOUR AWS account, and the
 * on-premises blurb already says so: "your own data centre, your private cloud (AWS, Azure, GCP),
 * or Kubernetes". So the picture forks once rather than branching three ways.
 *
 * Sourced from the repo except where noted:
 * - Two regions with separate hosts, thingsboard.cloud and eu.thingsboard.cloud (`hosts.ts`), and
 *   "Available globally, with EU and US data residency" (`homeProducts.ts`).
 * - The SLA, the managed scope and the on-premises targets are that file's own words.
 * - Air-gapped is the ONE claim here with no page behind it. Nothing in this repo's docs mentions
 *   air-gapped or offline installation, and PE licensing would be the thing to check; it is drawn
 *   on the product team's say-so rather than on a citation, unlike everything else in this family.
 */

export const DEPLOY_COPY = {
	title: 'Deploy anywhere',
	// The fork, said once. Everything else in the visual is an icon and two words.
	body: 'One platform, one decision: who runs it. Fully managed in the region your data has to stay in, or on your own infrastructure — down to a network with no way out.',
	link: { text: 'See deployment options', href: '/products/thingsboard-pe/' },
	// The indigo is DeployFork's own — the only accent in that drawing — rather than a colour picked
	// for the badge and then left to disagree with the visual under it.
	badge: { icon: 'tabler:server-cog', color: '#3d50f5' },
};

export interface DeployPoint {
	icon: string;
	/** Two or three words. The icon carries the rest. */
	label: string;
}

export interface DeployBranch {
	/** Who runs it — the question the fork asks, answered in two words. */
	title: string;
	/** The product this branch is, for the accessible name the icons cannot give. */
	name: string;
	points: DeployPoint[];
}

/**
 * Four points a side, so the two cards are the same size and the fork reads as a choice between
 * equals rather than as a recommendation with an afterthought under it.
 */
export const DEPLOY_BRANCHES: DeployBranch[] = [
	{
		title: 'We run it',
		name: 'ThingsBoard Cloud',
		points: [
			{ icon: 'tabler:cloud-filled', label: 'Fully managed' },
			// Two regions, not a scattering of them: the globe would have been drawing reach, and
			// what the reader needs is where the data legally rests.
			{ icon: 'tabler:world', label: 'US · EU residency' },
			{ icon: 'tabler:shield-check', label: '99.95% SLA' },
			// "Backups & upgrades" measured two lines wide and burst its row; "fully managed" above
			// already carries the backups, so this keeps the half a reader would not assume.
			{ icon: 'tabler:refresh', label: 'Auto upgrades' },
		],
	},
	{
		title: 'You run it',
		name: 'ThingsBoard On-premises',
		points: [
			{ icon: 'tabler:building', label: 'Your data centre' },
			// Named rather than logo'd, for the same reason the connect visual names protocols: three
			// marks imply the three are the list.
			{ icon: 'tabler:cloud', label: 'AWS · Azure · GCP' },
			{ icon: 'tabler:topology-star-3', label: 'Kubernetes' },
			{ icon: 'tabler:plug-off', label: 'Air-gapped' },
		],
	},
];
