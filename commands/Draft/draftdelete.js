const Airtable = require("airtable");
const { MessageEmbed } = require("discord.js");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(
  process.env.AIRTABLE_TABLE
);

module.exports = {
    name: "deletedraft",
    aliases: "dd",
    category: "Draft",
    description: "Deletes a draft using the draft id.",
    execute(client, message, args){
        if(!args[0]) return message.channel.send(`What draft do you want to remove?`);
        base('Draft plans').select({
            filterByFormula: `{usersId} = ${message.author.id}`
        }).eachPage((records, _) => {
            if(!records.length) return message.channel.send(`Sorry, but it looks like you do not have any draft plans yet.`);
            let _record = "";
            let _draftName = "";
            let draftName = [];
            let _draftPlans = "";
            let draftPlans = [];
            let _draftType = "";
            let draftType = [];

            records.forEach((record) => {
                _record = record.getId();
                _draftName = record.get('draftname');
                _draftPlans = record.get('draftplans');
                _draftType = record.get('drafttype');
            })
            for (let i = 0; i < _draftName.split(",").length; i++) {
                draftName.push(_draftName.split(",")[i]);
              }
              for (let i = 0; i < _draftPlans.split(",").length; i++) {
                draftPlans.push(_draftPlans.split(",")[i]);
              }
              for (let i = 0; i < _draftType.split(",").length; i++) {
                draftType.push(_draftType.split(",")[i]);
              }
              if(isNaN(Number(args[0]))) return message.channel.send(`Sorry, but please put in a valid draft id.`);
              if(Number(args[0]) > draftName.length) return message.channel.send(`Sorry, but it looks like you do not have a draft plan under that id.`);
              let num = Number(args[0]);
              message.channel.send(`Are you sure you want to delete \`${draftName[num -1]}\`? (yes/no)`).then(async msg => {
                  message.channel.awaitMessages(((m) => m.author.id === message.author.id), {max: 1, time: 100000, errors: ['time']}).
                  then(collected => {
                      if(collected.first().content.toLowerCase() === "yes"){

                        draftName.splice(args[0] - 1, 1);
                        draftPlans.splice(args[0] - 1, 1);
                        draftType.splice(args[0] - 1, 1);
          
                        console.log(`Names: ${draftName}\nPlans: ${draftPlans}\nTypes: ${draftType}`);
                        message.channel.send(`Deleted the draft.`);
                        base('Draft plans').update([{
                            id: _record,
                            fields: {
                                draftname: draftName.toString(),
                                draftplans: draftPlans.toString(),
                                drafttype: draftType.toString()
                            }
                        }], (err, records) => {
                            if(err) return console.error(err);
                        })
                      }
                      else{
                          return message.channel.send(`Ok, I didn't delete it.`);
                      }
                  })
              })
            })
    }
}