export interface CustomerLogo {
	src: string;
	ariaLabel: string;
	/** Only to a page of ours about the customer (a case study, their feedback); a mark without one is not a link. */
	href?: string;
	/** The mark's own box, which must be its ink: the strip sizes each logo from this ratio. */
	width: number;
	height: number;
}

export const defaultCustomersLogos: CustomerLogo[] = [
	{
		src: '/src/assets/images/landings/customer-logo/prosegur.svg',
		ariaLabel: 'Prosegur logo',
		width: 181,
		height: 34,
	},
	{
		src: '/src/assets/images/landings/customer-logo/engie.svg',
		ariaLabel: 'Engie logo',
		width: 115,
		height: 40,
	},
	{
		src: '/src/assets/images/landings/customer-logo/t-mobile.svg',
		ariaLabel: 'T-mobile logo',
		href: '/clients-feedback/?category=telecom',
		width: 181,
		height: 30,
	},
	{
		src: '/src/assets/images/landings/customer-logo/obb.svg',
		ariaLabel: 'ÖBB-Infrastruktur logo',
		href: '/case-studies/obb-infra/',
		width: 851,
		height: 297,
	},
	{
		src: '/src/assets/images/landings/customer-logo/intel.svg',
		ariaLabel: 'Intel logo',
		width: 103,
		height: 40,
	},
	{
		src: '/src/assets/images/landings/customer-logo/schwarz-gruppe.svg',
		ariaLabel: 'Schwarz logo',
		href: '/case-studies/schwarz/',
		width: 179,
		height: 34,
	},
	{
		src: '/src/assets/images/landings/customer-logo/circutor.svg',
		ariaLabel: 'Circutor logo',
		href: '/case-studies/circutor/',
		width: 160,
		height: 37,
	},
	{
		src: '/src/assets/images/landings/customer-logo/bosch.svg',
		ariaLabel: 'Bosch logo',
		width: 181,
		height: 40,
	},
	{
		src: '/src/assets/images/landings/customer-logo/tektelic.svg',
		ariaLabel: 'Tektelic logo',
		href: '/clients-feedback/?category=telecom',
		width: 179,
		height: 40,
	},
];
