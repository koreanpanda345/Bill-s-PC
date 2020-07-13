const Discord = require("discord.js");
const Pokedex = require("pokedex-promise-v2");
const P = new Pokedex();
/***
 * This is the coverage command
 * This command will display the type coverage of a type.
 * @TODO Implement pokemon into this, and double typing coverage.
 */

//This is to check if the type that was provide is a type.
let types = [
  "normal", //1
  "water", //2
  "fire", //3
  "grass", //4
  "fighting", //5
  "poison", //6
  "fairy", //7
  "steel", //8
  "dark", //9
  "bug", //10
  "psychic", //11
  "electric", //12
  "ground", //13
  "rock", //14
  "ice", //15
  "dragon", //16
  "flying", //17
  "ghost" //18
];
module.exports = {
  name: "coverage",
  aliases: ["cover"],
  hasArgs: true,
  args: "<type>",
  description: "Shows coverage for a certain type.",
  category: "Tools",
  usage: "b!coverage bug",
  execute(client, message, args) {
    if (!types.includes(args[0].toLowerCase())) return;
    P.getTypeByName(args[0].toLowerCase())
      .then(function(response) {
        let embed = new Discord.MessageEmbed();
        embed.setColor("RANDOM");
        embed.setTitle(`Coverage for ${args[0].toLowerCase()}`);
        console.log(response);
        //Double Damage From
        let ddf = response.damage_relations.double_damage_from;
        //Double Damage To
        let ddt = response.damage_relations.double_damage_to;
        //Half Damage From
        let hdf = response.damage_relations.half_damage_from;
        //Half Damage To
        let hdt = response.damage_relations.half_damage_to;
        //No Damage From
        let ndf = response.damage_relations.no_damage_from;
        //No Damage to
        let ndt = response.damage_relations.no_damage_to;
        /*
            console.log(ddf);
            console.log(ddt);
            console.log(hdf);
            console.log(hdt);
            console.log(ndf);
            console.log(ndt);
            */
        //This adds the data from PokeApi to its own field.
        //This reuses the str variable to descrease the amount of variables i have to deal with ^-^
        let str = "";
        if (ddf.length) {
          for (let i = 0; i < ddf.length; i++) {
            str += ddf[i].name + "\n";
          }
          embed.addField("Double damage from", str);
          str = "";
        }
        if (ddt.length) {
          for (let i = 0; i < ddt.length; i++) {
            str += ddt[i].name + "\n";
          }
          embed.addField("Double damage to", str);
          str = "";
        }
        if (hdf.length) {
          for (let i = 0; i < hdf.length; i++) {
            str += hdf[i].name + "\n";
          }
          embed.addField("Half damage from", str);
          str = "";
        }
        if (hdt.length) {
          for (let i = 0; i < hdt.length; i++) {
            str += hdt[i].name + "\n";
          }
          embed.addField("Half damage to", str);
          str = "";
        }
        if (ndf.length) {
          for (let i = 0; i < ndf.length; i++) {
            str += ndf[i].name + "\n";
          }
          embed.addField("No damage from", str);
          str = "";
        }
        if (ndt.length) {
          for (let i = 0; i < ndt.length; i++) {
            str += ndt[i].name + "\n";
          }
          embed.addField("No damage to", str);
          str = "";
        }

        message.channel.send(embed);
      })
      .catch(function(err) {
        console.error(err);
      });
  }
};
