const { readdirSync } = require("fs");
const { Client } = require("discord.js");

/**
 * @name CommandHandler
 * @summary This handles all of the commands. 
 * This makes a Collection of the command files that the client will be able to use.
 * @param {Client} client - The Discord Client
 */
module.exports = (client) => {
    /**
     * @name LoadCommandFiles
     * @summary This loads all the command files into the Discord.Collection().
     * @param {String} dirs 
     */
  const load = (dirs) => {
    const commands = readdirSync(`./discord/commands/${dirs}`).filter(d =>
      d.endsWith(".js")
    );
    for (let file of commands) {
      const cmd = require(`../commands/${dirs}/${file}`);
      client.commands.set(cmd.name, cmd);
      console.log(`Commands -> ${dirs}] ${cmd.name} was loaded`);
    }
  };

  ["Draft","Info", "Miscellaneous", "Settings", "Teams", "Tools"].forEach(x => load(x));
};
