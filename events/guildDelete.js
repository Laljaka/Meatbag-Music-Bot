const fs = require('fs').promises;
const { Guild } = require('discord.js');

module.exports = {
    name: 'guildDelete',

    /**
     * 
     * @param { Guild } guild 
     */
    async execute(guild) {
        {
            guild.client.prefixes.delete(guild.id);
            const data = JSON.stringify(Object.fromEntries(guild.client.prefixes), null, 4);
            await fs.writeFile('./storage/prefixes.json', data);
        }

        {
            const raw = await fs.readFile('./storage/deployedGuilds.json');
            const data = JSON.parse(raw);
            if (data.includes(guild.id)) {
                const index = data.indexOf(guild.id);
                data.splice(index, 1);
                const exportData = JSON.stringify(data, null, 4);
                await fs.writeFile('./storage/deployedGuilds.json', exportData);
            }
        }
    }
};