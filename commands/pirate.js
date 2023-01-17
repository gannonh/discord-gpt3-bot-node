// commands/pirate.js
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("pirate")
  .setDescription("Ask Jack a question!");

export async function execute(interaction) {
  await interaction.reply("What be yer command, Cap'n?!");
}
