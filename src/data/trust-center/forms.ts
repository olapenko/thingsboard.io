import { tc } from '@data/trust-center/nav';

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
 * left the form: they are a subscription, whose sign-up waits on the Sub-processors page, hidden
 * until it is connected (`NOTIFY` there).
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

// ── The report as an email (`VulnerabilityForm compose`) ─────────────────────

/** In place of the report when it is too long for a draft's address: the reader pastes it. */
export const REPORT_PASTE = '[Paste the report you copied here.]';

/**
 * How long a draft's address may get. Some email apps cut a `mailto:` past about 2,000 characters;
 * Gmail's and Outlook's compose pages take far more, but a server refuses an address past about 8,000.
 */
const DRAFT_MAX = { app: 1800, web: 6000 };

/**
 * The report as a draft three ways: the reader's email app (`mailto:`), Gmail and Outlook on the web
 * (their compose pages, for a reader with no email app set up). A body too long for one becomes
 * `REPORT_PASTE`, and `cut` says so, for the page to ask for a paste.
 *
 * CLARIFY: Outlook's link is the Microsoft 365 one (`outlook.office.com`); check it with a personal
 * Outlook.com account too, which may want `outlook.live.com/mail/0/deeplink/compose`.
 */
export function reportDrafts(to: string, subject: string, body: string) {
	const enc = encodeURIComponent;
	const fit = (make: (text: string) => string, max: number) => {
		const full = make(body);
		return full.length <= max ? { href: full, cut: false } : { href: make(REPORT_PASTE), cut: true };
	};
	const app = fit(
		(text) => `mailto:${to}?subject=${enc(subject)}&body=${enc(text.replace(/\n/g, '\r\n'))}`,
		DRAFT_MAX.app
	);
	const gmail = fit(
		(text) => `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(to)}&su=${enc(subject)}&body=${enc(text)}`,
		DRAFT_MAX.web
	);
	const outlook = fit(
		(text) =>
			`https://outlook.office.com/mail/deeplink/compose?to=${enc(to)}&subject=${enc(subject)}&body=${enc(text)}`,
		DRAFT_MAX.web
	);
	return { app: app.href, gmail: gmail.href, outlook: outlook.href, cut: app.cut };
}

/** PROTOTYPE: the report page's versions, for `ProtoSwitch` on each. */
export const REPORT_VERSIONS = [
	{ id: 'email', label: 'Email composer', href: tc('report-vulnerability') },
	{ id: 'template', label: 'Template to copy', href: tc('report-vulnerability/template') },
	{ id: 'form', label: 'Form that posts', href: tc('report-vulnerability/form') },
];

/**
 * PROTOTYPE, version A (`report-vulnerability/template`): the report as a template the reader copies
 * into their own email. What the form requires first (the product, the type, the impact, the steps),
 * then what helps if known; the summary is the subject's, the confidentiality one of the page's rules,
 * and the sender's address says who is writing, so none of them is asked again.
 */
export const REPORT_SUBJECT = 'Vulnerability report: <one sentence on the issue>';
export const REPORT_TEMPLATE = [
	'Product and version: <for example ThingsBoard Cloud, or ThingsBoard 4.2.1 self-hosted>',
	'Vulnerability type: <for example access control, injection, XSS, or other>',
	'What an attacker can do: <and what access they need first: none, a customer user, a tenant administrator or device credentials>',
	'Steps to reproduce:',
	'1.',
	'2.',
	'3.',
	'',
	'Where, if you know: <the URL, API endpoint or component>',
	'Severity, in your view: <critical, high, medium, low or not sure; a CVSS vector if you have one>',
	'Already public or seen exploited? <no, or yes and where>',
	'Planning to publish? <the date, if so>',
	'Credit: <your name or handle, or anonymous>',
].join('\n');

/**
 * The template as the page shows it: escaped, with each part to replace (`<…>`) in a span the page
 * tints, so what is the reader's to fill shows at a glance. Its text is `REPORT_TEMPLATE`'s own.
 */
export const REPORT_TEMPLATE_HTML = REPORT_TEMPLATE.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/&lt;[^&]*?&gt;/g, (part) => `<span class="tc-tpl__part">${part}</span>`);

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
