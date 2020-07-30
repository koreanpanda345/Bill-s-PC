const {Client, Message} = require('discord.js');

/**
 * @name MessageEvent
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports = (client, message) => {
  if(message.author.bot|| message.channel.type === "dm") return;
  if(message.content.startsWith(process.env.PREFIX)) {
    let args = message.content.slice(process.env.PREFIX.length).split(/ +/g);
    let commandName = args.shift().toLowerCase();

    let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if(!command) return;

    try{
      command.invoke(client, message, args);
    } catch(ex) {
      console.error(ex);
    }
  }
}