const Airtable = require("airtable");
const { MessageEmbed } = require("discord.js");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(
  process.env.AIRTABLE_TABLE
);
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const fetch = require("node-fetch");

module.exports = {
    name: "editdraft",
    aliases: ['ed'],
    description: "Allows you to edit a draft.",
    usage: "b!editdraft <draft id>",
    category: "Draft",
    execute(client, message, args){
        let num = Number(args[0]);
      base(`Draft plans`)
        .select({
          filterByFormula: `{usersId} = ${message.author.id}`,
        })
        .eachPage((records, _) => {
          if (!records.length)
            return message.chanenl.send(
              `Sorry, but it looks like you do not have any draft plans.`
            );
          let _record = "";
          let _draftName = "";
          let draftName = [];
          let _draftPlans = "";
          let draftPlans = [];
          let _draftType = "";
          let draftType = [];
          records.forEach((record) => {
            _record = record.getId();
            _draftName = record.get("draftname");
            _draftPlans = record.get("draftplans");
            _draftType = record.get("drafttype");
          });
          for (let i = 0; i < _draftName.split(",").length; i++) {
            draftName.push(_draftName.split(",")[i]);
          }
          for (let i = 0; i < _draftPlans.split(",").length; i++) {
            draftPlans.push(_draftPlans.split(",")[i]);
          }
          for (let i = 0; i < _draftType.split(",").length; i++) {
            draftType.push(_draftType.split(",")[i]);
          }
          let embed = new MessageEmbed();
          embed.setColor('RANDOM');
          embed.setTitle(draftName[num - 1]);
          embed.setDescription(draftType[num - 1] + "Please enter the slot number and the pokemon in this format `number, pokemon`.\nexample: `3, lopunny`");
          for (let i = 0; i < draftPlans[num - 1].split("<>").length; i++) {
            let field = draftPlans[num - 1].split("<>");
            let name = field[i].split("</>")[0];
            let value = field[i].split("</>")[1];
            if (name !== "")
              embed.addField(name, !value ? "\u200b" : value, false);
          }

          message.channel.send(embed).then((msg) => {
            let filter = (m) => m.author.id === message.author.id;
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
                m.delete();
                _pick = _pick.replace(/ +/g, "");
                let search = _pick.toLowerCase();
                if (search.includes("mega ")) {
                  let temp = search.replace("mega ", "");
                  search = temp + "mega";
                }
                if(search.includes("-")){
                  let temp = search.replace(/-/g, "");
                  search = temp;
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
                  .send(`Cancelled The Editing process.`)
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
                draftPlans[num - 1] = plan;
                console.log(draftPlans[num - 1]);

                base("Draft plans").update(
                  [
                    {
                      id: _record,
                      fields: {
                        draftplans: draftPlans.toString(),
                      },
                    },
                  ],
                  (err, records) => {
                    if (err) return console.error(err);
                    console.log(`Updated draft plan.`);
                    message.delete();
                    msg.delete();
                    m.delete();

                    message.channel
                      .send(`Updated your draft plan.`)
                      .then((txt) => txt.delete({ timeout: 10000 }));
                  }
                );
              }
            });
          });
        });
    }
}