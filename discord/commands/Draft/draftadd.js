const Airtable = require("../../Airtable/index.js");
const { MessageEmbed, Client, Message } = require("discord.js");
const endpoint_dex = process.env.SDDEX_ENDPOINT;
const fetch = require("node-fetch");
const Ps = require("../../Util/PokemonShowdown");
var ps = new Ps();
const { sendDm, isDm } = require("../../Util/SettingsFunction");
const {
    checkIFPokemonHasPivotMoves,
    checkIfPokemonHasClericMoves,
    checkIfPokemonHasHazardsMoves,
    checkIfPokemonHasHazardRemovalMoves,
} = require("../../Util/DraftFunction");
module.exports = {
    name: "adddraft",
    aliases: ["ad"],
    category: "Draft",
    description: "Adds a draft plan to your Person Collection of draft plans.",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    async execute(client, message, args) {
        let db = new Airtable({ userId: message.author.id });
        let embed = new MessageEmbed();
        embed.setColor("RANDOM");
        embed.setTitle(`Untitled`);
        embed.setDescription(
            `Please Type in what you would like your draft plan's name to be.`
        );
        message.channel.send(embed).then(async (msg) => {
            // filter is a global variable for this command.
            var filter = (m) => m.author.id === message.author.id;
            // Creates a MessageCollector that will be used to await Messages.
            let name = message.channel.createMessageCollector(filter, {
                time: 86400000, // Time till the MessageCollector expires.
                max: 1, // Only grab one message where the filter is true.
            });
            // Collect event.
            name.on("collect", (m) => {
                console.log(m.content);
                let _name = m.content;
                m.delete();
                embed.setTitle(`${_name}`);
                let _draft;
                //tier 1, tier 2, tier 3, tier 3, tier 4, tier 5, mega, free, free, free, free\
                _draft = "tier";
                embed.setDescription(
                    `Tier Draft
                  Please enter the tier system that you will be using.
                  - iGL
  
                  if you don't see a prebuilt tier system that your league uses, please put in \`custom (<tiers>)\`
                  example: \`custom (tier 1, tier 2, tier 3, tier 3, tier 4, tier 5, mega, free, free, free, free)\` including the \`,\``
                );
                msg.edit(embed);
                let tiers = message.channel.createMessageCollector(filter, {
                    time: 86400000,
                    max: 1,
                });
                tiers.on("collect", async (m) => {
                    let _tiers;
                    if (m.content.toLowerCase().startsWith("igl")) {
                        _tiers = [
                            "Tier 1",
                            "Tier 2",
                            "Tier 3",
                            "Tier 3",
                            "Tier 4",
                            "Tier 5",
                            "Mega",
                            "Free",
                            "Free",
                            "Free",
                            "Free",
                        ];
                        _draft = "IGL Draft Format";
                    }
                    if (m.content.startsWith("custom")) {
                        _draft = "Custom Tier Draft Format";
                        _tiers = m.content.split(",");
                        _tiers[0] = _tiers[0].split("(")[1];
                        _tiers[_tiers.length - 1] = _tiers[_tiers.length - 1].split(")")[0];
                    }

                    m.delete();
                    embed.setDescription(
                        `${_draft}\nPlease enter the slot number and the pokemon in this format \`number, pokemon\`.\nexample: \`3, lopunny\`\nTo Save just type in \`save\` and to cancel type in \`cancel\`.`
                    );

                    for (let i = 0; i < _tiers.length; i++) {
                        embed.addField(`Slot ${i + 1}: ` + _tiers[i], "\u200b", false);
                    }
                    await sendDm(message, embed).then((_msg) => {
                        msg.delete();
                        let pick = message.channel.createMessageCollector(filter, {
                            time: 86400000,
                        });
                        pick.on("collect", async (m) => {
                            if (
                                m.content.toLowerCase() !== "cancel" &&
                                m.content.toLowerCase() !== "save"
                            ) {
                                let _pick = m.content.split(",")[1];
                                let __tier = m.content.split(",")[0];
                                if (!_pick) return;
                                m.delete();
                                _pick = _pick.replace(/ +/g, "");
                                let search = _pick.toLowerCase();
                                await getPokemon(search, __tier, embed);
                                _msg.edit(embed);
                                message.channel
                                    .send(`Added pokemon.`)
                                    .then((__msg) => __msg.delete({ timeout: 5000 }));
                            }
                            if (m.content.toLowerCase() === "save") {
                                pick.stop();

                                let draft = {
                                    name: embed.title,
                                    type: embed.description.split("Please")[0],
                                    slots: embed.fields,
                                    userId: message.author.id,
                                };
                                let plan = "";
                                for (let i = 0; i < embed.fields.length; i++) {
                                    plan += `${embed.fields[i].name}</> ${embed.fields[i].value}<>`;
                                }
                                draft.plan = plan;
                                let data = await db.draft.addDraftPlan(draft);
                                if (!data.success) {
                                    let _embed = new MessageEmbed();
                                    _embed.setTitle("Error");
                                    _embed.setColor("red");
                                    _embed.setDescription(data.reason);
                                    return message.channel.send(_embed).then((txt) => {
                                        pick.stop();
                                        _msg.delete();
                                        message.delete();
                                        m.delete();
                                        txt.delete({ timeout: 10000 });
                                    });
                                }
                                let _embed = new MessageEmbed();

                                _embed.setTitle(`Added ${draft.name} to the PC.`);
                                _embed.setColor("RANDOM");
                                _embed.setDescription("");

                                message.channel.send(_embed).then((txt) => {
                                    pick.stop();
                                    _msg.delete();
                                    message.delete();
                                    m.delete();
                                    txt.delete({ timeout: 10000 });
                                });
                            }
                            if (m.content.toLowerCase() === "cancel") {
                                pick.stop();
                                _msg.delete();
                                message.delete();
                                m.delete();
                                message.channel
                                    .send(`Cancelled`)
                                    .then((txt) => txt.delete({ timeout: 10000 }));
                            }
                        });
                    });
                });
            });
        });
    },
};

async function getPokemon(name, tier, embed) {
    let search = name;
    let __tier = tier;
    if (search.toLowerCase().includes("mega")) {
        let temp = search.replace("mega", "");
        search = temp + "mega";
    }
    if (search.toLowerCase().includes("alola" || "alolan")) {
        let temp = search.replace("alola", "");
        temp = temp.replace("alolan", "");
        search = temp + "alola";
    }
    let poke = await ps.pokemonDex(search);
    let pivot = await checkIFPokemonHasPivotMoves(poke.data.name.toLowerCase());
    let cleric = await checkIfPokemonHasClericMoves(poke.data.name.toLowerCase());
    let hazard = await checkIfPokemonHasHazardsMoves(
        poke.data.name.toLowerCase()
    );
    let removal = await checkIfPokemonHasHazardRemovalMoves(
        poke.data.name.toLowerCase()
    );
    let abilities;
    let ab = Object.values(poke.data.abilities);
    for (let i = 0; i < ab.length; i++) {
        abilities += `- ${ab[i]}\n`;
    }
    embed.fields[Number(__tier) - 1] = {
        name: embed.fields[Number(__tier) - 1].name,
        value: `${poke.data.name}\nType: ${
            poke.data.types.length === 2
                ? `${poke.data.types[0]} || ${poke.data.types[1]}`
                : `${poke.data.types[0]}`
            }\n Abilities:
            ${abilities.replace("undefined", "")}\nBase Speed: ${
            poke.data.baseStats.spe
            }\n${
            pivot.data.length != 0 ? `Pivot Moves:\n${pivot.data.join(" ")}\n` : ""
            }${
            cleric.data.length != 0 ? `Cleric Moves:\n${cleric.data.join(" ")}\n` : ""
            }${
            hazard.data.length != 0 ? `Hazards Moves:\n${hazard.data.join(" ")}` : ""
            }${
            removal.data.length != 0
                ? `Hazard Removal Moves:\n${removal.data.join(" ")}`
                : ""
            }`,
    };
}
