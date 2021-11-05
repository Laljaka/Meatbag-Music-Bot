const fs = require('fs').promises;
const { Guild } = require('discord.js');

module.exports = {
    name: 'guildCreate',

    /**
     * 
     * @param { Guild } guild 
     */
    async execute(guild) {
        guild.client.prefixes.set(guild.id, '?');
        const data = JSON.stringify(Object.fromEntries(guild.client.prefixes), null, 4);
        await fs.writeFile('./storage/prefixes.json', data);
    }
};