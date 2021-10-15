const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require('ytdl-core');
const fs = require('fs');
const dotenv = require('dotenv');
const yts = require('yt-search');
const ytsrAAAAAAA = require('ytsr');
const ytsbetter = require('youtube-search-without-api-key');
const { Interaction } = require('discord.js');

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
        console.log(interaction.client.subscriptions);
    }
}