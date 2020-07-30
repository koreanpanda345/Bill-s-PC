const Airtable = require("airtable");
var base = new Airtable({apiKey: process.env.AIRTABLE_API}).base(process.env.AIRTABLE_TABLE)('Settings');

module.exports = class DatabaseSetting {
  /**
   * @type {{guildId: string}}
   */
  data;
  /**
   * 
   * @param {{guildId: string}} data 
   */
  constructor(data) {
    this.data = data;
  }
  /**
   * @name createGuildSettings
   * @summary Creates The guild's settings in the database.
   * @param {{prefix: string}} data 
   * @returns {Boolean}
   */
  createGuildSettings = async(data) => {
    let result = await new Promise((resolve, reject) => {
      base.create([{
        fields: {
          guildId: this.data.guildId,
          Prefix: data.prefix,
        }
      }], (err, _) => {
        if(err) return reject(false);
        return resolve(true);
      })
    })
    return result;
  }
  /**
   * @name checkIfGuildSettingsExist
   * @summary This checks if guild's settings exist in the database.
   * @returns {Boolean}
   */
  checkIfGuildSettingsExist = async() => {
    let result = await new Promise((resolve, _) => {
      base.select({
        filterByFormula: `guildId = ${this.data.guildId}`
      }).eachPage((records, _) => {
        if(!records.length) return resolve(false);
        return resolve(true);
      })
    })
    return result;
  }
  getGuildSettings = async() => {
    let result = await new Promise((resolve, _) => {
      base.select({
        filterByFormula: `guildId = ${this.data.guildId}`
      }).eachPage((records, _) => {
        records.forEach((record) => {
          return resolve({
            record_id: record.getId(),
            prefix: record.get('Prefix')
          });
        })
      })
    })
    return result;
  }
  deleteGuildSettings = async() => {
    let result = await new Promise( async(resolve, _) => {
      let check = await this.checkIfGuildSettingsExist();
      if(!check) return {success: false, reason: "Guild Settings Don't exist.", errorcode: 404}
    })
  }
};