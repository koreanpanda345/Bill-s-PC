const Ps = require('./PokemonShowdown');
const ps = new Ps();
let eevolutions = [
  "flareon",
  "jolteon",
  "sylveon",
  "vaporeon",
  "glaceon",
  "espeon",
  "umbreon",
  "leafeon"
];
module.exports = {
  /**
   * This checks if the pokemon has a cleric move. If so, it returns the cleric moves that it knows.
   * @param {string} name 
   * @returns {{success: Boolean, reason?: string, data: string[]}}
   */
  async checkIfPokemonHasClericMoves(name) {
    name = name.toLowerCase().replace("-mega", "");
    let learnset = await ps.getLearnset(name);
    let obj = [];
    if(!learnset.success) return {success: false, reason: learnset.reason};
    if(learnset.data["wish"])
      obj.push("Wish");
    if(learnset.data["healbell"])
      obj.push("Heal Bell");
    if(learnset.data["healingwish"])
      obj.push("Healing Wish");
    if(learnset.data["aromatherapy"])
      obj.push("Aromatherapy");
      // This is needed because the eevolutions technically don't learn wish through evolution,
      // so we have to treat their forms as if it was a eevee which does learn it as a egg move.
    if(eevolutions.includes(name.toLowerCase()))
      obj.push("Wish");
    return {success: true, data: obj};
  },
  /**
   * 
   * @param {string} name 
   * @return {{success: Boolean, reason?: string, data: string[]}}
   */
  async checkIFPokemonHasPivotMoves(name) {
    name = name.toLowerCase().replace("-mega", "");
    let obj = [];
    let learnset = await ps.getLearnset(name);
    if(!learnset.success) return {success: false, reason: learnset.reason};
    if(learnset.data["voltswitch"])
      obj.push("Volt Switch");
    if(learnset.data["uturn"])
      obj.push("U-turn");
    if(learnset.data["flipturn"])
      obj.push("Flip Turn");
    if(learnset.data["partingshot"])
      obj.push("Parting Shot");
    if(learnset.data["batonpass"])
      obj.push("Baton Pass");
    if(learnset.data["teleport"])
      obj.push("Teleport");
    
      return {success: true, data: obj};
  },
  
  /**
   * 
   * @param {string} name 
   * @return {{success: Boolean, reason?: string, data: string[]}}
   */
  async checkIfPokemonHasHazardsMoves(name) {
    name = name.toLowerCase().replace("-mega", "");
    let obj = [];
    let learnset = await ps.getLearnset(name);
    if(!learnset.success) return {success: false, reason: learnset.reason};
    if(learnset.data["stealthrock"])
      obj.push("Stealth Rock");
    if(learnset.data["spikes"])
      obj.push("Spikes");
    if(learnset.data["toxicspikes"])
      obj.push("Toxic Spikes");
    if(learnset.data["stickyweb"])
      obj.push("Sticky Web");    
      return {success: true, data: obj};
  },
  /**
   * 
   * @param {string} name 
   * @return {{success: Boolean, reason?: string, data: string[]}}
   */
  async checkIfPokemonHasHazardRemovalMoves(name) {
    name = name.toLowerCase().replace("-mega", "");
    let obj = [];
    let learnset = await ps.getLearnset(name);
    if(!learnset.success) return {success: false, reason: learnset.reason};
    if(learnset.data["rapidspin"])
      obj.push("Rapid Spin");
    if(learnset.data["defog"])
      obj.push("Defog");

      return {success: true, data: obj};
  
  },
  /**
   * 
   * @param {String[]} types
   * 
   */
  async TypeCalculator(types) {
    let netrual = {
      Bug: 0,
      Dark: 0,
      Dragon: 0,
      Electric: 0,
      Fairy: 0,
      Fighting: 0,
      Fire: 0,
      Flying: 0,
      Ghost: 0,
      Grass: 0,
      Ground: 0,
      Ice: 0,
      Normal: 0,
      Poison: 0,
      Psychic: 0,
      Rock: 0,
      Steel: 0,
      Water: 0
    };
    let resist = {
      Bug: 0,
      Dark: 0,
      Dragon: 0,
      Electric: 0,
      Fairy: 0,
      Fighting: 0,
      Fire: 0,
      Flying: 0,
      Ghost: 0,
      Grass: 0,
      Ground: 0,
      Ice: 0,
      Normal: 0,
      Poison: 0,
      Psychic: 0,
      Rock: 0,
      Steel: 0,
      Water: 0
    };
    let immune = {
      Bug: 0,
      Dark: 0,
      Dragon: 0,
      Electric: 0,
      Fairy: 0,
      Fighting: 0,
      Fire: 0,
      Flying: 0,
      Ghost: 0,
      Grass: 0,
      Ground: 0,
      Ice: 0,
      Normal: 0,
      Poison: 0,
      Psychic: 0,
      Rock: 0,
      Steel: 0,
      Water: 0
    };
    let weak = {
        Bug: 0,
        Dark: 0,
        Dragon: 0,
        Electric: 0,
        Fairy: 0,
        Fighting: 0,
        Fire: 0,
        Flying: 0,
        Ghost: 0,
        Grass: 0,
        Ground: 0,
        Ice: 0,
        Normal: 0,
        Poison: 0,
        Psychic: 0,
        Rock: 0,
        Steel: 0,
        Water: 0
    };  
      let typelist = [
          "Bug", 
          "Dark", 
          "Dragon", 
          "Electric", 
          "Fairy", 
          "Fighting", 
          "Fire", 
          "Flying", 
          "Ghost", 
          "Grass", 
          "Ground",
          "Ice", 
          "Normal", 
          "Poison", 
          "Psychic", 
          "Rock", 
          "Steel", 
          "Water"
        ];
    for(let type of types) {
        if(type.includes("||")) {

          typelist.forEach(x => {
            let type1 = ps.getType(x);
            let type2 = ps.getType(x);
            let upper1 = type.split("||")[0].charAt(0).toUpperCase() + type.split("||")[0].slice(1);
            let upper2 = type.split("||")[1].charAt(0).toUpperCase() + type.split("||")[1].slice(1);
            let _type1 = type1.effectiveness[upper1];
            let _type2 = type2.effectiveness[upper2];
            if(_type1 === 0 || _type2 === 0)
              immune[x]++;
            else if((_type1 === 0.5 && _type2 === 0.5) || (_type1 === 0.5 && _type2 === 1) || (_type1 === 1 && _type2 === 0.5))
              resist[x]++;
            else if((_type1 === 1 && _type2 === 1) || (_type1 === 0.5 && _type2 === 2) || (_type1 === 2 && _type2 === 0.5))
              netrual[x]++;
            else if((_type1 === 2 && _type2 === 2) || (_type1 === 1 && _type2 === 2) || (_type1 === 2 && _type2 === 1))
              weak[x]++;
          })
        }else{
        typelist.forEach(x => {
          let _type = ps.getType(x);
          let upper = type.charAt(0).toUpperCase() + type.slice(1);
          let __type = _type.effectiveness[upper];
            if(__type === 0) {
                immune[x]++;
            }
            else if(__type === 0.5) {
                resist[x]++;
            }
            else if(__type === 1) {
                netrual[x]++;
            }
            else if(__type === 2) {
                weak[x]++;
            }
        })
      }
    }
    return {
        immune: immune,
        resist: resist,
        netrual: netrual,
        weak: weak
    };
    
  }
}