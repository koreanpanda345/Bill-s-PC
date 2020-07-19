const { Sets } = require("@pkmn/sets");
const { Generations } = require("@pkmn/data");
const { Dex } = require("@pkmn/dex");
const axios = require("axios").default;
const endpoint_items = process.env.SDITEMS_ENDPOINT;
const endpoint_moves = process.env.SDMOVES_ENDPOINT;
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const endpoint_ability = process.env.SDABILITY_ENDPOINT;
const endpoint_sprites = process.env.SDSPRITES_ENDPOINT;
const { calculate, Pokemon, Move, Field } = require("@smogon/calc");
module.exports = class PokemonShowdown {
  constructor() {}
  itemDex = async (name) => {
    let item = Dex.getItem(name);
    if (item.num === 0) {
      let data = await new Promise((resolve, reject) => {
        axios.get(endpoint_items).then((res) => {
          let json = eval(res.data);
          let _item = json[name];
          if (_item.num == 0)
            return {
              reason: "Couldn't find a item under that name.",
              success: false,
            };
          return resolve({ data: _item, success: true });
        });
      });
      return data;
    }
    return { data: item, success: true };
  };
  moveDex = async (name) => {
    let move = Dex.getMove(name);
    if (move.num === 0) {
      let data = await new Promise((resolve, reject) => {
        axios.get(endpoint_moves).then((res) => {
          let json = eval(res.data);
          let _move = json[name];
          if (_move.num == 0)
            return resolve({
              reason: "Couldn't find a move under that name.",
              success: false,
            });
          return resolve({ data: _move, success: true });
        });
      });
      return data;
    }
    return { data: move, success: true };
  };
  abilityDex = async (name) => {
    let ability = Dex.getAbility(name);
    if (ability.num === 0) {
      let data = await new Promise((resolve, reject) => {
        axios.get(endpoint_ability).then((res) => {
          let json = eval(res.data);
          let _ability = json[name];
          if (_ability.num == 0)
            return {
              reason: "Couldn't find a ability under that name.",
              success: false,
            };
        });
      });
      return data;
    }
    return { data: ability, success: true };
  };

  pokemonDex = async (name) => {
    let pokemon = Dex.getSpecies(name);
    if (pokemon.num === 0) {
      let data = await new Promise((resolve, reject) => {
        axios.get(endpoint_dex).then((res) => {
          let json = eval(res.data);
          let _pokemon = json[name];
          if (_pokemon.num == 0)
            return {
              reason: "Couldn't find a pokemon under that name.",
              success: false,
            };
          return resolve({ data: _pokemon, success: true });
        });
      });
      return data;
    }
    return { data: pokemon, success: true };
  };
  /**
   *
   * @param {string} name
   */
  pokemonSprites = async (name) => {
    name = name.toLowerCase();
    return `${endpoint_sprites}${name}.gif`;
  };
  damageCalc = async (data) => {
    if (!data.attacking)
      return { reason: "There was no attacking pokemon set.", success: false };
    if (!data.defending)
      return { reason: "There was no defending pokemon set.", success: false };

    let atkSet = Sets.importSet(data.attacking);
    let defSet = Sets.importSet(data.defending);
    let field;
    if (data.field !== undefined)
      field = new Field({
        defenderSide: {
          isSR: data.field.sr == null ? false : data.field.sr,
          spikes: data.field.spikes == null ? 0 : data.field.spikes,
          isSeeded: data.field.seeds == null ? false : data.field.seeds,
          isLightScreen:
            data.field.lightScreen == null ? false : data.field.lightScreen,
          isReflect: data.field.reflect == null ? false : data.field.reflect,
          isAuroraVeil: data.field.veil == null ? false : data.field.veil,
        },
      });

    let atkGen =
      new Generations(Dex).get(8).species.get(atkSet.species) == undefined
        ? new Generations(Dex).get(7)
        : new Generations(Dex).get(8);
    let defGen =
      new Generations(Dex).get(8).species.get(defSet.species) == undefined
        ? new Generations(Dex).get(7)
        : new Generations(Dex).get(8);

    let attacker = new Pokemon(atkGen, atkSet.species, {
      item: atkSet.item,
      nature: atkSet.name,
      ability: atkSet.ability,
    });

    if (atkSet.evs) attacker.evs = atkSet.evs;
    if (atkSet.ivs) attacker.ivs = atkSet.ivs;

    let defender = new Pokemon(defGen, defSet.species, {
      item: defSet.item,
      nature: defSet.nature,
      ability: defSet.ability,
    });

    if (defSet.evs) defender.evs = defSet.evs;
    if (defSet.ivs) defender.ivs = defSet.ivs;

    for (let i = 0; i < atkSet.moves.length; i++) {
      let move = new Move(atkGen, atkSet.moves[i]);
      let result;
      // @TODO Implement a way to allow mega pokemon to be the defending pokemon.
      if (data.field !== undefined)
        result = calculate(
          new Generations(Dex).get(8),
          attacker,
          defender,
          move,
          field
        );
      else
        result = calculate(
          new Generations(Dex).get(8),
          attacker,
          defender,
          move
        );
      console.log(result);
    }
  };
};
