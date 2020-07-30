const { Client } = require('discord.js');
/**
 * @name ReadyEvent
 * @sumarry This Event triggers when the bot is online.
 * @param {Client} client 
 */
module.exports = (client) => {
  console.log(`${client.user.username} is online.`);
  client.user.setActivity({name: "Ready to help.", type: "WATCHING"});
};