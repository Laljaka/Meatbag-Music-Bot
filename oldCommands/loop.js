const { MeatbagMessage } = require("discord.js")

module.exports = {
    name: 'loop',
    aliases: ['loop', 'repeat'],
    description: 'Puts the current song on repeat',
    longDescription: 'Puts the current song on repeat',
    usage: '    ',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await message.client.musicPlayer.loop(message);
    }
}