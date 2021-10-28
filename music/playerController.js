const { MusicSubscription } = require('./subscription');
const { joinVoiceChannel } = require('@discordjs/voice');
const { MessageEmbed, MeatbagMessage, MeatbagInteraction, Interaction } = require('discord.js');
const { Track } = require('./track');
const { shuffle } = require('../utils/utils');
const { isYoutubePlaylist, isSpotify, isSpotifyTrack, isSpotifyPlaylist, isUrl, isSpotifyAulbum } = require('../utils/regexp');
const { getTrackData, 
    getSpotifyAlbum, 
    getPlaylistData, 
    getSpotifyTrack, 
    getSpotifyPlaylist, 
    getTrackDataById 
} = require('../utils/apis.js');


/**
 * 
 * @param {any} track
 * @param {MeatbagInteraction | MeatbagMessage} interaction Discord Interaction
 * @param {string} string
 */

async function play(interaction, string) {
    if (!isUrl(string)) {
        const video = await getTrackData(string);
        const final = {
            name: `1 Track`,
            thumbnail: video.items[0].thumbnails[0].url,
            title: video.items[0].title,
            url: video.items[0].url,
            track: [new Track(video.items[0].url, video.items[0].title, video.items[0].thumbnails[0].url, video.items[0].duration)],
            }
        await run(final, interaction);
    } else {
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
                await run(final, interaction);
            } else {
                const video = await getTrackDataById(string);
                const final = {
                    name: `1 Track`,
                    thumbnail: video.items[0].thumbnails[0].url,
                    title: video.items[0].title,
                    url: video.items[0].url,
                    track: [new Track(video.items[0].url, video.items[0].title, video.items[0].thumbnails[0].url, video.items[0].duration)],
                    }
                await run(final, interaction);
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
                await run(final, interaction);
            } else {
                let data;
                if (isSpotifyPlaylist(string)) data = await getSpotifyPlaylist(string);
                else if (isSpotifyAulbum(string)) data = await getSpotifyAlbum(string);
                // const title = data.body.items[0].track.artists[0].name + ' - ' + data.body.items[0].track.name;
                // const requests = [];
                // const limit = pLimit(5);
                // const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
                const tracks = [];
                data.body.items.forEach(element => {
                    const title = element.track.artists[0].name + ' ' + element.track.name;
                    const track = new Track(null, title, null, null);
                    tracks.push(track);
                });
                // const result = await Promise.all(requests);
                const final = {
                    name: tracks.length.toString() + ' Tracks',
                    thumbnail: data.body.items[0].track.album.images[0].url,
                    title: 'A Spotify playlist',
                    url: string,
                    track: tracks
                }
                await run(final, interaction);
            }
        }
    }
}

/**
 * 
 * @param {any} track 
 * @param {MeatbagInteraction | MeatbagMessage} interaction 
 */
async function run(track, interaction) {
    const channel = interaction.member.voice.channel;
    let subscription = interaction.client.subscriptions.get(channel.guild.id);
    if (!subscription) {
        subscription = new MusicSubscription(
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            }), interaction.channelId, interaction.guildId, interaction.client,
        );
        interaction.client.subscriptions.set(channel.guild.id, subscription)
    }

    if (subscription.channelLock !== interaction.channelId) {
        if (interaction instanceof Interaction) {
            await interaction.deleteReply();
            return await interaction.followUp({ content: `Please use the same channel as you did when the bot first joined the voice chat, which is <#${subscription.channelLock}>`, ephemeral: true });
        } else {
            return await interaction.channel.send({ content: `Please use the same channel as you did when the bot first joined the voice chat, which is <#${subscription.channelLock}>` });
        }
    }
    
    const embed = new MessageEmbed()
        .setColor('DARK_GREEN')
        .setTitle(`Equeued ${track.name}`)
        .setThumbnail(track.thumbnail)
        .setDescription(`[${track.title}](${track.url})`);
        // .addField('Now playing', `[${info.videoDetails.title}](${info.videoDetails.video_url})`);
    if (interaction instanceof Interaction) await interaction.editReply({ content: '\u200b', embeds: [embed], components: [] });
    else await interaction.channel.send({ content: '\u200b', embeds: [embed], components: [] });
    
    await subscription.enqueue(track.track);
    // subscription.emitter.once('destroyed', (guildId) => {
    //     interaction.client.subscriptions.delete(guildId);
    // })
}

/**
 * 
 * @param {MeatbagInteraction | MeatbagMessage} interaction Discord Interaction
 */
async function skip(interaction) {
    const subscription = interaction.client.subscriptions.get(interaction.guildId);
    if (subscription) {
        if (!subscription.isPlaying) return await interaction.reply({ content: 'I am not playing anything or you are skipping too fast', ephemeral: true });
        // subscription.isPlaying = false;
        subscription.audioPlayer.stop();
        await interaction.reply('Skipped!');
    } else await interaction.reply({ content: 'I am not connected to a voice chat!', ephemeral: true });
}

/**
 * 
 * @param {MeatbagInteraction | MeatbagMessage} interaction 
 */
async function leave(interaction) {
    const subscription = interaction.client.subscriptions.get(interaction.guildId);
    if (subscription) {
        subscription.voiceConnection.destroy();
        await interaction.reply('I left the voice channel!');
    } else await interaction.reply({ content: 'I am not connected to a voice chat!', ephemeral: true });
}

/**
 * 
 * @param {MeatbagInteraction | MeatbagMessage} interaction Discord Interaction
 */
async function queue(interaction) {
    const subscription = interaction.client.subscriptions.get(interaction.guildId);
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

/**
 * 
 * @param {MeatbagInteraction | MeatbagMessage} interaction 
 * @param {BigInt} number 
 */
async function jump(interaction, number) {
    const subscription = interaction.client.subscriptions.get(interaction.guildId);
    if (subscription) {
        if (number <= 1 || number > subscription.queue.length + 1) return await interaction.reply({ content: 'Provided number is out of range', ephemeral: true });
        else if (number === 2) {
            subscription.audioPlayer.stop();
            await interaction.reply({ content: 'Jumped to the next track, could\'ve just used skip' });
        }
        else {
            subscription.queueLock = true;
            subscription.queue = subscription.queue.slice(number - 2);
            subscription.queueLock = false;
            subscription.audioPlayer.stop();
            await interaction.reply({ content: `Jumped to position ${number}` });
        }
    } else await interaction.reply({ content: 'I am not connected to a voice chat!', ephemeral: true });
}

/**
 * 
 * @param {MeatbagInteraction | MeatbagMessage} interaction 
 */
async function shuffleQueue(interaction) {
    const subscription = interaction.client.subscriptions.get(interaction.guildId);
    if (subscription) {
        if (!subscription.queueLock) {
            subscription.queueLock = true;
            shuffle(subscription.queue);
            subscription.queueLock = false;
            await interaction.reply('Shuffled!');
        }
    } else await interaction.reply({ content: 'I am not connected to a voice chat!', ephemeral: true });
}

module.exports = {
    play,
    skip,
    queue,
    leave,
    jump,
    shuffleQueue,
    run
}