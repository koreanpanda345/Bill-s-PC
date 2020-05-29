const {MessageEmbed} = require('discord.js');
const Airtable = require('../../Airtable/index.js');

module.exports = {
  name: "delteam",
  aliases: ["dt"],
  hasArgs: true,
  args: "<team id>",
  description: "Deletes a team from your 'PC'",
  category: "Teams",
  usage: "b!delteam 1",
  async execute(client, message, args) {
    let embed = new MessageEmbed();
    const db = new Airtable({userId: message.author.id});
    let data = await db.teams.deleteTeam(args[0]);
    if(!data.success){
      embed.setColor("red");
      embed.setTitle("Error");
      embed.setDescription(data.reason);
      return message.channel.send(embed).then((msg) => {
        message.delete();
        msg.delete({timeout: 10000});
      });
    }
    embed.setColor("RANDOM");
    embed.setTitle(`Deleted a Team`);
    embed.setDescription(`Deleted ${data.old_name} from the pc.`);

    message.channel.send(embed).then((msg) => {
      message.delete();
      msg.delete({timeout: 10000});
    });
  }
};
