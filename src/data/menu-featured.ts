import { CLOUD_SIGNUP } from '@data/cta-destinations';

/**
 * WHAT A SECTION PROMOTES under its links: a bar of one-line links — an icon and a title, no more —
 * one of them `featured`, in the accent. Only where a section has SEVERAL ways on that are not its
 * lists: Products (what it costs, how it installs, and the Cloud sign-up, which goes where every
 * Cloud button goes, `cta-destinations`) and Docs (the CLI, and where a newcomer starts). A single
 * one, or a list's own index, is the list's last word instead (`SubMenuGroup.more`): Services'
 * "Talk to an expert", Solutions' "All use cases" and "All case studies". A bar holding one button
 * read as a footer with nothing in it.
 */
export interface MenuPromo {
	icon: string;
	title: string;
	href: string;
	attrs?: Record<string, string>;
	featured?: boolean;
}

export const MENU_SECTION_PROMOS: Record<string, MenuPromo[]> = {
	'nav-products': [
		{ icon: 'tabler:tag', title: 'Pricing', href: '/pricing/' },
		{ icon: 'tabler:download', title: 'Installation options', href: '/installations/' },
		{
			icon: 'tabler:cloud',
			title: 'Start for free on Cloud',
			href: CLOUD_SIGNUP.href,
			attrs: CLOUD_SIGNUP.attrs,
			featured: true,
		},
	],
	'nav-docs': [
		{ icon: 'tabler:terminal-2', title: 'ThingsBoard CLI', href: '/docs/pe/user-guide/cli/' },
		{ icon: 'tabler:rocket', title: 'Getting started', href: '/docs/pe/getting-started/', featured: true },
	],
};
