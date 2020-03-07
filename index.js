process.on("unhandledRejection", error => {
  console.error("Uncaught Promise Rejection", error);
});
const { Client, Collection } = require("discord.js");
const client = new Client({ disableEveryone: true });
const token = process.env.DISCORD_TOKEN;

["commands"].forEach(x => (client[x] = new Collection()));

["command", "event"].forEach(x => require(`./handler/${x}`)(client));

client.login(token);
