import { CLOUD_SIGNUP } from '@data/cta-destinations';

/**
 * The featured slot in the open menu: one card, the same in the Products dropdown and at the foot
 * of the one-panel menu. It goes where every Cloud button goes (`cta-destinations`): the region
 * picker, then the sign-up form.
 */
export const MENU_FEATURED = {
	eyebrow: 'ThingsBoard Cloud',
	title: 'Start for free',
	text: 'Pick a region and start building on the Cloud, with nothing to install.',
	cta: 'Create an account',
	href: CLOUD_SIGNUP.href,
	attrs: CLOUD_SIGNUP.attrs,
};

/**
 * The two promotions beside it in the Products section: what it costs, and how it installs. Both
 * are pages of their own; the row sends a reader there before they dig for either in the docs.
 */
export const MENU_PRODUCT_PROMOS = [
	{
		icon: 'tabler:tag',
		title: 'Pricing',
		text: 'Cloud plans from a free tier, on-premises licences, and an estimator for both.',
		href: '/pricing/',
		id: 'Menu_Products_Pricing',
	},
	{
		icon: 'tabler:download',
		title: 'Installation options',
		text: 'Cloud needs nothing installed; everything else has a guide for every way it installs.',
		href: '/installations/',
		id: 'Menu_Products_Installations',
	},
];
