/**
 * The Trust Center's two forms: the contact form's security topics, and the vulnerability report's
 * options.
 *
 * The contact form is a page of its own, `/trust-center/contact/` (`TrustCenter/ContactFormProto`),
 * with only these topics: chosen over adding them to the site's Contact us as one more group, which
 * stays possible later (the merged prototype is in git up to 06af87e21).
 *
 * INTEGRATION NOTE: neither form is connected; a valid submit shows the thank-you state and says
 * nothing was sent. Before either goes live:
 * - the contact form's security topics must reach the security team, not the sales pipeline the
 *   site's Contact us form feeds (it tags every message `product`): a tag per topic that the CRM
 *   routes, or an endpoint of their own to security@;
 * - the vulnerability report needs its own endpoint to security@ (or a ticket queue), and no
 *   tracking: no UTM fields, no analytics client id, no GTM form hook.
 */

export type SecurityTopicKey = 'documents' | 'questionnaire' | 'question' | 'dsr';

export interface SecurityTopic {
	/**
	 * What the form submits and what `?subject=` matches: a readable name, as the site's Contact us
	 * topics have (`Private Cloud`, `Training`), so the team routes by it.
	 */
	value: string;
	label: string;
	/** The message box's placeholder once the topic is picked. */
	prompt: string;
	/** The message may be left empty. */
	messageOptional?: boolean;
	/** Shows the documents checklist, and asks for at least one. */
	documents?: boolean;
	/** The reader may be a private person: "Email" rather than "Work email", and Company optional. */
	personal?: boolean;
}

/**
 * Four topics where the draft had eight. Compliance, privacy, Cloud security and "Other" were one
 * kind of message, so they are one topic; "Request documents" takes every requestable document (the
 * NDA ones), so a Request link always lands on the same topic. Sub-processor change notifications
 * left the form: they are a subscription, offered on the Sub-processors page.
 */
export const SECURITY_TOPICS: Record<SecurityTopicKey, SecurityTopic> = {
	documents: {
		value: 'Security Documents',
		label: 'Request documents',
		prompt: 'Optional: the project or vendor assessment you need them for.',
		messageOptional: true,
		documents: true,
	},
	questionnaire: {
		value: 'Security Questionnaire',
		label: 'Security questionnaire or vendor assessment',
		prompt: 'Which questionnaire or framework you use, and your deadline.',
	},
	question: {
		value: 'Security Question',
		label: 'Security, compliance or privacy question',
		prompt: 'Your question: our certificates, personal data and the DPA, hosting and backups, or anything else.',
	},
	dsr: {
		value: 'Data Subject Request',
		label: 'Data subject request (access, correction, deletion)',
		prompt: 'Which account or data the request is about, and what you want us to do.',
		personal: true,
	},
};

export const SECURITY_TOPIC_LIST: SecurityTopic[] = Object.values(SECURITY_TOPICS);

/** "Documents you need"'s hint, always there: the draft's own line under the field. */
export const NDA_NOTE =
	"We send you our mutual NDA first. Once it's signed, you get the documents within two business days.";

// ── What a form hands its thank-you page ────────────────────────────────────

/**
 * A sent form keeps what was sent in this tab's sessionStorage, never in the URL, so its thank-you
 * page can greet the reader by name, say where the reply goes and what happens next, and "Edit and
 * send again" can bring it all back (`?resend`). Contact us's own hand-off (`tb-contact-sent`), with
 * a key per Trust Center form. Older than an hour, it belongs to an earlier visit: the page stays
 * generic and the form starts empty.
 */
export const CONTACT_SENT_KEY = 'tc-contact-sent';
export const REPORT_SENT_KEY = 'tc-report-sent';
export const SENT_MAX_AGE_MS = 60 * 60 * 1000;

/**
 * The "What happens next" of a document request with an NDA document in it: the draft's line ("We
 * send you our mutual NDA first. Once it's signed, you get the documents within two business days"),
 * as steps.
 *
 * CLARIFY: how the NDA is signed and how the documents arrive (a signed PDF by reply or an
 * e-signature; attachments or an expiring link) is the team's process. The steps say no more than
 * the draft does until it is confirmed.
 */
export const NDA_STEPS: { title: string; line?: string }[] = [
	{ title: 'We email you our mutual NDA' },
	{ title: 'You sign it' },
	{ title: 'You get the documents', line: 'Within two business days of signing.' },
];

// ── The vulnerability report ────────────────────────────────────────────────

export const VF_PRODUCTS = [
	'ThingsBoard (self-hosted)',
	'ThingsBoard Cloud (thingsboard.cloud, eu.thingsboard.cloud)',
	'ThingsBoard Private Cloud',
	'ThingsBoard Edge',
	'ThingsBoard IoT Gateway',
	'TBMQ',
	'Trendz Analytics',
	'ThingsBoard mobile apps',
	'A website or another service (thingsboard.io, the license server)',
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

/** Two choices, so radios; the report picks "by name" once a name is typed, unless the reader chose. */
export const VF_CREDIT = [
	{ value: 'anon', label: 'Keep me anonymous' },
	{ value: 'name', label: 'Credit me by my name or handle' },
];

/** The draft's two cards, as one short guide beside the form. */
export const VF_NEXT = [
	'We reply within three business days with a plan to investigate.',
	'We keep you updated until the fix is released.',
	'Fixed CVE IDs are listed in the release notes.',
];

export const VF_RULES = [
	'Use your own installation or your own Cloud account.',
	"Don't access, change or delete other people's data.",
	"Don't run denial-of-service or load tests against ThingsBoard Cloud.",
	'Keep the details private until the fix is out.',
];
