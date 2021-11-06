const { MeatbagMessage, Permissions, ApplicationCommandPermissionsManager } = require("discord.js");
const fs = require('fs').promises;


module.exports = {
    name: 'deploy',
    aliases: ['deploy'],
    description: 'Deploys slash commands to the guild',
    longDescription: 'Deploys slash commands to the guild, requires administrator privilages',
    usage: ' ',
    //add checks for double deployment and permissions
    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;
        const reply = await message.reply(`This will activate slash commands in your guild.\nPlease follow this link and grant required permissions to the bot:\nhttps://discord.com/api/oauth2/authorize?client_id=801901284721819709&permissions=3459136&scope=bot%20applications.commands\n\nReact with \uD83D\uDFE9 when you gave the bot required permissions.\nReact with \uD83D\uDFE5 if you want to stop the process.`);
        await reply.react('\uD83D\uDFE9');
        await reply.react('\uD83D\uDFE5');
        const collector = reply.createReactionCollector({ time: 120*1000 })

        let isReplied = false;
        let hasInteracted = false;
        collector.on('collect', async (reaction, user) => {
            if (message.author.id === user.id && hasInteracted === false) {
                hasInteracted = true;
                if (reaction.emoji.name == '\uD83D\uDFE9') {
                    const array = [];
                    message.client.commands.forEach((value, _) => {
                        array.push(value.data.toJSON());
                    });
                    try {
                        await message.guild.commands.set(array);
                    } catch(err) {
                        await message.channel.send(`There was an error executing this command\n${err}`);
                        isReplied = true;
                        await reply.delete();
                        return;
                    }
                    isReplied = true;
                    await reply.delete();
                    await message.channel.send(`Succesfully deployed slash commands to the guild!`);
                    
                    const raw = await fs.readFile('./storage/deployedGuilds.json');
                    const data = JSON.parse(raw);
                    if (!data.includes(message.guildId)) data.push(message.guildId);
                    const exportData = JSON.stringify(data, null, 4);
                    await fs.writeFile('./storage/deployedGuilds.json', exportData);
                } else if (reaction.emoji.name == '\uD83D\uDFE5') {
                    isReplied = true;
                    await reply.delete();
                    await message.channel.send('Aborting');
                }
            }
        });
        collector.once('end', async _ => {
            if (isReplied) return;
            await reply.delete();
            await message.channel.send('You ran out of time. Amusing.');
        });
    }
}