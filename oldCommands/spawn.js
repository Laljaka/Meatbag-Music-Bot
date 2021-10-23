const { Message, MessageActionRow, MessageButton } = require("discord.js")


module.exports = {
    name: 'spawn',

    /**
     * 
     * @param { Message } message 
     */
    async execute(message) {
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

        const thread = await message.startThread({
            name: 'Player controller',
            autoArchiveDuration: 60,
            reason: 'Executing player manager command'
        });
        await thread.members.add(message.member.id);
        await thread.setLocked(true);

        const msg = await thread.send({ content: 'Player Manager', components: [row] });

        const filter = i => i.message.id === msg.id && i.user.id === message.member.id;
        const collector = msg.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            if (i.customId === 'play') i.update('play');
            if (i.customId === 'skip') i.update('skip');
            if (i.customId === 'stop') collector.stop();
        })

        collector.once('end', async i => {
            await msg.delete();
            await thread.delete();
        })
    }
}