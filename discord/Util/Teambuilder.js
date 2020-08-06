const Ps = require('./PokemonShowdown');
const { checkIfPokemonHasClericMoves, checkIFPokemonHasPivotMoves, checkIfPokemonHasHazardRemovalMoves, checkIfPokemonHasHazardsMoves, TypeCalculator } = require('./DraftFunction');
const ps = new Ps();
module.exports = {
    /**
     * 
     * @param {String[]} team 
     */
    async getInfoOnOpponentTeam(team) {
        let out = {
            cleric_pokemon: [],
            pivot_pokemon: [],
            hazard_pokemon: [],
            hazard_removal_pokemon: [],
            types: [],
            speed_tiers: [],
            abilities: [],
            typechart: {},
        };
        for(let i = 0; i < team.length; i++) {
            let x = team[i];
            let cleric  = await checkIfPokemonHasClericMoves(x);
            console.log(cleric);
            let pivot   = await checkIFPokemonHasPivotMoves(x);
            console.log(pivot)
            let hazards = await checkIfPokemonHasHazardsMoves(x);
            console.log(hazards);
            let removal = await checkIfPokemonHasHazardRemovalMoves(x);
            console.log(removal);
            if(!(cleric.success || pivot.success || hazards.success || removal.success)) 
            return {
                success: false,
                reason: 
                    !cleric.success 
                        ? cleric.reason 
                        : !pivot.success 
                            ? pivot.reason 
                            : !hazards.success 
                                ? hazards.reason 
                                : !removal.success 
                                    ? removal.reason 
                                    : "Something happen"
            };
            
            if(cleric.data.length !== 0)    out.cleric_pokemon.push({pokemon: x, moves: cleric.data});
            if(pivot.data.length !== 0)     out.pivot_pokemon.push({pokemon: x, moves: pivot.data});
            if(hazards.data.length !== 0)   out.hazard_pokemon.push({pokemon: x, moves: hazards.data});
            if(removal.data.length !== 0)   out.hazard_removal_pokemon.push({pokemon: x, moves: removal.data});
            let pokemon = await ps.pokemonDex(x);
            let types = pokemon.data.types;
            out.types.push(
                types.length == 2 
                    ? `${types[0]} || ${types[1]}` 
                    : `${types[0]}`
            );
            out.speed_tiers.push({pokemon: pokemon.data.name, speed: pokemon.data.baseStats.spe});
            out.abilities.push({pokemon: pokemon.data.name, "0": pokemon.data.abilities["0"], "1": pokemon.data.abilities["1"], H: pokemon.data.abilities.H, S: pokemon.data.abilities.S});
            
        }
        let typechart = await TypeCalculator(out.types);
        out.typechart = typechart;
        console.log(out);
        return out;
    }
}