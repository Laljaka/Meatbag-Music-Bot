const { MeatbagMessage } = require("discord.js")

module.exports = {
    name: 'stop',
    aliases: ['stop', 'clear'],
    description: 'Stops the playback and clears the queue',
    longDescription: 'Stops the playback and clears the queue',
    usage: '    ',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await message.client.musicPlayer.stop(message);
    }
}