const Airtable = require("airtable");
const { MessageEmbed } = require("discord.js");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(
  process.env.AIRTABLE_TABLE
);
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const fetch = require("node-fetch");

module.exports = {
    name: "draft",
    description: "displays the list of drafts you made.",
    category: "Draft",
    execute(client, message, args){
      if(args[0]){
        switch(args[0]){
          case "add":
            args.shift();
            require("./draftadd.js").execute(client, message, args);
          break;
          case "view":
          args.shift();
          require('./draftplans.js').execute(client, message, args);
          break;
          case "edit":
          args.shift();
          require("./draftedit.js").execute(client, message, args);
          break;
          case "delete":
          args.shift();
          require("./draftdelete.js").execute(client, message, args);
          break;
          default:
          require('./draftplans.js').execute(client, message, args);
          break;
        }
        return;
      }
        base(`Draft plans`)
        .select({
          filterByFormula: `{usersId} = ${message.author.id}`,
        })
        .eachPage((records, _) => {
          if (!records.length)
            return message.channel.send(
              `Sorry, but it seems like you do not have any draft plans.`
            );
          let _draftName = "";
          let draftName = [];
          let _draftPlan = "";
          let draftPlans = [];
          records.forEach((record) => {
            _draftName = record.get("draftname");
            _draftPlan = record.get("draftplans");
          });
          for (let i = 0; i < _draftName.split(",").length; i++) {
            draftName.push(_draftName.split(",")[i]);
          }
          for (let i = 0; i < _draftPlan.split(",").length; i++) {
            draftPlans.push(_draftPlan.split(",")[i]);
          }

          let embed = new MessageEmbed();
          embed.setColor('RANDOM');

          let desc = "";

          for (let i = 0; i < draftName.length; i++) {
            if (draftName[i] !== "")
              desc += `__**${i + 1}:**__ ${draftName[i]}\n`;
          }
          embed.setDescription(desc);
          message.channel.send(embed);
        });
    }
}