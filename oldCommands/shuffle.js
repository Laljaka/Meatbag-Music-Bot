const { MeatbagMessage } = require("discord.js")

module.exports = {
    name: 'shuffle',
    aliases: ['shuffle', 'mix'],
    description: 'Shuffles the queue',
    longDescription: 'Shuffles the queue',
    usage: ' ',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await message.client.musicPlayer.shuffleQueue(message);
    }
}