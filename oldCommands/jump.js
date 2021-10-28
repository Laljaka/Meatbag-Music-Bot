const { MeatbagMessage } = require("discord.js")
const playerController = require('../music/playerController');

module.exports = {
    name: 'jump',
    aliases: ['jump', 'skip_to'],
    description: 'Jumps to specified position in the queue',
    longDescription: 'Jumps to specified position in the queue, skipping everything in it\'s path',
    usage: ' [position]',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message, args) {
        const number = +args.shift();
        await playerController.jump(message, number);
    }
}