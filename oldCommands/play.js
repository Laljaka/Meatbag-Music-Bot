const { MeatbagMessage } = require("discord.js")

module.exports = {
    name: 'play',
    aliases: ['play', 'p', 'enqueue'],
    description: 'Adds a song to the queue',
    longDescription: 'Adds a song to the queue and starts playing it, if nothing was playing befor',
    usage: '        [link or search request]',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message, args) {
        const string = args.join(' ');
        await message.client.musicPlayer.play(message, string);
    }
}