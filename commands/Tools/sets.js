const Discord = require("discord.js");
const fetch = require("node-fetch");
const endpoint = process.env.SDDATA_ENDPOINT;
module.exports = {
  name: "sets",
  aliases: ["set"],
  hasArgs: true,
  args: "<gen number>, <format>, <pokemon>",
  description: "Gets sets from smogon",
  category: "Tools",
  usage: "b!sets 7,ou,lopunny",
  execute(client, message, args) {
    let str = args.join(" ");
    let rep = str.replace(/ +/g, "");
    let arglist = rep.split(",");
    let gen = arglist[0];
    let format = arglist[1];
    let name = "";
    let _set = "";
    if(arglist[2].toLowerCase().includes("mega")){
      let _str= arglist[2].toLowerCase().replace("mega", "");
      let lower = _str.toLowerCase();
      name = lower.charAt(0).toUpperCase() + lower.slice(1);
     name += "-Mega";
    }
    else {
      let lower = arglist[2].toLowerCase();
      name = lower.charAt(0).toUpperCase() + lower.slice(1);
    }
   
    if (format.toLowerCase() === "natdex") format = "nationaldex";
    else if (format.toLowerCase() === "natdexag") format = "nationaldexag";
    let json;
    fetch(`${endpoint}gen${gen}${format}.json`)
      .then(res => res.text())
      .catch(error => {return console.log(error)})
      .then(body => {
        let str = body;
        let js = str.replace("smogon.com/stats", "smogon");
        js = js.replace("smogon.com/dex", "smogon");
        json = JSON.parse(js);
        let embed = new Discord.MessageEmbed();
        let setArr = [];
        //console.log(json);
        //console.log(name);
        if (json.smogon[`${name}`] === undefined)
          return message.channel.send(
            `It looks like Smogon doesn't have a set for this pokemon in this format.`
          );
        Object.keys(json.smogon[`${name}`]).forEach(function(keys) {
          console.log(keys);
          setArr.push(keys);
        });
        for (let i = 0; i < setArr.length; i++) {
          let set = json.smogon[`${name}`][setArr[i]];
          let evs = `${set.evs.hp !== undefined ? ` ${set.evs.hp} HP/` : ``}${
            set.evs.atk !== undefined ? ` ${set.evs.atk} Atk/` : ``
          }${set.evs.def !== undefined ? ` ${set.evs.def} Def/` : ``}${
            set.evs.spa !== undefined ? ` ${set.evs.spa} SpA/` : ``
          }${set.evs.spd !== undefined ? ` ${set.evs.spd} SpD/` : ``}${
            set.evs.spe !== undefined ? ` ${set.evs.spe} Spe/` : ``
          }`;
          let ivs;
          embed.setTitle(`Gen ${gen} ${format} set for ${name}`);
          if (set.ivs !== undefined)
            ivs = `${set.ivs.hp !== undefined ? ` ${set.ivs.hp} HP/` : ``}${
              set.ivs.atk !== undefined ? ` ${set.ivs.atk} Atk/` : ``
            }${set.ivs.def !== undefined ? ` ${set.ivs.def} Def/` : ``}${
              set.ivs.spa !== undefined ? ` ${set.ivs.spa} SpA/` : ``
            }${set.ivs.spd !== undefined ? ` ${set.ivs.spd} SpD/` : ``}${
              set.ivs.spe !== undefined ? ` ${set.evs.spe} Spe/` : ``
            }`;
            _set =  `\`\`\`${name} @ ${set.item}\nAbility: ${set.ability}\nEvs:${evs.substr(0, evs.length - 1)}${set.ivs === undefined ? `` : `\n${ivs.substr(0, ivs.length - 1)}`}\n${set.nature} Nature\n- ${set.moves[0]}\n- ${set.moves[1]}\n- ${set.moves[2]}\n- ${set.moves[3]}\`\`\``
          embed.addField(
            `${setArr[i]}`,
           _set
          );
        }
        embed.setColor("RANDOM");
        embed.setFooter(`Set(s) are from smogon.com`);
        message.channel.send(embed).then(msg => {
          message.delete();
          msg.react("⏏️").then(r => {
            msg.react("❎");
            msg.delete({timeout: 600000});
            const importFilter = (reaction, user) =>
                reaction.emoji.name === "⏏️" && user.id === message.author.id;
              const _import = msg.createReactionCollector(importFilter, {
                time: 600000
              });
              const closeFilter = (reaction, user) =>
                reaction.emoji.name === "❎" && user.id === message.author.id;
              const _close = msg.createReactionCollector(closeFilter, {
                time: 600000
              });

              _import.on('collect', r => {
                let str = `***Import for ${name}***${_set}`;
                msg.delete();
                message.channel.send(str).then(msg => {
                  msg.delete({timeout: 600000});
                })
              })
              _close.on("collect", r => {
                msg.delete();
              })
          })
        })
      });
  }
};
