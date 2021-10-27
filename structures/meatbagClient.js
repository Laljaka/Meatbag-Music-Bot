const { Client, Collection } = require('discord.js');


/**
 * @type {import('./meatbagClient').MeatbagClient}
 */
class MeatbagClient extends Client {
    constructor(options) {
        super(options);
        this.subscriptions = new Collection();
        this.commands = new Collection();
        this.oldCommands = new Collection();
        this.prefixes = new Collection();
    }

    syncPrefixes() {
        let madeChanges = false;
        this.guilds.cache.forEach(guild => {
            if (!this.prefixes.has(guild.id)) {
                this.prefixes.set(guild.id, '?');
                madeChanges = true;
            }
        });

        if (madeChanges) {
            const data = JSON.stringify(Object.fromEntries(this.prefixes), null, 4);
            fs.writeFileSync('./storage/prefixes.json', data);
        }
    }
}

module.exports = {
    MeatbagClient
}