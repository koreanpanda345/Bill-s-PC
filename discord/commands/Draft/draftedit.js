const Airtable = require("../../Airtable/index.js");
const { MessageEmbed } = require("discord.js");
const Ps = require('../../Util/PokemonShowdown');
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const fetch = require("node-fetch");
const {sendDm} = require('../../Util/SettingsFunction');
const { checkIFPokemonHasPivotMoves, checkIfPokemonHasClericMoves, checkIfPokemonHasHazardsMoves, checkIfPokemonHasHazardRemovalMoves } = require('../../Util/DraftFunction');
module.exports = {
    name: "editdraft",
    aliases: ['ed'],
    description: "Allows you to edit a draft.",
    usage: "b!editdraft <draft id>",
    category: "Draft",
    async execute(client, message, args){
      let ps = new Ps();
      let db = new Airtable({userId: message.author.id});
        let num = Number(args[0]);
        let getData = await db.draft.getDraftPlan(num);  
        let embed = new MessageEmbed();
          embed.setColor('RANDOM');
          embed.setTitle(getData.name);
          embed.setDescription(getData.type + "Please enter the slot number and the pokemon in this format `number, pokemon`.\nexample: `3, lopunny`");
        sendDm(message, embed);
          for (let i = 0; i < getData.plan.split("<>").length; i++) {
            let field = getData.plan.split("<>");
            let name = field[i].split("</>")[0];
            let value = field[i].split("</>")[1];
            if (name !== "")
              embed.addField(name, !value ? "\u200b" : value, false);
          }

          sendDm(message, embed).then((msg) => {
            let startmsg;
          
            let filter = (m) => m.author.id === message.author.id;
            let pick = message.channel.createMessageCollector(filter, {
              time: 86400000,
            });
            pick.on("collect", async (m) => {
              if (
                m.content.toLowerCase() !== "cancel" &&
                m.content.toLowerCase() !== "save"
              ) {
                let _pick = m.content.split(",")[1];
                let __tier = m.content.split(",")[0];
                m.delete();
                _pick = _pick.replace(/ +/g, "");
                let search = _pick.toLowerCase();
                if (search.includes("mega ")) {
                  let temp = search.replace("mega ", "");
                  search = temp + "mega";
                }
                if(search.toLowerCase().includes("alola" || "alolan")) {
                    let temp = search.replace("alola", "");
                    temp = temp.replace("alolan", "");
                    search = temp + "alola";
                }
                    let poke = await ps.pokemonDex(search);
                    let pivot = await checkIFPokemonHasPivotMoves(poke.data.name.toLowerCase());
                    let cleric = await checkIfPokemonHasClericMoves(poke.data.name.toLowerCase());
                    let hazard = await checkIfPokemonHasHazardsMoves(poke.data.name.toLowerCase());
                    let removal = await checkIfPokemonHasHazardRemovalMoves(poke.data.name.toLowerCase());
                          let abilities;
                          let ab = Object.values(poke.data.abilities);
                          for(let i = 0; i < ab.length; i++){
                              abilities += `- ${ab[i]}\n`;
                          }
                          embed.fields[Number(__tier) - 1] = {
                            name: embed.fields[Number(__tier) - 1].name,
                            value: `${poke.data.name}\nType: ${
                              poke.data.types.length === 2
                                ? `${poke.data.types[0]} || ${poke.data.types[1]}`
                                : `${poke.data.types[0]}`
                            }\n Abilities:
                            ${
                              abilities.replace("undefined", "")
                            }\nBase Speed: ${
                              poke.data.baseStats.spe
                            }\n${pivot.data.length != 0 ? `Pivot Moves:\n${pivot.data.join(" ")}\n` : ''}${cleric.data.length != 0 ? `Cleric Moves:\n${cleric.data.join(" ")}\n` : ''}${hazard.data.length != 0 ? `Hazards Moves:\n${hazard.data.join(" ")}`: ''}${removal.data.length != 0 ? `Hazard Removal Moves:\n${removal.data.join(" ")}` : ''}`,
                          };
                    msg.edit(embed);
                  
              } else if (m.content.toLowerCase() === "cancel") {
                pick.stop();
                msg.delete();
                message.delete();
                m.delete();
                message.channel
                  .send(`Canceled The Editting process.`)
                  .then((txt) => txt.delete({ timeout: 10000 }));
              } else if (m.content.toLowerCase() === "save") {
                pick.stop();
                let draft = {
                  slots: embed.fields,
                  userId: message.author.id,
                };
                let plan = "";
                for (let i = 0; i < draft.slots.length; i++) {
                  plan += `${draft.slots[i].name}</> ${draft.slots[i].value}<>`;
                }
                //console.log(plan);
                let result = await db.draft.editDraftPlan(num, {plan: plan});
                let _embed = new MessageEmbed();
                if(!result.success){
                  _embed.setTitle('Error');
                  _embed.setColor('red');
                  _embed.setDescription(result.reason);

                  return message.channel.send(_embed).then((txt) => {
                    pick.stop();
                    msg.delete();
                    message.delete();
                    m.delete();
                    txt.delete({timeout: 10000});
                  })
                }

                _embed.setTitle('Edited Draft.');
                _embed.setColor('RANDOM');
                _embed.setDescription(`Edited ${result.draft} in the PC.`);

                message.channel.send(_embed).then((txt) => {
                  pick.stop();
                  msg.delete();
                  message.delete();
                  m.delete();
                  txt.delete({timeout: 10000});
                });

              }
            });
          });
    }
}