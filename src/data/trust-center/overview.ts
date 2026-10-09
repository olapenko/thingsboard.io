import {
	ACCESS_CONTROLS,
	DATA_CONTROLS,
	DEV_CONTROLS,
	PRODUCT_CONTROLS,
	type Control,
} from '@data/trust-center/controls';
import { link } from '@data/trust-center/html';
import { HUES, tc } from '@data/trust-center/nav';

/**
 * The overview's and the hubs' summaries, from the draft's tiles, with the review's edits.
 *
 * Build v3 gave Security and Deployment hubs, so each topic now lives on its section's hub rather
 * than on the overview, which lists the sections instead (`SECTIONS` in `@data/trust-center/nav`).
 * The four Security pages are now the Security hub's sections; the deployments are the Deployment
 * hub's cards, with Commitment and responsibility on the hub under them. The draft's Compliance tile
 * is gone: its points are the Compliance page's facts.
 */

export interface SecurityTopic {
	/** The section's anchor on the Security page. */
	id: string;
	title: string;
	icon: string;
	/** The section's opening line: the lede of the page it was. */
	lede: string;
	controls: Control[];
	/** A closing line, HTML. */
	note?: string;
}

/**
 * The Security page's four sections, each a page of its own until they merged: its mark, the line
 * that was the page's lede, and its controls. The tiles' points are gone with the tiles: the
 * controls under them say the same in full.
 */
export const SECURITY_TOPICS: SecurityTopic[] = [
	{
		id: 'product',
		title: 'Product security',
		icon: 'tabler:device-desktop',
		lede: "How the platform protects device connections, credentials and secrets, so you don't have to build this layer yourself.",
		controls: PRODUCT_CONTROLS,
		note: `Full documentation for every feature is in the ${link('/docs/pe/user-guide/security/overview/', 'Security section')} of the docs.`,
	},
	{
		id: 'data',
		title: 'Data security',
		icon: 'tabler:database',
		lede: 'What happens to the data your devices send to the platform, from the moment it arrives until you delete it.',
		controls: DATA_CONTROLS,
	},
	{
		id: 'access',
		title: 'Access control',
		icon: 'tabler:lock',
		lede: 'Who can sign in, what each user can see, and a record of what they did. We built these controls into the platform; you decide how strictly to apply them in your tenant.',
		controls: ACCESS_CONTROLS,
	},
	{
		id: 'dev',
		title: 'Dev security',
		icon: 'tabler:code',
		lede: 'How we build, test and release the software you run. These practices come from years of delivering production IoT solutions on our own platform.',
		controls: DEV_CONTROLS,
		note: `Found a weakness in our software? ${link(tc('report-vulnerability'), 'Report it privately')}, and we'll respond within three business days.`,
	},
];

export const CERTIFICATES = [
	{
		title: 'ISO/IEC 27001:2022',
		number: '27001',
		subtitle: 'Information security management system',
		href: `${tc('compliance')}#iso-27001`,
	},
	{
		title: 'ISO 9001:2015',
		number: '9001',
		subtitle: 'Quality management system',
		href: `${tc('compliance')}#iso-9001`,
	},
];

/**
 * The regulations we declare compliance with. GDPR takes the EU's circle of stars, the mark it is
 * known by; the CCPA has no such mark, so it takes the kit's privacy glyph.
 */
export const PRIVACY = [
	{
		title: 'GDPR',
		subtitle: 'Applied to all personal data we process',
		href: `${tc('compliance')}#gdpr`,
		icon: 'simple-icons:europeanunion',
		accent: '#003399',
	},
	{
		title: 'CCPA',
		subtitle: "California residents' privacy rights",
		href: `${tc('compliance')}#ccpa`,
		icon: 'tabler:user-shield',
		accent: HUES.violet,
	},
];

export const CERT_VALIDATOR = 'https://swissapproval.ch/certificate-validator/';

/**
 * The Deployment hub's cards. The two deployments carry the products' own marks, as the footer and
 * the product pages draw them: the ThingsBoard mark in the brand blue for Cloud, in the on-premises
 * green for the platform you run yourself. Commitment and responsibility is not a card: it is the
 * hub's own sections, under the cards.
 */
export const DEPLOYMENTS: { title: string; text: string; href: string; accent: string }[] = [
	{
		title: 'ThingsBoard Cloud and Private Cloud',
		text: 'We host and run the platform, so you can focus on your solution.',
		href: tc('cloud'),
		accent: HUES.brand,
	},
	{
		title: 'On-premises',
		text: 'You run the platform; we provide the product code, security fixes and guides.',
		href: tc('onprem'),
		accent: 'onprem',
	},
];
