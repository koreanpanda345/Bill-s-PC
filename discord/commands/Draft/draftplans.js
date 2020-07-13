const { MessageEmbed } = require("discord.js");
const Airtable = require('../../Airtable/index.js');
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const endpoint_sprites = process.env.SDSPRITES_ENDPOINT;
const fetch = require("node-fetch");
const typeColor = require('./../../Util/TypeColor');
module.exports = {
  name: "viewdraft",
  aliases: ["vd"],
  category: "Draft",
  description: "Allows you to view your draft.",
  usage: "b!viewdraft <draft id>",
  async execute(client, message, args) {
          let db = new Airtable({userId: message.author.id});
          let data = await db.draft.getDraftPlan(args[0]);
          let embed = new MessageEmbed();
          if(!data.success){
            embed.setTitle('Error');
            embed.setColor('red');
            embed.setDescription(data.reason);

            return message.channel.send(embed).then((msg) => {
              message.delete();
              msg.delete({timeout: 10000});
            })
          }
          embed.setColor('RANDOM');
          embed.setTitle(`Draft Plan: ${data.name}`);
          embed.setDescription(`Draft Type: ${data.type}`);
          embed.addField("\u200b", "\u200b");
          let page = 0;
          let pages = [];
          let tiers = [];
          for (let i = 0; i < data.plan.split("<>").length; i++) {
            let field = data.plan.split("<>");

            let name = field[i].split("</>")[0];
            let value = field[i].split("</>")[1];
            if(value !== undefined)
            pages.push(value.split("Type")[0].toLowerCase().replace(/ +/g, "").replace(/\n+/g, ""));
            tiers.push(name.split(": ")[1]);
          }

          message.member.send(embed).then((msg) => {
            msg.react("◀️").then(r => {
              msg.react("❎").then(r => {
                msg.react("▶️");
              
                let forwardsFilter = (reaction, user) => reaction.emoji.name === "▶️" && user.id === message.author.id;
                let backwardsFilter = (reaction, user) => reaction.emoji.name === "◀️" && user.id === message.author.id;             
                let clearFilter = (reaction, user) => reaction.emoji.name === "❎" && user.id === message.author.id;
                let backwards = msg.createReactionCollector(backwardsFilter, {time: 100000});
                let clear = msg.createReactionCollector(clearFilter, {time: 100000});
                let forwards = msg.createReactionCollector(forwardsFilter, {time: 100000});
                clear.on("collect", () => {
                  msg.delete();
                })
                backwards.on("collect", async () => {
                  if(page === 0) return;
                  page--;
                  fetch(`${endpoint_dex}`)
                  .then(res => res.text())
                  .catch(error => console.error(error))
                  .then(async body => {
                    let res = eval(body);
                    let search = pages[page - 1].replace(/\\n+/g, "");
                    if(search.toLowerCase().includes("-dusk")){
                      let temp = search.replace(/-dusk+/g, "dusk");
                      search = temp;
                    }
                    if(search.toLowerCase().includes("-mega")){
                      let temp = search.replace(/-mega+/g, "mega");
                      search = temp;
                    }
                    let poke = res[search];
                    if(poke === undefined){
                      embed.setTitle(`${tiers[page - 1]}: ---`);
                      embed.setDescription(`No Pokemon.`);
                      embed.setColor(typeColor["???"][random(typeColor["???"].length)]);
                      embed.setImage("");
                      msg.edit(embed);
                      return;
                    }
                    let abilities;
                    let ab = Object.values(poke.abilities);
                    for(let i = 0; i < ab.length; i++){
                      abilities += `${ab[i]}\n`;
                    }
                    embed.setTitle(`${tiers[page - 1]}: ${poke.name}`);
                    embed.setColor(typeColor[poke.types[0]][random(typeColor[poke.types[0]].length)]);
                    embed.setDescription(`
                    Types: ${poke.types.length === 2 ? `${poke.types[0]} ${poke.types[1]}` : `${poke.types[0]}`}
                    \nAbilities: \n${abilities.replace(`undefined`, '')}\nBase Stats:
                    **__HP__: ${poke.baseStats.hp}
                    __ATK__: ${poke.baseStats.atk}
                    __DEF__: ${poke.baseStats.def}
                    __SPA__: ${poke.baseStats.spa}
                    __SPD__: ${poke.baseStats.spd}
                    __SPE__: ${poke.baseStats.spe}**`);
                    let sprite = `${endpoint_sprites}${poke.name.toLowerCase()}.gif`;
                    embed.setImage(sprite);
                    msg.edit(embed);
                });
                  
                });
                forwards.on("collect", () => {
                if(page === pages.length) return;
                page++;
                fetch(`${endpoint_dex}`)
                .then(res => res.text())
                .catch(error => console.error(error))
                .then(async body => {
                  let res = eval(body);
                  let search = pages[page - 1].replace(/\\n+/g, "");
                  if(search.toLowerCase().includes("-dusk")){
                    let temp = search.replace(/-dusk+/g, "dusk");
                    search = temp;
                  }
                  if(search.toLowerCase().includes("-mega")){
                    let temp = search.replace(/-mega+/g, "mega");
                    search = temp;
                  }
                  let poke = res[search];
                  if(poke === undefined){
                    embed.setTitle(`${tiers[page - 1]}: ---`);
                    embed.setDescription(`No Pokemon.`);
                    embed.setImage("");
                    embed.setColor(typeColor["???"][random(typeColor["???"].length)]);
                    msg.edit(embed);
                    const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                    try{
                        for(const reaction of userReactions.values()){
                            await reaction.users.remove(message.author.id);
                    }
                  }
                    catch(error){
                      console.error(error);
                }
                    return;
                  }
                  let abilities;
                  let ab = Object.values(poke.abilities);
                  for(let i = 0; i < ab.length; i++){
                    abilities += `${ab[i]}\n`;
                  }
                  embed.setTitle(`${tiers[page - 1]}: ${poke.name}`);
                  embed.setColor(typeColor[poke.types[0]][random(typeColor[poke.types[0]].length)]);
                  embed.setDescription(`
                  Types: ${poke.types.length === 2 ? `${poke.types[0]} ${poke.types[1]}` : `${poke.types[0]}`}
                  \nAbilities: \n${abilities.replace(`undefined`, '')}\nBase Stats:
                  **__HP__: ${poke.baseStats.hp}
                  __ATK__: ${poke.baseStats.atk}
                  __DEF__: ${poke.baseStats.def}
                  __SPA__: ${poke.baseStats.spa}
                  __SPD__: ${poke.baseStats.spd}
                  __SPE__: ${poke.baseStats.spe}**`);
                  let sprite = `${endpoint_sprites}${poke.name.toLowerCase()}.gif`;
                  embed.setImage(sprite);
                  msg.edit(embed);
              });
              })
          })
            })
          })

  },
};

function random(max){
  return Math.floor(Math.random() * max);
}
