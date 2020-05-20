const Airtable = require("airtable");
const { MessageEmbed } = require("discord.js");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(
  process.env.AIRTABLE_TABLE
);
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const fetch = require("node-fetch");
module.exports = {
  name: "viewdraft",
  aliases: ["vd"],
  category: "Draft",
  description: "Allows you to view your draft.",
  usage: "b!viewdraft <draft id>",
  execute(client, message, args) {
        if(!isNaN(Number(args[0])))
            args[1] = args[0];
      base(`Draft plans`)
        .select({
          filterByFormula: `{usersId} = ${message.author.id}`,
        })
        .eachPage((records, _) => {
          if (!records.length)
            return message.channel.send(
              `Sorry, but it looks like you don't have any current draft plans.`
            );
          let num = Number(args[1]);
          let _draftName = "";
          let draftName = [];
          let _draftPlan = "";
          let draftPlans = [];
          let _draftType = "";
          let draftType = [];
          records.forEach((record) => {
            _draftName = record.get("draftname");
            _draftPlan = record.get("draftplans");
            _draftType = record.get("drafttype");
          });
          for (let i = 0; i < _draftName.split(",").length; i++) {
            draftName.push(_draftName.split(",")[i]);
          }
          for (let i = 0; i < _draftPlan.split(",").length; i++) {
            draftPlans.push(_draftPlan.split(",")[i]);
          }
          for (let i = 0; i < _draftType.split(",").length; i++) {
            draftType.push(_draftType.split(",")[i]);
          }
          let embed = new MessageEmbed();
          embed.setTitle(`Draft Plan: ${draftName[num - 1]}`);
          embed.setDescription(`Draft Type: ${draftType[num - 1]}`);

          for (let i = 0; i < draftPlans[num - 1].split("<>").length; i++) {
            let field = draftPlans[num - 1].split("<>");

            let name = field[i].split("</>")[0];
            let value = field[i].split("</>")[1];
            if (name !== "")
              embed.addField(`${name}`, !value ? "\u200b" : value, false);
          }

          message.channel.send(embed);
        });

  },
};
