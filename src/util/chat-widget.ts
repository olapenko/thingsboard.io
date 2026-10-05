import { YOURGPT_WIDGET_ID } from '@data/chat-widget';

/**
 * The YourGPT widget, driven from our side: load it, open and close it, mount it into an element of
 * ours, and hear when it opens or closes. Everything goes through the SDK object their `script.js`
 * puts on `window.$yourgptChatbot` — a queue until `chatbot.js` has booted, the live API after — so
 * a call made before the bot is up is replayed when it is.
 *
 * WHAT THE SDK TAKES, read from their bundle (2026-10-01) and checked in the browser:
 * - `execute('widget:open' | 'widget:close')` — the window; `'widget:show' | 'widget:hide'` — their
 *   launcher, which our launcher replaces.
 * - `execute('widget:mount', el)` — renders the chat INSIDE `el` (no launcher, no floating frame),
 *   open; `'widget:unmount'` sends it back to the floating root, closed. The sandbox's stages use it.
 * - `execute('message:send', { text, send })` — puts a question in the composer, or sends it.
 * - `on('widget:popup', open => …)` — called with the window's state on every change, and once on
 *   boot.
 *
 * A mounted chat is NOT inside `.ygpt-chatbot`, where their custom properties are declared, so it
 * renders unthemed unless the element it is mounted into declares them — `ChatSkin` does.
 */

interface YourGptApi {
	execute(action: string, data?: unknown): void;
	on(event: string, cb: (...args: any[]) => void): void;
	off(event: string, cb: (...args: any[]) => void): void;
}

declare global {
	interface Window {
		YGC_WIDGET_ID?: string;
		$yourgptChatbot?: YourGptApi;
	}
}

const SCRIPT_ID = 'yourgpt-chatbot';
const SCRIPT_SRC = 'https://widget.yourgpt.ai/script.js';

let ready: Promise<YourGptApi> | undefined;

/**
 * Every call goes to whatever `window.$yourgptChatbot` is AT THE TIME OF THE CALL. It is three
 * different objects over a page's life: their `script.js` puts a queue there, and `chatbot.js`, once
 * booted, replaces the queue with the live API. A reference kept from before the boot is the dead
 * queue — calls pushed onto it are never read, which is how a second mount silently did nothing.
 */
const live: YourGptApi = {
	execute: (action, data) => window.$yourgptChatbot!.execute(action, data),
	on: (event, cb) => window.$yourgptChatbot!.on(event, cb),
	off: (event, cb) => window.$yourgptChatbot!.off(event, cb),
};

/**
 * The SDK, loading the widget first if nothing on the page has. Their `script.js` REPLACES
 * `window.$yourgptChatbot` with a fresh queue when it runs, so nothing can be queued before it has —
 * this waits for its `load`, whoever injected it (here, or `YourGptWidget`'s deferred loader).
 */
export function whenChat(): Promise<YourGptApi> {
	if (ready) return ready;
	ready = new Promise((resolve) => {
		let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
		if (script && typeof window.$yourgptChatbot?.execute === 'function') return resolve(live);
		if (!script) {
			window.YGC_WIDGET_ID ??= YOURGPT_WIDGET_ID;
			script = document.createElement('script');
			script.src = SCRIPT_SRC;
			script.id = SCRIPT_ID;
			script.async = true;
			// The head, not the body: the sandbox's phone frames replace the body's children while the
			// page boots, and their `script.js` looks itself up by id when it runs.
			document.head.appendChild(script);
		}
		script.addEventListener('load', () => resolve(live), { once: true });
	});
	return ready;
}

let up: Promise<YourGptApi> | undefined;

/**
 * The SDK once the bot has BOOTED — their React tree rendered and the queue replaced by the live API
 * (which has no `q`). An `execute('widget:open')` queued before that is replayed during the boot and
 * then overwritten by the bot's own initial state, closed, so a click on our launcher before the
 * widget had loaded did nothing. Commands that must stick wait for this; it polls, because the boot
 * has no event a late listener can still hear.
 */
export function whenChatUp(): Promise<YourGptApi> {
	if (up) return up;
	up = whenChat().then(
		(api) =>
			new Promise((resolve) => {
				const booted = () =>
					!Array.isArray((window.$yourgptChatbot as { q?: unknown } | undefined)?.q) &&
					document.querySelector('.yourgptChatbotRoot');
				const check = (tries: number) => {
					if (booted() || tries <= 0) return resolve(api);
					setTimeout(() => check(tries - 1), 100);
				};
				check(150);
			})
	);
	return up;
}

/** Calls `cb` with the window's state now and on every change. */
export async function onChatPopup(cb: (open: boolean) => void): Promise<void> {
	(await whenChat()).on('widget:popup', (open: unknown) => cb(Boolean(open)));
}

/**
 * Puts every running hue cycle on ONE clock, the document's. The launcher and the window animate
 * `--chat-hue` each on its own element (the window is not inside the launcher, nor the launcher
 * inside the window), and a CSS animation's clock starts whenever its rule first applies: the
 * launcher at load, the window when it opens. Started from the same origin, the two pass through
 * each colour together. Two frames late, so an animation started by the change that called this
 * exists by then.
 */
export function syncHues(): void {
	requestAnimationFrame(() =>
		requestAnimationFrame(() => {
			for (const a of document.getAnimations()) {
				if (a instanceof CSSAnimation && a.animationName.startsWith('chat-hues')) a.startTime = 0;
			}
		})
	);
}

/** Until when focus may go into their window while it is still closed: the moments after our launcher asks it to open. */
let openingUntil = 0;
const OPENING_GRACE_MS = 3000;
let focusGuarded = false;

/**
 * KEEPS FOCUS OUT OF THE CLOSED WINDOW. The widget loads on the reader's first interaction
 * (`YourGptWidget`), which for a keyboard reader is their first Tab, and as it boots it focuses its
 * message box — before it marks the closed window `inert`. Focus left the link the reader had just
 * tabbed to for a box nobody can see, and the next Tab went on from the end of the page. Focus that
 * lands in their root while the window is closed, and not because our launcher is opening it, goes
 * back where it came from. A chat mounted into an element of ours (`widget:mount`) is not in their
 * root and is left alone.
 */
function guardFocus(): void {
	if (focusGuarded) return;
	focusGuarded = true;
	document.addEventListener(
		'focusin',
		(e) => {
			const target = e.target as HTMLElement;
			if (!target.closest?.('#yourgpt_root')) return;
			if (document.documentElement.hasAttribute('data-chat-open') || performance.now() < openingUntil) return;
			const back = e.relatedTarget as HTMLElement | null;
			if (back?.isConnected && !back.closest('#yourgpt_root')) back.focus({ preventScroll: true });
			else target.blur();
		},
		true
	);
}

/**
 * Our floating launchers (`ChatLauncher floating`): a click loads the widget if it has not loaded
 * yet and toggles the window; the window's state comes back through `widget:popup`, so the header's
 * own close, Escape, or anything else that closes it is reflected too. `data-chat-open` on the root
 * is there for any page furniture that has to step aside while the chat is open.
 */
export function wireFloatingLaunchers(root: ParentNode = document): void {
	// Once per button: `ChatLauncher`'s own script and `YourGptWidget` (which clones the launcher into
	// the body first) both call this, and a button wired twice would open and close on one click.
	const launchers = Array.from(
		root.querySelectorAll<HTMLButtonElement>('[data-chat-launcher][data-chat-floating]:not([data-chat-wired])')
	);
	if (!launchers.length) return;
	launchers.forEach((b) => (b.dataset.chatWired = ''));
	let open = false;
	const reflect = (state: boolean) => {
		open = state;
		document.documentElement.toggleAttribute('data-chat-open', state);
		launchers.forEach((b) => b.setAttribute('aria-expanded', String(state)));
		syncHues();
	};
	let listening = false;
	const listen = () => {
		if (listening) return;
		listening = true;
		void onChatPopup(reflect);
	};
	guardFocus();
	launchers.forEach((b) =>
		b.addEventListener('click', async () => {
			listen();
			const api = await whenChatUp();
			// From the moment the open is asked for, which on a first click waits for the widget's boot.
			if (!open) openingUntil = performance.now() + OPENING_GRACE_MS;
			api.execute(open ? 'widget:close' : 'widget:open');
		})
	);
	// Already loaded (the deferred loader got there first): follow its state from now on.
	if (document.getElementById(SCRIPT_ID)) listen();
	syncHues();
}
