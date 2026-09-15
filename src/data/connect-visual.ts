/**
 * Content for the fourth key visual: every way a device can reach the platform.
 *
 * Replaces a grid of protocol logos. The logo wall showed perhaps a dozen marks and implied that
 * was the list, which undersold it and looked thin at the edges where the grid ran out. Naming the
 * protocols in type says "and the rest" far better than a partial set of logos, and it survives a
 * protocol being added without anyone having to source an SVG.
 */

export const CONNECT_COPY = {
	title: 'Connect any IoT devices',
	body: "Mix sensors, industrial machines, and any equipment you need in one solution. Browse pre-integrated devices from IoT Hub, or use emulators when hardware isn't ready. Connect directly, through an IoT gateway, from a LoRaWAN or LPWAN network, or via a platform integration.",
	// The doc is titled "How to Connect IoT Devices", and its own description names the same routes
	// this visual draws: direct MQTT/HTTP/CoAP, the IoT Gateway, and LoRaWAN or integrations.
	link: { text: 'Connectivity guide', href: '/docs/user-guide/connectivity-guide/' },
	/** The section's badge. Lives with the copy so every page that renders this row gets the same one. */
	badge: { icon: 'tabler:plug-connected', color: '#0e7490' },
};

/** What the routes converge on. */
export const CONNECT_NODE = { label: 'ThingsBoard' };

export interface ConnectGroup {
	/** The route, as a quiet caption over the names. */
	category: string;
	/**
	 * Tints this route's chips, and nothing else. It never touches the type — a protocol reads the
	 * same whichever route it arrives by — nor the connectors, which all draw in one grey.
	 */
	accent: string;
	/** The protocols themselves. These are what the visual is about. */
	names: string[];
}

/**
 * Three routes in, and the names are the point.
 *
 * The draft had it the other way round — route titles set large with the protocols listed small
 * beneath them — which made the picture a diagram of ThingsBoard's own taxonomy. Nobody arrives
 * wondering which of three categories they fall into; they arrive wondering whether their thing is
 * supported. So the names carry the size and the route is demoted to a caption.
 *
 * Purple and green are the IoT Gateway board's own hues, reused so the two visuals agree on what a
 * field protocol and an uplink look like. Teal is this visual's alone, chosen to stay clear of the
 * platform indigo the node wears.
 *
 * SUPERSEDED by CONNECT_ROUTES below, and kept only so the two can be compared. Its third row is
 * where the merge goes wrong: "LoRaWAN" is a category rather than something you integrate with, and
 * "NB-IoT" is a radio technology rather than a connection method at all. Those two are not fixed
 * here on purpose — fixing them IS the four-route set, and patching them in place would leave two
 * near-identical taxonomies to choose between instead of one clear trade.
 */
export const CONNECT_GROUPS: ConnectGroup[] = [
	{
		category: 'Devices',
		accent: '#0e7490',
		names: ['MQTT', 'HTTP', 'CoAP', 'LwM2M', 'SNMP'],
	},
	{
		category: 'Gateways',
		accent: '#7b3fe4',
		names: ['Modbus', 'OPC UA', 'BACnet', 'KNX', 'BLE'],
	},
	{
		category: 'Networks & clouds',
		accent: '#1f9d55',
		names: ['LoRaWAN', 'Sigfox', 'NB-IoT', 'AWS'],
	},
];

/**
 * The four routes as the connectivity guide itself defines them.
 *
 * The three-group set above merges LPWAN networks with cloud integrations into "Networks & clouds".
 * That reads more simply but is not what the doc says, and it produced two real errors: "LoRaWAN"
 * as a chip (you integrate with a network SERVER — ChirpStack, TTN, LORIOT — never with LoRaWAN
 * itself) and "NB-IoT" (a radio technology, not a connection method; it appears in the docs only
 * inside the IoT Creators integration).
 *
 * Names are a PRIORITISED SUBSET, not the full lists — the gateway alone has fifteen connectors and
 * platform integrations twenty-eight, which no phone-width card can hold. Each route shows the names a
 * reader is most likely to be scanning for, and the count is capped so the widest row still fits on
 * one line. The claim the visual makes is "your thing is probably here", and a short list of
 * recognised names makes that better than a long list of unrecognised ones.
 *
 * Every name below is a page in the docs tree, so none of them is a claim this repo cannot back.
 */
export const CONNECT_ROUTES: ConnectGroup[] = [
	{
		category: 'Direct connection',
		accent: '#0e7490',
		// The five device transports the connectivity guide tables, SNMP included — it has its own
		// API reference, so it is a direct transport here and not only a gateway connector.
		names: ['MQTT', 'HTTP', 'CoAP', 'LwM2M', 'SNMP'],
	},
	{
		category: 'IoT Gateway',
		accent: '#7b3fe4',
		// Five of fifteen: the industrial names most people arrive knowing, plus BLE, which is the
		// one short-range protocol a reader is likely to be scanning for.
		names: ['Modbus', 'OPC UA', 'BACnet', 'KNX', 'BLE'],
	},
	{
		category: 'LoRaWAN & LPWAN',
		accent: '#b45309',
		// Network servers, which is what you actually integrate with — plus Sigfox, which earns the
		// "& LPWAN" half of the caption rather than leaving it unevidenced.
		names: ['ChirpStack', 'TTN', 'LORIOT', 'Sigfox'],
	},
	{
		category: 'Platform integrations',
		accent: '#1f9d55',
		// Four of twenty-eight. "Pub/Sub" rather than "Google Pub/Sub": the vendor was spelled out so that
		// a missing third hyperscaler beside AWS and Azure could not read as "not supported", but
		// this row's own caption is "Platform integrations" and Pub/Sub is not a name anyone meets
		// outside Google Cloud — the context carries what the word was doing.
		//
		// It was also the most expensive name here. This is the widest row, so it alone sets the
		// route column; dropping "Google" takes about 50 units off the composition, which is 50
		// units of width every other route gets to keep at phone size. Every other name is far
		// inside the limit, so nothing else moves the number.
		names: ['AWS IoT', 'Azure IoT', 'Pub/Sub', 'Kafka'],
	},
];

/**
 * The same body, with the four routes carrying their own accents — the key for `ConnectCloud`.
 *
 * That visual drops the group captions, so nothing in it says what its four colours mean. Rather
 * than print a legend under the drawing, the paragraph beside it does the teaching: each route is
 * marked in the colour its chips wear, in the order the guide lists them. A reader who never makes
 * the connection still reads a correct sentence, which is the property a legend does not have.
 *
 * The marked terms are in the LAST sentence, not the first. A paragraph that opens with four
 * highlighted phrases reads as a list of links before it reads as a sentence; opening with what the
 * platform does for you and closing with how you reach it puts the key where a key belongs — after
 * the thing it explains.
 *
 * A TINT behind the words, not colour on them. It is the same wash at the same strength the chips
 * use, which is what makes the two legible as the same coding; colouring the type instead meant
 * darkening every accent to clear 4.5:1 for the green's sake, so the words and the chips they keyed
 * were never quite the same colour.
 *
 * The marked words take the page's INK rather than inheriting the paragraph's grey, and they have
 * to. That grey clears 4.91:1 on the row's wash with nothing behind it; the tint takes it to
 * 3.79-4.04, under the line. Ink on the same tint is 10:1 and up. It also happens to be what the
 * chips themselves use, so the marked phrase and the chips it keys are now literally the same two
 * colours.
 *
 * `box-decoration-break: clone` so a phrase that wraps carries its rounding onto the second line
 * rather than being left open at the break.
 *
 * Composed from CONNECT_ROUTES rather than written out, so a re-coloured route re-colours its mark.
 * The strength is `--connect-tint`, the same property the chips read, so the sandbox's tint control
 * moves the copy and the drawing together — they are one coding and have to stay one.
 *
 * Declared AFTER CONNECT_ROUTES, and it has to be: the terms are built while this module evaluates,
 * so a `const` referenced from above its own declaration is a temporal-dead-zone crash rather than
 * a type error — which means `astro check` would pass it and the page would be blank.
 */
const accentOf = (category: string) => CONNECT_ROUTES.find((r) => r.category === category)!.accent;
const term = (category: string, words: string) =>
	`<mark style="background: color-mix(in srgb, ${accentOf(category)} var(--connect-tint, 18%), transparent); color: var(--color-text, #171c22); padding: 0.1em 0.3em; border-radius: 4px; box-decoration-break: clone; -webkit-box-decoration-break: clone">${words}</mark>`;

export const CONNECT_BODY_HTML = [
	'Mix sensors, industrial machines, and any equipment you need in one solution. ',
	'Browse pre-integrated devices from IoT Hub, or use emulators when hardware isn&rsquo;t ready. ',
	`Connect ${term('Direct connection', 'directly')}, through an ${term('IoT Gateway', 'IoT gateway')}, `,
	`from a ${term('LoRaWAN & LPWAN', 'LoRaWAN or LPWAN network')}, `,
	`or via a ${term('Platform integrations', 'platform integration')}.`,
].join('');
