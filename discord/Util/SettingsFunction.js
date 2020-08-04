const Airtable = require('../Airtable/index');
const { Message } = require('discord.js');
module.exports = {
    /**
     * @summary Checks if the server's dm settings is true or not. if it is true, then it will send the content to the user's dm. else it sends in the server.
     * @param {Message} message
     * @param {any} content
     * @returns {Promise<Message>}
     */
    async sendDm(message, content) {
        const db = new Airtable({guildId: message.guild.id}).utils.settings;
        let settings = await db.getGuildSettings();        
        if(settings.dm)
            return message.author.send(content);
        else 
            return message.channel.send(content);
    },
    /**
     * 
     * @param {Message} message 
     * @returns {Boolean}
     */
    async isDm(message) {
        const db = new Airtable({guildId: message.guild.id}).utils.settings;
        let settings = await db.getGuildSettings();
        return settings.dm;
    }
};