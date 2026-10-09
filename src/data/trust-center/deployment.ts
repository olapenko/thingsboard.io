import type { CompareColumn, CompareGroup, CompareRow } from '@data/product-blocks';
import { tc } from '@data/trust-center/nav';

/**
 * The Deployment pages' facts, from the draft, with the review's repetition edits. Each fact here is
 * its home: the overview, the FAQ and the Security pages link to it rather than restating it.
 *
 * - Cloud: the encryption row is gone (identical in both columns and not specific to either; the
 *   ports live on Product security, edit 3); staff access is written once (edit 9).
 * - On-premises: what is built in links to the Security pages (edit 4); security fixes keep the
 *   on-premises how-to and link the policy (edit 5); the per-product note moved to Commitments
 *   (edit 14).
 * - Commitments: the NDA turnaround, the uptime SLA and leaving Private Cloud are cut (edits 7, 8,
 *   10); the matrix loses the row identical in every column (edit 4) and merges Cloud and Private
 *   Cloud, which agreed in 13 of 14 rows (edit 15).
 */

export const CLOUD_COLUMNS: CompareColumn[] = [
	{ name: 'ThingsBoard Cloud', icon: 'tabler:cloud' },
	{ name: 'Private Cloud', icon: 'tabler:cloud-lock' },
];

export const CLOUD_ROWS: CompareRow[] = [
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
			"As on ThingsBoard Cloud. You don't get a sysadmin account by default; read-only metrics and Kubernetes dashboards are available under NDA.",
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

/** The status pages named in the Uptime row, as links (the draft named them without one). */
export const STATUS_PAGES = [
	{ label: 'North America', href: 'https://status.thingsboard.cloud/' },
	{ label: 'EU', href: 'https://status.eu.thingsboard.cloud/' },
];

/**
 * A document row on a deployment page. `href` null: the draft offers it but has nowhere to send the
 * reader yet, so the row asks for it through the contact form instead of linking nowhere.
 */
export interface DeploymentDoc {
	name: string;
	access: 'public' | 'nda';
	links: { label: string; href: string | null; external?: boolean }[];
	/** The NDA document's slug, for the request form. */
	nda?: string;
}

export const CLOUD_DOCS: DeploymentDoc[] = [
	{
		name: 'Terms of Use (North America and EU)',
		access: 'public',
		links: [{ label: 'Open', href: '/products/paas/terms-of-use/' }],
	},
	{
		name: 'Privacy Policy (North America and EU)',
		access: 'public',
		links: [{ label: 'Open', href: '/products/paas/privacy-policy/' }],
	},
	{ name: 'Data Processing Addendum (DPA)', access: 'public', links: [{ label: 'Open', href: '/products/paas/dpa/' }] },
	{ name: 'Sub-processors', access: 'public', links: [{ label: 'Open', href: tc('subprocessors') }] },
	{
		name: 'AWS attestations (SOC 2, ISO 27001)',
		access: 'public',
		links: [{ label: 'AWS Artifact', href: 'https://aws.amazon.com/artifact/', external: true }],
	},
	{ name: 'Business Continuity Plan', access: 'nda', links: [], nda: 'bcp-drp' },
	{ name: 'Backup policy (frequency, retention)', access: 'nda', links: [], nda: 'backup-policy' },
];

export const PRIVATE_CLOUD_DOCS: DeploymentDoc[] = [
	{
		name: 'Private Cloud SLA and service description (uptime formula, service credits, exclusions)',
		access: 'public',
		links: [{ label: 'Ask for it', href: null }],
	},
	{ name: 'DPA for Private Cloud', access: 'nda', links: [], nda: 'dpa-private-cloud' },
	{ name: 'Cluster architecture and read-only metrics', access: 'nda', links: [], nda: 'private-cloud-architecture' },
	{
		name: 'Data center certifications (ISO 27001, PCI DSS)',
		access: 'public',
		links: [
			{ label: 'AWS', href: 'https://aws.amazon.com/compliance/programs/', external: true },
			{ label: 'Azure', href: 'https://learn.microsoft.com/en-us/azure/compliance/', external: true },
			{ label: 'GCP', href: 'https://cloud.google.com/security/compliance', external: true },
		],
	},
];

export const ONPREM_GUIDES = [
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

export const ONPREM_DOCS: DeploymentDoc[] = [
	{
		name: 'Installation guides (Docker, Kubernetes, Ubuntu, cloud marketplaces)',
		access: 'public',
		links: [{ label: 'Open', href: '/docs/pe/installation/' }],
	},
	{ name: 'Release policy', access: 'public', links: [{ label: 'Open', href: '/docs/pe/releases/release-policy/' }] },
	{ name: 'Release notes', access: 'public', links: [{ label: 'Open', href: '/docs/pe/releases/releases-table/' }] },
	{ name: 'License server network requirements', access: 'public', links: [{ label: 'Ask for it', href: null }] },
	// The draft's link went nowhere; the license agreement is on the site.
	{ name: 'EULA and license terms', access: 'public', links: [{ label: 'Open', href: '/legal/license-agreement/' }] },
	{ name: 'Support policy', access: 'public', links: [{ label: 'Ask for it', href: null }] },
];

/** Who handles what: Cloud and Private Cloud in one column, since they agree everywhere but the region. */
export const RESPONSIBILITY_COLUMNS: CompareColumn[] = [
	{ name: 'Cloud and Private Cloud', icon: 'tabler:cloud' },
	{ name: 'On-premises', icon: 'tabler:server' },
];

const US = 'ThingsBoard';
const YOU = 'You';

export const RESPONSIBILITY_GROUPS: CompareGroup[] = [
	{
		title: 'Product',
		icon: 'tabler:code',
		color: '#3d50f5',
		rows: [{ label: 'Secure development, testing and product fixes', values: [US, US] }],
	},
	{
		title: 'Infrastructure and operations',
		icon: 'tabler:server-cog',
		color: '#c2410c',
		rows: [
			{ label: 'Data center security, through our cloud providers', values: [US, YOU] },
			{
				label: 'Hosting region (North America or EU on Cloud; the region you need on Private Cloud)',
				values: [US, YOU],
			},
			{ label: 'Network perimeter, firewall, DDoS protection', values: [US, YOU] },
			{ label: 'OS, Kubernetes and database patching', values: [US, YOU] },
			{ label: 'Platform upgrades and security patches', values: [US, YOU] },
			{ label: 'TLS certificates on platform endpoints', values: [US, YOU] },
			{ label: 'Capacity, scaling and high availability', values: [US, YOU] },
			{ label: 'Backups and restore', values: [US, YOU] },
			{ label: 'Disaster recovery and business continuity', values: [US, YOU] },
			{ label: 'Infrastructure monitoring and alerting', values: [US, YOU] },
			{ label: 'Platform sysadmin account and platform-wide security settings', values: [US, YOU] },
			{ label: 'Hardening the deployment', values: [US, YOU] },
		],
	},
];

export const YOU_CONFIGURE = [
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

export const SUPPORT_BY_MODEL = [
	{
		model: 'ThingsBoard Cloud',
		text: 'Community support on GitHub for Free and Prototype; help desk on Pilot; priority help desk on Startup and Business. Replies within 24 hours, 8:00–20:00 EET, Monday to Friday.',
	},
	{
		model: 'Private Cloud',
		text: 'Support Portal on every plan; priority channel and engineering support on Scale and Enterprise; a dedicated customer success engineer on Enterprise.',
	},
	{
		model: 'On-premises',
		text: 'Community support on Maker and Prototype; help desk on Pilot; priority help desk on Startup (replies within 36 hours) and Business (within 12 hours). Perpetual licenses include the first year of support.',
	},
];

export const SUBPROCESSORS: { vendor: string; purpose: string; location: string }[] = [
	{
		vendor: 'Amazon Web Services (AWS)',
		purpose: 'Hosting for ThingsBoard Cloud and Private Cloud',
		location: 'North America or EU for ThingsBoard Cloud; North America, EU or APAC for Private Cloud',
	},
	{ vendor: 'Google Cloud', purpose: 'Private Cloud hosting, on request', location: 'The region you choose' },
	{ vendor: 'Microsoft Azure', purpose: 'Private Cloud hosting, on request', location: 'The region you choose' },
	{ vendor: 'netcup', purpose: 'Development instances for Private Cloud', location: 'Germany' },
	{ vendor: 'Cloudflare', purpose: 'DNS, CDN and DDoS protection', location: 'Global network (USA)' },
	{ vendor: 'Google Workspace', purpose: 'Email, documents, identity', location: 'USA' },
	{ vendor: 'Microsoft 365', purpose: 'Email, documents, identity', location: 'USA' },
	{ vendor: 'Atlassian', purpose: 'Issue tracking', location: 'USA, Australia' },
	{ vendor: 'Slack', purpose: 'Internal communication', location: 'USA' },
	{ vendor: 'PeopleForce', purpose: 'HR management', location: 'United Kingdom' },
	{ vendor: 'Pipedrive', purpose: 'CRM', location: 'Estonia' },
	{ vendor: 'Stripe', purpose: 'Payments', location: 'USA, Ireland' },
	{ vendor: 'QuickBooks (Intuit)', purpose: 'Accounting', location: 'USA' },
	{ vendor: 'OpenAI', purpose: 'AI services under the AI Services Policy', location: 'USA' },
	{ vendor: 'Google (Gemini)', purpose: 'AI services under the AI Services Policy', location: 'USA' },
	{ vendor: 'Anthropic', purpose: 'AI services under the AI Services Policy', location: 'USA' },
];
