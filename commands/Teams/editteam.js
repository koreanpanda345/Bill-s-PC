const Discord = require("discord.js");
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
module.exports = {
  name: "editteam",
  aliases: ["et"],
  hasArgs: true,
  args: "<team id>,<updated team>",
  description: "Allows you to update a team that is in the 'PC'",
  category: "Teams",
  usage: "b!editTeam 1, Bun Bun (Lopunny) @ Lopunnite\nAbility: Limber\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Fake Out\n- Ice Punch\n- Return\n- High Jump Kick`",
  execute(client, message, args) {
    let str = args.join(" ");
    let _arglist = str.split(",");
    let count = _arglist.length;
    for(let i = 0; i < count; i++){
      if(_arglist[i].startsWith(" ")){
        let _str = _arglist[i].replace(" ", "");
        _arglist[i] = _str;
      }
    }
    console.log(_arglist);
    if (!_arglist)
      return message.channel.send(
        "Please try again, but provide the command with your team's id, and your team in text form with ',' between the team name and your team.example: `b!editTeam 1, Bun Bun (Lopunny) @ Lopunnite\nAbility: Limber\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Fake Out\n- Ice Punch\n- Return\n- High Jump Kick`"
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
                  teamNames: _arglist[0],
                  teams: _arglist[1]
                }
              }
            ],
            function(err, record) {
              if (err) console.error(err);
              message.channel.send(`Just edited ${_arglist[0]} to your 'PC'`);
              return console.log("Created");
            }
          );
        }
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
        teamArr[_arglist[0] - 1] = _arglist[1];
        base("Teams").update(
          [
            {
              id: _recordId,
              fields: {
                teams: teamArr.toString()
              }
            }
          ],
          function(err, record) {
            if (err) console.error(err);
            message.channel
              .send(`Just edited ${nameArr[_arglist[0] - 1]} to your 'PC'`)
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
