/**
 * ThingsBoard On-premises page content.
 *
 * Lifted from `develop.tbqa.cloud/products/thingsboard-pe/`, the same way `paasPage.ts` was lifted
 * from the Cloud page there — that copy was never merged into this fork, so it could not be taken
 * from a branch. Wording, prices, plan limits and link targets are develop's.
 *
 * WHAT IS NOT HERE. Develop's page carries the full shared-capability list — the one the Cloud page
 * renders as "Platform features" — and this page deliberately omits it. Those capabilities are
 * identical across Cloud and On-premises, so stating them on both pages twice says nothing about
 * the choice a reader is on this page to make. What survives is the half that IS about self-hosting:
 * the comparison against assembling your own stack, and the licensing.
 */

/** Link targets used from more than one place below. Declared up here because `onPremChoice` reads
 *  one of them and a `const` cannot be referenced before its own line has run. */
const CONTACT = '/contact-us/';
const CONTACT_SALES = '/contact-us/?subject=ThingsBoard%20Products&message=I%20have%20a%20question%20about%20ThingsBoard%20On-premises';
const LICENSE_SERVER = 'https://license.thingsboard.io/';
const PRICING_SUBSCRIPTION = '/pricing/?section=thingsboard-pe-options&product=thingsboard-pe';
const PRICING_PERPETUAL = '/pricing/?section=thingsboard-pe-options&product=thingsboard-pe&solution=pe-perpetual';

export interface OnPremBenefit {
	/** Tabler name, rendered as a bare coloured glyph — `FeatureTile`'s treatment. */
	icon: string;
	/** The glyph's hue. Every value is one already used on the Cloud page. */
	color: string;
	title: string;
	description: string;
}

export interface CompareRow {
	label: string;
	/** ThingsBoard, then a custom-assembled stack. */
	values: [string, string];
}

export interface CompareGroup {
	title: string;
	/** Tabler name for the group's mark. */
	icon: string;
	/** The mark's hue — one rotation through the table. */
	color: string;
	rows: CompareRow[];
}

/**
 * "ThingsBoard vs Custom IoT stack", all 39 rows.
 *
 * Note this is a DIFFERENT comparison from the Cloud page's. There the two columns are two ways to
 * buy the same product; here they are "use this platform" against "assemble one yourself", so the
 * right-hand column is not a product at all. The column headings say so.
 */
export const onPremCompare: CompareGroup[] = [
	{
		title: 'Device layer',
		icon: 'tabler:plug-connected',
		color: '#007c7b',
		rows: [
			{
				label: 'Device connectivity',
				values: [
					'Built-in: connect any device or asset without technical barriers — MQTT, HTTP, CoAP, LwM2M and SNMP directly; Modbus, OPC UA, BACnet, CAN and others through the IoT Gateway; LoRaWAN, Sigfox and others through network server integrations',
					'Cloud provider IoT service + industrial protocol bridge + LPWAN integration + custom code for each path',
				],
			},
			{
				label: 'Device management & provisioning',
				values: [
					'Built-in: lifecycle, provisioning, claiming, bulk import, and device profiles inherited by every device of a type',
					'Your own registry, provisioning flow, and profile model',
				],
			},
			{
				label: 'Remote control',
				values: [
					'Built-in: persistent RPC from dashboards, rules, or API: commands are stored and delivered when the device reconnects, with retries, expiry, and a full delivery state machine',
					'A command channel you build per protocol — no persistence, no delivery guarantees, no state to query once the command leaves your system',
				],
			},
			{
				label: 'Firmware & config updates (OTA)',
				values: [
					'Built-in: firmware repository, staged rollouts, chunked delivery, checksum validation, per-device status',
					'Distribution, resume and rollback logic you build, plus a device-side agent per protocol',
				],
			},
			{
				label: 'Device security & identity',
				values: [
					'Built-in: X.509, tokens, per-device credentials, device claiming, audit log',
					'Device identity, credential rotation, and certificate lifecycle you design and operate',
				],
			},
		],
	},
	{
		title: 'Data layer',
		icon: 'tabler:sitemap',
		color: '#047857',
		rows: [
			{
				label: 'Asset modeling & digital twin',
				values: [
					'Built-in: assets, customers, hierarchies, relations, attributes and metrics that resolve across the hierarchy. KPIs roll up the tree',
					'Your own domain model and relation layer, maintained across services',
				],
			},
			{
				label: 'Data processing',
				values: [
					'Built-in: calculated fields and formulas, visual rule chains, a library of ready-made processing nodes, JavaScript or TBEL',
					'Separate flow-processing tool + custom code + integrations',
				],
			},
			{
				label: 'Alarms & alarm lifecycle',
				values: [
					'Built-in: conditions, severity, assignment, full lifecycle and history',
					'Separate incident management tool + custom integration',
				],
			},
			{
				label: 'Time-series storage',
				values: [
					'Built-in: runs on PostgreSQL (with TimescaleDB or Citus) or Cassandra; partitioning, retention, downsampling and aggregation handled for you',
					'Separate time-series database — operate and tune it yourself',
				],
			},
			{
				label: 'External systems integrations',
				values: [
					'Built-in: REST, Kafka, RabbitMQ, AWS, Azure and GCP nodes to push data into ERP, CRM or billing systems',
					'Point-to-point integrations you write and maintain per system',
				],
			},
			{
				label: 'APIs & version control',
				values: [
					'Built-in: REST and WebSocket APIs, entity import and export, version control, CLI',
					'Separate API per service, and no shared way to version a solution',
				],
			},
		],
	},
	{
		title: 'Application layer',
		icon: 'tabler:chart-dots',
		color: '#006bc7',
		rows: [
			{
				label: 'Dashboards & visualization',
				values: [
					'Built-in: real-time updates, drill-down navigation, maps, charts, SCADA; 600+ widgets plus custom widgets in JavaScript',
					'Separate dashboard tool + custom plugins + separate SCADA tool',
				],
			},
			{
				label: 'Multi-tenant isolation',
				values: ['Built-in: nested customers with data isolation, no custom code', 'Custom implementation — months of engineering'],
			},
			{
				label: 'White-label & custom branding',
				values: [
					'Built-in: logo, colors, domain, menu, login page, emails — set per tenant and inherited by every customer below',
					'Custom UI development from scratch',
				],
			},
			{
				label: 'Fine-grained RBAC & SSO',
				values: [
					'Built-in: OAuth2 SSO (Google, Azure AD, Okta, Keycloak, any OIDC provider), 2FA, user groups, default dashboard per role',
					'Separate identity provider + custom permission model',
				],
			},
			{
				label: 'Notifications',
				values: [
					'Built-in: in-app, email, SMS, push, Slack and Teams, with per-user preferences',
					'A separate integration to build and maintain per channel',
				],
			},
			{
				label: 'Reporting & scheduling',
				values: [
					'Built-in: scheduled PDF, CSV and XLSX by email or to external systems, plus scheduled commands and events',
					'Separate BI tool + scheduler + integration',
				],
			},
			{
				label: 'Self-service forms',
				values: [
					'Built-in: end users register, onboard their own devices and manage their data; every action audited',
					'A custom end-user application on top of your stack',
				],
			},
		],
	},
	{
		title: 'Foundation',
		icon: 'tabler:stack-2',
		color: '#3d50f5',
		rows: [
			{
				label: 'Scale & high availability',
				values: [
					'Built-in: horizontal scaling on microservices and Kafka, fault tolerance across the stack',
					'Each service scales, fails, and recovers on its own terms',
				],
			},
			{
				label: 'Monitoring',
				values: [
					'Built-in: Prometheus and Grafana monitoring stack ships with the platform',
					'Observability you assemble and wire across every service',
				],
			},
			{
				label: 'Proven at scale',
				values: [
					'Open benchmarks: 8+ years of performance optimization in production with 500K–1M device environments',
					'Your ceiling surfaces in production, after go-live',
				],
			},
		],
	},
	{
		title: 'Operations & commercials',
		icon: 'tabler:headset',
		color: '#c2410c',
		rows: [
			{ label: 'Number of vendors to manage', values: ['1', '5–10 different services to license and integrate'] },
			{
				label: 'Deployment',
				values: ['Monolith for pilots, microservices for scale, same platform', 'Multiple services — ops overhead scales with each'],
			},
			{
				label: 'Upgrades & security',
				values: [
					'LTS releases with an 18-month support window — one upgrade path; vulnerabilities typically patched within 2 weeks',
					'Each service on its own release cycle — you track advisories per project and re-validate every integration',
				],
			},
			{
				label: 'Support & accountability',
				values: [
					'One vendor, one support portal — direct access to the engineers who build the platform',
					'Tickets across multiple vendors — each points at the others while the issue stays open',
				],
			},
			{
				label: 'Total cost of ownership',
				values: [
					'One license priced on device count, plus reference architectures for the infrastructure',
					'Multiple licenses, plus integration engineering and infrastructure costs that surface after go-live',
				],
			},
			{
				label: 'Time to first production deployment',
				values: [
					'Days to weeks — configure the platform to your use case, not build it',
					'Months to a year — assembly and integration before the first use case ships',
				],
			},
			{
				label: 'Delivery risk',
				values: [
					'Proven in thousands of production deployments — the architecture is validated before you start',
					'The integration layer is yours to design, test and prove in production',
				],
			},
		],
	},
	{
		title: 'Ecosystem features',
		icon: 'tabler:puzzle',
		color: '#7c3aed',
		rows: [
			{
				label: 'AI Tools',
				values: ['Built-in: AI Solution Creator, IoT AI assistants and the ThingsBoard CLI', 'Build integrations to AI services yourself'],
			},
			{
				label: 'IoT Hub',
				values: [
					'Ready-made components — solution templates, device integrations, widgets, rule chains and dashboards, installed in one click',
					'Every dashboard, integration and rule chain built from scratch',
				],
			},
			{
				label: 'Edge computing',
				values: [
					'ThingsBoard Edge runs rules on site, buffers offline, syncs automatically, managed centrally',
					'Separate edge runtime plus your own sync and conflict resolution',
				],
			},
			{
				label: 'Analytics & forecasting',
				values: [
					'Trendz Analytics adds prediction, anomaly detection and BI views',
					'Separate analytics stack plus a data export pipeline to feed it',
				],
			},
			{
				label: 'Mobile application',
				values: [
					'One vendor: white-label iOS and Android app builder based on Flutter, same dashboards, push, QR onboarding',
					'Two native apps to build, maintain and ship through both stores',
				],
			},
			{
				label: 'MQTT broker',
				values: [
					'TBMQ — MQTT broker built for high-load messaging: 4M+ concurrent connections per node, 100M+ in cluster mode',
					'A broker to license, cluster and operate — capacity you benchmark and tune yourself',
				],
			},
			{
				label: 'IoT Gateway',
				values: [
					'ThingsBoard IoT Gateway — Modbus, OPC UA, BACnet, CAN, BLE and proprietary PLCs, deployed on site and configured remotely from the platform',
					'A protocol bridge per fieldbus, each with its own deployment, configuration and remote management to build',
				],
			},
		],
	},
];

export interface FaqItem {
	q: string;
	/** Answer markup — ours, from this file, rendered with `set:html`. */
	a: string;
}

export interface FaqCategory {
	title: string;
	items: FaqItem[];
}

/**
 * Develop's FAQ, all six categories and all 57 answers.
 *
 * `target="_blank"` is dropped from links that stay on the site, as it was on the Cloud page.
 */
export const onPremFaq: FaqCategory[] = [
	{
		title: 'General',
		items: [
			{
				q: 'What is an on-premises subscription?',
				a: '<p>An on-premises subscription allows you to host and manage ThingsBoard on infrastructure you control — your own data centre or your own cloud account. You are responsible for the installation, configuration, and ongoing management of the system, while ThingsBoard provides the software and necessary documentation to support the process.</p>',
			},
			{
				q: 'How can I buy an on-premises subscription?',
				a: `<p>To purchase an on-premises subscription, you can acquire a license through your <a href="${LICENSE_SERVER}" target="_blank" rel="noopener noreferrer">License Server</a> account. Each license comes with a unique activation key, which allows you to deploy and run the system by following our detailed installation guides.</p>`,
			},
			{
				q: 'How to purchase a Perpetual license?',
				a: `<p>If you would like to explore the Perpetual option, please <a href="${CONTACT}">contact our sales team</a></p>`,
			},
			{
				q: 'What does it mean to get the license?',
				a: `<p>Licensing is applicable to self-hosted platform versions only. Each license comes with a unique license key (activation code) that is automatically generated in your <a href="${LICENSE_SERVER}" target="_blank" rel="noopener noreferrer">License Server</a> account. Using this license key, you can deploy and run the system by following our detailed installation guides.</p>`,
			},
			{
				q: 'What on-premises subscription plans does ThingsBoard offer?',
				a: `<p>ThingsBoard offers flexible monthly subscription plans, with tiers based on the number of devices and assets. We support 4 predefined plans to cater to different needs. The Free plan includes support for up to 100 devices. For more details, visit the ThingsBoard <a href="/pricing/?product=thingsboard-pe">pricing page</a>.</p>`,
			},
			{
				q: 'How do the on-premises subscription plans differ?',
				a: '<p>Plans differ based on the number of devices, support level, and white-labeling availability.</p>',
			},
			{
				q: 'Is there a contract or commitment for the subscription?',
				a: '<p>No, all subscriptions are month-to-month, and you can cancel anytime.</p>',
			},
			{
				q: 'Do I need to host ThingsBoard myself with a subscription license?',
				a: '<p>Yes, you are responsible for deploying and managing ThingsBoard on your own infrastructure.</p>',
			},
			{
				q: 'Can I upgrade or downgrade my subscription at any time?',
				a: '<p>Yes, you can change plans anytime, and billing will be prorated accordingly.</p>',
			},
			{
				q: "What happens if I exceed the device or asset limits in my plan?",
				a: "<p>If you exceed your plan's limits, you will need to upgrade to a higher-tier plan. With the Business plan, you can also purchase additional devices on a monthly basis at a rate of $0.10 per extra device.</p>",
			},
			{
				q: 'Can I migrate from a ThingsBoard Cloud subscription to an on-premises license?',
				a: `<p>Please, <a href="${CONTACT}">contact us</a> in case migration assistance is needed.</p>`,
			},
			{
				q: 'Are all ThingsBoard features included in every plan?',
				a: '<p>White labeling is offered starting from the Pilot plan and above.</p>',
			},
			{
				q: 'Can I use my license across multiple locations or instances?',
				a: '<p>A platform instance can be installed on a single server, which may be a virtual machine, a running Docker container, or a single OS process. If you need to run the platform across multiple locations or as part of a clustered deployment, you can purchase additional instances for any plan as required.</p><p>By default, each license includes a predefined number of platform instances. The Free and Pilot plans include one instance, the Startup plan includes two instances, and the Business plan includes three instances.</p>',
			},
			{
				q: 'Is it possible to jump from subscription to perpetual?',
				a: '<p>Customer may cancel the subscription and purchase a perpetual license. The remaining costs from the terminated subscription plan (if any) will be deducted from the total cost for the perpetual license. The perpetual license is non-refundable. Once purchased, it cannot be canceled.</p>',
			},
			{
				q: 'Can I migrate from one server or Virtual machine to another using the same license?',
				a: '<p>Yes! You can migrate your license by activating or deactivating it on the License Server. To move to a new server, deactivate the current instance, install the software on the new server, and reuse your existing license key. Be sure to back up your data if you want to maintain the same environment. Note: The license system prevents running ThingsBoard on multiple servers at the same time unless you purchase additional instances.</p>',
			},
			{
				q: 'What is included in the White-Labeled Mobile App add-on?',
				a: "<p>The White-Labeled Mobile App add-on provides you with a branded version of the ThingsBoard Mobile application. This includes your company's name, logo, colors, and other branding elements. The cost is $99 per month, plus a one-time setup fee of $1,000 to cover branding and configuration.</p>",
			},
		],
	},
	{
		title: 'Billing & Payments',
		items: [
			{
				q: 'How does billing work for on-premises subscriptions?',
				a: `<p>Billing is handled via Stripe and is charged monthly based on your selected plan. You can also pay annually with card or wire transfer. Please <a href="${CONTACT}">contact us</a> to receive a custom invoice.</p>`,
			},
			{
				q: 'What payment methods do you accept?',
				a: `<p>We accept credit and debit cards through Stripe. You can also pay annually with card or wire transfer. Please <a href="${CONTACT}">contact us</a> to receive a custom invoice.</p>`,
			},
			{
				q: 'I cannot pay by card, may we use wire instead?',
				a: `<p>Sure. In this case, you must reach out to our sales team via <a href="${CONTACT}">contact us</a>. If you have ongoing communication with the account manager or success manager on our end, please refer your request to that person.</p>`,
			},
			{
				q: 'Do you offer an annual payment option?',
				a: `<p>We currently offer only a monthly subscription with automatic payments via Stripe. For annual payments, please <a href="${CONTACT}">contact</a> our team to arrange a wire transfer invoice.</p>`,
			},
			{
				q: 'What happens if my payment fails?',
				a: '<p>If a payment fails, Stripe will retry the charge several times. If unsuccessful, your license will be suspended.</p>',
			},
			{ q: 'Can I cancel my subscription anytime?', a: '<p>Yes, you can cancel your subscription anytime.</p>' },
			{
				q: 'Are refunds available if I cancel my subscription?',
				a: '<p>No, we do not offer refunds for unused time. However, the funds for the remaining period will be saved on your account balance for future use.</p>',
			},
			{
				q: 'Is there proration when upgrading or downgrading my plan?',
				a: '<p>Yes, Stripe automatically prorates the charges when you change plans.</p>',
			},
			{
				q: 'Do you offer discounts for multiple licenses?',
				a: `<p>Contact our <a href="${CONTACT}">sales team</a> for bulk pricing options.</p>`,
			},
			{
				q: "What happens if I don't renew my subscription?",
				a: '<p>Your license will become inactive, and your ThingsBoard instance will be suspended.</p>',
			},
			{
				q: 'Can I transfer my subscription to another entity?',
				a: '<p>No, subscriptions are non-transferable. However, you can add users to your License Server account, allowing others to help manage the license subscription.</p>',
			},
			{
				q: 'Is there an additional payment for the software use besides the license fee?',
				a: '<p>No, we do not charge extra unless you want an additional service that we offer: professional support, Custom development and consulting, Training, or Managed service.</p>',
			},
		],
	},
	{
		title: 'Usage, Deployments & Limits',
		items: [
			{
				q: 'What are the device and asset limits for each plan?',
				a: '<p>Free: up to 100 devices<br>Pilot: 100 devices<br>Startup: 500 devices<br>Business: 1000 devices, with the option to purchase additional devices at $0.10 per device per month<br>Non-commercial: up to 1000 devices for non-commercial usage</p>',
			},
			{
				q: 'What does the number of production instances mean?',
				a: '<p>A <b>Production Instance</b> refers to a single node of the ThingsBoard platform within your deployment. While one instance is enough to run your solution, multiple instances allow you to operate in <b>Cluster Mode</b>.</p><p>By running multiple instances, you achieve:</p><ul><li><b>High Availability (HA):</b> Your system remains operational even if a node goes down.</li><li><b>Horizontal Scalability:</b> Distribute the processing load across multiple servers to handle more devices and data.</li><li><b>Reliability:</b> Built-in redundancy for mission-critical IoT applications.</li></ul>',
			},
			{
				q: "What happens if I exceed my plan's device or asset limit?",
				a: '<p>You will need to upgrade to a higher-tier plan. With the Business plan, you also have the option to purchase additional devices at $0.10 per device per month.</p>',
			},
			{
				q: 'Can I use my license on multiple servers?',
				a: '<p>A platform instance can be installed on a single server, which may be a virtual machine, a running Docker container, or a single OS process. If you need to run the platform across multiple locations or as part of a clustered deployment, you can purchase additional instances for any plan as required.</p><p>By default, each license includes a predefined number of platform instances. The Free and Pilot plans include one instance, the Startup plan includes two instances, and the Business plan includes three instances.</p>',
			},
			{
				q: 'Does ThingsBoard charge for API calls or storage?',
				a: '<p>No, but you may be charged by your cloud provider for resource usage.</p>',
			},
			{
				q: 'Do I need an internet connection to use the on-premises license?',
				a: `<p>Yes, an internet connection is required for periodic license verification. The system checks the license once per hour, and if the connection is not restored within 24 hours, the platform may shut down. This process ensures proper license management while allowing temporary connectivity issues. For more details, please refer to the license check <a href="/docs/license-server/what-is-license-server/">description</a>. Offline mode is also possible as an add-on to the Perpetual license. <a href="${CONTACT}">Contact our sales team</a> to know more.</p>`,
			},
			{
				q: 'Can I run offline?',
				a: `<p>By default, the platform requires active Internet access or at least access to license portal from your host machine. If Offline access is a must, please <a href="${CONTACT}">contact us</a> to discuss options.</p>`,
			},
			{
				q: 'Can I move my deployment between cloud providers?',
				a: '<p>Yes, on-premises ThingsBoard is cloud-agnostic and can be migrated as needed.</p>',
			},
			{
				q: 'Does ThingsBoard support high-availability (HA) setups?',
				a: '<p>Yes, High Availability (HA) is supported and can be achieved through ThingsBoard services and database replication. Please note that each ThingsBoard replica will require a separate license.</p>',
			},
			{ q: 'Can I back up my ThingsBoard instance?', a: '<p>Yes, backups depend on your database and storage setup.</p>' },
			{
				q: 'How is telemetry data stored in on-premises ThingsBoard?',
				a: '<p>ThingsBoard supports PostgreSQL or PostgreSQL + Cassandra (Hybrid mode) for telemetry storage. For more details on database options, you can check the <a href="/docs/pe/reference/architecture/database/">database approach reference</a>.</p>',
			},
			{ q: 'Does ThingsBoard support multi-tenancy?', a: '<p>Yes, multi-tenancy is supported out of the box.</p>' },
			{
				q: 'How to charge my customers?',
				a: '<p>So far, the ThingsBoard platform does not provide a billing module to charge end customers. At the same time, the platform exposes the <a href="https://thingsboard.cloud/swagger-ui/#/usage-info-controller" target="_blank" rel="noopener noreferrer">Usage API</a> that can be used by the external payment software to generate invoices.</p>',
			},
		],
	},
	{
		title: 'Security & Compliance',
		items: [
			{
				q: 'Is my ThingsBoard instance secure?',
				a: '<p>ThingsBoard has ISO 27001 and ISO 9001 certifications. Also, security depends on your infrastructure setup, but ThingsBoard provides built-in authentication, role-based access control, and encryption.</p>',
			},
			{
				q: 'Where is my ThingsBoard data stored?',
				a: '<p>Your data is stored on your own infrastructure, whether on-premise or in the cloud.</p>',
			},
			{ q: 'Can I store ThingsBoard data in my preferred region?', a: '<p>Yes, you have full control over data storage location.</p>' },
			{
				q: 'Can I export my data at any time?',
				a: '<p>Yes, you can export your data using the ThingsBoard dashboard, APIs, or by creating a full database backup.</p>',
			},
			{
				q: 'Do you provide pentest results?',
				a: "<p>No, we do not do it for many reasons. Firstly, as a platform vendor, we cannot disclose detected vulnerabilities of certain versions of the platform as the disclosure affects the safety of our existing customers who use that particular version. Secondly, the self-declared pentest is less trustworthy as it is in the vendor's interest to come up with clean results and you never know whether to believe them or not. Lastly, the penetration test makes more sense to be conducted over a ready-to-use end client software/application to define weak spots (if any). It is the Licensee's responsibility to order independent testing. Having said that, the ThingsBoard platform gives one a tool to develop solutions. You may consider the platform a building that a banker rents to establish an office, vault, etc. Now you can see that testing a building itself does not make much sense. But things change when it hosts a bank (or whatever tenant).</p>",
			},
			{
				q: 'Where can I find the logged vulnerability fixes matrix: version + list of fixes?',
				a: '<p>Please stay tuned with our <a href="/docs/pe/releases/releases-table/">Release notes</a>. Critical vulnerabilities or security issues are mentioned in separate line items. Less threatful vulnerabilities appear as a single record ("Vulnerability fixes") stating that, at the release date, the version is free of known HIGH and some MEDIUM CVEs.</p>',
			},
		],
	},
	{
		title: 'Trials, Cancellations & Refunds',
		items: [
			{
				q: 'Can I try an on-premises license before subscribing?',
				a: '<p>Yes, the Free plan is the best way to explore the platform. It also includes trial license for Edge and Trendz products, so you can fully test the ThingsBoard ecosystem.</p>',
			},
			{
				q: 'What happens if I cancel my subscription?',
				a: '<p>Your license will become inactive, and your ThingsBoard instance will be stopped.</p>',
			},
			{
				q: 'Can I switch from a subscription license to a perpetual license?',
				a: '<p>Customer may cancel the subscription and purchase a perpetual license. The remain costs from terminated subscription plan (if remain) will be deducted from Total cost for the perpetual license. The perpetual license is non-refundable. Once purchased, it cannot be canceled.</p>',
			},
			{ q: 'Are refunds available for on-premises subscriptions?', a: '<p>No, all sales are final.</p>' },
		],
	},
	{
		title: 'Support & Assistance',
		items: [
			{
				q: 'What support is included in my subscription?',
				a: '<ul><li><b>Free:</b> Community support.</li><li><b>Pilot:</b> Help desk via Support Portal.</li><li><b>Startup:</b> Priority help desk with 36-hour response time during regular working shifts via Support Portal. <em>Please note: support on the Startup plan becomes available from the second month of usage.</em></li><li><b>Business:</b> Priority help desk with a 12-hour response time during regular working shifts via Support Portal.</li></ul>',
			},
			{
				q: 'Do you offer 24/7 support?',
				a: `<p>Yes, we can provide 24/7 support as part of our managed services with an additional signed SLA. Please <a href="${CONTACT}">contact us</a> for more details.</p>`,
			},
			{
				q: 'How can I get help with installation and setup?',
				a: `<p>If your subscription plan includes response time support and you have access to the Support Portal, the ThingsBoard support team can assist with system deployment as part of the subscription. However, this applies only if you follow recommended installation methods and architecture. Custom installation scripts or non-recommended deployment scenarios are not covered under included support. If your subscription plan does not include support, then we recommend using our documentation, tutorials, and optional professional services. To discuss options, please <a href="${CONTACT}">contact us</a>.</p>`,
			},
			{
				q: 'How do I contact support?',
				a: '<p>Users of Startup and higher subscriptions, as well as perpetual license holders, are automatically added to the ThingsBoard <a href="https://thingsboard-portal.atlassian.net/servicedesk/customer/portal/1" target="_blank" rel="noopener noreferrer">Support Portal</a> after purchasing a license.</p>',
			},
			{
				q: 'What issues are included in subscription support?',
				a: '<p>Access to the ThingsBoard Support Portal is available for users with Startup and higher subscriptions, as well as perpetual license holders. Without the need for a separate support agreement, all support inquiries are seamlessly managed through a unified queue, ensuring efficient handling of your requests. Our support team is dedicated to providing an initial response within 24 hours to address your needs promptly.</p><p>The support service includes assistance with installation and migration for default deployments, as well as resolving any questions related to the platform&apos;s out-of-the-box functionalities, as detailed in our documentation. For specialized services such as consulting, code reviews, health assessments, or development projects, we offer tailored solutions to meet your specific requirements. Should your request involve additional expertise, our support engineers will guide you to the best resources to ensure your success.</p>',
			},
			{
				q: 'Can you provide an IoT development service tailored to my specific needs?',
				a: '<p>Yes, we offer custom <a href="/services/development-services/">IoT development services</a> designed to match your exact requirements. Whether you need a full-featured IoT platform, scalable architecture, or specific integrations, our IoT development team can help you accelerate time-to-market and reduce internal workload while ensuring long-term maintainability.</p>',
			},
		],
	},
];

/** The page's calls to action. `primary` is the pricing page, as develop's "Get it now" is. */
export const onPremCtas = {
	primary: { text: 'See plans and pricing', href: PRICING_SUBSCRIPTION },
	secondary: { text: 'Talk to an expert', href: CONTACT_SALES },
	/** The exit to the managed alternative, as the Cloud page has one to On-premises. */
	cloud: {
		lead: 'Would rather we ran it?',
		text: 'ThingsBoard Cloud',
		href: '/products/paas/',
		icon: 'tabler:cloud',
	},
	/**
	 * The Cloud page closes on its privacy policy. There is no site-wide one to point at — the only
	 * `privacy-policy` routes in this repo are per-product, and On-premises has none — so this closes
	 * on the licence instead, which is the document that actually governs a self-hosted deployment.
	 */
	legal: { text: 'ThingsBoard licence agreement', href: '/products/thingsboard-pe/eula/' },
};

export { CONTACT, CONTACT_SALES, PRICING_SUBSCRIPTION, PRICING_PERPETUAL };
