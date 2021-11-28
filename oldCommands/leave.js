const { MeatbagMessage } = require("discord.js")

module.exports = {
    name: 'leave',
    aliases: ['leave', 'l', 'dc', 'disconnect', 'exit', 'quit'],
    description: 'Leaves the voice chat and purges the queue',
    longDescription: 'Leaves the voice chat and purges the queue',
    usage: ' ',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await message.client.musicPlayer.leave(message);
    }
}