const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu, Interaction } = require('discord.js');
const playerController = require('../commands/music/playerController');
const { Track } = require('../commands/music/track');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Joins the voice channel and plays the song')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('URL or search request')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('amount of search requests to give back, if not specified - the song will be played immediately')),
	/**
	 * 
	 * @param {Interaction} interaction 
	 */
    async execute(interaction) {
		await interaction.deferReply();
        const components = [];
		const resultMap = new Map();
		const number = interaction.options.getInteger('amount');
		if (number >= 10) return await interaction.editReply('Are you insane? Please select less then 10 options')
		// for (let i = 0; i < number; i++) {
		// 	const stuff = {
		// 		label: `Option ${i+1}`,
		// 		description: 'This is an option',
		// 		value: `${i+1}_option`
		// 	}
		// 	components.push(stuff)
		// }
		const string = interaction.options.getString('input');
		const tracks = await Track.getMultipleData(string, number);
		// console.log(tracks);
        tracks.items.forEach((track, i) => {
			const toMap = `${i+1}_option`
			const stuff = {
				label: 'Track',
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

		await interaction.editReply({ content: 'Pong!', components: [row] });

		const collector = interaction.channel.createMessageComponentCollector({ time: 30*1000 });
		let isReplied = false;
		collector.on('collect', async i => {
			const trackData = resultMap.get(i.values[0])
			const track = new Track(trackData.url, trackData.title, trackData.thumbnails[0].url)
			isReplied = true;
			await interaction.editReply({ content: `You made your choice\n${track.title}`, components: [] });
		})

		collector.on('end', async _ => {
			if (!isReplied) await interaction.editReply({ content: 'You ran out of time', components: [] });
		})

    }
}