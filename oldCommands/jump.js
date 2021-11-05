const { MeatbagMessage } = require("discord.js")

module.exports = {
    name: 'jump',
    aliases: ['jump', 'skip_to'],
    description: 'Jumps to specified position in the queue',
    longDescription: 'Jumps to specified position in the queue, skipping everything in it\'s path',
    usage: '        [position]',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message, args) {
        const number = parseInt(args.shift(), 10);
        if (!number) return await message.reply({ content: 'Not a number!', allowedMentions: { repliedUser: false } })
        await message.client.musicPlayer.jump(message, number);
    }
}