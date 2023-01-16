// Require the necessary discord.js classes
import fs from "fs";
import path from "path";
import { Client, Events, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
	intents: [
	  GatewayIntentBits.Guilds,
	  GatewayIntentBits.GuildMessages,
	  GatewayIntentBits.MessageContent,
	],
  });

client.commands = new Collection();

const commandsPath = path.join(process.cwd(), "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  import(filePath)
    .then((module) => {
      client.commands.set(module.data.name, module);
    })
    .catch((error) => {
      console.error(error);
    });
}

const eventsPath = path.join(process.cwd(), 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = await import(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


client.login(process.env.BOT_TOKEN);

