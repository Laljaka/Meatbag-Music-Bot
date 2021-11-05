const ytdl = require('youtube-dl-exec');
const ytdlc = require('ytdl-core');
const { createAudioResource, StreamType } = require('@discordjs/voice');
const { getTrackData } = require('../utils/apis');
const dotenv = require('dotenv');

dotenv.config()

// const COOKIE = process.env.COOKIE;

/**
 * @type {import('./track').Track}
 */
class Track {
    constructor(url, title, thumbnail, duration) {
        this.url = url;
        this.title = title;
        this.thumbnail = thumbnail;
        this.duration = duration;
    }

    async fetchMissingData() {
        const data = await getTrackData(this.title);
        this.url = data.items[0].url;
        this.title = data.items[0].title;
        this.thumbnail = data.items[0].thumbnails[0].url;
        this.duration = data.items[0].duration;
        console.log('fetched missing data')
    }

    createAudioResourceW() {
        return new Promise((resolve, reject) => {
            // const process = ytdl.raw(
            //     this.url,
            //     {
            //         o: '-',
            //         // q: '',
            //         v: '',
            //         f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
            //         r: '100K',
            //         cookies: 'F:\\NEWPAPAKA\\repo\\Meatbag-Music-Bot\\storage\\cookies.txt',
            //         noPlaylist: true,
            //         // addHeader: 'LOGIN_INFO:AFmmF2swRAIgIbuQIwapdUb4Kbzr2Zs3DSGpTl_gaVzgfQlBPt2LEBMCIHoKroAOTCzOZj2-0kwWLuCVZT8m8E9hX3MlMC_ibVLS:QUQ3MjNmekZZU0YzWktkYU5mR2N3VXBTNDNUM2VQWWtIQ0g0RDB0WnljLTF5SG1jdnVweldSQmZhSWlHU0loWllhOVVaX2lsRThiR3ZaMGZwZTd5eDhVZ1dSOUY3RmlzRGFxN0pETFhqWl9zLTZmbXF6eUEwVzJYNkVtZWRWMWNiOEtsVjJFc1lQY0RXcjZFTlhIbjk4aUNNVjdpMjZIM0ZZTUZ3MUJlM05aV0QzRDdxS3QxM2NZ',
            //     },
            //     { stdio: ['ignore', 'pipe', 'pipe'] },
            // );

            // if (!process.stdout) {
            //     console.log('stream is fucked1');
            //     reject(new Error('no stdout'));
            //     if (!process.killed) process.kill();
            //     return;
            // }
            // const stream = process.stdout;

            // process.once('spawn', () => {
            //     resolve(createAudioResource(stream, { inputType: StreamType.WebmOpus }));
            //     // process.stderr.pipe(fs.createWriteStream('stderr.txt'));
            // });

            //-------------------------------------------------------------------------------

            const stream = ytdlc(this.url, {
                highWaterMark: 1024*1024*2, //4
                // format: 'audioonly',
                filter: 'audioonly',
                quality: '251',
                dlChunkSize: 0,
                requestOptions: {
                    headers: {
                        cookie: process.env.COOKIE,
                    }
                }
            });

            if (!stream) {
                reject(new Error('no stdout'));
                console.log('stream is fucked');
                if (!stream.destroyed) stream.destroy();
                return;
            }
            stream.once('error', (error) => {
                // console.log(`Oopsie ${error}`);
                reject(error);
            })

            stream.once('readable', () => {
                resolve(createAudioResource(stream, { inputType: StreamType.WebmOpus }));
            })

            //---------------------------------------------------------

            // const child = spawn('node', ['../streamytdl.js'], {
            //     stdio: ['pipe', 'pipe', 'pipe']
            // });
            // const stream = child.stdout;
            // child.stdout.pipe(process.stdout);
            // stream.on('readable', () => {
            //     resolve(createAudioResource(stream, { inputType: StreamType.WebmOpus }));
            // })
        })
    }
}

module.exports = {
    Track
}