const { MeatbagMessage } = require('discord.js');

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        const prefix = message.client.prefixes.get(message.guildId);
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        let command = message.client.oldCommands.get(commandName);

        if (!command) {
            command = message.client.oldCommands.find(oldCommand => oldCommand.aliases.includes(commandName));
            if (!command) return;
        }

        try {
            await command.execute(message, args, prefix);
        } catch(error) {
            console.error(error);
            await message.reply('There was an error while executing old command!');
        }
    }
}