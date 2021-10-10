const { 
    AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
    createAudioResource,
	createAudioPlayer,
	entersState,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
    StreamType,
	VoiceConnectionStatus,
} = require('@discordjs/voice');
const { Client, MessageEmbed } = require('discord.js');
const ytdl = require('youtube-dl-exec');
const ytdlc = require('ytdl-core');
const { Track } = require('./track');

class MusicSubscription {
    /**
     * 
     * @param {VoiceConnection} voiceConnection 
     * @param {String} channelId
     * @param {Client} client
     */
    constructor(voiceConnection, channelId, client) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.queue = [];
        this.isPlaying = false;
        this.queueLock = false;
        this.readyLock = false;
        this.channelId = channelId;
        this.client = client;
        this.currentlyPlaying = null;

        this.voiceConnection.on('stateChange', async (_, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
                    } catch {
                        try {
                        this.voiceConnection.destroy();
                        } catch (err) { console.log(err) }
                    }
                } else if (this.voiceConnection.rejoinAttempts < 5) {
                    await wait((this.voiceConnection.rejoinAttempts + 1) * 5_000);
                    this.voiceConnection.rejoin();
                } else {
                    this.voiceConnection.destroy();
                }
            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                // TODO this.stop()
                this.stop();
                console.log('destroyed');
            } else if (!this.readyLock && (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)) {
                this.readyLock = true;
                try {
                    await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000);
                } catch {
                    if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
                } finally {
                    this.readyLock = false;
                }
            }
        });

        this.audioPlayer.on('stateChange', async (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                // TODO start playing a new track
                this.currentlyPlaying = null;
                this.isPlaying = false;
                await this.processQueue()
            } else if (newState.status === AudioPlayerStatus.Playing) {
                // TODO weird on state when playing
                this.isPlaying = true;
                console.timeEnd('play')
                const embed = new MessageEmbed()
                    .setColor('BLURPLE')
                    .setTitle('Now Playing')
                    .setThumbnail(this.currentlyPlaying.thumbnail)
                    .setDescription(`[${this.currentlyPlaying.title}](${this.currentlyPlaying.url})`);
                this.client.channels.fetch(this.channelId).then(channel => {
                    channel.send({ embeds: [embed] });
                });
            }
        });

        this.audioPlayer.on('error', (error) => console.log(error));

        voiceConnection.subscribe(this.audioPlayer);
    }
    /**
     * 
     * @param { Track } track 
     */
    async enqueue(track) {
        this.queue.push(track);
        await this.processQueue();
    }

    stop() {
        this.queueLock = true;
        this.queue = [];
        this.audioPlayer.stop();
    }

    async processQueue() {
        if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) return;

        this.queueLock = true;
        this.currentlyPlaying = this.queue.shift();
        try {
            const resource = await this.currentlyPlaying.createAudioResourceW();
            this.audioPlayer.play(resource);
            this.queueLock = false;
        } catch (error) {
            console.log(error);
            this.queueLock = false;
            return await this.processQueue();
        }
    }
}

module.exports = {
    MusicSubscription
}