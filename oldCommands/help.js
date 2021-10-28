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
        if (secondCommandRaw) {
            const secondCommand = secondCommandRaw.toLowerCase();
            if (message.client.oldCommands.has(secondCommand)) {
                const oldCommand = message.client.oldCommands.get(secondCommand);
                embed.addField(prefix + oldCommand.aliases.join(' | ') + oldCommand.usage, oldCommand.longDescription);
            }
        } else {
            message.client.oldCommands.forEach(oldCommand => {
                embed.addField(oldCommand.name, oldCommand.description);
            });
        }

        await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}