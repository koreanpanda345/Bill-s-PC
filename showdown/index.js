const {Client, Message} = require('ps-client');
require('dotenv').config();
let client = new Client({
    username: process.env.SHOWDOWN_USERNAME,
    password: process.env.SHOWDONW_PASSWORD,
    server: process.env.SHOWDOWN_TEST_SERVER,
    port: process.env.SHOWDOWN_TEST_PORT, 
    debug: true, 
    autoJoin: ["Lobby"]
});

client.connect();

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