const Discord = require("discord.js");
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
module.exports = {
  name: "teams",
  description: "Displays all of your teams.",
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
        let teamNames = "";
        let teams = "";
        let _recordId = "";
        records.forEach(function(record) {
          _recordId = record.getId();
          teamNames = record.get("teamNames");
          teams = record.get("teams");
          for (let i = 0; i < teamNames.split(",").length; i++) {
            nameArr.push(teamNames.split(",")[i]);
          }
          for (let i = 0; i < teams.split(",").length; i++) {
            teamArr.push(teams.split(",")[i]);
          }
        });
        let str = "";
        for (let i = 0; i < nameArr.length; i++) {
          str += `${i + 1} - ${nameArr[i]}\n`;
        }
        let teamEmbed = new Discord.MessageEmbed();
        teamEmbed.setColor("RANDOM");
        teamEmbed.setTitle(`${message.author.username}'s teams'`);
        teamEmbed.setDescription(str);
        message.channel.send(teamEmbed);
      });
  }
};
