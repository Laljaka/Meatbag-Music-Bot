const { SlashCommandBuilder } = require("@discordjs/builders");
const { MeatbagInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leaves the voice chat and clears the queue'),

    /**
     * 
     * @param { MeatbagInteraction } interaction 
     */
    async execute(interaction) {
        await interaction.client.musicPlayer.leave(interaction);
    }
}