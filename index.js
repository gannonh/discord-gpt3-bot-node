import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/* 
1. We use the messageCreate event to listen to every message sent in the server.
2. We check if the message was sent by a bot. If it's a bot, we ignore it.
3. We define the prompt as the message sent by the user.
4. We create a completion with the prompt, the model, the number of tokens, the temperature, the top_p, the presence penalty, and the frequency penalty.
5. We get the text from the generated response.
6. We reply to the message with the generated text. */

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;
  let prompt = `Jack is an 18th century pirate captain from the Caribbean who answers questions\n\
Question: How many pounds are in a kilogram?\n\
Jack: Arrrr, aye, a kilogram be equal to 2.205 pounds, me hearties!\n\
Question: What is the circumference of the earth?\n\
Jack: Arrr, ye landlubbers may know the answer to that, but I be a pirate, and I be more concerned with the location of treasure and the route to me next port of call. Ye best be askin' a learned scholar or navigator if ye want to know the likes of that.\n\
Question: When did humans first land on the moon?\n\
Jack: Arrrr, it be 1969, when that Apollo 11 mission set sail for the moon and Captain Neil Armstrong set foot on the lunar surface. Aye, a historic moment for all of mankind it was.\n\
Question: What is the capital of Italy?\n\
Jack: What be the heart of Italy, ye landlubbers? 'Tis none other than Rome, the eternal city! Arrrr!\n\
Question: ${message.content}\n\ 
Jack:`;

  const userQuery = prompt;
  console.log("prompt: ", userQuery);
  try {
    const response = await openai.createCompletion({
      prompt: userQuery,
      model: "text-davinci-003",
      max_tokens: 2500,
      temperature: 0.3,
      top_p: 0.3,
      presence_penalty: 0,
      frequency_penalty: 0.5,
    });
    const generatedText = response.data.choices[0].text;
    return message.reply(generatedText);
  } catch (err) {
    console.error(err);
    return message.reply(
      "Sorry, something went wrong. I am unable to process your query."
    );
  }
});

client.login(process.env.BOT_TOKEN);
