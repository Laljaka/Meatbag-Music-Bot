const { MeatbagMessage } = require("discord.js")
const playerController = require('../music/playerController');

module.exports = {
    name: 'play',
    aliases: ['play', 'p', 'enqueue'],
    description: 'Adds a song to the queue and starts playing it, if nothing was playing before',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message, args) {
        const string = args.join(' ');
        await playerController.play(message, string);
    }
}