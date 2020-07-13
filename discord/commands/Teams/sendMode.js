const Discord = require('discord.js');
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);

module.exports = {
    name: "editmode",
    aliases: ['em'],
    description: "Allows you to changes the send modes for one of your teams",
    category: "Teams",
    execute(client, message, args){
        let _str = args.join(" ");
        let _arglist = _str.split(",");
        if (!_arglist)
        return message.channel.send(
          "Please try again with your team's id, (dm/public)"
        );
        base('Teams').select({
            filterByFormula: `{userId} = ${message.author.id}`
        }).eachPage(function page(records, fetchNextPage){
            if(!records.length) return message.channel.send(`It looks like you didn't set up your "PC" yet. use the b!addteam to start.`);
            let str = "";
            let arr = [];
            let _record = ""; 
            records.forEach(function(record){
                str = record.get('visibility');
                _record = record.getId();
            })
            for(let i = 0; i < str.split(",").length; i++)
                arr.push(str.split(",")[i]);
            arr[_arglist[0] - 1] = _arglist[1];
            base("Teams").update([{
                id: _record,
                fields: {
                    visibility: arr.toString()
                }
            }], function(err, record){
                if(err) return console.error(err);
                message.channel.send(`Just edit the send mode.`);
            })
        })
    }

}
