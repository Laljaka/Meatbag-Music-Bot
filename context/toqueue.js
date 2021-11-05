const { ContextMenuInteraction, Interaction } = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { getTrackData, getMultipleTrackData, getPlaylistData, getSpotifyTrack, getSpotifyPlaylist } = require('../utils/apis.js');
const { isYoutubePlaylist, isSpotify, isSpotifyTrack, isSpotifyPlaylist } = require('../utils/regexp');
const { Track } = require('../music/track');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Add to queue')
        .setType(3),

    /**
     * 
     * @param { ContextMenuInteraction } interaction 
     */
    async execute(interaction) {
        const message = await interaction.channel.messages.fetch(interaction.targetId);
        if (message.embeds && (!message.content || message.content === '\u200b')) {
            if (message.author.id !== interaction.client.application.id) return await interaction.reply({ content: 'I don\'t know how to parse embeds that not belongs to me :c', ephemeral: true });
            const data = message.embeds[0].description;
            await interaction.client.musicPlayer.play(data);
        } else if (!message.content || message.content === ' ') return await interaction.reply({ content: `Message is empty.`, ephemeral: true });
        else {
            await interaction.client.musicPlayer.play(message.content);
        }
    }
}