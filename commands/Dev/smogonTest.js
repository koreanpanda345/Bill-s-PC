const Discord = require('discord.js');
const ascii = require('ascii-table');
const table = new ascii('Type Chart');
const fetch = require('node-fetch');
const endpoint_types = process.env.SDTYPE_ENDPOINT;
const endpoint_dex = process.env.SDDEX_ENDPOINT;
table.setHeading('', 'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water');
module.exports = {
    name: "smogon",
    aliase: "what pokemon do you want?",
    description: "This is a test to see what will the data from smogon look like.",
    category: "Dev",
    async execute(client, message, args){
        if(args[0] === "typechart"){
        fetch(`${endpoint_types}`)
        .then(res => res.text())
        .catch(error => console.error(error))
        .then(body => {
            //console.log(body);
            let res = eval(body);
            //console.log(res);
            let dmg = {};
            ['Bug',
            'Dark',
            'Dragon',
            'Electric',
            'Fairy',
            'Fighting',
            'Fire',
            'Flying',
            'Ghost',
            'Grass',
            'Ground',
            'Ice',
            'Normal',
            'Poison',
            'Psychic',
            'Rock',
            'Steel',
            'Water']
             .forEach(x => dmg[x] = res[x].damageTaken);
            let types = [
            'Bug',
            'Dark',
            'Dragon',
            'Electric',
            'Fairy',
            'Fighting',
            'Fire',
            'Flying',
            'Ghost',
            'Grass',
            'Ground',
            'Ice',
            'Normal',
            'Poison',
            'Psychic',
            'Rock',
            'Steel',
            'Water'];
            function Effectiveness(num){

                return (num === 0 ? "x1" : num === 1 ? "x2" : num === 2 ? "x1/2" : num === 3 ? "x0" : "NaN");
            }
            for(let i = 0; i < types.length; i++){

                table.addRow(types[i], 
                    Effectiveness(dmg.Bug[types[i]]),
                    Effectiveness(dmg.Dark[types[i]]),
                    Effectiveness(dmg.Dragon[types[i]]),
                    Effectiveness(dmg.Electric[types[i]]),
                    Effectiveness(dmg.Fairy[types[i]]),
                    Effectiveness(dmg.Fighting[types[i]]),
                    Effectiveness(dmg.Fire[types[i]]),
                    Effectiveness(dmg.Flying[types[i]]),
                    Effectiveness(dmg.Ghost[types[i]]),
                    Effectiveness(dmg.Grass[types[i]]),
                    Effectiveness(dmg.Ground[types[i]]),
                    Effectiveness(dmg.Ice[types[i]]),
                    Effectiveness(dmg.Normal[types[i]]),
                    Effectiveness(dmg.Poison[types[i]]),
                    Effectiveness(dmg.Psychic[types[i]]),
                    Effectiveness(dmg.Rock[types[i]]),
                    Effectiveness(dmg.Steel[types[i]]),
                    Effectiveness(dmg.Water[types[i]]));
                }
            //message.channel.send(table.toString());
            console.log(table.toString());
            return;
            });
        }
        if(args[0] === "dex"){
            let search = args[1].toLowerCase();
            console.log(search);
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
                embed.setDescription(`
                Tier: ${poke.tier} | Types: ${poke.types.length === 2 ? `${poke.types[0]} | ${poke.types[1]}` : `${poke.types[0]}`}
                Abilities: \n${abilities.replace(`undefined`, '')}`);
                embed.addField(`Base Stats`, 
                `HP: ${poke.baseStats.hp}
                ATK: ${poke.baseStats.atk}
                DEF: ${poke.baseStats.def}
                SPA: ${poke.baseStats.spa}
                SPD: ${poke.baseStats.spd}
                SPE: ${poke.baseStats.spe}`);
                
                if(poke.prevo)
                    embed.addField(`Evolves From`, poke.prevo);
                if(poke.evo)
                    embed.addField(`Evolves Into`, poke.evo[0]);
                let sprite = `${process.env.SDSPRITES_ENDPOINT}${search}.gif`;
                embed.setImage(sprite);
                message.channel.send(embed);
            
                })
        }
    }
}
