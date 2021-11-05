const { SlashCommandBuilder } = require("@discordjs/builders");
const { MeatbagInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue'),

    /**
     * 
     * @param { MeatbagInteraction } interaction 
     */
    async execute(interaction) {
        await interaction.client.musicPlayer.shuffleQueue(interaction);
    }
}