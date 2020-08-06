process.on("unhandledRejection", error => {
  console.error("Uncaught Promise Rejection", error);
});

const testMode = false;

require('dotenv').config();
const { Client, Collection } = require("discord.js");
const test = require('./test');
const client = new Client({disableMentions: "everyone"});
//test.Teambuilder();
["commands"].forEach(x => (client[x] = new Collection()));

["command", "event"].forEach(x => require(`./handler/${x}`)(client));
if(!testMode)
  client.login(process.env.DISCORD_TOKEN);
else if(testMode)
  client.login(process.env.TEST_TOKEN);