const { SlashCommandBuilder } = require("@discordjs/builders");
const playerController = require('../music/playerController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),
    async execute(interaction) {
        await playerController.skip(interaction);
    }
}