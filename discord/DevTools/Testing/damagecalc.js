const PokemonShowdown = require('../../Util/PokemonShowdown.js');
module.exports = async () => {
  const sd = new PokemonShowdown();
  const dmg = sd.damageCalc({
    attacking: `Krookodile @ Choice Scarf
    Ability: Moxie
    EVs: 252 Atk / 4 SpD / 252 Spe
    Jolly Nature
    - Earthquake
    - Knock Off
    - Stone Edge
    - Superpower`,
    defending: `Gengar @ Gengarite
    Ability: Cursed Body
    EVs: 252 SpA / 4 SpD / 252 Spe
    Timid Nature
    IVs: 0 Atk
    - Shadow Ball
    - Sludge Wave
    - Focus Blast
    - Icy Wind`
  })
}