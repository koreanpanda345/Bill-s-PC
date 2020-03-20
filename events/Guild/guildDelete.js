const Discord = require('discord.js');
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
module.exports = (client, guild) => {
    base('Settings').select({
        filterByFormula: `{guildId} = ${guild.id}`
    }).eachPage(function(records, fetchNextPage){
        if(!records.length) return;
        let _record;
        records.forEach(function(record){
            _record = record.getId();
        })
        base('Settings').destroy([_record], function(err, deletedRecord){
            if(err) return console.error(err);
            console.log(`Deleted a Setting guild. for guild id of ${guild.id}`);
        })
    })
}
