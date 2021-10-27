const { MeatbagMessage } = require("discord.js")
const playerController = require('../music/playerController');

module.exports = {
    name: 'shuffle',
    aliases: ['shuffle', 'mix'],
    description: 'Shuffles the queue',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await playerController.shuffleQueue(message);
    }
}