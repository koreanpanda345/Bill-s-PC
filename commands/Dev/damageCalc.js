const {Sets} = require("@pkmn/sets");
const fetch = require('node-fetch');
const {Generations} = require('@pkmn/calc');
const {Dex} = require('@pkmn/dex');
const {calculate, Pokemon, Move} = require('@smogon/calc');
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: "damagecalc",
    aliases: ['calc', 'damage'],
    hasArgs: true,
    args: "<attacking pokemon set>, <defending pokemon set>",
    usage: `b!damagecalc Krookodile @ Choice Scarf
    Ability: Moxie
    EVs: 252 Atk / 4 SpD / 252 Spe
    Jolly Nature
    - Earthquake
    - Knock Off
    - Stone Edge
    - Superpower, Gengar @ Life Orb
    Ability: Cursed Body
    EVs: 252 SpA / 4 SpD / 252 Spe
    Timid Nature
    IVs: 0 Atk
    - Shadow Ball
    - Sludge Wave
    - Focus Blast
    - Icy Wind`,
    description: "Will calc all four moves of the first pokemon you pass in.",
    category: "Tools",
    execute(client, message, args){
        let str = args.join(" ");
        let arglist = str.split(",");
        let count = arglist.length;
        for(let i = 0; i < count; i++){
          if(arglist[i].startsWith(" ")){
            let _str = arglist[i].replace(" ", "");
            arglist[i] = _str;
          }
        }
        let pkm1 = arglist[0];
        let pkm2 = arglist[1];
        let set1 = Sets.importSet(pkm1);
        let set2 = Sets.importSet(pkm2);
        console.log(set1);
        console.log(set2);
        let gen = new Generations(Dex).get(8);
        let attacker = new Pokemon(gen, set1.species, {
            item: set1.item,
            nature: set1.nature,
            ability: set1.ability
        });
        if(set1.evs)
            attacker.evs = set1.evs;
        if(set1.ivs)
            attacker.ivs = set1.ivs;
        let defender = new Pokemon(gen, set2.species, {
            item: set2.item,
            nature: set2.nature,
            ability: set2.ability
        });
        if(set2.evs)
            defender.evs = set2.evs;
        if(set2.ivs)
            defender.ivs = set2.ivs;
        let desc = "";
        for(let i = 0; i < set1.moves.length; i++){
            let move = new Move(gen, set1.moves[i]);

            const result = calculate(gen, attacker, defender, move);
            let percent1 = Math.floor(Math.round(result.damage[0] / result.defender.originalCurHP * 100));
            let percent2 = Math.floor(Math.round(result.damage[result.damage.length - 1] / result.defender.originalCurHP * 100));
            let _result = "";
            if(result.damage !== 0){
                _result += `${result.rawDesc.attackBoost !== (undefined || 0) ? `${result.rawDesc.attackBoost}+ `: ''}${result.rawDesc.attackEVs} ${result.rawDesc.attackerName} ${result.rawDesc.moveName} (${result.move.bp} bp)`;
                _result += ` vs.`;
                _result += ` ${result.rawDesc.HPEVs} / ${result.rawDesc.defenseEVs} ${result.rawDesc.defenderName}`;
                _result += `: ${result.damage[0]} - ${result.damage[result.damage.length - 1]} (${percent1}% - ${percent2}%)`;    
            } else{
                _result += `${result.rawDesc.attackerName} ${result.rawDesc.moveName} vs. ${result.rawDesc.defenderName}: Does nothing. (0%)`;
            }
            desc += `${_result}\n`;
            console.log(_result);
        }
        
        let embed = new MessageEmbed();
        embed.setTitle('Damage Calcs');
        embed.setDescription(`**${desc}**`);
        embed.setColor('RANDOM');
        embed.addField(`Attacking Pokemon`, pkm1, true);
        embed.addField(`Defending Pokemon`, pkm2, true);

        message.channel.send(embed);

    }
}