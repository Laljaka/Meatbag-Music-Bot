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
const ytdl = require('youtube-dl-exec');

class MusicSubscription {
    /**
     * 
     * @param {VoiceConnection} voiceConnection 
     */
    constructor(voiceConnection) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.queue = [];
        this.isPlaying = false;
        this.queueLock = false;
        this.readyLock = false;

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
                this.isPlaying = false;
                await this.processQueue()
            } else if (newState.status === AudioPlayerStatus.Playing) {
                // TODO weird on state when playing
                this.isPlaying = true;
            }
        });

        this.audioPlayer.on('error', (error) => console.log(error));

        voiceConnection.subscribe(this.audioPlayer);
    }

    async enqueue(track) {
        this.queue.push(track);
        await this.processQueue();
    }

    async processQueue() {
        if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) return;

        this.queueLock = true;
        const nextSong = this.queue.shift();

        try {
            const process = ytdl.raw(
                nextSong,
                {
                    o: '-',
                    q: '',
                    // v: '',
                    f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                    r: '100K',
                    cookies: 'F:\\NEWPAPAKA\\repo\\Meatbag-Music-Bot\\cookies.txt',
                    // addHeader: 'LOGIN_INFO:AFmmF2swRAIgIbuQIwapdUb4Kbzr2Zs3DSGpTl_gaVzgfQlBPt2LEBMCIHoKroAOTCzOZj2-0kwWLuCVZT8m8E9hX3MlMC_ibVLS:QUQ3MjNmekZZU0YzWktkYU5mR2N3VXBTNDNUM2VQWWtIQ0g0RDB0WnljLTF5SG1jdnVweldSQmZhSWlHU0loWllhOVVaX2lsRThiR3ZaMGZwZTd5eDhVZ1dSOUY3RmlzRGFxN0pETFhqWl9zLTZmbXF6eUEwVzJYNkVtZWRWMWNiOEtsVjJFc1lQY0RXcjZFTlhIbjk4aUNNVjdpMjZIM0ZZTUZ3MUJlM05aV0QzRDdxS3QxM2NZ',
                },
                 { stdio: ['ignore', 'pipe', 'ignore'] },
            );
            const stream = process.stdout;
            const resource = createAudioResource(stream, { inputType: StreamType.WebmOpus });
            this.audioPlayer.play(resource);
            this.queueLock = false;
        } catch (error) {
            console.log(error);
            this.queueLock = false;
            await this.processQueue();
        }
    }
}

module.exports = {
    MusicSubscription
}