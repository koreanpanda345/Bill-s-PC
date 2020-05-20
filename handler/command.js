const { readdirSync } = require("fs");

module.exports = client => {
  const load = dirs => {
    const commands = readdirSync(`./commands/${dirs}`).filter(d =>
      d.endsWith(".js")
    );
    for (let file of commands) {
      const cmd = require(`../commands/${dirs}/${file}`);
      client.commands.set(cmd.name, cmd);
      console.log(`Commands -> ${dirs}] ${cmd.name} was loaded`);
    }
  };

  ["Dev","Draft","Info", "Miscellaneous", "Settings", "Teams", "Tools", "Dev"].forEach(x => load(x));
};
