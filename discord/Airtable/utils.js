const Airtable = require('airtable');
const { updateSetAccessor } = require('typescript');
module.exports = class Utils {
  /**
   * @type {Airtable.base}
   */
  suggestBase;
    /**
   * @type {Airtable.base}
   */
  bugBase;
    /**
   * @type {Airtable.base}
   */
  settingBase;
    /**
   * @type {Airtable.base}
   */
  updateBase;
  /**
   * @type {SettingBase}
   */
  settings;
  /**
   * @type {UpdateBase}
   */
  updates;
  /**
   * 
   * @param {Airtable.Base} suggestBase 
   * @param {Airtable.Base} bugBase 
   * @param {Airtable.Base} settingBase 
   * @param {Airtable.Base} updateBase 
   * @param {{}} data 
   */
  
  constructor(suggestBase, bugBase, settingBase, updateBase, data){
    this.bugBase = bugBase;
    this.settingBase = settingBase;
    this.suggestBase = suggestBase;
    this.updateBase = updateBase;
    this.settings = new SettingBase(this.settingBase, data);
    this.updates = new UpdateBase(this.updateBase, data);
  }

}

class SettingBase{
  /**
   * @type {Airtable.Base}
   */
  base;
  /**
   * @type {{}}
   */
  data;
  /**
   * 
   * @param {Airtable.Base} base 
   * @param {{}} data 
   */
  constructor(base, data){
    this.base = base;
    this.data = data;
  }
  CreateGuildSettingObject = async(settings) => {
    let result = await new Promise(async(resolve, reject) => {
      return this.base.create(
        [
          {
            fields: {
              guildId: this.data.guildId,
              Prefix: settings.prefix
            }
          }
        ], (err, _) => {
          if(err){
            console.error(err);
            return reject(false);
          }
          return resolve(true);
        })
    })
    return result;
  }

  CheckIFGuildSettingsExist = async() => {
    let result = await new Promise( async(resolve, reject) => {
      this.base.select({
        filterByFormula: `{guildId} = ${this.data.guildId}`
      }).eachPage((records, _) => {
        if(!records.length) return resolve(false);
        return resolve(true);
      })
    })
    return result;
  }

  getGuildSettings = async() => {
    let data = await new Promise((resolve, reject) => {
      this.base.select({
        filterByFormula: `{guildId} = ${this.data.guildId}`
      }).eachPage((records, _) => {
        records.forEach((record) => {
          resolve({
            record_id: record.getId(),
            prefix: record.get('Prefix')
          })
        })
      })
    })
    return data;
  }

  editSettings = async(newData) => {
    let data = await new Promise(async(resolve, reject) => {
      let check = await this.CheckIFGuildSettingsExist(this.data.guildId);
      if(!check){
        let success = await this.CreateGuildSettingObject(this.data.guildId, newData);
        if(!success)
          return resolve({success: false, reason: "Something Happened"});
        else
          return resolve({success: true, data: newData});
      }

      let _data = await this.getGuildSettings(this.data.guildId);

      this.base.update([
        {
          id: _data.record_id,
          fields: {
            Prefix: newData.prefix
          }
        }
      ], (err, _) => {
        if(err){
          console.error(err);

          return resolve({success: false, reason: err});
        }
        return resolve({success: true, data: newData});
      });
      
    })
    return data;
  }
}

class UpdateBase {
  /**
   * @type {Airtable.Base}
   */
  base;
  /**
   * @type {{}}
   */
  data;
  /**
   * 
   * @param {Airtable.Base} base 
   * @param {{}} data 
   */
  constructor(base, data) {
    this.base = base;
    this.data = data;
  }

  getUpdates = async() => {
    let data = await new Promise((resolve, reject) => {
      this.base.select(
        
      ).eachPage((records, _) => {
        let updates = {};
        records.forEach((record) => {
          updates.push({
            date: record.get('Date'),
            Title: record.get('Title'),
            Description: record.get('Description'),
            CommandsAdded: record.get('Commands Added'),
            CommandsUpdated: record.get('Commands Updated'),
            FutureUpdate: record.get('Future Update'),
            Images: record.get('Image')
          })
        })
        return resolve({data: updates, success: true});
      })
    })
    return data;
  }

  getUpdate = async(id) => {
    let data = await new Promise(async (resolve, reject) => {
      let updates = await this.getUpdates();
      if(isNaN(id)) return resolve({success: false, reason: "Id is not a valid id."});
      if(id > updateSetAccessor.length) return resolve({success: false, reason: "There doesn't seem to be a update under that id."});
      if(id <= 0) return resolve({success: false, reason: "Ids start at 1, not 0."});
      let num = Number(id) - 1;
      return resolve({success: true, data: updates[num]});
    })
    return data;
  }

}