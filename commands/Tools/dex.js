const Discord = require("discord.js");
const Pokedex = require("pokedex-promise-v2");
const P = new Pokedex();
const options = ["item", "ability", "move"];

module.exports = {
  name: "dex",
  aliases: ["search", "p"],
  hasArgs: true,
  args: "<pokemon name/item/move/ability> (if item/move/ability, please enter the name of item/move/ability.)",
  description: "Displays info about a pokemon.",
  category: "Tools",
  usage: "b!dex Mega Lopunny",
  execute(client, message, args) {
    if(args[0] === 'item'){
      let search = args.join(" ").slice(args[0].length + 1);
      P.getItemByName(search.toLowerCase().replace(/ +/g, "-"))
      .then(function(response){
        //console.log(response);
        let embed = new Discord.MessageEmbed();
        embed.setColor('RANDOM')
        embed.setTitle(`${search}`)
        embed.setDescription(`${response.effect_entries[0].effect}`)
        message.channel.send(embed);
      })
      .catch(function(err){
        console.error(err);
        return message.channel.send(`I couldn't find that item, maybe you spelt it wrong?`)
      })
    }
    else if(args[0] === "ability"){
      let search = args.join(" ").slice(args[0].length + 1);
      P.getAbilityByName(search.toLowerCase().replace(/ +/g, "-"))
      .then(function(response){
        //console.log(response);
        let embed = new Discord.MessageEmbed();
        embed.setColor('RANDOM')
        embed.setTitle(`${search}`)
        embed.setDescription(`${response.effect_entries[0].effect}`)
        message.channel.send(embed);
      })
      .catch(function(err){
        console.error(err);
        return message.channel.send(`I couldn't find that ability, maybe you spelt it wrong?`)
      })
    }
    else if(args[0] === "move"){
      let search = args.join(" ").slice(args[0].length + 1);
      P.getMoveByName(search.toLowerCase().replace(/ +/g, "-"))
      .then(function(response){
        console.log(response);
        let embed = new Discord.MessageEmbed();
        embed.setColor('RANDOM')
        embed.setTitle(`${search}`)
        embed.setDescription(`${response.effect_entries[0].effect}`)
        embed.addFields([
          {name: 'Accuracy', value: response.accuracy, inline: true},
          {name: `Base Power`, value: response.power, inline: true},
          {name: `Damage Type`, value: response.damage_class.name, inline: true},
          {name: "Type", value: response.type.name, inline: true}
        ]);
        message.channel.send(embed);
      })
      .catch(function(err){
        console.error(err);
        return message.channel.send(`I couldn't find that move, maybe you spelt it wrong?`)
      })
    }
    if(!options.includes(args[0])){
    let search = "";
    if (args[0].toLowerCase() === "mega") {
      let str = args.join(" ");
      let temp = str.replace("mega ", "");
      search = temp + "-mega";
    } else {
      search = args[0];
    }
    //console.log(search);
    P.getPokemonByName(search)
      .then(function(response) {
        //console.log(response);
        let embed = new Discord.MessageEmbed();
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
      return message.channel.send(`I couldn't find that pokemon, maybe you spelt it wrong?`)
      });
  }
}
};
