/** The Sub-processors page's table, as drafted. */

export interface Subprocessor {
	vendor: string;
	purpose: string;
	location: string;
}

export const SUBPROCESSORS: Subprocessor[] = [
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

export const SUBPROCESSORS_NOTE =
	// The draft's "Related: DPA" link moves onto "the DPA" in the sentence it belongs to: ours, not a vendor's.
	'Location means the hosting region for infrastructure providers and the country of the contracting entity for other vendors; exact data regions are set out in each vendor\'s DPA. We notify customers of material changes to this list, as set out in <a href="/products/paas/dpa/">the DPA</a>.';
