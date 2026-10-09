/**
 * The Trust Center's two forms: their options, from the draft, with the review's build changes.
 *
 * - "Sub-processor change notifications" is no longer a subject: it is a subscription on the
 *   Sub-processors page.
 * - A data subject request comes from a person, not a vendor: for it, Company is optional and the
 *   email need not be a work address.
 *
 * INTEGRATION NOTE: neither form has an endpoint yet. The draft's were not connected either, and
 * where security requests should land (security@, a ticket queue, the CRM the Contact us form feeds)
 * is a decision, not a default: the main Contact us endpoint would send NDA and vulnerability
 * reports into the sales pipeline. Until one is set here, a valid submission shows the thank-you
 * state with a line saying nothing was sent.
 */

export const TRUST_CENTER_ENDPOINT = '';
export const VULNERABILITY_ENDPOINT = '';

export interface Subject {
	value: string;
	label: string;
	/** The message box's placeholder once this subject is picked. */
	prompt: string;
	/** The message may be left empty. */
	messageOptional?: boolean;
	/** A person writing about their own data: Company is optional, any email will do. */
	personal?: boolean;
}

export const CONTACT_SUBJECTS: Subject[] = [
	{
		value: 'nda',
		label: 'Request documents under NDA',
		prompt: 'Optional: the project or vendor assessment you need them for.',
		messageOptional: true,
	},
	{
		value: 'questionnaire',
		label: 'Security questionnaire or vendor assessment',
		prompt: 'Which questionnaire or framework (for example CAIQ, SIG or your own) and your deadline.',
	},
	{
		value: 'compliance',
		label: 'Compliance and certifications',
		prompt: 'Your question about our ISO certificates, their scope or using them as supplier evidence.',
	},
	{
		value: 'privacy',
		label: 'Privacy and data protection (GDPR, CCPA, DPA)',
		prompt: 'Your question about personal data, the DPA, GDPR or CCPA.',
	},
	{
		value: 'dsr',
		label: 'Data subject request (access, correction, deletion)',
		prompt: 'Which account or data the request is about, and what you want us to do.',
		personal: true,
	},
	{
		value: 'cloud',
		label: 'ThingsBoard Cloud and Private Cloud security',
		prompt: 'Your question about hosting, data residency, backups, the SLA or network setup.',
	},
	{ value: 'other', label: 'Other security question', prompt: 'How can we help?' },
];

export const VULN_PRODUCTS = [
	'ThingsBoard (self-hosted)',
	'ThingsBoard Cloud (thingsboard.cloud, eu.thingsboard.cloud)',
	'ThingsBoard Private Cloud',
	'ThingsBoard Edge',
	'ThingsBoard IoT Gateway',
	'TBMQ',
	'Trendz Analytics',
	'ThingsBoard mobile apps',
	'Website or another ThingsBoard service (for example thingsboard.io or the license server)',
	'Not sure',
];

export const VULN_TYPES = [
	'Authentication or session management',
	'Access control or tenant isolation bypass',
	'Injection (SQL, NoSQL, command or template)',
	'Rule engine script sandbox escape (TBEL or JavaScript)',
	'Cross-site scripting (XSS)',
	'Cross-site request forgery (CSRF)',
	'Server-side request forgery (SSRF)',
	'Remote code execution',
	'Device connectivity (MQTT, CoAP, LwM2M, HTTP or SNMP)',
	'Sensitive data exposure or weak cryptography',
	'Denial of service',
	'Vulnerable third-party dependency',
	'Other',
];

export const VULN_SEVERITIES = ['Not sure', 'Critical', 'High', 'Medium', 'Low'];
