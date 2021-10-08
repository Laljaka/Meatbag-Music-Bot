const { SlashCommandBuilder } = require("@discordjs/builders");
const ytdl = require('youtube-dl-exec');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Displays test message'),
    async execute(interaction) {
        await interaction.reply('Test message')
        const process = ytdl.raw(
            'https://www.youtube.com/watch?v=62ezXENOuIA',
            {
                o: '-',
                q: '',
                // v: '',
                f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                r: '10K',
                cookies: 'F:\\NEWPAPAKA\\repo\\Meatbag-Music-Bot\\cookies.txt',
                noPlaylist: true,
                // printJson: true,
                getTitle: true,
                getUrl: true,
                // addHeader: 'LOGIN_INFO:AFmmF2swRAIgIbuQIwapdUb4Kbzr2Zs3DSGpTl_gaVzgfQlBPt2LEBMCIHoKroAOTCzOZj2-0kwWLuCVZT8m8E9hX3MlMC_ibVLS:QUQ3MjNmekZZU0YzWktkYU5mR2N3VXBTNDNUM2VQWWtIQ0g0RDB0WnljLTF5SG1jdnVweldSQmZhSWlHU0loWllhOVVaX2lsRThiR3ZaMGZwZTd5eDhVZ1dSOUY3RmlzRGFxN0pETFhqWl9zLTZmbXF6eUEwVzJYNkVtZWRWMWNiOEtsVjJFc1lQY0RXcjZFTlhIbjk4aUNNVjdpMjZIM0ZZTUZ3MUJlM05aV0QzRDdxS3QxM2NZ',
            }, { stdio: ['ignore', 'pipe', 'pipe'] },
        );
        // process.stderr.on('end', (data) => {
        //     console.log(data);
        // })
        // process.stderr.pipe(fs.createWriteStream('stdin.txt'))
        // global.serverLog = "";
        // process.stderr.write = (function(write) {
        //     return function(string, encoding, fileDescriptor) {
        //         global.serverLog += string;
        //         write.apply(process.stderr, arguments);
        //     };
        // })(process.stderr.write);
        let result;
        process.stderr.on('data', function(chunk) {
            result += chunk;
            console.log('chunk:' + chunk);
        });
        process.stderr.on('end', () => {
            console.log('result' + result);
        })
    }
}