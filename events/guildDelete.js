const fs = require('fs').promises;
const { Guild } = require('discord.js');

module.exports = {
    name: 'guildDelete',

    /**
     * 
     * @param { Guild } guild 
     */
    async execute(guild) {
        guild.client.prefixes.delete(guild.id);
        const data = JSON.stringify(Object.fromEntries(guild.client.prefixes), null, 4);
        await fs.writeFile('./storage/prefixes.json', data);
    }
};