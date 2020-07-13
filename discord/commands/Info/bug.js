const Discord = require('discord.js');

module.exports = {
  name: "bugreport",
  aliases: ["bug", "report"],
  category: "Info",
  description: "This will direct you to a form that will allow you to report a bug.",
  execute(client, message, args){
    let embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setURL('https://airtable.com/shrn5D5nx549xW2L1')
    .setTitle('Bug Report');
    
    message.channel.send(embed);
  }
}