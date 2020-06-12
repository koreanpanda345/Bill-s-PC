const Discord = require("discord.js");
const options = ["item", "ability", "move"];
const fetch = require('node-fetch');
const endpoint_items = process.env.SDITEMS_ENDPOINT;
const endpoint_moves = process.env.SDMOVES_ENDPOINT;
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const endpoint_ability = process.env.SDABILITY_ENDPOINT;
const endpoint_sprites = process.env.SDSPRITES_ENDPOINT;
const typeColor = require('./../../Util/TypeColor');
const Ps = require('./../../Util/PokemonShowdown');
module.exports = {
  name: "dex",
  aliases: ["search", "p"],
  hasArgs: true,
  args: "<pokemon name/item/move/ability> (if item/move/ability, please enter the name of item/move/ability.)",
  description: "Displays info about a pokemon.",
  category: "Tools",
  usage: "b!dex Mega Lopunny",
  async execute(client, message, args) {
    let ps = new Ps();
    if(args[0] === 'item'){
      let _search = args.join(" ").slice(args[0].length + 1);
      let search = _search.toLowerCase().replace(/ +/g, "");
      let item = await (await ps.itemDex(search));

      let embed = new Discord.MessageEmbed();

      if(!item.success) {
       embed.setColor("RED");
       embed.setTitle("Error");
       embed.setDescription(item.reason); 
        return message.channel.send(embed);
      }

      embed.setColor('RANDOM');
      embed.setTitle(`Info on ${item.data.name}`);
      embed.setDescription(`Description: ${item.data.desc}`);
      if(item.megaStone)
        embed.addField(`Mega Evolves:`, `${item.data.megaEvolves}`);
      if(item.fling)
        embed.addField(`Fling Power:`, `${item.data.fling.basePower}`);
      message.channel.send(embed);
    }
    else if(args[0] === "ability"){
      let _search = args.join(" ").slice(args[0].length + 1);
      let search = _search.toLowerCase().replace(/ +/g, "");
        let ability = await ps.abilityDex(search);
        let embed = new Discord.MessageEmbed();
        if(!ability.success){
          embed.setColor("RED");
          embed.setTitle("Error");
          embed.setDescription(ability.reason);
          return message.channel.send(embed);
        }
        embed.setTitle(`Info on ${ability.data.name}`);
        embed.setDescription(`Description: ${ability.data.desc}\n\nShort Description: ${ability.data.shortDesc}`);
        embed.setColor(`RANDOM`);
        embed.addField(`Rating`, `${ability.data.rating}`)
        message.channel.send(embed);

    }
    else if(args[0] === "move"){
      let _search = args.join(" ").slice(args[0].length + 1);
    
        let search = _search.toLowerCase().replace(/ +/g, "");
        let move = await ps.moveDex(search);
        let embed = new Discord.MessageEmbed();
        if(!move.success){
          embed.setColor("RED");
          embed.setTitle("Error");
          embed.setDescription(move.reason);
          return message.channel.send(embed);
        }
      embed.setColor(typeColor[move.data.type][random(typeColor[move.data.type].length)]);
      embed.setTitle(`Info on ${move.data.name}`);
      embed.setDescription(`Description: ${move.data.desc}\n\nShort Description: ${move.data.shortDesc}`);
      embed.addField(`Accuracy: `, `${move.data.accuracy === true ? "---" : move.data.accuracy}`, true);
      embed.addField(`${move.data.category} | Base Power: `, `${move.data.basePower === 0 ? "---" : move.data.basePower}`, true);
      embed.addField(`PP:`, `${move.data.pp} PP`, true);
      embed.addField(`Priority`, `${move.data.priority}`, true);
      embed.addField(`Type`, `${move.data.type}`, true);
      embed.addField(`Target`, `${move.data.target === 'normal' ? "Adjacent Pokemon" : move.data.target}`, true);
      message.channel.send(embed);
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
          let sprite = `${endpoint_sprites}${poke.name.toLowerCase()}.gif`;
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
