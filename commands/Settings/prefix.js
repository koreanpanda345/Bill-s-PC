const {} = require('discord.js');
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
module.exports = {
    name: "setprefix",
    aliases: ["prefix"],
    args: "<desired prefix>",
    description: "Allows admins to change the prefix for the bot.",
    category: "Settings",
    execute(client, message, args){
        if(!message.member.hasPermission('ADMINSTRATOR')) return message.channel.send('Sorry, but you do not have permission to use this command. You need to have the `Adminstrator` permission to do this')
        base('Settings').select({
            filterByFormula: `{guildId} = ${message.guild.id}`
        }).eachPage(function page(records, fetchNextPage){
            if(!records.length){
                if(!args[0]){
                    return message.channel.send(`The prefix is **b!**`);
                }
                else {
                    base('Settings').create({
                        fields: {
                            guildId: message.guild.id,
                            Prefix: args[0],
                        }
                    }, function(err, record){
                        if(err) return console.error(err);
                        message.channel.send(`The bot's prefix is now ${args[0]}`);
                    })
                }
                
            }
            let prefix = "";
            let _record = "";
            records.forEach(function(record){
                prefix = record.get('Prefix');
                _record = record.getId();
            })
            if(!args[0])
            return message.channel.send(`The bot's prefix is ${prefix}`);
            else {
                base("Settings").update([{
                    id: _record,
                    fields: {
                        Prefix: args[0]
                    }
                }], function(err, record){
                    if(err) console.error(err);
                    return message.channel.send(`The bot's prefix is now ${args[0]}`);
                })
            }
        })
    }
}
