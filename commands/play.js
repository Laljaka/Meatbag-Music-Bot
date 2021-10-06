const { joinVoiceChannel, createAudioResource, createAudioPlayer, getVoiceConnection, demuxProbe, StreamType } = require('@discordjs/voice');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction, DataResolver } = require('discord.js');
const ytdl = require('youtube-dl-exec');
const { MusicSubscription } = require('./music/subscription');

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
        const string = interaction.options.getString('input');
        const channel = interaction.member.voice.channel;

        const process = ytdl.raw(
            string,
            {
                o: '-',
                q: '',
                f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                r: '100K',
            },
            { stdio: ['ignore', 'pipe', 'ignore'] },
        );
        // const { stream, type } = await demuxProbe(process.stdout);
        const stream = process.stdout;
        const resource = createAudioResource(stream, { inputType: StreamType.WebmOpus });
        
        let subscription = new MusicSubscription(
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            }),
        );
        subscription.audioPlayer.play(resource);
        await interaction.reply('Joined the vice channel')
    }
}