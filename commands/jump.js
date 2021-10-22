const { SlashCommandBuilder } = require("@discordjs/builders");
const playerController = require('../music/playerController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jumps to a specific track in queue ad skips everything it passed')
        .addIntegerOption(option => 
            option.setName('to_position')
                .setDescription('a position in queue to jump to')
                .setRequired(true)),
    async execute(interaction) {
        const number = interaction.options.getInteger('to_position');
        await playerController.jump(interaction, number);
    }
}