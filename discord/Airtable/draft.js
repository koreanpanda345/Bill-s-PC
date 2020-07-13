const airtable = require('airtable');
/**
 * @function createUserObject
 * @summary This handles all of the Draft Airtable methods.
 */
module.exports = class Draft {
    /**
     * @type {Airtable.Base}
     */
    base;
    /**
     * @type {{userId: string}}
     */
    data;
    /**
     * 
     * @param {Airtable.Base} base 
     * @param {{userId: string}} data 
     */
  constructor(base, data) {
    this.base = base;
    this.data = data;
  }
  /**
   * 
   */
  createUserObject = async (draftData) => {
    let result = await new Promise((resolve, reject) => {
      return this.base.create(
        [
          {
            fields: {
              userId: this.data.userId,
              draftname: draftData.name,
              draftplans: draftData.plan,
              drafttype: draftData.type
            }
          }
        ], (err, record) => {
          if(err) {
            console.error(err);
            return reject({reason: err, success: false});
          }
          return resolve({success: true});
        })
    })
    return result;
  }

  checkIfUserHasDraft = async () => {
    let result = await new Promise((resolve, reject) => {
      this.base.select({
        filterByFormula: `{userId} = ${this.data.userId}`
      }).eachPage((records, _) => {
        if(!records.length) return resolve(false);
        return resolve(true);
      })
    })
    return result;
  }

  getUserDrafts = async () => {
    let data = await new Promise((resolve, reject) => {
      this.base.select({
        filterByFormula: `userId = ${this.data.userId}`
      }).eachPage((records, _) => {
        records.forEach((record) => {
          return resolve({
            record_id: record.getId(),
            draft_names: record.get("draftname"),
            draft_plans: record.get("draftplans"),
            draft_types: record.get("drafttype")
          });
        });
      });
    });
    return data;
  }

  convertDraftsIntoArray = async (data) => {
    let draftName = [];
    let draftPlans = [];
    let draftType = [];
    for (let i = 0; i < data.draft_names.split(",").length; i++) {
      draftName.push(data.draft_names.split(",")[i]);
    }
    for (let i = 0; i < data.draft_plans.split(",").length; i++) {
      draftPlans.push(data.draft_plans.split(",")[i]);
    }
    for (let i = 0; i < data.draft_types.split(",").length; i++) {
      draftType.push(data.draft_types.split(",")[i]);
    }
    return {
      record_id: data.record_id,
      names: draftName,
      plans: draftPlans,
      types: draftType
    };
  }


  addDraftPlan = async (draftData) => {
    let result = await new Promise(async (resolve, reject) => {
      let check = await this.checkIfUserHasDraft();
      if(!check){
        let success = await this.createUserObject(draftData);
        if(!success) return resolve({reason: "Something happened", success: false});
        else return resolve(success);
      }
      
      let data = await this.getUserDrafts();

      this.base.update(
        [
          {
            id: data.record_id,
            fields: {
              draftname: data.draft_names + "," + draftData.name,
              draftplans: data.draft_plans + "," + draftData.plan,
              drafttype: data.draft_types + "," + draftData.type,
            }
          }
        ], (err, records) => {
          if(err){
            console.error(err);
            return resolve({reason: err, success: false});
          }
          return resolve({success: true});
        })
    })
    return result;
  }

  deleteDraftPlan = async (select) => {
    let result = await new Promise(async (resolve, reject) => {
      let check = await this.checkIfUserHasDraft();
      if(!check) return resolve({reason: "Sorry, but it seems like you do not have a draft plan made yet.", success: false});
      let drafts = await this.getUserDrafts();
      if(isNaN(select)) return resolve({reason: "Sorry, but that id is not a number", success: false});
      let arr = await this.convertDraftsIntoArray(drafts);
      select--;
      if(select > arr.names.length) return resolve({reason: "Sorry, but it seems like that id doesn't exist yet.", success: false});
      let oldName = arr.names[select];
      arr.names.splice(select, 1);
      arr.plans.splice(select, 1);
      arr.types.splice(select, 1);

      this.base.update(
        [
          {
            id: arr.record_id,
            fields: {
              draftname: arr.names.toString(),
              draftplans: arr.plans.toString(),
              drafttype: arr.types.toString()
            }
          }
        ], (err, records) => {
          if(err){
            console.error(err);
            return resolve({reason: err, success: false});
          }

          return resolve({old_draft: oldName, success: true});
        })
    })
    return result;
  }

  editDraftPlan = async (select, newData) => {
    let result = await new Promise(async (resolve, reject) => {
      let check = await this.checkIfUserHasDraft();
      if(!check) return resolve({reason: "Sorry, but it looks like you do not have any drafts in the PC yet.", success: false});
      let drafts = await this.getUserDrafts();
      if(isNaN(select)) return resolve({reason: "Sorry, but that id is not a number, please try again.", success: false});
      let arr = await this.convertDraftsIntoArray(drafts);
      if(select > arr.names.length) return resolve({reason: "Sorry, but it doesn't look like you have a draft with that id."});
      arr.plans[select] = newData.plan;
      this.base.update(
        [
          {
            id: arr.record_id,
            fields: {
              draftplans: arr.plans.toString(),
            }
          }
        ], (err, records) => {
          if(err){
            console.error(err);
            return resolve({reason: err, success: false});
          }
          return resolve({draft: arr.names[select], success: true});
        })
    })
    return result;
  }

  getDraftPlan = async (select) => {
    let data = await new Promise(async (resolve, reject) => {
      let check = await this.checkIfUserHasDraft();
      if(!check) return resolve({reason: "Sorry, but it looks like you do not have any drafts in the PC yet.", success: false});
      let drafts = await this.getUserDrafts();
      let arr = await this.convertDraftsIntoArray(drafts);
      select--;
        if(isNaN(select)) return resolve({reason: "Sorry, but that id is not a valid id. Please try again.", success: false});
        if(select > arr.names.length) return resolve({reason: "Sorry, but it looks like that id doesn't exist.", success: false});
        return resolve({name: arr.names[select], plan: arr.plans[select], type: arr.types[select], success: true});
      })
    return data;
  }

}