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
		// "shared or dedicated" rather than "SaaS": with no Private Cloud card of its own, this
		// card is the whole managed family, and the label is where a reader learns there are two
		// of them. The fork itself stays on the Cloud page, which is built around exactly that
		// comparison — see `paasChoice`.
		label: 'Fully managed, shared or dedicated',
		// 99.9, not 99.95. The old figure was in no other file and on no page of develop: develop's
		// own comparison row reads "Uptime SLA — 99.9% / 99.9%–99.99%", and `paasPage.ts` carries
		// the same pair. 99.95 described neither product.
		//
		// The residency sentence came out to make room. It was saying what the two region buttons
		// under it were already saying, and those are gone now as well.
		description:
			'Sign up and start in 5 minutes — we run the servers, scaling, backups and upgrades on a 99.9% SLA. Start free on shared infrastructure, or move to Private Cloud, a dedicated cluster we provision and operate for you.',
		icon: '/src/assets/images/landings/thingsboard-mark.svg',
		cornerIcon: 'tabler:cloud-filled',
		badgeFill: '#3d50f5',
		nameHighlight: 'Cloud',
		href: '/products/paas/',
		action: 'Explore Cloud',
		// One action, not two regions. Which host your data lives on is a real decision, but it is
		// not the decision this section is for — the section asks who runs the platform, and a
		// card that answers with two buttons makes the reader choose a continent before they have
		// chosen a product. The regions are not lost: the header's sign-in menu lists both, and
		// the Cloud page carries them too.
		//
		// The card keeps one action so the pair stays symmetrical — this one starts you, and
		// On-premises' Install does the same on its side.
		stores: [{ label: 'Start for free', href: 'https://thingsboard.cloud/signup', icon: 'tabler:rocket' }],
		accent: '#6e7481',
	},
	{
		name: 'ThingsBoard On-premises',
		label: 'Deployed on your infrastructure',
		// The list is gone, and that is the point: "in AWS, Azure, GCP, or on Kubernetes" named
		// the same four things the `targets` marks name directly underneath, so the card said its
		// targets twice and its reason not at all. The marks are better at the list than a
		// sentence is; the sentence is better at what the list cannot say.
		//
		// So it now says the two things nothing else on this page says. WHO RUNS IT is the
		// decision the section is built on, and it is the only line where this card can answer
		// it. OFFLINE is the capability no managed option has at any price — develop's own
		// On-premises hero leads on it, "Your own cloud, on-premises, or fully offline".
		//
		// It also no longer says "your private cloud". ThingsBoard sells a product by that name —
		// a dedicated cluster OUR team runs — and it is the opposite of this card. Develop's
		// On-premises page never uses the phrase either.
		description:
			'You run the deployment, so data location and compliance stay in your hands — and it can run fully offline.',
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
