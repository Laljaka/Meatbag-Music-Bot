const { SlashCommandBuilder } = require("@discordjs/builders");
const pjson = require('./../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('version')
        .setDescription('Displays version'),
    async execute(interaction) {
        await interaction.reply(`Current version is ${pjson.version}\n Made by ${pjson.author}`)
    }
}