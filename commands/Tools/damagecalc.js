const Discord = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "damagecalc",
  aliases: ["damage", "calc", "dc"],
  hasArgs: true,
  args: "Attacking pokemon, Defending Pokemon, Attacking Move",
  description: "Allows you to calc things.",
  category: "Tools",
  execute(client, message, args) {
    return;
    let str = args.join(" ");
    let arglist = str.split(",");
    let atkstr = arglist[0];
    let defstr = arglist[1];
    let moveStr = arglist[2];
    let atklist = atkstr.split(" - ");
    /**
     * mega lopunny - lopunnite - Scrappy - Evs: 252 Atk/ 4 SpD/ 252 Spe
     */
    let atkEv = atklist[4].split("/ ");
    let atkIv = atklist[5].split("/ ");
    let atkObj = {
      speices: atklist[0],
      ability: atklist[2],
      item: atklist[1],
      evs: atkEv || "",
      ivs: atkIv || "",
      level: 100,
      nature: atklist[3]
    };
    let deflist = defstr.split("-");
    let defEv = deflist[4].split("/ ");
    let defIv = deflist[5].split("/ ");
    let defObj = {
      speices: deflist[0],
      ability: deflist[2],
      item: deflist[1],
      evs: defEv || "",
      ivs: defIv || "",
      level: 100,
      nature: deflist[3]
    };
    const attackerObject = {
      speices: atkObj.speices,
      ability: atkObj.ability,
      item: atkObj.item,
      level: atkObj.level,
      nature: atkObj.nature,
      evs: atkEv,
      ivs: atkIv
    };
    const defenderObject = {
      species: defObj.speices,
      ability: defObj.ability,
      item: defObj.item,
      level: defObj.level,
      nature: defObj.nature,
      evs: defObj.evs,
      ivs: defObj.ivs
    };
    const move = moveStr;
    superagent
      .post("https://calc-api.herokuapp.com/calc-api")
      .send({ attacker: attackerObject, defender: defenderObject, move: move })
      .then(res => {
        console.log(res);
      });
  }
};
