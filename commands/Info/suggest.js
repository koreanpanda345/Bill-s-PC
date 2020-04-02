const Discord = require('discord.js');

module.exports = {
  name: "suggest",
  category: "Info",
  description: "This will direct you to a form that will allow you to suggest an idea, or command.",
  execute(client, message, args){
    let embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setURL('https://airtable.com/shrngOqSUiugLNSLK')
    .setTitle('Want to suggest something?');
    
    message.channel.send(embed);
  }
}