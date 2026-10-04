import { CLOUD_SIGNUP } from '@data/cta-destinations';

/**
 * WHAT A SECTION PROMOTES under its links: a short row of one-line tiles — an icon and a title, no
 * more — one of them `featured`, in the accent. Products: what it costs, how it installs, and the
 * Cloud sign-up, which goes where every Cloud button goes (`cta-destinations`). Services: the proof
 * and the conversation. Docs: where a newcomer starts.
 */
export interface MenuPromo {
	icon: string;
	title: string;
	href: string;
	id?: string;
	attrs?: Record<string, string>;
	featured?: boolean;
}

export const MENU_SECTION_PROMOS: Record<string, MenuPromo[]> = {
	'nav-products': [
		{ icon: 'tabler:tag', title: 'Pricing', href: '/pricing/', id: 'Menu_Products_Pricing' },
		{ icon: 'tabler:download', title: 'Installation options', href: '/installations/' },
		{
			icon: 'tabler:cloud',
			title: 'Start for free on Cloud',
			href: CLOUD_SIGNUP.href,
			attrs: CLOUD_SIGNUP.attrs,
			featured: true,
		},
	],
	'nav-services': [
		{ icon: 'tabler:briefcase', title: 'Case studies', href: '/case-studies/' },
		{ icon: 'tabler:message-2-star', title: 'Clients feedback', href: '/clients-feedback/' },
		{ icon: 'tabler:messages', title: 'Talk to an expert', href: '/contact-us/', featured: true },
	],
	'nav-docs': [
		{ icon: 'tabler:terminal-2', title: 'ThingsBoard CLI', href: '/docs/pe/user-guide/cli/' },
		{ icon: 'tabler:rocket', title: 'Get started', href: '/docs/pe/getting-started/', featured: true },
	],
};
