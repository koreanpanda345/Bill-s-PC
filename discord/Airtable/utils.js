
module.exports = class Utils {
  suggestBase;
  bugBase;
  settingBase;
  updateBase;
  settings;
  constructor(suggestBase, bugBase, settingBase, updateBase, data){
    this.bugBase = bugBase;
    this.settingBase = settingBase;
    this.suggestBase = suggestBase;
    this.updateBase = updateBase;
    this.settings = new SettingBase(this.settingBase, data);
  }

}

class SettingBase{
  base;
  data;
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