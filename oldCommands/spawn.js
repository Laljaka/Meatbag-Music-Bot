const { MeatbagMessage, MessageActionRow, MessageButton } = require("discord.js")


module.exports = {
    name: 'spawn',
    aliases: ['spawn', 'player'],
    description: 'Spawns a player controller',
    longDescription: 'Spawns a player controller',
    usage: ' ',

    /**
     * 
     * @param { MeatbagMessage } message 
     */
    async execute(message) {
        if (message.member.id !== '664704886444654613') return; // TESTING
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('play')
                    .setLabel('\u25B6')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('skip')
                    .setLabel('\u25B6\u25B6')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('stop')
                    .setLabel('\u23F9')
                    .setStyle('DANGER')
            );

        // const thread = await message.startThread({
        //     name: 'Player controller',
        //     autoArchiveDuration: 60,
        //     reason: 'Executing player manager command'
        // });
        // await thread.members.add(message.member.id);
        // await thread.setLocked(true);

        const msg = await message.channel.send({ content: 'Player Manager', components: [row] });

        const filter = i => i.message.id === msg.id && i.user.id === message.member.id;
        const collector = msg.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            if (i.customId === 'play') i.update('play');
            if (i.customId === 'skip') {
                i.update('skip');
                await message.client.musicPlayer.skip(message);
            }
            if (i.customId === 'stop') collector.stop();
        })

        collector.once('end', async i => {
            await msg.delete();
            await thread.delete();
        })
    }
}