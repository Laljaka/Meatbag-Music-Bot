const { Message } = require("discord.js")
const playerController = require('../music/playerController');

module.exports = {
    name: 'queue',
    aliases: '',
    /**
     * 
     * @param { Message } message 
     */
    async execute(message) {
        await playerController.queue(message);
    }
}