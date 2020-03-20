const Discord = require("discord.js");
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
module.exports = {
  name: "addteam",
  aliases: ["at"],
  hasArgs: true,
  args: "<team name>,<team>,(dm/public)",
  description: "Allows you to add a team to the PC.",
  category: "Teams",
  usage: "`b!addTeam Best Bunny, Bun Bun (Lopunny) @ Lopunnite\nAbility: Limber\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Fake Out\n- Ice Punch\n- Return\n- High Jump Kick,dm`",
  execute(client, message, args) {
    let str = args.join(" ");
    let arglist = str.split(",");
    if (!arglist)
      return message.channel.send(
        "Please try again, but provide the command with your team name, and your team in text form with ',' between the team name and your team.example: `b!addTeam Best Bunny, Bun Bun (Lopunny) @ Lopunnite\nAbility: Limber\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Fake Out\n- Ice Punch\n- Return\n- High Jump Kick`"
      );
    base("Teams")
      .select({
        filterByFormula: `{userId}=${message.author.id}`
      })
      .eachPage(function page(records, fetchNextPage) {
        if (!records.length) {
          base("Teams").create(
            [
              {
                fields: {
                  userId: message.author.id,
                  teamNames: arglist[0],
                  teams: arglist[1],
                  visibility: arglist[2]
                }
              }
            ],
            function(err, record) {
              if (err) console.error(err);
              message.channel.send(`Just added ${arglist[0]} to your 'PC'`);
              return console.log("Created");
            }
          );
        }
        let nameArr = [];
        let teamArr = [];
        let teamNames = "";
        let teams = "";
        let _recordId = "";
        let visbily = "";
        records.forEach(function(record) {
          _recordId = record.getId();
          teamNames = record.get("teamNames");
          teams = record.get("teams");
          visbily = record.get("visibility");
          for (let i = 0; i < teamNames.split(",").length; i++) {
            nameArr.push(teamNames.split(",")[i]);
          }
          for (let i = 0; i < teams.split(",").length; i++) {
            teamArr.push(teams.split(",")[i]);
          }

          if (!arglist[2]) arglist[2] = "public";
          if (!arglist[2] == "dm" || !arglist == "public")
            arglist[2] = "public";
        });
        base("Teams").update(
          [
            {
              id: _recordId,
              fields: {
                teamNames: teamNames + "," + arglist[0],
                teams: teams + "," + arglist[1],
                visibility: visbily + "," + arglist[2]
              }
            }
          ],
          function(err, record) {
            if (err) console.error(err);
            message.channel
              .send(`Just added ${arglist[0]} to your 'PC'`)
              .then(msg => {
                message.delete();
                msg.delete(6000);
              });
            console.log("updated");
          }
        );
      });
  }
};
