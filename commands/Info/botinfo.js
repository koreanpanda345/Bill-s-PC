const Discord = require('discord.js');

module.exports ={
  name: "botinfo",
  aliases: ['bot', 'info'],
  description: "Displays info about the bot.",
  category: "Info",
  execute(client, message, args){
    let embed = new Discord.RichEmbed();
    embed.setTitle(`Billy's PC`);
    embed.setDescription(`
This is Billy's PC. YES, I know it's supposed to be "Bill's PC", 
I would change it, but I am too lazy, and like being different.
This is a Pokemon Showdown Tools Bot. Allowing you to backup your teams to your very own 'PC',
And has other neat tools to help you in the world of Pokemon. ^-^.
`);
    embed.addField('Creator', "koreanpanda345#2878");
    embed.addField(`Created on`, client.user.createdAt);
    embed.addField(`Dependencies`, `Discord.js(V11.5.1)\nPokeAPi(pokedex-promise-v2)\nSuperagent(V5.2.2)`);
    embed.setColor(`RANDOM`);
    
    message.channel.send(embed);
  }
}