import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('options-info')
	.setDescription('Information about the options provided.')
	.addStringOption(option => option.setName('input').setDescription('The input to echo back'));
export async function execute(interaction) {
	const value = interaction.options.getString('input');
	if (value)
		return interaction.reply(`The options value is: \`${value}\``);
	return interaction.reply('No option was provided!');
}
