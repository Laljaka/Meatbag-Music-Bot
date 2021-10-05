module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        // client.guilds.cache.get('290888160714686464').commands.set(commands);
        console.log(`Ready as ${client.user.tag}`);
    },
};