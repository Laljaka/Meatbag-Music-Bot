const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { MeatbagInteraction } = require('discord.js');
const test = 'test';


module.exports = {
    data: new SlashCommandBuilder() 
        .setName('play')
        .setDescription('Joins the voice channel and plays the queued song')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('URL or search request')
                .setRequired(true)),
    /**
     * 
     * @param {MeatbagInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.member.voice.channelId) return await interaction.reply('You need to be in the voice channel to use this command');
        await interaction.deferReply();
        const string = interaction.options.getString('song');
        await interaction.client.musicPlayer.play(interaction, string)
    }
}