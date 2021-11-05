const { SlashCommandBuilder } = require("@discordjs/builders");
const { MeatbagInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops playing and clears the queue'),

    /**
     * 
     * @param { MeatbagInteraction } interaction 
     */
    async execute(interaction) {
        await interaction.client.musicPlayer.stop(interaction);
    }
}