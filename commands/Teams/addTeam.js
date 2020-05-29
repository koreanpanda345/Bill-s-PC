const {MessageEmbed} = require('discord.js');
const Airtable = require('../../Airtable/index.js');
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
  async execute(client, message, args) {
    let db = new Airtable({userId: message.author.id});
    let teamData = {};
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
          teamData.team_name = _return.title;
          teamData.team_paste = _return.team;
          teamData.team_send = "public";
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
      if (!arglist && arglist.length < 2)
        return message.channel.send(
          "Please try again, but provide the command with your team name, and your team in text form with ',' between the team name and your team.example: `b!addTeam Best Bunny, Bun Bun (Lopunny) @ Lopunnite\nAbility: Limber\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Fake Out\n- Ice Punch\n- Return\n- High Jump Kick`"
        );
        teamData.team_name = arglist[0];
        teamData.team_paste = arglist[1];
        teamData.team_send = arglist[2] || "public";
  }
  let result = await db.teams.addTeam(teamData);
  if(!result) return message.channel.send(`Something happened`);
  let embed = new MessageEmbed()
  .setTitle(`Added ${teamData.team_name} to the PC.`)
  .setColor(`RANDOM`);

  message.channel.send(embed).then((msg) => {
    message.delete();
    msg.delete({timeout: 10000});
  });
  }
}
