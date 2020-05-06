const {MessageEmbed} = require('discord.js');
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
module.exports = {
    name: 'updates',
    description: "This will show you all the new and old updates.",
    category: "Miscellaneous",
    async execute(client, message, args){
        base('Updates').select().eachPage(async function page(records, _){
            let dateArr = [];
            let titleArr = [];
            let descriptionArr = [];
            let cmdAddedArr = [];
            let cmdUpdatedArr = [];
            let futureUpdateArr = [];
            let imgArr = [];
            records.forEach(function(record){
                dateArr.push(record.get("Date"));
                titleArr.push(record.get("Title"));
                descriptionArr.push(record.get("Description"));
                cmdAddedArr.push(record.get("Commands Added"));
                cmdUpdatedArr.push(record.get("Commands Updated"));
                futureUpdateArr.push(record.get("Future Update"));
                imgArr.push(record.get('Image'));
            });

            if(!args[0]){
                let page = 1;
                let pages = [];
                let pageAmount = 10;
                let amount = pageAmount;
                let desc = "";
                for(let i = 0; i < Math.floor(Math.round((titleArr.length / pageAmount === 0 ? 1 : titleArr.length / pageAmount))); i++){
                    for(let n = 1 + amount - 11; n < amount; n++){
                        if(n !== 0 && titleArr[n - 1] !== undefined)
                            desc += `__**ID: ${n}**__ | __**Title:**__ *${titleArr[n - 1]}* | __**Date:**__ *${dateArr[n - 1]}*\n`;
                    }
                    amount += pageAmount;
                    pages.push(desc);
                    desc = "";
                }
                let embed = new MessageEmbed()
                .setTitle(`All of my updates.`)
                .setColor('RANDOM')
                .setDescription(`${pages[page - 1]}`)
                .setFooter(`Page ${page} of ${pages.length} | To view an update, just do "p.update <Id number>" |`);

                return message.channel.send(embed).then(async msg => {
                    msg.react('◀️').then(async r => {
                        msg.react('▶️');

                        let backwardsFilter = (reaction, user) => reaction.emoji.name === `◀️` && user.id === message.author.id;
                        let forwardsFilter = (reaction, user) => reaction.emoji.name === `▶️` && user.id === message.author.id;

                        const backwards = msg.createReactionCollector(backwardsFilter, {time: 300000});
                        const forwards = msg.createReactionCollector(forwardsFilter, {time: 300000});

                        backwards.on("collect", async () => {
                            if(page === 1) return;
                            --page;
                            embed.setDescription(pages[page - 1]);
                            embed.setFooter(`Page ${page} of ${pages.length} | To view an update, just do "p.update <Id number>" |`);
                            msg.edit(embed);
                            const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                            try{
                                for(const reaction of userReactions.values()){
                                    await reaction.users.remove(message.author.id);
                                }
                            }catch(error){
                                console.error(error);
                            }
                        })

                        forwards.on("collect", async () => {
                            if(page === pages.length) return;
                            ++page;
                            embed.setDescription(pages[page - 1]);
                            embed.setFooter(`Page ${page} of ${pages.length} | To view an update, just do "p.update <Id number>" |`);
                            msg.edit(embed);
                            
                            const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                            try{
                                for(const reaction of userReactions.values()){
                                    await reaction.users.remove(message.author.id);
                                }
                            }catch(error){
                                console.error(error);
                            }
                        })
                    })
                })
                
            }
            else{
                if(isNaN(args[0]) && args[0] !== "") return message.channel.send(`Sorry, but plase enter a valid update id number.`);
                let select = Number(args[0] - 1);
                if(dateArr[select] === (undefined || null)) return message.channel.send(`Sorry, but that id number is invalid.`);
                let embed = new MessageEmbed()
                .setTitle(`Update Log for ${dateArr[select]}`)
                .setColor('RANDOM')
                .setDescription(`__Title:__ ${titleArr[select]}\n__Description:__ ${descriptionArr[select]}`);
                if(cmdAddedArr[select] !== "\n")
                    embed.addField(`Commands Added:`, cmdAddedArr[select]);
                if(cmdUpdatedArr[select] !== "\n")
                    embed.addField(`Commands Updated:`, cmdUpdatedArr[select]);
                if(futureUpdateArr[select] !== "\n")
                    embed.addField(`Future Updates:`, futureUpdateArr[select]);
                if(imgArr[select] !== "\n")
                    embed.setImage(imgArr[select][0].thumbnails.large.url);
                return message.channel.send(embed);
            }
        })
    }
}