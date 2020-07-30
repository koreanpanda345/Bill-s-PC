const { Client } = require('discord.js');
/**
 * @name ReconnectingEvent
 * @summary This event is triggered when the bot is trying to reconnect.
 * @param {Client} client 
 */
module.exports = (client) => {
	console.log(`${new Date(Date.now())} => The bot reconnected.`);
}