const fs = require('fs');
const { MeatbagClient } = require('../structures/meatbagClient');

module.exports = {
    name: 'ready',
    once: true,

    /**
     * 
     * @param { MeatbagClient } client 
     */
    execute(client) {
        // client.guilds.cache.get('290888160714686464').commands.set(commands);

        // const rawdata = fs.readFileSync('../storage/prefixes.json');

        // const prefixes = {};
        // client.guilds.cache.forEach(guild => {

        // });
        // fs.writeFileSync()
        client.syncPrefixes();
        console.log(`Ready as ${client.user.tag}`);

    },
};