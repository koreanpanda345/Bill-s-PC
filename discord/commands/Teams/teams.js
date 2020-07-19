const {MessageEmbed} = require("discord.js");
const Airtable = require('../../Airtable/index.js');
module.exports = {
  name: "teams",
  description: "Displays all of your teams.",
  category: "Teams",
  async execute(client, message, args) {
    let db = new Airtable({userId: message.author.id});
    let check = await db.teams.checkIfUserHasTeam();
    if(!check) return message.channel.send(`Sorry, but you do not have any teams yet.`);
    let teams = await db.teams.getUserTeams();
    let data = await db.teams.convertTeamsIntoArrays(teams);

        let str = "";
        for (let i = 0; i < data.names.length; i++) {
          str += `__**${i + 1}**__ - ${data.names[i]}\n`;
        }
        let teamEmbed = new MessageEmbed();
        teamEmbed.setColor("RANDOM");
        teamEmbed.setTitle(`${message.author.username}'s Teams`);
        teamEmbed.setDescription(str);
        message.channel.send(teamEmbed);
  }
};
