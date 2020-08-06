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
        if(settings.dm) // If settings.dm is true(Enabled) then send content to the user's dm.
            return message.author.send(content);
        else // Else (Disabled) send the content int the channel that the command was executed in.
            return message.channel.send(content);
    },
    /**
     * @summary Checks if the settings for the server has the dmSettings enabled or not.
     * @param {Message} message 
     * @returns {Boolean}
     */
    async isDm(message) {
        const db = new Airtable({guildId: message.guild.id}).utils.settings;
        let settings = await db.getGuildSettings();
        console.log(settings.dm);
        return settings.dm; // Returns true or false.
    }
};