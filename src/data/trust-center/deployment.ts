import type { CompareGroup, CompareRow } from '@data/product-blocks';
import { SECURITY_TOPICS } from '@data/trust-center/forms';
import { contactHref, tc } from '@data/trust-center/nav';

/**
 * The three deployment pages, as drafted: ThingsBoard Cloud and Private Cloud (a comparison and two
 * document tables), On-premises (facts, the configuration guides, documents) and Commitment and
 * responsibility (the commitments, the responsibility matrix, what you configure).
 */

export interface DocRow {
	name: string;
	access: 'public' | 'nda';
	/** One action, or several (the data center certifications). */
	actions: DocAction[];
}

export interface DocAction {
	label: string;
	href: string;
	/** A link the draft left dead (`href="#"`): drawn, goes nowhere. */
	dead?: boolean;
}

// ── ThingsBoard Cloud and Private Cloud ────────────────────────────────────────

export const CLOUD_LEDE = `In both models, ThingsBoard runs the platform and the infrastructure under it. ThingsBoard Cloud is multi-tenant; Private Cloud is a dedicated single-tenant instance in the environment and region you choose. In both cases, you focus on your solution, and we take care of running it. Our certifications and everything under <a href="${tc('product')}">Product security</a> apply to both.`;

export const CLOUD_COLUMNS = [{ name: 'ThingsBoard Cloud' }, { name: 'Private Cloud' }];

export const CLOUD_COMPARE: CompareRow[] = [
	{
		label: 'Who runs it',
		values: [
			'ThingsBoard: infrastructure, patching, upgrades, monitoring and backups.',
			'ThingsBoard, with upgrades in a window agreed with you.',
		],
	},
	{
		label: 'Hosting',
		values: [
			'AWS (EKS) in two independent regions: North America (thingsboard.cloud) and EU (eu.thingsboard.cloud).',
			'AWS by default; Azure or GCP on request.',
		],
	},
	{
		label: 'Data residency',
		values: [
			'North America or EU; data never moves between regions.',
			'North America, EU or APAC, chosen during onboarding.',
		],
	},
	{
		label: 'Isolation',
		values: [
			'Every request is confined to its own tenant, and customers and entity groups narrow access further.',
			'A dedicated single-tenant cluster.',
		],
	},
	{
		label: 'Encryption in transit',
		values: ['TLS preconfigured: HTTPS on 443, MQTTS on 8883.', 'TLS preconfigured: HTTPS on 443, MQTTS on 8883.'],
	},
	{
		label: 'Network protection',
		values: [
			'Cloudflare DDoS protection, with rate limits set by plan.',
			'Rate limits of 50 requests per second and 500 per minute per source IP. A dedicated VPN tunnel to your systems, depending on plan.',
		],
	},
	{
		label: 'Backups',
		values: [
			'Daily, with point-in-time recovery.',
			'Nightly snapshots in a separate cloud region, kept 7 days by default (longer on Enterprise).',
		],
	},
	{
		label: 'High availability',
		values: [
			'Deployed across several availability zones: PostgreSQL in a multi-zone setup, Cassandra and Kafka with replication factor 3.',
			'On Scale and Enterprise plans. Launch and Growth run as a single-node deployment.',
		],
	},
	{
		label: 'Uptime',
		values: [
			'Live status at status.thingsboard.cloud and status.eu.thingsboard.cloud, also shown to tenant administrators in the UI.',
			'Contractual SLA: 99.9% on Launch and Growth, 99.95% on Scale, custom on Enterprise. Monitored 24×7.',
		],
	},
	{
		label: 'Data center certifications',
		values: ['AWS: ISO 27001, PCI DSS, SOC 2.', 'ISO 27001 and PCI DSS certified data centers.'],
	},
	{
		label: 'Data retention (TTL)',
		values: ['30 to 365 days, depending on plan.', '365 days by default; you can change it.'],
	},
	{
		label: 'Infrastructure access',
		values: [
			"Authorized ThingsBoard engineers only, with regular audits and monitoring. They work with your tenant's data only to handle a request you raised; access is role-based and logged.",
			"Authorized ThingsBoard engineers only, with regular audits and monitoring. They work with your tenant's data only to handle a request you raised; access is role-based and logged. You don't get a sysadmin account by default; read-only metrics and Kubernetes dashboards are available under NDA.",
		],
	},
	{
		label: 'Leaving',
		values: [
			'You export your data through the REST API; we delete your tenant after cancellation.',
			'We prepare a full encrypted PostgreSQL/Cassandra dump. You have 60 days to download it; then we permanently delete all backups and cluster data.',
		],
	},
];

export const CLOUD_DOCS: DocRow[] = [
	{
		name: 'Terms of Use (North America and EU)',
		access: 'public',
		actions: [{ label: 'View', href: '/products/paas/terms-of-use/' }],
	},
	{
		name: 'Privacy Policy (North America and EU)',
		access: 'public',
		actions: [{ label: 'View', href: '/products/paas/privacy-policy/' }],
	},
	{
		name: 'Data Processing Addendum (DPA)',
		access: 'public',
		actions: [{ label: 'View', href: '/products/paas/dpa/' }],
	},
	{ name: 'Sub-processors', access: 'public', actions: [{ label: 'View', href: tc('subprocessors') }] },
	{
		name: 'AWS attestations (SOC 2, ISO 27001)',
		access: 'public',
		actions: [{ label: 'View', href: 'https://aws.amazon.com/artifact/' }],
	},
	{
		name: 'Business Continuity Plan',
		access: 'nda',
		actions: [{ label: 'Request', href: contactHref(SECURITY_TOPICS.documents.value, 'bcp-drp') }],
	},
	{
		name: 'Backup policy (frequency, retention)',
		access: 'nda',
		actions: [{ label: 'Request', href: contactHref(SECURITY_TOPICS.documents.value, 'backup-policy') }],
	},
];

export const PRIVATE_CLOUD_DOCS_INTRO =
	'Same set as ThingsBoard Cloud, with its own SBOM, privacy terms and DPA, and no tracking. Only the differences are listed.';

export const PRIVATE_CLOUD_DOCS: DocRow[] = [
	{
		name: 'Private Cloud SLA and service description (uptime formula, service credits, exclusions)',
		access: 'public',
		actions: [{ label: 'View', href: '#', dead: true }],
	},
	{
		name: 'DPA for Private Cloud',
		access: 'nda',
		actions: [{ label: 'Request', href: contactHref(SECURITY_TOPICS.documents.value, 'dpa-private-cloud') }],
	},
	{
		name: 'Cluster architecture and read-only metrics',
		access: 'nda',
		actions: [{ label: 'Request', href: contactHref(SECURITY_TOPICS.documents.value, 'private-cloud-architecture') }],
	},
	{
		name: 'Data center certifications (ISO 27001, PCI DSS)',
		access: 'public',
		actions: [
			{ label: 'AWS', href: 'https://aws.amazon.com/compliance/programs/' },
			{ label: 'Azure', href: 'https://learn.microsoft.com/en-us/azure/compliance/' },
			{ label: 'GCP', href: 'https://cloud.google.com/security/compliance' },
		],
	},
];

// ── On-premises ───────────────────────────────────────────────────────────────

export const ONPREM_LEDE =
	'You run the platform on your own infrastructure and keep full control over it. We are responsible for the product code, security fixes and the guides below. Our certificates cover how we build and support the software; your installation is your own scope.';

export const ONPREM_FACTS = [
	{
		label: 'You run',
		html: 'Infrastructure, network perimeter, OS and database patching, platform upgrades, TLS certificates, backups, high availability and recovery.',
	},
	{
		label: 'Built into the product',
		html: '2FA, OAuth 2.0 single sign-on, role-based access control, API keys, an audit log, AES-256 secrets storage, and X.509 certificates with mutual TLS for devices.',
	},
	{
		label: 'Security fixes',
		html: 'Patch releases with no environment or database changes, so you can apply them without downtime. Fixed CVE IDs are listed in the release notes. Pin a three-part tag such as 4.2.1-latest to receive hotfixes automatically.',
	},
	{
		label: 'Release support',
		html: 'LTS releases: 18 months. Standard releases: 6 months. For production, use the latest LTS line.',
	},
	{
		label: 'Network requirements',
		html: 'An outbound connection to license.thingsboard.io for the hourly license check. Perpetual licenses can use the offline licensing add-on instead.',
	},
];

export const ONPREM_GUIDES: { label: string; href: string }[] = [
	{ label: 'Password, lockout and session settings', href: '/docs/pe/user-guide/security/' },
	{ label: 'Two-factor authentication', href: '/docs/pe/user-guide/security/two-factor-authentication/' },
	{ label: 'OAuth 2.0 single sign-on', href: '/docs/pe/user-guide/security/oauth-2-support/' },
	{ label: 'API keys', href: '/docs/pe/user-guide/security/api-keys/' },
	{ label: 'HTTPS for the web UI and REST API', href: '/docs/pe/reference/http-api/getting-connected/#https-tls' },
	{ label: 'Custom domains', href: '/docs/pe/user-guide/security/domains/' },
	{ label: 'MQTT transport security', href: '/docs/pe/reference/mqtt-api/getting-connected/' },
	{ label: 'HTTP transport security', href: '/docs/pe/reference/http-api/getting-connected/' },
	{ label: 'CoAP transport security', href: '/docs/pe/reference/coap-api/getting-connected/' },
	{ label: 'LwM2M transport security', href: '/docs/pe/reference/lwm2m-api/getting-started/' },
	{ label: 'SNMP transport security', href: '/docs/pe/reference/snmp-api/getting-connected/' },
	{ label: 'Audit log', href: '/docs/pe/user-guide/security/audit-log/' },
	{ label: 'Secrets storage', href: '/docs/pe/user-guide/security/secrets-storage/' },
	{ label: 'Security overview', href: '/docs/pe/user-guide/security/overview/' },
];

export const ONPREM_DOCS: DocRow[] = [
	{
		name: 'Installation guides (Docker, Kubernetes, Ubuntu, cloud marketplaces)',
		access: 'public',
		actions: [{ label: 'View', href: '/docs/pe/installation/' }],
	},
	{ name: 'Release policy', access: 'public', actions: [{ label: 'View', href: '/docs/pe/releases/release-policy/' }] },
	{ name: 'Release notes', access: 'public', actions: [{ label: 'View', href: '/docs/pe/releases/releases-table/' }] },
	{
		name: 'License server network requirements',
		access: 'public',
		actions: [{ label: 'View', href: '#', dead: true }],
	},
	{ name: 'EULA and license terms', access: 'public', actions: [{ label: 'View', href: '#', dead: true }] },
	{ name: 'Support policy', access: 'public', actions: [{ label: 'View', href: '#', dead: true }] },
];

/** On On-premises and Commitments alike. */
export const PER_PRODUCT_NOTE =
	'ThingsBoard Edge, IoT Gateway, TBMQ, Trendz and the mobile apps split responsibility differently. Write to <a href="mailto:security@thingsboard.io?subject=Per-product%20security%20breakdown">security@thingsboard.io</a> for a breakdown by product.';

// ── Commitment and responsibility ─────────────────────────────────────────────

export const COMMITMENTS_LEDE = 'What we commit to, and what ThingsBoard handles in each deployment model.';

export const COMMITMENTS = [
	{ label: 'Documents under NDA', html: 'Within <b>two business days</b> after we sign a mutual NDA.' },
	{
		label: 'Security questionnaires',
		html: 'We give you the information you need to complete your security questionnaire.',
	},
	{
		label: 'Support',
		html: '<ul class="tc-sublist"><li><b>ThingsBoard Cloud:</b> community support on GitHub for Free and Prototype; help desk on Pilot; priority help desk on Startup and Business. Replies within 24 hours, 8:00–20:00 EET, Monday to Friday.</li><li><b>Private Cloud:</b> Support Portal on every plan; priority channel and engineering support on Scale and Enterprise; a dedicated customer success engineer on Enterprise.</li><li><b>On-premises:</b> community support on Maker and Prototype; help desk on Pilot; priority help desk on Startup (replies within 36 hours) and Business (within 12 hours). Perpetual licenses include the first year of support.</li></ul>',
	},
	{
		label: 'Uptime: Private Cloud',
		html: 'Contractual SLA: <b>99.9%</b> on Launch and Growth, <b>99.95%</b> on Scale, custom on Enterprise.',
	},
	{
		label: 'Leaving Private Cloud',
		html: 'A full encrypted export of your data. You have <b>60 days</b> to download it; then we permanently delete all backups and cluster data.',
	},
];

export const RESPONSIBILITY_COLUMNS = [
	{ name: 'ThingsBoard Cloud' },
	{ name: 'Private Cloud' },
	{ name: 'On-premises' },
];

const TB = '✓ ThingsBoard';
const YOU = 'You';

export const RESPONSIBILITY: CompareGroup[] = [
	{
		title: 'Product',
		icon: 'tabler:app-window',
		color: '#3d50f5',
		rows: [
			{ label: 'Secure development, testing and product fixes', values: [TB, TB, TB] },
			{
				label: 'Security features: 2FA, SSO, RBAC, audit log, secrets storage',
				values: ['Built in, managed by you', 'Built in, managed by you', 'Built in, managed by you'],
			},
		],
	},
	{
		title: 'Infrastructure and operations',
		icon: 'tabler:server',
		color: '#178649',
		rows: [
			{ label: 'Data center security, through our cloud providers', values: [TB, TB, YOU] },
			{ label: 'Hosting region', values: [`${TB} — North America or EU`, `${TB} — The region you need`, YOU] },
			{ label: 'Network perimeter, firewall, DDoS protection', values: [TB, TB, YOU] },
			{ label: 'OS, Kubernetes and database patching', values: [TB, TB, YOU] },
			{ label: 'Platform upgrades and security patches', values: [TB, TB, YOU] },
			{ label: 'TLS certificates on platform endpoints', values: [TB, TB, YOU] },
			{ label: 'Capacity, scaling and high availability', values: [TB, TB, YOU] },
			{ label: 'Backups and restore', values: [TB, TB, YOU] },
			{ label: 'Disaster recovery and business continuity', values: [TB, TB, YOU] },
			{ label: 'Infrastructure monitoring and alerting', values: [TB, TB, YOU] },
			{ label: 'Platform sysadmin account and platform-wide security settings', values: [TB, TB, YOU] },
			{ label: 'Hardening the deployment', values: [TB, TB, YOU] },
		],
	},
];

export const CONFIGURE_INTRO =
	'We built these controls into the platform, so you can tune security to your own needs in every deployment instead of building it from scratch:';

export const CONFIGURE_LIST = [
	'Manage users, roles and access reviews in your tenant',
	'Turn on 2FA and single sign-on',
	'Issue API keys and integration credentials',
	'Choose device credentials, provisioning and transport security',
	'Decide what rule chains and integrations send to third parties',
	'Control which dashboards are public',
	'Choose which data you upload and how you classify it',
	'Set data retention within your plan limits',
	'Export your data at any time',
	'Follow activity in the audit log',
	"Meet your industry's requirements, such as HIPAA or 21 CFR Part 11",
];
