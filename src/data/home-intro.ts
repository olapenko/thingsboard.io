/**
 * The homepage's centred statement — the block between the hero and the five rows.
 *
 * Its own module for the same reason every other visual's copy has one: two pages render this
 * section now. `index.astro` runs it for real, and the platform sandbox shows it above the platform
 * visual, because a centred section above the rows is where that visual is headed. A string copied
 * into the second of those is a string that will be edited in one of them.
 *
 * The published wording, less the clause that claimed everything: "gives you everything you need"
 * is the sentence promising rather than saying, and what follows it — build, deploy, scale — is
 * already the specific version of the same claim.
 *
 * It carries its own "ThingsBoard" now. The word used to be a link into the docs that
 * `IntroSection` supplied, so the string began mid-sentence at " is an…".
 */
export const HOME_INTRO = {
	title: 'ThingsBoard is an all-in-one IoT platform to build, deploy, and scale IoT solutions',
	description:
		'It enables device connectivity via industry-standard IoT protocols - Modbus, LoRaWAN, MQTT, and CoAP, and supports both cloud and on-premises deployments. ThingsBoard combines scalability, fault tolerance, and performance so you will never lose your data.',
};
