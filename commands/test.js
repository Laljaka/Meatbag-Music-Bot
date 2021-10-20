const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require('ytdl-core');
const fs = require('fs');
const dotenv = require('dotenv');
const { Interaction } = require('discord.js');
const { isPlaylist, isSpotifyTrack } = require('../utils/regexp');
const { Track } = require('./music/track');
const { getTrackData, getMultipleTrackData, getPlaylistData, getSpotifyTrack, getSpotifyPlaylist } = require('../utils/apis.js');
const ytsr = require('ytsr');
const pLimit = require('p-limit');
// import pLimit from 'p-limit';

dotenv.config();

const COOKIE = process.env.COOKIE;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Displays test message'),
        /**
         * 
         * @param { Interaction } interaction 
         */
    async execute(interaction) {
        await interaction.reply('Test message')
        console.log(isSpotifyTrack('https://open.spotify.com/playlist/37i9dQZEVXcXuUkbUY9cSY?si=04f7dbaa29874fcf'))
    }
}