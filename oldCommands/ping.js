const { MeatbagMessage } = require("discord.js")


module.exports = {
    name: 'ping',
    aliases: ['ping'],
    description: 'Test ping command',
    longDescription: 'Shows bot ping',
    usage: ' ',
    
    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        await message.reply(`${message.client.ws.ping.toString()} ms`);
    }
}