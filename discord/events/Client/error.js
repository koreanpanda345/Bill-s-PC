const Logger = require('../../DevTools/Logger/index');
const { Client } = require('discord.js');
/**
 * @name ErrorEvent
 * @summary this handles the error event, which is when the bot throws an error. 
 * The bot will log the error.
 * @param {Client} _ - The Discord Client
 */
module.exports = (_) => {

  Logger.Error("./events/Client/error.js",console.error(), Date.now());
};
