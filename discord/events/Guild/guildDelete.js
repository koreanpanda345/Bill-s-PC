const { Client, Guild } = require('discord.js');
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
/**
 * @name GuildDeleteEvent
 * @summary this event handles the GuildDelete Event which is when the bot leaves a server.
 * @param {Client} client - The Discord Client
 * @param {Guild} guild - The Guild that the bot left.
 */
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
