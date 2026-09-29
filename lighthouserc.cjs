// Lighthouse CI, local only: audits this branch's own static build.
//
//   pnpm run lighthouse            build:fast, then audit
//   pnpm run lighthouse:nobuild    audit an existing ./dist
//   LH_PRESET=desktop pnpm run lighthouse:nobuild
//
// Reports land in ./reports/lighthouse/ (git-ignored), one HTML + JSON per URL per run.
// Only the pages this branch redesigns. Add a page by appending its path (trailing slash) to PATHS.

const PATHS = ['/', '/products/paas/', '/products/thingsboard-pe/', '/installations/'];

const preset = process.env.LH_PRESET === 'desktop' ? 'desktop' : undefined;

module.exports = {
	ci: {
		collect: {
			staticDistDir: './dist',
			url: PATHS.map((p) => `http://localhost${p}`),
			numberOfRuns: 3,
			settings: {
				...(preset ? { preset } : {}),
				// The static server has no compression; skip the audit that would only report that.
				skipAudits: ['uses-text-compression'],
			},
		},
		upload: {
			target: 'filesystem',
			outputDir: './reports/lighthouse',
			reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%.%%EXTENSION%%',
		},
	},
};
