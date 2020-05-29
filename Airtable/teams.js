const airtable = require("airtable");

module.exports = class Teams {
  base;
  data;
  constructor(base, data) {
    this.base = base;
    this.data = data;
  }
  createUserObject = async (teamData) => {
    let result = await new Promise((resolve, reject) => {
      return this.base.create(
        [
          {
            fields: {
              userId: this.data.userId,
              teamNames: teamData.team_name,
              teams: teamData.team_paste,
              visibility: teamData.team_send,
            },
          },
        ],
        (err, record) => {
          let _result = false;
          if (err) {
            console.error(err);
            _result = false;
            return reject(_result);
          }
          _result = true;
          return resolve(_result);
        }
      );
    });
    return result;
  };
  checkIfUserHasTeam = async () => {
    let result = await new Promise((resolve, reject) => {
      this.base
        .select({
          filterByFormula: `userId=${this.data.userId}`,
        })
        .eachPage((records, _) => {
          if (!records.length) return resolve(false);
          return resolve(true);
        });
    });
    return result;
  };

  getUserTeams = async () => {
    let data = await new Promise((resolve, reject) => {
      this.base
        .select({
          filterByFormula: `userId=${this.data.userId}`,
        })
        .eachPage((records, _) => {
          records.forEach((record) => {
            resolve({
              record_id: record.getId(),
              team_names: record.get("teamNames"),
              team_pastes: record.get("teams"),
              team_send: record.get("visibility"),
            });
          });
        });
    });
    return data;
  };

  convertTeamsIntoArrays = async (data) => {
    let nameArr = [];
    let teamArr = [];
    let sendArr = [];
    for (let i = 0; i < data.team_names.split(",").length; i++) {
      nameArr.push(data.team_names.split(",")[i]);
    }
    for (let i = 0; i < data.team_pastes.split(",").length; i++) {
      teamArr.push(data.team_pastes.split(",")[i]);
    }
    for (let i = 0; i < data.team_send.split(",").length; i++) {
      sendArr.push(data.team_send.split(",")[i]);
    }
    return {
      record_id: data.record_id,
      names: nameArr,
      teams: teamArr,
      sends: sendArr,
    };
  };

  addTeam = async (teamData) => {
    let result = await new Promise(async (resolve, reject) => {
      let check = await this.checkIfUserHasTeam();
      if (!check) {
        let success = await this.createUserObject(teamData);
        if (!success) {
          return resolve("Something Happened");
        } else {
          return resolve(success);
        }
      }

      let data = await this.getUserTeams();

      this.base.update(
        [
          {
            id: data.record_id,
            fields: {
              teamNames: data.team_names + "," + teamData.team_name,
              teams: data.team_pastes + "," + teamData.team_paste,
              visibility: data.team_send + "," + teamData.team_send,
            },
          },
        ],
        (err, records) => {
          if (err) {
            console.error(err);

            resolve(false);
          }
          return resolve(true);
        }
      );
    });
    return result;
  };

  deleteTeam = async (select) => {
    let data = await new Promise(async (resolve, reject) => {
      let check = await this.checkIfUserHasTeam();
      if (!check)
        return resolve({
          reason: "There is no teams in the PC.",
          success: false,
        });
      let teams = await this.getUserTeams();
      select--;
      if (isNaN(select))
        return resolve({
          reason: "Sorry, but that id is not a number, please try again.",
          success: false,
        });
      let arr = await this.convertTeamsIntoArrays(teams);
      if (select > arr.names.length)
        return resolve({
          reason: "Sorry, but it doesn't seem like that id exit.",
          success: false,
        });
      let oldName = arr.names[select];
      arr.names.splice(select, 1);
      arr.teams.splice(select, 1);
      arr.sends.splice(select, 1);
      this.base.update(
        [
          {
            id: arr.record_id,
            fields: {
              teamNames: arr.names.toString(),
              teams: arr.teams.toString(),
              visibility: arr.sends.toString(),
            },
          },
        ],
        (err, records) => {
          if (err) return resolve({ reason: err, success: false });
          return resolve({ old_name: oldName, success: true });
        }
      );
    });
    return data;
  };

  editTeam = async (select, newData) => {
    let data = await new Promise(async (resolve, reject) => {
      let check = await this.checkIfUserHasTeam();
      if (!check)
        return resolve({
          reason: "There is no teams in the PC.",
          success: false,
        });
      let teams = await this.getUserTeams();
      select--;
      if (isNaN(select))
        return resolve({
          reason: "Sorry, but that id is not a number, please try again.",
        });
      let arr = await this.convertTeamsIntoArrays(teams);
      if (select > arr.names.length)
        return resolve({
          reason: "Sorry, but it doesn't seem like that id exist.",
        });
      arr.teams[select] = newData.team_paste;
      this.base.update(
        [
          {
            id: arr.record_id,
            fields: {
              teams: arr.teams.toString(),
            },
          },
        ],
        (err, records) => {
          if (err) return resolve({ reason: err, success: false });
          return resolve({ team_name: arr.names[select], success: true });
        }
      );
    });
    return data;
  };

  getTeam = async (select) => {
    let data = await new Promise(async (resolve, reject) => {
      let check = await this.checkIfUserHasTeam();
      if (!check)
        return resolve({
          reason: "There is no teams in the PC.",
          success: false,
        });
      let teams = await this.getUserTeams();
      select--;
      if (isNaN(select))
        return resolve({
          reason: "Sorry, but that id is not a number, please try again.",
          success: false,
        });
      let arr = await this.convertTeamsIntoArrays(teams);
      if (select > arr.names.length)
        return resolve({
          reason: "Sorry, but it doesn't seem like that id exist.",
        });
      return resolve({
        team: {
          name: arr.names[select],
          paste: arr.teams[select],
          send: arr.sends[select],
        },
        success: true,
      });
    });
    return data;
  };
};
