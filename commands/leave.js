const { SlashCommandBuilder } = require("@discordjs/builders");
const playerController = require('./music/playerController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leaves the voice chat and clears the queue'),
    async execute(interaction) {
        await playerController.leave(interaction);
    }
}