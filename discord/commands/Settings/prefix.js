const { MessageEmbed, Client, Message } = require('discord.js');
const Airtable = require('../../Airtable/index');
const settings = require('./settings');
module.exports = {
    name: "setprefix",
    aliases: ["prefix"],
    args: "<desired prefix>",
    description: "Allows admins to change the prefix for the bot.",
    category: "Settings",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args){
      let db = new Airtable({guildId: message.guild.id}).utils.settings;
      let embed = new MessageEmbed();
      if(!args[0]){
        let data = await db.getGuildSettings();
        if(!data.success){
          embed.setTitle("**ERROR**");
          embed.setColor("RED");
          embed.setDescription(data.reason);
        }
        embed.setTitle("Prefix Settings");
        embed.setDescription(`The current prefix is \`${data.prefix}\`\nTo edit this, type in \`b!prefix edit\``);
        embed.setColor("RANDOM");

        message.channel.send(embed);
      }
      else if(args[0].toLowerCase() === "edit") {
        if(!message.member.hasPermission('ADMINSTRATOR')) return message.channel.send('Sorry, but you do not have permission to use this command. You need to have the `Adminstrator` permission to do this')
        embed.setTitle("Prefix Configuration.");
        embed.setColor("RANDOM");
        embed.setDescription(`Please type what you would like to configure.`);
        embed.addField("prefix", "This configures the prefix for the bot in this server.");
        embed.addField("mentions", "Coming soon");

        message.channel.send(embed).then(() => {
          let filter = (m) => m.author.id === message.author.id && m.channel.id == message.channel.id;
          message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
          .then(async (collected) => {
            if(collected.first().content.toLowerCase() === "prefix"){
                let data = await db.getGuildSettings();
              message.channel.send("What would you like to change the prefix to?").then(() => {
                message.channel.awaitMessages(filter, {max: 1, time: 30000, error: ['time']})
                .then(async (collected) => {
                  let result = await db.editSettings({prefix: collected.first().content, mentions: data.mentions, dm: data.dm});
                  if(!result.success)
                    return message.channel.send(result.reason);
                  return message.channel.send(`Prefix changed to ${result.data.prefix}`);
                })
                .catch(async (_) => {
                  return message.channel.send("Session timed out.");
                })
              }).catch(async(_) => {
                return message.channel.send("Session timed out.");
              })
            }
            else if(collected.first().content.toLowerCase() === "mentions"){
                return message.channel.send('This feature is coming soon.');
              let data = await db.getGuildSettings();
              let mentions = data.mentions;
              if(mentions) mentions = false;
              else mentions = true;
              let result = await db.editSettings({prefix: data.prefix, mentions: mentions, dm: data.dm});
              if(!result.success)
                return message.channel.send(embed.setTitle('Error').setColor('RED').setDescription(result.reason));
                return message.channel.send(`Mentions are now ${mentions ? 'Enabled' : 'Disabled'}`);
            }
            else {
                return message.channel.send(`Sorry, but i don't know what ${collected.first().content} is. Exitting configurations.`);
            }
          })
        })
      }
    }
}
