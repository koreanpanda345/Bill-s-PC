const Discord = require("discord.js");
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base("app1XZLzoO93xWEDN");

module.exports = {
  name: "getteam",
  aliases: ["gt"],
  hasArgs: true,
  args: "<team id>",
  description: "Gets a team with the team's id",
  category: "Teams",
  execute(client, message, args) {
    base("Teams")
      .select({
        filterByFormula: `{userId} = ${message.author.id}`
      })
      .eachPage(function page(records, fetchNextPage) {
        if (!records.length)
          return message.channel.send(
            "You do not have any teams stored yet. please use the `b!addteam` command"
          );
        let nameArr = [];
        let teamArr = [];
        let sendArr = [];
        let teamNames = "";
        let teams = "";
        let _recordId = "";
        let visible = "";
        records.forEach(function(record) {
          _recordId = record.getId();
          teamNames = record.get("teamNames");
          teams = record.get("teams");
          visible = record.get("visibility");
          for (let i = 0; i < teamNames.split(",").length; i++) {
            nameArr.push(teamNames.split(",")[i]);
          }
          for (let i = 0; i < teams.split(",").length; i++) {
            teamArr.push(teams.split(",")[i]);
          }
          for (let i = 0; i < visible.split(",").length; i++) {
            sendArr.push(visible.split(",")[i]);
          }
        });
        let embed = new Discord.RichEmbed();
        embed.setColor("RANDOM");
        embed.setTitle(`${nameArr[args[0] - 1]}`);
        embed.setDescription(`${teamArr[args[0] - 1]}`);
        if (sendArr[args[0] - 1] === "dm")
          message.author.send(embed).then(msg => {
            message.delete();
            msg.react("⏏️").then(r => {
              msg.react("❎");
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

              msg.delete(60000);
              _import.on("collect", r => {
                let str = `***${nameArr[args[0] - 1]}***\n\`\`\`${
                  teamArr[args[0] - 1]
                }\`\`\``;
                msg.delete();
                message.author.send(str).then(msg => {
                  msg.delete(60000);
                });
                _close.on("collect", r => {
                  msg.delete();
                });
              });
            });
          });
        if (sendArr[args[0] - 1] === "public")
          message.channel.send(embed).then(msg => {
            message.delete();
            msg.react("⏏️").then(r => {
              msg.react("❎");
              msg.delete(60000);
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
                let str = `***${nameArr[args[0] - 1]}***\n\`\`\`${
                  teamArr[args[0] - 1]
                }\`\`\``;
                msg.delete();
                message.channel.send(str).then(msg => {
                  msg.delete(60000);
                });
              });
              _close.on("collect", r => {
                msg.delete();
              });
            });
          });
      });
  }
};
