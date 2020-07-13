const Airtable = require("../../Airtable/index.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "deletedraft",
    aliases: "dd",
    category: "Draft",
    description: "Deletes a draft using the draft id.",
    async execute(client, message, args){
      let db = new Airtable({userId: message.author.id});
      let embed = new MessageEmbed();
      let data = await db.draft.deleteDraftPlan(args[0]);
      if(!data.success){
        embed.setTitle('Error');
        embed.setColor('RED');
        embed.setDescription(data.reason);

        return message.channel.send(embed).then((msg) => {
          message.delete();
          msg.delete({timeout: 10000});
        });
      }

      embed.setTitle(`Deleted a draft.`);
      embed.setColor('RANDOM');
      embed.setDescription(`I Deleted ${data.old_draft} from the PC.`);

      message.channel.send(embed).then((msg) => {
        message.delete();
        msg.delete({timeout: 10000});
      })
    }
}