process.on("unhandledRejection", error => {
  console.error("Uncaught Promise Rejection", error);
});
require('dotenv').config();
const { Client, Collection } = require("discord.js");
const client = new Client({disableMentions: "everyone"});
const token = process.env.DISCORD_TOKEN;
const test = require('./test');
["commands"].forEach(x => (client[x] = new Collection()));
//test.damage();
["command", "event"].forEach(x => require(`./handler/${x}`)(client));

client.login(token);
