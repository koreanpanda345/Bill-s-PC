const Discord = require("discord.js");
const Airtable = require('../../Airtable/index.js');
const { TypeCoverage } = require('../../Util/TeamFunctions');
module.exports = {
  name: "getteam",
  aliases: ["gt"],
  hasArgs: true,
  args: "<team id>",
  description: "Gets a team with the team's id",
  category: "Teams",
  usage: "b!getteam 1",
  async execute(client, message, args) {
    let embed = new Discord.MessageEmbed();
    let db = new Airtable({userId: message.author.id});
    let team = await db.teams.getTeam(args[0]);
    if(!team.success){
      embed.setTitle('Error');
      embed.setColor('red');
      embed.setDescription(team.reason);
      return message.channel.send(embed).then((msg) => {
        message.delete();
        msg.delete({timeout: 10000});
      })
    }

        embed.setColor("RANDOM");
        embed.setTitle(`${team.team.name}`);
        embed.setDescription(`${team.team.paste}`);
        if (team.team.team_send === "dm")
          message.author.send(embed).then(msg => {
            message.delete();
            msg.react("⏏️").then(r => {
              const importFilter = (reaction, user) =>
                reaction.emoji.name === "⏏️" && user.id === message.author.id;
              const _import = msg.createReactionCollector(importFilter, {
                time: 600000
              });

              msg.delete({timeout: 60000});
              _import.on("collect", r => {
                let str = `***${team.team.name}***\n\`\`\`${
                  team.team.paste
                }\`\`\``;
                msg.delete();
                message.author.send(str).then(msg => {
                  msg.delete({timeout: 60000});
                });
              });
            });
          });
        if (team.team.send === "public")
          message.channel.send(embed).then(msg => {
            message.delete();
            msg.react("⏏️").then(r => {
              msg.react("❎");
              msg.delete({timeout: 60000});
              const importFilter = (reaction, user) =>
                reaction.emoji.name === "⏏️" && user.id === message.author.id;
              const _import = msg.createReactionCollector(importFilter, {
                time: 600000
              });
              const closeFilter = (reaction, user) =>
                reaction.emoji.name === "❎" && user.id === message.author.id;
              const _close = msg.createReactionCollector(closeFilter, {
                time: 600000
              });

              _import.on("collect", r => {
                let str = `***${team.team.name}***\n\`\`\`${
                  team.team.paste
                }\`\`\``;
                msg.delete();
                message.channel.send(str).then(msg => {
                  msg.delete({timeout: 60000});
                });
              });
              _close.on("collect", r => {
                msg.delete();
              });
            });
          });
  }
}
