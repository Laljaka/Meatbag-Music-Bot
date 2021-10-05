module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
        if (interaction.isCommand()) {

            // console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch(error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
        if (interaction.isButton()) {
            if (interaction.customId === 'poggers') {
                await interaction.update({ content: 'A button was clicked', components: [] });
                // await interaction.delete();
            }
            // console.log(interaction);
        }
        if (interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch(error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
	},
};