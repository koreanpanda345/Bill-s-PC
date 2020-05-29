const airtable = require('airtable');
const Team = require('./teams.js');
const Draft = require('./draft.js');
const air = new airtable({apiKey:process.env.AIRTABLE_API}).base(process.env.AIRTABLE_TABLE);
module.exports = class Airtable {
  teams;
  draft;
  constructor(data){
  this.teams = new Team(air('Teams'), data);
  this.draft = new Draft(air('Draft plans'), data);
}
}