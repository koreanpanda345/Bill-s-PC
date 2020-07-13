const Airtable = require("airtable");
const { Client, Guild } = require("discord.js");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);

/**
 * @name GuildCreateEvent
 * @summary This handles the GuildCreate event which is when the bot joins a server.
 * @param {Client} client - The Discord Client
 * @param {Guild} guild - The Guild that the bot joined.
 */
module.exports = (client, guild) => {
    base(`Settings`).create([{
        fields: {
            guildId: guild.id,
            Prefix: 'b!'
        },
    }], function(err, record){
        if(err) return console.error(err);
        console.log(`Created a new Settings record for guild ${guild.id}`)
    })
}
