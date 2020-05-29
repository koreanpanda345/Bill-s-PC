const {MessageEmbed} = require('discord.js');
const Airtable = require('../../Airtable/index.js');
const PokePaste = require('../../Util/PokePaste.js');
module.exports = {
  name: "pasteteam",
  aliases: ["pt"],
  args: "<team id>",
  description: "pastes your team to pokepaste.",
  category: "Teams",
  usage: "b!pasteteam 1",
  async execute(client, message, args) {
    let db = new Airtable({userId: message.author.id});
    let pokePaste = new PokePaste();  
    if(!args[0]){
        let embed = new MessageEmbed()
        .setTitle("Untitled")
        .setDescription('Please enter the name of your team paste.');
        message.channel.send(embed).then(async msg => {
            let _title = "";
            let filter = (m) => m.author.id === message.author.id; 
            let title = message.channel.createMessageCollector(filter, {time: 600000, max: 1});
            title.on('collect', async (m) => {
                _title = m.content;
                embed.setTitle(m.content);
                embed.setDescription('Enter your team paste.');
                msg.edit(embed);
                m.delete();
                let team = message.channel.createMessageCollector(filter, {time: 600000, max: 1});

                team.on('collect', async (m) => {
                  let data = await pokePaste.export({title: _title, paste: m.content, author: message.author.username});
                  if(!data.success){
                    embed.setTitle('Error')
                    embed.setColor('red');
                    embed.setDescription(data.reason);
                    return msg.edit(embed).then((_msg) => {
                      message.delete();
                      msg.delete({timeout: 10000});
                    });
                  }
                  embed.setTitle(`PokePaste for ${_title}`);
                  embed.setURL(data.url);
                  msg.edit(embed).then((_msg) => {
                    message.delete();
                  })
                })
            })
        })
      }
      else{
        let embed = new MessageEmbed();
        let data = await db.teams.getTeam(args[0]);
        if(!data.success){
          embed.setTitle('Error');
          embed.setColor('red');
          embed.setDescription(data.reason);
          return message.channel.send(embed).then((msg) => {
            message.delete();
            msg.delete({timeout: 10000});
          });
        }
        let result = await pokePaste.export({title: data.team.name, paste: data.team.paste, author: message.author.username});
        if(!result.success){
          embed.setTitle('Error');
          embed.setColor('red');
          embed.setDescription(result.reason);
          return message.channel.send(embed).then((msg) => {
            message.delete();
            msg.delete({timeout: 10000});
          });
        }
        embed.setTitle(`PokePaste for ${data.team.name}`);
        embed.setColor('RANDOM');
        embed.setURL(result.url);

        message.channel.send(embed).then((msg) => {
          message.delete();
        })
      }
      }
};
