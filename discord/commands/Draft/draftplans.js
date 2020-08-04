const { MessageEmbed, Message, Client } = require("discord.js");
const Airtable = require("../../Airtable/index.js");
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const endpoint_sprites = process.env.SDSPRITES_ENDPOINT;
const fetch = require("node-fetch");
const typeColor = require("./../../Util/TypeColor");
const Ps = require("./../../Util/PokemonShowdown");
const {
  checkIFPokemonHasPivotMoves,
  checkIfPokemonHasClericMoves,
  checkIfPokemonHasHazardsMoves,
  checkIfPokemonHasHazardRemovalMoves,
} = require("./../../Util/DraftFunction");
const { sendDm } = require('../../Util/SettingsFunction');
module.exports = {
  name: "viewdraft",
  aliases: ["vd"],
  category: "Draft",
  description: "Allows you to view your draft.",
  usage: "b!viewdraft <draft id>",
  /**
   * 
   * @param {Client} client 
   * @param {Message} message 
   * @param {String[]} args 
   */
  async execute(client, message, args) {
    let ps = new Ps();
    let db = new Airtable({ userId: message.author.id });
    let data = await db.draft.getDraftPlan(args[0]);
    let embed = new MessageEmbed();
    if (!data.success) {
      embed.setTitle("Error");
      embed.setColor("red");
      embed.setDescription(data.reason);

      return message.channel.send(embed).then((msg) => {
        message.delete();
        msg.delete({ timeout: 10000 });
      });
    }
    embed.setColor("RANDOM");
    embed.setTitle(`Draft Plan: ${data.name}`);
    embed.setDescription(`Draft Type: ${data.type}`);
    embed.addField("\u200b", "\u200b");
    let page = 0;
    let pages = [];
    let tiers = [];
    for (let i = 0; i < data.plan.split("<>").length; i++) {
      let field = data.plan.split("<>");
      
      let name = field[i].split("</>")[0];
      let value = field[i].split("</>")[1];
      if (value !== undefined)
        pages.push(
          value
            .split("Type")[0]
            .toLowerCase()
            .replace(/ +/g, "")
            .replace(/\n+/g, "")
        );
      tiers.push(name.split(": ")[1]);
    }
    console.log(pages);
    sendDm(message, embed).then((msg) => {
      msg.react("◀️").then((r) => {
        msg.react("❎").then((r) => {
          msg.react("▶️");

          let forwardsFilter = (reaction, user) =>
            reaction.emoji.name === "▶️" && user.id === message.author.id;
          let backwardsFilter = (reaction, user) =>
            reaction.emoji.name === "◀️" && user.id === message.author.id;
          let clearFilter = (reaction, user) =>
            reaction.emoji.name === "❎" && user.id === message.author.id;
          let backwards = msg.createReactionCollector(backwardsFilter, {
            time: 100000,
          });
          let clear = msg.createReactionCollector(clearFilter, {
            time: 100000,
          });
          let forwards = msg.createReactionCollector(forwardsFilter, {
            time: 100000,
          });
          clear.on("collect", () => {
            msg.delete();
          });
          backwards.on("collect", async () => {
            if (page === 0) return;
            page--;
            let search = pages[page - 1].replace(/\\n+/g, "");
            if (search.toLowerCase().includes("-dusk")) {
              let temp = search.replace(/-dusk+/g, "dusk");
              search = temp;
            }
            if (search.toLowerCase().includes("-mega")) {
              let temp = search.replace(/-mega+/g, "mega");
              search = temp;
            }
            let poke = await ps.pokemonDex(search);

            if (poke === undefined) {
              embed.setTitle(`${tiers[page - 1]}: ---`);
              embed.setDescription(`No Pokemon.`);
              embed.setColor(typeColor["???"][random(typeColor["???"].length)]);
              embed.setImage("");
              msg.edit(embed);
              return;
            }
            let abilities;
            let ab = Object.values(poke.data.abilities);
            for (let i = 0; i < ab.length; i++) {
              abilities += `${ab[i]}\n`;
            }
            embed.setTitle(`${tiers[page - 1]}: ${poke.data.name}`);
            embed.setColor(
              typeColor[poke.data.types[0]][
                random(typeColor[poke.data.types[0]].length)
              ]
            );
            embed.setDescription(`
                    Types: ${
                      poke.data.types.length === 2
                        ? `${poke.data.types[0]} ${poke.data.types[1]}`
                        : `${poke.data.types[0]}`
                    }
                    \nAbilities: \n${abilities.replace(
                      `undefined`,
                      ""
                    )}\nBase Stats:
                    **__HP__: ${poke.data.baseStats.hp}
                    __ATK__: ${poke.data.baseStats.atk}
                    __DEF__: ${poke.data.baseStats.def}
                    __SPA__: ${poke.data.baseStats.spa}
                    __SPD__: ${poke.data.baseStats.spd}
                    __SPE__: ${poke.data.baseStats.spe}**`);
            let pivot = await checkIFPokemonHasPivotMoves(
              poke.data.name.toLowerCase()
            );
            let str = "\u200b";
            if (pivot.data.length !== 0)
              str += `**Pivot Moves**\n${pivot.data.join("\n")}`;
            let cleric = await checkIfPokemonHasClericMoves(
              poke.data.name.toLowerCase()
            );
            if (cleric.data.length !== 0)
              str += `\n\n**Cleric Moves**\n${cleric.data.join("\n")}`;
            let hazards = await checkIfPokemonHasHazardsMoves(
              poke.data.name.toLowerCase()
            );
            if (hazards.data.length !== 0)
              str += `\n\n**Hazard Moves**\n${hazards.data.join("\n")}`;
            let removal = await checkIfPokemonHasHazardRemovalMoves(
              poke.data.name.toLowerCase()
            );
            if (removal.data.length !== 0)
              str += `\n\n**Hazard Removal Moves**\n${removal.data.join("\n")}`;
            embed.fields[0] = { name: "\u200b", value: str, inline: false };
            let sprite = await ps.pokemonSprites(poke.data.name.toLowerCase());
            embed.setImage(sprite);
            msg.edit(embed);
          });

          forwards.on("collect", async () => {
            if (page === pages.length) return;
            page++;
            let search = pages[page - 1].replace(/\\n+/g, "");
            if (search.toLowerCase().includes("-dusk")) {
              let temp = search.replace(/-dusk+/g, "dusk");
              search = temp;
            }
            if (search.toLowerCase().includes("-mega")) {
              let temp = search.replace(/-mega+/g, "mega");
              search = temp;
            }
            let poke = await ps.pokemonDex(search);
            if (poke === undefined) {
              embed.setTitle(`${tiers[page - 1]}: ---`);
              embed.setDescription(`No Pokemon.`);
              embed.setImage("");
              embed.setColor(typeColor["???"][random(typeColor["???"].length)]);
              msg.edit(embed);
              const userReactions = msg.reactions.cache.filter((reaction) =>
                reaction.users.cache.has(message.author.id)
              );
              try {
                for (const reaction of userReactions.values()) {
                  await reaction.users.remove(message.author.id);
                }
              } catch (error) {
                console.error(error);
              }
              return;
            }
            let abilities;
            let ab = Object.values(poke.data.abilities);
            for (let i = 0; i < ab.length; i++) {
              abilities += `${ab[i]}\n`;
            }
            embed.setTitle(`${tiers[page - 1]}: ${poke.data.name}`);
            embed.setColor(
              typeColor[poke.data.types[0]][
                random(typeColor[poke.data.types[0]].length)
              ]
            );
            embed.setDescription(`
                  Types: ${
                    poke.data.types.length === 2
                      ? `${poke.data.types[0]} ${poke.data.types[1]}`
                      : `${poke.data.types[0]}`
                  }
                  \nAbilities: \n${abilities.replace(
                    `undefined`,
                    ""
                  )}\nBase Stats:
                  **__HP__: ${poke.data.baseStats.hp}
                  __ATK__: ${poke.data.baseStats.atk}
                  __DEF__: ${poke.data.baseStats.def}
                  __SPA__: ${poke.data.baseStats.spa}
                  __SPD__: ${poke.data.baseStats.spd}
                  __SPE__: ${poke.data.baseStats.spe}**`);
            let pivot = await checkIFPokemonHasPivotMoves(
              poke.data.name.toLowerCase()
            );
            let str = "\u200b";
            if (pivot.data.length !== 0)
              str += `**Pivot Moves**\n${pivot.data.join("\n")}`;
            let cleric = await checkIfPokemonHasClericMoves(
              poke.data.name.toLowerCase()
            );
            if (cleric.data.length !== 0)
              str += `\n\n**Cleric Moves**\n${cleric.data.join("\n")}`;
            let hazards = await checkIfPokemonHasHazardsMoves(
              poke.data.name.toLowerCase()
            );
            if (hazards.data.length !== 0)
              str += `\n\n**Hazard Moves**\n${hazards.data.join("\n")}`;
            let removal = await checkIfPokemonHasHazardRemovalMoves(
              poke.data.name.toLowerCase()
            );
            if (removal.data.length !== 0)
              str += `\n\n**Hazard Removal Moves**\n${removal.data.join("\n")}`;
            embed.fields[0] = { name: "\u200b", value: str, inline: false };
            let sprite = await ps.pokemonSprites(poke.data.name.toLowerCase());
            embed.setImage(sprite);
            msg.edit(embed);
          });
        });
      });
    });
  },
};

function random(max) {
  return Math.floor(Math.random() * max);
}
