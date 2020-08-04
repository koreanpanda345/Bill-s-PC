const {Client, Message, MessageEmbed} = require('discord.js');
const Airtable = require('../../Airtable/index');

module.exports = {
    name: "settings",
    category: "Settings",
    description: "Shows the Server's settings for the bot.",
    usage: "b!settings",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        let db = new Airtable({guildId: message.guild.id}).utils.settings;
        let embed = new MessageEmbed();
        let settings = await db.getGuildSettings();
        embed.setColor('RANDOM')
        .setTitle(`Server Settings for ${message.guild.name}`);

        embed.fields = [
            {name: "Prefix", value: settings.prefix, inline: true},
            {name: "Mention Prefix", value: 'Coming soon', inline: true},
            {name: "Dm Sensitive Data", value: settings.dm ? 'Enabled' : 'Disabled', inline: true}
        ];
        message.channel.send(embed);
    }
}