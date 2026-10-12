/**
 * The two forms' options, as the draft's `CF_*` and `VF_*` datasets have them.
 *
 * INTEGRATION NOTE: neither form is connected, as in the draft, whose thank-you states say so. The
 * site's Contact us form posts to Formspree (`@data/formspree`); wiring these the same way means an
 * endpoint per form here and the submit handlers in `TrustCenter/ContactForm.astro` and
 * `TrustCenter/VulnerabilityForm.astro` posting to it instead of showing the thank-you state.
 */

export interface ContactSubject {
	value: string;
	label: string;
	/** The message box's placeholder once this subject is picked. */
	prompt: string;
}

export const CONTACT_SUBJECTS: ContactSubject[] = [
	{
		value: 'nda',
		label: 'Request documents under NDA',
		prompt: 'Optional: the project or vendor assessment you need them for.',
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
	},
	{
		value: 'subprocessors',
		label: 'Sub-processor change notifications',
		prompt: 'Optional: anything else we should know.',
	},
	{
		value: 'cloud',
		label: 'ThingsBoard Cloud and Private Cloud security',
		prompt: 'Your question about hosting, data residency, backups, the SLA or network setup.',
	},
	{ value: 'other', label: 'Other security question', prompt: 'How can we help?' },
];

/** Subjects where the message is optional. */
export const MESSAGE_OPTIONAL_FOR = ['nda', 'subprocessors'];

export const VF_PRODUCTS = [
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

export const VF_TYPES = [
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

export const VF_SEVERITIES = ['Not sure', 'Critical', 'High', 'Medium', 'Low'];

export const VF_CREDIT = [
	{ value: 'name', label: 'Credit me by the name above' },
	{ value: 'anon', label: 'Keep me anonymous' },
];
