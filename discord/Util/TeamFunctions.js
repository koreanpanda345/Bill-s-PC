const { Generations } = require("@pkmn/data");
const { Dex } = require("@pkmn/dex");
module.exports = {
  /**
   *
   * @param {string[]} types
   */
  TypeCoverage(types) {
    const coverage = [];
    for (var type of types) {
      let _type = Dex.getType(type).damageTaken;
      coverage.push(_type);
    }
    if (coverage.length == 1) {
      for(var __type of coverage){
        coverage[0][__type] =
        coverage[0][__type] == 0 && coverage[1][__type] == 0
          ? 0
          : coverage[0][__type] == 0 && coverage[1][__type] == 0.5
          ? 0
          : coverage[0][__type] == 0 && coverage[1][__type] == 1
          ? 0
          : coverage[0][__type] == 0 && coverage[1][__type] == 2
          ? 0
          : coverage[0][__type] == 0.5 && coverage[1][__type] == 0
          ? 0
          : coverage[0][__type] == 0.5 && coverage[1][__type] == 0.5
          ? 0.25
          : coverage[0][__type] == 0.5 && coverage[1][__type] == 1
          ? 0.5
          : coverage[0][__type] == 0.5 && coverage[1][__type] == 2
          ? 0.5
          : coverage[0][__type] == 1 && coverage[1][__type] == 0
          ? 0
          : coverage[0][__type] == 1 && coverage[1][__type] == 0.5
          ? 0.5
          : coverage[0][__type] == 1 && coverage[1][__type] == 1
          ? 1
          : coverage[0][__type] == 1 && coverage[1][__type] == 2
          ? 2
          : coverage[0][__type] == 2 && coverage[1][__type] == 0
          ? 0
          : coverage[0][__type] == 2 && coverage[1][__type] == 0.5
          ? 1
          : coverage[0][__type] == 2 && coverage[1][__type] == 1
          ? 2
          : coverage[0][__type] == 2 && coverage[1][__type] == 2
          ? 4
          : 0;
      }
      console.log(coverage[0])
    }
    console.log(coverage);
  },
};
