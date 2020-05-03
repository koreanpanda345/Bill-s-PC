const Discord = require("discord.js");
const Pokedex = require("pokedex-promise-v2");
const P = new Pokedex();
const options = ["item", "ability", "move"];
const fetch = require('node-fetch');
const endpoint_items = process.env.SDITEMS_ENDPOINT;
const endpoint_moves = process.env.SDMOVES_ENDPOINT;
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const endpoint_ability = process.env.SDABILITY_ENDPOINT;

const typeColor = require('./../../Util/TypeColor');
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
      let _search = args.join(" ").slice(args[0].length + 1);
      fetch(endpoint_items)
      .then(res => res.text())
      .catch(error => console.error(error))
      .then((body) => {
        let res = eval(body);
        console.log(res);
        let search = _search.toLowerCase().replace(/ +/g, "");
        let item = res[search];
        let embed = new Discord.MessageEmbed();
        embed.setColor('RANDOM');
        embed.setTitle(`Info on ${item.name}`);
        embed.setDescription(`Description: ${item.desc}`);
        if(item.megaStone)
          embed.addField(`Mega Evolves:`, `${item.megaEvolves}`);
        if(item.fling)
          embed.addField(`Fling Power:`, `${item.fling.basePower}`);
        message.channel.send(embed);
        })
      .catch(function(err){
        console.error(err);
        return message.channel.send(`I couldn't find that item, maybe you spelt it wrong?`)
      })
    }
    else if(args[0] === "ability"){
      let _search = args.join(" ").slice(args[0].length + 1);
      fetch(endpoint_ability)
      .then(res => res.text())
      .catch(error => console.error(error))
      .then(body => {
        let res = eval(body);
        //console.log(res);
        let search = _search.toLowerCase().replace(/ +/g, "");
        let ability = res[search];
        console.log(ability);
        let embed = new Discord.MessageEmbed();
        embed.setTitle(`Info on ${ability.name}`);
        embed.setDescription(`Description: ${ability.desc}\n\nShort Description: ${ability.shortDesc}`);
        embed.setColor(`RANDOM`);
        embed.addField(`Rating`, `${ability.rating}`)
        message.channel.send(embed);
      })
      .catch(function(err){
        console.error(err);
        return message.channel.send(`I couldn't find that ability, maybe you spelt it wrong?`)
      })
    }
    else if(args[0] === "move"){
      let _search = args.join(" ").slice(args[0].length + 1);
      fetch(endpoint_moves)
      .then(res => res.text())
      .catch(error => console.error(error))
      .then(body => {  
        let res = eval(body);
        //console.log(res);
        let search = _search.toLowerCase().replace(/ +/g, "");
        let move = res[search];
        console.log(move);
        let embed = new Discord.MessageEmbed();
      embed.setColor(typeColor[move.type][random(typeColor[move.type].length)]);
      embed.setTitle(`Info on ${move.name}`);
      embed.setDescription(`Description: ${move.desc}\n\nShort Description: ${move.shortDesc}`);
      embed.addField(`Accuracy: `, `${move.accuracy === true ? "---" : move.accuracy}`, true);
      embed.addField(`${move.category} | Base Power: `, `${move.basePower === 0 ? "---" : move.basePower}`, true);
      embed.addField(`PP:`, `${move.pp} PP`, true);
      embed.addField(`Priority`, `${move.priority}`, true);
      embed.addField(`Type`, `${move.type}`, true);
      embed.addField(`Target`, `${move.target === 'normal' ? "Adjacent Pokemon" : move.target}`, true);
      message.channel.send(embed);
      })
      .catch(function(err){
        console.error(err);
        return message.channel.send(`I couldn't find that move, maybe you spelt it wrong?`)
      })
    }
    if(!options.includes(args[0])){
      let search = args.join(" ").toLowerCase();
      if(search.toLowerCase().includes("mega ")){
        let temp = search.replace("mega ", "");
        search = temp + "mega";
      }

      fetch(`${endpoint_dex}`)
      .then(res => res.text())
      .catch(error => console.error(error))
      .then(body => {
          //console.log(body);
          let res = eval(body);
          //console.log(res);
          let poke = res[search];
          console.log(poke);
          let abilities;
          let ab = Object.values(poke.abilities);
          console.log(ab);
          for(let i = 0; i < ab.length; i++){
              abilities += `${ab[i]}\n`;
          }
          let embed = new Discord.MessageEmbed();
          embed.setTitle(`Info On ${poke.name}`);
          embed.setColor(typeColor[poke.types[0]][random(typeColor[poke.types[0]].length)]);
          embed.setDescription(`
          Tier: ${poke.tier === undefined ? "Illegal" : poke.tier} | Types: ${poke.types.length === 2 ? `${poke.types[0]} ${poke.types[1]}` : `${poke.types[0]}`}
          \nAbilities: \n${abilities.replace(`undefined`, '')}\n[Can find more about ${poke.name}](https://www.smogon.com/dex/ss/pokemon/${search})`);
          embed.addField(`Base Stats`, 
          `**__HP__: ${poke.baseStats.hp}
          __ATK__: ${poke.baseStats.atk}
          __DEF__: ${poke.baseStats.def}
          __SPA__: ${poke.baseStats.spa}
          __SPD__: ${poke.baseStats.spd}
          __SPE__: ${poke.baseStats.spe}**`, true);
          embed.addField(`Height: ${poke.heightm}m\nWeight: ${poke.weightkg}kg\nColor: ${poke.color}`, '\u200b', true)
          embed.addField(`\u200b`, `\u200b`);
          if(poke.prevo)
              embed.addField(`Evolves From`, poke.prevo, true);
          if(poke.evo)
              embed.addField(`Evolves Into`, poke.evo[0], true);
              let sprite = `https://play.pokemonshowdown.com/sprites/ani/${poke.name.toLowerCase()}.gif`;
          embed.setImage(sprite);
          if(poke.otherFormes)
          embed.addField("Other Forms", poke.otherFormes.toString().replace(/,+/g, ", "), true);
          message.channel.send(embed);
          })
      .catch(function(err) {
        console.error(err);
      return message.channel.send(`I couldn't find that pokemon, maybe you spelt it wrong?`)
      });
  }
}
};

function random(max){
  return Math.floor(Math.random() * max);
}
