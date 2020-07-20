const {Client} = require('showdown.js');
require('dotenv').config();
let client = new Client({
    name: process.env.SHOWDOWN_USERNAME,
    pass: process.env.SHOWDONW_PASSWORD,
    host: process.env.SHOWDOWN_TEST_HOST,
    port: process.env.SHOWDOWN_TEST_PORT,  
    baseRooms: ["Lobby"]
});
  client.on('ready', () => {
    console.log('Bot is logined');
  })

client.on('message', 
/**
 * 
 * @param {Message} message 
 */
async function(message){
    if(message.isIntro) return;
    let prefix = "b!";
    console.log(message.author.name + "=>" + message.content);
    if(message.content.startsWith(prefix)) {
        let args = message.content.slice(prefix.length).split(/ +/g);
        let command = args.shift();
        if(command === "ping") {
            message.reply("Pong!");
        }
        if(command === "getteam") {
            await require('./src/teams/command_getteam')(client, message, args);      
        }
        if(command === "disconnect") {
            message.reply("Disconnecting");
            client.disconnect();
            console.log("Disconnected");
        }
        if(command === "restart") {
            message.reply("Restarting");
            client.disconnect();
            client.connect();
            message.reply("Restarted.");
        }
    } 
});

client.connect();