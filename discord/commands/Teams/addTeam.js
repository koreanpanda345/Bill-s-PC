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
    let pokepaste = new PokePaste();
    let teamData = {};
    if(args[0].includes("https://pokepast.es")){
      let _return = {  };
      let team = "";
      let url = args[0];
      let data = await pokepaste.import(url);
      console.log(data);
      if(!data.success) return;
      teamData.team_name = data.team_name;
      teamData.team_paste = data.team_paste;
      teamData.team_send = data.team_send;
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
