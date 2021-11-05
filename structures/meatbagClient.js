const { Client, Collection } = require('discord.js');
const fs = require('fs');
const { MusicPlayer } = require('../music/musicPlayer');


/**
 * @type {import('./meatbagClient').MeatbagClient}
 */
class MeatbagClient extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection();
        this.oldCommands = new Collection();
        this.prefixes = new Collection();
        this.musicPlayer = new MusicPlayer();
    }
    
    syncPrefixes() {
        let madeChanges = false;
        this.guilds.cache.forEach(guild => {
            if (!this.prefixes.has(guild.id)) {
                this.prefixes.set(guild.id, '?');
                madeChanges = true;
            }
        });

        this.prefixes.forEach((_, key) => {
            if (!this.guilds.cache.has(key)) {
                this.prefixes.delete(key);
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