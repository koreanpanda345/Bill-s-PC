const Discord = require("discord.js");
const Pokedex = require("pokedex-promise-v2");
const P = new Pokedex();
module.exports = {
  name: "dex",
  aliases: ["search", "p"],
  hasArgs: true,
  args: "Pokemon name",
  description: "Displays info about a pokemon.",
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
        let name = response.forms[0].name;
        let url = `https://www.smogon.com/dex/sm/pokemon/${name}/`;
        //let moves = response.moves;
        let ability = response.abilities;
        let types = response.types;
        let base_stat = response.stats;
        let sprite = `https://play.pokemonshowdown.com/sprites/ani/${name}.gif`;
        let abstr = "**";
        for (let i = 0; i < ability.length; i++) {
          abstr += `${ability[i].ability.is_hidden ? "Hidden Ability: " : ""}${
            ability[i].ability.name.includes("-")
              ? `${ability[i].ability.name.replace(`-`, " ")}`
              : `${ability[i].ability.name}`
          }\n`;
        }
        abstr += "**";
        let bst = `**
            HP: ${base_stat[5].base_stat}
            ATK: ${base_stat[4].base_stat}
            DEF: ${base_stat[3].base_stat}
            SPATK: ${base_stat[2].base_stat}
            SPDEF: ${base_stat[1].base_stat}
            SPEED: ${base_stat[0].base_stat}
            **`;
        let lower = name;
        const upper = lower.charAt(0).toUpperCase() + lower.slice(1);
        embed.setTitle(
          `Info On ${
            upper.includes("-mega")
              ? `Mega ${upper.replace("-mega", "")}`
              : `${upper}`
          }`
        );
        console.log(types.length);
        console.log(types[0]);
        embed.setColor("RANDOM");
        embed.setDescription(
          `**[Smogon](${url})**\n${
            types.length == 1
              ? `${types[0].type.name}`
              : `${types[1].type.name} | ${types[0].type.name}`
          }`
        );
        embed.addField(`Abilities`, abstr, true);
        embed.addField(`Base Stats`, bst, true);
        embed.setImage(sprite);
        message.channel.send(embed);
      })
      .catch(function(err) {
        console.error(err);
      });
  }
};
