const { SlashCommandBuilder } = require("@discordjs/builders");
const playerController = require('../music/playerController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue'),
    async execute(interaction) {
        await playerController.shuffleQueue(interaction);
    }
}