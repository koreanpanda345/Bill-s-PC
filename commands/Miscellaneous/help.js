const {RichEmbed} = require('discord.js');
const prefix = process.env.PREFIX;
const {readdirSync} = require('fs');

module.exports = {
    name: 'help',
    aliases: ["command", "commands"],
    category: "Miscellaneous",
    description: "List all of my commands or info about a specific command.",
    usage: "(command name)",
    execute(client, message, args){
        const embed = new RichEmbed();
        embed.setColor('RANDOM');
        embed.setAuthor(`${message.guild.me.displayName}'s Help`, message.guild.iconURL);
        embed.setThumbnail(client.user.displayAvatarURL);

        if(!args[0]){
            const categories = readdirSync(`./commands/`);
            embed.setDescription(`These are the avaliable commands for ${message.guild.me.displayName}\nThe bot prefix is: **${prefix}**`);
            embed.setFooter(`${message.guild.me.displayName} | Total Commands: ${client.commands.size}`, client.user.displayAvatarURL);

            categories.forEach(category => {
                const dir = client.commands.filter(c => c.category === category);
                const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);

                try{
                    embed.addField(`>${capitalise} [${dir.size}]:`, dir.map(c => `\`${c.name}\``).join(" "));
                } catch(e){
                    console.error(e);
                }
            });
            return message.channel.send(embed);
        } else {
            let command = client.commands.get(args[0].toLowerCase());
            if(!command) return message.channel.send(embed.setTitle("Invalid Command").setDescription(`do \`${prefix}help\` of a list of commands.`));
            embed.setDescription(`The Bot's prefix is \`${prefix}\`\n
            **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\n
            **Description:** ${command.description || "No Description Provided"}\n
            **Aliases:** ${command.aliases || "None"}\n
            **Usage:** ${command.usage || "None was provided"}\n
            \n
            *<> means that it is required, () means it's optional*
            `);
            embed.setFooter(`${message.guild.me.displayName}`, client.user.displayAvatarURL);

            return message.channel.send(embed);
        }
    }
}
