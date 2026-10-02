import { AI_BADGE_CYCLE, AI_COPY } from '@data/ai-visual';

/**
 * The AI chat: YourGPT's widget, restyled from our side and opened from our own launcher.
 *
 * The widget renders into the page's own DOM (`#yourgpt_root`, no iframe, no shadow root), so its
 * look is ours to set: ~35 `--yourgptChatbot*` custom properties on `.ygpt-chatbot` and a set of
 * stable class names (`chatHeader`, `ygc-footer`, `ygpts-frame`, …) beside the hashed `sc-*` ones,
 * which change with every release of theirs and are never targeted. The dashboard's own settings —
 * the bot's name, its welcome text, its colours, a `widget_css` of its own — arrive from
 * `getChatbotSetting` after the script loads; the skin outranks them rather than depending on them.
 */

/** The widget the site ships, `YourGptWidget.astro`'s. One bot for every environment. */
export const YOURGPT_WIDGET_ID = '388b06d9-9f7f-4125-81e7-0cd963efb031';

/** The launcher's accessible name, and the pill launcher's label (`LAUNCHER_PILL_LABEL`). */
export const LAUNCHER_LABEL = 'Ask the ThingsBoard AI expert';
export const LAUNCHER_PILL_LABEL = 'Ask AI';

/**
 * THE AI MARK'S CYCLE, carried to the chat: the mark's own colour first (where it rests), then every
 * other section's badge colour, in the order `AI_BADGE_CYCLE` sets to keep the legs out of mud. The
 * whole cycle, not an order's subset (`aiBadgeCycleFor`): the chat is on every page, and "the colours
 * this page is built out of" is the site's palette there, not one running order's.
 */
export const CHAT_HUES: string[] = [AI_COPY.badge.color, ...AI_BADGE_CYCLE];

/**
 * A leg of the cycle, the AI band's 2.5s rather than the mark's 1.5: the launcher is in view on every
 * page for as long as one is read, and at the mark's pace it reads as a light blinking in the corner.
 */
export const CHAT_HUE_LEG_S = 2.5;

/** The longest cycle `ChatSkin` writes keyframes for, the mark's own colour included. */
export const CHAT_STOPS_MAX = 8;
if (CHAT_HUES.length < 2 || CHAT_HUES.length > CHAT_STOPS_MAX) {
	throw new Error(`chat-widget: the cycle takes 2 to ${CHAT_STOPS_MAX} colours, not ${CHAT_HUES.length}`);
}

/**
 * The hues and the clock as declarations: `--chat-hue-0…n`, the keyframe set for that many stops,
 * and the cycle's length. `ChatSkin` puts them on the root; a container that can be lifted out of
 * its page (a sandbox stage, in a phone frame) carries them itself.
 */
export const CHAT_HUE_VARS = [
	...CHAT_HUES.map((hue, i) => `--chat-hue-${i}: ${hue}`),
	`--chat-anim: chat-hues-${CHAT_HUES.length}`,
	`--chat-cycle: ${CHAT_HUE_LEG_S * CHAT_HUES.length}s`,
].join('; ');

/** The skins `ChatSkin` draws. `yourgpt` is the dashboard's look, restated for a mounted chat. */
export type ChatSkinName = 'yourgpt' | 'wash' | 'fullwash' | 'dark';

/** Our launcher: the AI mark's tile alone, a disc, or the tile in a white pill with a label. */
export type LauncherShape = 'tile' | 'circle' | 'pill';
/**
 * The tile in the cycling hue; the bookends' indigo with the glyph in the hue; or white with the
 * glyph in the hue.
 */
export type LauncherTone = 'hue' | 'dark' | 'white';
/**
 * `large` — the AI tile's 56, 20px in from the corner. `small` — 44, the cookie bar's Accept, 16px
 * in, which centres it on that button's row while the bar is up.
 */
export type LauncherSize = 'large' | 'small';
/**
 * Each size's tile and inset from the corner, in px: `ChatLauncher`'s `--tile` and `--inset`,
 * restated for `ChatSkin`, which sets their window over the launcher in use.
 */
export const LAUNCHER_BOX: Record<LauncherSize, { tile: number; inset: number }> = {
	large: { tile: 56, inset: 20 },
	small: { tile: 44, inset: 16 },
};

/**
 * The AI mark's sparkles, or a question mark — Ubuntu Bold's, the site's own face (`icons/question-bold`),
 * chosen over Tabler's line at 2.5–3.5 and its filled help circle: help, not the AI section's mark.
 */
export type LauncherGlyph = 'sparkles' | 'question';

export interface LauncherOptions {
	shape: LauncherShape;
	tone: LauncherTone;
	size?: LauncherSize;
	glyph?: LauncherGlyph;
}

/**
 * IN USE ON EVERY PAGE: the window in the `wash` skin, opened from a white disc with the glyph and
 * the glow in the cycling hue. `YourGptWidget` reads both. The disc was promoted 2026-10-01 at 56
 * with the sparkles ("Wash · white circle"); since 2026-10-02 it is 44 with a question mark
 * ("Wash · small question"): the sparkles are the AI section's mark, and the corner read as a
 * second copy of it.
 */
export const CHAT_SKIN: ChatSkinName = 'wash';
export const CHAT_LAUNCHER: LauncherOptions = { shape: 'circle', tone: 'white', size: 'small', glyph: 'question' };
