import { TBMQ_PE_DOCS_URL, TBMQ_SITE_URL } from '@models/tbmq';
import { CAREERS_URL } from '@models/careers';

export interface NavItem {
	label: string;
	href?: string;
	submenuId?: string;
	/** DOM id on the rendered link, for analytics hooks (`Menu_Pricing`). */
	id?: string;
	/** Extra class on the rendered link, e.g. `gtm_button` for GTM tracking. */
	linkClass?: string;
	items?: SubMenuItem[];
}

export interface SubMenuItem {
	href: string;
	icon?: string;
	heading: string;
	description?: string;
	linkClass?: string;
}

export interface SubMenuGroup {
	/** Column heading, shown above the first column only. Omit for an unlabelled group. */
	name?: string;
	/**
	 * Items per column. The renderer caps the result at three columns and folds any
	 * overflow into the last one. Omit to put every item in a single column.
	 */
	perColumn?: number;
	items: SubMenuItem[];
	/**
	 * The group's last word, under its list in the accent: its index ("All use cases") or its next
	 * step ("Talk to an expert"). A section's bar of promotions (`data/menu-featured`) is for several
	 * ways on that are not its lists; a single one belongs here, at the end of the list it follows.
	 */
	more?: { label: string; href: string };
}

export interface SubMenu {
	id: string;
	className: string;
	groups: SubMenuGroup[];
	/**
	 * Paths the section owns besides its links' own pages, for its item's underline in the row: a
	 * reader on any of them is in the section. Solutions owns the use cases' and case studies' indexes,
	 * which it reaches through its promotions rather than a link of its own.
	 */
	owns?: string[];
}

// Main navigation items. Seven since 2026-10-05: Use Cases and Customers are Solutions (the use
// cases, then their case studies), and Partners is a group in Company, beside Clients feedback.
export const mainNavItems: NavItem[] = [
	{ label: 'Products', submenuId: 'nav-products' },
	{ label: 'Services', submenuId: 'nav-services' },
	{ label: 'Solutions', submenuId: 'nav-solutions' },
	{ label: 'Company', submenuId: 'nav-company' },
	{ label: 'Docs', submenuId: 'nav-docs' },
	{ label: 'IoT Hub', href: '/iot-hub/' },
	{ label: 'Pricing', href: '/pricing/', id: 'Menu_Pricing', linkClass: 'gtm_button' },
];

// Products submenu
export const productsSubmenu: SubMenu = {
	id: 'nav-products',
	className: 'products',
	owns: ['/products/', '/installations/'],
	groups: [
		{
			name: 'IoT platforms',
			perColumn: 2,
			items: [
				{
					href: '/products/thingsboard-pe/',
					icon: '/src/assets/images/landings/nav/thingsboard-p-icon.svg',
					heading: 'ThingsBoard',
					description: 'On-premises IoT Platform',
					linkClass: 'prof-lnk',
				},
				{
					href: '/products/paas/',
					icon: '/src/assets/images/landings/nav/thingsboard-c-icon.svg',
					heading: 'ThingsBoard Cloud',
					description: 'Platform-as-a-Service',
					linkClass: 'cloud-lnk',
				},
			],
		},
		{
			name: 'Product ecosystem',
			perColumn: 3,
			items: [
				{
					href: '/products/thingsboard-edge/',
					icon: '/src/assets/images/landings/nav/thingsboard-e-icon.svg',
					heading: 'Edge',
					description: 'Edge computing',
					linkClass: 'edge-lnk',
				},
				{
					href: '/docs/iot-gateway/',
					icon: '/src/assets/images/landings/nav/gateway-icon.svg',
					heading: 'IoT Gateway',
					description: 'Connect legacy protocols',
					linkClass: 'gateway-lnk',
				},
				{
					href: '/products/mobile/',
					// The app's own icon is the ThingsBoard mark, on a wash of its green, as the footer and the
					// homepage's ecosystem show it; not a phone.
					icon: '/src/assets/images/landings/nav/thingsboard-m-icon.svg',
					heading: 'Mobile Application',
					description: 'IoT mobile product',
					linkClass: 'mobile-lnk',
				},
				{
					href: TBMQ_SITE_URL,
					icon: '/src/assets/images/landings/nav/tbmq-icon.svg',
					heading: 'TBMQ',
					description: 'Scalable MQTT broker',
					linkClass: 'mqtt-broker-lnk',
				},
				{
					href: '/products/trendz/',
					icon: '/src/assets/images/landings/nav/trendz-icon.svg',
					heading: 'Trendz Analytics',
					description: 'Data analytics and Prediction',
					linkClass: 'trendz-lnk',
				},
			],
		},
	],
};

// Services submenu
export const servicesSubmenu: SubMenu = {
	id: 'nav-services',
	className: 'services',
	owns: ['/services/'],
	groups: [
		{
			items: [
				{
					href: '/services/development-services/',
					icon: '/src/assets/images/landings/nav/development-services.svg',
					heading: 'Development services',
					description: 'IoT Solutions development',
				},
				{
					href: '/services/',
					icon: '/src/assets/images/landings/nav/support-icon.svg',
					heading: 'Support',
					description: 'Support packages and SLAs',
				},
				{
					href: '/services/trainings/',
					icon: '/src/assets/images/landings/nav/train-icon.svg',
					heading: 'Trainings',
					description: 'ThingsBoard education courses',
				},
			],
			more: { label: 'Talk to an expert', href: '/contact-us/' },
		},
	],
};

// Solutions submenu: ten of the use cases (the three that narrow another one — irrigation under
// farming, water metering under metering, air quality under environment monitoring — are one click
// away under "All use cases"), SCADA, and five case studies, the ones a visitor knows by name: the
// catalogue's featured Schwarz Group, then names the homepage's logo strip carries. Each list closes
// on its own index, "All use cases" and "All case studies"; the section has no bar under it.
export const solutionsSubmenu: SubMenu = {
	id: 'nav-solutions',
	className: 'cases',
	owns: ['/use-cases/', '/case-studies/'],
	groups: [
		{
			name: 'Use cases',
			perColumn: 5,
			items: [
				{
					href: '/use-cases/smart-energy/',
					icon: '/src/assets/images/landings/nav/case-eng-icon.svg',
					heading: 'Smart energy',
					description: 'Energy monitoring and efficiency',
				},
				{
					href: '/use-cases/environment-monitoring/',
					icon: '/src/assets/images/landings/nav/case-env-icon.svg',
					heading: 'Environment monitoring',
					description: 'Indoor & outdoor environment analysis',
				},
				{
					href: '/use-cases/smart-office/',
					icon: '/src/assets/images/landings/nav/case-off-icon.svg',
					heading: 'Smart office',
					description: 'Boost productivity & optimize resources',
				},
				{
					href: '/use-cases/smart-retail/',
					icon: '/src/assets/images/landings/nav/case-ret-icon.svg',
					heading: 'Smart retail',
					description: 'Food storage & safety monitoring',
				},
				{
					href: '/use-cases/smart-farming/',
					icon: '/src/assets/images/landings/nav/case-fam-icon.svg',
					heading: 'Smart farming',
					description: 'Remote soil & equipment monitoring',
				},
				{
					href: '/use-cases/site-fleet-tracking/',
					icon: '/src/assets/images/landings/nav/site-fleet-tracking-icon.svg',
					heading: 'Site fleet tracking',
					description: 'Fleet tracking & management',
				},
				{
					href: '/use-cases/health-care/',
					icon: '/src/assets/images/landings/nav/case-health-care-icon.svg',
					heading: 'Health care',
					description: 'Smart assisted living solution',
				},
				{
					href: '/use-cases/smart-metering/',
					icon: '/src/assets/images/landings/nav/case-met-icon.svg',
					heading: 'Smart metering',
					description: 'Meter data collection & analysis',
				},
				{
					href: '/use-cases/waste-management/',
					icon: '/src/assets/images/landings/nav/case-waste-icon.svg',
					heading: 'Waste management',
					description: 'Real-time waste management',
				},
				{
					href: '/use-cases/tank-level-monitoring/',
					icon: '/src/assets/images/landings/nav/case-level-icon.svg',
					heading: 'Tank level monitoring',
					description: 'Fuel tank location & level monitoring',
				},
			],
			more: { label: 'All use cases', href: '/use-cases/' },
		},
		{
			name: 'SCADA',
			items: [
				{
					href: '/use-cases/scada/',
					icon: '/src/assets/images/landings/nav/case-scada-icon.svg',
					heading: 'Swimming pool',
					description: 'Control industrial processes in real time',
				},
				{
					href: '/use-cases/scada-oil-and-gas-drilling-system/',
					icon: '/src/assets/images/landings/nav/case-scada-drilling-system-icon.svg',
					heading: 'Oil and gas drilling system',
					description: 'Control drilling operations',
				},
				{
					href: '/use-cases/scada-energy-management/',
					icon: '/src/assets/images/landings/nav/case-scada-energy-management.svg',
					heading: 'Energy management',
					description: 'Monitor & control energy systems',
				},
			],
		},
		{
			// The customer's name is the link: the study's own title is a sentence, and the group says what
			// they are. No mark: a row of one icon five times would say nothing.
			name: 'Case studies',
			items: [
				{ href: '/case-studies/schwarz/', heading: 'Schwarz Group' },
				{ href: '/case-studies/t-mobile-cz/', heading: 'T-Mobile' },
				{ href: '/case-studies/obb-infra/', heading: 'ÖBB-Infrastruktur' },
				{ href: '/case-studies/super-bock/', heading: 'Super Bock' },
				{ href: '/case-studies/circutor/', heading: 'Circutor' },
			],
			more: { label: 'All case studies', href: '/case-studies/' },
		},
	],
};

// Company submenu: the company, with what its clients say about it, and the partner programmes.
export const companySubmenu: SubMenu = {
	id: 'nav-company',
	className: 'about',
	groups: [
		{
			name: 'Company',
			perColumn: 3,
			items: [
				{
					href: '/company/',
					icon: '/src/assets/images/landings/nav/about-s-icon.svg',
					heading: 'Our company',
					linkClass: 'small-link',
				},
				{
					href: '/clients-feedback/',
					icon: '/src/assets/images/landings/nav/feedback.svg',
					heading: 'Clients feedback',
					linkClass: 'small-link',
				},
				{
					href: '/blog/',
					icon: '/src/assets/images/landings/nav/blog-s-icon.svg',
					heading: 'Blog',
					linkClass: 'small-link',
				},
				{
					href: '/mediakit/',
					icon: '/src/assets/images/landings/nav/media-s-icon.svg',
					heading: 'Media kit',
					linkClass: 'small-link',
				},
				{
					href: CAREERS_URL,
					icon: '/src/assets/images/landings/nav/careers-s-icon.svg',
					heading: 'Careers',
					linkClass: 'small-link',
				},
				{
					href: '/contact-us/',
					icon: '/src/assets/images/landings/nav/contact-s-icon.svg',
					heading: 'Contact us',
					linkClass: 'small-link',
				},
			],
		},
		{
			name: 'Partners',
			items: [
				{
					href: '/partners/affiliate/',
					icon: '/src/assets/images/landings/nav/affiliate-s-icon.svg',
					heading: 'Affiliate program',
					linkClass: 'small-link',
				},
				{
					href: '/partners/hardware/',
					icon: '/src/assets/images/landings/nav/hard-s-icon.svg',
					heading: 'Hardware partners',
					linkClass: 'small-link',
				},
				{
					href: '/partners/distributors/',
					icon: '/src/assets/images/landings/nav/dis-s-icon.svg',
					heading: 'Distributors',
					linkClass: 'small-link',
				},
			],
		},
	],
};

// Docs submenu: the products' own marks, drawn a step smaller and lighter than Products' (`SiteMenu`).
export const docsSubmenu: SubMenu = {
	id: 'nav-docs',
	className: 'products',
	owns: ['/docs/'],
	groups: [
		{
			name: 'IoT platforms',
			perColumn: 2,
			items: [
				{
					href: '/docs/pe/',
					icon: '/src/assets/images/landings/nav/thingsboard-p-icon.svg',
					heading: 'ThingsBoard',
					description: 'On-premises IoT Platform',
					linkClass: 'prof-lnk',
				},
				{
					href: '/docs/paas/',
					icon: '/src/assets/images/landings/nav/thingsboard-c-icon.svg',
					heading: 'ThingsBoard Cloud',
					description: 'Platform-as-a-Service',
					linkClass: 'cloud-lnk',
				},
			],
		},
		{
			name: 'Product ecosystem',
			perColumn: 3,
			items: [
				{
					href: '/docs/edge/pe/',
					icon: '/src/assets/images/landings/nav/thingsboard-e-icon.svg',
					heading: 'Edge',
					description: 'Edge computing',
					linkClass: 'edge-lnk',
				},
				{
					href: '/docs/iot-gateway/',
					icon: '/src/assets/images/landings/nav/gateway-icon.svg',
					heading: 'IoT Gateway',
					description: 'Connect legacy protocols',
					linkClass: 'gateway-lnk',
				},
				{
					href: '/docs/mobile/pe/',
					icon: '/src/assets/images/landings/nav/thingsboard-m-icon.svg',
					heading: 'Mobile Application',
					description: 'IoT mobile product',
					linkClass: 'mobile-pe-lnk',
				},
				{
					href: TBMQ_PE_DOCS_URL,
					icon: '/src/assets/images/landings/nav/tbmq-icon.svg',
					heading: 'TBMQ',
					description: 'Scalable MQTT broker',
					linkClass: 'mqtt-broker-lnk',
				},
				{
					href: '/docs/trendz/',
					icon: '/src/assets/images/landings/nav/trendz-icon.svg',
					heading: 'Trendz Analytics',
					description: 'Data analytics and Prediction',
					linkClass: 'trendz-lnk',
				},
			],
		},
	],
};

// All submenus
export const allSubmenus: SubMenu[] = [productsSubmenu, servicesSubmenu, solutionsSubmenu, companySubmenu, docsSubmenu];

/**
 * The footer link row, shared by the marketing footer (Landing/Footer.astro) and the docs
 * footer (starlight/DocFooter.astro). The two components keep their own markup and scoped
 * styles; only the link list is shared, so a link change is one edit rather than two.
 */
export const footerNavItems: { href: string; label: string }[] = [
	{ href: '/docs/pe/getting-started/', label: 'Get Started' },
	{ href: '/docs/pe/', label: 'Documentation' },
	{ href: '/use-cases/', label: 'Use cases' },
	{ href: '/blog/', label: 'Blog' },
	{ href: '/services/', label: 'Services' },
	{ href: '/contact-us/', label: 'Contact us' },
];
