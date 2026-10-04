import { caseStudyBySlug } from '@data/case-studies';
import { allFeedbackEntries } from '@data/clients-feedback';

/**
 * WHAT THE CUSTOMERS SECTION SHOWS besides its two links: three stories from the case studies, each
 * with one figure from its own page, and one line of a customer's feedback. The figures and the
 * author are read from the pages' data, so a page edit reaches the menu; the one-line titles are
 * written here, since a case study's own heading runs to twenty words.
 */
const STORIES: { slug: string; company: string; line: string; stat: number }[] = [
	{ slug: 'ibt-systems', company: 'IBT Systems', line: 'Precision livestock research across eight centres', stat: 2 },
	{ slug: 'ariot', company: 'Medline Adana Hospital', line: 'A hospital cold chain, fully digitised', stat: 1 },
	{ slug: 'wiifor', company: 'Wiifor', line: 'Five hundred sites deployed in two years', stat: 0 },
];

export interface MenuStory {
	href: string;
	company: string;
	line: string;
	category: string;
	stat?: { value: string; label: string };
}

const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

export const MENU_STORIES: MenuStory[] = STORIES.map(({ slug, company, line, stat }) => {
	const d = caseStudyBySlug[slug];
	if (!d) throw new Error(`[menu-customers] no case study "${slug}"`);
	const s = d.statistics?.[stat];
	return {
		href: `/case-studies/${slug}/`,
		company,
		line,
		category: titleCase(d.hero.category),
		stat: s ? { value: `${s.prefix ?? ''}${s.value}${s.suffix ?? ''}`, label: s.label } : undefined,
	};
});

const circutor = allFeedbackEntries.find((e) => e.id === 'circutor');
if (!circutor) throw new Error('[menu-customers] the Circutor feedback entry is gone');

/** One sentence of the Circutor feedback, as the page gives it; the author from the same entry. */
export const MENU_QUOTE = {
	text: 'I highly recommend ThingsBoard for its reliability, its flexibility and above all, the quality of the product and its technical service.',
	author: circutor.author,
	position: circutor.position,
	company: circutor.companyName,
	href: '/clients-feedback/',
};
