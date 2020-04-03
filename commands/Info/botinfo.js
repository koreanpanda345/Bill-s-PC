const Discord = require('discord.js');

module.exports ={
  name: "botinfo",
  aliases: ['bot', 'info'],
  description: "Displays info about the bot.",
  category: "Info",
  execute(client, message, args){
    let embed = new Discord.MessageEmbed();
    embed.setTitle(`Bill's PC`);
    embed.setDescription(`
This is Bill's PC. 
This is a Pokemon Showdown Tools Bot. Allowing you to backup your teams to your very own 'PC',
And has other neat tools to help you in the world of Pokemon. ^-^.
`);
    embed.addField('Creator', "koreanpanda345#2878");
    embed.addField(`Created on`, client.user.createdAt);
    embed.addField(`Dependencies`, `Discord.js(V12.0.2)\nPokeAPi(pokedex-promise-v2)\nSuperagent(V5.2.2)\nAirtable(0.8.1)`);
    embed.addField(`This bot could have not be made possible without these wonderful people:`, `Chaos & Zarel(Owners of Smogon & Pokemon Showdown)\nPokemon Showdown Staff\nAnd You`)
    embed.setColor(`RANDOM`);
    
    message.channel.send(embed);
  }
}
