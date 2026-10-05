import { caseStudyBySlug } from '@data/case-studies';
import { allFeedbackEntries } from '@data/clients-feedback';

/**
 * WHAT THE CUSTOMERS SECTION SHOWS besides its two links: three case studies as value cards — one
 * figure from the study's own page, three words for what it counts, and whose it is — and one line
 * of a customer's feedback. The figures and the author are read from the pages' data, so a page
 * edit reaches the menu; the labels are written here, because the pages' own run to seven words and
 * a card says one thing.
 */
const STORIES: { slug: string; company: string; figure: string; label: string }[] = [
	{ slug: 'ibt-systems', company: 'IBT Systems', figure: 'data points per day', label: 'data points a day' },
	{
		slug: 'ariot',
		company: 'Medline Adana Hospital',
		figure: 'digitalization of cold chain',
		label: 'of the cold chain digital',
	},
	{ slug: 'wiifor', company: 'Wiifor', figure: 'connected devices', label: 'devices connected' },
];

export interface MenuStory {
	href: string;
	company: string;
	value: string;
	label: string;
}

// A figure is found by the words its page labels it with, not by its place in the list, so reordering
// a case study's figures cannot put the wrong number on a card; a renamed one fails the build.
export const MENU_STORIES: MenuStory[] = STORIES.map(({ slug, company, figure, label }) => {
	const s = caseStudyBySlug[slug]?.statistics?.find((x) => x.label.startsWith(figure));
	if (!s) throw new Error(`[menu-customers] no figure labelled "${figure}…" on the case study "${slug}"`);
	return { href: `/case-studies/${slug}/`, company, value: `${s.prefix ?? ''}${s.value}${s.suffix ?? ''}`, label };
});

const circutor = allFeedbackEntries.find((e) => e.id === 'circutor');
if (!circutor) throw new Error('[menu-customers] the Circutor feedback entry is gone');

/**
 * One sentence of the Circutor feedback, word for word as the feedback page gives it (the customer's
 * own spelling of the name included), and its author from the same entry. Found by its opening
 * words; reworded on the page, the build fails rather than quoting what the customer no longer says.
 */
const QUOTE_OPENS = 'I highly recommend';
const quoteText = circutor.text
	.join(' ')
	.split(/(?<=\.)\s+/)
	.find((sentence) => sentence.startsWith(QUOTE_OPENS));
if (!quoteText) throw new Error(`[menu-customers] the Circutor feedback no longer says "${QUOTE_OPENS}…"`);

export const MENU_QUOTE = {
	text: quoteText,
	author: circutor.author,
	position: circutor.position,
	company: circutor.companyName,
	href: '/clients-feedback/',
};
