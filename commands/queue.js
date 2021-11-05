const { SlashCommandBuilder } = require("@discordjs/builders");
const { MeatbagInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the music queue'),

    /**
     * 
     * @param { MeatbagInteraction } interaction 
     */
    async execute(interaction) {
        await interaction.client.musicPlayer.queue(interaction);
    }
}