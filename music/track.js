const ytdl = require('youtube-dl-exec');
const ytdlc = require('ytdl-core');
const { createAudioResource, StreamType } = require('@discordjs/voice');
const dotenv = require('dotenv');

dotenv.config()

const COOKIE = process.env.COOKIE;

class Track {
    constructor(url, title, thumbnail, duration) {
        this.url = url;
        this.title = title;
        this.thumbnail = thumbnail;
        this.duration = duration;
    }

    createAudioResourceW() {
        return new Promise((resolve, reject) => {
            const process = ytdl.raw(
                this.url,
                {
                    o: '-',
                    q: '',
                    // v: '',
                    f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                    r: '100K',
                    cookies: 'F:\\NEWPAPAKA\\repo\\Meatbag-Music-Bot\\storage\\cookies.txt',
                    noPlaylist: true,
                    // addHeader: 'LOGIN_INFO:AFmmF2swRAIgIbuQIwapdUb4Kbzr2Zs3DSGpTl_gaVzgfQlBPt2LEBMCIHoKroAOTCzOZj2-0kwWLuCVZT8m8E9hX3MlMC_ibVLS:QUQ3MjNmekZZU0YzWktkYU5mR2N3VXBTNDNUM2VQWWtIQ0g0RDB0WnljLTF5SG1jdnVweldSQmZhSWlHU0loWllhOVVaX2lsRThiR3ZaMGZwZTd5eDhVZ1dSOUY3RmlzRGFxN0pETFhqWl9zLTZmbXF6eUEwVzJYNkVtZWRWMWNiOEtsVjJFc1lQY0RXcjZFTlhIbjk4aUNNVjdpMjZIM0ZZTUZ3MUJlM05aV0QzRDdxS3QxM2NZ',
                },
                 { stdio: ['ignore', 'pipe', 'ignore'] },
            );

            // const stream = ytdlc(this.url, {
            //         highWaterMark: 1024*1024*32,
            //         quality: '251',
            //         requestOptions: {
            //             headers: {
            //                 cookie: COOKIE,
            //             }
            //         }
            // })
            if (!process.stdout) {
                reject(new Error('no stdout'));
                console.log('stream is fucked');
                if (!process.killed) process.kill();
                return;
            }
            const stream = process.stdout;
            // if (!stream) {
            //     reject(new Error('no stdout'));
            //     console.log('stream is fucked');
            //     if (!stream.destroyed) stream.destroy();
            //     return;
            // }
            // stream.once('error', (error) => {reject(new Error(error));})

            // stream.once('readable', () => {
            //     resolve(createAudioResource(stream, { inputType: StreamType.WebmOpus }));
            // })
            process.once('error', (error) => {
                reject(new Error(error));
            })

            stream.once('error', (error) => {
                reject(new Error(error));
            })

            process.once('spawn', () => {
                resolve(createAudioResource(stream, { inputType: StreamType.WebmOpus }));
            });
        })
    }
}

module.exports = {
    Track
}