const Discord = require('discord.js');

module.exports = {
    name: "ping",
    aliases: ["latency"],
    description: "Displays the bot's current ping.",
    category: 'Miscellaneous',
    execute(client, message, args){
        message.channel.send(`Pong! Ping is ${client.ws.ping} ms`);
    }
}
