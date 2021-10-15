const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
// const ytdl = require('youtube-dl-exec');
// const { getInfo } = require('ytdl-core');
// const fs = require('fs');
// const re = require('RegExp')
const test = 'test';
const playerController = require('./music/playerController');
const { Track } = require('./music/track');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joins the voice channel (for now)')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('URL or search request')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('search requests to give back (max 10), if not specified - the song will be played immediately')),
        /**
         * 
         * @param {Interaction} interaction 
         */
    async execute(interaction) {
        if (!interaction.member.voice.channelId) return await interaction.reply('You need to be in the voice channel to use this command');
        await interaction.deferReply();
        const number = interaction.options.getInteger('amount');
        const string = interaction.options.getString('input');
        if (!number || number === 1 || number === 0) {
            const track = await Track.getData(string);
            await playerController.play(track, interaction);
        } else if (number < 0) return await interaction.editReply('Invalid number');
        else if (number >= 10) return await interaction.editReply(`Yeah, try ${number*10} next time, that will be easy to read.`);
        else {
            const components = [];
		    const resultMap = new Map();
            const tracks = await Track.getMultipleData(string, number);

            tracks.items.forEach((track, i) => {
                const toMap = `${i+1}_option`
                const stuff = {
                    label: `Track ${track.duration}`,
                    description: track.title,
                    value: toMap
                }
                components.push(stuff);
                resultMap.set(toMap, track);
            })

            const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions(components),
			);

		    await interaction.editReply({ content: 'Please choose a song to play', components: [row] });

            const collector = interaction.channel.createMessageComponentCollector({ time: 30*1000 });
            let isReplied = false;
            collector.on('collect', async i => {
                const trackData = resultMap.get(i.values[0])
                const track = new Track(trackData.url, trackData.title, trackData.thumbnails[0].url, trackData.duration)
                isReplied = true;
                // await interaction.deleteReply();
                await playerController.play(track, interaction);
            })
    
            collector.on('end', async _ => {
                if (!isReplied) await interaction.editReply({ content: 'You ran out of time', components: [] });
            })
        }
    }
}