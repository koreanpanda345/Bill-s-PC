const { readdirSync } = require('fs');
const { Client, Collection } = require('discord.js');

/**
 * @name CommandHandler
 * @summary This handles all of the commands.
 * @param {Client} client 
 */
module.exports = (client) => {
  /**
   * @name LoadCommandFiles
   * @summary This loads the commands into the command Collections.
   * @param {string} dirs 
   */
  const load = (dirs) => {
    const commands = readdirSync(`./discord/commands/${dirs}`).filter(d => d.endsWith('.js'));
    for(let file of commands) {
      const cmd = require(`../commands/${dirs}/${file}`);
      client.commands.set(cmd.name, cmd);
      console.log(`Commands -> [${dirs}] ${cmd.name} was loaded`);
    }
  }
  [].forEach(x => load(x));
}