const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('new')
        .setDescription('new'),
    async execute(interaction) {
        await interaction.reply('new')
    }
}