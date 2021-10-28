const { MeatbagMessage } = require("discord.js")
const playerController = require('../music/playerController');

module.exports = {
    name: 'queue',
    aliases: ['queue', 'q', 'list'],
    description: 'Shows the queue',
    longDescription: 'Shows the queue',
    usage: ' ',
    
    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await playerController.queue(message);
    }
}