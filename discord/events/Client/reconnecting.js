const { Client } = require("discord.js");

/**
 * @name ReconnectingEvent
 * @summary this handles the Reconnecting event, which is when the bot trys to reconnect.
 * @param {Client} _ - The Discord Client 
 */
module.exports = (_) => {
  console.log(`Reconnecting at ${new Date.now()}`);
};
