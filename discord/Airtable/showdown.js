const Airtable = require("airtable");

module.exports = class Showdown {
    /**
     * @type {Airtable.Base}
     */
    base;
    /**
     * @type {{showdown_name: string, discord_id: string}}
     */
    data;
    /**
     * 
     * @param {Airtable.Base} base 
     * @param {{showdown_name: string, discord_id: string}} data 
     */
    constructor(base, data) {
        this.base = base;
        this.data = data;
    }

    checkIfShowdownNameExist = async() => {
        let result = await new Promise((resolve, reject) => {
            this.base
            .select({
                filterByFormula: `ShowdownName=${this.data.showdown_name}`
            }).eachPage((records, _) => {
                if(!records.length) return resolve(false);
                return resolve(true);
            })
        })
        return result;
    }

    addShowdownName = async() => {
        let result = await new Promise((resolve, reject) => {
            return this.base.create(
                [
                    {
                        fields: {
                            ShowdownName: this.data.showdown_name,
                            DiscordId: this.data.discord_id
                        }
                    }
                ], (err, record) => {
                    if(err) {
                        console.error(err);
                        return reject(false);
                    }
                    return resolve(true);
                });
        });
        return result;
    }

    getDiscordId = async() => {
        let result = await new Promise((resolve, reject) => {
            this.base
            .select({
                filterByFormula: `ShowdownName=${this.data.showdown_name}`
            }).eachPage((records, _) => {
                records.forEach((record) => {
                    resolve(record.get("DiscordId"));
                })
            })
        })
        return result;
    }
}