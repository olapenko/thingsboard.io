/**
 * The four topic pages' rows (Product security, Data security, Access control, Dev security), as the
 * draft's `CAT_*` catalogs have them: a title, a status, the text (the draft's own markup, `<b>` and
 * `<br>`) and, where there is one, the documentation page.
 */

export type ControlStatus = 'in' | 'cfg' | 'dep';

export const STATUS_LABEL: Record<ControlStatus, string> = {
	in: 'Built in',
	cfg: 'Configurable',
	dep: 'Depends on deployment',
};

export interface CatalogRow {
	title: string;
	/** The topic pages' rows have one; Commitments' do not. */
	status?: ControlStatus;
	html: string;
	docs?: string;
}

export const CAT_PRODUCT: CatalogRow[] = [
	{
		title: 'Secrets storage',
		status: 'in',
		html: "An AES-256 encrypted vault for API tokens, passwords and certificates used in integrations and rule chains, so credentials don't sit in plain configuration.",
		docs: '/docs/pe/user-guide/security/secrets-storage/',
	},
	{
		title: 'Device authentication',
		status: 'in',
		html: '<b>MQTT:</b> access token, MQTT Basic credentials or X.509 certificate.<br><b>HTTP:</b> access token.<br><b>CoAP:</b> access token or X.509 certificate.<br><b>LwM2M:</b> pre-shared key, raw public key or X.509 certificate.<br><b>SNMP:</b> community string (v1/v2c) or USM credentials (v3).<br><b>Mutual TLS:</b> on MQTT, CoAP and LwM2M, both the device and the server authenticate with X.509 certificates. For a device fleet, we recommend X.509 with a certificate chain.',
		docs: '/docs/pe/user-guide/security/overview/',
	},
	{
		title: 'Encrypted device transport',
		status: 'cfg',
		html: 'MQTT over TLS on port 8883, HTTP over TLS on 443, CoAP over DTLS on 5684, LwM2M over DTLS on 5686 and 5688, and SNMPv3 with USM authentication and encryption.',
		docs: '/docs/pe/reference/mqtt-api/getting-connected/',
	},
	{
		title: 'Custom domains with automatic SSL',
		status: 'in',
		html: 'Bind your own domain name; the platform provisions the SSL certificate automatically.',
		docs: '/docs/pe/user-guide/security/domains/',
	},
];

export const CAT_DATA: CatalogRow[] = [
	{
		title: 'Data ownership',
		status: 'in',
		html: 'Customer data belongs to the customer. We process it on your behalf under the DPA and never use it to train AI models.',
	},
	{
		title: 'Tenant isolation',
		status: 'in',
		html: '<b>ThingsBoard Cloud:</b> every request is confined to its own tenant; customers and entity groups narrow access further.<br><b>Private Cloud:</b> a dedicated single-tenant cluster.<br><b>On-premises:</b> your own installation.',
	},
	{
		title: 'Encryption in transit',
		status: 'cfg',
		html: 'Users and devices connect over TLS: HTTPS on 443, MQTTS on 8883, DTLS for CoAP and LwM2M.',
	},
	{
		title: 'Secrets and passwords',
		status: 'in',
		html: 'Stored secrets are encrypted with AES-256, and user passwords are stored as BCrypt hashes in every deployment.',
	},
	{
		title: 'Storage region',
		status: 'dep',
		html: '<b>ThingsBoard Cloud:</b> North America or EU; data never moves between regions.<br><b>Private Cloud:</b> North America, EU or APAC.<br><b>On-premises:</b> wherever you deploy.',
	},
	{
		title: 'Backups',
		status: 'dep',
		html: '<b>ThingsBoard Cloud:</b> daily, with point-in-time recovery.<br><b>Private Cloud:</b> nightly snapshots in a separate cloud region, kept 7 days by default.<br><b>On-premises:</b> you run backups.',
	},
	{
		title: 'Data retention',
		status: 'cfg',
		html: '<b>ThingsBoard Cloud:</b> 30 to 365 days, depending on plan.<br><b>Private Cloud:</b> 365 days by default; you can change it.<br><b>On-premises:</b> you set it.',
	},
	{
		title: 'Export',
		status: 'in',
		html: '<b>Every deployment:</b> telemetry, entities and dashboards are available through the REST API at any time.<br><b>Private Cloud:</b> when you leave, we prepare a full encrypted PostgreSQL/Cassandra dump of your data.',
	},
	{
		title: 'Deletion',
		status: 'dep',
		html: '<b>ThingsBoard Cloud:</b> we delete your tenant after cancellation.<br><b>Private Cloud:</b> 60 days after cancellation, we permanently delete all backups and cluster data. GDPR erasure requests are completed within 30 days.<br><b>On-premises:</b> you control deletion.',
	},
	{
		title: 'Access by ThingsBoard staff',
		status: 'dep',
		html: "<b>ThingsBoard Cloud and Private Cloud:</b> only authorized ThingsBoard engineers can access the infrastructure, with regular audits and monitoring. They work with your tenant's data only to handle a request you raised; access is role-based and logged.<br><b>On-premises:</b> we have no access to your installation.",
	},
	{
		title: 'Data center certifications',
		status: 'in',
		html: 'ThingsBoard Cloud and Private Cloud run in data centers with ISO 27001, PCI DSS and SOC 2 attestations.',
	},
];

export const CAT_ACCESS: CatalogRow[] = [
	{
		title: 'Two-factor authentication',
		status: 'in',
		html: 'TOTP authenticator apps, email, SMS and backup codes. System administrators set the platform policy, and tenant administrators can apply their own. From version 4.3, you can require 2FA for all users, for system administrators only, or for tenant administrators of selected tenants. Code lifetime, resend limits and lockout after failed attempts are configurable.',
		docs: '/docs/pe/user-guide/security/two-factor-authentication/',
	},
	{
		title: 'Single sign-on',
		status: 'in',
		html: 'OAuth 2.0 and OpenID Connect with Google, Auth0, Keycloak, Okta, Azure AD and other identity providers, so account lifecycle stays in your directory. SAML and LDAP are not supported.',
		docs: '/docs/pe/user-guide/security/oauth-2-support/',
	},
	{
		title: 'API keys',
		status: 'in',
		html: "Long-lived credentials for integrations, scripts and automation, so you don't share a user's password.",
		docs: '/docs/pe/user-guide/security/api-keys/',
	},
	{
		title: 'Role-based access control',
		status: 'in',
		html: 'Roles and entity groups scope each user to their own devices, assets and dashboards: a customer, an operator and an analyst each see only what belongs to them.',
	},
	{
		title: 'Session lifetimes',
		status: 'cfg',
		html: 'You set how long access and refresh tokens (JWT) stay valid. The defaults are 2.5 hours and 7 days; we recommend shortening both.',
		docs: '/docs/pe/user-guide/security/',
	},
	{
		title: 'Audit log',
		status: 'in',
		html: 'The platform records user actions, and you can send the log to an external system such as your SIEM.',
		docs: '/docs/pe/user-guide/security/audit-log/',
	},
	{
		title: 'Password and lockout policy',
		status: 'cfg',
		html: 'Minimum length, complexity and lockout after failed attempts, set by the administrator.',
		docs: '/docs/pe/user-guide/security/',
	},
	{
		title: 'Password expiration',
		status: 'cfg',
		html: 'You can make passwords expire after a set period if your policy requires it. NIST SP 800-63B advises against scheduled rotation, so we recommend it only where a regulator asks for it.',
		docs: '/docs/pe/user-guide/security/',
	},
];

export const CAT_APPSEC: CatalogRow[] = [
	{
		title: 'Code review and protected branches',
		status: 'in',
		html: 'Every change is reviewed before merge, and branch protection keeps unreviewed code out.',
	},
	{
		title: 'Separate environments',
		status: 'in',
		html: 'Development, test and production run separately, and production data is never used in tests.',
	},
	{ title: 'Code analysis (SAST)', status: 'in', html: 'Snyk Code scans LTS branches every week.' },
	{
		title: 'Dependency scanning',
		status: 'in',
		html: 'Snyk Open Source checks third-party dependencies every week.',
	},
	{
		title: 'Container scanning',
		status: 'in',
		html: 'Docker Scout and Snyk Container scan our container images.',
	},
	{
		title: 'Change management',
		status: 'in',
		html: 'Every change goes through a request, an impact assessment and an approval, tracked in Jira.',
	},
	{
		title: 'Independent penetration testing',
		status: 'in',
		html: 'An external tester checks the platform every year, following OWASP, OSSTMM and NIST SP 800-115. The latest test, by DataArt, ran in February 2026, with a retest in March 2026.',
	},
	{
		title: 'Security fixes and CVEs',
		status: 'in',
		html: 'Security fixes ship in patch releases that need no environment or database changes. Fixed CVE IDs are listed in the Security section of the release notes.',
		docs: '/docs/pe/releases/releases-table/',
	},
	{
		title: 'Release support',
		status: 'in',
		html: 'LTS releases are supported for 18 months, standard releases for 6 months.',
		docs: '/docs/pe/releases/release-policy/',
	},
];
