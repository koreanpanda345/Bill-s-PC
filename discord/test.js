const {getInfoOnOpponentTeam} = require('./Util/Teambuilder');
module.exports = {
    async Teambuilder() {
        await getInfoOnOpponentTeam(["Lopunny", "Cinccino", "Milotic", "Morpeko", "Drapion", "Ditto"]);
    }
}
