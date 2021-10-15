const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');

dotenv.config()

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const contextFiles = fs.readdirSync('./context').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

for (const file of contextFiles) {
    const context = require(`./context/${file}`);
    commands.push(context);
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
// potats: 734821274555121704, dev-guild: 290888160714686464
rest.put(Routes.applicationGuildCommands('796650236507324467', '888131948009128007'), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
