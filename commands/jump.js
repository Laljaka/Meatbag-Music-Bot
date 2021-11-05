const { SlashCommandBuilder } = require("@discordjs/builders");
const { MeatbagInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jumps to a specific track in queue ad skips everything it passed')
        .addIntegerOption(option => 
            option.setName('to_position')
                .setDescription('a position in queue to jump to')
                .setRequired(true)),
    
    /**
     * 
     * @param { MeatbagInteraction } interaction 
     */
    async execute(interaction) {
        const number = interaction.options.getInteger('to_position');
        await interaction.client.musicPlayer.jump(interaction, number);
    }
}