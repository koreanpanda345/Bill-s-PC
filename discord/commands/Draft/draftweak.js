const { Client, Message, MessageEmbed } = require("discord.js");
const Airtable = require("../../Airtable/index");
const Ps = require("../../Util/PokemonShowdown");
const { TypeCalculator } = require("../../Util/DraftFunction");
const { sendDm } = require('../../Util/SettingsFunction');
module.exports = {
  name: "draftweak",
  aliases: ["drafttypechart", "draftchart", "dw"],
  category: "Draft",
  description: "Displays the types you are weak to.",
  usage: "b!draftweak 1",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    let ps = new Ps();
    let db = new Airtable({ userId: message.author.id });
    let embed = new MessageEmbed();
    let select = args[0];
    if (isNaN(select)) return;
    select = Number(select);
    let draft = await db.draft.getDraftPlan(select);
    let types = [];
    let pokemon = [];
    for (let i = 0; i < draft.plan.split("<>").length; i++) {
      let field = draft.plan.split("<>");
      let name = field[i].split("</>")[0];
      let value = field[i].split("</>")[1];
      if (value !== undefined) {
        types.push(
          value
            .split("Type: ")[1]
            .split("Abilities:")[0]
            .toLowerCase()
            .replace(/ +/g, "")
            .replace(/\n+/g, "")
        );
        pokemon.push(
          value
            .split("Type: ")[0]
            .toLowerCase()
            .replace(/ +/g, "")
            .replace(/\n+/g, "")
        );
      }
    }
    let desc = "";
    for (let i = 0; i < pokemon.length; i++)
      desc += `${pokemon[i]} - Types: ${types[i].replace("||", " ")}\n`;
    embed.setDescription(desc);
    TypeCalculator(types).then(async (chart) => {
      embed.setTitle(`${draft.name} Type Chart`);
      let _types = [
        "Bug",
        "Dark",
        "Dragon",
        "Electric",
        "Fairy",
        "Fighting",
        "Fire",
        "Flying",
        "Ghost",
        "Grass",
        "Ground",
        "Ice",
        "Normal",
        "Poison",
        "Psychic",
        "Rock",
        "Steel",
        "Water",
      ];
      _types.forEach((x) => {
        embed.addField(
          x,
          `Immune: ${chart.immune[x]}\nResist: ${chart.resist[x]}\nNetrual: ${
            chart.netrual[x]
          }\n${
            chart.weak[x] >= 3
              ? `__**Weak: ${chart.weak[x]}**__`
              : `Weak: ${chart.weak[x]}`
          }`,
          true
        );
      });
      embed.setColor("RANDOM");
      await sendDm(message, embed).then((msg) => {
        msg.react("❎").then((r) => {
          let filter = (reaction, user) =>  reaction.emoji.name === "❎" && user.id === message.author.id;
          let del = msg.createReactionCollector(filter, {time: 1000000});
          del.on('collect', () => {
            msg.delete();
            del.stop();
          })
        })
        
      })
    })
  },
};
