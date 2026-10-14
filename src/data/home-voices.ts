/**
 * Customer voices: the numbers, then six short quotes, before the closing CTA — the page's only
 * proof that is a person rather than a logo.
 *
 * SIX, AND SHORT: a line each rather than a paragraph, from six different kinds of business, so they
 * add up instead of repeating — the build-or-buy call (Nettra, infrastructure monitoring), a solution
 * provider's reuse (Kiotera), the edge inside a rail network (ÖBB-Infrastruktur), a carrier's speed
 * (T-Mobile), a hardware maker's time to market (TEKTELIC), and a team that delivered on a penalty
 * deadline (X-TELIA). The wireframe had nine; co.met, Farinia and Vodafone went, the last because
 * its words are about our development services rather than the platform. ÖBB and X-TELIA took
 * Circutor's and Enviroeye's places in main's #752 (2026-10-13). Two are ACCENTS, set larger on the
 * bookends' navy, in opposite corners of the grid so the eye crosses it: the build-or-buy call opens
 * it and X-TELIA's closes it.
 *
 * THE PULL QUOTES ARE VERBATIM. Each is a substring of that customer's own words — its entry in
 * `clients-feedback`, or the authored quote of its case study — and this module checks it as it
 * loads: a paraphrase, a fixed typo or a capital changed fails the build. The one thing the check
 * forgives is the brand's own spelling, which some customers wrote "Thingsboard". The context lines
 * are ours, and each says only what the same source says, never a number it does not contain.
 *
 * Marks and faces are the repo's own copies where it has them, otherwise the feedback data's. Nettra
 * and T-Mobile have no headshot and fall back to an initial, as the feedback page does, rather than
 * a stock silhouette.
 */

import { allFeedbackEntries } from '@data/clients-feedback';
import { caseStudyBySlug } from '@data/case-studies';
import { GITHUB_STARS, GITHUB_STARS_AS_OF } from '@data/github-stars';
// ÖBB's case-study mark is white, for its dark hero; this is its coloured one.
import obbLogo from '@root/assets/images/landings/customer-logo/obb.svg';
import obbFace from '@root/assets/images/landings/edge/Dominic_Winkler.webp';
import tmobileLogo from '@root/assets/images/landings/customer-logo/t-mobile.svg';
import tektelicLogo from '@root/assets/images/landings/customer-logo/tektelic.svg';

type Picture = { src: string; width?: number; height?: number };

/** Who said it and where: a feedback entry or a case study, in one shape. */
interface VoiceSource {
	text: string[];
	author: string;
	position?: string;
	company: string;
	caseStudy: string;
	logo: Picture;
	face?: Picture;
}

const feedback = (id: string): VoiceSource => {
	const e = allFeedbackEntries.find((entry) => entry.id === id);
	if (!e?.caseStudySlug) throw new Error(`home-voices: no feedback entry "${id}" with a case study`);
	return {
		text: e.text,
		author: e.author,
		position: e.position,
		company: e.companyName,
		caseStudy: e.caseStudySlug,
		logo: { src: e.companyImage, width: e.companyImageWidth, height: e.companyImageHeight },
		face: e.authorImage ? { src: e.authorImage } : undefined,
	};
};

const caseStudy = (slug: string): VoiceSource => {
	const d = caseStudyBySlug[slug];
	const q = d?.authoredQuote;
	if (!q?.company) throw new Error(`home-voices: no quote with a company in case study "${slug}"`);
	return {
		text: [q.text],
		author: q.author,
		position: q.role,
		company: q.company,
		caseStudy: slug,
		logo: { src: d.contact.companyLogo, width: d.contact.companyLogoWidth, height: d.contact.companyLogoHeight },
		face: q.photo ? { src: q.photo } : undefined,
	};
};

interface VoicePick {
	source: VoiceSource;
	/** In place of the source's own. */
	logo?: Picture;
	face?: Picture;
	/** Verbatim from the source's text. */
	pull: string;
	/** Where the pull cuts into its sentence, so the card marks the cut with an ellipsis. */
	cut: { start: boolean; end: boolean };
	context: string;
	/** Set larger, on the bookends' navy. Two at most, or it stops being an accent. */
	accent?: boolean;
	/** Where the face sits in a photo that is not a centred headshot. */
	facePosition?: string;
	/** A heavy mark runs smaller than the 24px the rest share. */
	logoHeight?: number;
}

const PICKS: VoicePick[] = [
	{
		source: feedback('nettra'),
		logo: { src: '/images/usecases/partners-logos/nettra-logo.webp', width: 544, height: 141 },
		pull: 'Switching to ThingsBoard was a no-brainer',
		cut: { start: false, end: false },
		context:
			'Six months into building its own platform, it found every feature it had built, and the next ones, already there.',
		accent: true,
	},
	{
		source: feedback('kiotera'),
		pull: 'implement IoT-Solutions in a matter of days',
		cut: { start: true, end: false },
		context: 'Reuses the same gateways, sensors and rule chains as modules across its customers’ projects.',
	},
	{
		source: caseStudy('obb-infra'),
		logo: obbLogo,
		face: obbFace,
		facePosition: '28% 30%',
		logoHeight: 18,
		pull: 'allow data to flow within our IT network without the need to bridge Firewalls and Public Internet',
		cut: { start: true, end: false },
		context:
			'Monitors Austria’s rail infrastructure, from signals to bridges, with ThingsBoard Edge inside its own network.',
	},
	{
		source: feedback('tmobile'),
		logo: tmobileLogo,
		pull: 'done in nearly no time',
		cut: { start: true, end: false },
		context: 'Proofs of concept and prototypes for NB-IoT and Sigfox devices that arrive with no app.',
	},
	{
		source: feedback('tektelic'),
		logo: tektelicLogo,
		pull: 'dramatically reduce time to market',
		cut: { start: true, end: true },
		context: 'Completed its LoRaWAN gateways and sensors into end-to-end applications for its clients.',
	},
	{
		source: feedback('xtelia'),
		face: { src: '/images/development-services/Eric-Bourbeau.webp' },
		logoHeight: 18,
		pull: 'I can say that the dedication of ThingsBoard team blew me away',
		cut: { start: false, end: false },
		context: 'Deployed city-wide “No Parking” signs for snow removal against a tight, penalty-backed deadline.',
		accent: true,
	},
];

export interface HomeVoice {
	quote: string;
	context: string;
	author: string;
	position?: string;
	company: string;
	/** The company's mark, with its drawn size for the ratio. */
	logo: Picture;
	logoHeight?: number;
	face?: Picture;
	facePosition?: string;
	/** The customer's case study. */
	href: string;
	accent: boolean;
}

/** Verbatim but for the brand's spelling, which some customers wrote as "Thingsboard". */
const brand = (text: string) => text.replaceAll('Thingsboard', 'ThingsBoard');

export const HOME_VOICES: HomeVoice[] = PICKS.map(
	({
		source,
		pull,
		cut,
		context,
		accent = false,
		logo = source.logo,
		face = source.face,
		facePosition,
		logoHeight,
	}) => {
		if (!source.text.some((paragraph) => brand(paragraph).includes(pull))) {
			throw new Error(`home-voices: the quote from ${source.company} is not verbatim`);
		}
		return {
			quote: `${cut.start ? '…' : ''}${pull}${cut.end ? '…' : ''}`,
			context,
			author: source.author,
			position: source.position,
			// "T-Mobile Czech Republic a.s.", "TEKTELIC Communications Inc." and "ÖBB-Infrastruktur AG" are
			// the legal names the sources print; a card this small says the name people know.
			company: source.company.replace(/ (a\.s\.|Communications Inc\.|AG)$/, ''),
			logo,
			logoHeight,
			face,
			facePosition,
			href: `/case-studies/${source.caseStudy}/`,
			accent,
		};
	}
);

if (HOME_VOICES.filter((v) => v.accent).length > 2) {
	throw new Error('home-voices: more than two accents, and it stops being an accent');
}

// --- the numbers ------------------------------------------------------------------------------

export interface VoiceStat {
	value: string;
	label: string;
	/**
	 * Where the figure comes from. ABSENT MEANS NOBODY HAS SOURCED IT: the two without one are the
	 * old wireframe's (its "Trusted IoT deployments worldwide" band), and nothing in this repo or in
	 * thingsboard.one backs them. Confirm both before this ships, or swap them for figures that are.
	 */
	source?: string;
}

const PLATFORM_STARS = GITHUB_STARS['thingsboard/thingsboard'];
/** "ThingsBoard started in 2016", as the Company page's history puts it. */
const STARTED = 2016;

export const VOICES_STATS: VoiceStat[] = [
	{ value: '5M+', label: 'devices connected' },
	// Rounded DOWN to the thousand, like the header's button rounds to the hundred: a count that can
	// only read low. The wireframe's "20K+" predates the snapshot.
	{
		value: `${Math.floor(PLATFORM_STARS / 1000)}K+`,
		label: 'GitHub stars',
		source: `the header's GitHub button snapshot, ${PLATFORM_STARS} on ${GITHUB_STARS_AS_OF}`,
	},
	{ value: '100+', label: 'countries with deployments' },
	// A plain 10, where the wireframe said "10+": 2016 to 2026 is ten, not more.
	{
		value: String(new Date().getFullYear() - STARTED),
		label: 'years in production',
		source: 'the Company page: "ThingsBoard started in 2016"',
	},
];

/**
 * "Proven in production", which covers both halves of the section — the numbers and the people —
 * where "In production, in their words" named only the quotes.
 *
 * NO BADGE, AND NOT A SECTION COLOUR. This is not a capability, it is the page closing its case, and
 * it sits straight above the closing CTA. So it takes the BOOKENDS' colour, as the trust band does
 * above Products: the indigo that `#121425` is made from, light on the ground and dark on the two
 * accents. It wore Scale's green for a pass, which fought the navy under it.
 */
export const VOICES_COPY = {
	title: 'Proven in production',
	lede: 'Every one of these is a system someone’s business runs on.',
	all: { text: 'Read all client feedback', href: '/clients-feedback/' },
	/** Names the numbers for assistive tech: a list of four figures says nothing on its own. */
	statsLabel: 'ThingsBoard in numbers',
	/** Names the phone's swipeable strip of quotes. */
	stripLabel: 'Customer quotes',
};
