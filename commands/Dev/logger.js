const Logger = require('../../DevTools/Logger/index');

module.exports = {
    name: "logger",
    aliases: ["log"],
    description: "",
    category: "Dev",
    execute(client, message, args){
        if(message.author.id !== "304446682081525772") return;
        Logger.Error("./commands/Dev/logger.js", new Error("Testing Logger.Error() Should throw excpetion, and create a log file."), Date.now());
        Logger.Info("./commands/Dev/logger.js", "Testing Logger.Info(). Should Create a log file, and enter this message in.", Date.now());
    }
}