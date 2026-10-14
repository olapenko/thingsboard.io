import type { CompareGroup, CompareRow } from '@data/product-blocks';
import type { CatalogRow } from '@data/trust-center/catalogs';
import { SECURITY_TOPICS } from '@data/trust-center/forms';
import { DEPLOYMENT_ICON, deploymentList } from '@data/trust-center/deployment-marks';
import { docRow, type Access, type DocAction } from '@data/trust-center/documents';
import { contactHref, tc } from '@data/trust-center/nav';

/**
 * The three deployment pages, as drafted: ThingsBoard Cloud and Private Cloud (a comparison and two
 * document tables), On-premises (facts, the configuration guides, documents) and Commitment and
 * responsibility (the commitments, the responsibility matrix, what you configure).
 */

export interface DocRow {
	name: string;
	access: Access;
	/** One action, or several (the data center certifications), or none (a planned document). */
	actions: DocAction[];
}

/**
 * The comparison tables' group marks: the site's accents (`_theme.scss`), distinct within a table,
 * one colour per idea across both (operations violet; security the Security pages' cyan; product and
 * infrastructure the draft's own blue and green). As values, since a mark takes a colour, not a
 * custom property.
 */
const MARK = {
	blue: '#3d50f5',
	green: '#178649',
	violet: '#7b3fe4',
	cyan: '#0e7490',
	amber: '#b45309',
} as const;

/**
 * Rows picked by label from one of the draft's lists, into groups. Every row must land in exactly
 * one group, so a renamed, dropped or doubled row fails the build rather than vanishing.
 */
function groupRows(rows: CompareRow[], groups: (Omit<CompareGroup, 'rows'> & { labels: string[] })[]): CompareGroup[] {
	const used = groups.flatMap((g) => g.labels);
	const missing = rows.filter((r) => !used.includes(r.label)).map((r) => r.label);
	const unknown = used.filter((l) => !rows.some((r) => r.label === l));
	const doubled = used.filter((l, i) => used.indexOf(l) !== i);
	if (missing.length || unknown.length || doubled.length) {
		throw new Error(`[trust-center] comparison groups: missing ${missing}; unknown ${unknown}; doubled ${doubled}`);
	}
	return groups.map(({ labels, ...g }) => ({ ...g, rows: labels.map((l) => rows.find((r) => r.label === l)!) }));
}

// ── ThingsBoard Cloud and Private Cloud ────────────────────────────────────────

export const CLOUD_LEDE =
	'In both models, ThingsBoard runs the platform and the infrastructure under it. ThingsBoard Cloud is multi-tenant; Private Cloud is a dedicated single-tenant instance in the environment and region you choose. In both cases, you focus on your solution, and we take care of running it. Our certifications and everything under Product security apply to both.';

export const CLOUD_COLUMNS = [
	{ name: 'ThingsBoard Cloud', icon: DEPLOYMENT_ICON.cloud },
	{ name: 'Private Cloud', icon: DEPLOYMENT_ICON.private },
];

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
			'Contractual SLA: 99.9% on Launch and Growth, 99.95% on Scale and Enterprise, and a custom SLA on Enterprise on request. Monitored 24×7.',
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

/**
 * The comparison in three groups, the topic pages' own split: who runs it and how available it is,
 * what happens to the data, and how it is protected. The draft's rows, in one run there.
 */
export const CLOUD_GROUPS: CompareGroup[] = groupRows(CLOUD_COMPARE, [
	{
		title: 'Operations',
		icon: 'tabler:settings',
		color: MARK.violet,
		labels: ['Who runs it', 'Hosting', 'High availability', 'Uptime', 'Infrastructure access'],
	},
	{
		title: 'Data',
		icon: 'tabler:database',
		color: MARK.blue,
		labels: ['Data residency', 'Isolation', 'Backups', 'Data retention (TTL)', 'Leaving'],
	},
	{
		title: 'Security',
		icon: 'tabler:shield-lock',
		color: MARK.cyan,
		labels: ['Encryption in transit', 'Network protection', 'Data center certifications'],
	},
]);

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
		name: 'Data Processing Agreement (DPA)',
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
		name: 'Backup policy (frequency, retention)',
		access: 'nda',
		actions: [{ label: 'Request', href: contactHref(SECURITY_TOPICS.documents.value, 'backup-policy') }],
	},
];

/**
 * The draft's line promised "its own SBOM, privacy terms and DPA, and no tracking"; no SBOM or privacy
 * terms are listed in either column, and tracking is not a document, so it says what the list shows.
 */
export const PRIVATE_CLOUD_DOCS_INTRO = 'Same set as ThingsBoard Cloud; only the differences are listed.';

export const PRIVATE_CLOUD_DOCS: DocRow[] = [
	// The library's document (`docRow`): "Link needed" until it has an address, then View.
	docRow(
		'private-cloud-sla',
		'Private Cloud SLA and service description (uptime formula, service credits, exclusions)'
	),
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
	// The library's documents (`docRow`): "Link needed" until each has an address, then View.
	docRow('license-server-network-requirements'),
	docRow('eula'),
	docRow('support-policy'),
];

/**
 * On On-premises and Commitments alike. The draft's mailto becomes the contact form, as every other
 * way to reach the team is, on the question topic (the form preselects a topic, not a message).
 */
export const PER_PRODUCT_NOTE = `ThingsBoard Edge, IoT Gateway, TBMQ, Trendz and the mobile apps split responsibility differently. <a href="${contactHref(SECURITY_TOPICS.question.value)}">Ask our security team</a> for a breakdown by product.`;

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
		html: deploymentList([
			'<b>ThingsBoard Cloud:</b> community support on GitHub for Free and Prototype; help desk on Pilot; priority help desk on Startup and Business. Replies within 24 hours, 8:00–20:00 EET, Monday to Friday.',
			'<b>Private Cloud:</b> Support Portal on every plan; priority channel and engineering support on Scale and Enterprise; a dedicated customer success engineer on Enterprise.',
			'<b>On-premises:</b> community support on Maker and Prototype; help desk on Pilot; priority help desk on Startup (replies within 36 hours) and Business (within 12 hours). Perpetual licenses include the first year of support.',
		]),
	},
	{
		label: 'Uptime: Private Cloud',
		html: 'Contractual SLA: <b>99.9%</b> on Launch and Growth, <b>99.95%</b> on Scale and Enterprise, and a custom SLA on Enterprise on request.',
	},
	{
		label: 'Leaving Private Cloud',
		html: 'A full encrypted export of your data. You have <b>60 days</b> to download it; then we permanently delete all backups and cluster data.',
	},
];

/**
 * The commitments as the topic pages' rows (`Catalog`) rather than a fact table: Support splits by
 * deployment, as Data security's rows do, and each row gets the main measure whole instead of what a
 * label column leaves. No links beside them: the bookend under the page offers the contact form and
 * the documents.
 */
export const COMMITMENT_ROWS: CatalogRow[] = COMMITMENTS.map((c) => ({
	title: c.label,
	html: c.html,
}));

export const RESPONSIBILITY_COLUMNS = [
	{ name: 'ThingsBoard Cloud', icon: DEPLOYMENT_ICON.cloud },
	{ name: 'Private Cloud', icon: DEPLOYMENT_ICON.private },
	{ name: 'On-premises', icon: DEPLOYMENT_ICON.onprem },
];

const TB = '✓ ThingsBoard';
const YOU = 'You';

/** The draft's two groups (Product; Infrastructure and operations), the rows' source. */
const RESPONSIBILITY_DRAFT: CompareGroup[] = [
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

/**
 * What ThingsBoard handles, in four groups rather than the draft's 2 + 12 rows: each answers "who
 * looks after this?" for one area, and the "You" cells show what on-premises takes on.
 */
export const RESPONSIBILITY: CompareGroup[] = groupRows(
	RESPONSIBILITY_DRAFT.flatMap((g) => g.rows),
	[
		{
			title: 'Product',
			icon: 'tabler:app-window',
			color: MARK.blue,
			labels: [
				'Secure development, testing and product fixes',
				'Security features: 2FA, SSO, RBAC, audit log, secrets storage',
			],
		},
		{
			title: 'Hosting and infrastructure',
			icon: 'tabler:server',
			color: MARK.green,
			labels: [
				'Data center security, through our cloud providers',
				'Hosting region',
				'Network perimeter, firewall, DDoS protection',
				'Capacity, scaling and high availability',
			],
		},
		{
			title: 'Platform operations',
			icon: 'tabler:settings',
			color: MARK.violet,
			labels: [
				'OS, Kubernetes and database patching',
				'Platform upgrades and security patches',
				'TLS certificates on platform endpoints',
				'Platform sysadmin account and platform-wide security settings',
				'Hardening the deployment',
			],
		},
		{
			title: 'Continuity',
			icon: 'tabler:lifebuoy',
			color: MARK.amber,
			labels: [
				'Backups and restore',
				'Disaster recovery and business continuity',
				'Infrastructure monitoring and alerting',
			],
		},
	]
);

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
