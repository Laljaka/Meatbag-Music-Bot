const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require('ytdl-core');
const fs = require('fs');
const dotenv = require('dotenv');
const yts = require('yt-search');
const ytsrAAAAAAA = require('ytsr');
const ytsbetter = require('youtube-search-without-api-key');

dotenv.config();

const COOKIE = process.env.COOKIE;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Displays test message'),
    async execute(interaction) {
        await interaction.reply('Test message')
    //     const process = await ytdl.getInfo(
    //         'ytsearch:son of odin',
    //         {
    //             // highWaterMark: 1024*1024*32,
    //             requestOptions: {
    //                 headers: {
    //                     cookie: COOKIE,
    //                 }
    //             }
    //         },
    //     );
    //     // process.on('info', (data) => {
    //     //     console.log(data.videoDetails.title);
    //     //     console.log(data.videoDetails.video_url);
    //     //     console.log(data.videoDetails.thumbnails[3].url);
    //     // })
    //    console.log(process.videoDetails.title)
    //     // process.pipe(fs.createWriteStream('song.mp3'));
        console.time('filters');
        const filters = await ytsrAAAAAAA.getFilters('ногу свело молчание ягнят');
        const filter = filters.get('Type').get('Video');
        console.timeEnd('filters');
        console.time('request');
        let videos = await ytsrAAAAAAA(filter.url, { limit: 1 });
        // let needed;
        console.timeEnd('request');
        console.log(videos);
        // videos.some(video => {
        //     if (video.type === 'video') {
        //         needed = video;
        //         return true;
        //     }            
        // });
        // console.log(typeof videos);

        // console.time('loop');
        // for (let video of videos.items) {
        //     if (video.type === 'video') {
        //         needed = video;
        //         break;
        //     }
        // }
        // console.timeEnd('loop');
        // console.log(needed);

        // const videos = r.videos.slice( 0, 1 )
        // videos.forEach( function ( v ) {
        //     const views = String( v.views ).padStart( 10, ' ' )
        //     console.log( `${ views } | ${ v.title } (${ v.timestamp }) | ${ v.author.name }` )
        // } )
        // console.log(videos);
        // videos.forEach((v) => {
        //     console.log(v);
        //     // console.log(v.url);
        //     // console.log(v.snippet.thumbnails.url);
        //     console.log('------------------------------------------------------')
        // })
        // console.log(videos.items[0].thumbnails);
        // console.log(videos.items);
    }
}