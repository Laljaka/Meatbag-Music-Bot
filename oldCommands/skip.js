const { MeatbagMessage } = require("discord.js")

module.exports = {
    name: 'skip',
    aliases: ['skip'],
    description: 'Skips current song in the queue',
    longDescription: 'Skips current song in the queue',
    usage: ' ',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await message.client.musicPlayer.skip(message);
    }
}