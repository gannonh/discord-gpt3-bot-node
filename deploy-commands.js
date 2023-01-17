// deploy-commands.js
import dotenv from "dotenv";
import { REST, Routes } from "discord.js";
import fs from "fs";

// const { clientId, guildId, token } = require('./config.json');
dotenv.config();

const clientId = process.env.DIS_CLIENT_ID;
const guildId = process.env.DIS_GUILD_ID;
const token = process.env.BOT_TOKEN;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const { data } = await import(`./commands/${file}`);
  commands.push(data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      // Routes.applicationCommands(clientId), <---------------------------------------------------- for global commands

      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();


