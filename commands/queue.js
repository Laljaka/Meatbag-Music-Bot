const { SlashCommandBuilder } = require("@discordjs/builders");
const playerController = require('./music/playerController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the music queue'),
    async execute(interaction) {
        await playerController.queue(interaction);
    }
}