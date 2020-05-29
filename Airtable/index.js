const airtable = require('airtable');
const Team = require('./teams.js');
const air = new airtable({apiKey:process.env.AIRTABLE_API}).base(process.env.AIRTABLE_TABLE);
module.exports = class Airtable {
  teams;
  constructor(data){
  this.teams = new Team(air('Teams'), data);
  }
}