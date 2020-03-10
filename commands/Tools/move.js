const Discord = require("discord.js");
const Pokedex = require("pokedex-promise-v2");
const P = new Pokedex();
module.exports = {
  name: "movelist",
  aliases: ["movepool", "ml"],
  hasArgs: true,
  args: "<Pokemon name>",
  description: "shows all the moves that the pokemon can learn.",
  category: "Tools",
  execute(client, message, args) {
    let search = "";
    if (args[0].toLowerCase() === "mega") {
      let str = args.join(" ");
      let temp = str.replace("mega ", "");
      search = temp + "-mega";
    } else {
      search = args[0];
    }
    console.log(search);
    P.getPokemonByName(search)
      .then(function(response) {
        console.log(response);
        let embed = new Discord.RichEmbed();
        embed.setColor("RANDOM");
        let str = "";
        for (let i = 0; i < response.moves.length; i++) {
          str += `${response.moves[i].move.name}\n`;
          console.log(response.moves[i].version_group_details[0]);
        }
        console.log(response.moves);
        embed.setDescription(str);
        message.channel.send(embed);
      })
      .catch(function(err) {
        console.error(err);
      });
  }
};
