const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu, Interaction } = require('discord.js');
const playerController = require('./music/playerController');
const { Track } = require('./music/track');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Joins the voice channel and plays the song')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('URL or search request')
                .setRequired(true))
        .addNumberOption(option => 
            option.setName('amount')
                .setDescription('amount of search requests to give back, if not specified - the song will be played immediately')),
	/**
	 * 
	 * @param {Interaction} interaction 
	 */
    async execute(interaction) {
        const components = [];
		const resultMap = new Map();
		const number = interaction.options.getNumber('amount');
		// for (let i = 0; i < number; i++) {
		// 	const stuff = {
		// 		label: `Option ${i+1}`,
		// 		description: 'This is an option',
		// 		value: `${i+1}_option`
		// 	}
		// 	components.push(stuff)
		// }
		const string = interaction.options.getString('input');
		const track = await Track.getData(string, number);
		console.log(track);
        
        // const row = new MessageActionRow()
		// 	.addComponents(
		// 		new MessageSelectMenu()
		// 			.setCustomId('select')
		// 			.setPlaceholder('Nothing selected')
		// 			.addOptions(components),
		// 	);

		// await interaction.reply({ content: 'Pong!', components: [row] });

		// const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });
		// collector.on('collect', async i => {
		// 	console.log(i);
		// })

		// collector.on('end', async i => {
		// 	console.log('ended' + i);
		// })

    }
}