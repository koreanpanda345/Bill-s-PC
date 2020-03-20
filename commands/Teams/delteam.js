const Discord = require("discord.js");
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
module.exports = {
  name: "delteam",
  aliases: ["dt"],
  hasArgs: true,
  args: "<team id>",
  description: "Deletes a team from your 'PC'",
  category: "Teams",
  usage: "b!delteam 1",
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
        let oldName = nameArr[args[0] - 1];
        nameArr.splice(args[0] - 1, args[0] - 1);
        teamArr.splice(args[0] - 1, args[0] - 1);
        base("Teams").update(
          [
            {
              id: _recordId,
              fields: {
                teamNames: nameArr.toString(),
                teams: teamArr.toString()
              }
            }
          ],
          function(err, record) {
            if (err) console.error(err);
            return message.channel.send(`Deleted team ${oldName}`);
          }
        );
      });
  }
};
