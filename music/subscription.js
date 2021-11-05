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
const ytdlc = require('ytdl-core');
const { Track } = require('./track');
// const { EventEmitter } = require('events');

/**
 * @type {import('./subscription').MusicSubscription}
 */
class MusicSubscription {
    // /**
    //  * 
    //  * @param {VoiceConnection} voiceConnection 
    //  * @param {String} channelId
    //  * @param {Client} client
    //  */
    constructor(voiceConnection, channelId, guildId, client) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.queue = [];
        this.isPlaying = false;
        // this.queueLock = false;
        this.readyLock = false;
        this.channelLock = channelId;
        this.client = client;
        this.currentlyPlaying = null;
        // this.emitter = new EventEmitter();
        this.guildId = guildId;
        this.timeout;
        this.retry = 0;

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
                this.stop();
                // this.emitter.emit('destroyed', this.guildId);
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
                // if (this.queue.length === 0) this.currentlyPlaying = null;
                this.isPlaying = false;
                await this.#processQueue();
            } else if (newState.status === AudioPlayerStatus.Playing) {
                if (!this.isPlaying) {
                    this.isPlaying = true;
                    // if (this.currentlyPlaying !== null) {
                    const embed = new MessageEmbed()
                        .setColor('BLURPLE')
                        .setTitle(`Now Playing ${this.currentlyPlaying.duration}`)
                        .setThumbnail(this.currentlyPlaying.thumbnail)
                        .setDescription(`[${this.currentlyPlaying.title}](${this.currentlyPlaying.url})`);
                    this.client.channels.fetch(this.channelLock).then(channel => {
                        channel.send({ embeds: [embed] });
                    });
                    // }
                }
            }
        });

        this.audioPlayer.on('error', (error) => console.log(error));

        voiceConnection.subscribe(this.audioPlayer);
    }
    // /**
    //  * 
    //  * @param { Track } track 
    //  */
    async enqueue(track) {
        this.queue = this.queue.concat(track);
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        if (!this.currentlyPlaying) await this.#processQueue();
    }

    stop() {
        // this.queueLock = true;
        this.queue = [];
        this.audioPlayer.stop(true);
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        this.client.musicPlayer.subscriptions.delete(this.guildId);
    }

    async #processQueue() {
        this.currentlyPlaying = this.queue.shift();
        // if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle) return;
        if (!this.currentlyPlaying) {
            return this.timeout = setTimeout(() => {
                this.client.channels.fetch(this.channelLock).then(channel => {
                    channel.send('I left the voice chat due to inactivity');
                });
                this.voiceConnection.destroy();
            }, 10*60*1000);
        }

        // this.queueLock = true;
        if (!this.currentlyPlaying.url) await this.currentlyPlaying.fetchMissingData();
        // this.queueLock = false;
        this.retry = 0;
        await this.#tryPlay()
    }

    async #tryPlay() {
        try {
            const resource = await this.currentlyPlaying.createAudioResourceW();
            this.audioPlayer.play(resource);
        } catch (error) {
            console.log(error);
            console.log('skipped song cause of error');
            const embed = new MessageEmbed()
                .setColor('RED')
                .setTitle(`Error while trying to load song:`)
                .setDescription(`[${this.currentlyPlaying.title}](${this.currentlyPlaying.url})`)
                .setFooter((this.retry < 2) ? 'RETRYING' : 'OUT OF RETRY ATTEMPTS, SKIPPING');
            this.client.channels.fetch(this.channelLock).then(channel => {
                channel.send({ embeds: [embed] });
            });
            if (this.retry < 2) {
                this.retry = this.retry + 1;
                await this.#tryPlay();
            } else return await this.#processQueue();
        }
    }
}

module.exports = {
    MusicSubscription
}