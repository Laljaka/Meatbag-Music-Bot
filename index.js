const fs = require('fs');
const { Intents } = require('discord.js');
const dotenv = require('dotenv');
const pjson = require('./package.json');
const { MeatbagClient } = require('./structures/meatbagClient');

dotenv.config();

const client = new MeatbagClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], presence: { status: 'idle', activities: [{name: 'my sanity crumble', type: 'WATCHING'}] }});

const raw = fs.readFileSync('./storage/prefixes.json');
const data = JSON.parse(raw);
for (const [key, value] of Object.entries(data)) {
    client.prefixes.set(key, value);
}


// client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const contextFiles = fs.readdirSync('./context').filter(file => file.endsWith('.js'));
const oldCommandFiles = fs.readdirSync('./oldCommands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

for (const file of contextFiles) {
    const context = require(`./context/${file}`);
    client.commands.set(context.data.name, context);
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

for(const file of oldCommandFiles) {
    const oldCommand = require(`./oldCommands/${file}`)
    client.oldCommands.set(oldCommand.name, oldCommand)
    // client.aliases.set(oldCommand.name, oldCommand)
}

client.login(process.env.TOKEN);