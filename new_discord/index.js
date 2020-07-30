process.on("unhandledRejection", error => {
  console.error("Uncaught Promise Rejection", error);
});

const {Client, Collection} = require('discord.js');
const testMode = true;
require('dotenv').config();
const client = new Client();
["commands"].forEach(x => (client[x] = new Collection()));

["command", "event"].forEach(x => require(`./handlers/${x}`)(client));

if(!testMode)
  client.login(process.env.DISCORD_TOKEN)
else if(testMode)
  client.login(process.env.TEST_TOKEN);