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
  execute(client, message, args) {
    let str = args.join(" ");
    let arglist = str.includes(", ") ? str.split(", ") : str.split(",");
    let gen = arglist[0];
    let format = arglist[1];
    let poke = arglist[2].replace(" ", "");
    let lower = poke;
    const name = lower.charAt(0).toUpperCase() + lower.slice(1);
    if (format.toLowerCase() === "natdex") format = "nationaldex";
    else if (format.toLowerCase() === "natdex ag") format = "nationaldexag";
    let json;
    fetch(`${endpoint}gen${gen}${format}.json`)
      .then(res => res.text())
      .then(body => {
        let str = body;
        let js = str.replace("smogon.com/stats", "smogon");
        js = js.replace("smogon.com/dex", "smogon");
        json = JSON.parse(js);
        let embed = new Discord.RichEmbed();
        let setArr = [];
        //console.log(json);
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
          embed.addField(
            `${setArr[i]}`,
            `\`\`\`
${name} @ ${set.item}
Ability: ${set.ability}
Evs:${evs.substr(0, evs.length - 1)}${
              set.ivs === undefined ? `` : `\n${ivs.substr(0, ivs.length - 1)}`
            }
${set.nature} Nature
- ${set.moves[0]}
- ${set.moves[1]}
- ${set.moves[2]}
- ${set.moves[3]}\`\`\``
          );
        }
        embed.setColor("RANDOM");
        embed.setFooter(`Set(s) are from smogon.com`);
        message.channel.send(embed);
      });
  }
};
