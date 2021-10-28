const { ContextMenuInteraction } = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { getTrackData, getMultipleTrackData, getPlaylistData, getSpotifyTrack, getSpotifyPlaylist } = require('../utils/apis.js');
const { isYoutubePlaylist, isSpotify, isSpotifyTrack, isSpotifyPlaylist } = require('../utils/regexp');
const playerController = require('../music/playerController');
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
            if (message.author.id !== interaction.client.application.id) return await interaction.reply({ content: `I have no idea how to parse embeds that I didn't send myself`, ephemeral: true });
            const regex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;
            const target = message.embeds[0].description.match(regex);
            if (!target) return await interaction.reply({ content: `Parsing this embed didn't give any result :c`, ephemeral: true });
            if (isYoutubePlaylist(target[0])) {
                await interaction.deferReply();
                const tracks = [];
                const data = await getPlaylistData(target[0]);
                data.items.forEach(entry => {
                    const track = new Track(entry.url, entry.title, entry.thumbnails[0].url, entry.duration);
                    tracks.push(track);
                });
                const final = {
                    name: data.items.length.toString().concat(' Tracks'),
                    thumbnail: data.thumbnails[0].url,
                    title: data.title,
                    url: data.url,
                    track: tracks,
                }
                await playerController.play(final, interaction);
            } else {
                await interaction.deferReply();
                // might cause problems
                const video = await getTrackData(target[0]);
                const final = {
                    name: `1 Track`,
                    thumbnail: video.items[0].thumbnails[0].url,
                    title: video.items[0].title,
                    url: video.items[0].url,
                    track: [new Track(video.items[0].url, video.items[0].title, video.items[0].thumbnails[0].url, video.items[0].duration)],
                    }
                await playerController.play(final, interaction);
            }
        } else if (!message.content || message.content === ' ') return await interaction.reply({ content: `Message is empty.`, ephemeral: true });
        else {
            await interaction.deferReply();
            // might cause problems
            const video = await getTrackData(message.content);
            const final = {
                name: `1 Track`,
                thumbnail: video.items[0].thumbnails[0].url,
                title: video.items[0].title,
                url: video.items[0].url,
                track: [new Track(video.items[0].url, video.items[0].title, video.items[0].thumbnails[0].url, video.items[0].duration)],
                }
            await playerController.play(final, interaction);
        }
    }
}