/**
 * Star counts for the repos the header's GitHub button links, as of the date below.
 *
 * The button shows these from the first paint and swaps in the live count once its deferred fetch
 * returns (see `GitHubButton`). The homepage's numbers band reads the platform's from here too, so
 * the two never disagree. Refresh when one crosses the next hundred, or leave them: they only ever
 * read low. These are main's `src/data/github-stars.json` of 2026-10-13 (#752).
 */
export const GITHUB_STARS_AS_OF = '2026-10-13';

export const GITHUB_STARS: Record<string, number> = {
	'thingsboard/thingsboard': 22543,
	'thingsboard/thingsboard-gateway': 2196,
	'thingsboard/thingsboard-edge': 180,
	'thingsboard/tbmq': 769,
};
