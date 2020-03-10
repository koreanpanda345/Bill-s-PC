const Discord = require("discord.js");
const client = new Discord.Client();
var Airtable = require("airtable");
const discord_token = process.env.DISCORD_TOKEN;
const prefix = process.env.PREFIX;
const airtable_api = process.env.AIRTABLE_API;
var base = new Airtable({ apiKey: airtable_api }).base("app1XZLzoO93xWEDN");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("b!help");
});

client.on("message", msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  if (!msg.content.startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  switch (command) {
    case "ping":
      msg.channel.send(`Pong`);
      break;
    case "help":
      const embed = new Discord.RichEmbed()
        .setColor(0xf5427e)
        .setTitle(`Help Command`)
        .setDescription(`My prefix is ${prefix}`)
        .addField("ping", "PONG!", true)
        .addField(
          "addteam",
          "Adds a team to the PC.(can be set to dms or public. if you want it to be sent to dms when using the getteam command. add ,dm at the end of your team)\n" +
            "usage: " +
            `${prefix}addteam Best Bunny, Bun Bun (Lopunny) @ Lopunnite\nAbility: Limber\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Fake Out\n- Ice Punch\n- Return\n- High Jump Kick,dm`
        )
        .addField("teams", "Displays all your teams that you stored in the pc.")
        .addField(
          "getteam",
          "Grabs a team from the PC. usage: " + `${prefix}getteam 1`
        )
        .addField(
          "delteam",
          "Deletes a team from your PC.\n" + "usage: " + `${prefix}delteam 1`
        )
        .addField(
          "editteam",
          "edits a team from your PC.\n" +
            "usage: " +
            `${prefix}editteam 2,<edited team>`
        );
      msg.channel.send({ embed: embed });
      break;
    case "addteam":
      let str = args.join(" ");
      let arglist = str.split(",");
      if (!arglist)
        return msg.channel.send(
          "Please try again, but provide the command with your team name, and your team in text form with ',' between the team name and your team.example: `b!addTeam Best Bunny, Bun Bun (Lopunny) @ Lopunnite\nAbility: Limber\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Fake Out\n- Ice Punch\n- Return\n- High Jump Kick`"
        );
      base("Teams")
        .select({
          filterByFormula: `{userId}=${msg.author.id}`
        })
        .eachPage(function page(records, fetchNextPage) {
          if (!records.length) {
            base("Teams").create(
              [
                {
                  fields: {
                    userId: msg.author.id,
                    teamNames: arglist[0],
                    teams: arglist[1],
                    visibility: arglist[2]
                  }
                }
              ],
              function(err, record) {
                if (err) console.error(err);
                msg.channel.send(`Just added ${arglist[0]} to your 'PC'`);
                return console.log("Created");
              }
            );
          }
          let nameArr = [];
          let teamArr = [];
          let teamNames = "";
          let teams = "";
          let _recordId = "";
          let visbily = "";
          records.forEach(function(record) {
            _recordId = record.getId();
            teamNames = record.get("teamNames");
            teams = record.get("teams");
            visbily = record.get("visibility");
            for (let i = 0; i < teamNames.split(",").length; i++) {
              nameArr.push(teamNames.split(",")[i]);
            }
            for (let i = 0; i < teams.split(",").length; i++) {
              teamArr.push(teams.split(",")[i]);
            }

            if (!arglist[2]) arglist[2] = "public";
            if (!arglist[2] == "dm" || !arglist == "public")
              arglist[2] = "public";
          });
          base("Teams").update(
            [
              {
                id: _recordId,
                fields: {
                  teamNames: teamNames + "," + arglist[0],
                  teams: teams + "," + arglist[1],
                  visibility: visbily + "," + arglist[2]
                }
              }
            ],
            function(err, record) {
              if (err) console.error(err);
              msg.channel.send(`Just added ${arglist[0]} to your 'PC'`);
              console.log("updated");
            }
          );
        });

      break;

    case "teams":
      base("Teams")
        .select({
          filterByFormula: `{userId} = ${msg.author.id}`
        })
        .eachPage(function page(records, fetchNextPage) {
          if (!records.length)
            return msg.channel.send(
              "You do not have any teams stored yet. please use the `b!addteam` command"
            );
          let nameArr = [];
          let teamArr = [];
          let teamNames = "";
          let teams = "";
          let _recordId = "";
          records.forEach(function(record) {
            _recordId = record.getId();
            teamNames = record.get("teamNames");
            teams = record.get("teams");
            for (let i = 0; i < teamNames.split(",").length; i++) {
              nameArr.push(teamNames.split(",")[i]);
            }
            for (let i = 0; i < teams.split(",").length; i++) {
              teamArr.push(teams.split(",")[i]);
            }
          });
          let str = "";
          for (let i = 0; i < nameArr.length; i++) {
            str += `${i + 1} - ${nameArr[i]}\n`;
          }
          let teamEmbed = new Discord.RichEmbed();
          teamEmbed.setTitle(`${msg.author.username}'s teams'`);
          teamEmbed.setDescription(str);
          msg.channel.send(teamEmbed);
        });
      break;
    case "getteam":
      base("Teams")
        .select({
          filterByFormula: `{userId} = ${msg.author.id}`
        })
        .eachPage(function page(records, fetchNextPage) {
          if (!records.length)
            return msg.channel.send(
              "You do not have any teams stored yet. please use the `b!addteam` command"
            );
          let nameArr = [];
          let teamArr = [];
          let sendArr = [];
          let teamNames = "";
          let teams = "";
          let _recordId = "";
          let visible = "";
          records.forEach(function(record) {
            _recordId = record.getId();
            teamNames = record.get("teamNames");
            teams = record.get("teams");
            visible = record.get("visibility");
            for (let i = 0; i < teamNames.split(",").length; i++) {
              nameArr.push(teamNames.split(",")[i]);
            }
            for (let i = 0; i < teams.split(",").length; i++) {
              teamArr.push(teams.split(",")[i]);
            }
            for (let i = 0; i < visible.split(",").length; i++) {
              sendArr.push(visible.split(",")[i]);
            }
          });
          let getEmbed = new Discord.RichEmbed();
          getEmbed.setColor(0x03fcd3);
          getEmbed.setTitle(`${nameArr[args[0] - 1]}`);
          getEmbed.setDescription(teamArr[args[0] - 1]);
          if (sendArr[args[0] - 1] === "dm") msg.author.send(getEmbed);
          if (sendArr[args[0] - 1] === "public") msg.channel.send(getEmbed);
        });
      break;
    case "delteam":
      base("Teams")
        .select({
          filterByFormula: `{userId} = ${msg.author.id}`
        })
        .eachPage(function page(records, fetchNextPage) {
          if (!records.length)
            return msg.channel.send(
              "You do not have any teams stored yet. please use the `b!addteam` command"
            );
          let nameArr = [];
          let teamArr = [];
          let teamNames = "";
          let teams = "";
          let _recordId = "";
          records.forEach(function(record) {
            _recordId = record.getId();
            teamNames = record.get("teamNames");
            teams = record.get("teams");
            for (let i = 0; i < teamNames.split(",").length; i++) {
              nameArr.push(teamNames.split(",")[i]);
            }
            for (let i = 0; i < teams.split(",").length; i++) {
              teamArr.push(teams.split(",")[i]);
            }
          });
          nameArr.splice(args[0] - 1, args[0] - 1);
          teamArr.splice(args[0] - 1, args[0] - 1);
          base("Teams").update(
            [
              {
                id: _recordId,
                fields: {
                  teamNames: nameArr.toString(),
                  teams: teamArr.toString()
                }
              }
            ],
            function(err, record) {
              if (err) console.error(err);
            }
          );
        });
      break;
    case "editteam":
      let _str = args.join(" ");
      let _arglist = _str.split(",");
      if (!_arglist)
        return msg.channel.send(
          "Please try again, but provide the command with your team name, and your team in text form with ',' between the team name and your team.example: `b!editTeam 1, Bun Bun (Lopunny) @ Lopunnite\nAbility: Limber\nEVs: 252 Atk / 4 SpD / 252 Spe\nJolly Nature\n- Fake Out\n- Ice Punch\n- Return\n- High Jump Kick`"
        );
      base("Teams")
        .select({
          filterByFormula: `{userId}=${msg.author.id}`
        })
        .eachPage(function page(records, fetchNextPage) {
          if (!records.length) {
            base("Teams").create(
              [
                {
                  fields: {
                    userId: msg.author.id,
                    teamNames: arglist[0],
                    teams: arglist[1]
                  }
                }
              ],
              function(err, record) {
                if (err) console.error(err);
                msg.channel.send(`Just edited ${_arglist[0]} to your 'PC'`);
                return console.log("Created");
              }
            );
          }
          let nameArr = [];
          let teamArr = [];
          let teamNames = "";
          let teams = "";
          let _recordId = "";
          records.forEach(function(record) {
            _recordId = record.getId();
            teamNames = record.get("teamNames");
            teams = record.get("teams");
            for (let i = 0; i < teamNames.split(",").length; i++) {
              nameArr.push(teamNames.split(",")[i]);
            }
            for (let i = 0; i < teams.split(",").length; i++) {
              teamArr.push(teams.split(",")[i]);
            }
          });
          teamArr[_arglist[0] - 1] = _arglist[1];
          base("Teams").update(
            [
              {
                id: _recordId,
                fields: {
                  teams: teamArr.toString()
                }
              }
            ],
            function(err, record) {
              if (err) console.error(err);
              msg.channel.send(
                `Just edited ${nameArr[_arglist[0] - 1]} to your 'PC'`
              );
              console.log("updated");
            }
          );
        });

      break;
  }
});
client.login(discord_token);
