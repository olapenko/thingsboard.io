/**
 * The homepage's REFERENCES: the drawings and layouts a running order or a sandbox page can still
 * show, but `/` does not — so `/` does not import them.
 *
 * A component's stylesheet ships on every page whose imports reach it, whether it renders there or
 * not. `HomeSections`, `AutomateSwitch` and `TrustBand` used to import every alternative they could
 * draw, and `/` carried about 52 KB of CSS for drawings it never shows. Now each imports only what the
 * shipping order draws and takes an alternative as a prop: a page that shows one imports it from here
 * and passes it in, and pays for its stylesheet alone.
 *
 * - `AiSection` — the AI section as the handoff shipped it, the chat and the terminal behind one
 *   toggle (`layout: 'toggle'` in `data/home-compositions.ts`).
 * - `PlatformSteps`, `PlatformStepsBar` — the platform as one flow, its four stages docked under the
 *   header as a bar (`diagram: 'steps'`).
 * - `ScaleDuo` — the Scale row's drawing. The `live` order, main's homepage, still runs that row.
 * - `FilterFlow`, `NotifyFlow` — the Automate switch's first Filter and Notify drawings, as it first
 *   shipped (`AutomateSwitch`'s `filter` and `notify`).
 * - `TrustVisual` — the trust band's first drawings (`TrustBand`'s `drawings`).
 *
 * An order that needs one of these renders with `references={HOME_REFERENCES}` (`index.astro`
 * forwards it to `HomeSections`); without it, the build stops on that order and names what is missing.
 */
import AiSection from '@components/Landing/AiSection.astro';
import FilterFlow from '@components/Landing/FilterFlow.astro';
import NotifyFlow from '@components/Landing/NotifyFlow.astro';
import PlatformSteps from '@components/Landing/PlatformSteps.astro';
import PlatformStepsBar from '@components/Landing/PlatformStepsBar.astro';
import ScaleDuo from '@components/Landing/ScaleDuo.astro';
import TrustVisual from '@components/Landing/TrustVisual.astro';

export const HOME_REFERENCES = {
	AiSection,
	PlatformSteps,
	PlatformStepsBar,
	ScaleDuo,
	FilterFlow,
	NotifyFlow,
	TrustVisual,
};

export type HomeReferences = typeof HOME_REFERENCES;
