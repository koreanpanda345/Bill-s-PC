const _prefix = process.env.PREFIX;
const Airtable = require("airtable");
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base(process.env.AIRTABLE_TABLE);
module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  let prefix = _prefix;
base('Settings').select({
  filterByFormula: `{guildId} = ${message.guild.id}`
}).eachPage(function page(records, fetchNextPage){
  if(!records.length)
  prefix = _prefix;
  else{
    records.forEach(function(record){
      prefix = record.get('Prefix');
    })
  if (message.content.toLowerCase().startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;
    try {
      if(command.hasArgs && !args.length)
        return message.channel.send(`Please enter the following arguments ${command.args} when executing this command again.`);
      command.execute(client, message, args);
    } catch (e) {
      console.error(e);
    }
  }
  }
})
};
