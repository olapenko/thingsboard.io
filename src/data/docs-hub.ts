import { FOOTER_ECOSYSTEM, FOOTER_PLATFORMS, type FooterProduct } from '@data/footer-map';
import { docsSubmenu, type SubMenuItem } from '@data/navigation';

/**
 * THE DOCS HUB (`/docs/`): where a reader who does not yet know which product's documentation they
 * want starts. PROPOSAL, held for a ship decision (LAB.md, "Awaiting a ship decision").
 *
 * The products are the Docs menu's own groups, so the hub and the menu cannot list different
 * products; Community Edition is not one of them (it ends at 4.3), only a quiet line under
 * ThingsBoard for the reader who runs it. Every other link goes to the ThingsBoard (PE) docs, as the
 * footer's do.
 */
export interface DocsHubLink {
	title: string;
	href: string;
	/** One line under the title, on the Start here cards only. */
	line?: string;
	icon?: string;
}

/** The four first stops, in the order a newcomer comes to them. */
export const DOCS_HUB_START: DocsHubLink[] = [
	{
		title: 'Getting started',
		line: 'Your first device and dashboard in about 15 minutes',
		href: '/docs/pe/getting-started/',
		icon: 'tabler:rocket',
	},
	{
		title: 'Connect devices',
		line: 'MQTT, HTTP, CoAP, LwM2M and gateways',
		href: '/docs/pe/connect-iot-devices/',
		icon: 'tabler:plug-connected',
	},
	{
		title: 'Build with AI',
		line: 'The ThingsBoard CLI and coding agents',
		href: '/docs/pe/iot-solutions-with-ai/',
		icon: 'tabler:sparkles',
	},
	{
		title: 'REST API',
		line: 'Manage the platform from your own code',
		href: '/docs/pe/reference/rest-api/',
		icon: 'tabler:code',
	},
];

/** A product's docs, with the badge the footer's map gives the product (found by its name). */
export interface DocsHubProduct extends SubMenuItem {
	mark: FooterProduct;
}

const group = (name: string): DocsHubProduct[] => {
	const found = docsSubmenu.groups.find((g) => g.name === name);
	if (!found) throw new Error(`[docs-hub] the Docs menu has no "${name}" group`);
	return found.items.map((item) => {
		const mark = [...FOOTER_PLATFORMS, ...FOOTER_ECOSYSTEM].find((p) => p.name === item.heading);
		if (!mark) throw new Error(`[docs-hub] the footer's map has no product named "${item.heading}"`);
		return { ...item, mark };
	});
};

export const DOCS_HUB_PLATFORMS = group('IoT platforms');
export const DOCS_HUB_ECOSYSTEM = group('Product ecosystem');

/** Under ThingsBoard's card: the retired edition, for whoever still runs it. */
export const DOCS_HUB_COMMUNITY = {
	under: '/docs/pe/',
	text: 'Running Community Edition?',
	link: { title: 'Its docs', href: '/docs/getting-started/' },
};

/** Three short lists closing the page. */
export const DOCS_HUB_LISTS: { title: string; links: DocsHubLink[] }[] = [
	{
		title: 'Reference',
		links: [
			{ title: 'REST API', href: '/docs/pe/reference/rest-api/' },
			{ title: 'APIs & SDKs', href: '/docs/pe/apis-and-sdks/' },
			{ title: 'Rule engine', href: '/docs/pe/user-guide/rule-engine/' },
			{ title: 'Widgets', href: '/docs/pe/user-guide/widgets/' },
			{ title: 'Architecture', href: '/docs/pe/reference/architecture/' },
		],
	},
	{
		title: "What's new",
		links: [
			{ title: 'Release notes', href: '/docs/pe/releases/releases-table/' },
			{ title: 'Upgrade instructions', href: '/docs/pe/installation/upgrade-instructions/' },
			{ title: 'Roadmap', href: '/docs/pe/releases/roadmap/' },
		],
	},
	{
		title: 'Need help?',
		links: [
			{ title: 'Troubleshooting', href: '/docs/pe/troubleshooting/' },
			{ title: 'Support plans', href: '/services/' },
			{ title: 'Contact us', href: '/contact-us/' },
		],
	},
];
