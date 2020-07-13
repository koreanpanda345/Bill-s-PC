process.on("unhandledRejection", error => {
  console.error("Uncaught Promise Rejection", error);
});

const testMode = true;

require('dotenv').config();
const { Client, Collection } = require("discord.js");
const client = new Client({disableMentions: "everyone"});

["commands"].forEach(x => (client[x] = new Collection()));
//test.damage();
["command", "event"].forEach(x => require(`./handler/${x}`)(client));
if(!testMode)
  client.login(process.env.DISCORD_TOKEN);
else if(testMode)
  client.login(process.env.TEST_TOKEN);