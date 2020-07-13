const {Client, Message, User} = require('ps-client');
const Airtable = require('../../../discord/Airtable/index');
/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {String[]} args 
 */
 module.exports = async (client, message, args) => {
     const showdown = new Airtable({showdown_name: message.author.name}).showdown;
     if(! await showdown.checkIfShowdownNameExist()) return {success: false, reason: "Not Setup"};
     const discordId = await showdown.getDiscordId();
     const db = new Airtable({userId: discordId}).teams;
     let num = Number(args[0]);
     if(isNaN(num)) return {success: false, reason: "Slot id is NaN"};
     let team = await db.getTeam(num - 1);
     console.log(team);
}