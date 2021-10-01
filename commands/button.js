const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('Button test'),
    async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('poggers')
                    .setLabel('Poggers')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('loggers')
                    .setLabel('Loggers')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('milkers')
                    .setLabel('Big mommy milkers')
                    .setStyle('SECONDARY')
                    .setDisabled(true),
            );
        
        await interaction.reply({ content: 'Here are your buttons', components: [row] });
    }
}