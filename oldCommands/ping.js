const { Message } = require("discord.js")


module.exports = {
    name: 'ping',

    /**
     * 
     * @param { Message } message 
     */
    async execute(message) {
        message.reply(`${message.client.ws.ping.toString()} ms`);
    }
}