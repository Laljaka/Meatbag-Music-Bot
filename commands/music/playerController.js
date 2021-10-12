const { MusicSubscription } = require('./subscription');
const { joinVoiceChannel } = require('@discordjs/voice');
// const ytdl = require('youtube-dl-exec');
const ytdl = require('ytdl-core');
// const yts = require('yt-search');
// const ytsbetter = require('youtube-search-without-api-key');
const ytsr = require('ytsr');
const { MessageEmbed, Interaction } = require('discord.js');
const { Track } = require('./track');
// const dotenv = require('dotenv');

// dotenv.config()

// const COOKIE = process.env.COOKIE;

const subscriptions = new Map();

// function isUrl(s) {
//     const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
//     return regexp.test(s);
// }

// function youtube_parser(url){
//     const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match&&match[7].length==11)? match[7] : false;
// }
/**
 * 
 * @param {String} string 
 * @param {Interaction} interaction Discord Interaction
 */
async function play(string, interaction) {
    const channel = interaction.member.voice.channel;
    let subscription = subscriptions.get(channel.guild.id);
    if (!subscription) {
        subscription = new MusicSubscription(
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            }), interaction.channelId, interaction.guildId, interaction.client,
        );
        subscriptions.set(channel.guild.id, subscription)
    }

    // if (!isUrl(string)) {

    // const filters = await ytsr.getFilters(string);
    // const filter = filters.get('Type').get('Video');
    // const videos = await ytsr(filter.url, { limit: 1 });
    // const video = videos.items[0];
    
    // const track = new Track(video.url, video.title, video.thumbnails[0].url);
    // } else {
        // const videoId = youtube_parser(string);
        // const videos = await ytsbetter.search(videoId);
        // const video = videos[0];
        // var track = new Track(video.url, video.title, video.snippet.thumbnails.url);
    // }
    const track = await Track.getData(string);
    const embed = new MessageEmbed()
        .setColor('DARK_GREEN')
        .setTitle('Equeued')
        .setThumbnail(track.thumbnail)
        .setDescription(`[${track.title}](${track.url})`);
        // .addField('Now playing', `[${info.videoDetails.title}](${info.videoDetails.video_url})`);
    await interaction.editReply({ embeds: [embed] })
    await subscription.enqueue(track);
    subscription.emitter.once('destroyed', (guildId) => {
        subscriptions.delete(guildId);
    })
}
/**
 * 
 * @param {Interaction} interaction Discord Interaction
 */
async function skip(interaction) {
    const subscription = subscriptions.get(interaction.guildId);
    if (subscription) {
        subscription.audioPlayer.stop();
        await interaction.reply('Skipped!');
    } else await interaction.reply({ content: 'I am not connected to a voice chat!', ephemeral: true });
}

async function leave(interaction) {
    const subscription = subscriptions.get(interaction.guildId);
    if (subscription) {
        subscription.voiceConnection.destroy();
        await interaction.reply('I left the voice channel!');
    } else await interaction.reply({ content: 'I am not connected to a voice chat!', ephemeral: true });
}
/**
 * 
 * @param {Interaction} interaction Discord Interaction
 */
async function queue(interaction) {
    const subscription = subscriptions.get(interaction.guildId);
    if (subscription) {
        if (subscription.currentlyPlaying !== null) {
            const embed = new MessageEmbed()
                .setColor('DARK_GOLD')
                .setTitle('Queue')
            embed.addField('Position 1', `[${subscription.currentlyPlaying.title}](${subscription.currentlyPlaying.url})`);
            if (subscription.queue.lenght !== 0) {
                let i = 2;
                subscription.queue.forEach(element => {
                    embed.addField(`Position ${i}`, `[${element.title}](${element.url})`);
                    i = i + 1;
                });
            }
            await interaction.reply({ embeds: [embed] });
        } else await interaction.reply({ content: 'I am not playing anything!', ephemeral: true });
    } else await interaction.reply({ content: 'I am not connected to a voice chat!', ephemeral: true });
}

module.exports = {
    play,
    skip,
    queue,
    leave
}