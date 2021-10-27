const { MeatbagMessage, MessageEmbed } = require("discord.js")

module.exports = {
    name: 'help',
    aliases: ['help', 'h', 'commands'],
    description: 'Shows this message',
    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message, args) {
        const embed = new MessageEmbed();
        const secondCommandRaw = args.shift();
        if (secondCommandRaw) {
            const secondCommand = secondCommandRaw.toLowerCase();
            if (message.client.oldCommands.has(secondCommand)) {
                const oldCommand = message.client.oldCommands.get(secondCommand);
                embed.addField(oldCommand.aliases.join(' | '), oldCommand.description);
            }
        } else {
            message.client.oldCommands.forEach(oldCommand => {
                embed.addField(oldCommand.name, oldCommand.description);
            });
        }

        await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}