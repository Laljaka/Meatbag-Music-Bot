const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require('dotenv');
const pjson = require('./package.json');

dotenv.config();


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

const client = new MeatbagClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

const raw = fs.readFileSync('./storage/prefixes.json');
const data = JSON.parse(raw);
for (const [key, value] of Object.entries(data)) {
    client.prefixes.set(key, value);
}


// client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const contextFiles = fs.readdirSync('./context').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

for (const file of contextFiles) {
    const context = require(`./context/${file}`);
    client.commands.set(context.name, context);
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(process.env.TOKEN);