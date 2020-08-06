const {
  Client,
  Message,
  MessageEmbed,
  MessageCollector,
} = require("discord.js");
const { getInfoOnOpponentTeam } = require("../../Util/Teambuilder");
const { sendDm, isDm } = require("../../Util/SettingsFunction");
const Airtable = require("../../Airtable/index");
module.exports = {
  name: "teambuilder",
  aliases: ["tb"],
  description:
    "Displays a teambuilder that will show you everything you need to know about your opponent's team, and what your type matchup will look like.",
  category: "Draft",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(client, message, args) {
    let page = 0;
    const db = new Airtable({ userId: message.author.id }).draft;
    let select = args[0];
    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Teambuilder")
      .setDescription(
        "Please list the pokemon that you will be facing. The format looks like this `pokemon\npokemon\npokemon` example `lopunny\ncinccino\nchansey`"
      );
    let draft = await db.getDraftPlan(select);
    let users = [];
    for (let i = 0; i < draft.plan.split("<>").length; i++) {
      let field = draft.plan.split("<>");
      let name = field[i].split("</>")[0];
      let value = field[i].split("</>")[1];
      if (value !== undefined)
        users.push(
          value
            .split("Type")[0]
            .toLowerCase()
            .replace(/ +/g, "")
            .replace(/\n+/g, "")
        );
    }
    sendDm(message, embed).then(async (msg) => {
      let filter = (m) => m.author.id == message.author.id;
      /**
       * @type {MessageCollector}
       */
      let pokes;
      if (await isDm(message)) {
        pokes = message.author.dmChannel.createMessageCollector(filter, {
          time: 8640000,
          max: 1,
        });
      } else
        pokes = message.channel.createMessageCollector(filter, {
          time: 86400000,
          max: 1,
        });
      pokes.on("collect", async (collected) => {
        let pokemon = collected.content.split(/\n+/g);
        if (!(await isDm(message))) collected.delete();
        let opp = await getInfoOnOpponentTeam(pokemon);
        let usr = await getInfoOnOpponentTeam(users);
        let userPreview = "";
        let userTypes = "";
        let oppTypes = "";
        let userSpeed = "";
        let oppSpeed = "";
        let userNotable = "";
        let oppNotable = "";
        let oppPreview = "";
        for (let i = 0; i < users.length; i++) {
          userPreview += `${
            users[i].charAt(0).toUpperCase() + users[i].slice(1)
          }\n`;
        }
        for (let i = 0; i < opp.types.length; i++) {
          oppPreview += `${
            pokemon[i].charAt(0).toUpperCase() + pokemon[i].slice(1)
          }\n`;
        }
        for (let i = 0; i < users.length; i++) {
          userTypes += `${usr.types[i].replace("||", " ")}\n`;
        }
        for (let i = 0; i < opp.types.length; i++) {
          oppTypes += `${opp.types[i].replace("||", " ")}\n`;
        }
        for (let i = 0; i < users.length; i++) {
          userSpeed += `${usr.speed_tiers[i].speed}\n`;
        }
        for (let i = 0; i < opp.types.length; i++) {
          oppSpeed += `${opp.speed_tiers[i].speed}\n`;
        }
        userNotable += "__Clerics__\n";
        for (let i = 0; i < usr.cleric_pokemon.length; i++) {
          userNotable += `${
            usr.cleric_pokemon[i].pokemon
          } | ${usr.cleric_pokemon[i].moves.join(", ")}\n`;
        }
        userNotable += "__Pivots__\n";
        for (let i = 0; i < usr.pivot_pokemon.length; i++) {
          userNotable += `${usr.pivot_pokemon[i].pokemon} | ${usr.pivot_pokemon[
            i
          ].moves.join(", ")}\n`;
        }
        userNotable += "__Hazards__\n";
        for (let i = 0; i < usr.hazard_pokemon.length; i++) {
          userNotable += `${
            usr.hazard_pokemon[i].pokemon
          } | ${usr.hazard_pokemon[i].moves.join(", ")}\n`;
        }

        userNotable += "__Hazard Removal__\n";
        for (let i = 0; i < usr.hazard_removal_pokemon.length; i++) {
          userNotable += `${
            usr.hazard_removal_pokemon[i].pokemon
          } | ${usr.hazard_removal_pokemon[i].moves.join(", ")}\n`;
        }

        oppNotable += "__Clerics__\n";
        for (let i = 0; i < opp.cleric_pokemon.length; i++) {
          oppNotable += `${
            opp.cleric_pokemon[i].pokemon
          } | ${opp.cleric_pokemon[i].moves.join(", ")}\n`;
        }
        oppNotable += "__Pivots__\n";
        for (let i = 0; i < opp.pivot_pokemon.length; i++) {
          oppNotable += `${opp.pivot_pokemon[i].pokemon} | ${opp.pivot_pokemon[
            i
          ].moves.join(", ")}\n`;
        }
        oppNotable += "__Hazards__\n";
        for (let i = 0; i < opp.hazard_pokemon.length; i++) {
          oppNotable += `${
            opp.hazard_pokemon[i].pokemon
          } | ${opp.hazard_pokemon[i].moves.join(", ")}\n`;
        }

        oppNotable += "__Hazard Removal__\n";
        for (let i = 0; i < opp.hazard_removal_pokemon.length; i++) {
          oppNotable += `${
            opp.hazard_removal_pokemon[i].pokemon
          } | ${opp.hazard_removal_pokemon[i].moves.join(", ")}\n`;
        }

        embed.fields = [
          { name: "Your Draft:", value: userPreview, inline: true },
          { name: "Types", value: userTypes, inline: true },
          { name: "Speed", value: userSpeed, inline: true },
          { name: "Notable Moves", value: userNotable, inline: true },
          { name: "\u200b", value: "\u200b", inline: false },
          { name: "Opponent's Draft", value: oppPreview, inline: true },
          { name: "Types", value: oppTypes, inline: true },
          { name: "Speed", value: oppSpeed, inline: true },
          { name: "Notable Moves", value: oppNotable, inline: true },
        ];
        msg.edit(embed).then(async (msg) => {
          msg.react("ℹ️").then((r) => {
            msg.react("🔢").then((r) => {
              msg.react("🔡").then((r) => {
                msg.react("❌");

                let previewFilter = (reaction, user) =>
                  reaction.emoji.name === "ℹ️" && user.id === message.author.id;
                let typechartFilter = (reaction, user) =>
                  reaction.emoji.name === "🔢" && user.id === message.author.id;
                let oppTypechartFilter = (reaction, user) =>
                  reaction.emoji.name === "🔡" && user.id === message.author.id;
                let cancelFilter = (reaction, user) =>
                  reaction.emoji.name === "❌" && user.id === message.author.id;

                let preview = msg.createReactionCollector(previewFilter, {
                  time: 864000,
                });
                let typechart = msg.createReactionCollector(typechartFilter, {
                  time: 864000,
                });
                let oppTypechart = msg.createReactionCollector(
                  oppTypechartFilter,
                  { time: 864000 }
                );
                let cancel = msg.createReactionCollector(cancelFilter, {
                  time: 864000,
                });
                cancel.on("collect", () => {
                    msg.delete();
                  });

                preview.on("collect", async () => {
                  if (page === 0) return;
                  page = 0;
                  embed.description = "Draft Previews";
                  let userPreview = "";
                  let userTypes = "";
                  let oppTypes = "";
                  let userSpeed = "";
                  let oppSpeed = "";
                  let userNotable = "";
                  let oppNotable = "";
                  let oppPreview = "";
                  for (let i = 0; i < users.length; i++) {
                    userPreview += `${
                      users[i].charAt(0).toUpperCase() + users[i].slice(1)
                    }\n`;
                  }
                  for (let i = 0; i < opp.types.length; i++) {
                    oppPreview += `${
                      pokemon[i].charAt(0).toUpperCase() + pokemon[i].slice(1)
                    }\n`;
                  }
                  for (let i = 0; i < users.length; i++) {
                    userTypes += `${usr.types[i].replace("||", " ")}\n`;
                  }
                  for (let i = 0; i < opp.types.length; i++) {
                    oppTypes += `${opp.types[i].replace("||", " ")}\n`;
                  }
                  for (let i = 0; i < users.length; i++) {
                    userSpeed += `${usr.speed_tiers[i].speed}\n`;
                  }
                  for (let i = 0; i < opp.types.length; i++) {
                    oppSpeed += `${opp.speed_tiers[i].speed}\n`;
                  }
                  userNotable += "__Clerics__\n";
                  for (let i = 0; i < usr.cleric_pokemon.length; i++) {
                    userNotable += `${
                      usr.cleric_pokemon[i].pokemon
                    } | ${usr.cleric_pokemon[i].moves.join(", ")}\n`;
                  }
                  userNotable += "__Pivots__\n";
                  for (let i = 0; i < usr.pivot_pokemon.length; i++) {
                    userNotable += `${
                      usr.pivot_pokemon[i].pokemon
                    } | ${usr.pivot_pokemon[i].moves.join(", ")}\n`;
                  }
                  userNotable += "__Hazards__\n";
                  for (let i = 0; i < usr.hazard_pokemon.length; i++) {
                    userNotable += `${
                      usr.hazard_pokemon[i].pokemon
                    } | ${usr.hazard_pokemon[i].moves.join(", ")}\n`;
                  }

                  userNotable += "__Hazard Removal__\n";
                  for (let i = 0; i < usr.hazard_removal_pokemon.length; i++) {
                    userNotable += `${
                      usr.hazard_removal_pokemon[i].pokemon
                    } | ${usr.hazard_removal_pokemon[i].moves.join(", ")}\n`;
                  }

                  oppNotable += "__Clerics__\n";
                  for (let i = 0; i < opp.cleric_pokemon.length; i++) {
                    oppNotable += `${
                      opp.cleric_pokemon[i].pokemon
                    } | ${opp.cleric_pokemon[i].moves.join(", ")}\n`;
                  }
                  oppNotable += "__Pivots__\n";
                  for (let i = 0; i < opp.pivot_pokemon.length; i++) {
                    oppNotable += `${
                      opp.pivot_pokemon[i].pokemon
                    } | ${opp.pivot_pokemon[i].moves.join(", ")}\n`;
                  }
                  oppNotable += "__Hazards__\n";
                  for (let i = 0; i < opp.hazard_pokemon.length; i++) {
                    oppNotable += `${
                      opp.hazard_pokemon[i].pokemon
                    } | ${opp.hazard_pokemon[i].moves.join(", ")}\n`;
                  }

                  oppNotable += "__Hazard Removal__\n";
                  for (let i = 0; i < opp.hazard_removal_pokemon.length; i++) {
                    oppNotable += `${
                      opp.hazard_removal_pokemon[i].pokemon
                    } | ${opp.hazard_removal_pokemon[i].moves.join(", ")}\n`;
                  }

                  embed.fields = [
                    { name: "Your Draft:", value: userPreview, inline: true },
                    { name: "Types", value: userTypes, inline: true },
                    { name: "Speed", value: userSpeed, inline: true },
                    { name: "Notable Moves", value: userNotable, inline: true },
                    { name: "\u200b", value: "\u200b", inline: false },
                    {
                      name: "Opponent's Draft",
                      value: oppPreview,
                      inline: true,
                    },
                    { name: "Types", value: oppTypes, inline: true },
                    { name: "Speed", value: oppSpeed, inline: true },
                    { name: "Notable Moves", value: oppNotable, inline: true },
                  ];
                  msg.edit(embed);
                });

                typechart.on("collect", async () => {
                  if (page === 1) return;
                  page = 1;
                  embed.description = "Your Type chart.";
                  embed.fields= [];
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
                      `Immune: ${usr.typechart.immune[x]}\nResist: ${
                        usr.typechart.resist[x]
                      }\nNetrual: ${usr.typechart.netrual[x]}\n${
                        usr.typechart.weak[x] >= 3
                          ? `__**Weak: ${usr.typechart.weak[x]}**__`
                          : `Weak: ${usr.typechart.weak[x]}`
                      }`,
                      true
                    );
                  });
                  msg.edit(embed);
                });
                oppTypechart.on("collect", async () => {
                  if (page === 2) return;
                  page = 2;
                  embed.description = "Oppenent's Type chart.";
                  embed.fields = [];
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
                      `Immune: ${opp.typechart.immune[x]}\nResist: ${
                        opp.typechart.resist[x]
                      }\nNetrual: ${opp.typechart.netrual[x]}\n${
                        opp.typechart.weak[x] >= 3
                          ? `__**Weak: ${opp.typechart.weak[x]}**__`
                          : `Weak: ${opp.typechart.weak[x]}`
                      }`,
                      true
                    );
                  });
                  msg.edit(embed);
                });
              });
            });

          });
        });
      });
    });
  },
};
