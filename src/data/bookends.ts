import { installProducts, type InstallOption, type InstallRegion } from '@data/installationsHub';
import { onPremCtas } from '@data/onPremPage';
import { paasCtas } from '@data/paasPage';
import { INSTALL_GUIDE_HREF } from '@data/cta-destinations';

/**
 * The bookends: the band that closes a marketing page, over its footer. One shape on every page —
 * the product's mark, a title, a lead, the way in, a quieter way to ask a person, a note — with each
 * page's own words and actions. `Landing/Bookend` renders it; judged at `/internal/sections/footer/`
 * under the footer it sits on.
 *
 * Until now the shape was written three times: `ClosingCta` on the homepage, and `.page-closing`
 * inline on the Cloud and On-premises pages. The words below are those three, verbatim, except where
 * a note says otherwise.
 *
 * THE WAYS IN come from the installations hub (`data/installationsHub.ts`), not from a copy: Cloud's
 * two regions, each a sign-up on its region's host, and the On-premises guides "On your servers". So
 * a region or a guide changed there changes here.
 */

export type BookendId = 'home' | 'cloud' | 'onprem';

/** A button: primary is filled in the page's accent, secondary is the outline beside it. */
export interface BookendAction {
	text: string;
	href: string;
	icon: string;
	attrs?: Record<string, string>;
}

export interface BookendLink {
	text: string;
	href: string;
}

export interface Bookend {
	title: string;
	lead: string;
	/** The mark's squircle on the light ground, where it is filled (the product pages' app logo). */
	accent: string;
	/**
	 * The product's badge — the mark knocked out of `accent` — over the title in the column layout:
	 * the product pages' own, which open on it. The homepage's bookend is not one product's, so it
	 * has none.
	 */
	badge?: boolean;
	/** The light ground: the page's own tint. */
	band: string;
	/** The way in as buttons, when the bookend shows no regions or platforms. */
	primary: BookendAction;
	secondary: BookendAction;
	/** A question over a button of its own, under the pair: the homepage's "Evaluating…?" */
	ask?: { label: string; action: BookendAction };
	/** Quiet links beside the ways in: pricing. */
	links?: BookendLink[];
	/** The line to the other platform, the way the On-premises page already has one to Cloud. */
	cross?: { lead: string; link: BookendLink; tail?: string };
	/** The legal line at the foot. */
	note?: BookendLink;
	/**
	 * With the regions: the other ways on, as quiet cards beside them — an icon, a name, one line, the
	 * whole card the link. No accent: the regions are the path, these are the side doors.
	 */
	side?: BookendSide[];
	/**
	 * `ways: 'cards'`: the pair under the lede with this primary, and these cards beside it — for when
	 * sign-up sends each visitor to their region on its own, so the band needs no region cards.
	 */
	cards?: { primary: BookendAction; items: BookendSide[] };
}

export interface BookendSide {
	title: string;
	line: string;
	href: string;
	icon: string;
}

const onPremises = installProducts.find((p) => p.id === 'on-premises');
const cloud = installProducts.find((p) => p.id === 'cloud');
if (!onPremises?.options || !cloud?.regions)
	throw new Error('bookends: the installations hub lost its regions or guides');

/** Cloud's two regions, as the hub lists them: North America, then Europe. */
export const BOOKEND_REGIONS: InstallRegion[] = cloud.regions;

/**
 * Four of the On-premises guides, not all seven: the ones most installs start from — the container,
 * the server OS, the cluster, the board — and a link to the rest. Picked by guide, so a relabel in the
 * hub follows.
 */
const PICK = [
	'/docs/installation/docker/',
	'/docs/installation/ubuntu/',
	'/docs/installation/',
	'/docs/installation/rpi/',
];
const guides = onPremises.options.flatMap((g) => g.items);
export const BOOKEND_PLATFORMS: InstallOption[] = PICK.map((href) => {
	const found = guides.find((o) => o.href === href);
	if (!found) throw new Error(`bookends: no On-premises guide at ${href}`);
	return found;
});
export const BOOKEND_ALL_OPTIONS: BookendLink = { text: 'All installation options', href: '/installations/' };

/** Cloud's own quiet link on the hub ("See plans"), under the Cloud bookend's regions. */
const plans = cloud.links[0];
export const BOOKEND_CLOUD_PLANS: BookendLink = { text: plans.label, href: plans.href };

const TALK: BookendAction = { text: 'Talk to an expert', href: '/contact-us/', icon: 'tabler:messages' };

export const BOOKENDS: Record<BookendId, Bookend> = {
	// `ClosingCta`'s, word for word.
	home: {
		title: 'Ready to build your IoT solution with ThingsBoard?',
		lead: 'Start free in the cloud, install On-premises on your own infrastructure, or talk to our team about your specific use case.',
		accent: '#3d50f5',
		band: '#f5f6ff',
		primary: {
			text: 'Start free on Cloud',
			href: 'https://thingsboard.cloud/signup',
			icon: 'tabler:cloud-filled',
			attrs: { 'data-cloud-auth': 'signup' },
		},
		secondary: { text: 'Install On-premises', href: INSTALL_GUIDE_HREF, icon: 'tabler:download' },
		ask: { label: 'Evaluating for a large deployment?', action: TALK },
		// Beside the regions (`ways: 'regions'`). The install line is the hub's On-premises one, cut to a
		// clause; the expert card's line is the band's own question; the pricing line is drafted here.
		side: [
			{
				title: 'Installation options',
				line: 'Free to install, on your own servers or fully offline.',
				href: '/installations/',
				icon: 'tabler:download',
			},
			{ title: 'Pricing', line: 'Cloud plans and self-hosted licences.', href: '/pricing/', icon: 'tabler:tag' },
			{ title: TALK.text, line: 'Evaluating for a large deployment?', href: TALK.href, icon: TALK.icon },
		],
		// The redirect form: "Try for free", the hero's and the header's words, since sign-up now picks
		// the region itself; Install On-premises beside it; pricing and contact as the two cards.
		cards: {
			primary: {
				text: 'Try for free',
				href: 'https://thingsboard.cloud/signup',
				icon: 'tabler:cloud-filled',
				attrs: { 'data-cloud-auth': 'signup' },
			},
			items: [
				{ title: 'Pricing', line: 'Cloud plans and self-hosted licences.', href: '/pricing/', icon: 'tabler:tag' },
				{ title: 'Contact us', line: 'Evaluating for a large deployment?', href: TALK.href, icon: TALK.icon },
			],
		},
	},

	// The Cloud page's `.page-closing`, word for word; the pricing link and the line to On-premises
	// are new (drafted here, not the design's), the second mirroring the one the On-premises page has.
	cloud: {
		title: 'Ready to build on ThingsBoard Cloud?',
		badge: true,
		lead: 'Start free on Public Cloud in under five minutes, or talk to our team about a dedicated Private Cloud cluster.',
		accent: '#3d50f5',
		band: '#f5f6ff',
		primary: {
			text: paasCtas.primary.text,
			href: paasCtas.primary.href,
			icon: 'tabler:cloud-filled',
			attrs: paasCtas.primary.attrs,
		},
		secondary: { text: paasCtas.secondary.text, href: paasCtas.secondary.href, icon: 'tabler:message-circle' },
		links: [{ text: 'See plans', href: '/pricing/' }],
		cross: {
			lead: 'Need it on your own servers?',
			link: { text: 'ThingsBoard On-premises', href: '/products/thingsboard-pe/' },
		},
		note: paasCtas.privacy,
	},

	// The On-premises page's `.page-closing`, word for word, with the page's own line to Cloud.
	onprem: {
		title: 'Ready to deploy ThingsBoard?',
		badge: true,
		lead: 'Start on the Free plan and run it on your own hardware, or talk to our team about a perpetual licence and offline operation.',
		accent: '#178649',
		band: '#f1f8f4',
		primary: { text: onPremCtas.install.text, href: onPremCtas.install.href, icon: 'tabler:server' },
		secondary: { text: onPremCtas.secondary.text, href: onPremCtas.secondary.href, icon: 'tabler:message-circle' },
		links: [{ text: 'See plans', href: onPremCtas.primary.href }],
		cross: {
			lead: onPremCtas.cloud.lead,
			link: { text: onPremCtas.cloud.text, href: onPremCtas.cloud.href },
			tail: onPremCtas.cloud.tail,
		},
		note: onPremCtas.legal,
	},
};
