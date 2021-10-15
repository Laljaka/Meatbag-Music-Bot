const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require('ytdl-core');
const fs = require('fs');
const dotenv = require('dotenv');
const yts = require('yt-search');
const ytsrAAAAAAA = require('ytsr');
const ytsbetter = require('youtube-search-without-api-key');

dotenv.config();

const COOKIE = process.env.COOKIE;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Displays test message'),
    async execute(interaction) {
        await interaction.reply('Test message')

        const video = await yts({ videoId: '62ezXENOuIA' });
        console.log(video.title);
        console.log(video.url);
        console.log(video.thumbnail);
    }
}