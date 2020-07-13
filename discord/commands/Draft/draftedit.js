const Airtable = require("../../Airtable/index.js");
const { MessageEmbed } = require("discord.js");
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const fetch = require("node-fetch");

module.exports = {
    name: "editdraft",
    aliases: ['ed'],
    description: "Allows you to edit a draft.",
    usage: "b!editdraft <draft id>",
    category: "Draft",
    async execute(client, message, args){
      let db = new Airtable({userId: message.author.id});
        let num = Number(args[0]);
        let getData = await db.draft.getDraftPlan(num);  
        let embed = new MessageEmbed();
          embed.setColor('RANDOM');
          embed.setTitle(getData.name);
          embed.setDescription(getData.type + "Please enter the slot number and the pokemon in this format `number, pokemon`.\nexample: `3, lopunny`");
        message.channel.send(embed);
          for (let i = 0; i < getData.plan.split("<>").length; i++) {
            let field = getData.plan.split("<>");
            let name = field[i].split("</>")[0];
            let value = field[i].split("</>")[1];
            if (name !== "")
              embed.addField(name, !value ? "\u200b" : value, false);
          }

          message.member.send(embed).then((msg) => {
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
                
                fetch(`${endpoint_dex}`)
                  .then((res) => res.text())
                  .catch((error) => {return;})
                  .then((body) => {
                    let res = eval(body);
                    let poke = res[search];
                    let abilities;
                    let ab = Object.values(poke.abilities);
                    console.log(ab);
                    for(let i = 0; i < ab.length; i++){
                        abilities += `- ${ab[i]}\n`;
                    }
                    embed.fields[Number(__tier) - 1] = {
                      name: embed.fields[Number(__tier) - 1].name,
                      value: `${poke.name}\nType: ${
                        poke.types.length === 2
                          ? `${poke.types[0]} || ${poke.types[1]}`
                          : `${poke.types[0]}`
                      }\n Abilities: 
                      ${
                        abilities.replace("undefined", "")
                      }\nBase Speed: ${
                        poke.baseStats.spe
                      }`,
                    };
                    msg.edit(embed);
                  });
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
                for (let i = 0; i < embed.fields.length; i++) {
                  plan += `${embed.fields[i].name}</> ${embed.fields[i].value}<>`;
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