export interface ProductChoice {
	name: string;
	label: string;
	description: string;
	/** Plain ThingsBoard mark — the qualifier moves to the corner badge. */
	icon: string;
	/** Small line icon pinned to the squircle's top-right corner. */
	cornerIcon: string;
	/** Squircle fill; the mark is knocked out white on top of it. */
	badgeFill: string;
	/** Part of `name` tinted with `badgeFill` — the word that tells the two apart. */
	nameHighlight?: string;
	href: string;
	action: string;
	accent: string;
}

// Two deployments, one decision: who runs it. Community Edition is reachable
// from the nav and the docs — here it answered a different question.
export const homeProducts: ProductChoice[] = [
	{
		name: 'ThingsBoard Cloud',
		label: 'Fully managed SaaS',
		description:
			'Sign up and start in 5 minutes — we handle servers, scaling, backups and upgrades, on a 99.95% SLA. Free tier to start, then flexible subscription tiers as you grow. Available globally, with EU and US data residency.',
		icon: '/src/assets/images/landings/thingsboard-mark.svg',
		cornerIcon: 'tabler:cloud-filled',
		badgeFill: '#3d50f5',
		nameHighlight: 'Cloud',
		href: '/products/paas/',
		action: 'Start on Cloud',
		accent: '#6e7481',
	},
	{
		name: 'ThingsBoard On-premises',
		label: 'Deployed on your infrastructure',
		description:
			'Deploy in your own data centre, in your private cloud (AWS, Azure, GCP), or on Kubernetes. Full control of infrastructure, data location and compliance.',
		icon: '/src/assets/images/landings/thingsboard-mark.svg',
		cornerIcon: 'tabler:square-rotated-filled',
		badgeFill: '#1f8b4d',
		nameHighlight: 'On-premises',
		href: '/products/thingsboard-pe/',
		action: 'See deployment options',
		accent: '#6e7481',
	},
];
