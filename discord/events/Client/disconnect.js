const { Client } = require("discord.js");

/**
 * @name DisconnectEvent
 * @summary this handles the Disconnect event which is when the bot disconnects.
 * @param {Client} _ - The Discord Client. This is required to have, but is not needed. that is why it is _ 
 */
module.exports = (_) => {
  console.log(`Disconnected at ${new Date.now()}`);
};
