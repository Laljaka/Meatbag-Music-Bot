const { MusicSubscription } = require('./subscription');
const { joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('youtube-dl-exec');
const { MessageEmbed } = require('discord.js');
const { Track } = require('./track');

const subscriptions = new Map();

async function play(string, interaction) {
    const channel = interaction.member.voice.channel;
    console.time('ytdlInfo');
    const info = await ytdl(string, {
        dumpSingleJson: true,
        noWarnings: true,
        noCallHome: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
        noPlaylist: true,
        cookies: 'F:\\NEWPAPAKA\\repo\\Meatbag-Music-Bot\\cookies.txt',
    })
    const track = new Track(info.webpage_url, info.title, info.thumbnails[3].url);
    console.timeEnd('ytdlInfo');
    console.time('embed')
    const embed = new MessageEmbed()
        .setColor('DARK_GREEN')
        .setTitle('Equeued')
        .setThumbnail(track.thumbnail)
        .setDescription(`[${track.title}](${track.url})`);
        // .addField('Now playing', `[${info.videoDetails.title}](${info.videoDetails.video_url})`);
    await interaction.editReply({ embeds: [embed] })
    console.timeEnd('embed')
    console.time('subscription')
    let subscription = subscriptions.get(channel.guild.id);
    if (!subscription) {
        subscription = new MusicSubscription(
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            }), interaction.channelId, interaction.client,
        );
        subscriptions.set(channel.guild.id, subscription)
    }
    console.timeEnd('subscription')
    await subscription.enqueue(track);
}

async function skip(interaction) {
    let subscription = subscriptions.get(interaction.guildId);
    if (subscription) {
        subscription.audioPlayer.stop();
        await interaction.reply('Skipped!');
    } else {
        await interaction.reply({ content: 'I am not playing anything!', ephemeral: true });
    }
    
}

module.exports = {
    play,
    skip
}