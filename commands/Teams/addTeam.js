const Discord = require("discord.js");
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
const PokePaste = require('../../Util/PokePaste');
const fetch = require('node-fetch');
const htmlToArticleJson = require('@mattersmedia/html-to-article-json')();
module.exports = {
  name: "addteam",
  aliases: ["at"],
  hasArgs: true,
  args: "<team name>,<team>,(dm/public)",
  description: "Allows you to add a team to the PC.",
  category: "Teams",
  usage: "`b!addTeam Best Bunny, Bun Bun (Lopunny) @ Lopunnite\nAbility: Limber\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Fake Out\n- Ice Punch\n- Return\n- High Jump Kick,dm`",
  execute(client, message, args) {
    if(args[0].includes("https://pokepast.es")){
      let _return = {  };
      let team = "";
      let url = args[0];
      fetch(url)
      .then(res => res.text())
      .catch(error => console.error(error))
      .then(body => {
          let html = body;
          const json = htmlToArticleJson(html);
  
          for(let i = 0; i < json.length; i++){
              if(json[i].type === "paragraph"){
                  
                  let content = json[i].children[0].content;
                  content = content.replace(/Ability:+/g, "<>Ability:");
                  content = content.replace(/EVs:+/g, "<>EVs:");
                  content = content.replace(/IVs:+/g, "<>IVs:");
                  content = content.replace(/(- )+/g, "<>- ");
                  team += content + "\n\n";
              }
          }
          _return.title = json[json.length - 3].children[0].content;
  
          _return.team = team.replace(/<>+/g, "\n");
          _return.team = _return.team.replace("Columns Mode / Stat Colours / Light Mode", "");
          let obj = _return;
      base(`Teams`).select({
        filterByFormula: `{userId}=${message.author.id}`
      }).eachPage((records, _) => {
        if(!records.length){
          return base("Teams").create(
            [
              {
                fields: {
                  userId: message.author.id,
                  teamNames: obj.title,
                  teams: obj.team,
                  visibility: "public"
                }
              }
            ],
            function(err, record) {
              if (err) console.error(err);
              message.channel.send(`Just added ${obj.title} to your 'PC'`);
              return console.log("Created");
      });
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
  
          base("Teams").update(
            [
              {
                id: _recordId,
                fields: {
                  teamNames: teamNames + "," + obj.title,
                  teams: teams + "," + obj.team,
                  visibility: visbily + "," + "public"
                }
              }
            ],
            function(err, record) {
              if (err) console.error(err);
              message.channel
                .send(`Just added ${obj.title} to your 'PC'`)
                .then(msg => {
                  message.delete();
                  //msg.delete(6000);
                });
              console.log("updated");
            });
  });
})
      });
    }
    else{
      let str = args.join(" ");
      let arglist = str.split(",");
      let count = arglist.length;
      for(let i = 0; i < count; i++){
        if(arglist[i].startsWith(" ")){
          let _str = arglist[i].replace(" ", "");
          arglist[i] = _str;
        }
      }
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
             return base("Teams").create(
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
      }
};
