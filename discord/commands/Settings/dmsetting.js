const { Client, Message, MessageEmbed } = require("discord.js");
const Airtable = require('../../Airtable/index');

module.exports = {
    name: "dmsettings",
    aliases: ["dm"],
    category: "Settings",
    description: "Allows you to set make the bot to either send sensitive stuff in the server or in dms. Sensitive stuff includes draft commands, things alike.",
    usage: "b!dmsettings enable",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        const db = new Airtable({guildId: message.guild.id}).utils.settings;
        let embed = new MessageEmbed();
        if(!message.member.hasPermission("MANAGE_GUILD"))
            return message.channel.send(embed.setTitle("Sorry, but you do not have permission to do this. You need to have the permission of `Manage Server` to do this.").setColor('RED'));
        if(!args[0]) {
            const settings = await db.getGuildSettings();
            let dm = settings.dm;
            if(dm) dm = false;
            else dm = true;
            let result = await db.editSettings({prefix: settings.prefix, mentions: settings.mentions, dm: dm});
            if(!result.success)
                return message.channel.send(embed.setTitle("Error").setDescription(result.reason).setColor('RED'));
            embed.setColor('RANDOM')
            .setTitle(`Changed dm settings to ${dm ? 'Enabled': 'Disabled'}!`)
            .setDescription(
                `${dm 
                    ? `This means all sensitive stuff, like draft plans, and data from the draft commands will be sent to the dms for this server.` 
                    : `This means all sensitive data like draft plans, and data from draft commands, will be sent in the server.`
                }`);
            return message.channel.send(embed);
        }
        else {
            let dm = args[0].toLowerCase() === 'enable' ? true : args[0].toLowerCase() === 'disable' ? false : null;
            if(dm === null) return message.channel.send(embed.setColor('RED').setTitle('Error').setDescription('Sorry, but you must tell me if you want to enable the setting, or disable it.'));

            const settings = await db.getGuildSettings();
            if(dm === settings.dm)
                return message.channel.send(embed.setColor('RANDOM').setTitle(`The dm settings is already ${dm ? 'enabled' : 'disabled'}`));
            
            let result = await db.editSettings({prefix: settings.prefix, mentions: settings.mentions, dm: dm});
            if(!result.success)
                return message.channel.send(embed.setColor('RED').setTitle('RED').setDescription(result.reason));
            embed.setColor('RANDOM')
            .setTitle(`Changed dm settings to ${dm ? 'Enabled' : 'Disabled'}`)
            .setDescription(
                `${dm 
                    ? `This means all sensitive stuff, like draft plans, and data from the draft commands will be sent to the dms for this server.` 
                    : `This means all sensitive data like draft plans, and data from draft commands, will be sent in the server.`
                }`);

            return message.channel.send(embed);
        }
    }
}