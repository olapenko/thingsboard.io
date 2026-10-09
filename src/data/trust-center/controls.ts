import { tc } from '@data/trust-center/nav';

/**
 * The controls of the Security page's four sections (four pages until they merged), from the draft
 * (research/trust-center/CONTENT.md), with the review's repetition edits:
 *
 * - Data security keeps only what is about the data itself. Region, isolation, backups, retention,
 *   deletion, data center attestations and staff access depend on the deployment and live on its
 *   pages, so one row points there (edit 2). GDPR's 30-day erasure moved to GDPR, on the Compliance page.
 * - Encryption in transit keeps its TLS sentence and drops the ports, which Product security lists
 *   (edit 3); the plain-connection note gains its recommendation.
 * - Export keeps "every deployment, through the REST API"; the Private Cloud dump is Cloud's
 *   (edit 8).
 *
 * `html` may hold `<b>`, `<br>` and site links; each control's `id` is its anchor, so an FAQ answer
 * can link straight to it.
 */

export type ControlKind = 'built-in' | 'configurable' | 'deployment';

export interface Control {
	id: string;
	title: string;
	kind: ControlKind;
	html: string;
	/** The docs page for it: a page on this site. */
	docs?: string;
}

export const CONTROL_KIND: Record<ControlKind, string> = {
	'built-in': 'Built in',
	configurable: 'Configurable',
	deployment: 'Depends on deployment',
};

export const PRODUCT_CONTROLS: Control[] = [
	{
		id: 'secrets-storage',
		title: 'Secrets storage',
		kind: 'built-in',
		html: "An AES-256 encrypted vault for API tokens, passwords and certificates used in integrations and rule chains, so credentials don't sit in plain configuration.",
		docs: '/docs/pe/user-guide/security/secrets-storage/',
	},
	{
		id: 'device-authentication',
		title: 'Device authentication',
		kind: 'built-in',
		html: '<b>MQTT:</b> access token, MQTT Basic credentials or X.509 certificate.<br><b>HTTP:</b> access token.<br><b>CoAP:</b> access token or X.509 certificate.<br><b>LwM2M:</b> pre-shared key, raw public key or X.509 certificate.<br><b>SNMP:</b> community string (v1/v2c) or USM credentials (v3).<br><b>Mutual TLS:</b> on MQTT, CoAP and LwM2M, both the device and the server authenticate with X.509 certificates. For a device fleet, we recommend X.509 with a certificate chain.',
		docs: '/docs/pe/user-guide/security/overview/',
	},
	{
		id: 'encrypted-device-transport',
		title: 'Encrypted device transport',
		kind: 'configurable',
		html: 'MQTT over TLS on port 8883, HTTP over TLS on 443, CoAP over DTLS on 5684, LwM2M over DTLS on 5686 and 5688, and SNMPv3 with USM authentication and encryption.',
		docs: '/docs/pe/reference/mqtt-api/getting-connected/',
	},
	{
		id: 'custom-domains',
		title: 'Custom domains with automatic SSL',
		kind: 'built-in',
		html: 'Bind your own domain name; the platform provisions the SSL certificate automatically.',
		docs: '/docs/pe/user-guide/security/domains/',
	},
];

export const DATA_CONTROLS: Control[] = [
	{
		id: 'data-ownership',
		title: 'Data ownership',
		kind: 'built-in',
		html: 'Customer data belongs to the customer. We process it on your behalf under the DPA and never use it to train AI models.',
	},
	{
		id: 'encryption-in-transit',
		title: 'Encryption in transit',
		kind: 'configurable',
		html: `Users and devices connect over TLS; the protocols and ports are under <a href="${tc('security')}#encrypted-device-transport">Encrypted device transport</a>. Unencrypted device connection is available by default for testing or PoC purposes and can be disabled. Turn it off in production.`,
	},
	{
		id: 'secrets-and-passwords',
		title: 'Secrets and passwords',
		kind: 'built-in',
		html: 'Stored secrets are encrypted with AES-256, and user passwords are stored as BCrypt hashes in every deployment.',
	},
	{
		id: 'export',
		title: 'Export',
		kind: 'built-in',
		html: 'Telemetry, entities and dashboards are available through the REST API at any time, in every deployment.',
	},
	{
		id: 'by-deployment',
		title: 'Region, backups, retention and deletion',
		kind: 'deployment',
		html: `Where your data is stored, how it is isolated and backed up, how long it is kept, who on our side can reach it and how it is deleted all depend on how you deploy: see <a href="${tc('cloud')}">Cloud and Private Cloud</a> and <a href="${tc('onprem')}">On-premises</a>.`,
	},
];

export const ACCESS_CONTROLS: Control[] = [
	{
		id: 'two-factor-authentication',
		title: 'Two-factor authentication',
		kind: 'built-in',
		html: 'TOTP authenticator apps, email, SMS and backup codes. System administrators set the platform policy, and tenant administrators can apply their own. From version 4.3, you can require 2FA for all users, for system administrators only, or for tenant administrators of selected tenants. Code lifetime, resend limits and lockout after failed attempts are configurable.',
		docs: '/docs/pe/user-guide/security/two-factor-authentication/',
	},
	{
		id: 'single-sign-on',
		title: 'Single sign-on',
		kind: 'built-in',
		html: 'OAuth 2.0 and OpenID Connect with Google, Auth0, Keycloak, Okta, Azure AD and other identity providers, so account lifecycle stays in your directory. SAML and LDAP are not supported.',
		docs: '/docs/pe/user-guide/security/oauth-2-support/',
	},
	{
		id: 'api-keys',
		title: 'API keys',
		kind: 'built-in',
		html: "Long-lived credentials for integrations, scripts and automation, so you don't share a user's password.",
		docs: '/docs/pe/user-guide/security/api-keys/',
	},
	{
		id: 'role-based-access-control',
		title: 'Role-based access control',
		kind: 'built-in',
		html: 'Roles and entity groups scope each user to their own devices, assets and dashboards: a customer, an operator and an analyst each see only what belongs to them.',
	},
	{
		id: 'session-lifetimes',
		title: 'Session lifetimes',
		kind: 'configurable',
		html: 'You set how long access and refresh tokens (JWT) stay valid. The defaults are 2.5 hours and 7 days; we recommend shortening both.',
		docs: '/docs/pe/user-guide/security/',
	},
	{
		id: 'audit-log',
		title: 'Audit log',
		kind: 'built-in',
		html: 'The platform records user actions, and you can send the log to an external system such as your SIEM.',
		docs: '/docs/pe/user-guide/security/audit-log/',
	},
	{
		id: 'password-and-lockout-policy',
		title: 'Password and lockout policy',
		kind: 'configurable',
		html: 'Minimum length, complexity and lockout after failed attempts, set by the administrator.',
		docs: '/docs/pe/user-guide/security/',
	},
	{
		id: 'password-expiration',
		title: 'Password expiration',
		kind: 'configurable',
		html: 'You can make passwords expire after a set period if your policy requires it. NIST SP 800-63B advises against scheduled rotation, so we recommend it only where a regulator asks for it.',
		docs: '/docs/pe/user-guide/security/',
	},
];

export const DEV_CONTROLS: Control[] = [
	{
		id: 'code-review',
		title: 'Code review and protected branches',
		kind: 'built-in',
		html: 'Every change is reviewed before merge, and branch protection keeps unreviewed code out.',
	},
	{
		id: 'separate-environments',
		title: 'Separate environments',
		kind: 'built-in',
		html: 'Development, test and production run separately, and production data is never used in tests.',
	},
	{
		id: 'code-analysis',
		title: 'Code analysis (SAST)',
		kind: 'built-in',
		html: 'Snyk Code scans LTS branches every week.',
	},
	{
		id: 'dependency-scanning',
		title: 'Dependency scanning',
		kind: 'built-in',
		html: 'Snyk Open Source checks third-party dependencies every week.',
	},
	{
		id: 'container-scanning',
		title: 'Container scanning',
		kind: 'built-in',
		html: 'Docker Scout and Snyk Container scan our container images.',
	},
	{
		id: 'change-management',
		title: 'Change management',
		kind: 'built-in',
		html: 'Every change goes through a request, an impact assessment and an approval, tracked in Jira.',
	},
	{
		id: 'penetration-testing',
		title: 'Independent penetration testing',
		kind: 'built-in',
		html: 'An external tester checks the platform every year, following OWASP, OSSTMM and NIST SP 800-115. The latest test, by DataArt, ran in February 2026, with a retest in March 2026.',
	},
	{
		id: 'security-fixes',
		title: 'Security fixes and CVEs',
		kind: 'built-in',
		html: 'Security fixes ship in patch releases that need no environment or database changes. Fixed CVE IDs are listed in the Security section of the release notes.',
		docs: '/docs/pe/releases/releases-table/',
	},
	{
		id: 'release-support',
		title: 'Release support',
		kind: 'built-in',
		html: 'LTS releases are supported for 18 months, standard releases for 6 months.',
		docs: '/docs/pe/releases/release-policy/',
	},
];
