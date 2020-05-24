const Airtable = require("airtable");
const { MessageEmbed } = require("discord.js");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(
  process.env.AIRTABLE_TABLE
);
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const fetch = require("node-fetch");

module.exports = {
    name: "adddraft",
    aliases: ["ad"],
    category: "Draft",
    description: "Adds a draft plan to your Person Collection of draft plans.",
    execute(client, message, args){
        let embed = new MessageEmbed();
        embed.setColor('RANDOM');
        embed.setTitle(`Untitled`);
        embed.setDescription(
          `Please Type in what you would like your draft plan's name to be.`
        );
  
        message.channel.send(embed).then((msg) => {
          let filter = (m) => m.author.id === message.author.id;
          let name = message.channel.createMessageCollector(filter, {
            time: 86400000,
            max: 1,
          });
          name.on("collect", (m) => {
            console.log(m.content);
            let _name = m.content;
            m.delete();
            embed
              .setTitle(`${_name}`);
              let _draft;
                //tier 1, tier 2, tier 3, tier 3, tier 4, tier 5, mega, free, free, free, free\
                base("Draft plans")
                  .select({
                    filterByFormula: `{usersId} = ${message.author.id}`,
                  })
                  .eachPage((records, _) => {
                    if (!records.length) {
                      base(`Draft plans`).create(
                        [
                          {
                            fields: {
                              usersId: message.author.id,
                              draftname: "",
                              draftplans: "",
                              drafttype: "",
                            },
                          },
                        ],
                        (err, records) => {
                          if (err) return console.error(err);
                        }
                      );
                    }
                  });
                _draft = "tier";
                embed.setDescription(
                  `Tier Draft
                  Please enter the tier system that you will be using.
                  - iGL
  
                  if you don't see a prebuilt tier system that your league uses, please put in \`custom (<tiers>)\`
                  example: \`custom (tier 1, tier 2, tier 3, tier 3, tier 4, tier 5, mega, free, free, free, free)\` including the \`,\``
                );
                msg.edit(embed);
                let tiers = message.channel.createMessageCollector(filter, {
                  time: 86400000,
                  max: 1,
                });
                tiers.on("collect", (m) => {
                  let _tiers;
                  if(m.content.toLowerCase().startsWith("igl"))
                  {
                    _tiers =["Tier 1", "Tier 2", "Tier 3", "Tier 3", "Tier 4", "Tier 5", "Mega", "Free", "Free", "Free", "Free"];
                    _draft = "IGL Draft Format";
                  }
                   if(m.content.startsWith("custom")){
                    _draft = "Custom Tier Draft Format";
                    _tiers = m.content.split(",");
                    _tiers[0] = _tiers[0].split("(")[1];
                    _tiers[_tiers.length - 1] = _tiers[_tiers.length - 1].split(")")[0];
  
                  }
  
                  m.delete();
                  for (let i = 0; i < _tiers.length; i++) {
                    embed.addField(
                      `Slot ${i + 1}: ` + _tiers[i],
                      "\u200b",
                      false
                    );
                  }
                  embed.setDescription(
                    `${_draft}\nPlease enter the slot number and the pokemon in this format \`number, pokemon\`.\nexample: \`3, lopunny\``
                  );
                  msg.edit(embed);
  
                  let pick = message.channel.createMessageCollector(filter, {
                    time: 86400000,
                  });
                  pick.on("collect", (m) => {
                    if (
                      m.content.toLowerCase() !== "cancel" &&
                      m.content.toLowerCase() !== "save"
                    ) {
                      let _pick = m.content.split(",")[1];
                      let __tier = m.content.split(",")[0];
                      if(!_pick) return;
                      m.delete();
                      _pick = _pick.replace(/ +/g, "");
                      let search = _pick.toLowerCase();
                      if (search.toLowerCase().includes("mega")) {
                        let temp = search.replace("mega", "");
                        search = temp + "mega";
                      }
                      fetch(`${endpoint_dex}`)
                        .then((res) => res.text())
                        .catch((error) => {return;})
                        .then((body) => {
                          let res = eval(body);
                          let poke = res[search];
                          let abilities;
                          let ab = Object.values(poke.abilities);
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
                    }
                    if (m.content.toLowerCase() === "save") {
                      pick.stop();
  
                      let draft = {
                        name: embed.title,
                        draftType: embed.description.split("Please")[0],
                        slots: embed.fields,
                        userId: message.author.id,
                      };
                      let plan = "";
                      for (let i = 0; i < embed.fields.length; i++) {
                        plan += `${embed.fields[i].name}</> ${embed.fields[i].value}<>`;
                      }
  
                      base("Draft plans")
                        .select({
                          filterByFormula: `{usersId} = ${draft.userId}`,
                        })
                        .eachPage((records, _) => {
                          let _record;
                          let _names;
                          let _plans;
                          let _type;
                          records.forEach((record) => {
                            _record = record.getId();
                            _names = record.get("draftname");
                            _plans = record.get("draftplans");
                            _type = record.get("drafttype");
                          });
                          base(`Draft plans`).update(
                            [
                              {
                                id: _record,
                                fields: {
                                  draftname:
                                    (_names === undefined ? "" : _names) +
                                    draft.name +
                                    ",",
                                  draftplans:
                                    (_plans === undefined ? "" : _plans) +
                                    plan +
                                    ",",
                                  drafttype:
                                    (_type === undefined ? "" : _type) +
                                    draft.draftType +
                                    ",",
                                },
                              },
                            ],
                            (err, records) => {
                              if (err) return console.error(err);
                              message.delete();
                              msg.delete();
                              m.delete();
          
                              message.channel
                                .send(`I saved your draft plan.`)
                                .then((txt) => txt.delete({ timeout: 10000 }));
                            }
                          );
                        });
                    }
                    if (m.content.toLowerCase() === "cancel") {
                      pick.stop();
                      msg.delete();
                      message.delete();
                      m.delete();
                      message.channel
                        .send(`Canceled`)
                        .then((txt) => txt.delete({ timeout: 10000 }));
                    }
                  });
                });
              })
            });
    }
}