/**
 * The words in the IoT Gateway's key visual (`GatewayHub`).
 *
 * The protocols are the five the Gateway's own copy names — its `homeEcosystem` entry and its
 * sandbox headline both say "Modbus, OPC UA, BACnet, SNMP, KNX and 25+ industrial protocols" — in
 * that order, so the picture and the sentence beside it list the same things. Each one is a named
 * connector in the Gateway's docs (`/docs/iot-gateway/`), which is the test ConnectHub's notes hold
 * every chip to.
 *
 * The sixth arm is the remainder, not a protocol, and the component draws it quieter for that
 * reason. "+20 more" rather than "+20": a bare number next to five names reads as a sixth name.
 */
export const GATEWAY_HUB = {
	protocols: ['Modbus', 'OPC UA', 'BACnet', 'SNMP', 'KNX'],
	more: '+20 more',
	/** The one protocol the Gateway produces — its copy says "translated to MQTT or HTTP" — drawn as a chip on the line to the platform. */
	uplink: 'MQTT',
	label:
		'Field devices speaking Modbus, OPC UA, BACnet, SNMP, KNX and twenty more industrial protocols arrive at the ThingsBoard IoT Gateway, which forwards them to ThingsBoard over MQTT.',
};
