const { MeatbagMessage } = require("discord.js");
const fs = require('fs').promises;


module.exports = {
    name: 'change_prefix',
    aliases: ['change_prefix', 'prefix'],
    description: 'Changes prefix for your guild',
    longDescription: 'Changes prefix for your guild',
    usage: '        [new prefix]',
    
    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message, args) {
        const newPrefix = args.shift();
        if (!newPrefix) return;
        message.client.prefixes.set(message.guild.id, newPrefix);
        const data = JSON.stringify(Object.fromEntries(message.guild.client.prefixes), null, 4);
        await fs.writeFile('./storage/prefixes.json', data);
        await message.reply(`Changed prefix to ${newPrefix}`);
    }
}