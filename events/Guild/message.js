const prefix = process.env.PREFIX;
module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
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
      command.execute(client, message, args);
    } catch (e) {
      console.error(e);
    }
  }
};
