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
    name = name.replace("-mega", "");
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
    name = name.replace("-mega", "");
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
    name = name.replace("-mega", "");
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
    name = name.replace("-mega", "");
    let obj = [];
    let learnset = await ps.getLearnset(name);
    if(!learnset.success) return {success: false, reason: learnset.reason};
    if(learnset.data["rapidspin"])
      obj.push("Rapid Spin");
    if(learnset.data["defog"])
      obj.push("Defog");

      return {success: true, data: obj};
  
  }
}