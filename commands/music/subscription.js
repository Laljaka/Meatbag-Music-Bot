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
const { EventEmitter } = require('events');

class MusicSubscription {
    /**
     * 
     * @param {VoiceConnection} voiceConnection 
     * @param {String} channelId
     * @param {Client} client
     */
    constructor(voiceConnection, channelId, guildId, client) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.queue = [];
        this.isPlaying = false;
        this.queueLock = false;
        this.readyLock = false;
        this.channelId = channelId;
        this.client = client;
        this.currentlyPlaying = null;
        this.emitter = new EventEmitter();
        this.guildId = guildId;
        this.timeout;

        this.voiceConnection.on('stateChange', async (_, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    // try {
                    //     await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
                    // } catch {
                        try {
                            this.voiceConnection.destroy();
                            // this.emitter.emit('destroyed');
                        } catch (err) { console.log(err) }
                    // }
                } else if (this.voiceConnection.rejoinAttempts < 5) {
                    await wait((this.voiceConnection.rejoinAttempts + 1) * 5_000);
                    this.voiceConnection.rejoin();
                } else {
                    this.voiceConnection.destroy();
                    // this.emitter.emit('destroyed');
                }
            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                // TODO this.stop()
                this.stop();
                this.emitter.emit('destroyed', this.guildId);
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
                if (!this.isPlaying) {
                    this.isPlaying = true;
                    // if (this.currentlyPlaying !== null) {
                    const embed = new MessageEmbed()
                        .setColor('BLURPLE')
                        .setTitle('Now Playing')
                        .setThumbnail(this.currentlyPlaying.thumbnail)
                        .setDescription(`[${this.currentlyPlaying.title}](${this.currentlyPlaying.url})`);
                    this.client.channels.fetch(this.channelId).then(channel => {
                        channel.send({ embeds: [embed] });
                    });
                    // }
                }
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
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        await this.processQueue();
    }

    stop() {
        // return new Promise((resolve, reject) => {
        this.queueLock = true;
        this.queue = [];
        // this.currentlyPlaying = null;
        this.audioPlayer.stop(true);
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        // if (this.currentlyPlaying) {
        //     if (!this.currentlyPlaying.process.killed) this.currentlyPlaying.process.kill()
        // }
        // resolve();
        // })
    }

    async processQueue() {
        if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle) return;
        if (this.queue.length === 0) {
            return this.timeout = setTimeout(() => {
                this.client.channels.fetch(this.channelId).then(channel => {
                    channel.send('I left the voice chat due to inactivity');
                });
                this.voiceConnection.destroy();
            }, 10*60*1000);
        }

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