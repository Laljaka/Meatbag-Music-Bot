const { MeatbagMessage } = require("discord.js")

module.exports = {
    name: 'queue',
    aliases: ['queue', 'q', 'list', 'songs'],
    description: 'Shows the queue',
    longDescription: 'Shows the queue',
    usage: ' ',
    
    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await message.client.musicPlayer.queue(message);
    }
}