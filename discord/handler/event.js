const { readdirSync } = require("fs");
const { Client } = require("discord.js");
/**
 * @name EventHandler
 * @summary This handles all of the events for discord. This file contacts the event files.
 * @param {Client} client - The Discord Client.
 */
module.exports = (client) => {
  /**
   * @name LoadEventFiles
   * @summary this loads the event files.
   * @param {string} dirs 
   */
    const load = (dirs) => {
        const events = readdirSync(`./discord/events/${dirs}`).filter(d =>
            d.endsWith(".js")
        );
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            let eName = file.split(".")[0];
            client.on(eName, evt.bind(null, client));
            console.log(`Event -> ${dirs}] ${eName} was loaded`);
        }
    };
  ["Client", "Guild"].forEach(x => load(x));
};
