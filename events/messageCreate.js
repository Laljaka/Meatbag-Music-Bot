const { Message } = require('discord.js');

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param { Message } message 
     */
    async execute(message) {
        if (!message.member.id === '664704886444654613') return; // TESTING
        const prefix = message.client.prefixes.get(message.guildId);
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.oldCommands.get(commandName);

        if(!command) return;

        try {
            await command.execute(message, args, prefix);
        } catch(error) {
            console.error(error);
            await message.reply('There was an error while executing old command!');
        }
    }
}