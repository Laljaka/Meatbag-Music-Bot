const { MeatbagMessage, MessageEmbed } = require("discord.js")

module.exports = {
    name: 'help',
    aliases: ['help', 'h', 'commands'],
    description: 'Shows this message',
    longDescription: 'Shows this message. If used with another command name - shows detailed description of this command',
    usage: '        [command name](optional)',
    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message, args, prefix) {
        // const embed = new MessageEmbed();
        
        const secondCommandRaw = args.shift();
        let finalString = '\`\`\`';
        const numberOfSpaces = 25;
        const space = ' ';
        if (secondCommandRaw) {
            const secondCommand = secondCommandRaw.toLowerCase();
            if (message.client.oldCommands.has(secondCommand)) {
                const oldCommand = message.client.oldCommands.get(secondCommand);
                finalString = finalString + `\n${prefix}${oldCommand.aliases.join('|')}${oldCommand.usage}\n\n${oldCommand.description}`;
                // embed.addField(prefix + oldCommand.aliases.join(' | ') + oldCommand.usage, oldCommand.longDescription);
            } else return await message.reply('Specified command does not exist.')
        } else {
            message.client.oldCommands.forEach(oldCommand => {
                finalString = finalString + `\n${oldCommand.name}${space.repeat(numberOfSpaces - oldCommand.name.length)}${oldCommand.description}`;
                // embed.addField(oldCommand.name, oldCommand.description);
            });
        }
        finalString = finalString + `\n\nType ${prefix}help command for more info on a command.\n\`\`\``;
        await message.reply({ content: finalString, allowedMentions: { repliedUser: false } });
    }
}