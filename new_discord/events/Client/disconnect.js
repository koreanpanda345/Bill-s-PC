const { Client } = require('discord.js');

/**
 * @name DisconnectEvent
 * @summary This event is triggered when the bot disconnects.
 * @param {Client} client 
 */
module.exports = (client) => {
  console.log(`${new Date(Date.now())} => Bot disconnected.`);
}