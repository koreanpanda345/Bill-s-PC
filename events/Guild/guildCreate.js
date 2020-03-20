const Discord = require('discord.js');
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
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
