const { SlashCommandBuilder } = require("@discordjs/builders");
const { MeatbagInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song')
        .addIntegerOption(option => 
            option.setName('position')
                .setDescription('a position in the queue to skip')
                .setRequired(false)),

    /**
     * 
     * @param { MeatbagInteraction } interaction 
     */
    async execute(interaction) {
        const number = interaction.options.getInteger('position');
        await interaction.client.musicPlayer.skip(interaction, number);
    }
}