import type { ControlKind } from '@data/trust-center/controls';
import type { DocAccess } from '@data/trust-center/documents';

/**
 * What the Trust Center's tags mean, and how each one looks (the kit's `Chip` tag: a look, a colour,
 * an icon). Two kinds of tag, kept apart:
 *
 * - A VERDICT (is it verified, can you have it) takes a fixed status colour, the same in every
 *   section: green where it is verified or open to you, amber where it is gated, and the dashed grey
 *   of what is not there yet. A self-declaration is an outline: stated, not verified.
 * - A DESCRIPTION (what kind of control) takes the section's hue, in three strengths, so it reads as
 *   part of the section rather than as a grade.
 *
 * Every tag leads with an icon, so the colour is never the only signal. The colours are dark enough
 * to be text on their own 10% tint.
 */

export interface TagLook {
	label: string;
	icon: string;
	look: 'solid' | 'tint' | 'outline' | 'dashed';
	/** A status colour; none for a description, which takes the section's hue. */
	accent?: string;
	tone?: 'accent' | 'neutral';
}

const GREEN = '#0f7a43';
const AMBER = '#9a5b00';

export const VERIFICATION: Record<'certified' | 'declared', TagLook> = {
	certified: { label: 'Certified', icon: 'tabler:rosette-discount-check', look: 'solid', accent: GREEN },
	declared: { label: 'Self-declared', icon: 'tabler:file-description', look: 'outline', tone: 'neutral' },
};

export const ACCESS: Record<DocAccess, TagLook> = {
	public: { label: 'Public', icon: 'tabler:world', look: 'tint', accent: GREEN },
	nda: { label: 'Under NDA', icon: 'tabler:lock', look: 'tint', accent: AMBER },
	planned: { label: 'Planned', icon: 'tabler:clock', look: 'dashed', tone: 'neutral' },
};

export const KIND: Record<ControlKind, TagLook> = {
	'built-in': { label: 'Built in', icon: 'tabler:check', look: 'solid' },
	configurable: { label: 'Configurable', icon: 'tabler:adjustments-horizontal', look: 'tint' },
	deployment: { label: 'Depends on deployment', icon: 'tabler:server', look: 'outline' },
};
