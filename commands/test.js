const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require('ytdl-core');
const fs = require('fs');
const dotenv = require('dotenv');
const { Interaction } = require('discord.js');
const { isPlaylist, isSpotifyTrack } = require('../utils/regexp');
const { Track } = require('../music/track');
const { getTrackData, getMultipleTrackData, getPlaylistData, getSpotifyTrack, getSpotifyPlaylist } = require('../utils/apis.js');
const ytsr = require('ytsr');
// import pLimit from 'p-limit';

// dotenv.config();

// const COOKIE = process.env.COOKIE;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Displays test message'),
        /**
         * 
         * @param { Interaction } interaction 
         */
    async execute(interaction) {
        // await interaction.reply('Test message');
        // const data = await getTrackData('scions and sinners ultima');
        const data = parseInt('obama', 10);
        // console.log(Number.isInteger(data));
        console.log(data);
        console.log(typeof data);
        // console.log(isSpotifyTrack('https://open.spotify.com/playlist/37i9dQZEVXcXuUkbUY9cSY?si=04f7dbaa29874fcf'))
    }
}