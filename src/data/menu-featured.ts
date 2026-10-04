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
