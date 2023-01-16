import { Events } from 'discord.js';

export const name = Events.InteractionCreate;
export async function execute(interaction) {
    if (!interaction.isChatInputCommand())
        return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
        console.log(`Executed ${interaction.commandName}`);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
    }
}