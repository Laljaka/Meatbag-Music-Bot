module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        if (interaction.isCommand()) {

            // console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch(error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
        // if (interaction.isButton()) {
        //     if (interaction.customId === 'poggers') {
        //         await interaction.reply({ content: 'You clicked Poggers', ephemeral: true});
        //     } else if (interaction.customId === 'loggers') {
        //         await interaction.reply({ content: 'You clicked Loggers', ephemeral: true});
        //     }
        // }
        if (interaction.isContextMenu()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch(error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing context menu!', ephemeral: true });
            }
        }
	},
};