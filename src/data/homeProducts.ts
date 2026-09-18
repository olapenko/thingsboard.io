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
	/**
	 * The card's button row. Named `stores` because the ecosystem's mobile card got
	 * there first with App Store / Google Play; here it is the regional sign-ups and
	 * the installer.
	 *
	 * `region` draws the same 24px US/EU mark the header's "Sign in" menu uses, so
	 * the two places a reader picks a region look like the same decision.
	 */
	stores?: { label: string; href: string; region?: 'us' | 'eu'; icon?: string }[];
	/** Monochrome marks under the copy, naming where the product can run. */
	targets?: { label: string; icon: string }[];
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
		action: 'Explore Cloud',
		// Cloud is two regions with separate hosts, so there is no single sign-up
		// URL — the reader picks where their data lives.
		stores: [
			// The header's sign-in menu names the regions exactly this way, and the mark
			// beside each is the same one. "Start in US" next to a US badge said it twice.
			{ label: 'United States', href: 'https://thingsboard.cloud/signup', region: 'us' },
			{ label: 'Europe', href: 'https://eu.thingsboard.cloud/signup', region: 'eu' },
		],
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
		action: 'Explore On-premises',
		// Cloud's row starts you somewhere; this one had only the read-more link, so
		// the two halves of the same decision were not offered on the same terms.
		// `tabler:download` is the hero's own Install glyph, so the page's two install
		// affordances are the same button in two sizes.
		stores: [{ label: 'Install', href: '/installations/', icon: 'tabler:download' }],
		// The four targets the description names, in its order, as monochrome marks.
		// `simple-icons` is single-path and takes `currentColor`, which is what makes a
		// row of four vendor logos possible without four vendor colours — see
		// `ScaleDuo` for the same set used the same way.
		targets: [
			{ label: 'AWS', icon: 'simple-icons:amazonwebservices' },
			{ label: 'Azure', icon: 'simple-icons:microsoftazure' },
			{ label: 'Google Cloud', icon: 'simple-icons:googlecloud' },
			{ label: 'Kubernetes', icon: 'simple-icons:kubernetes' },
		],
		accent: '#6e7481',
	},
];
