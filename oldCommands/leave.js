const { MeatbagMessage } = require("discord.js")
const playerController = require('../music/playerController');

module.exports = {
    name: 'leave',
    aliases: ['leave', 'l', 'dc', 'disconnect', 'exit'],
    description: 'Leaves the voice chat and purges the queue',
    longDescription: 'Leaves the voice chat and purges the queue',
    usage: ' ',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await playerController.leave(message);
    }
}