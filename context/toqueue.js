module.exports = {
    name: 'Add to queue',
    type: 3,
    async execute(interaction) {
        await interaction.reply('Added')
    }
}