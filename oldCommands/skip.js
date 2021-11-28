const { MeatbagMessage } = require("discord.js")

module.exports = {
    name: 'skip',
    aliases: ['skip', 'remove'],
    description: 'Skips current or specified song in the queue',
    longDescription: 'Skips current or specified song in the queue',
    usage: '        [position]',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message, args) {
        const number = parseInt(args.shift(), 10);
        await message.client.musicPlayer.skip(message, number);
    }
}