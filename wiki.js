/* 
1. We import the dotenv module, which allows us to use environment variables in our code.
2. We import the Client class from the discord.js module, which allows us to interact with the Discord API.
3. We import the Configuration and OpenAIApi classes from the openai module, which allows us to interact with the OpenAI API. 
*/

import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

/* 
1. Finds the .env file in the root directory of the project
2. Parses the file and assigns the values to the process.env object
3. The values can now be accessed in the project through process.env */

dotenv.config();

/* 
1. Imports the Client class from the library
2. Creates a new instance of the Client class, passing it an object with the intents
   we wish to enable. We can also pass other options, such as a token, but for now
   we'll just use the intents. */

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

// setup a corpus of sources for the bot to consult
const sources = [
  {
    title: "Machine learning", 
    source: "https://en.wikipedia.org/wiki/Machine_learning"
  },
  {
    title: "Artificial intelligence",
    source: "https://en.wikipedia.org/wiki/Artificial_intelligence"
  },
  {
    title: "Deep learning",
    source: "https://en.wikipedia.org/wiki/Deep_learning"
  },
  {
    title: "Natural language processing",
    source: "https://en.wikipedia.org/wiki/Natural_language_processing"
  },
  {
    title: "Reinforcement learning",
    source: "https://en.wikipedia.org/wiki/Reinforcement_learning"
  },
  {
    title: "Computer vision",
    source: "https://en.wikipedia.org/wiki/Computer_vision"
  },
  {
    title: "Data science",
    source: "https://en.wikipedia.org/wiki/Data_science"
  }
]

/* 
1. Checks if the message is from a bot.
2. Creates a completion using the user's query as the prompt.
3. Checks if the generated text mentions any of the sources in the corpus.
4. Replies to the user with the generated text and source if the bot's response mentions a source.
5. Replies to the user with the generated text if the bot's response does not mention a source. */

client.on("messageCreate", async function(message) {
  if (message.author.bot) return;
  const userQuery = message.content;
  try {
    const response = await openai.createCompletion({
      prompt: userQuery,
      model: "text-davinci-002",
      max_tokens: 60,
      temperature: 0.3,
      top_p: 0.3,
      presence_penalty: 0,
      frequency_penalty: 0.5,
    });
    const generatedText = response.data.choices[0].text;
    // check if the bot's response mentions any of the sources in the corpus
    for (let i = 0; i < sources.length; i++) {
      if (generatedText.includes(sources[i].title)) {
        return message.reply(`${generatedText} \n Source: ${sources[i].source}`);
      }
    }
    // print message to console
    console.log("Success - Generated Text: ", generatedText);
    return message.reply(generatedText);
  } catch (err) {
    console.error(err);
    return message.reply("Sorry, something went wrong. I am unable to process your query.");
  }
});

// login to Discord with your app's token
client.login(process.env.BOT_TOKEN);
