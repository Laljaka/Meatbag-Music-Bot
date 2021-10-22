const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
// const ytdl = require('youtube-dl-exec');
// const { getInfo } = require('ytdl-core');
// const fs = require('fs');
// const re = require('RegExp')
const test = 'test';
const playerController = require('../music/playerController');
const { Track } = require('../music/track');
const { getTrackData, getMultipleTrackData, getPlaylistData, getSpotifyTrack, getSpotifyPlaylist } = require('../utils/apis.js');
const { isYoutubePlaylist, isSpotify, isSpotifyTrack, isSpotifyPlaylist } = require('../utils/regexp');
const pLimit = require('p-limit');

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
         * @param {Interaction} interaction 
         */
    async execute(interaction) {
        if (!interaction.member.voice.channelId) return await interaction.reply('You need to be in the voice channel to use this command');
        await interaction.deferReply();
        const string = interaction.options.getString('song');
        if (!isSpotify(string)) {
            if (isYoutubePlaylist(string)) {
                const tracks = [];
                const data = await getPlaylistData(string);
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
                // might cause problems
                // if (id) video = await getTrackData(id); else video = await getTrackData(string);
                const video = await getTrackData(string);
                const final = {
                    name: `1 Track`,
                    thumbnail: video.items[0].thumbnails[0].url,
                    title: video.items[0].title,
                    url: video.items[0].url,
                    track: [new Track(video.items[0].url, video.items[0].title, video.items[0].thumbnails[0].url, video.items[0].duration)],
                    }
                await playerController.play(final, interaction);
            }
        } else {
            if (isSpotifyTrack(string)) {
                const data = await getSpotifyTrack(string);
                const title = data.body.artists[0].name + ' - ' + data.body.name;
                const video = await getTrackData(title);
                const final = {
                    name: `1 Track`,
                    thumbnail: data.body.album.images[0].url,
                    title: title,
                    url: data.body.external_urls.spotify,
                    track: [new Track(video.items[0].url, video.items[0].title, data.body.album.images[0].url, video.items[0].duration)],
                }
                await playerController.play(final, interaction);
            } else if (isSpotifyPlaylist(string)) {
                const data = await getSpotifyPlaylist(string);
                // const title = data.body.items[0].track.artists[0].name + ' - ' + data.body.items[0].track.name;
                const requests = [];
                const limit = pLimit(3);
                // const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
                data.body.items.forEach(element => {
                    requests.push(limit(() => getTrackData(element.track.artists[0].name + ' ' + element.track.name)));
                });
                const result = await Promise.all(requests);
                const tracks = [];
                result.forEach(element => {
                    const track = new Track(element.items[0].url, element.items[0].title, element.items[0].thumbnails[0].url, element.items[0].duration);
                    tracks.push(track);
                });
                const final = {
                    name: tracks.length.toString() + ' Tracks',
                    thumbnail: data.body.items[0].track.album.images[0].url,
                    title: 'A Spotify playlist',
                    url: string,
                    track: tracks
                }
                await playerController.play(final, interaction);
                // const response = await asyncPool(2, requests, timeout);

            }
        }
    }
}