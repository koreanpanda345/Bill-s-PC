const airtable = require('airtable');
const Team = require('./teams.js');
const Draft = require('./draft.js');
const Utils = require('./utils');
const Showdown = require('./showdown.js');
const air = new airtable({apiKey:process.env.AIRTABLE_API}).base(process.env.AIRTABLE_TABLE);
/**
 * @class
 * @summary This Class handles everything to do with airtable. This is done by splitting
 * up the work into subfiles for each different airtable table.
 */
module.exports = class Airtable {
    /**
     * @type {Team}
     */
  teams;
  /**
   * @type {Draft}
   */
  draft;
  /**
   * @type {Utils}
   */
  utils;
  /**
   * @type {Showdown}
   */
  showdown;
  /**
   * 
   * @param {{userId: string, showdown_name: string, discord_id: string, guildId: string}} data 
   */
  constructor(data){
    // This handles the Team airtable stuff.
    this.teams = new Team(air('Teams'), data);
    // This handles the Draft airtable stuff.
    this.draft = new Draft(air('Draft plans'), data);
    // This handles the Utils airtable stuff.
    this.utils = new Utils(air('Suggestions'), air('Bugs'), air('Settings'), air('Updates'), data);
    // This handles the Showdown airtable stuff.
    this.showdown = new Showdown(air('ShowdownNames'), data);
    }
}