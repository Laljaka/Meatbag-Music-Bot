const { SlashCommandBuilder } = require("@discordjs/builders");
const { getMultipleTrackData } = require('../utils/apis.js');
const { MeatbagMessage, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { Track } = require('../music/track');
const { isUrl } = require('../utils/regexp');
const playerController = require('../music/playerController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Searches for a song with multiple options to choose from')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Search request')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Search requests to give back (max 10)')
                .setRequired(true)),

    /**
     * 
     * @param { MeatbagMessage } interaction 
     * @returns 
     */
    async execute(interaction) {
        if (!interaction.member.voice.channelId) return await interaction.reply('You need to be in the voice channel to use this command');
        const number = interaction.options.getInteger('amount');
        const string = interaction.options.getString('song');
        if (isUrl(string)) return await interaction.reply({ content: 'Links ar not allowed for this command, only search requests', ephemeral: true });
        if (number <= 0) return await interaction.reply({ content: 'Invalid number', ephemeral: true });
        else if (number > 10) return await interaction.reply({ content: `Yeah, try ${number*10} next time, that will be easy to read.`, ephemeral: true });
        else {
            await interaction.deferReply();
            const components = [];
		    const resultMap = new Map();
            const tracks = await getMultipleTrackData(string, number);

            tracks.items.forEach((track, i) => {
                const toMap = `${i+1}_option`
                const stuff = {
                    label: `Track ${track.duration}`,
                    description: track.title,
                    value: toMap
                }
                components.push(stuff);
                resultMap.set(toMap, track);
            })

            const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions(components),
			);

		    await interaction.editReply({ content: '** **', components: [row] });

            const collector = interaction.channel.createMessageComponentCollector({ time: 30*1000 });
            let isReplied = false;
            collector.on('collect', async i => {
                if (i.user.id === interaction.user.id) {
                    const trackData = resultMap.get(i.values[0])
                    const final = {
                        name: `1 Track`,
                        thumbnail: trackData.thumbnails[0].url,
                        title: trackData.title,
                        url: trackData.url,
                        track: [new Track(trackData.url, trackData.title, trackData.thumbnails[0].url, trackData.duration)]
                    }
                    isReplied = true;
                    // await interaction.deleteReply();
                    await playerController.run(final, interaction);
                }
            })
    
            collector.on('end', async _ => {
                if (!isReplied) await interaction.editReply({ content: 'You ran out of time', components: [] });
            })
        }
    }
}