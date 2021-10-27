const { MeatbagMessage } = require("discord.js")
const playerController = require('../music/playerController');

module.exports = {
    name: 'queue',
    aliases: ['queue', 'q', 'list'],
    description: 'Shows queue',
    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await playerController.queue(message);
    }
}