const { Client } = require("discord.js");

/**
 * @name ReadyEvent
 * @summary this handles the ready event, which is when the bot is ready.
 * @param {Client} client - The Discord Client 
 */
module.exports = client => {
  console.log(`Logged in as ${client.user.username}`);
  client.user.setActivity('Ready to help.', {type: 'WATCHING'});
};
