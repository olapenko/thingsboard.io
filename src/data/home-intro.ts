/**
 * The homepage's centred statement — the block between the hero and the five rows.
 *
 * Its own module for the same reason every other visual's copy has one: two pages render this
 * section now. `index.astro` runs it for real, and the platform sandbox shows it above the platform
 * visual, because a centred section above the rows is where that visual is headed. A string copied
 * into the second of those is a string that will be edited in one of them.
 *
 * The published wording. An earlier pass rewrote it to set up the five rows; this is the approved
 * copy, restored exactly, and `IntroSection` supplies the "ThingsBoard" link the title opens with.
 */
export const HOME_INTRO = {
	title: ' is an all-in-one IoT platform that gives you everything you need to build, deploy, and scale IoT solutions',
	description:
		'It enables device connectivity via industry-standard IoT protocols - Modbus, LoRaWAN, MQTT, and CoAP, and supports both cloud and on-premises deployments. ThingsBoard combines scalability, fault tolerance, and performance so you will never lose your data.',
};
