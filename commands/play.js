const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require('discord.js');
// const ytdl = require('youtube-dl-exec');
// const { getInfo } = require('ytdl-core');
// const fs = require('fs');
// const re = require('RegExp')
const test = 'test';
const playerController = require('./music/playerController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joins the voice channel (for now)')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('URL or search request')
                .setRequired(true)),
        /**
         * 
         * @param {Interaction} interaction 
         */
    async execute(interaction) {
        if (!interaction.member.voice.channelId) return await interaction.reply('You need to be in te voice chat to use this command');
        await interaction.deferReply();
        // var connection = getVoiceConnection(interaction.guildId);
        // if (!connection) {
        //         connection = joinVoiceChannel({
        //         channelId: interaction.member.voice.channelId,
        //         guildId: interaction.guildId,
        //         adapterCreator: interaction.guild.voiceAdapterCreator,
        //     });
        //     console.log('created new connection')
        // }
        // const string = interaction.options.getString('input');
        // const resource = createAudioResource(ytdl(string, {
        //     highWaterMark: 1024*64,
        //     quality: 'highestaudio'
        // }));
        // const player = createAudioPlayer();
        // connection.subscribe(player);
        // player.play(resource);
        let string = interaction.options.getString('input');
        // const process = ytdl.raw(
        //     string,
        //     {
        //         o: '-',
        //         q: '',
        //         // v: '',
        //         f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
        //         r: '100K',
        //         cookies: 'F:\\NEWPAPAKA\\repo\\Meatbag-Music-Bot\\cookies.txt',
        //         // addHeader: 'LOGIN_INFO:AFmmF2swRAIgIbuQIwapdUb4Kbzr2Zs3DSGpTl_gaVzgfQlBPt2LEBMCIHoKroAOTCzOZj2-0kwWLuCVZT8m8E9hX3MlMC_ibVLS:QUQ3MjNmekZZU0YzWktkYU5mR2N3VXBTNDNUM2VQWWtIQ0g0RDB0WnljLTF5SG1jdnVweldSQmZhSWlHU0loWllhOVVaX2lsRThiR3ZaMGZwZTd5eDhVZ1dSOUY3RmlzRGFxN0pETFhqWl9zLTZmbXF6eUEwVzJYNkVtZWRWMWNiOEtsVjJFc1lQY0RXcjZFTlhIbjk4aUNNVjdpMjZIM0ZZTUZ3MUJlM05aV0QzRDdxS3QxM2NZ',
        //     },
        //      { stdio: ['ignore', 'pipe', 'ignore'] },
        // );

        // process.stderr.pipe(fs.createWriteStream('stderr.txt'));
        // const { stream, type } = await demuxProbe(process.stdout);
        // const stream = process.stdout;
        // const resource = createAudioResource(stream, { inputType: StreamType.WebmOpus });
        
        // subscription.audioPlayer.play(resource);
        // const info = await getInfo(string);
        await playerController.play(string, interaction);
    }
}