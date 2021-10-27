const { MeatbagMessage } = require("discord.js")


module.exports = {
    name: 'ping',
    aliases: ['ping'],
    description: 'Test ping command',
    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await message.reply(`${message.client.ws.ping.toString()} ms`);
    }
}