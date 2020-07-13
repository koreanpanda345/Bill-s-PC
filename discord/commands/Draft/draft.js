const Airtable = require("../../Airtable/index.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "draft",
    description: "displays the list of drafts you made.",
    category: "Draft",
    async execute(client, message, args){
      if(args[0]){
        switch(args[0]){
          case "add":
            args.shift();
            require("./draftadd.js").execute(client, message, args);
          break;
          case "view":
          args.shift();
          require('./draftplans.js').execute(client, message, args);
          break;
          case "edit":
          args.shift();
          require("./draftedit.js").execute(client, message, args);
          break;
          case "delete":
          args.shift();
          require("./draftdelete.js").execute(client, message, args);
          break;
          default:
          require('./draftplans.js').execute(client, message, args);
          break;
        }
        return;
      }
      let embed = new MessageEmbed();
      let db = new Airtable({userId: message.author.id});
      let check = await db.draft.checkIfUserHasDraft
      if(!check){
        embed.setTitle('Error');
        embed.setColor('red');
        embed.setDescription('Sorry, but you do not have any drafts made yet.');

        return message.channel.send(embed).then(msg => {
          message.delete();
          msg.delete({timeout: 10000});
        })
      }
      let data = await db.draft.getUserDrafts();
      let arr = await db.draft.convertDraftsIntoArray(data);
      embed.setTitle(`${message.author.username}'s Drafts`);    
      embed.setColor('RANDOM');

          let desc = "";

          for (let i = 0; i < arr.names.length; i++) {
            if (arr.names[i] !== "")
              desc += `__**${i + 1}:**__ ${arr.names[i]}\n`;
          }
          embed.setDescription(desc);
          message.channel.send(embed);
        
    }
}