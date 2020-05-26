const Discord = require("discord.js");
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
const fetch = require('node-fetch');
var TinyURL = require('tinyurl');
 
module.exports = {
  name: "pasteteam",
  aliases: ["pt"],
  args: "<team id>",
  description: "pastes your team to pokepaste.",
  category: "Teams",
  usage: "b!getteam 1",
  execute(client, message, args) {
      if(!args[0]){
        let embed = new Discord.MessageEmbed()
        .setTitle("Untitled")
        .setDescription('Please enter the name of your team paste.');
        message.channel.send(embed).then(msg => {
            let _title = "";
            let filter = (m) => m.author.id === message.author.id; 
            let title = message.channel.createMessageCollector(filter, {time: 600000, max: 1});
            title.on('collect',(m) => {
                _title = m.content;
                embed.setTitle(m.content);
                embed.setDescription('Enter your team paste.');
                msg.edit(embed);
                m.delete();
                let team = message.channel.createMessageCollector(filter, {time: 600000, max: 1});

                team.on('collect', (m) => {
                    
                    let _url = encodeURI('title=' + _title + "&paste=" + m.content + "&author=" + message.author.username);
                    m.delete();
                    console.log(_url);
          let embed = new Discord.MessageEmbed();
          _url = _url.replace(/:/g, '%3A');
          _url = _url.replace(/%20/g, '+');
          _url = _url.replace(/\n/g, '%0A');
          _url = _url.replace(/%0A/g, '%0D%0A');
          _url = 'https://pokepast.es/create?' + _url
          TinyURL.shorten(_url, function(res, err) {
              if (err)
                  console.log(err)
              console.log(res);
              embed.setURL(res);
              embed.setTitle(`Paste for ${_title}`);
              
              msg.edit(embed);
          });
                })
            })
        })
      }
      else{
        base("Teams")
        .select({
          filterByFormula: `{userId} = ${message.author.id}`
        })
        .eachPage(function page(records, fetchNextPage) {
          if (!records.length)
            return message.channel.send(
              "You do not have any teams stored yet. please use the `b!addteam` command"
            );
          let nameArr = [];
          let teamArr = [];
          let sendArr = [];
          let teamNames = "";
          let teams = "";
          let visible = "";
          records.forEach(function(record) {
            teamNames = record.get("teamNames");
            teams = record.get("teams");
            visible = record.get("visibility");
            for (let i = 0; i < teamNames.split(",").length; i++) {
              nameArr.push(teamNames.split(",")[i]);
            }
            for (let i = 0; i < teams.split(",").length; i++) {
              teamArr.push(teams.split(",")[i]);
            }
            for (let i = 0; i < visible.split(",").length; i++) {
              sendArr.push(visible.split(",")[i]);
            }
          });
          let _url = encodeURI('title=' + nameArr[args[0] - 1] + "&paste=" + teamArr[args[0] - 1] + "&author=" + message.author.username);
          console.log(_url);
          let embed = new Discord.MessageEmbed();
          _url = _url.replace(/:/g, '%3A');
          _url = _url.replace(/%20/g, '+');
          _url = _url.replace(/\n/g, '%0A');
          _url = _url.replace(/%0A/g, '%0D%0A');
          _url = 'https://pokepast.es/create?' + _url
          TinyURL.shorten(_url, function(res, err) {
              if (err)
                  console.log(err)
              console.log(res);
              embed.setURL(res);
              embed.setTitle(`Paste for${nameArr[args[0] - 1]}`);
              
              message.channel.send(embed).then(msg => {
                  msg.delete({timeout: 600000})
              })
          });
      });
      }
      }
};
