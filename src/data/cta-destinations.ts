/**
 * Where the site's two calls to action land, in one place, so no button takes a detour.
 *
 * CLOUD: every "Try for free" / "Start for free" opens the region dialog, so a Cloud account is one
 * decision away: pick North America or Europe, and the sign-up form is next. `data-cloud-auth`
 * is what the dialog listens for; the href is only the fallback when there is no script.
 *
 * ON-PREMISES: every "Install" goes straight to the installation guide, where the platforms are
 * listed and each has its steps. `/installations/`, the catalogue of every product, is secondary:
 * the footer links it, and so do the few places that offer every installation option by name.
 */
export const CLOUD_SIGNUP = {
	href: 'https://thingsboard.cloud/signup',
	attrs: { 'data-cloud-auth': 'signup' } as Record<string, string>,
};

/** The On-premises product's own guide, the one `/products/thingsboard-pe/` already sends people to. */
export const INSTALL_GUIDE_HREF = '/docs/pe/installation/';

/**
 * The Private Cloud enquiry form. `pcorder` is the flag the contact form routes on: it opens on the
 * Private Cloud heading and skips the topic question. `paasPage` and `pricing-page` still hold their
 * own copies of the same string.
 */
export const CONTACT_PRIVATE_CLOUD =
	'/contact-us/?subject=Private%20Cloud&pcorder&message=I%20am%20interested%20in%20Private%20Cloud';

/** The two, by name, for the kit's `to` prop: `<Button to="cloud-signup">`, `<Link to="install-guide">`. */
export const DESTINATIONS = {
	'cloud-signup': CLOUD_SIGNUP,
	'install-guide': { href: INSTALL_GUIDE_HREF, attrs: {} as Record<string, string> },
} as const;

export type Destination = keyof typeof DESTINATIONS;
